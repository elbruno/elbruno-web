import { curatedRepositories } from '../data/profile';
import type { RepositorySummary } from './feeds/model';

export function selectRepositories(metadata: RepositorySummary[]): RepositorySummary[] {
  return curatedRepositories.map((project) => {
    const repository = metadata.find(
      (repo) => repo.url.toLowerCase() === project.url.toLowerCase(),
    );
    return repository ?? { name: project.name, url: project.url, description: '' };
  });
}
