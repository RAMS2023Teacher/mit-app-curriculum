# Class Screen (projector display): spec

A description of AppVenture's Class Screen (`src/pages/ClassScreen.tsx`), written so it can be
rebuilt in another version of the course (for example, a Scratch version). Swap in your own lessons
where it says *[your lessons]*.

## Purpose
A full-screen page the teacher projects during work time. In one glance students see the time,
how long they have left, what to work on, a question to think about, where every team is, recent
wins, and who to ask for help. It only shows positive information: no grades, failed quizzes, or
returned work.

## Access and layout
- Teacher-only. Opened from a big **📺 Class Screen** button on the teacher's class page.
- Hides the normal site menu so the page fills the display.
- Built for projectors: test at **1280×720** and **1920×1080**. All text scales with the window
  (base font about `clamp(15px, 1.15vw, 22px)`), with slightly smaller type on short screens
  (under about 820px tall).
- Layout: a **header bar**, then **three columns** in a 1 : 2 : 1 ratio. Below about 1100px wide,
  the columns stack into one.

## Header bar (dark blue, full width)
1. **Class name** with a small logo mark, left side.
2. **Clock:** large 12-hour time (`4:46`, no AM/PM) with the weekday and date underneath
   (`Friday, Nov 6`). Updates every second.
3. **Work timer:** large countdown `14:59` with "work time left" underneath.
   - No timer running: shows a small "No timer".
   - At zero: "⏰ Time's up!" on a pulsing red background.
4. **Buttons:** ⚙ **Edit** (toggles the editor panel), ⛶ **Full screen** (browser full-screen, fails
   silently if blocked), ✕ **Exit** (back to the class page).

## Editor panel (hidden until ⚙ Edit is clicked)
- **Today's mission:** text area, e.g. "Finish your current lesson. Done early? Do the Remix, then
  help another company."
- **Question of the day:** text field. Leave empty to have one picked automatically.
- **Answer:** text field, shown when the teacher taps Reveal.
- **Save** button.
- **Work timer:** buttons for **5 / 10 / 15 / 20 / 30 min**, plus **Stop**.
- Save all of this on the class record as `{ goal, question, answer, timerEnd }`. `timerEnd` is the
  exact end time (a timestamp), not "minutes left", so the timer survives a page refresh and shows
  the same on any computer.

## Left column
**Card 1: 🎯 Today's mission** (soft yellow)
- Shows the teacher's mission text in large bold type.
- If empty, shows the default: "Keep building! Finish your current lesson, then try the Remix."

**Card 2: ❓ Question of the day**
- **If the teacher typed a question:** show it large. If they also gave an answer, show a
  **Reveal answer** button that shows the answer in a green box.
- **If not, pick one automatically:**
  - Find the lesson that the most teams are currently on (ties go to the first).
  - From that lesson's quiz, pick question number `(days since Jan 1, 1970) mod (number of questions)`,
    so it changes every day but stays the same all day.
  - Show the question and its options labeled A–D, with a small caption "From 🎯 [Lesson name]".
  - **Reveal answer** highlights the correct option in green and shows the one-sentence explanation.
    Tapping again hides it.

## Center column: 🏁 Race to Launch Day
- **Milestone strip:** one emoji per required lesson, in order, spaced evenly above the tracks.
  AppVenture has 14: 👋 ⚡ 📦 🔀 🧪 🔁 📋 🧩 🏢 🏢 🏢 🏆 🚀 🧗. Use *[your lessons]*.
- **One row per team, sorted by XP, highest first.** Each row has three parts:
  - **Left (about 30% of the width):** a small gold shield with the team's level number, the
    **team name** in bold, and underneath, what they're **working on now** (the current lesson's
    title, or "🔀 [choice name]" if they're at a fork choosing a path).
  - **Middle: the track.** A rounded bar divided into one segment per required lesson. A green fill
    shows lessons completed ÷ lessons required. The team's **logo** (about 44px) sits at the end of
    the fill. Fill and logo slide smoothly when progress changes.
  - **Right:** "⭐ [XP]" in gold.
- **No teams yet:** "Companies appear here once students form them."

**Below the race: 🙋 Stuck? Ask an expert** (separated by a dashed line)
- Take each lesson that at least one team is currently working on.
- List the teams that have **already completed** that lesson, as small chips with logo and name.
  Show at most 4 lessons and 4 teams per lesson.
- Hide the whole section if nobody qualifies.
- This sends students to classmates for help without publicly showing who is struggling.

## Right column: 🎉 Recent wins
- The **6 most recent** positive events, newest first. Each line has an icon, the team logo
  (about 30px), the text, and a relative time underneath ("22 h ago", "yesterday", "2 days ago").
- **Event types:**
  - **Approved build:** 🚀 "[Team] shipped [Project name]". With the bonus also approved: ⭐ and
    "+ bonus quest". On solo (individual) lessons, use the student's name instead of the team name.
  - **Passed quiz:** 🧠 "[Student] passed the [Lesson] quiz", or 💯 if the score was perfect.
  - **Never shown:** failed quizzes, quizzes the teacher excused, and returned or pending work.
- **Empty:** "Wins show up here as students pass quizzes and ship builds."

## Data the page needs
- **Class:** name, plus the saved `{ goal, question, answer, timerEnd }`.
- **Each team:**
  - name and logo
  - XP and level number
  - lessons completed and lessons required
  - current position: a lesson, or the fork being chosen
  - which lessons it has completed
  - each member's quiz results: score, total, timestamp, student display name
- **Approvals:** team, lesson, bonus yes/no, timestamp, and the student for solo lessons.
- **Lessons:** title, icon, project name, quiz questions with options, the correct answer index,
  and an explanation.
- **Updates:** refresh the data live, or at least every 20 seconds. The clock and timer tick every
  second on their own.

## Look and feel
- Bright game style, not corporate:
  - light sky-blue background with a faint dot pattern
  - white cards with thick dark-navy outlines and a hard drop shadow (`0 5px 0` navy)
  - rounded corners (about 18px)
  - chunky buttons that press down when clicked
- Fonts: a bold rounded display font for headings and big numbers (**Lilita One**) and a friendly
  rounded body font (**Nunito**). Numbers use evenly spaced digits so the timer doesn't jiggle.
- Colors: navy `#1b2350` for outlines and text, gold `#ffc928` for XP and highlights, green
  `#33c95a` for progress and correct answers, red `#e2394b` for time's up.
- Motion: new wins pop in, and the progress fill slides. Turn all animation off when the user's
  "reduce motion" setting is on.

## Privacy rules
- Show students only by display name (first name + last initial) or team name. Never emails.
- Never show grades, failed or excused attempts, returned work, or who is behind.
