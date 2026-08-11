const listContainerId = 'starred-repos';

async function loadStarredRepos() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch events.json: ${response.status}`);
    }

    const repos = await response.json();
    renderRepoList(repos);
  } catch (error) {
    const container = document.getElementById(listContainerId);
    container.innerHTML = `<p>Unable to load starred repositories: ${error.message}</p>`;
  }
}

function renderRepoList(repos) {
  const container = document.getElementById(listContainerId);

  if (!Array.isArray(repos) || repos.length === 0) {
    container.innerHTML = '<p>No starred repositories found.</p>';
    return;
  }

  const sorted = repos.slice().sort((a, b) => new Date(b.starred_at) - new Date(a.starred_at));
  const list = document.createElement('ul');
  list.className = 'repo-list';

  for (const repo of sorted) {
    const item = document.createElement('li');
    item.className = 'repo-item';

    item.innerHTML = `
      <a href="${repo.url}" target="_blank" rel="noopener noreferrer">${repo.owner}/${repo.name}</a>
      <div class="repo-meta">Starred on ${new Date(repo.starred_at).toLocaleDateString()}</div>
      <div class="repo-description">${repo.description || 'No description available.'}</div>
    `;

    list.appendChild(item);
  }

  container.innerHTML = '';
  container.appendChild(list);
}

window.addEventListener('DOMContentLoaded', loadStarredRepos);
