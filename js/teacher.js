function renderTeacher() {
  const state = Flow.load();

  document.getElementById("teacherDateChip").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  document.getElementById("statActive").textContent = state.students.filter(s => !s.checked).length;

  const gridEl = document.getElementById("studentGrid");
  gridEl.innerHTML = state.students.map(s => `
    <div class="student-card">
      <div class="student-card-head">
        <span class="sname">${flowEscapeHtml(s.name)}</span>
        <span class="level-badge">Level: ${s.level}</span>
      </div>
      <div class="oq-label">Ongoing quest:</div>
      <div class="oq-text">${flowEscapeHtml(s.ongoingQuest)}</div>
      <div class="skill-tags">${s.skills.map(sk => `<span class="skill-tag">${flowEscapeHtml(sk)}</span>`).join("")}</div>
      <button class="btn-check ${s.checked ? "checked" : ""}" data-id="${s.id}">${s.checked ? "Checked ✓" : "Check"}</button>
    </div>
  `).join("");

  gridEl.querySelectorAll(".btn-check").forEach(btn => {
    btn.addEventListener("click", () => {
      Flow.toggleCheck(Number(btn.dataset.id));
      renderTeacher();
    });
  });

  const targetEl = document.getElementById("commentTarget");
  targetEl.innerHTML = state.students.map(s => `<option value="${flowEscapeHtml(s.name)}">${flowEscapeHtml(s.name)}</option>`).join("");

  document.getElementById("commentLog").innerHTML = state.comments.map(c => `
    <div class="comment-log-item">
      <span class="ctime">${c.time}</span>
      <span class="cname">${flowEscapeHtml(c.name)}</span> to ${flowEscapeHtml(c.to)}: ${flowEscapeHtml(c.text)}
    </div>
  `).join("");
}

document.getElementById("btnSendComment").addEventListener("click", () => {
  const to = document.getElementById("commentTarget").value;
  const text = document.getElementById("commentText").value.trim();
  if (!text) return;
  Flow.addComment(to, text);
  document.getElementById("commentText").value = "";
  renderTeacher();
});

renderTeacher();
