import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

test('refresh commits hand their exact pushed SHA to deployment and unchanged content does not deploy', () => {
  const workflow = readFileSync('.github/workflows/refresh-content.yml', 'utf8');
  assert.match(workflow, /cron: '17 6 \* \* \*'/);
  assert.match(workflow, /sha: \$\{\{ steps\.changed\.outputs\.sha \}\}/);
  assert.match(workflow, /ref: \$\{\{ needs\.refresh\.outputs\.sha \}\}/);
  assert.match(
    workflow,
    /if: needs\.refresh\.outputs\.changed == 'true' && vars\.AZURE_SWA_ENABLED == 'true'/,
  );
  assert.match(workflow, /environment: preview/);
  const block = workflow.match(
    /name: Commit only normalized content changes[\s\S]*?run: \|\r?\n([\s\S]*?)\r?\n {2}deploy:/,
  )?.[1];
  assert.ok(block, 'the actual commit step is exercised, not a copied implementation');
  const script = block.replace(/^ {10}/gm, '');
  const bash =
    process.platform === 'win32'
      ? resolve(
          execFileSync('git', ['--exec-path'], { encoding: 'utf8' }).trim(),
          '..',
          '..',
          '..',
          'bin',
          'bash.exe',
        )
      : 'bash';
  const directory = mkdtempSync(join(tmpdir(), 'elbruno-refresh-test-'));
  const work = join(directory, 'work');
  const remote = join(directory, 'remote.git');
  const output = join(directory, 'output');
  const git = (...args: string[]) =>
    execFileSync('git', args, {
      cwd: work,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  try {
    mkdirSync(work);
    git('init', '--initial-branch=main');
    git('config', 'user.name', 'Refresh Test');
    git('config', 'user.email', 'refresh@example.invalid');
    git('config', 'commit.gpgsign', 'false');
    git('init', '--bare', remote);
    git('remote', 'add', 'origin', remote);
    const snapshot = join(work, 'src', 'data', 'feeds', 'snapshot.json');
    mkdirSync(join(work, 'src', 'data', 'feeds'), { recursive: true });
    mkdirSync(join(work, 'src', 'data', 'nuget'));
    writeFileSync(join(work, 'src', 'data', 'nuget', 'snapshot.json'), '{"packages":[]}\n');
    writeFileSync(snapshot, '{"episode":"old"}\n');
    git('add', '.');
    git('commit', '-m', 'Initial snapshot');
    git('push', '-u', 'origin', 'main');
    const trigger = git('rev-parse', 'HEAD');
    writeFileSync(snapshot, '{"episode":"latest"}\n');
    writeFileSync(output, '');
    const run = () =>
      execFileSync(bash, ['-e', '-c', script], {
        cwd: work,
        env: { ...process.env, GITHUB_OUTPUT: output.replaceAll('\\', '/') },
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    run();
    const outputs = readFileSync(output, 'utf8');
    const sha = outputs.match(/^sha=([a-f0-9]{40})$/m)?.[1];
    assert.ok(sha);
    assert.match(outputs, /^changed=true$/m);
    assert.notEqual(sha, trigger);
    assert.equal(git('rev-parse', 'origin/main'), sha);
    assert.equal(git('show', `${sha}:src/data/feeds/snapshot.json`), '{"episode":"latest"}');
    writeFileSync(output, '');
    run();
    assert.equal(readFileSync(output, 'utf8'), '');
    assert.equal(git('rev-parse', 'HEAD'), sha);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
