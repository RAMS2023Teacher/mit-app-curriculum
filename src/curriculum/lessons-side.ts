import type { Lesson } from '../types'

// Optional side quests that branch off the trunk. They are not required to
// progress, but they earn XP and build skills every studio uses.
// Nothing on the required path depends on these lessons.

export const SIDE_LESSONS: Lesson[] = [
  {
    id: 'side-design',
    title: 'Design Studio',
    subtitle: 'Side quest: make apps that look professional',
    icon: '🖌️',
    track: 'side',
    concepts: ['Layout arrangements', 'Sizing', 'Alignment', 'Visual design'],
    periods: 2,
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
      'By default, App Inventor stacks every component straight down the screen. Real apps put things **side by side**, center them, and leave empty space around the edges. **Arrangements** are invisible boxes that hold other components and line them up. Today your company designs a Profile Card, a small "about us" page you can reuse in every app you make.',
    vocab: [
      { term: 'Arrangement', def: 'An invisible box that lines up the components inside it, in a row or a column.' },
      { term: 'Fill parent', def: 'A size setting that stretches a component to fill the space of its box.' },
      { term: 'Percent size', def: 'A size as a percent of the screen, so it looks right on any phone.' },
      { term: 'Alignment', def: 'Where things sit inside a box: left, center, or right; top, center, or bottom.' },
    ],
    steps: [
      {
        title: 'Plan your card',
        body:
          'On paper, sketch your card with your partner: where does the logo go? The company name? Your names? Draw a box around things that sit in a **row** (horizontal) and things that stack in a **column** (vertical). Those boxes become arrangements.',
        simple: 'Draw your card on paper. Draw boxes around things in a row and things in a column.',
        frames: ['These things sit in a row: ___.', 'These things stack in a column: ___.'],
      },
      {
        title: 'Build the outer frame',
        editor: 'designer',
        body:
          'New project: `ProfileCard`. Select **Screen1** and set **AlignHorizontal** to `Center`.\n\n**Your choice:** pick a **BackgroundColor** for the screen and a different one for the card.\n\nFrom the **Layout** drawer, drag in a **VerticalArrangement** `CardBox`. Set its **Width** to `90 percent` and **AlignHorizontal** to `Center`. Everything else goes inside this box.',
        simple: 'Make a project called ProfileCard. Center the screen. Add a VerticalArrangement that is 90 percent wide. Pick your colors.',
        check: 'Test now: on your phone, a colored box sits in the middle of the screen with space on both sides.',
        newBlocks: [
          { name: 'VerticalArrangement', where: 'Palette → Layout', what: 'Stacks the parts inside it from top to bottom.' },
          { name: 'Width: percent', where: 'Properties panel → Width', what: 'Sets the width as a part of the screen, like 90 percent.' },
        ],
      },
      {
        title: 'Logo and name',
        editor: 'designer',
        body:
          'Inside `CardBox`, add an **Image** `LogoImage`. Upload a picture of your company logo (Media panel → **Upload File**, or a screenshot of your logo from this site) and set it as the **Picture**. Set its Width and Height to `120 pixels`.\n\nBelow it, add a Label `NameLabel` with your company name: **FontSize** `26`, **FontBold** checked, **TextAlignment** center. Add a second Label for your tagline in a softer color and smaller size.',
        simple: 'Put your logo picture and your company name inside the card. Add your tagline below it.',
        check: 'Test now: your logo and company name show in the middle of the card.',
        stuck: [
          'Picture not showing? Upload the file first (Media panel), then pick it in the Image Picture property.',
          'Use a small image file. Big pictures make the project slow.',
        ],
        newBlocks: [{ name: 'Image', where: 'Palette → User Interface', what: 'Shows a picture on the screen.' }],
      },
      {
        title: 'Side by side',
        editor: 'designer',
        day: 2,
        body:
          'Add a **HorizontalArrangement** inside `CardBox` with **Width** set to **Fill parent** and **AlignHorizontal** `Center`. Put two Labels in it, one for each teammate\'s name and role (for example *Lead Developer* and *Lead Designer*).\n\nAdd a second HorizontalArrangement with two Buttons: `WebsiteButton` and `ContactButton`. Give each Button **Width** `45 percent` so they share the row evenly.',
        simple: 'Put your two names side by side in a HorizontalArrangement. Put two buttons side by side in another one.',
        check: 'Test now: the two names sit in one row, and the two buttons share another row evenly.',
        stuck: ['Drop the labels ON the arrangement box. If they land below it, drag them into it.'],
        newBlocks: [{ name: 'HorizontalArrangement', where: 'Palette → Layout', what: 'Puts the parts inside it side by side in a row.' }],
      },
      {
        title: 'Make it interactive',
        editor: 'blocks',
        body:
          'A card should do something. When **ContactButton** is tapped, show a pop-up message with a **Notifier** (User Interface drawer). **Your choice:** write your own message.',
        simple: 'When the Contact button is tapped, show a pop-up message.',
        blocks: ['when ContactButton.Click do', '  call Notifier1.ShowAlert', '    notice: "Email us at our school address!"'],
        check: 'Test now: tap Contact. A small message pops up on the phone.',
        newBlocks: [{ name: 'Notifier.ShowAlert', where: 'Palette → User Interface → Notifier', what: 'Shows a short pop-up message.' }],
      },
      {
        title: 'Design check, remix, submit',
        editor: 'phone',
        body:
          'Check your card on the phone. Turn the phone sideways. Does it still look good? If something is squished, change pixel sizes to **percent** or **Fill parent**.\n\nDesign checklist:\n\n- No text touching the screen edge\n- At most 2 or 3 colors\n- Text big enough to read at arm\'s length\n\nDo the **Remix**, then export your `.aia` and submit it.',
        simple: 'Check the design list. Turn the phone sideways. Fix squished parts. Do the Remix and submit.',
        frames: ['One design change we made after testing was ___.'],
      },
    ],
    remix: {
      title: 'Remix: Fun facts row',
      spec: 'Add a third row to the card with three small buttons side by side, one for each fun fact about your company. When a fact button is tapped, the tagline label changes to that fun fact.',
      hints: [
        'A HorizontalArrangement can hold three buttons. Try Width 30 percent for each.',
        'Each button needs its own Click handler with set TaglineLabel.Text to …',
      ],
    },
    challenge: {
      title: 'Bonus: Dark mode',
      body:
        'Add a `ThemeButton` that switches the card between light and dark colors with set blocks (Screen1.BackgroundColor, CardBox.BackgroundColor, and each Label\'s TextColor). Use a global variable `isDark` (true or false) to remember which mode you are in.',
    },
    quiz: [
      {
        q: 'You want three buttons in one row across the screen. What should you put them in?',
        options: ['A VerticalArrangement', 'A HorizontalArrangement', 'A Notifier', 'A Label'],
        answer: 1,
        explain: 'Horizontal arrangements line components up left to right in a row.',
      },
      {
        q: 'A HorizontalArrangement is Fill parent wide. Inside are two buttons, each Width 45 percent. You add a third button that is also 45 percent. What happens?',
        options: [
          'All three fit perfectly',
          'The row is too wide (135 percent), so buttons get squished or cut off',
          'The third button goes on a new row by itself',
          'The app will not open',
        ],
        answer: 1,
        explain: '45 + 45 + 45 = 135 percent, more than the screen. Use about 30 percent each for three buttons.',
      },
      {
        q: 'How do you center everything on the screen left to right?',
        options: ['Add spaces before the text', 'Set Screen1.AlignHorizontal to Center', 'Make every component 100 pixels wide', 'Use a Clock'],
        answer: 1,
        explain: 'AlignHorizontal controls where components sit inside the screen or an arrangement.',
      },
      {
        q: 'Which is a good design choice for a readable app?',
        options: [
          'Eight different bright colors',
          'Tiny text so more fits',
          'A few colors with strong contrast and space around the edges',
          'Text right against the screen edge',
        ],
        answer: 2,
        explain: 'A few colors, strong contrast, and empty space make apps easier to read and use.',
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
      'Good early-finisher work after Events & Properties. HorizontalArrangement and Fill parent are now also taught in core Lists, so this side quest goes deeper (nesting, percent sizes, alignment, Image, Notifier) rather than being a prerequisite. Students can download their company logo from the company page and upload it as an App Inventor media file. Uploaded media count toward the project size limit, so remind them to use small images.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'side-debug',
    title: 'Debug Detective',
    subtitle: 'Side quest: find and fix bugs like a pro',
    icon: '🔍',
    track: 'side',
    concepts: ['Debugging', 'Warnings & errors', 'Do It', 'Inspecting values'],
    periods: 2,
    xp: { quiz: 30, build: 70, bonus: 30 },
    project: {
      name: 'Bug Hunt',
      description:
        'Rebuild a broken "Snack Shop" app from the case file, find its three bugs using real debugging tools, and write up how you solved each one.',
    },
    objectives: [
      'Read the warning (yellow) and error (red) markers on blocks',
      'Use "Do It" with the Companion to test a block and see its value',
      'Use Notifier.ShowAlert to look inside your app while it runs',
      'Recognize common bugs: text vs. number, wrong component, loose blocks, disabled blocks',
    ],
    intro:
      'Every programmer writes bugs, even the ones at big tech companies. Great programmers are good at **finding** them. A debugger does not guess. They look for clues, test one idea at a time, and prove what is wrong. Today your company gets a case file: a broken Snack Shop app with **three hidden bugs**. Your job is to find and fix all three.',
    vocab: [
      { term: 'Bug', def: 'A mistake in code that makes an app act differently than you wanted.' },
      { term: 'Warning', def: 'A yellow triangle on a block: something might be wrong (like a block not attached to anything).' },
      { term: 'Error', def: 'A red X on a block: this code cannot run as written (like an empty socket).' },
      { term: 'Do It', def: 'A right-click option that runs one block on the connected phone and shows the result.' },
    ],
    steps: [
      {
        title: 'Open the case file: build the app',
        editor: 'designer',
        body:
          'New project: `BugHunt`. The Snack Shop sells chips for $2 each. Add:\n\n- A TextBox `QtyBox` (Hint `How many chips?`, **NumbersOnly** checked)\n- A Button `BuyButton` (Text `Buy`)\n- A Label `TotalLabel` (Text `Total: $0`)\n- A Label `StockLabel` (Text `In stock: 10`)\n- A **Notifier** (User Interface drawer)',
        simple: 'Make a project called BugHunt. Add a number box, a Buy button, two labels, and a Notifier.',
        newBlocks: [{ name: 'Notifier', where: 'Palette → User Interface', what: 'Shows pop-up messages. It has nothing to show on the screen until you call it.' }],
      },
      {
        title: 'Copy the buggy blocks EXACTLY',
        editor: 'blocks',
        body:
          'Build these blocks *exactly* as shown, bugs and all. The last block is **not inside any event**. Leave it loose. Then right-click the `set StockLabel.Text` block and choose **Disable Block**. That is part of the case.',
        simple: 'Copy these blocks exactly, even the mistakes. Leave the last block loose. Turn off (disable) the StockLabel block.',
        blocks: [
          'initialize global stock to: "ten"',
          'when BuyButton.Click do',
          '  set TotalLabel.Text to: join("Total: $", QtyBox.Text × 2)',
          '  set global stock to: (get global stock) - QtyBox.Text',
          '  set StockLabel.Text to: join("In stock: ", get global stock)   ← disabled',
          'set TotalLabel.Text to: "Thanks for shopping!"   ← loose, outside any event',
        ],
        stuck: ['"ten" must be a TEXT block (Text drawer), not the number 10. That is one of the bugs.'],
      },
      {
        title: 'Clue #1: warnings and errors',
        editor: 'blocks',
        body:
          'Look at the bottom-left corner of the Blocks editor. It counts warnings ⚠️ and errors ❌. Click **Show Warnings** to see them on the blocks.\n\n- The **loose block** has a warning: blocks outside an event never run.\n- **Disabled blocks** are gray and are skipped when the app runs.\n\nWrite down both clues. Do not fix them yet.',
        simple: 'Click Show Warnings. Find the loose block and the gray (disabled) block. Write them down.',
        frames: ['Clue #1: the block ___ has a warning because ___.'],
      },
      {
        title: 'Clue #2: inspect values',
        editor: 'phone',
        body:
          'Connect the Companion and buy 3 chips. The app shows an error about subtracting. Why? Use **Do It**: right-click the `get global stock` block and choose **Do It**. A bubble shows its value: `"ten"`. You cannot subtract a number from the word "ten"!\n\nAnother way to look inside a running app is a Notifier alert. Add this to the top of BuyButton.Click for now, and remove it after the bug is fixed:',
        simple: 'Buy 3 chips and read the error. Right-click "get global stock" and choose Do It to see its value.',
        blocks: ['call Notifier1.ShowAlert', '  notice: join("stock is: ", get global stock)'],
        stuck: ['Do It only works while the Companion is connected.'],
        frames: ['Clue #2: Do It showed that stock was ___, so ___.'],
      },
      {
        title: 'Fix all three bugs',
        editor: 'blocks',
        day: 2,
        body:
          'Fix them one at a time, and **test after each fix**:\n\n1. **Text vs. number:** change `"ten"` to the number `10`.\n2. **Disabled block:** right-click → **Enable Block** so the screen updates.\n3. **Loose block:** move it inside the Click handler, at the end, or delete it.\n\nThen add a guard: if the quantity is more than the stock, show `"Not enough chips!"` instead of selling. **Fill the blank** with the comparison that means "more than".',
        simple: 'Fix the bugs one at a time. Test after each fix. Then add an if block so nobody can buy more chips than you have.',
        blocks: [
          'when BuyButton.Click do',
          '  if QtyBox.Text ___ get global stock',
          '    call Notifier1.ShowAlert(notice: "Not enough chips!")',
          '  else',
          '    set TotalLabel.Text to: join("Total: $", QtyBox.Text × 2)',
          '    set global stock to: (get global stock) - QtyBox.Text',
          '    set StockLabel.Text to: join("In stock: ", get global stock)',
        ],
        check: 'Test now: buy 3 chips. Total shows $6 and stock shows 7. Then try to buy 20: you see "Not enough chips!"',
        stuck: [
          'Changed two things and now it is worse? Undo one change and test again. Change one thing at a time.',
          'An empty QtyBox still causes an error? Add an "is empty" check first, like in Guess My Number.',
        ],
      },
      {
        title: 'Write the case report and submit',
        body:
          'Do the **Remix**. Then, in the **note** box when you submit, write a short case report. For each of the 3 bugs, say **what went wrong**, **how you found it**, and **how you fixed it**. Export your fixed `.aia` and submit it.',
        simple: 'Do the Remix. Write what each bug was, how you found it, and how you fixed it. Then submit.',
        frames: [
          'Bug 1: The app ___. We found it by ___. We fixed it by ___.',
          'Bug 2: The app ___. We found it by ___. We fixed it by ___.',
          'Bug 3: The app ___. We found it by ___. We fixed it by ___.',
        ],
      },
    ],
    remix: {
      title: 'Remix: Restock',
      spec: 'Add a Restock button. When it is tapped, stock goes back to 10, the stock label updates, and a pop-up says "Restocked!".',
      hints: [
        'Set the stock variable, then set the label, then call the Notifier.',
        'Test: buy 4 chips, tap Restock, and check the label says In stock: 10.',
      ],
    },
    challenge: {
      title: 'Bonus: Plant a bug',
      body:
        'Make a copy of a working app (**Projects → Save project as** makes a copy with a new name) and secretly plant ONE bug. Trade with another company and race to find each other\'s bugs. Describe the bug you solved in your notes.',
    },
    quiz: [
      {
        q: 'A block sits on the workspace but is not inside any "when" event. What happens to it?',
        options: ['It runs when the app starts', 'It never runs', 'It runs every second', 'It runs after every click'],
        answer: 1,
        explain: 'Blocks only run when an event starts them (except initialize global). Loose blocks get a warning.',
      },
      {
        q: 'stock is 10. The user types 4 and taps Buy (your fixed blocks). Then types 7 and taps Buy again. What does StockLabel show?',
        options: ['In stock: 6', 'In stock: -1', 'In stock: 3', 'In stock: 10'],
        answer: 0,
        explain: 'First buy: 10 − 4 = 6. Second buy: 7 is more than 6, so the guard shows "Not enough chips!" and stock stays 6.',
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
        explain: 'Change one thing, test, and collect evidence. Then you know which change fixed it.',
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
      'Best right after Conditionals, when students have enough code to make interesting bugs. The three planted bugs are the most common ones in student projects all year: type mismatch, disabled or loose blocks, and missing screen updates. Do It requires a live Companion connection. The case report in the submission notes is the real assessment; look for evidence-based reasoning ("we used Do It and saw...") rather than guessing. The .aia checker cannot tell whether bugs were fixed, so test the app or read the blocks when you review.',
  },
]
