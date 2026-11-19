# Deploying AppVenture in your school Google account

AppVenture runs as a **Google Apps Script web app** in your school Google account.
All class data is saved in a Google Sheet in your school Drive. Nothing is sent to
any other company, so student data stays under your district's existing Google
Workspace agreement.

Setup takes about 15 minutes, once.

## 1. Create the script

1. Go to <https://script.google.com> signed in with your **school** account.
2. Click **New project**. Rename it **AppVenture** (top left).
3. Delete everything in `Code.gs`, then paste in the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs) from this repository. Click **Save** (💾).

You do **not** need to paste the app itself. `Code.gs` loads it from this GitHub
repository (`apps-script/index.html` on the `main` branch), so updates arrive on their own.

## 2. Allow it to run

1. In the function dropdown at the top, choose **clearAppCache**, then click **Run**.
2. Google asks you to authorize. Choose your school account and click **Allow**.
   It asks for three things:
   - **See, edit, create and delete your spreadsheets**: to save class data in the "AppVenture Data" sheet.
   - **Connect to an external service**: to load the app's page from GitHub. No student data is sent there.
   - **See your primary email address**: to know who is signed in.

   If your district blocks this step, ask IT to allow Apps Script for teachers.

## 3. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone within *Holliston Public Schools* (your district's name appears here)
4. Click **Deploy** and copy the **Web app URL**. It looks like `https://script.google.com/a/macros/holliston.k12.ma.us/s/…/exec`.

## 4. Set up your class

1. Open the Web app URL yourself first. Type your name, choose **I'm a teacher**, and create a class.
   The teacher role is only available to the account that owns the script, plus anyone you add in step 6.
2. Post the Web app URL and the class join code in Google Classroom.
3. Students open the link (already signed in to Chrome with their school account), type their
   **first name and last initial**, choose **Student**, and enter the join code.

## 5. Connect Google Classroom (optional)

This lets you import classes and students, create a Classroom assignment for each lesson,
and send grades back to Classroom (and from there to PowerSchool).

1. In the script editor, click **Services (+)** in the left sidebar, choose **Google Classroom API**, and click **Add**.
2. Run **clearAppCache** once more and **Allow** the new Classroom permissions:
   - see your courses and their rosters, including student emails (to match students to their sign-ins)
   - create assignments and grade them (only assignments AppVenture creates)
   - create the "AppVenture" topic
3. **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.** The URL stays the same.

Then in AppVenture:

- **My classes → Import from Google Classroom:** choose a course. AppVenture makes the class and adds every
  student as *first name + last initial*. Students open the link and land straight in the class, with no join code.
- **Class → 🎓 Classroom tab:**
  - **Sync roster** adds students who joined the course later.
  - **Create assignments:** tick lessons (or "Select core lessons"), set points, and create. Each assignment has the
    lesson summary and an **Open in AppVenture** link straight to that lesson, under an **AppVenture** topic. They're
    saved as drafts unless you tick "Publish now". You can also create one from a lesson's teacher panel.
  - **Send draft grades:** for every lesson with an assignment, each student gets
    **30% × their own best quiz score + 70% when the build is approved (+10% extra credit for an approved bonus quest)**.
    Students who haven't started are left blank. Grades go in as **drafts**: open the assignment in Classroom,
    check them, and click **Return**. Returned grades go to PowerSchool through your normal Classroom sync.

