import type { Lesson } from '../types'

// The trunk of the tree: core programming concepts every company learns.
// core-hello is the reference example for the format of every lesson.

export const CORE_LESSONS: Lesson[] = [
  {
    id: 'core-hello',
    title: 'Hello, App Inventor',
    subtitle: 'Build your first app and run it on your phone',
    icon: '👋',
    track: 'core',
    concepts: ['Designer vs. Blocks', 'Components', 'Events'],
    periods: 1,
    xp: { quiz: 50, build: 100, bonus: 50 },
    project: {
      name: 'Talk To Me',
      description: 'Type anything into a text box, tap a button, and your phone says it out loud.',
    },
    objectives: [
      'Start a new App Inventor project and find the Designer and Blocks editors',
      'Connect a phone with the MIT AI2 Companion app and see live changes',
      'Add components (Button, TextBox, TextToSpeech) and change their properties',
      'Write your first event handler: when Button1.Click',
    ],
    intro:
      'Every app on your phone is built from two things: the **parts you can see** (buttons, text, pictures) and the **instructions** that say what happens when you use them. In App Inventor, you lay out the parts in the **Designer** and snap together the instructions in the **Blocks** editor. Today your company builds its very first app: one that talks!',
    vocab: [
      { term: 'Component', def: 'A building piece of an app, like a Button, Label, or TextToSpeech.' },
      { term: 'Property', def: 'A setting of a component, like its Text, Color, or Width.' },
      { term: 'Event', def: 'Something that happens in the app (like a click) that your code can respond to.' },
      { term: 'Event handler', def: 'A "when ... do" block that runs code every time its event happens.' },
    ],
    steps: [
      {
        title: 'Start a project',
        editor: 'designer',
        body:
          '1. Click **Open App Inventor** (top of this page). It opens in a new tab, so keep this lesson open next to it.\n2. Sign in with your school Google account.\n3. Choose **Projects → Start new project** and name it `TalkToMe` (no spaces).\n\nYou are now in the **Designer**. The middle is a picture of your phone screen, the left is the **Palette** of components, and the right is the **Properties** panel.',
      },
      {
        title: 'Connect your phone',
        editor: 'phone',
        body:
          '1. On your phone, install **MIT AI2 Companion** from the Play Store or App Store.\n2. Make sure the phone and computer are on the **same Wi-Fi**.\n3. In App Inventor choose **Connect → AI Companion**. A QR code appears.\n4. Open the Companion on your phone and scan the code (or type the 6-letter code).\n\nYour blank app now shows on the phone. Every change you make updates live, with no installing needed. No phone? Use **Connect → Emulator** if your teacher set it up.',
      },
      {
        title: 'Add the components',
        editor: 'designer',
        body:
          'Drag these from the Palette onto the screen:\n\n- **User Interface → TextBox**: where the user types\n- **User Interface → Button**: what they tap\n- **Media → TextToSpeech**: a *non-visible* component; it shows up below the phone screen\n\nSelect **Button1** and change its **Text** property to `Speak!`. Select **TextBox1** and set its **Hint** to `Type something...`. Look at your phone: it already changed!',
      },
      {
        title: 'Snap together the blocks',
        editor: 'blocks',
        body:
          'Click **Blocks** in the top-right corner. Click **Button1** in the left panel and drag out the gold `when Button1.Click` block. Then click **TextToSpeech1** and drag `call TextToSpeech1.Speak` *inside* it. Finally click **TextBox1** and snap its `TextBox1.Text` block into the `message` socket.',
        blocks: ['when Button1.Click do', '  call TextToSpeech1.Speak', '    message: TextBox1.Text'],
      },
      {
        title: 'Test it!',
        editor: 'phone',
        body:
          'On your phone, type a sentence and tap **Speak!**. Turn your volume up. Try your company name, a joke, or a tongue twister.\n\nIf nothing happens, check that the Speak block is *inside* the Click block (it should click into place) and that your phone is not on silent.',
      },
      {
        title: 'Export and submit',
        body:
          'In App Inventor choose **Projects → Export selected project (.aia) to my computer**. Then come back here, scroll to **Submit your build**, and upload the `.aia` file. The checker will look inside to confirm your app has the right components and blocks.',
      },
    ],
    challenge: {
      title: 'Bonus: Make it yours',
      body:
        'Add a second button that says your **company slogan** out loud, and change the TextToSpeech **Pitch** or **SpeechRate** property so your app has its own voice. Add a Label at the top with your company name.',
    },
    quiz: [
      {
        q: 'Where do you drag Buttons and TextBoxes onto the screen?',
        options: ['The Blocks editor', 'The Designer', 'The AI Companion app', 'The Properties panel'],
        answer: 1,
        explain: 'The Designer is where you lay out what the app looks like. The Blocks editor is for instructions.',
      },
      {
        q: 'What is an event handler?',
        options: [
          'A setting like a color or font size',
          'A component you cannot see',
          'A "when ... do" block that runs when something happens',
          'The QR code used to connect your phone',
        ],
        answer: 2,
        explain: 'Event handlers like "when Button1.Click" wait for an event and then run the blocks inside them.',
      },
      {
        q: 'TextToSpeech appears below the phone screen in the Designer. Why?',
        options: [
          'It is broken',
          'It is a non-visible component: it does work but has nothing to show',
          'It only works on the emulator',
          'It must be dragged into an arrangement',
        ],
        answer: 1,
        explain: 'Non-visible components (sensors, sound, timers, speech) do a job without appearing on the screen.',
      },
      {
        q: 'Your phone shows the app but your changes are not appearing. What is the MOST likely fix?',
        options: [
          'Rename the project',
          'Check that the phone and computer are on the same Wi-Fi and reconnect the Companion',
          'Delete all your blocks',
          'Change the Button color',
        ],
        answer: 1,
        explain: 'The Companion needs the same network. Use Connect → Reset Connection, then connect again.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Button', label: 'Has a Button' },
      { kind: 'component', type: 'TextBox', label: 'Has a TextBox' },
      { kind: 'component', type: 'TextToSpeech', label: 'Has a TextToSpeech component' },
      { kind: 'event', component: 'Button', event: 'Click', label: 'Uses a "when Button.Click" event' },
      { kind: 'method', method: 'Speak', label: 'Calls TextToSpeech.Speak' },
    ],
    teacherNotes:
      'Most first-day trouble is the Companion connection. School Wi-Fi with client isolation can block it; if so, use the USB or emulator option, or have students install the built .apk (Build → Android App) instead. iOS Companion works but some components (like TextToSpeech voices) behave slightly differently. Pair students now; the second partner can be "navigator" reading steps aloud.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-events',
    title: 'Events & Properties',
    subtitle: 'Make your app react to taps, long presses, and startup',
    icon: '🎨',
    track: 'core',
    concepts: ['Events', 'Properties', 'Setter blocks', 'Screen.Initialize'],
    periods: 1,
    xp: { quiz: 50, build: 100, bonus: 50 },
    project: {
      name: 'Mood Switcher',
      description:
        'Tap a mood button and the whole screen changes color while a label shows how you feel. Long-press to reset.',
    },
    objectives: [
      'Explain the difference between setting a property in the Designer and changing it with a block',
      'Use set blocks to change BackgroundColor and Text while the app is running',
      'Respond to several different events: Click, LongClick, and Screen1.Initialize',
      'Predict which event handler runs when the user does something',
    ],
    intro:
      'Last time, one button did one thing. Real apps react to **lots** of events: taps, long presses, the app opening, the phone shaking. And when they react, they usually change **properties**: a color, some text, a picture. Properties you set in the Designer are how the app *starts*. **Set blocks** change them *while the app runs*. Today your company builds a Mood Switcher that repaints the whole screen.',
    vocab: [
      { term: 'Setter block', def: 'A dark green "set Component.Property to" block that changes a property while the app runs.' },
      { term: 'Getter block', def: 'A light green block that reads the current value of a property, like Label1.Text.' },
      { term: 'Screen1.Initialize', def: 'An event that runs once, right when the app opens.' },
      { term: 'LongClick', def: 'An event that happens when the user presses and holds a button.' },
    ],
    steps: [
      {
        title: 'Set up the screen',
        editor: 'designer',
        body:
          'Start a new project called `MoodSwitcher`. Add:\n\n- A **Label** at the top. Set its **FontSize** to `28` and **Text** to `How do you feel?`\n- Three **Buttons**. Set their **Text** to `Happy`, `Calm`, and `Fired Up`.\n\nTip: rename components so your blocks are easy to read. Select a button, click **Rename** at the bottom of the Components panel, and call them `HappyButton`, `CalmButton`, and `FiredUpButton`. Rename the label `MoodLabel`.',
      },
      {
        title: 'Your first setter blocks',
        editor: 'blocks',
        body:
          'Go to **Blocks**. Drag out `when HappyButton.Click`. Click **Screen1** in the left panel and find `set Screen1.BackgroundColor to`. Snap it in, then open the **Colors** drawer and plug in **yellow**. Click **MoodLabel** and add `set MoodLabel.Text to` with a text block saying `Feeling happy!`',
        blocks: [
          'when HappyButton.Click do',
          '  set Screen1.BackgroundColor to: yellow',
          '  set MoodLabel.Text to: "Feeling happy!"',
        ],
      },
      {
        title: 'More moods',
        editor: 'blocks',
        body:
          'Make an event handler for each of the other buttons. Fast trick: right-click a block and choose **Duplicate**, then use the dropdowns to change `HappyButton` to `CalmButton` and pick new colors and text.\n\nNotice: each event handler is its own separate island. The app waits, and whichever button you tap decides which island runs.',
        blocks: [
          'when CalmButton.Click do',
          '  set Screen1.BackgroundColor to: light blue',
          '  set MoodLabel.Text to: "Feeling calm..."',
          'when FiredUpButton.Click do',
          '  set Screen1.BackgroundColor to: red',
          '  set MoodLabel.Text to: "LET\'S GO!"',
        ],
      },
      {
        title: 'Long-press to reset',
        editor: 'blocks',
        body:
          'Events are not just clicks. (You might try a Label, but Labels have no click events!) Use a button instead: drag out `when HappyButton.LongClick` and set the background back to **white** and the label back to `How do you feel?`.\n\nTry it on your phone: a quick tap and a press-and-hold are two *different* events on the same button.',
        blocks: [
          'when HappyButton.LongClick do',
          '  set Screen1.BackgroundColor to: white',
          '  set MoodLabel.Text to: "How do you feel?"',
        ],
      },
      {
        title: 'Run code when the app opens',
        editor: 'blocks',
        body:
          'Click **Screen1** and drag out `when Screen1.Initialize`. Anything inside runs once, the moment the app starts. Use it to greet the user with your company name.\n\nTo see it run on the Companion, use **Connect → Refresh Companion Screen** (or reconnect), because the app has already started.',
        blocks: ['when Screen1.Initialize do', '  set MoodLabel.Text to: "Welcome to the Mood Switcher!"'],
      },
      {
        title: 'Test, export, submit',
        editor: 'phone',
        body:
          'Test every button, the long-press, and the startup message. Ask your partner to predict what each tap will do *before* you tap it. Then **Projects → Export selected project (.aia)** and upload it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Shake it off',
      body:
        'Add an **AccelerometerSensor** (Sensors drawer). Use `when AccelerometerSensor1.Shaking` to pick a surprise mood: change the color AND set a button\'s **Visible** property to false so it disappears. Make the long-press bring it back with `set ... Visible to true`.',
    },
    quiz: [
      {
        q: 'You set a Button\'s BackgroundColor to blue in the Designer. A block later sets it to red. What color is it after that block runs?',
        options: ['Blue, because the Designer always wins', 'Red', 'Purple', 'It will crash'],
        answer: 1,
        explain: 'The Designer sets the starting value. A set block changes it while the app runs.',
      },
      {
        q: 'Which event runs exactly once, when the app first opens?',
        options: ['Button1.Click', 'Screen1.Initialize', 'Button1.LongClick', 'Clock1.Timer'],
        answer: 1,
        explain: 'Screen1.Initialize is the "app just started" event.',
      },
      {
        q: 'What is the difference between "set Label1.Text to" and "Label1.Text"?',
        options: [
          'There is no difference',
          'The first changes the text; the second reads the current text',
          'The first is for buttons only',
          'The second deletes the text',
        ],
        answer: 1,
        explain: 'Dark green setter blocks change a property. Light green getter blocks read it.',
      },
      {
        q: 'A user quickly taps CalmButton. Which handler runs?',
        options: ['when CalmButton.LongClick', 'when Screen1.Initialize', 'when CalmButton.Click', 'All of them'],
        answer: 2,
        explain: 'Only the handler that matches both the component AND the event runs.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Button', label: 'Has at least 3 Buttons', min: 3 },
      { kind: 'component', type: 'Label', label: 'Has a Label' },
      { kind: 'eventCount', min: 4, label: 'Has at least 4 event handlers' },
      { kind: 'event', component: 'Button', event: 'LongClick', label: 'Uses a LongClick event' },
      { kind: 'event', component: 'Form', event: 'Initialize', label: 'Uses Screen1.Initialize' },
      { kind: 'block', type: 'component_set_get', label: 'Uses set/get property blocks', min: 4 },
    ],
    teacherNotes:
      'Big idea: event-driven programming. Students coming from Scratch expect code to run top to bottom; stress that each "when" block is an independent listener. Common snag: Screen1.Initialize appears not to run in the Companion because the screen already loaded; have them use Refresh Companion Screen. Renaming components is a habit worth enforcing now; it makes every later lesson easier to read and to grade. The Screen event in .aia files is stored with component type "Form," which is what the checker looks for.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-variables',
    title: 'Variables',
    subtitle: 'Give your app a memory',
    icon: '📦',
    track: 'core',
    concepts: ['Variables', 'Get & set', 'Math', 'Numbers vs. text'],
    periods: 1,
    xp: { quiz: 50, build: 100, bonus: 50 },
    project: {
      name: 'Tap Tycoon',
      description:
        'A clicker game: every tap earns coins, an upgrade button costs coins but doubles your earnings, and a reset button starts over.',
    },
    objectives: [
      'Create a global variable with "initialize global ... to"',
      'Read a variable with get and change it with set',
      'Use math blocks to update a value based on its old value (count = count + 1)',
      'Explain the difference between a number and text, and why "5" + "5" can surprise you',
    ],
    intro:
      'Your apps so far forget everything instantly. A game needs to remember a **score**; a shopping app needs to remember a **total**. A **variable** is a labeled box that holds a value your app can read and change. Today your company builds **Tap Tycoon**, a clicker game where the variable *is* the game.',
    vocab: [
      { term: 'Variable', def: 'A named storage box that holds a value, like a number or some text.' },
      { term: 'Global variable', def: 'A variable created outside any event so every block in the screen can use it.' },
      { term: 'Initialize', def: 'Give a variable its starting value.' },
      { term: 'Data type', def: 'The kind of value: a number (5), text ("five"), true/false, a list, and so on.' },
    ],
    steps: [
      {
        title: 'Design the game',
        editor: 'designer',
        body:
          'New project: `TapTycoon`. Add:\n\n- A Label `CoinsLabel` (FontSize `32`, Text `Coins: 0`)\n- A big Button `TapButton` (Text `💰 TAP!`, Width **Fill parent**, Height `200` pixels)\n- A Button `UpgradeButton` (Text `Upgrade (costs 10)`)\n- A Button `ResetButton` (Text `Reset`)',
      },
      {
        title: 'Make the variables',
        editor: 'blocks',
        body:
          'Open the **Variables** drawer and drag out `initialize global name to` **twice**. Click the word `name` and rename them `coins` and `perTap`. Plug in number blocks (Math drawer): `coins` starts at `0` and `perTap` starts at `1`.\n\nThese blocks sit on their own, outside any event. They run when the app starts.',
        blocks: ['initialize global coins to: 0', 'initialize global perTap to: 1'],
      },
      {
        title: 'Earn coins',
        editor: 'blocks',
        body:
          'When the player taps, the new number of coins is the **old** number plus `perTap`. Hover over the word `coins` in your initialize block to grab `get global coins` and `set global coins to`. Use the `+` block from the Math drawer.\n\nThen show the result. The **join** block (Text drawer) glues text and numbers together.',
        blocks: [
          'when TapButton.Click do',
          '  set global coins to: (get global coins) + (get global perTap)',
          '  set CoinsLabel.Text to: join("Coins: ", get global coins)',
        ],
      },
      {
        title: 'Buy an upgrade',
        editor: 'blocks',
        body:
          'Upgrading costs 10 coins and doubles `perTap`. Use the `-` and `×` blocks. (Next lesson you will learn to stop players from buying when they cannot afford it, so for now debt is allowed!)',
        blocks: [
          'when UpgradeButton.Click do',
          '  set global coins to: (get global coins) - 10',
          '  set global perTap to: (get global perTap) × 2',
          '  set CoinsLabel.Text to: join("Coins: ", get global coins)',
        ],
      },
      {
        title: 'Reset',
        editor: 'blocks',
        body: 'Set both variables back to their starting values and update the label.',
        blocks: [
          'when ResetButton.Click do',
          '  set global coins to: 0',
          '  set global perTap to: 1',
          '  set CoinsLabel.Text to: "Coins: 0"',
        ],
      },
      {
        title: 'Numbers vs. text experiment',
        editor: 'phone',
        body:
          'Play your game! Then try this experiment with your partner: change the starting value of `coins` from the number block `0` to a **text** block `"0"`. Does the game still work? (App Inventor is forgiving and turns `"0"` into a number when it can.) Now try a text block `"zero"` and tap. What error do you get? Change it back to the number `0` before you export.\n\n**Takeaway:** math only works on things that can be numbers.',
      },
      {
        title: 'Export and submit',
        body: 'Export your `.aia` (**Projects → Export selected project**) and upload it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Passive income',
      body:
        'Add a third variable `taps` that counts how many times the player has tapped (not coins!), and show it in a second label. Then make the upgrade cost grow: store the cost in a variable `upgradeCost` that doubles each purchase, and update the UpgradeButton text to show the new price.',
    },
    quiz: [
      {
        q: 'What does "set global coins to (get global coins) + 1" do?',
        options: [
          'Sets coins to 1',
          'Adds 1 to whatever coins was before',
          'Creates a new variable',
          'Nothing; you cannot use a variable in its own set block',
        ],
        answer: 1,
        explain: 'The right side is calculated first using the OLD value, then the result is stored back in coins.',
      },
      {
        q: 'Why do we put "initialize global" blocks outside of any event handler?',
        options: [
          'So every event handler on the screen can use the variable',
          'So it runs every time a button is clicked',
          'Because App Inventor has no other place for them',
          'To make the app faster',
        ],
        answer: 0,
        explain: 'Global variables belong to the whole screen, so any block can get or set them.',
      },
      {
        q: 'Which of these is TEXT, not a number?',
        options: ['42', '3.14', '"42 coins"', '-7'],
        answer: 2,
        explain: 'Anything in quotes with letters is text. You cannot do math with "42 coins".',
      },
      {
        q: 'The label always says "Coins: 0" even though coins is increasing. What is the likely bug?',
        options: [
          'The variable was never initialized',
          'The block that sets CoinsLabel.Text is missing from the Click handler, so the screen never updates',
          'The Button is too big',
          'Numbers cannot be shown in labels',
        ],
        answer: 1,
        explain: 'Changing a variable does not change the screen. You must also set the label to show it.',
      },
    ],
    checks: [
      { kind: 'block', type: 'global_declaration', label: 'Creates at least 2 global variables', min: 2 },
      { kind: 'block', type: 'lexical_variable_set', label: 'Sets a variable with "set global"', min: 2 },
      { kind: 'block', type: 'lexical_variable_get', label: 'Reads a variable with "get global"' },
      { kind: 'block', type: 'math_add', label: 'Uses the + math block' },
      { kind: 'block', type: 'text_join', label: 'Uses join to show the value' },
      { kind: 'component', type: 'Button', label: 'Has at least 3 Buttons', min: 3 },
    ],
    teacherNotes:
      'The "x = x + 1" idea is the key mental hurdle; act it out with a physical box and sticky notes (take the note out, add one, put a new note back). The text-vs-number experiment is deliberate: App Inventor coerces numeric strings, which hides type bugs that will show up in later lessons with TextBox input. Leave the "can\'t afford it" bug in on purpose; it is the hook for the Conditionals lesson.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-conditionals',
    title: 'Conditionals',
    subtitle: 'Teach your app to make decisions',
    icon: '🔀',
    track: 'core',
    concepts: ['if / else if / else', 'Comparison', 'Boolean logic', 'Random numbers'],
    periods: 2,
    xp: { quiz: 50, build: 100, bonus: 50 },
    project: {
      name: 'Guess My Number',
      description:
        'The app secretly picks a number from 1 to 100. The player guesses, and the app says "too high," "too low," or "you got it!" while counting guesses.',
    },
    objectives: [
      'Use an if / else if / else block to choose between different actions',
      'Compare values with =, <, > and ≠',
      'Combine conditions with "and" / "or"',
      'Generate a random integer and store it in a variable',
    ],
    intro:
      'Right now your apps do the exact same thing every time. Smart apps **decide**: is the password right? Did the player win? Is the input empty? An **if** block asks a true-or-false question and only runs its blocks when the answer is true. Today your company builds a guessing game where the app has to judge every guess.',
    vocab: [
      { term: 'Conditional', def: 'Code that only runs if something is true. In App Inventor: the if block.' },
      { term: 'Boolean', def: 'A value that is either true or false.' },
      { term: 'Comparison', def: 'A block that compares two values (=, ≠, <, >, ≤, ≥) and gives true or false.' },
      { term: 'Random integer', def: 'A whole number chosen by chance between two limits.' },
    ],
    steps: [
      {
        title: 'Design the game',
        editor: 'designer',
        body:
          'New project: `GuessMyNumber`. Add:\n\n- A Label `HintLabel` (Text `I am thinking of a number from 1 to 100...`)\n- A TextBox `GuessBox`. In Properties check **NumbersOnly** so the phone shows a number keyboard.\n- A Button `GuessButton` (Text `Guess!`)\n- A Label `CountLabel` (Text `Guesses: 0`)\n- A Button `NewGameButton` (Text `New Game`)',
      },
      {
        title: 'Pick a secret number',
        editor: 'blocks',
        body:
          'Create two global variables: `secret` and `guesses`. Start the secret with `random integer from 1 to 100` (Math drawer). Every time the app runs, it picks a new number.',
        blocks: ['initialize global secret to: random integer from 1 to 100', 'initialize global guesses to: 0'],
      },
      {
        title: 'Build the if / else if / else',
        editor: 'blocks',
        body:
          'Drag an **if** block (Control drawer) into `when GuessButton.Click`. Click the small **blue gear** on the if block and drag in **else if** and **else** so it has three parts.\n\nUse the Math compare block (it starts as `=`, so use its dropdown to change it to `<` or `>`).\n\nThe app checks the conditions from top to bottom and runs **only the first one that is true**.',
        blocks: [
          'when GuessButton.Click do',
          '  set global guesses to: (get global guesses) + 1',
          '  set CountLabel.Text to: join("Guesses: ", get global guesses)',
          '  if GuessBox.Text < get global secret',
          '    set HintLabel.Text to: "Too low! Go higher."',
          '  else if GuessBox.Text > get global secret',
          '    set HintLabel.Text to: "Too high! Go lower."',
          '  else',
          '    set HintLabel.Text to: "🎉 You got it!"',
        ],
      },
      {
        title: 'Start a new game',
        editor: 'blocks',
        body: 'Reset the variables and pick a new secret number. Also clear the TextBox.',
        blocks: [
          'when NewGameButton.Click do',
          '  set global secret to: random integer from 1 to 100',
          '  set global guesses to: 0',
          '  set CountLabel.Text to: "Guesses: 0"',
          '  set GuessBox.Text to: ""',
          '  set HintLabel.Text to: "New number! Guess from 1 to 100..."',
        ],
      },
      {
        title: 'Guard against bad input',
        editor: 'blocks',
        body:
          'What happens if the player taps **Guess!** with an empty box? Try it. Fix it by wrapping everything in another if: use **is empty** (Text drawer) and **not** (Logic drawer), or check the range with **and**.\n\nThis is a *nested* conditional: an if inside an if.',
        blocks: [
          'when GuessButton.Click do',
          '  if (GuessBox.Text ≥ 1) and (GuessBox.Text ≤ 100)',
          '    ...your guessing blocks from before...',
          '  else',
          '    set HintLabel.Text to: "Please type a number from 1 to 100."',
        ],
      },
      {
        title: 'Play-test with your partner',
        editor: 'phone',
        body:
          'One partner plays while the other watches. What is the smallest number of guesses that *always* works? (Hint: always guess the middle.) Then export your `.aia` and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Hot or cold',
      body:
        'Add more feedback: if the guess is within 5 of the secret, say "🔥 Super hot!" in addition to higher/lower. You will need the **absolute** block (Math drawer) or an **and** of two comparisons. Also, if the player wins in 7 guesses or fewer, show "Genius!"',
    },
    quiz: [
      {
        q: 'An if / else if / else has three conditions and the first two are both true. What runs?',
        options: ['Only the first true branch', 'Both true branches', 'The else branch', 'Nothing'],
        answer: 0,
        explain: 'The app checks from the top and stops at the first true condition.',
      },
      {
        q: 'What does "random integer from 1 to 6" do?',
        options: [
          'Always gives 1',
          'Gives a whole number from 1 to 6, chosen by chance',
          'Gives a number like 3.27',
          'Gives the numbers 1, 2, 3, 4, 5, 6 in order',
        ],
        answer: 1,
        explain: 'Like rolling a die: a whole number between the limits, including both ends.',
      },
      {
        q: 'Which condition is true ONLY when the age is between 13 and 18 (including both)?',
        options: [
          'age ≥ 13 or age ≤ 18',
          'age ≥ 13 and age ≤ 18',
          'age = 13 and age = 18',
          'age > 13 or age > 18',
        ],
        answer: 1,
        explain: '"and" needs both parts true. With "or," any age at all would pass.',
      },
      {
        q: 'Where must you put the "else" part of an if block?',
        options: [
          'In a separate block next to the if',
          'You add it with the blue gear (mutator) on the if block',
          'In the Designer',
          'Inside a Button',
        ],
        answer: 1,
        explain: 'The gear lets you drag else if / else sections into the if block.',
      },
    ],
    checks: [
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'anyBlock', types: ['math_compare', 'logic_compare'], label: 'Compares values (<, >, =)' },
      { kind: 'block', type: 'math_random_int', label: 'Picks a random integer' },
      { kind: 'block', type: 'global_declaration', label: 'Uses global variables', min: 2 },
      { kind: 'component', type: 'TextBox', label: 'Has a TextBox for guesses' },
    ],
    teacherNotes:
      'Plan two periods: build on day one, input guarding and binary-search discussion on day two. Students often use the Logic "=" block for numbers; it works, but steer them to the Math compare block for < and >. If GuessBox is empty, comparing "" to a number raises a runtime error in the Companion; this is a good live demo of why validation matters. Connect back to Tap Tycoon: have early finishers add "if coins ≥ 10" to the upgrade button.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-loops',
    title: 'Loops & Timers',
    subtitle: 'Repeat things without repeating yourself',
    icon: '🔁',
    track: 'core',
    concepts: ['for each number loop', 'Clock timer', 'while loops', 'Counting down'],
    periods: 2,
    xp: { quiz: 50, build: 120, bonus: 50 },
    project: {
      name: 'Rocket Countdown',
      description:
        'A launch control app: press Launch and a timer counts down from 10 to liftoff. A second screen area builds a full times table using a loop.',
    },
    objectives: [
      'Use a Clock component as a repeating event (a "timer loop")',
      'Turn a timer on and off with TimerEnabled and change its speed with TimerInterval',
      'Use "for each number from ... to ... by" to repeat blocks a set number of times',
      'Explain when to use a timer vs. a loop, and why a while loop can freeze your app',
    ],
    intro:
      'Computers are great at doing something over and over. There are two ways to repeat in App Inventor. A **loop** repeats blocks *instantly*, all at once, like printing a times table. A **Clock timer** repeats *over time*, once every second for example, like a countdown or a game that moves. Today your company builds a mission control app that uses both.',
    vocab: [
      { term: 'Loop', def: 'Blocks that repeat. Each repeat is called an iteration.' },
      { term: 'Clock', def: 'A non-visible component that fires a Timer event over and over.' },
      { term: 'TimerInterval', def: 'How many milliseconds between Timer events. 1000 ms = 1 second.' },
      { term: 'Infinite loop', def: 'A loop that never stops. It freezes the app.' },
    ],
    steps: [
      {
        title: 'Design mission control',
        editor: 'designer',
        body:
          'New project: `RocketCountdown`. Add:\n\n- A Label `CountLabel` (FontSize `60`, Text `10`, TextAlignment **center**)\n- A Button `LaunchButton` (Text `🚀 Launch`)\n- A Button `TableButton` (Text `Show 7 times table`)\n- A Label `TableLabel` (Text empty)\n- **Sensors → Clock**. In its properties: uncheck **TimerEnabled** (so it does not start right away) and set **TimerInterval** to `1000`.',
      },
      {
        title: 'Start the countdown',
        editor: 'blocks',
        body:
          'Make a global variable `count` starting at `10`. When Launch is clicked, reset `count` and **turn the Clock on**.',
        blocks: [
          'initialize global count to: 10',
          'when LaunchButton.Click do',
          '  set global count to: 10',
          '  set CountLabel.Text to: get global count',
          '  set Clock1.TimerEnabled to: true',
        ],
      },
      {
        title: 'The timer loop',
        editor: 'blocks',
        body:
          '`when Clock1.Timer` runs **every 1000 milliseconds** while the timer is enabled. That makes it a loop that repeats over time. Each tick, subtract 1. When the count hits 0, show liftoff and **turn the timer off**. Otherwise, it would count into negative numbers forever!',
        blocks: [
          'when Clock1.Timer do',
          '  set global count to: (get global count) - 1',
          '  if get global count ≤ 0',
          '    set CountLabel.Text to: "LIFTOFF! 🚀"',
          '    set Clock1.TimerEnabled to: false',
          '  else',
          '    set CountLabel.Text to: get global count',
        ],
      },
      {
        title: 'A for loop: the times table',
        editor: 'blocks',
        body:
          'Now repeat *instantly*. Drag out **for each number from 1 to 5 by 1** (Control drawer) and change the `to` value to `10`. The loop gives you a variable called `number` that is 1, then 2, then 3... all the way to 10.\n\nWe start the label empty and **add a new line each time around the loop**. The `\\n` text means "new line."',
        blocks: [
          'when TableButton.Click do',
          '  set TableLabel.Text to: ""',
          '  for each number from 1 to 10 by 1',
          '    set TableLabel.Text to: join(TableLabel.Text, "7 × ", get number, " = ", 7 × get number, "\\n")',
        ],
      },
      {
        title: 'Timer or loop?',
        body:
          'Talk with your partner:\n\n- Why could we **not** use a for loop for the countdown? (It would finish all 10 steps in a split second, and you would only see the last one.)\n- App Inventor also has a **while** loop: `while test do`. It repeats as long as a condition is true. If the condition never becomes false, the app **freezes**. That is an *infinite loop*. In App Inventor, use a Clock for anything that waits, and loops for quick calculations.',
      },
      {
        title: 'Test and submit',
        editor: 'phone',
        body:
          'Launch the rocket. Try changing **TimerInterval** to `500`. What happens? Show the times table. Then export your `.aia` and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Mission customization',
      body:
        'Add a TextBox where the user picks which times table to show, and use it inside your loop instead of 7. Then make the countdown dramatic: in the last 3 seconds, change the label color to red and play a **Sound** or vibrate with `call Sound1.Vibrate`.',
    },
    quiz: [
      {
        q: 'A Clock has TimerInterval = 500. How often does Clock1.Timer run?',
        options: ['Every 500 seconds', 'Every half second', 'Only once', '500 times total'],
        answer: 1,
        explain: 'TimerInterval is in milliseconds. 500 ms = 0.5 seconds.',
      },
      {
        q: 'Your countdown keeps going: -1, -2, -3... What did you forget?',
        options: [
          'To set Clock1.TimerEnabled to false when it reaches 0',
          'To add another Button',
          'To make count a text variable',
          'To use a for loop',
        ],
        answer: 0,
        explain: 'A timer repeats until you turn it off.',
      },
      {
        q: 'How many times does "for each number from 2 to 10 by 2" repeat?',
        options: ['10', '9', '5', '2'],
        answer: 2,
        explain: 'number is 2, 4, 6, 8, 10: five times.',
      },
      {
        q: 'Why is a while loop whose condition is always true dangerous?',
        options: [
          'It deletes your variables',
          'It never stops, so the app freezes',
          'It runs only once',
          'It changes the TimerInterval',
        ],
        answer: 1,
        explain: 'That is an infinite loop. The app is stuck repeating and cannot respond to the user.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Clock', label: 'Has a Clock component' },
      { kind: 'event', component: 'Clock', event: 'Timer', label: 'Uses the Clock.Timer event' },
      { kind: 'block', type: 'controls_forRange', label: 'Uses a "for each number" loop' },
      { kind: 'block', type: 'controls_if', label: 'Uses an if to stop the countdown' },
      { kind: 'block', type: 'global_declaration', label: 'Uses a global variable' },
    ],
    teacherNotes:
      'Emphasize the two kinds of repetition: loops run instantly, timers run over time. Students will instinctively try a while loop for the countdown; let a few try it and watch the Companion hang (Connect → Reset Connection recovers it). The join with "\\n" for new lines works in Labels; if a student gets a literal \\n, they typed a backslash into the wrong place. Clock.TimerAlwaysFires keeps timers running in the background; leave it at the default.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-lists',
    title: 'Lists',
    subtitle: 'Store many things in one variable',
    icon: '📋',
    track: 'core',
    concepts: ['Lists', 'Index', 'Random item', 'for each item', 'ListView'],
    periods: 2,
    xp: { quiz: 50, build: 120, bonus: 50 },
    project: {
      name: 'Decision Maker',
      description:
        'Can\'t decide where to eat or what to play? Type in your options, see them listed, and let the app pick one at random.',
    },
    objectives: [
      'Create a list with "make a list" and store it in a variable',
      'Add items, count items, and pick a random item',
      'Understand that list positions (indexes) start at 1 in App Inventor',
      'Loop through every item with "for each item in list"',
      'Show a list on screen with a ListView',
    ],
    intro:
      'A variable holds one thing. But what about a playlist, a leaderboard, or a to-do list? A **list** holds many values in order, inside one variable. Almost every real app is secretly built on lists: your messages, your photos, your contacts. Today your company builds a Decision Maker that stores options in a list and picks one.',
    vocab: [
      { term: 'List', def: 'An ordered collection of values stored in one variable.' },
      { term: 'Item', def: 'One value inside a list.' },
      { term: 'Index', def: 'The position of an item. In App Inventor the first item is index 1.' },
      { term: 'ListView', def: 'A component that shows a list on the screen as rows.' },
    ],
    steps: [
      {
        title: 'Design the app',
        editor: 'designer',
        body:
          'New project: `DecisionMaker`. Add:\n\n- A **HorizontalArrangement** (Layout drawer). Inside it, put a TextBox `OptionBox` (Hint `Add an option...`) and a Button `AddButton` (Text `Add`)\n- A Button `DecideButton` (Text `🎲 Decide for me!`)\n- A Label `ResultLabel` (FontSize `24`)\n- A Label `CountLabel`\n- A **ListView** `OptionsView` (User Interface drawer)\n- A Button `ClearButton` (Text `Clear all`)',
      },
      {
        title: 'Make a list variable',
        editor: 'blocks',
        body:
          'Create `initialize global options to` and plug in **make a list** from the **Lists** drawer. Click its blue gear to add slots, and add two or three starter options so the app works right away.',
        blocks: ['initialize global options to: make a list("Pizza", "Tacos", "Sushi")'],
      },
      {
        title: 'Show the list',
        editor: 'blocks',
        body:
          'Every time the list changes, we need to update the screen. Set the ListView\'s **Elements** to the list and show how many items there are with **length of list**. Do it when the app opens, too.\n\n(Soon you will learn to package repeated blocks like these into a *procedure*.)',
        blocks: [
          'when Screen1.Initialize do',
          '  set OptionsView.Elements to: get global options',
          '  set CountLabel.Text to: join(length of list(get global options), " options")',
        ],
      },
      {
        title: 'Add items',
        editor: 'blocks',
        body:
          'Use **add items to list**. Only add the option if the TextBox is not empty (remember conditionals!). Then clear the box and refresh the screen.',
        blocks: [
          'when AddButton.Click do',
          '  if not(is empty(OptionBox.Text))',
          '    add items to list: get global options',
          '      item: OptionBox.Text',
          '    set OptionBox.Text to: ""',
          '    set OptionsView.Elements to: get global options',
          '    set CountLabel.Text to: join(length of list(get global options), " options")',
        ],
      },
      {
        title: 'Pick one at random',
        editor: 'blocks',
        body:
          'The **pick a random item** block does the work. But if the list is empty, it causes an error, so check the length first.',
        blocks: [
          'when DecideButton.Click do',
          '  if length of list(get global options) = 0',
          '    set ResultLabel.Text to: "Add some options first!"',
          '  else',
          '    set ResultLabel.Text to: join("👉 ", pick a random item(get global options))',
        ],
      },
      {
        title: 'Loop through the list',
        editor: 'blocks',
        body:
          '**for each item in list** runs its blocks once for every item. Use it to make the Clear button announce what is being removed, then empty the list with a new empty **create empty list**.\n\nAlso try **select list item** with index `1`. Which option do you get?',
        blocks: [
          'when ClearButton.Click do',
          '  set ResultLabel.Text to: "Removed: "',
          '  for each item in list: get global options',
          '    set ResultLabel.Text to: join(ResultLabel.Text, get item, " ")',
          '  set global options to: create empty list',
          '  set OptionsView.Elements to: get global options',
          '  set CountLabel.Text to: "0 options"',
        ],
      },
      {
        title: 'Test and submit',
        editor: 'phone',
        body:
          'Add your favorite lunch spots and let the app decide. Try deciding with an empty list to make sure your guard works. Export your `.aia` and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Tap to remove',
      body:
        'Use `when OptionsView.AfterPicking` and **remove list item** with index `OptionsView.SelectionIndex` so tapping an option deletes it. Then add an AccelerometerSensor so shaking the phone makes the decision.',
    },
    quiz: [
      {
        q: 'A list is ("red", "green", "blue"). What does "select list item, index 2" give you?',
        options: ['"red"', '"green"', '"blue"', 'An error'],
        answer: 1,
        explain: 'App Inventor counts list positions starting at 1, so index 2 is the second item.',
      },
      {
        q: 'Which block tells you how many items are in a list?',
        options: ['length of list', 'pick a random item', 'is list empty?', 'make a list'],
        answer: 0,
        explain: '"length of list" returns the number of items.',
      },
      {
        q: 'Why check the length before using "pick a random item"?',
        options: [
          'Picking from an empty list causes an error',
          'It makes the pick more random',
          'Lists must have exactly 3 items',
          'It is not needed',
        ],
        answer: 0,
        explain: 'You cannot pick an item from a list that has no items.',
      },
      {
        q: 'A list has 5 items. How many times does "for each item in list" run its blocks?',
        options: ['1', '4', '5', '6'],
        answer: 2,
        explain: 'Once for every item in the list.',
      },
    ],
    checks: [
      { kind: 'anyBlock', types: ['lists_create_with'], label: 'Makes a list' },
      { kind: 'block', type: 'lists_add_items', label: 'Adds items to a list' },
      { kind: 'anyBlock', types: ['lists_pick_random_item', 'lists_select_item'], label: 'Picks or selects an item' },
      { kind: 'block', type: 'lists_length', label: 'Uses length of list' },
      { kind: 'block', type: 'controls_forEach', label: 'Loops with "for each item in list"' },
      { kind: 'component', type: 'ListView', label: 'Shows the list with a ListView' },
    ],
    teacherNotes:
      'One-based indexing is a frequent stumbling block for students who later learn Python or JavaScript; name it explicitly. Both "make a list" and "create empty list" are stored as lists_create_with in the .aia file, so either satisfies the first check. The repeated "update the screen" blocks are intentional duplication; point at them and promise the fix in the Procedures lesson. ListView.Elements requires a list; setting it to a text value is a common error.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-procedures',
    title: 'Procedures',
    subtitle: 'Write it once, use it everywhere',
    icon: '🧩',
    track: 'core',
    concepts: ['Procedures', 'Parameters', 'Return values', 'DRY code'],
    periods: 2,
    xp: { quiz: 50, build: 120, bonus: 50 },
    project: {
      name: 'Tip Splitter',
      description:
        'Enter a restaurant bill and how many people are paying. Tap 15%, 18%, or 20% to instantly see the tip, total, and what each person owes.',
    },
    objectives: [
      'Define a procedure with "to procedure do" and call it from several events',
      'Give a procedure parameters so it can work with different values',
      'Write a "to procedure result" that calculates and returns a value',
      'Explain DRY ("Don\'t Repeat Yourself") and why it makes code easier to fix',
    ],
    intro:
      'Look back at your Decision Maker: the same "update the screen" blocks appear three times. If you wanted to change them, you would have to fix all three, and miss one. A **procedure** is your own custom block: you build it once, give it a name, and use it as many times as you like. Professional programmers live by **DRY: Don\'t Repeat Yourself.** Today your company builds a Tip Splitter where three buttons share one brain.',
    vocab: [
      { term: 'Procedure', def: 'A named group of blocks that you define once and call (use) many times.' },
      { term: 'Call', def: 'To run a procedure from somewhere else in your code.' },
      { term: 'Parameter', def: 'An input to a procedure, like the tip percent, so it can work with different values.' },
      { term: 'Return value', def: 'The answer a "procedure result" sends back to wherever it was called.' },
    ],
    steps: [
      {
        title: 'Design the calculator',
        editor: 'designer',
        body:
          'New project: `TipSplitter`. Add:\n\n- TextBox `BillBox` (Hint `Bill amount`, **NumbersOnly** checked)\n- TextBox `PeopleBox` (Hint `Number of people`, **NumbersOnly** checked, Text `1`)\n- A **HorizontalArrangement** with three Buttons: `Tip15Button`, `Tip18Button`, `Tip20Button` (Text `15%`, `18%`, `20%`)\n- Labels `TipLabel`, `TotalLabel`, `EachLabel`',
      },
      {
        title: 'The repetitive way (try it first!)',
        editor: 'blocks',
        body:
          'Build just the 15% button the "long way" so you can see the problem. Then imagine copying this for 18% and 20% and changing three numbers each time. If you find a mistake later, you have to fix it in three places.',
        blocks: [
          'when Tip15Button.Click do',
          '  set TipLabel.Text to: join("Tip: $", BillBox.Text × 0.15)',
          '  set TotalLabel.Text to: join("Total: $", BillBox.Text + BillBox.Text × 0.15)',
          '  set EachLabel.Text to: join("Each: $", (BillBox.Text + BillBox.Text × 0.15) / PeopleBox.Text)',
        ],
      },
      {
        title: 'A procedure that returns a value',
        editor: 'blocks',
        body:
          'Delete those blocks. Open the **Procedures** drawer and drag out **to procedure result**. Rename it `calcTip`. Click its blue gear and add two inputs (parameters): `bill` and `percent`. It **returns** the tip amount.\n\nHover over a parameter name to get its `get` block.',
        blocks: ['to calcTip(bill, percent) result', '  get bill × get percent / 100'],
      },
      {
        title: 'A procedure that does something',
        editor: 'blocks',
        body:
          'Now drag out **to procedure do** and name it `showResults` with one parameter, `percent`. It uses `calcTip` and updates all three labels. **format as decimal** (Math drawer) rounds money to 2 places.',
        blocks: [
          'to showResults(percent) do',
          '  initialize local tip to: call calcTip(BillBox.Text, get percent)',
          '    set TipLabel.Text to: join("Tip: $", format as decimal(get tip, 2))',
          '    set TotalLabel.Text to: join("Total: $", format as decimal(BillBox.Text + get tip, 2))',
          '    set EachLabel.Text to: join("Each: $", format as decimal((BillBox.Text + get tip) / PeopleBox.Text, 2))',
        ],
      },
      {
        title: 'Call it from every button',
        editor: 'blocks',
        body:
          'Now each button is **one line**. Find `call showResults` at the bottom of the Procedures drawer once you have defined it.',
        blocks: [
          'when Tip15Button.Click do',
          '  call showResults(percent: 15)',
          'when Tip18Button.Click do',
          '  call showResults(percent: 18)',
          'when Tip20Button.Click do',
          '  call showResults(percent: 20)',
        ],
      },
      {
        title: 'Feel the power of DRY',
        editor: 'phone',
        body:
          'Test with a $40 bill and 4 people at 20% (tip $8.00, total $48.00, each $12.00).\n\nNow add input checking **in one place**: inside `showResults`, wrap everything in an if that checks that `BillBox` and `PeopleBox` are not empty and `PeopleBox.Text > 0`. All three buttons get the fix instantly. Export your `.aia` and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Custom tip & refactor',
      body:
        'Add a TextBox for a custom tip percent and a fourth button that calls `showResults` with it, with no new math needed! Then go back to your Decision Maker and replace the repeated "update the screen" blocks with a `refreshList` procedure.',
    },
    quiz: [
      {
        q: 'What is the main reason to use a procedure?',
        options: [
          'To make the app look nicer',
          'To write a group of blocks once and reuse it, so fixes happen in one place',
          'To make variables global',
          'Procedures make the phone faster',
        ],
        answer: 1,
        explain: 'Procedures remove repetition (DRY). Change the procedure once and every call uses the new version.',
      },
      {
        q: 'What is the difference between "to procedure do" and "to procedure result"?',
        options: [
          'There is no difference',
          '"result" sends back a value; "do" just runs blocks',
          '"do" can only be used once',
          '"result" cannot have parameters',
        ],
        answer: 1,
        explain: 'A result procedure plugs into a socket like a math block, because it returns an answer.',
      },
      {
        q: 'In "call showResults(percent: 18)," what is 18?',
        options: ['The name of the procedure', 'A global variable', 'The value given to the percent parameter', 'The return value'],
        answer: 2,
        explain: 'Parameters let the same procedure work with different values each time it is called.',
      },
      {
        q: 'calcTip(bill, percent) returns bill × percent / 100. What does calcTip(50, 20) return?',
        options: ['70', '10', '1000', '2.5'],
        answer: 1,
        explain: '50 × 20 / 100 = 10.',
      },
    ],
    checks: [
      { kind: 'block', type: 'procedures_defreturn', label: 'Defines a procedure that returns a result' },
      { kind: 'block', type: 'procedures_defnoreturn', label: 'Defines a "to procedure do"' },
      { kind: 'anyBlock', types: ['procedures_callnoreturn', 'procedures_callreturn'], label: 'Calls a procedure' },
      { kind: 'block', type: 'procedures_callnoreturn', label: 'Calls a procedure from 3 places', min: 3 },
      { kind: 'block', type: 'math_multiply', label: 'Uses multiplication' },
    ],
    teacherNotes:
      'Have students build the repetitive version first; the pain is the lesson. Parameters vs. arguments vocabulary is optional at this level; "inputs" is fine. The local variable (initialize local ... in) is new here and is stored as local_declaration_statement; it is not required by the checker, so students may instead call calcTip three times inside showResults. This is the last trunk lesson before the studio branch, so use the review to make sure every company can read and write procedures, which all three capstones require.',
  },
]
