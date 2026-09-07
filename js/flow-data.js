const FLOW_KEY = "flow_students_state";

const FLOW_SEED = {
  students: [
    {
      id: 1, name: "Daleesya", level: 1,
      ongoingQuest: "Refine Project Management and Marketing and Collaboration Portfolio",
      checked: false,
      skills: ["Verbal Practice", "Reaction Challenge", "Checklist"],
      quests: [
        { id: 101, title: "Refine Project Management and Marketing and Collaboration Portfolio", due: "28/2" },
        { id: 102, title: "Finish Designing Page 4 on Website", due: "01/09" }
      ]
    },
    {
      id: 2, name: "Shi Cheng", level: 1,
      ongoingQuest: "Refine Car Render",
      checked: false,
      skills: ["Verbal Practice", "Reaction Challenge", "Checklist"],
      quests: [
        { id: 201, title: "Refine Car Render", due: "30/8" },
        { id: 202, title: "Update sponsorship deck", due: "05/09" }
      ]
    },
    {
      id: 3, name: "Mitthra", level: 1,
      ongoingQuest: "Prepare wind tunnel data log",
      checked: false,
      skills: ["Verbal Practice", "Reaction Challenge", "Checklist"],
      quests: [
        { id: 301, title: "Prepare wind tunnel data log", due: "02/09" }
      ]
    },
    {
      id: 4, name: "Hong You", level: 1,
      ongoingQuest: "Drawings Correction",
      checked: false,
      skills: ["Verbal Practice", "Reaction Challenge", "Checklist"],
      quests: [
        { id: 401, title: "Drawings Correction", due: "26/8" }
      ]
    }
  ],
  submissions: [
    { id: 1, studentId: 1, studentName: "Daleesya", quest: "Refine Project Management and Marketing and Collaboration Portfolio", submittedAt: "Today, 9:48 AM", status: "Awaiting Review", file: "DELL_FOLIO.png" },
    { id: 2, studentId: 2, studentName: "Shi Cheng", quest: "Refine Car Render", submittedAt: "Yesterday", status: "Late", file: "CAR_RENDER_V2.png" },
    { id: 3, studentId: 4, studentName: "Hong You", quest: "Drawings Correction", submittedAt: "26 Aug", status: "Reviewed", file: "DRAWINGS_FINAL.pdf" }
  ],
  comments: [
    { name: "Ms Dee", to: "Daleesya", text: "Great progress on the portfolio — keep going!", time: "Just now" }
  ]
};

const Flow = {
  load() {
    let raw = localStorage.getItem(FLOW_KEY);
    if (!raw) {
      localStorage.setItem(FLOW_KEY, JSON.stringify(FLOW_SEED));
      raw = localStorage.getItem(FLOW_KEY);
    }
    return JSON.parse(raw);
  },
  save(state) {
    localStorage.setItem(FLOW_KEY, JSON.stringify(state));
  },
  toggleCheck(studentId) {
    const state = this.load();
    const s = state.students.find(x => x.id === studentId);
    if (s) s.checked = !s.checked;
    this.save(state);
  },
  addQuest(studentId, title, due) {
    const state = this.load();
    const s = state.students.find(x => x.id === studentId);
    if (s) {
      const id = Date.now();
      s.quests.push({ id, title, due });
    }
    this.save(state);
  },
  addComment(to, text) {
    const state = this.load();
    state.comments.unshift({ name: "Advisor", to, text, time: "Just now" });
    this.save(state);
  },
  setSubmissionStatus(id, status) {
    const state = this.load();
    const sub = state.submissions.find(x => x.id === id);
    if (sub) sub.status = status;
    this.save(state);
  },
  addFeedback(submissionId, rating, comment) {
    const state = this.load();
    const sub = state.submissions.find(x => x.id === submissionId);
    if (sub) {
      sub.status = "Reviewed";
      sub.rating = rating;
      sub.feedback = comment;
    }
    this.save(state);
  }
};

function flowEscapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
