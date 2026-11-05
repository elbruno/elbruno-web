import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isExternalBlog } from '../src/lib/links';
import { selectRepositories } from '../src/lib/repositories';
import { curatedRepositories, featuredProjects, projects } from '../src/data/profile';

test('only absolute links to the WordPress blog use the blog new-tab policy', () => {
  for (const url of [
    'https://elbruno.com',
    'https://elbruno.com/2026/11/04/article/',
    'https://www.elbruno.com/',
    'http://elbruno.wordpress.com/article/',
  ])
    assert.equal(isExternalBlog(url), true);
  for (const url of [
    '/',
    '/about/',
    '/es/projects/',
    'https://github.com/elbruno',
    'https://elbruno.com.example.org/',
  ])
    assert.equal(isExternalBlog(url), false);
});

test('repository selection keeps editorial order despite shuffled metadata or missing metrics', () => {
  const metadata = curatedRepositories
    .slice()
    .reverse()
    .map((project) => ({
      name: project.name,
      url: project.url,
      description: 'API description',
      stars: 0,
    }));
  const selected = selectRepositories(metadata);
  assert.deepEqual(
    selected.map((repo) => repo.url),
    curatedRepositories.map((repo) => repo.url),
  );
  assert.ok(selected.every((repo) => repo.stars === 0));
  const unavailable = selectRepositories([]);
  assert.equal(unavailable.length, 4);
  assert.ok(
    unavailable.every(
      (repo) =>
        repo.stars === undefined && repo.language === undefined && repo.updatedAt === undefined,
    ),
  );
  assert.ok(unavailable.every((repo) => repo.description === ''));
});

test('homepage curation excludes PromptDot without deleting its historical project', () => {
  assert.deepEqual(
    featuredProjects.map((project) => project.name),
    ['New Year New Bot', 'MarkItDotNet', 'LocalEmbeddings', 'OllamaMonitor'],
  );
  assert.ok(projects.some((project) => project.slug === 'PromptDot'));
});
