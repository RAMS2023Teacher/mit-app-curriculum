# ⚡ AppVenture: a gamified MIT App Inventor curriculum

Students team up with a partner, found a **company** with its own logo, and climb a
**progression tree** of App Inventor lessons. Companies earn XP for quizzes, approved
builds and bonus challenges. The tree branches twice, so each company picks what
kind of apps it wants to make.

```
Hello App Inventor → Events → Variables → Conditionals  (+ optional side quests)
        🔀 First product: Quiz Show (game) | Soundboard (media) | Unit Converter (tool)
Loops & Timers → Lists → Procedures
        🔀 Choose your studio:
           🎮 Game Studio   Canvas & Sprites → Motion & Collisions → Score/Lives/Levels → Capstone game
           🎬 Media House   Camera & Images → Paint Pad → Sound Studio → Capstone media app
           🛠️ Tool Works    Smart Forms → TinyDB To-Do → Sensors, Maps & Screens → Capstone utility app
🚀 Launch Day: polish, build the .apk, fresh-user test, pitch (live, video or written), reflect
🧗 Solo Challenge: each student builds a new app alone from a written spec
```

26 lessons in all. Each one has objectives, vocabulary, step-by-step Designer and
Blocks instructions with color-coded block snippets, a bonus challenge, a 4-question
concept check, and teacher notes. All of it lives in `src/curriculum/`.

## How it works

| | Students | Teachers |
|---|---|---|
| Classes | Join with a 6-letter code | Create classes, see roster, remove students |
| Companies | Create one (name, slogan, logo builder) or join with a partner's invite code | See every company, its level, XP and path choices; reset a choice |
| Lessons | Read steps, tick them off, take the quiz (auto-graded, XP when passed) | Preview every lesson with teacher notes and the list of auto-checks |
| Builds | Upload the exported `.aia`. It's checked **in the browser** for the required components and blocks | Review queue: see the check results, write feedback, approve (awards XP) or return for changes |
| Tree | Your logo sits on your current lesson, alongside every other company's | Counts show how many companies finished each lesson |

A lesson is **complete** when **every member** passes the quiz (or the teacher excuses them) **and** the teacher approves the build.

### Supports built into every lesson
- **One step at a time** with a "Test now" checkpoint, a "Stuck? Check this" box for the most common mistakes, and day markers for multi-period lessons.
- **Fading scaffolds:** early lessons show full blocks; later ones use fill-in blanks (dashed slots) and words-only steps; every skill lesson ends with a required **Remix** described in words only, with hints revealed one at a time.
- **Accommodations:** a 🔊 read-aloud button on every step and quiz question, a "Simpler words" toggle with a plain-language version of every step, sentence starters for written tasks, "If your device can't…" fallbacks, and teacher-provided starter project links for catch-up.
- **Capstones:** idea cards that only use skills the path taught, a plan (max 3 MUST features, roles) the teacher approves, per-day sprint goals with "Done when…" checks, a stuck protocol, and a partner contribution log.
- **Solo Challenge:** after Launch Day every student builds a small app alone from a written spec, assessed individually. This is the transfer task.
- **MA DLCS alignment:** see the Standards page (teachers) and `src/curriculum/alignment.ts`.

### 📺 Class Screen (for the projector)
From a class page, tap **Class Screen**. It shows the clock, a work timer, today's mission and a question of the day (yours, or one picked from the lesson most teams are on, with Reveal), every company racing toward Launch Day, recent wins, and "Stuck? Ask an expert": teams that already finished the lesson others are on.

### App Inventor and phones

App Inventor can't be embedded in another site, because its Google sign-in and phone
pairing only work on MIT's own page. So AppVenture opens App Inventor in a second tab.
Students test live on their phone with the **MIT AI2 Companion** exactly as usual (see
the in-app *Phone setup* page). When done, they export the project
(**Projects → Export selected project (.aia)**) and upload it here. AppVenture unzips it
in the browser, reads the `.scm` and `.bky` files, and checks for things like "uses a
Clock.Timer event" or "defines a procedure". The file itself is never uploaded or stored.

## Try it locally (demo mode)

```bash
npm install
npm run dev
```

With no Firebase settings the app runs in **demo mode**: a sample class
(`Period 3 · App Development`, join code `DEMO42`) with four companies at different
points on the tree, saved in your browser. Use the bar at the bottom to switch between
the teacher and students. Open two tabs as different people and they stay in sync.

## Go live in your school Google account (recommended)

See **[DEPLOY.md](DEPLOY.md)**. AppVenture runs as a Google Apps Script web app, and all data stays in a
Google Sheet in the teacher's school Drive. Students sign in with their school accounts, and no other vendors are involved.
After changing the app, run `npm run build:appsscript` and commit `apps-script/index.html`.

## Alternative: Firebase (free tier)

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Sign-in method → Google**: enable it. Under **Settings → Authorized
   domains**, add `<your-github-username>.github.io`.
3. **Firestore Database → Create database** (production mode).
4. Deploy the security rules in `firestore.rules`. Either paste them into
   *Firestore → Rules* in the console, or run `npx firebase-tools deploy --only firestore:rules`.
5. **Project settings → Your apps → Web app**: register an app and copy the config values.
6. In GitHub: **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`
   - optional `VITE_ALLOWED_DOMAIN`: e.g. your school domain, so only school accounts can sign in
   - optional `VITE_TEACHER_EMAILS`: comma-separated list of who may pick the Teacher role

   (These are client config, not secrets. Firebase web keys are public by design, and the
   security rules protect the data.)
7. **Settings → Pages → Source: GitHub Actions**. Every push to `main` deploys the site.

For local development against Firebase, copy `.env.example` to `.env.local` and fill it in.

### What the security rules enforce
- Only a class's teacher can review submissions, award XP (approvals) or change class settings.
- Students only see their own company's submissions and teacher feedback.
- Joining a company respects the class's max company size.

## Editing the curriculum

- Lessons: `src/curriculum/lessons-*.ts` (the `Lesson` type is in `src/types.ts`)
- Tree layout, prerequisites and branches: `src/curriculum/tree.ts`
- XP levels and badges: `src/lib/progress.ts`
- `.aia` auto-checks: each lesson's `checks` array. Kinds are `component`, `block`, `event`,
  `method`, `screens`, `totalBlocks` and more (see `AiaCheck` in `src/types.ts`).

Block snippets in steps are plain text, one block per line, indented two spaces per
nesting level. They're color-coded by their first word (`when`, `set`, `call`, `if`, …).

## Tech
React + TypeScript + Vite, Firebase Auth and Firestore, JSZip, hosted on GitHub Pages.
