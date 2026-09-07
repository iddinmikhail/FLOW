# FLOW

A gamified task/quest platform for a student team and their advisor, built from a Figma design file, as a static HTML/CSS/JS site — no server, no build step, no framework.

## Pages
- **`index.html` — Student Dashboard**: Flow Rank + EXP bar, ongoing quest highlight, quest submission rows, and daily quests.
- **`quest.html` — Quest Board**: add quests (with subquests, priority, due date), filter by status, see Daily/Completed quests, leave comments, rate the week.
- **`teacher.html` — Teacher Dashboard**: advisor overview of every student's ongoing quest and level, plus a comment log.
- **`assign.html` — Assign Task**: per-student panels for assigning new quests with a due date.
- **`submissions.html` — Quest Submissions**: a table of student submissions with a review panel to rate and send feedback.

All five pages share one `localStorage`-backed data store (`js/flow-data.js` for the teacher-facing pages, `js/app.js` / `js/dashboard.js` for the student-facing ones), so actions you take (checking a student off, assigning a quest, sending feedback) persist across pages in the same browser.

Everything is saved to your browser's `localStorage`, so it persists between visits on the same device/browser, but isn't shared between different visitors — there's no backend.

## How to publish this on GitHub Pages

1. Create a new GitHub repository named `FLOW` (public, no README/gitignore added).
2. Copy all files from this folder into the root of that repository.
3. Commit and push:
   ```
   git init
   git add .
   git commit -m "Add FLOW static site"
   git branch -M main
   git remote add origin https://github.com/iddinmikhail/FLOW.git
   git push -u origin main
   ```
4. In the repo, go to **Settings → Pages**, set Source to "Deploy from a branch", Branch = `main`, folder = `/ (root)`, then Save.
5. Your site will be live at:
   ```
   https://iddinmikhail.github.io/FLOW/
   ```

## File structure
```
index.html            Student Dashboard (Flow Rank / EXP / submissions)
quest.html             Quest Board (add/filter quests, comments, ratings)
teacher.html            Teacher Dashboard (student overview, comments)
assign.html              Assign Task (per-student quest assignment)
submissions.html          Quest Submissions (review + feedback)
css/style.css              Shared styles (blue/orange palette, Poppins + Inter type)
js/app.js                    Quest Board logic
js/dashboard.js                Student Dashboard logic
js/flow-data.js                  Shared data store for teacher-facing pages
js/teacher.js, js/assign.js,       Page-specific logic for each teacher-facing page
js/submissions.js
```
