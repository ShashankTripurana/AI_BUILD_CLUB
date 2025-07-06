// script.js — tab switching & dynamic team rendering
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Tab Switching ---------- */
  const tabButtons  = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(targetId) {
    // Highlight the correct tab button
    tabButtons.forEach(btn =>
      btn.classList.toggle('active', btn.dataset.tab === targetId)
    );
    // Show / hide content
    tabContents.forEach(sec =>
      sec.classList.toggle('active', sec.id === targetId)
    );

    // Lazy‑load team data the first time the Team tab is opened
    if (targetId === 'team' &&
        !document.getElementById('team-container').dataset.loaded) {
      loadTeamData();
    }
  }

  tabButtons.forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  );

  // Default tab
  switchTab('home');

  /* ---------- Team JSON Loader ---------- */
  function loadTeamData() {
    fetch('/static/team.json?v=' + Date.now())
      .then(res => res.json())
      .then(renderTeams)
      .catch(err => console.error('Error loading team.json:', err));
  }

  function renderTeams(data) {
    const container = document.getElementById('team-container');
    if (!container) return;
    container.dataset.loaded = 'true';

    Object.entries(data).forEach(([year, members]) => {
      const group = document.createElement('div');
      group.className = 'team-group';

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'team-toggle';
      toggleBtn.textContent = year;

      const grid = document.createElement('div');
      grid.className = 'team-grid';
      grid.style.display = 'none';

      toggleBtn.addEventListener('click', () => {
        const isVisible = grid.style.display === 'block';
        document.querySelectorAll('.team-grid')
                .forEach(g => g.style.display = 'none');
        grid.style.display = isVisible ? 'none' : 'block';
      });

      members.forEach(m => {
        const card = document.createElement('div');
        card.className = 'member-card';

        const img = document.createElement('img');
        img.src = m.image;
        img.alt = m.name;
        img.onerror = () => {
          img.src = '/static/images/default-profile.png';
        };

        card.appendChild(img);
        card.insertAdjacentHTML(
          'beforeend',
          `<h4>${m.name}</h4><p>${m.position}</p>`
        );
        grid.appendChild(card);
      });

      group.appendChild(toggleBtn);
      group.appendChild(grid);
      container.appendChild(group);
    });
  }
});
