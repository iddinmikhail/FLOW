function renderAssign() {
  const state = Flow.load();

  document.getElementById("assignDateChip").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const gridEl = document.getElementById("assignGrid");
  gridEl.innerHTML = state.students.map(s => `
    <div class="assign-panel">
      <div class="assign-panel-head">
        <h3>${flowEscapeHtml(s.name)}'s Quest</h3>
        <button class="btn-assign-new" data-id="${s.id}">+ Assign New</button>
      </div>
      <div class="quest-items">
        ${s.quests.map(q => `
          <div class="assign-quest-item">
            <span>${flowEscapeHtml(q.title)}</span>
            <span class="due-chip">${flowEscapeHtml(q.due)}</span>
          </div>
        `).join("") || '<p class="empty-note">No quests assigned yet.</p>'}
      </div>
      <div class="assign-new-form" id="form-${s.id}">
        <input type="text" placeholder="Quest title" class="new-quest-title" />
        <input type="text" placeholder="Due date (e.g. 09/09)" class="new-quest-due" />
        <button class="btn-primary btn-full btn-save-quest" data-id="${s.id}">Add Quest</button>
      </div>
    </div>
  `).join("");

  gridEl.querySelectorAll(".btn-assign-new").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(`form-${btn.dataset.id}`).classList.toggle("open");
    });
  });

  gridEl.querySelectorAll(".btn-save-quest").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const form = document.getElementById(`form-${id}`);
      const title = form.querySelector(".new-quest-title").value.trim();
      const due = form.querySelector(".new-quest-due").value.trim() || "TBD";
      if (!title) return;
      Flow.addQuest(id, title, due);
      renderAssign();
    });
  });
}

renderAssign();
