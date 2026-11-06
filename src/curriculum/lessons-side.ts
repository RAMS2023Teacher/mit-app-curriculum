import type { Lesson } from '../types'

// Optional side quests that branch off the trunk. They are not required to
// progress, but they earn XP and build skills every studio uses.

export const SIDE_LESSONS: Lesson[] = [
  {
    id: 'side-design',
    title: 'Design Studio',
    subtitle: 'Side quest: make apps that look professional',
    icon: '🖌️',
    track: 'side',
    concepts: ['Layout arrangements', 'Sizing', 'Alignment', 'Visual design'],
    periods: 1,
    xp: { quiz: 30, build: 70, bonus: 30 },
    project: {
      name: 'Profile Card',
      description:
        'A polished "about us" card for your company: logo image, team names side by side, a tagline, and contact buttons, laid out neatly on any screen size.',
    },
    objectives: [
      'Use HorizontalArrangement and VerticalArrangement to position components',
      'Size components with Automatic, Fill parent, pixels, and percent',
      'Center content with AlignHorizontal and AlignVertical',
      'Choose readable fonts, colors, and spacing',
    ],
    intro:
      'By default, App Inventor stacks every component straight down the screen. Real apps put things **side by side**, center them, and leave breathing room. **Arrangements** are invisible boxes that hold other components and line them up. Today your company designs a Profile Card, a mini "about us" page you can reuse in every app you ship.',
    vocab: [
      { term: 'Arrangement', def: 'An invisible container that lines up the components inside it, in a row or a column.' },
      { term: 'Fill parent', def: 'A size setting that stretches a component to fill the space of its container.' },
      { term: 'Percent size', def: 'A size as a percentage of the screen, so it looks right on any phone.' },
      { term: 'Alignment', def: 'Where content sits inside a container: left, center, or right; top, center, or bottom.' },
    ],
    steps: [
      {
        title: 'Plan your card',
        body:
          'On paper, sketch your card with your partner: where does the logo go? The company name? Your names? Draw boxes around things that sit in a **row** (horizontal) and things that stack in a **column** (vertical). Those boxes become arrangements.',
      },
      {
        title: 'Build the outer frame',
        editor: 'designer',
        body:
          'New project: `ProfileCard`. Select **Screen1** and set **AlignHorizontal** to `Center` and pick a **BackgroundColor**.\n\nFrom the **Layout** drawer, drag in a **VerticalArrangement** `CardBox`. Set its **Width** to `90 percent`, **AlignHorizontal** to `Center`, and give it a white **BackgroundColor**. Everything else goes inside this box.',
      },
      {
        title: 'Logo and name',
        editor: 'designer',
        body:
          'Inside `CardBox`, add an **Image** `LogoImage`. Upload a picture of your company logo (Media panel → **Upload File**, or take a screenshot of your logo from this site) and set it as the **Picture**. Set its Width and Height to `120 pixels`.\n\nBelow it, add a Label `NameLabel` with your company name: **FontSize** `26`, **FontBold** checked, **TextAlignment** center. Add a second Label for your tagline in a softer color and smaller size.',
      },
      {
        title: 'Side by side',
        editor: 'designer',
        body:
          'Add a **HorizontalArrangement** inside `CardBox` with **Width** set to **Fill parent** and **AlignHorizontal** `Center`. Put two Labels in it, one for each teammate\'s name and role (for example *Lead Developer* and *Lead Designer*).\n\nAdd a second HorizontalArrangement with two Buttons: `WebsiteButton` and `ContactButton`. Give each Button **Width** `45 percent` so they share the row evenly.',
      },
      {
        title: 'Make it interactive',
        editor: 'blocks',
        body:
          'A card should do something. When **ContactButton** is tapped, show a pop-up with a **Notifier** (User Interface drawer).',
        blocks: [
          'when ContactButton.Click do',
          '  call Notifier1.ShowAlert',
          '    notice: "Email us at our school address!"',
        ],
      },
      {
        title: 'Design check and submit',
        editor: 'phone',
        body:
          'Check your card on the phone. Then turn it sideways, and if you can, view it on a different-sized phone. Does it still look good? If something is squished, switch pixel sizes to **percent** or **Fill parent**.\n\nDesign checklist:\n\n- No text touching the screen edge\n- At most 2 or 3 colors\n- Text big enough to read at arm\'s length\n\nExport your `.aia` and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Dark mode',
      body:
        'Add a `ThemeButton` that switches the card between light and dark colors with set blocks (Screen1.BackgroundColor, CardBox.BackgroundColor, and every Label\'s TextColor). Use a global variable `isDark` to remember which mode you are in.',
    },
    quiz: [
      {
        q: 'You want three buttons in one row across the screen. What should you put them in?',
        options: ['A VerticalArrangement', 'A HorizontalArrangement', 'A Notifier', 'A Label'],
        answer: 1,
        explain: 'Horizontal arrangements line components up left to right in a row.',
      },
      {
        q: 'Which size setting looks right on both small and large phones?',
        options: ['300 pixels', 'Percent or Fill parent', 'Automatic only', 'The size does not matter'],
        answer: 1,
        explain: 'Percent and Fill parent are relative to the screen, so they scale with the phone.',
      },
      {
        q: 'How do you center everything on the screen left-to-right?',
        options: [
          'Add spaces before the text',
          'Set Screen1.AlignHorizontal to Center',
          'Make every component 100 pixels wide',
          'Use a Clock',
        ],
        answer: 1,
        explain: 'AlignHorizontal controls where components sit inside the screen or an arrangement.',
      },
      {
        q: 'Which is a good design choice for a readable app?',
        options: [
          'Eight different bright colors',
          'Tiny text so more fits',
          'A few colors with strong contrast and space around the edges',
          'Text directly against the screen edge',
        ],
        answer: 2,
        explain: 'Simple color palettes, contrast, and white space make apps easier to read and use.',
      },
    ],
    checks: [
      { kind: 'component', type: 'VerticalArrangement', label: 'Uses a VerticalArrangement' },
      { kind: 'component', type: 'HorizontalArrangement', label: 'Uses a HorizontalArrangement' },
      { kind: 'component', type: 'Image', label: 'Has an Image (your logo)' },
      { kind: 'component', type: 'Label', label: 'Has at least 3 Labels', min: 3 },
      { kind: 'method', method: 'ShowAlert', label: 'Shows a Notifier alert' },
    ],
    teacherNotes:
      'Good early-finisher work after Events & Properties. Students can download their company logo from the company page and upload it as an App Inventor media file. Uploaded media count toward the 5 MB project limit (and the larger build limit), so remind them to use small images. Nested arrangements are how every later layout is built; the Paint and Game lessons assume students can put a row of buttons in a HorizontalArrangement.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'side-debug',
    title: 'Debug Detective',
    subtitle: 'Side quest: find and fix bugs like a pro',
    icon: '🔍',
    track: 'side',
    concepts: ['Debugging', 'Warnings & errors', 'Do It', 'Inspecting values'],
    periods: 1,
    xp: { quiz: 30, build: 70, bonus: 30 },
    project: {
      name: 'Bug Hunt',
      description:
        'Rebuild a broken "Snack Shop" app from the case file, track down its three bugs using real debugging tools, and write up how you solved each one.',
    },
    objectives: [
      'Read the warning (yellow) and error (red) markers on blocks',
      'Use "Do It" with the Companion to test a block and see its value',
      'Use Notifier.ShowAlert to look inside your app while it runs',
      'Recognize common bugs: text vs. number, wrong component, loose blocks, disabled blocks',
    ],
    intro:
      'Every programmer writes bugs, even the ones at big tech companies. What makes someone great is how fast they **find** them. A debugger does not guess. They gather clues, test one idea at a time, and prove what is wrong. Today your company gets a case file: a broken Snack Shop app with **three hidden bugs**. Your job is to crack the case.',
    vocab: [
      { term: 'Bug', def: 'A mistake in code that makes an app behave differently than intended.' },
      { term: 'Warning', def: 'A yellow triangle on a block: something might be wrong (like a block not attached to anything).' },
      { term: 'Error', def: 'A red X on a block: this code cannot run as written (like an empty socket).' },
      { term: 'Do It', def: 'A right-click option that runs one block on the connected phone and shows the result.' },
    ],
    steps: [
      {
        title: 'Open the case file: build the app',
        editor: 'designer',
        body:
          'New project: `BugHunt`. The Snack Shop sells chips for $2 each. Add:\n\n- A TextBox `QtyBox` (Hint `How many chips?`)\n- A Button `BuyButton` (Text `Buy`)\n- A Label `TotalLabel` (Text `Total: $0`)\n- A Label `StockLabel` (Text `In stock: 10`)\n- A **Notifier** (User Interface drawer)',
      },
      {
        title: 'Copy the buggy blocks EXACTLY',
        editor: 'blocks',
        body:
          'Build these blocks *exactly* as shown, bugs and all. Notice the last block is **not inside any event**. Leave it loose. Also: right-click the `set StockLabel.Text` block and choose **Disable Block**. That is part of the crime scene.',
        blocks: [
          'initialize global stock to: "ten"',
          'when BuyButton.Click do',
          '  set TotalLabel.Text to: join("Total: $", QtyBox.Text × 2)',
          '  set global stock to: (get global stock) - QtyBox.Text',
          '  set StockLabel.Text to: join("In stock: ", get global stock)   ← disabled',
          'set TotalLabel.Text to: "Thanks for shopping!"   ← loose, outside any event',
        ],
      },
      {
        title: 'Clue #1: warnings and errors',
        editor: 'blocks',
        body:
          'Look at the bottom-left corner of the Blocks editor: it counts warnings ⚠️ and errors ❌. Click **Show Warnings** to see them on the blocks.\n\n- The **loose block** has a warning: blocks outside an event never run. Decide whether it belongs inside `BuyButton.Click` or should be deleted.\n- **Disabled blocks** are grayed out and are skipped. Right-click → **Enable Block**.',
      },
      {
        title: 'Clue #2: inspect values',
        editor: 'phone',
        body:
          'Connect the Companion and buy 3 chips. The app crashes with an error about subtracting. Why? Use **Do It**: right-click the `get global stock` block and choose **Do It**. A bubble shows its value: `"ten"`. You cannot subtract a number from the word "ten"!\n\nAnother way to look inside a running app is a Notifier alert. Add it temporarily, then remove it once the bug is fixed:',
        blocks: ['call Notifier1.ShowAlert', '  notice: join("stock is: ", get global stock)'],
      },
      {
        title: 'Fix all three bugs',
        editor: 'blocks',
        body:
          'Fix them one at a time, and **test after each fix**:\n\n1. **Text vs. number:** change `"ten"` to the number `10`.\n2. **Disabled block:** enable the StockLabel block so the screen updates.\n3. **Loose block:** move it inside the Click handler, at the end, or delete it.\n\nThen add a guard: if `QtyBox.Text > get global stock`, call `Notifier1.ShowAlert` with `"Not enough chips!"` instead of selling.',
        blocks: [
          'when BuyButton.Click do',
          '  if QtyBox.Text > get global stock',
          '    call Notifier1.ShowAlert(notice: "Not enough chips!")',
          '  else',
          '    set TotalLabel.Text to: join("Total: $", QtyBox.Text × 2)',
          '    set global stock to: (get global stock) - QtyBox.Text',
          '    set StockLabel.Text to: join("In stock: ", get global stock)',
        ],
      },
      {
        title: 'Write the case report and submit',
        body:
          'In the **notes** box when you submit, write a short case report: for each of the 3 bugs, say **what the symptom was**, **how you found it**, and **how you fixed it**. Export your fixed `.aia` and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Plant a bug',
      body:
        'Make a copy of a working app from an earlier lesson (Projects → Save project as) and secretly plant ONE bug. Trade with another company and race to find each other\'s bugs. Describe the bug you solved in your notes.',
    },
    quiz: [
      {
        q: 'A block sits on the workspace but is not inside any "when" event. What happens to it?',
        options: ['It runs when the app starts', 'It never runs', 'It runs every second', 'It runs after every click'],
        answer: 1,
        explain: 'Blocks only run when an event triggers them (except initialize global). Loose blocks get a warning.',
      },
      {
        q: 'What does right-clicking a block and choosing "Do It" do?',
        options: [
          'Deletes the block',
          'Runs that block on the connected phone and shows its result',
          'Builds the APK',
          'Disables the block',
        ],
        answer: 1,
        explain: 'Do It is a live test. It needs the Companion connected.',
      },
      {
        q: 'A variable starts as "ten" and the app crashes when you subtract from it. What kind of bug is this?',
        options: ['A wrong component', 'A text vs. number (data type) bug', 'A layout bug', 'A Companion bug'],
        answer: 1,
        explain: 'Math needs numbers. Use the number block 10, not the text "ten".',
      },
      {
        q: 'What is the BEST debugging strategy?',
        options: [
          'Change lots of blocks at once and hope',
          'Delete the project and start over',
          'Test one idea at a time and check values as the app runs',
          'Ask your partner to fix it',
        ],
        answer: 2,
        explain: 'Change one thing, test, and gather evidence. That way you know which change fixed it.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Notifier', label: 'Has a Notifier' },
      { kind: 'method', method: 'ShowAlert', label: 'Calls Notifier.ShowAlert' },
      { kind: 'block', type: 'controls_if', label: 'Guards with an if block' },
      { kind: 'block', type: 'global_declaration', label: 'Has the stock variable' },
      { kind: 'event', component: 'Button', event: 'Click', label: 'Uses BuyButton.Click' },
    ],
    teacherNotes:
      'Best right after Conditionals, when students have enough code to make interesting bugs. The three planted bugs are the most common ones in student projects all year: type mismatch, disabled or loose blocks, and missing screen updates. Do It requires a live Companion connection. The case report in the submission notes is the real assessment; look for evidence-based reasoning ("we used Do It and saw...") rather than guessing. Note the .aia checker cannot tell whether bugs were fixed, so test the app or read the blocks when you review.',
  },
]
