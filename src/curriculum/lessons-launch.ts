import type { Lesson } from '../types'

// The final node of the tree: every studio path converges here.

export const LAUNCH_LESSONS: Lesson[] = [
  {
    id: 'launch-day',
    title: 'Launch Day',
    subtitle: 'Polish, publish, and pitch your app',
    icon: '🚀',
    track: 'launch',
    concepts: ['App metadata', 'Building an APK', 'User testing', 'Pitching'],
    periods: 3,
    xp: { quiz: 50, build: 200, bonus: 100 },
    project: {
      name: 'Your Launch Build',
      description:
        'Your capstone app, polished with a real name, icon, and version number, built into an installable .apk, tested by another company, and pitched to the class.',
    },
    objectives: [
      'Set the app\'s public identity: AppName, Icon, Title, and VersionName',
      'Build an installable Android .apk and install it on a phone',
      'Run a peer test with another company and act on their feedback',
      'Deliver a 60-second pitch: problem, solution, live demo, what\'s next',
    ],
    intro:
      'Real companies don\'t just build apps, they **ship** them. Today your capstone goes from "project" to "product." You will give it a real name and icon, build a file anyone can install, let real users try it, and then stand up and **pitch** it like you are on stage at a launch event. This is the moment your company has been leveling up for!',
    vocab: [
      { term: 'APK', def: 'Android Package: the file you install to put an app on an Android phone.' },
      { term: 'Version', def: 'A label like 1.0 or 1.1 that tells users which release they have.' },
      { term: 'Peer testing', def: 'Letting someone outside your team use the app while you watch and take notes.' },
      { term: 'Pitch', def: 'A short, convincing presentation of your product.' },
    ],
    steps: [
      {
        title: 'Give your app an identity',
        editor: 'designer',
        body:
          'Open your capstone project and select **Screen1** in the Components list. In Properties (some are under **Project Properties**, the gear button in newer versions), set:\n\n- **AppName**: the name shown under the icon on the phone (short! 12 characters or fewer)\n- **Icon**: upload a square PNG of your company logo or app icon (512×512 works well)\n- **Title**: the text at the top of the screen\n- **VersionName**: `1.0` (and **VersionCode** `1`)\n\nAlso check **Theme** and **PrimaryColor** so the app matches your company colors.',
      },
      {
        title: 'Final polish checklist',
        editor: 'designer',
        body:
          'Go through this checklist as a team:\n\n- Every component has a meaningful name (no `Button7`)\n- No placeholder text like "Text for Label1" is left on screen\n- Text is readable: big enough, good contrast\n- Every button does something, or is removed\n- Blocks editor: right-click the workspace → **Clean up Blocks**, and fix any warning (yellow triangle) or error (red X) shown in the bottom-left',
      },
      {
        title: 'Build the .apk',
        editor: 'phone',
        body:
          '1. Choose **Build → Android App (.apk)**.\n2. Wait for the progress bar. Big media files make this slower.\n3. When it finishes, a QR code appears. Scan it with an Android phone to download and install, or click **Download .apk** to save it.\n\nThe first time, the phone may ask you to allow installs from unknown sources. Ask your teacher before changing this on a school device. iPhone users: keep using the Companion for your demo; the pitch is what counts.',
      },
      {
        title: 'Peer test with another company',
        body:
          'Swap phones with another company. One person from your company watches **silently** while the tester uses your app, and writes down:\n\n- Where did they get confused or stuck?\n- What did they try that the app did not do?\n- What made them smile?\n\nThen ask the tester: "What is ONE thing we should change?" Fix at least one issue they found, bump **VersionName** to `1.1`, and rebuild.',
      },
      {
        title: 'Write your 60-second pitch',
        body:
          'Split the pitch between partners. Use this structure:\n\n1. **Problem (10 s)**: Who is this for and what do they need?\n2. **Solution (10 s)**: Your app in one sentence.\n3. **Live demo (30 s)**: Show the coolest feature working. Practice it so it works the first time!\n4. **What\'s next (10 s)**: One feature you would add in version 2.0.\n\nRehearse with a timer at least twice. If your demo depends on the Companion, have a backup screen recording.',
      },
      {
        title: 'Launch and submit',
        body:
          'Give your pitch to the class. Then export the final `.aia` (**Projects → Export selected project**) and submit it below with a link to your .apk or demo video in the link box.\n\n**Optional:** Publish your app to the **App Inventor Gallery** (My Projects → select project → **Publish to Gallery**) so anyone in the world can remix it. Only do this with your teacher\'s OK and never include personal information.',
      },
    ],
    challenge: {
      title: 'Bonus: Release notes and v2.0',
      body:
        'Write release notes for version 1.1 listing what you changed after peer testing (3+ bullet points), and actually build ONE "what\'s next" feature from your pitch as version 2.0. Put the release notes in the submission notes box.',
    },
    quiz: [
      {
        q: 'Which Screen1 property sets the name shown under the app icon on a phone\'s home screen?',
        options: ['Title', 'AppName', 'VersionName', 'AboutScreen'],
        answer: 1,
        explain: 'AppName is the installed app\'s name. Title is the text at the top of a screen while the app runs.',
      },
      {
        q: 'What is an .apk file?',
        options: [
          'The App Inventor project file you export',
          'An installable Android app package',
          'A picture used for the icon',
          'A list of your blocks',
        ],
        answer: 1,
        explain: 'The .aia is your editable project; the .apk is the installable app you give to users.',
      },
      {
        q: 'During peer testing, what should the developer watching the tester mostly do?',
        options: [
          'Explain how every button works',
          'Grab the phone when the tester gets stuck',
          'Watch quietly and write down where the tester gets confused',
          'Fix bugs while the tester is using the app',
        ],
        answer: 2,
        explain: 'Silent observation shows you how real users experience the app when you are not there to help.',
      },
      {
        q: 'After fixing issues from peer testing, why change VersionName from 1.0 to 1.1?',
        options: [
          'App Inventor requires it to build',
          'It makes the app run faster',
          'It tells users and your team this is a newer release with changes',
          'It changes the app\'s icon',
        ],
        answer: 2,
        explain: 'Version numbers track releases, so everyone knows which build they are using.',
      },
    ],
    checks: [
      { kind: 'screenProp', prop: 'Icon', label: 'Sets a custom app Icon' },
      { kind: 'screenProp', prop: 'AppName', label: 'Sets an AppName' },
      { kind: 'screenProp', prop: 'VersionName', label: 'Updates the VersionName (e.g. 1.1)' },
      { kind: 'totalBlocks', min: 40, label: 'Has at least 40 blocks' },
    ],
    teacherNotes:
      'Schedule 3 periods: polish/build, peer testing and rebuild, then pitches. Builds can queue on the MIT servers at busy times, so start them early. Installing .apks on school-managed Android devices may be blocked by MDM; a Companion demo is a fine fallback, and iOS students must use the Companion. Pair companies from different studio paths for peer testing. Inviting parents or another class to the pitches ("Launch Day Expo") raises the stakes in a good way. Gallery publishing makes projects public; check your district policy first.',
  },
]
