const DASH_KEY = "flow_dashboard_state";

const DASH_SEED = {
  exp: 52,
  expMax: 100,
  submissions: [
    { id: 1, label: "Aerodynamics report draft", submitted: false },
    { id: 2, label: "Sponsorship deck v2", submitted: false },
    { id: 3, label: "Wind tunnel data log", submitted: true }
  ],
  dailyQuests: [
    { icon: "🔧", title: "Fix design flaw", meta: "+20 EXP" },
    { icon: "📊", title: "Update tracker", meta: "+15 EXP" },
    { icon: "🎯", title: "Team check-in", meta: "+10 EXP" }
  ]
};

function loadDash() {
  let raw = localStorage.getItem(DASH_KEY);
  if (!raw) {
    localStorage.setItem(DASH_KEY, JSON.stringify(DASH_SEED));
    raw = localStorage.getItem(DASH_KEY);
  }
  return JSON.parse(raw);
}
function saveDash(state) {
  localStorage.setItem(DASH_KEY, JSON.stringify(state));
}

function renderDash() {
  const state = loadDash();

  const pct = Math.min(100, (state.exp / state.expMax) * 100);
  document.getElementById("expLabel").textContent = `${state.exp}/${state.expMax}`;
  document.getElementById("pillFillWrap").style.width = `${pct}%`;
  document.getElementById("ringFill").style.setProperty("--pct", `${pct}%`);
  const rankTitleEl = document.getElementById("rankTitle");
  if (rankTitleEl) rankTitleEl.textContent = rankTitleFor(state.exp);

  document.getElementById("todayChip").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 3);
  document.getElementById("deadlineText").textContent = "Deadline: " + deadline.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  const rowsEl = document.getElementById("submissionRows");
  rowsEl.innerHTML = state.submissions.map(s => `
    <div class="submission-row">
      <div class="attach-icon">📎</div>
      <input type="text" value="${escapeAttr(s.label)}" data-id="${s.id}" class="submission-label-input" ${s.submitted ? "disabled" : ""} />
      <button class="btn-submit ${s.submitted ? "done" : ""}" data-id="${s.id}">${s.submitted ? "Submitted ✓" : "Submit"}</button>
    </div>
  `).join("");

  rowsEl.querySelectorAll(".btn-submit").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("done")) return;
      const id = Number(btn.dataset.id);
      const s = loadDash();
      const item = s.submissions.find(x => x.id === id);
      if (item) {
        item.submitted = true;
        s.exp = Math.min(s.expMax, s.exp + 15);
        saveDash(s);
        renderDash();
      }
    });
  });

  rowsEl.querySelectorAll(".submission-label-input").forEach(input => {
    input.addEventListener("change", () => {
      const id = Number(input.dataset.id);
      const s = loadDash();
      const item = s.submissions.find(x => x.id === id);
      if (item) { item.label = input.value; saveDash(s); }
    });
  });

  const gridEl = document.getElementById("dailyQuestGrid");
  gridEl.innerHTML = state.dailyQuests.map(q => `
    <div class="daily-quest-card">
      <div class="icon"><img src="images/icon-checklist.png" alt="" class="daily-quest-icon" /></div>
      <div class="qtitle">${escapeHtmlDash(q.title)}</div>
      <div class="qmeta">${q.meta}</div>
    </div>
  `).join("");
}

function rankTitleFor(exp) {
  if (exp >= 90) return "Podium Contender";
  if (exp >= 60) return "Pit Crew Veteran";
  if (exp >= 30) return "Rookie Driver";
  return "New Recruit";
}
function escapeHtmlDash(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

renderDash();
