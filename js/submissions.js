let activeSubmissionId = null;
let draftRating = null;

function statusClass(status) {
  if (status === "Late") return "late";
  if (status === "Reviewed") return "reviewed";
  return "awaiting";
}

function renderSubmissions() {
  const state = Flow.load();
  const subs = state.submissions;

  document.getElementById("subDateChip").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  document.getElementById("statNew").textContent = subs.filter(s => s.status === "Awaiting Review").length;
  document.getElementById("statAwaiting").textContent = subs.filter(s => s.status !== "Reviewed").length;
  document.getElementById("statReviewed").textContent = subs.filter(s => s.status === "Reviewed").length;
  document.getElementById("statLate").textContent = subs.filter(s => s.status === "Late").length;

  document.getElementById("subTableBody").innerHTML = subs.map(s => `
    <tr>
      <td>${flowEscapeHtml(s.studentName)}</td>
      <td>${flowEscapeHtml(s.quest)}</td>
      <td>${flowEscapeHtml(s.submittedAt)}</td>
      <td><span class="status-chip ${statusClass(s.status)}">${s.status}</span></td>
      <td><button class="btn-review ${s.status === "Reviewed" ? "viewed" : ""}" data-id="${s.id}">${s.status === "Reviewed" ? "View" : "Review"}</button></td>
    </tr>
  `).join("");

  document.querySelectorAll(".btn-review").forEach(btn => {
    btn.addEventListener("click", () => {
      activeSubmissionId = Number(btn.dataset.id);
      draftRating = null;
      renderReviewPanel();
    });
  });

  if (activeSubmissionId === null && subs.length) {
    activeSubmissionId = subs[0].id;
  }
  renderReviewPanel();
}

function renderReviewPanel() {
  const state = Flow.load();
  const panel = document.getElementById("reviewPanel");
  const sub = state.submissions.find(s => s.id === activeSubmissionId);

  if (!sub) {
    panel.innerHTML = '<p class="side-hint">Select a submission to review.</p>';
    return;
  }

  panel.innerHTML = `
    <h3>Review Submission</h3>
    <p class="review-meta">Submitted by: <strong>${flowEscapeHtml(sub.studentName)}</strong></p>
    <p class="review-meta">Submitted on: ${flowEscapeHtml(sub.submittedAt)}</p>
    <p class="review-meta">Quest: ${flowEscapeHtml(sub.quest)}</p>
    <div class="review-file">📎 ${flowEscapeHtml(sub.file)}</div>

    <div class="rating-row">
      <button type="button" class="rating-btn rating-excellent" data-rating="Excellent">🏆<span>Excellent</span></button>
      <button type="button" class="rating-btn rating-average" data-rating="Improve">🎯<span>Improve</span></button>
      <button type="button" class="rating-btn rating-poor" data-rating="Poor">⚠️<span>Poor</span></button>
    </div>

    <textarea id="feedbackText" placeholder="Write feedback for this submission...">${sub.feedback ? flowEscapeHtml(sub.feedback) : ""}</textarea>
    <button class="btn-send-feedback" id="btnSendFeedback">Send Feedback</button>
    <p class="feedback-sent-msg" id="feedbackSentMsg">Feedback sent — marked as Reviewed.</p>
  `;

  panel.querySelectorAll(".rating-btn").forEach(btn => {
    if (sub.rating === btn.dataset.rating) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      draftRating = btn.dataset.rating;
      panel.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  document.getElementById("btnSendFeedback").addEventListener("click", () => {
    const text = document.getElementById("feedbackText").value.trim();
    const rating = draftRating || sub.rating || "Excellent";
    Flow.addFeedback(sub.id, rating, text);
    document.getElementById("feedbackSentMsg").style.display = "block";
    renderSubmissions();
  });
}

renderSubmissions();
