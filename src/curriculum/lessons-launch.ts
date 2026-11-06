import type { Lesson } from '../types'

// Every studio path converges here: polish, ship, pitch, and reflect.

export const LAUNCH_LESSONS: Lesson[] = [
  {
    id: 'launch-day',
    title: 'Launch Day',
    subtitle: 'Polish, publish, pitch, and look back',
    icon: '🚀',
    track: 'launch',
    concepts: ['App identity', 'Building an APK', 'Testing with new users', 'Pitching', 'Reflection'],
    periods: 3,
    xp: { quiz: 50, build: 200, bonus: 100 },
    project: {
      name: 'Your Launch Build',
      description:
        'Your capstone app with a real name, icon, and version number, built into an installable app, tested by someone who has never seen it, and pitched to the class.',
    },
    objectives: [
      'Set the app\'s identity: AppName, Icon, Title, and VersionName',
      'Build an installable Android .apk',
      'Test with a brand-new user and fix what they find',
      'Pitch the app live, on video, or in writing with a demo',
      'Reflect on what you learned and what you could build next on your own',
    ],
    intro:
      'Real companies do not just build apps. They **ship** them. Today your capstone goes from "project" to "product". You give it a real name and icon, build a file people can install, watch a new user try it, and **pitch** it to the class. Then you look back at how far your company has come.',
    vocab: [
      { term: 'APK', def: 'The file you install to put an app on an Android phone.' },
      { term: 'Version', def: 'A label like 1.0 or 1.1 that tells users which release they have.' },
      { term: 'Fresh user', def: 'Someone who has never seen your app before.' },
      { term: 'Pitch', def: 'A short talk that shows why your app is worth trying.' },
    ],
    steps: [
      {
        title: 'Give your app an identity',
        editor: 'designer',
        body:
          'Open your capstone and select **Screen1**. In Properties (some are under **Project Properties**, the gear button), set:\n\n- **AppName**: the name under the icon (12 letters or fewer)\n- **Icon**: upload a square PNG of your logo (512×512 works well)\n- **Title**: the text at the top of the screen\n- **VersionName** `1.0` and **VersionCode** `1`',
        simple: 'Select Screen1. Give the app a short name, an icon picture, a title, and version 1.0.',
        check: 'Test now: the title at the top of the app on your phone shows your new Title.',
        newBlocks: [
          { name: 'Icon', where: 'Screen1 → Icon (Project Properties)', what: 'The picture people tap to open your app.' },
          { name: 'VersionName', where: 'Screen1 → VersionName (Project Properties)', what: 'The version label, like 1.0.' },
        ],
        stuck: [
          'Cannot find AppName or Icon? Click the gear (Project Properties) button above the Properties panel.',
          'Icon looks stretched? Use a square picture.',
        ],
      },
      {
        title: 'Final polish checklist',
        editor: 'designer',
        body:
          'Go through this checklist as a team:\n\n- Every component has a clear name (no `Button7`)\n- No leftover text like "Text for Label1"\n- Text is big enough and easy to read\n- Every button does something, or is removed\n- Blocks: right-click the workspace → **Clean up Blocks**, then fix every ⚠ warning and ✖ error at the bottom left',
        simple: 'Check names, leftover text, readable text, and buttons. Clean up blocks and fix warnings and errors.',
        check: 'Done when: the warning and error counters at the bottom left of Blocks both show 0.',
      },
      {
        title: 'Build the .apk',
        editor: 'phone',
        body:
          '1. Choose **Build → Android App (.apk)**.\n2. Wait for the progress bar. Big pictures and sounds make it slower.\n3. Scan the QR code with an Android phone to install, or click **Download .apk**.\n\nThe phone may ask to allow installs from unknown sources. Ask your teacher first on a school device. **iPhone, or installs blocked?** Keep using the Companion for your demo. That is fine.',
        simple: 'Click Build → Android App. Scan the QR code to install it. On an iPhone, use the Companion instead.',
        check: 'Test now: the app opens from its own icon on an Android phone (or still runs in the Companion).',
      },
      {
        title: 'Test with a fresh user',
        day: 2,
        body:
          'You already tested with another company during the capstone. Now find a **fresh user**: someone who has never seen your app (a student from another class, a younger student, or a family member at home). Give them ONE sentence of instructions, then watch quietly and take notes. Fix at least one problem, change **VersionName** to `1.1`, and rebuild.',
        simple: 'Find someone who never saw your app. Say one sentence, then watch. Write down problems. Fix one and change the version to 1.1.',
        frames: [
          'They got stuck when ___.',
          'They tried to ___, but the app ___.',
          'They smiled when ___.',
          'In version 1.1 we fixed ___.',
        ],
      },
      {
        title: 'Prepare your pitch',
        body:
          'Choose the format that fits your team:\n\n- **Live** in front of the class (60 seconds)\n- **Recorded video** of your pitch and demo\n- **Written pitch** (one paragraph) plus a demo the class can try\n\nEvery partner has a part. Use the frames that fit your app. Practice with a timer twice, and keep a screen recording as a backup demo.',
        simple: 'Pick live, video, or written. Everyone has a part. Use the sentence starters. Practice two times.',
        frames: [
          'Our app is called ___. It is a ___ (game / tool / media app).',
          'It is for ___ who want to ___. / In our game you ___.',
          'Watch this: ___ (show the best feature).',
          'The hardest part to build was ___, and we solved it by ___.',
          'In version 2.0 we would add ___.',
        ],
      },
      {
        title: 'Launch and submit',
        day: 3,
        body:
          'Give your pitch. Then export the final `.aia` and submit it with a link to your .apk, video, or written pitch in the link box. Fill in the contribution log for each partner.\n\n**Optional:** publish to the **App Inventor Gallery** (select project → **Publish to Gallery**) so others can remix it. Only with your teacher\'s OK, and never with personal information.',
        simple: 'Give your pitch. Export your project and submit it. Add your link. Fill in who did what.',
      },
      {
        title: 'Look back: reflection',
        body:
          'Each partner writes their own short reflection in the submission notes. Answer all four with real examples from your app. This is how you show what YOU can now do on your own.',
        simple: 'Write your own answers to the four sentence starters. Use examples from your app.',
        frames: [
          'In our app I used ___ (variables / if / loops / lists / procedures) to ___.',
          'A bug we found was ___. We fixed it by ___.',
          'On my own, I could now build ___, because I know how to ___.',
          'Working as a company taught me ___.',
        ],
      },
    ],
    devices: [
      { need: 'iPhone or no Android phone', fallback: 'You cannot install the .apk. Demo with the Companion or a screen recording. The pitch is what counts.' },
      { need: 'Speaking in front of the class is hard for you', fallback: 'Choose the recorded video or the written pitch with a demo. Both earn full credit.' },
    ],
    challenge: {
      title: 'Bonus: Release notes and v2.0',
      body:
        'Write release notes for version 1.1 listing 3 or more changes from user testing. Then build ONE "version 2.0" feature from your pitch. Put the release notes in the submission notes.',
    },
    quiz: [
      {
        q: 'Which Screen1 property sets the name shown under the app icon on a phone?',
        options: ['Title', 'AppName', 'VersionName', 'AboutScreen'],
        answer: 1,
        explain: 'AppName is the installed app\'s name. Title is the text at the top of a screen while the app runs.',
      },
      {
        q: 'What is the difference between the .aia and the .apk?',
        options: [
          'They are the same file',
          'The .aia is your editable project; the .apk is the app people install',
          'The .apk is for iPhones',
          'The .aia is the app icon',
        ],
        answer: 1,
        explain: 'You edit and submit the .aia. You give the .apk to people who want to use the app.',
      },
      {
        q: 'Why test with a fresh user instead of your partner?',
        options: [
          'Your partner is too busy',
          'A fresh user does not already know how the app works, so you see where real people get confused',
          'Fresh users find more bugs in the blocks',
          'It is faster',
        ],
        answer: 1,
        explain: 'You and your partner know how everything works. A new user shows you what is actually confusing.',
      },
      {
        q: 'After fixing problems from testing, why change VersionName from 1.0 to 1.1?',
        options: [
          'App Inventor requires it to build',
          'It makes the app run faster',
          'It tells users and your team this is a newer release with changes',
          'It changes the app\'s icon',
        ],
        answer: 2,
        explain: 'Version numbers track releases, so everyone knows which build they have.',
      },
    ],
    checks: [
      { kind: 'screenProp', prop: 'Icon', label: 'Sets a custom app Icon' },
      { kind: 'screenProp', prop: 'AppName', label: 'Sets an AppName' },
      { kind: 'screenProp', prop: 'VersionName', label: 'Updates the VersionName (e.g. 1.1)' },
      { kind: 'totalBlocks', min: 40, label: 'Has at least 40 blocks' },
    ],
    teacherNotes:
      'Three periods: Day 1 identity, polish, build; Day 2 fresh-user test and pitch prep; Day 3 pitches, submission, reflection. Fresh users can be another class, younger students, or family (assign as homework if needed). All three pitch formats earn full credit; offer video or written privately to students with anxiety-related IEPs or newcomer ELLs. Builds can queue on MIT servers, so start early. School-managed Android devices may block .apk installs; the Companion is a fine demo. Read the individual reflections: they are your best evidence of what each student can do alone, and they feed into the Solo Challenge. Gallery publishing is public; check district policy.',
  },
]
