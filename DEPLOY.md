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

## 5. Updating

- **App changes** (lessons, screens): once they are on the `main` branch on GitHub, they appear
  within 10 minutes. To see them right away, run **clearAppCache** in the script editor.
- **Server changes** (`apps-script/Code.gs`): paste the new file, then **Deploy → Manage deployments →
  ✏️ Edit → Version: New version → Deploy**. The URL stays the same.

## 6. Optional settings

In the script editor: **Project Settings (⚙) → Script properties → Add script property**

| Property | Value |
|---|---|
| `TEACHER_EMAILS` | Co-teachers allowed to choose the teacher role, comma-separated, e.g. `jsmith@holliston.k12.ma.us` |

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

Not collected: addresses, phone numbers, birthdays, photos, grades, or anything from Google Classroom.
Students are identified in class data by an anonymous ID. The ID-to-email link lives only in rows you can see.

## For district IT

- **Hosting:** Google Apps Script web app owned by the teacher, restricted to the district domain.
- **Data storage:** a Google Sheet in the teacher's school Drive. There are no other databases or vendors.
- **Outbound requests from the script:** only `raw.githubusercontent.com`, to fetch the app's own HTML/JS
  from the public repository. No student data is included in that request.
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
