const STORAGE_KEY = "quest_board_state";

const SEED = {
  quests: [
    { id: 1, title: "Refine Project Management and Marketing and Collaboration Portfolio", subquests: ["Draft outline", "Get advisor feedback"], priority: "High", dueDate: todayISO(), status: "In Progress", daily: true },
    { id: 2, title: "Prepare wind tunnel data log", subquests: [], priority: "Medium", dueDate: todayISO(), status: "To Do", daily: true },
    { id: 3, title: "Sponsorship deck v2 review", subquests: ["Update photos", "Proofread"], priority: "Medium", dueDate: addDays(2), status: "To Do", daily: false },
    { id: 4, title: "Submit portfolio draft", subquests: [], priority: "Low", dueDate: addDays(-1), status: "Completed", daily: false }
  ],
  comments: [
    { name: "Ms Dee", initials: "MD", text: "Commented on your task Refine Project Management and Marketing and Collaboration Portfolio", time: "Just now" }
  ],
  rating: null
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

const Quest = {
  load() {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      raw = localStorage.getItem(STORAGE_KEY);
    }
    return JSON.parse(raw);
  },
  save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  addQuest(quest) {
    const state = this.load();
    const id = state.quests.length ? Math.max(...state.quests.map(q => q.id)) + 1 : 1;
    state.quests.push({ id, status: "To Do", daily: quest.dueDate === todayISO(), ...quest });
    this.save(state);
  },
  updateStatus(id, status) {
    const state = this.load();
    const q = state.quests.find(x => x.id === id);
    if (q) q.status = status;
    this.save(state);
  },
  addComment(text) {
    const state = this.load();
    state.comments.unshift({ name: "You", initials: "Y", text, time: "Just now" });
    this.save(state);
  },
  setRating(rating) {
    const state = this.load();
    state.rating = rating;
    this.save(state);
  }
};

let currentFilter = "all";
let selectedPriority = "Medium";
let subquestDraft = [];