Good to know:
- Classroom only lets AppVenture grade assignments AppVenture created. Assignments you made by hand can't receive grades.
- Only the account that owns the script can use the Classroom features (co-teachers can't).
- Imported students' emails are stored only in the teacher-only rows, the same as for students who joined by code.
- To change the grade formula, edit `src/lib/grades.ts`.

## 6. Updating

- **App changes** (lessons, screens): once they are on the `main` branch on GitHub, they appear
  within 10 minutes. To see them right away, run **clearAppCache** in the script editor.
- **Server changes** (`apps-script/Code.gs`): paste the new file, then **Deploy → Manage deployments →
  ✏️ Edit → Version: New version → Deploy**. The URL stays the same.

## 7. Optional settings

In the script editor: **Project Settings (⚙) → Script properties → Add script property**

| Property | Value |
|---|---|
| `TEACHER_EMAILS` | Co-teachers allowed to choose the teacher role, comma-separated, e.g. `jsmith@holliston.k12.ma.us` |

## Personal XP, levels, badges and the shop

Each student has their own XP on top of their company's XP:

| Earned for | XP |
|---|---|
| Starting a mission | 10 |
| Each build step (after ticking "I tested it" where there is a test) | 10 |
| Passing the quiz | 30 |
| A perfect quiz / perfect on the first try | +20 / +10 |
| Build approved by you | 50 |
| Bonus quest approved by you | 25 |
| Whole lesson complete (their own quiz passed and the build approved) | 50 |
| Every badge | 25 |

- **Levels** (12 of them, Intern to Founder Legend) count all XP ever earned and never go down.
- **The shop** spends "XP to spend" on App Buddy parts. Spending never lowers a level.
- **The server decides.** It marks each quiz from the answer key, pays each award only once, and checks every price
  and balance. Build and bonus XP are paid only when you approve.
- **Students tab:** see each student's XP and level, and give the 🍎 Teacher's Pick badge.
- Company XP (the tree and leaderboard) is separate and works as before; you can still adjust it in Settings.

The rules live in `src/game/rules.js` and are copied into `Code.gs` by `npm run build:appsscript`. Lessons, answer
keys and prices are in `apps-script/manifest.json`, which the server loads from GitHub, so lesson changes need no
re-paste. Changes to the rules themselves do: paste the new `Code.gs` and deploy a new version.

## Keeping student work safe

The server follows these rules, and `npm test` checks each one:

- **Nothing is ever replaced or reset.** If Google is too busy to open the data sheet, the request stops with a
  "very busy, your work is safe" message. The app never makes a new, empty sheet in its place. A data sheet is created
  only the very first time the app runs.
- **A damaged record is reported, never treated as empty** and never overwritten.
- **A busy class is fine.** Each student's page sends one request at a time and quietly retries when Google is busy,
  showing "⏳ Busy… saving your work". A student's click reads only that student's records; the class summary is built
  once and shared for up to a minute.
- **Daily backups.** Once a day, while you use the app, every record is copied to a dated tab in a second spreadsheet,
  **AppVenture Backups**, in your Drive. The last 8 days are kept.
- **My classes → 🗄️ Your data** shows where the data is, how many students and classes it holds, whether today's
  backup is done, links to both spreadsheets, and a **Back up now** button. It warns you if the app has ever used more
  than one data sheet.

To restore from a backup: open **AppVenture Backups**, find the dated tab, and ask for help copying it back. Don't
edit the data sheet by hand.

## What is stored, and who can see it

Everything is in one Google Sheet in your Drive called **AppVenture Data** (tab `data`).
Don't edit it by hand. Delete it at the end of the year to remove all student data.

| Data | Who can see it in the app |
|---|---|
| Student school email | Only you (on the Students tab). Classmates never see it. |
| Display name the student types (first name + last initial) | Classmates and you |
| Company name, logo, slogan, path choices, plans | Classmates and you |
| Quiz scores, XP, badges | Classmates see XP/levels; individual scores are shown to the company and you |
| Build submissions, notes, "who did what", your feedback | The student's company and you |
| Uploaded `.aia` files | **Not stored.** They're checked in the student's browser; only the check results are saved |

Not collected: addresses, phone numbers, birthdays or photos. If you connect Google Classroom, AppVenture reads
only course names and student names and emails (stored as first name + last initial). It writes draft grades only
to assignments it created.
Students are identified in class data by an anonymous ID. The ID-to-email link lives only in rows you can see.

## For district IT

- **Hosting:** Google Apps Script web app owned by the teacher, restricted to the district domain.
- **Data storage:** a Google Sheet in the teacher's school Drive. There are no other databases or vendors.
- **Outbound requests from the script:** `raw.githubusercontent.com`, to fetch the app's own HTML/JS
  from the public repository (no student data included), and, if the teacher connects it, the Google Classroom
  API inside the district's own Google Workspace.
- **Sites students' browsers load:** `script.google.com`, `*.googleusercontent.com` (Apps Script),
  `fonts.googleapis.com` / `fonts.gstatic.com` (fonts). MIT App Inventor (`ai2.appinventor.mit.edu`) and the
  MIT AI2 Companion app are used separately for building apps.
- **Sign-in:** Google Workspace sign-in. Accounts outside the domain are refused by both the deployment
  setting and the script.

## Limits to know

- Pages refresh about every 20 seconds, not instantly.
- Apps Script handles a class of 30 comfortably. Run one deployment per teacher.
- If the page says "Please use your @holliston.k12.ma.us account", the student is signed in to Chrome
  with a personal account. Have them switch profiles.
