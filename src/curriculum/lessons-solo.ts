import type { Lesson } from '../types'

// The final, individual transfer task: each student builds a small new app alone,
// from a written spec, with no blocks given.

export const SOLO_LESSONS: Lesson[] = [
  {
    id: 'solo-build',
    title: 'Solo Challenge',
    subtitle: 'Build a new app on your own, from a written spec',
    icon: '🧗',
    track: 'launch',
    individual: true,
    concepts: ['Planning from a spec', 'Choosing the right tools', 'Testing', 'Explaining your code'],
    periods: 2,
    xp: { quiz: 50, build: 200, bonus: 100 },
    project: {
      name: 'Your Solo App',
      description:
        'Pick one spec card and build that app by yourself. No blocks are given. You decide which skills to use, then explain how your code works.',
    },
    objectives: [
      'Read a written spec and turn it into a plan',
      'Choose and combine events, variables, conditionals, loops or Clock, lists, and procedures without step-by-step help',
      'Test your app against a checklist',
      'Explain how your code works in your own words',
    ],
    intro:
      'You have built many apps with your company. Now it is your turn to show what **you** can do on your own. This time there are **no blocks** in the steps. You get a short spec (a description of what the app must do), and you decide how to build it. Every skill you need, you have already used.',
    vocab: [
      { term: 'Spec', def: 'A description of what an app must do, without saying how to build it.' },
      { term: 'Requirement', def: 'One thing the app MUST do to meet the spec.' },
      { term: 'Test checklist', def: 'A list of things to try to prove each requirement works.' },
    ],
    ideas: [
      {
        title: 'Flashcard Flipper',
        pitch:
          'Required: a list of at least 5 questions and a matching list of answers. A "Flip" button shows the answer. A "Next" button goes to the next card and wraps back to card 1 after the last one. A label shows "Card 2 of 5".',
        uses: ['lists', 'index variable', 'if (wrap around)', 'a showCard procedure'],
        stretch: 'A "Shuffle" button that starts at a random card.',
      },
      {
        title: 'Reaction Timer',
        pitch:
          'Required: press Start, then after a random wait of 1 to 4 seconds the screen turns green. Tap as fast as you can. Show how many milliseconds you took. Tapping too early shows "Too soon!".',
        uses: ['Clock', 'random integer', 'a global for the start time or a counter', 'if', 'procedures'],
        stretch: 'Keep the best time in a variable and show it.',
      },
      {
        title: 'Habit Counter',
        pitch:
          'Required: track one habit (for example "glasses of water"). A + button and a − button change the count, which can never go below 0. At a goal you choose, show a message. A Reset button sets it back to 0.',
        uses: ['global variable', 'if', 'a procedure that updates the label'],
        stretch: 'Track 3 habits using a list.',
      },
      {
        title: 'Random Team Picker',
        pitch:
          'Required: type names and add them to a list shown on screen. A "Make Teams" button splits the names into Team A and Team B by taking turns. A Clear button empties the list.',
        uses: ['lists', 'for each item loop', 'if', 'a procedure'],
        stretch: 'Shuffle the names before splitting them.',
      },
    ],
    steps: [
      {
        title: 'Read the spec and plan',
        body:
          'Pick ONE spec card below. Read it twice. Then, on paper or in the notes box, write each requirement as a numbered list, sketch your screen, and fill in the frames. You work **alone** on this challenge. You may look at your old projects, but not at a classmate\'s screen.',
        simple: 'Choose one card. Write each thing the app must do as a list. Draw your screen. Work alone.',
        frames: [
          'My app must: 1. ___ 2. ___ 3. ___',
          'I will need these components: ___.',
          'I will need these variables: ___. They start at ___.',
          'One procedure I will make is ___. It will ___.',
        ],
      },
      {
        title: 'Which skills do I need?',
        body:
          'Use this table to choose your tools:\n\n- Something happens when the user taps → an **event** (`when … Click`)\n- The app must remember a number or word → a **global variable**\n- The app must choose between two things → **if / else**\n- Something repeats every second → a **Clock**\n- Do the same thing to many items → a **list** + **for each**\n- The same blocks are needed in two places → a **procedure**',
        simple: 'Tap → event. Remember → variable. Choose → if. Repeat each second → Clock. Many items → list. Same blocks twice → procedure.',
      },
      {
        title: 'Build it',
        editor: 'blocks',
        body:
          'Build one requirement at a time, and test each one on your phone before starting the next. No blocks are given. If you get stuck, use the stuck steps: read the error, test one block with **Do It**, check names, look at an old project that did something similar, then ask your teacher (say what you tried).',
        simple: 'Build one part. Test it. Then build the next part. If you are stuck, look at your old projects first.',
        check: 'Done when: every requirement on your list works on your phone.',
        stuck: [
          'Not sure where to start? Build the Designer first, then the event that happens first.',
          'Find an old project that did something similar (Decision Maker for lists, Rocket Countdown for Clock, Tip Splitter for procedures).',
        ],
      },
      {
        title: 'Test with a checklist',
        editor: 'phone',
        day: 2,
        body:
          'For each requirement, write one test and try it: what you did, what you expected, what happened. Also try to **break** your app: tap buttons in a strange order, tap very fast, leave boxes empty. Fix what breaks.',
        simple: 'Test each requirement. Write what you did and what happened. Try to break the app, then fix it.',
        frames: ['Test: I ___. I expected ___. It ___.', 'I tried to break it by ___. Then I fixed ___.'],
        check: 'Done when: every test on your list passes.',
      },
      {
        title: 'Explain your code',
        body:
          'Export your `.aia` and submit it. In the notes, explain your code in your own words using the frames. Your teacher may also ask you to explain one part out loud.',
        simple: 'Submit your project. Explain how your code works using the sentence starters.',
        frames: [
          'The variable ___ stores ___. It changes when ___.',
          'This if checks ___ because ___.',
          'My procedure ___ does ___. I made it a procedure because ___.',
          'The hardest part was ___. I solved it by ___.',
        ],
      },
    ],
    devices: [
      { need: 'No phone today', fallback: 'Test with the emulator. All four spec cards work there.' },
      { need: 'iPhone', fallback: 'All four spec cards work in the iOS Companion.' },
    ],
    challenge: {
      title: 'Bonus: Stretch goal',
      body: 'Build the stretch feature on your spec card. Explain in your notes how you added it.',
    },
    quiz: [
      {
        q: 'A global variable count starts at 0. A button\'s Click adds 2, and then an if sets count to 0 when count > 5. You tap 3 times. What is count?',
        options: ['6', '0', '4', '2'],
        answer: 1,
        explain: 'Taps make 2, 4, then 6. After the third tap, 6 > 5 is true, so count is set back to 0.',
      },
      {
        q: 'A list is ["red", "blue", "green"]. An index variable is 3. "Next" adds 1, and if the index is bigger than the length of the list it goes back to 1. After one Next, which item is shown?',
        options: ['green', 'red', 'blue', 'An error'],
        answer: 1,
        explain: 'The index becomes 4, which is more than 3 items, so it wraps back to 1: "red".',
      },
      {
        q: 'A "for each item in list" loop runs over ["Ana", "Ben", "Cy"] and joins each name onto a label with a comma. What does the label show?',
        options: ['Cy,', 'Ana,Ben,Cy,', 'Ana,', 'Nothing'],
        answer: 1,
        explain: 'The loop runs once for each item, so all three names are added, one after another.',
      },
      {
        q: 'You have the same 4 blocks that update the score label in three different buttons. What is the best fix?',
        options: [
          'Leave it; it works',
          'Move the 4 blocks into a procedure and call it from each button',
          'Delete two of the buttons',
          'Use a Clock instead',
        ],
        answer: 1,
        explain: 'A procedure keeps the blocks in one place, so a change only has to be made once.',
      },
    ],
    checks: [
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'block', type: 'global_declaration', label: 'Uses a global variable' },
      { kind: 'anyBlock', types: ['procedures_defnoreturn', 'procedures_defreturn'], label: 'Defines a procedure' },
      { kind: 'eventCount', min: 2, label: 'Responds to at least 2 events' },
      { kind: 'totalBlocks', min: 20, label: 'Has at least 20 blocks' },
    ],
    teacherNotes:
      'This is the individual transfer assessment: every student submits their own build, and the company earns its XP only when each member is approved. Assess with four criteria (0–3 each): (1) Works: the requirements on the card work on a phone. (2) Concepts: uses at least 3 of events, variables, conditionals, loops/Clock, lists, procedures, and uses them correctly. (3) Organized: at least one procedure that removes repeated blocks; meaningful names. (4) Explains: the written frames (and an optional 1-minute conversation) show the student understands their own code. Students may look at their own old projects but not classmates\' screens. The spec cards are sized for 2 periods; Habit Counter is the most accessible, Reaction Timer the hardest. For students with IEPs, allow extra time or a reduced requirement list rather than giving blocks.',
  },
]