function render() {
  const state = Quest.load();

  // Header
  const openCount = state.quests.filter(q => q.status !== "Completed").length;
  document.getElementById("questCount").textContent = openCount;
  document.getElementById("questPlural").textContent = openCount === 1 ? "" : "s";
  document.getElementById("todayDate").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Ongoing list (filtered)
  const ongoingEl = document.getElementById("ongoingList");
  let quests = state.quests;
  if (currentFilter !== "all") quests = quests.filter(q => q.status === currentFilter);

  if (quests.length === 0) {
    ongoingEl.innerHTML = `
      <div class="empty-state">
        <img src="images/mascot-awan.png" alt="" class="empty-state-mascot" />
        <p class="empty-note">No quests here — add one on the left, or pick a different filter.</p>
      </div>
    `;
  } else {
    ongoingEl.innerHTML = quests.map(q => `
      <div class="ongoing-card">
        <span class="priority-tag" style="background:${priorityColor(q.priority)}"></span>
        <div class="quest-body">
          <div class="quest-title">${escapeHtml(q.title)}</div>
          <div class="quest-meta">${q.priority} priority &middot; Due ${formatDate(q.dueDate)}${q.subquests.length ? ` &middot; ${q.subquests.length} subquest${q.subquests.length > 1 ? "s" : ""}` : ""}</div>
        </div>
        <select data-id="${q.id}" class="status-select">
          <option ${q.status === "To Do" ? "selected" : ""}>To Do</option>
          <option ${q.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option ${q.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      </div>
    `).join("");

    ongoingEl.querySelectorAll(".status-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        Quest.updateStatus(Number(e.target.dataset.id), e.target.value);
        render();
      });
    });
  }

  // Daily quest grid
  const dailyEl = document.getElementById("dailyGrid");
  const dailyQuests = state.quests.filter(q => q.daily && q.status !== "Completed");
  dailyEl.innerHTML = dailyQuests.length
    ? dailyQuests.map(q => `
        <div class="quest-tile daily">
          <div class="quest-title">${escapeHtml(q.title)}</div>
          <div class="quest-meta">${q.status} &middot; Due ${formatDate(q.dueDate)}</div>
        </div>
      `).join("")
    : '<p class="empty-note">No quests due today.</p>';

  // Completed grid
  const completedEl = document.getElementById("completedGrid");
  const completedQuests = state.quests.filter(q => q.status === "Completed");
  completedEl.innerHTML = completedQuests.length
    ? completedQuests.map(q => `
        <div class="quest-tile completed">
          <div class="quest-title">${escapeHtml(q.title)}</div>
          <div class="quest-meta">Completed &middot; was due ${formatDate(q.dueDate)}</div>
        </div>
      `).join("")
    : '<p class="empty-note">Nothing completed yet.</p>';

  // Comments
  const commentsEl = document.getElementById("commentsList");
  commentsEl.innerHTML = state.comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">${c.initials}</div>
      <div class="comment-body">
        <div class="comment-name">${escapeHtml(c.name)}</div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
        <div class="comment-time">${c.time}</div>
      </div>
    </div>
  `).join("");

  // Rating
  document.querySelectorAll(".rating-btn").forEach(btn => {
    btn.classList.toggle("selected", state.rating === btn.dataset.rating);
  });
  const ratingResult = document.getElementById("ratingResult");
  if (state.rating) {
    ratingResult.style.display = "block";
    ratingResult.textContent = `This week rated: ${state.rating}`;
  }
}

function priorityColor(p) {
  return p === "High" ? "#D9544F" : p === "Medium" ? "#E3864B" : "#4CAF7D";
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Filters ----
document.getElementById("statusFilters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-pill");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  render();
});

// ---- Priority picker ----
document.getElementById("priorityPicker").addEventListener("click", (e) => {
  const chip = e.target.closest(".priority-chip");
  if (!chip) return;
  selectedPriority = chip.dataset.priority;
  document.querySelectorAll(".priority-chip").forEach(c => c.classList.remove("selected"));
  chip.classList.add("selected");
});
document.querySelector('.priority-chip[data-priority="Medium"]').classList.add("selected");

// ---- Subquests ----
function renderSubquestDraft() {
  const el = document.getElementById("subquestList");
  el.innerHTML = subquestDraft.map((s, i) => `
    <div class="subquest-item"><span>${escapeHtml(s)}</span><button type="button" data-i="${i}">✕</button></div>
  `).join("");
  el.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => {
      subquestDraft.splice(Number(b.dataset.i), 1);
      renderSubquestDraft();
    });
  });
}
document.getElementById("btnAddSubquest").addEventListener("click", () => {
  const input = document.getElementById("subquestInput");
  if (input.value.trim()) {
    subquestDraft.push(input.value.trim());
    input.value = "";
    renderSubquestDraft();
  }
});
document.getElementById("subquestInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); document.getElementById("btnAddSubquest").click(); }
});

// ---- Add quest ----
document.getElementById("btnAddQuest").addEventListener("click", () => {
  const title = document.getElementById("questTitle").value.trim();
  const due = document.getElementById("questDue").value || todayISO();
  const msg = document.getElementById("formMsg");

  if (!title) {
    msg.style.display = "block";
    msg.style.color = "#D9544F";
    msg.textContent = "Give your quest a title first.";
    return;
  }

  Quest.addQuest({ title, subquests: [...subquestDraft], priority: selectedPriority, dueDate: due });

  document.getElementById("questTitle").value = "";
  document.getElementById("questDue").value = "";
  subquestDraft = [];
  renderSubquestDraft();
  msg.style.display = "block";
  msg.style.color = "#4CAF7D";
  msg.textContent = "Quest added!";
  render();
});

// ---- Comments ----
document.getElementById("btnAddComment").addEventListener("click", () => {
  const input = document.getElementById("commentInput");
  if (input.value.trim()) {
    Quest.addComment(input.value.trim());
    input.value = "";
    render();
  }
});
document.getElementById("commentInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); document.getElementById("btnAddComment").click(); }
});

// ---- Rating ----
document.querySelectorAll(".rating-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    Quest.setRating(btn.dataset.rating);
    render();
  });
});

render();
