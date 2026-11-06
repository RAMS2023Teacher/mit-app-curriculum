import type { Lesson } from '../types'

// The trunk of the tree: core programming concepts every company learns.
// Scaffolding fades across the trunk:
//   hello, events      → full blocks shown
//   variables, conds   → some blocks have ___ blanks to fill in
//   loops, lists, procs→ blanks plus at least one "words only" step
// Every lesson ends with a required Remix (a new feature described in words only).

export const CORE_LESSONS: Lesson[] = [
  {
    id: 'core-hello',
    title: 'Hello, App Inventor',
    subtitle: 'Build your first app and run it on your phone',
    icon: '👋',
    track: 'core',
    concepts: ['Designer vs. Blocks', 'Components', 'Events'],
    periods: 2,
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
      { term: 'Event', def: 'Something that happens in the app (like a tap) that your code can respond to.' },
      { term: 'Event handler', def: 'A "when ... do" block that runs its blocks every time its event happens.' },
    ],
    steps: [
      {
        title: 'Start a project',
        editor: 'designer',
        body:
          '1. Click **Open App Inventor**. It opens in a new tab, so keep this lesson open next to it.\n2. Sign in with your school Google account.\n3. Choose **Projects → Start new project** and name it `TalkToMe` (no spaces).\n\nYou are now in the **Designer**. The middle is a picture of your phone screen. The left side is the **Palette** of components. The right side is the **Properties** panel.',
        simple:
          'Open App Inventor in a new tab. Sign in. Make a new project called TalkToMe. The middle of the screen shows your phone.',
        stuck: [
          'Project names cannot have spaces. Use TalkToMe, not Talk To Me.',
          'Do not see the Designer? Click the Designer button in the top-right corner.',
        ],
      },
      {
        title: 'Connect your phone',
        editor: 'phone',
        body:
          '1. On your phone, install **MIT AI2 Companion** from the Play Store or App Store.\n2. Put the phone and the computer on the **same Wi-Fi**.\n3. In App Inventor choose **Connect → AI Companion**. A QR code appears.\n4. Open the Companion on your phone and scan the code (or type the 6-letter code).\n\nYour blank app now shows on the phone. Every change you make updates live.',
        simple:
          'Get the MIT AI2 Companion app on your phone. Use the same Wi-Fi as the computer. In App Inventor click Connect, then AI Companion, and scan the code.',
        check: 'Test now: your phone shows a blank white screen with the title Screen1.',
        stuck: [
          'Stuck on "connecting"? Choose Connect → Reset Connection, close the Companion app, and try again.',
          'The Companion says it is out of date? Update it from the app store.',
          'Still not working? Look at the "If your device can\'t…" box for other ways to test.',
        ],
      },
      {
        title: 'Add the components',
        editor: 'designer',
        body:
          'Drag these from the Palette onto the screen:\n\n- **User Interface → TextBox**: where the user types\n- **User Interface → Button**: what they tap\n- **Media → TextToSpeech**: it does a job but has nothing to show, so it appears *below* the phone screen\n\n**Your choice:** select **Button1** and change its **Text** to any word you like, such as `Speak!` or `Talk!`. Select **TextBox1** and set its **Hint** to `Type something...`.',
        simple:
          'Drag a TextBox, a Button, and a TextToSpeech onto the screen. Change the Button text to a word you like.',
        check: 'Test now: your phone shows a text box and a button with your word on it.',
        stuck: ['Cannot find TextToSpeech? It is in the Media drawer, not User Interface.'],
        newBlocks: [
          { name: 'TextBox', where: 'Palette → User Interface', what: 'A box where the user can type.' },
          { name: 'TextToSpeech', where: 'Palette → Media', what: 'Reads text out loud.' },
        ],
      },
      {
        title: 'Snap together the blocks',
        editor: 'blocks',
        day: 2,
        body:
          'Click **Blocks** in the top-right corner. Click **Button1** in the left panel and drag out the gold `when Button1.Click` block. Then click **TextToSpeech1** and drag `call TextToSpeech1.Speak` *inside* it. Finally click **TextBox1** and snap its `TextBox1.Text` block into the `message` socket.',
        simple:
          'Go to Blocks. Put "when Button1.Click" on the page. Put "call TextToSpeech1.Speak" inside it. Plug "TextBox1.Text" into the message spot.',
        blocks: ['when Button1.Click do', '  call TextToSpeech1.Speak', '    message: TextBox1.Text'],
        stuck: [
          'The Speak block must click INTO the Click block. If it floats beside it, it never runs.',
          'Use the light green TextBox1.Text block (it reads the text), not the dark green "set" block.',
        ],
      },
      {
        title: 'Test it!',
        editor: 'phone',
        body:
          'On your phone, type a sentence and tap your button. Turn your volume up. Try your company name or a tongue twister.',
        simple: 'Type a sentence on your phone. Tap the button. Listen.',
        check: 'Test now: the phone says the words you typed.',
        stuck: [
          'No sound? Check the phone is not on silent and the media volume is up.',
          'Nothing happens? Look for a yellow or red mark on your blocks. A block outside an event never runs.',
        ],
      },
      {
        title: 'Export and submit',
        body:
          'Do the **Remix** below first. Then choose **Projects → Export selected project (.aia) to my computer**. Come back here, go to **Ship it**, and upload the `.aia` file. The checker looks inside it to see if your app has the right components and blocks.',
        simple: 'Do the Remix. Then export your project as an .aia file and upload it in Ship it.',
      },
    ],
    remix: {
      title: 'Remix: Echo label',
      spec: 'Add a Label at the top of the screen. When the button is tapped, the app should still speak, AND the Label should show the same words the user typed.',
      hints: [
        'You need one more block inside the same when Button1.Click.',
        'Click the Label in the Blocks panel and look for a dark green "set Label1.Text to" block.',
        'Plug TextBox1.Text into it, the same way you did for Speak.',
      ],
    },
    devices: [
      { need: 'No phone in class', fallback: 'Pair with a partner who has one, or ask your teacher about Connect → Emulator.' },
      {
        need: 'iPhone',
        fallback: 'The MIT AI2 Companion is on the App Store. Most things work. If something does not, test on a partner\'s Android phone.',
      },
      {
        need: 'School Wi-Fi blocks the Companion',
        fallback: 'Use Build → Android App (.apk) and scan the code to install your app. Rebuild after each change. Or connect with a USB cable if your teacher has set it up.',
      },
    ],
    challenge: {
      title: 'Bonus: Make it yours',
      body:
        'Add a second button that says your **company slogan** out loud. Change the TextToSpeech **Pitch** or **SpeechRate** property so your app has its own voice. Add a Label at the top with your company name.',
    },
    quiz: [
      {
        q: 'Where do you drag Buttons and TextBoxes onto the screen?',
        options: ['The Blocks editor', 'The Designer', 'The AI Companion app', 'The Properties panel'],
        answer: 1,
        explain: 'The Designer is where you lay out what the app looks like. The Blocks editor is for instructions.',
      },
      {
        q: 'Your blocks are: when Button1.Click → call TextToSpeech1.Speak, message: TextBox1.Text. The user types "pizza" and taps the button. What happens?',
        options: ['The phone says "TextBox1"', 'The phone says "pizza"', 'Nothing, until the app restarts', 'The text box is cleared'],
        answer: 1,
        explain: 'TextBox1.Text reads whatever is in the box right now, and Speak says it.',
      },
      {
        q: 'TextToSpeech appears below the phone screen in the Designer. Why?',
        options: [
          'It is broken',
          'It does a job but has nothing to show on the screen',
          'It only works on the emulator',
          'It must be dragged into a box',
        ],
        answer: 1,
        explain: 'Non-visible components (sensors, sound, timers, speech) work without appearing on the screen.',
      },
      {
        q: 'Your phone shows the app but your changes are not appearing. What is the BEST first fix?',
        options: [
          'Rename the project',
          'Check both devices are on the same Wi-Fi, then Connect → Reset Connection and connect again',
          'Delete all your blocks',
          'Change the Button color',
        ],
        answer: 1,
        explain: 'The Companion needs the same network. Reset the connection, then connect again.',
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
      'Day 1 is setup (accounts, Companion install, first connection); day 2 is blocks and the remix. Most first-day trouble is the Companion connection. School Wi-Fi with client isolation can block it; if so, use USB, the emulator, or have students install the built .apk. iOS Companion works but some components behave slightly differently. Pair students now; the second partner can be the "navigator" who reads steps aloud and checks each "Test now" box.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-events',
    title: 'Events & Properties',
    subtitle: 'Make your app react to taps, long presses, and startup',
    icon: '🎨',
    track: 'core',
    concepts: ['Events', 'Properties', 'Setter blocks', 'Screen.Initialize'],
    periods: 2,
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
      'Real apps react to **lots** of events: taps, long presses, the app opening. When they react, they usually change **properties**: a color, some text, a picture. Properties you set in the Designer are how the app *starts*. **Set blocks** change them *while the app runs*. Today your company builds a Mood Switcher that changes the color of the whole screen.',
    vocab: [
      { term: 'Setter block', def: 'A dark green "set Component.Property to" block that changes a property while the app runs.' },
      { term: 'Getter block', def: 'A light green block that reads the current value of a property, like Label1.Text.' },
      { term: 'Screen1.Initialize', def: 'An event that runs once, right when the app opens.' },
      { term: 'LongClick', def: 'An event that happens when the user presses and holds a button.' },
    ],
    steps: [
      {
        title: 'Set up the screen (your moods!)',
        editor: 'designer',
        body:
          'Start a new project called `MoodSwitcher`. Add a **Label** at the top: FontSize `28`, Text `How do you feel?`. Add three **Buttons**.\n\n**Your choice:** pick three moods and type them as the button Text (for example `Happy`, `Calm`, `Excited`).\n\nRename the components so your blocks are easy to read: select a button, click **Rename** under the Components list, and use names like `HappyButton`. Rename the label `MoodLabel`.',
        simple:
          'Make a project called MoodSwitcher. Add one Label and three Buttons. Choose three moods for the buttons. Rename each part so the name says what it is.',
        check: 'Test now: your phone shows the label and your three mood buttons.',
        stuck: ['Rename changes the name in your blocks. Text changes the words people see. They are different.'],
      },
      {
        title: 'Your first setter blocks',
        editor: 'blocks',
        body:
          'Go to **Blocks**. Drag out `when HappyButton.Click`. Click **Screen1** in the left panel and find `set Screen1.BackgroundColor to`. Snap it in, then open the **Colors** drawer and plug in a color. Click **MoodLabel** and add `set MoodLabel.Text to` with a text block (Text drawer) that has your own message.',
        simple:
          'When the first mood button is tapped, change the screen color and change the label words.',
        blocks: [
          'when HappyButton.Click do',
          '  set Screen1.BackgroundColor to: yellow',
          '  set MoodLabel.Text to: "Feeling happy!"',
        ],
        check: 'Test now: tap your first mood button. The screen changes color and the label changes.',
        stuck: ['Use the empty " " block from the Text drawer, then click inside it to type your message.'],
        newBlocks: [{ name: 'set … to (setter)', where: 'click a component in the Blocks panel', what: 'Changes a property while the app runs.' }],
      },
      {
        title: 'More moods',
        editor: 'blocks',
        body:
          'Make an event handler for each of the other buttons. Fast trick: right-click a block and choose **Duplicate**, then use the dropdowns to change the button name and pick new colors and text.\n\nEach event handler is separate. The app waits, and the button you tap decides which handler runs.',
        simple: 'Copy the blocks for your other two buttons. Change the button name, color, and message.',
        blocks: [
          'when CalmButton.Click do',
          '  set Screen1.BackgroundColor to: light blue',
          '  set MoodLabel.Text to: "Feeling calm..."',
          'when ExcitedButton.Click do',
          '  set Screen1.BackgroundColor to: red',
          '  set MoodLabel.Text to: "LET\'S GO!"',
        ],
        check: 'Test now: each button gives a different color and message.',
        stuck: [
          'Red error "duplicate event handler"? Two blocks say the same button. Change the dropdown on the copy.',
        ],
      },
      {
        title: 'Long-press to reset',
        editor: 'blocks',
        day: 2,
        body:
          'Events are not just quick taps. Drag out `when HappyButton.LongClick` and set the background back to **white** and the label back to `How do you feel?`.\n\nOn your phone, a quick tap and a press-and-hold are two *different* events on the same button.',
        simple: 'Press and hold the first button to reset the screen to white.',
        blocks: [
          'when HappyButton.LongClick do',
          '  set Screen1.BackgroundColor to: white',
          '  set MoodLabel.Text to: "How do you feel?"',
        ],
        check: 'Test now: hold the first button for about one second. The screen turns white again.',
        stuck: ['Labels have no Click or LongClick events. Use a Button.'],
      },
      {
        title: 'Run code when the app opens',
        editor: 'blocks',
        body:
          'Click **Screen1** and drag out `when Screen1.Initialize`. Anything inside runs once, the moment the app starts. Use it to greet the user with your company name.',
        simple: 'Screen1.Initialize runs once when the app opens. Use it to show a welcome message.',
        blocks: ['when Screen1.Initialize do', '  set MoodLabel.Text to: "Welcome to the Mood Switcher!"'],
        check: 'Test now: use Connect → Refresh Companion Screen. You should see your welcome message.',
        stuck: [
          'Nothing changed? The app already started before you added the block. Refresh the Companion screen.',
        ],
      },
      {
        title: 'Test, remix, export',
        editor: 'phone',
        body:
          'Ask your partner to **predict** what each tap will do *before* you tap it. Then do the **Remix** below. Export your `.aia` (**Projects → Export selected project**) and upload it in Ship it.',
        simple: 'Guess what each tap will do, then tap to check. Do the Remix. Export and upload.',
        frames: ['I predict that tapping ___ will ___.', 'I was right / wrong because ___.'],
      },
    ],
    remix: {
      title: 'Remix: Mystery button',
      spec: 'Add a fourth button with the text "?". When it is tapped, its own text changes to "Again?" and the screen turns a color you have not used yet. When it is long-pressed, its text goes back to "?".',
      hints: [
        'You need two new handlers: Click and LongClick for the new button.',
        'A button can change its own text: set MysteryButton.Text to …',
      ],
    },
    challenge: {
      title: 'Bonus: Shake for a surprise',
      body:
        'An **AccelerometerSensor** (Sensors drawer) notices when the phone moves. Add one, and use `when AccelerometerSensor1.Shaking` to pick a surprise mood: change the color AND set a button\'s **Visible** property to false so it disappears. Make the long-press bring it back with `set ... Visible to true`.',
    },
    quiz: [
      {
        q: 'You set a Button\'s BackgroundColor to blue in the Designer. A block later sets it to red. What color is it after that block runs?',
        options: ['Blue, because the Designer always wins', 'Red', 'Purple', 'It will crash'],
        answer: 1,
        explain: 'The Designer sets the starting value. A set block changes it while the app runs.',
      },
      {
        q: 'The app has: when Screen1.Initialize → set Label1.Text to "Hi", and when Button1.Click → set Label1.Text to "Bye". The app opens. Nobody taps anything. What does the label say?',
        options: ['Nothing', '"Hi"', '"Bye"', 'The text from the Designer'],
        answer: 1,
        explain: 'Initialize runs once when the app opens. The Click handler waits for a tap.',
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
    periods: 2,
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
      'Your apps so far forget everything right away. A game needs to remember a **score**. A shopping app needs to remember a **total**. A **variable** is a labeled box that holds a value your app can read and change. Today your company builds **Tap Tycoon**, a clicker game where the variable *is* the game.',
    vocab: [
      { term: 'Variable', def: 'A named storage box that holds a value, like a number or some text.' },
      { term: 'Global variable', def: 'A variable made outside any event, so every block on the screen can use it.' },
      { term: 'Initialize', def: 'Give a variable its starting value.' },
      { term: 'Data type', def: 'The kind of value: a number (5), text ("five"), true/false, a list, and so on.' },
    ],
    steps: [
      {
        title: 'Design the game',
        editor: 'designer',
        body:
          'New project: `TapTycoon`. Add:\n\n- A Label `CoinsLabel` (FontSize `32`, Text `Coins: 0`)\n- A big Button `TapButton` (Width **Fill parent**, Height `200` pixels)\n- A Button `UpgradeButton` (Text `Upgrade (costs 10)`)\n- A Button `ResetButton` (Text `Reset`)\n\n**Your choice:** pick the TapButton text and what your game collects (coins, cookies, gems...).',
        simple:
          'Make a project called TapTycoon. Add a label, one big tap button, an upgrade button, and a reset button. Choose what your game collects.',
        check: 'Test now: the tap button stretches across the whole phone screen.',
        newBlocks: [
          { name: 'Width: Fill parent', where: 'Properties panel → Width', what: 'Makes a part as wide as the space it is in.' },
          { name: 'Height in pixels', where: 'Properties panel → Height', what: 'Sets an exact height, like 200 pixels.' },
        ],
      },
      {
        title: 'Make the variables',
        editor: 'blocks',
        body:
          'Open the **Variables** drawer and drag out `initialize global name to` **twice**. Click the word `name` and rename them `coins` and `perTap`. Plug in number blocks (Math drawer): `coins` starts at `0` and `perTap` starts at `1`.\n\nThese blocks sit on their own, outside any event. They run when the app starts.',
        simple: 'Make two variables: coins starts at 0, and perTap starts at 1. Keep them outside the event blocks.',
        blocks: ['initialize global coins to: 0', 'initialize global perTap to: 1'],
        newBlocks: [{ name: 'initialize global', where: 'Variables drawer', what: 'Makes a variable and gives it a starting value.' }],
      },
      {
        title: 'Earn coins (fill the blank)',
        editor: 'blocks',
        body:
          'When the player taps, the new number of coins is the **old** number plus `perTap`. Hover over the word `coins` in your initialize block to grab `get global coins` and `set global coins to`. Use the `+` block from the Math drawer.\n\n**Fill the blank** with the block that tells how many coins one tap is worth. Then show the result with **join** (Text drawer), which glues text and numbers together.',
        simple: 'Each tap adds perTap to coins. Then show coins in the label. Fill the blank yourself.',
        blocks: [
          'when TapButton.Click do',
          '  set global coins to: (get global coins) + ___',
          '  set CoinsLabel.Text to: join("Coins: ", get global coins)',
        ],
        check: 'Test now: each tap adds 1 to the label: Coins: 1, Coins: 2, Coins: 3.',
        stuck: [
          'Cannot find "get global coins"? Hover your mouse over the word coins in the initialize block, or open the Variables drawer and pick coins from the dropdown.',
          'The label does not change? Changing a variable does not change the screen. You need the set CoinsLabel.Text block too.',
        ],
        newBlocks: [
          { name: 'get / set global', where: 'Variables drawer, or hover over the variable name', what: 'get reads the box; set puts a new value in the box.' },
          { name: 'join', where: 'Text drawer', what: 'Glues pieces of text and numbers into one text.' },
        ],
      },
      {
        title: 'Buy an upgrade (fill the blanks)',
        editor: 'blocks',
        day: 2,
        body:
          'Upgrading costs 10 coins and doubles `perTap`. Fill the first blank with the number you take away. Fill the second blank with the number you multiply by. Use the `-` and `×` blocks from the Math drawer. (For now coins can go below zero. Next lesson you will fix that.)',
        simple: 'Upgrade takes away 10 coins and doubles perTap. Fill in the two numbers.',
        blocks: [
          'when UpgradeButton.Click do',
          '  set global coins to: (get global coins) - ___',
          '  set global perTap to: (get global perTap) × ___',
          '  set CoinsLabel.Text to: join("Coins: ", get global coins)',
        ],
        check: 'Test now: tap 10 times, then Upgrade. Coins goes to 0, and each tap now adds 2.',
      },
      {
        title: 'Reset (words only)',
        editor: 'blocks',
        body:
          'Build this one without a picture: when **ResetButton** is clicked, set **both** variables back to their starting values, and set the label back to `Coins: 0`.',
        simple: 'When Reset is tapped, put coins back to 0, perTap back to 1, and fix the label.',
        check: 'Test now: tap a few times, upgrade, then Reset. The label says Coins: 0 and each tap adds 1 again.',
        stuck: ['Look at your initialize blocks. Reset uses the same starting numbers.'],
      },
      {
        title: 'Numbers vs. text experiment',
        editor: 'phone',
        body:
          'With your partner: change the starting value of `coins` from the number block `0` to a **text** block `"0"`. Does the game still work? (App Inventor turns `"0"` into a number when it can.) Now try a text block `"zero"` and tap. What error do you get? Change it back to the number `0`.\n\n**Takeaway:** math only works on things that can be numbers.',
        simple: 'Try "0" and "zero" as the starting value. See which one breaks the math. Then change it back to the number 0.',
        frames: ['When coins started as "zero", the app ___.', 'Math only works when ___.'],
      },
      {
        title: 'Remix, export, submit',
        body: 'Do the **Remix** below. Then export your `.aia` (**Projects → Export selected project**) and upload it in Ship it.',
        simple: 'Do the Remix. Export your project and upload it.',
      },
    ],
    remix: {
      title: 'Remix: Sticker shop',
      spec: 'Add a "Buy sticker" button. A sticker costs 3 coins. Make a new variable that counts stickers. Show "Stickers: N" in a new label. Reset should set stickers back to 0 too.',
      hints: [
        'You need a third initialize global block, a new Button, and a new Label.',
        'Buying does two things to variables: coins goes down by 3 and stickers goes up by 1.',
        'Copy the join block you used for coins and change the words.',
      ],
    },
    challenge: {
      title: 'Bonus: Rising prices',
      body:
        'Add a variable `taps` that counts how many times the player has tapped (not coins), and show it in another label. Then make the upgrade cost grow: store the cost in a variable `upgradeCost` that doubles each time someone buys, and update the UpgradeButton text to show the new price.',
    },
    quiz: [
      {
        q: 'What does "set global coins to (get global coins) + 1" do?',
        options: [
          'Sets coins to 1',
          'Adds 1 to whatever coins was before',
          'Makes a new variable',
          'Nothing; you cannot use a variable in its own set block',
        ],
        answer: 1,
        explain: 'The right side is worked out first using the OLD value, then the result goes back in coins.',
      },
      {
        q: 'coins is 4 and perTap is 2. The player taps TapButton twice, then taps Upgrade (coins − 10, perTap × 2). What does coins equal now?',
        options: ['8', '-2', '-6', '0'],
        answer: 1,
        explain: '4 + 2 + 2 = 8, then 8 − 10 = −2. Without an if block, coins can go below zero.',
      },
      {
        q: 'Which of these is TEXT, not a number?',
        options: ['42', '3.14', '"42 coins"', '-7'],
        answer: 2,
        explain: 'Anything in quotes with letters is text. You cannot do math with "42 coins".',
      },
      {
        q: 'The label always says "Coins: 0" even though coins is going up. What is the likely bug?',
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
      'The "x = x + 1" idea is the key mental hurdle; act it out with a physical box and sticky notes (take the note out, add one, put a new note back). This is the first lesson with blanks (___) and a words-only step; model how to read a blank before students start. The text-vs-number experiment is deliberate: App Inventor converts numeric text, which hides type bugs that show up later with TextBox input. Leave the "can\'t afford it" bug in on purpose; it is the hook for the Conditionals lesson.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-conditionals',
    title: 'Conditionals',
    subtitle: 'Teach your app to make decisions',
    icon: '🔀',
    track: 'core',
    concepts: ['if / else if / else', 'Comparison', 'Boolean logic', 'Random numbers'],
    periods: 3,
    xp: { quiz: 50, build: 100, bonus: 50 },
    project: {
      name: 'Guess My Number',
      description:
        'The app secretly picks a number from 1 to 100. The player guesses, and the app says "too high," "too low," or "you got it!" while counting guesses.',
    },
    objectives: [
      'Use an if / else if / else block to choose between different actions',
      'Compare values with =, <, > and ≠',
      'Check user input before using it (empty, not a number, out of range)',
      'Generate a random integer and store it in a variable',
    ],
    intro:
      'Right now your apps do the same thing every time. Smart apps **decide**: Is the password right? Did the player win? Is the box empty? An **if** block asks a true-or-false question and only runs its blocks when the answer is true. Today your company builds a guessing game where the app judges every guess.',
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
        simple: 'Make a project called GuessMyNumber. Add two labels, a text box for numbers, a Guess button, and a New Game button.',
        check: 'Test now: tapping the text box on your phone opens a number keyboard.',
      },
      {
        title: 'Pick a secret number',
        editor: 'blocks',
        body:
          'Make two global variables: `secret` and `guesses`. Start `secret` with `random integer from 1 to 100` (Math drawer). Every time the app runs, it picks a new number.',
        simple: 'Make two variables. secret starts as a random number from 1 to 100. guesses starts at 0.',
        blocks: ['initialize global secret to: random integer from 1 to 100', 'initialize global guesses to: 0'],
        newBlocks: [{ name: 'random integer from … to …', where: 'Math drawer', what: 'Picks a whole number by chance, like rolling a die.' }],
      },
      {
        title: 'Build the if / else if / else (fill the blanks)',
        editor: 'blocks',
        body:
          'Drag an **if** block (Control drawer) into `when GuessButton.Click`. Click the small **blue gear** on the if block and drag **else if** and **else** into it so it has three parts.\n\nUse the Math compare block. It starts as `=`; use its dropdown to change it. **Fill the blanks:** the first blank is `<` (too low) and the second blank is `>` (too high).\n\nThe app checks from top to bottom and runs **only the first part that is true**.',
        simple: 'Use an if block with three parts. If the guess is too small, say "Too low". If too big, say "Too high". Otherwise, the player wins.',
        blocks: [
          'when GuessButton.Click do',
          '  set global guesses to: (get global guesses) + 1',
          '  set CountLabel.Text to: join("Guesses: ", get global guesses)',
          '  if GuessBox.Text ___ get global secret',
          '    set HintLabel.Text to: "Too low! Go higher."',
          '  else if GuessBox.Text ___ get global secret',
          '    set HintLabel.Text to: "Too high! Go lower."',
          '  else',
          '    set HintLabel.Text to: "🎉 You got it!"',
        ],
        check: 'Test now: guess 1 (it should say "Too low" unless the secret is 1), then guess 100 (it should say "Too high").',
        stuck: [
          'Use the blue Math compare block for < and >. The green Logic = block cannot do < or >.',
          'No "else if" on your block? Click the blue gear in the corner of the if block and drag the pieces in.',
        ],
        newBlocks: [
          { name: 'if / else if / else', where: 'Control drawer (use the blue gear to add parts)', what: 'Runs only the first part whose test is true.' },
          { name: 'Math compare (=, <, >)', where: 'Math drawer', what: 'Compares two numbers and gives true or false.' },
        ],
      },
      {
        title: 'Start a new game (fill the blanks)',
        editor: 'blocks',
        day: 2,
        body:
          'When **New Game** is tapped, pick a new secret number, set guesses back to 0, clear the box, and update both labels. **Fill the blanks:** the secret gets a new random number, and guesses goes back to its starting value.',
        simple: 'New Game picks a new secret number, sets guesses to 0, and clears the screen.',
        blocks: [
          'when NewGameButton.Click do',
          '  set global secret to: ___',
          '  set global guesses to: ___',
          '  set CountLabel.Text to: "Guesses: 0"',
          '  set GuessBox.Text to: ""',
          '  set HintLabel.Text to: "New number! Guess from 1 to 100..."',
        ],
        check: 'Test now: play one game, tap New Game, and check that the guess count starts again at 0.',
      },
      {
        title: 'Check the input first',
        editor: 'blocks',
        body:
          'Tap **Guess!** with an empty box. The app shows an error, because you cannot compare *nothing* to a number. Fix it by checking the input **before** you compare:\n\n1. Is the box empty? Use **is empty** (Text drawer).\n2. Is it not a number? Use **is number?** (Math drawer) with **not** (Logic drawer).\n3. Is it below 1 or above 100? Use **or** (Logic drawer).\n4. Only then judge the guess.\n\nMove your old guessing blocks into the last **else**. Drag the top block of a stack and everything under it moves too.',
        simple:
          'An empty box breaks the app. Check first: Is it empty? Is it a number? Is it from 1 to 100? Only then check the guess.',
        blocks: [
          'when GuessButton.Click do',
          '  if is empty(GuessBox.Text)',
          '    set HintLabel.Text to: "Type a number first."',
          '  else if not(is number?(GuessBox.Text))',
          '    set HintLabel.Text to: "Numbers only, please."',
          '  else if (GuessBox.Text < 1) or (GuessBox.Text > 100)',
          '    set HintLabel.Text to: "Pick a number from 1 to 100."',
          '  else',
          '    ...your guess counting and too low / too high blocks go here...',
        ],
        check: 'Test now: tap Guess! with an empty box. You see "Type a number first." and no error.',
        stuck: [
          'Still an error? The empty check must come FIRST, before any < or > block.',
          'Your guessing blocks are not running? Make sure they are inside the last else, not below the whole if block.',
        ],
        newBlocks: [
          { name: 'is empty', where: 'Text drawer', what: 'True when a text has no letters or numbers in it.' },
          { name: 'is number?', where: 'Math drawer', what: 'True when a text can be used as a number.' },
          { name: 'and / or / not', where: 'Logic drawer', what: 'Combine or flip true/false answers.' },
        ],
      },
      {
        title: 'Play-test with your partner',
        editor: 'phone',
        day: 3,
        body:
          'One partner plays while the other counts guesses. Try this plan: always guess the **middle** of the numbers that are left (50, then 25 or 75, and so on). Does it help? Then do the **Remix**, export your `.aia`, and submit it.',
        simple: 'Play the game together. Try guessing the middle number each time. Then do the Remix and submit.',
        frames: ['Our best game took ___ guesses.', 'Guessing the middle helps because ___.'],
      },
    ],
    remix: {
      title: 'Remix: Out of guesses',
      spec: 'Give the player only 10 guesses. If they use all 10 without winning, the label says "Out of guesses! It was N" (with the real number), and more guesses do nothing until New Game.',
      hints: [
        'You already count guesses in a variable. Compare it to 10.',
        'Use join to put the secret number into the message.',
        'Add the check near the top of the guessing part, before "too low / too high".',
      ],
    },
    challenge: {
      title: 'Bonus: Hot or cold',
      body:
        'If the guess is within 5 of the secret, also say "🔥 Super hot!". Use **and** with two comparisons (guess > secret − 5 and guess < secret + 5). Then, if the player wins in 7 guesses or fewer, show "Genius!"',
    },
    quiz: [
      {
        q: 'An if / else if / else has three parts and the first two tests are both true. What runs?',
        options: ['Only the first true part', 'Both true parts', 'The else part', 'Nothing'],
        answer: 0,
        explain: 'The app checks from the top and stops at the first true test.',
      },
      {
        q: 'The secret is 40. The player types 55 and taps Guess!. Using your blocks, what does HintLabel say?',
        options: ['"Too low! Go higher."', '"Too high! Go lower."', '"🎉 You got it!"', '"Type a number first."'],
        answer: 1,
        explain: '55 is not empty, is a number, is between 1 and 100, and is greater than 40, so "Too high".',
      },
      {
        q: 'Which test is true ONLY when the age is from 13 to 18 (including both)?',
        options: ['age ≥ 13 or age ≤ 18', 'age ≥ 13 and age ≤ 18', 'age = 13 and age = 18', 'age > 13 or age > 18'],
        answer: 1,
        explain: '"and" needs both parts true. With "or," any age at all would pass.',
      },
      {
        q: 'Why must the "is empty" check come BEFORE the < and > checks?',
        options: [
          'It makes the app faster',
          'Comparing an empty box to a number causes an error, so we stop before that happens',
          'App Inventor requires if blocks to start with text',
          'It does not matter which comes first',
        ],
        answer: 1,
        explain: 'The if checks in order. If the box is empty, it shows a message and never reaches the < block.',
      },
    ],
    checks: [
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'anyBlock', types: ['math_compare', 'logic_compare'], label: 'Compares values (<, >, =)' },
      { kind: 'block', type: 'math_random_int', label: 'Picks a random integer' },
      { kind: 'block', type: 'global_declaration', label: 'Uses global variables', min: 2 },
      { kind: 'block', type: 'text_isEmpty', label: 'Checks for an empty box' },
      { kind: 'component', type: 'TextBox', label: 'Has a TextBox for guesses' },
    ],
    teacherNotes:
      'Three periods: day 1 builds the game, day 2 adds New Game and input checking, day 3 play-tests and remixes. Students often use the Logic "=" block for numbers; it works for =, but steer them to the Math compare block for < and >. Demo the empty-box error live: it is the clearest case for validation. The input check order matters (empty → not a number → range → judge). "is number?" is math_is_a_number in the .aia. Connect back to Tap Tycoon: early finishers can add "if coins ≥ 10" to the upgrade button.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-loops',
    title: 'Loops & Timers',
    subtitle: 'Repeat things without repeating yourself',
    icon: '🔁',
    track: 'core',
    concepts: ['for each number loop', 'Clock timer', 'while loops', 'Counting down'],
    periods: 3,
    xp: { quiz: 50, build: 120, bonus: 50 },
    project: {
      name: 'Rocket Countdown',
      description:
        'A launch control app: press Launch and a timer counts down from 10 to liftoff. A second button builds a full times table using a loop.',
    },
    objectives: [
      'Use a Clock component as a repeating event (a "timer loop")',
      'Turn a timer on and off with TimerEnabled and change its speed with TimerInterval',
      'Use "for each number from ... to ... by" to repeat blocks a set number of times',
      'Explain when to use a timer vs. a loop, and why a while loop can freeze your app',
    ],
    intro:
      'Computers are great at doing something over and over. App Inventor has two ways to repeat. A **loop** repeats blocks *instantly*, all at once, like printing a times table. A **Clock timer** repeats *over time*, for example once every second, like a countdown. Today your company builds a mission control app that uses both.',
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
          'New project: `RocketCountdown`. Add:\n\n- A Label `CountLabel` (FontSize `60`, Text `10`)\n- A Button `LaunchButton` (Text `🚀 Launch`)\n- A Button `TableButton` (Text `Show 7 times table`)\n- A Label `TableLabel` (Text empty)\n- **Sensors → Clock**. In its properties: uncheck **TimerEnabled** (so it does not start right away) and set **TimerInterval** to `1000`.',
        simple: 'Make a project called RocketCountdown. Add a big number label, two buttons, a second label, and a Clock. Turn the Clock off and set it to 1000.',
        stuck: ['The Clock is in the Sensors drawer. It shows up under the phone screen because it has nothing to show.'],
        newBlocks: [
          { name: 'Clock', where: 'Palette → Sensors', what: 'Runs its Timer event again and again, every TimerInterval milliseconds.' },
        ],
      },
      {
        title: 'Start the countdown',
        editor: 'blocks',
        body:
          'Make a global variable `count` starting at `10`. When Launch is clicked, reset `count` to 10, show it, and **turn the Clock on**.',
        simple: 'Make a variable called count that starts at 10. The Launch button turns the Clock on.',
        blocks: [
          'initialize global count to: 10',
          'when LaunchButton.Click do',
          '  set global count to: 10',
          '  set CountLabel.Text to: get global count',
          '  set Clock1.TimerEnabled to: true',
        ],
      },
      {
        title: 'The timer loop (fill the blanks)',
        editor: 'blocks',
        body:
          '`when Clock1.Timer` runs **every 1000 milliseconds** while the timer is on. Each tick, subtract 1. When the count gets to 0, show liftoff and **turn the timer off**.\n\n**Fill the blanks:** the first blank is the number where the countdown ends. The second blank turns the timer off (Logic drawer).',
        simple: 'Every second, take 1 away from count. When it reaches 0, say LIFTOFF and turn the Clock off.',
        blocks: [
          'when Clock1.Timer do',
          '  set global count to: (get global count) - 1',
          '  if get global count ≤ ___',
          '    set CountLabel.Text to: "LIFTOFF! 🚀"',
          '    set Clock1.TimerEnabled to: ___',
          '  else',
          '    set CountLabel.Text to: get global count',
        ],
        check: 'Test now: tap Launch. The label counts 9, 8, 7... once per second, then shows LIFTOFF! and stops.',
        stuck: [
          'It keeps counting into negative numbers? The timer was never turned off. Check the second blank is false.',
          'Nothing happens? Look in the Designer: TimerInterval should be 1000, and Launch must set TimerEnabled to true.',
        ],
      },
      {
        title: 'Abort button (words only)',
        editor: 'blocks',
        body:
          'Build this without a picture. Add a Button `AbortButton` (Text `Abort`). When it is clicked, **turn the Clock off** and set CountLabel to `Mission aborted`.',
        simple: 'Add an Abort button. When it is tapped, stop the Clock and show "Mission aborted".',
        check: 'Test now: tap Launch, then Abort at 5. The numbers stop and the label says Mission aborted.',
        stuck: ['You already used the block that turns the Clock off. Find it in your Timer handler.'],
      },
      {
        title: 'A for loop: the times table',
        editor: 'blocks',
        day: 2,
        body:
          'Now repeat *instantly*. Drag out **for each number from 1 to 5 by 1** (Control drawer) and change `to` to `10`. The loop gives you a variable called `number`: 1, then 2, then 3, up to 10.\n\nWe start the label empty and **add one line each time around the loop**. The `\\n` text means "new line."\n\nThis **join** needs 6 pieces. Click the **blue gear** on the join block and drag more `string` pieces into it.',
        simple: 'A for loop repeats 10 times, very fast. Each time, add one line of the 7 times table to the label.',
        blocks: [
          'when TableButton.Click do',
          '  set TableLabel.Text to: ""',
          '  for each number from 1 to 10 by 1',
          '    set TableLabel.Text to: join(TableLabel.Text, "7 × ", get number, " = ", 7 × get number, "\\n")',
        ],
        check: 'Test now: tap the table button. You see 10 lines, from 7 × 1 = 7 to 7 × 10 = 70.',
        stuck: [
          'Only 2 slots on join? Click the blue gear on the join block and drag "string" pieces in until there are 6.',
          'You see "\\n" on the screen? Type a backslash and the letter n inside the text block, with nothing else.',
          'You only see one line? The first piece of join must be TableLabel.Text, so each line is added to the old text.',
        ],
        newBlocks: [
          { name: 'for each number from … to … by', where: 'Control drawer', what: 'Repeats the blocks inside once for each number.' },
          { name: 'join with more slots', where: 'Text drawer → blue gear', what: 'Drag "string" into the gear box to add more pieces.' },
        ],
      },
      {
        title: 'Timer or loop?',
        body:
          'Talk with your partner:\n\n- Why can we **not** use a for loop for the countdown? (It would finish all 10 steps in a split second, so you would only see the last one.)\n- App Inventor also has a **while** loop. It repeats as long as a test is true. If the test never becomes false, the app **freezes**. That is an *infinite loop*. Use a Clock for anything that waits, and loops for quick calculations.',
        simple: 'Loops are fast. Clocks wait between steps. A while loop that never ends freezes the app.',
        frames: ['We used a Clock for the countdown because ___.', 'A for loop is better for ___ because ___.'],
      },
      {
        title: 'Test, remix, submit',
        editor: 'phone',
        day: 3,
        body:
          'Launch the rocket. Change **TimerInterval** to `500`. What happens? Then do the **Remix**, export your `.aia`, and submit it.',
        simple: 'Try TimerInterval 500. Then do the Remix and submit.',
        check: 'Test now: with 500, the countdown goes twice as fast.',
      },
    ],
    remix: {
      title: 'Remix: Stopwatch',
      spec: 'Add a stopwatch to the app: a Start button, a Stop button, and a label that counts UP by 1 every second (0, 1, 2, 3...). Start begins from 0. Stop freezes the number.',
      hints: [
        'You need a second Clock and a new variable that starts at 0.',
        'The new Timer handler adds 1 instead of taking 1 away.',
        'Start turns the new Clock on. Stop turns it off.',
      ],
    },
    challenge: {
      title: 'Bonus: Mission customization',
      body:
        'Add a TextBox where the user picks which times table to show, and use it in your loop instead of 7. Then make the countdown dramatic: in the last 3 seconds, change the label **TextColor** to red and make its **FontSize** bigger.',
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
        q: 'Label1.Text starts as "". The blocks are: for each number from 1 to 3 by 1 → set Label1.Text to join(Label1.Text, get number). What does the label show after the loop?',
        options: ['"3"', '"123"', '"321"', '"6"'],
        answer: 1,
        explain: 'Each time around, the new number is glued to the end: "1", then "12", then "123".',
      },
      {
        q: 'Why is a while loop whose test is always true dangerous?',
        options: ['It deletes your variables', 'It never stops, so the app freezes', 'It runs only once', 'It changes the TimerInterval'],
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
      'Emphasize the two kinds of repetition: loops run instantly, timers run over time. Students will try a while loop for the countdown; let a few try it and watch the Companion hang (Connect → Reset Connection recovers it). The join gear is new here; demo it once on the projector. If a student gets a literal \\n, they typed extra characters. The Abort step is words only on purpose; it mirrors the Timer handler. Clock.TimerAlwaysFires keeps timers running in the background; leave it at the default.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-lists',
    title: 'Lists',
    subtitle: 'Store many things in one variable',
    icon: '📋',
    track: 'core',
    concepts: ['Lists', 'Index', 'Random item', 'for each item', 'ListView'],
    periods: 3,
    xp: { quiz: 50, build: 120, bonus: 50 },
    project: {
      name: 'Decision Maker',
      description:
        'Can\'t decide where to eat or what to play? Type in your options, see them listed, and let the app pick one at random.',
    },
    objectives: [
      'Make a list with "make a list" and store it in a variable',
      'Add items, count items, and pick a random item',
      'Understand that list positions (indexes) start at 1 in App Inventor',
      'Loop through every item with "for each item in list"',
      'Show a list on screen with a ListView and arrange parts side by side',
    ],
    intro:
      'A variable holds one thing. But what about a playlist, a leaderboard, or a to-do list? A **list** holds many values in order, inside one variable. Many real apps are built on lists: your messages, your photos, your contacts. Today your company builds a Decision Maker that stores options in a list and picks one.',
    vocab: [
      { term: 'List', def: 'An ordered group of values stored in one variable.' },
      { term: 'Item', def: 'One value inside a list.' },
      { term: 'Index', def: 'The position of an item. In App Inventor the first item is index 1.' },
      { term: 'ListView', def: 'A component that shows a list on the screen as rows.' },
    ],
    steps: [
      {
        title: 'Design the app',
        editor: 'designer',
        body:
          'New project: `DecisionMaker`. **Your choice:** what will your app decide? (food, games, songs, chores...)\n\nAdd a **HorizontalArrangement** (Layout drawer) and set its Width to **Fill parent**. Inside it, put a TextBox `OptionBox` and a Button `AddButton` (Text `Add`). Below it add:\n\n- A Button `DecideButton` (Text `🎲 Decide for me!`)\n- A Label `ResultLabel` (FontSize `24`) and a Label `CountLabel`\n- A **ListView** `OptionsView` (User Interface drawer)\n- A Button `ClearButton` (Text `Clear all`)',
        simple: 'Make a project called DecisionMaker. Put a text box and an Add button side by side in a HorizontalArrangement. Add a Decide button, two labels, a ListView, and a Clear button.',
        check: 'Test now: the text box and the Add button sit next to each other in one row.',
        stuck: ['To put parts inside an arrangement, drop them onto the arrangement box itself, not below it.'],
        newBlocks: [
          { name: 'HorizontalArrangement', where: 'Palette → Layout', what: 'Puts the parts inside it side by side in a row.' },
          { name: 'VerticalArrangement', where: 'Palette → Layout', what: 'Stacks the parts inside it from top to bottom.' },
          { name: 'ListView', where: 'Palette → User Interface', what: 'Shows a list on the screen, one item per row.' },
        ],
      },
      {
        title: 'Make a list variable',
        editor: 'blocks',
        body:
          'Make `initialize global options to` and plug in **make a list** from the **Lists** drawer. Click its blue gear to add slots, and add two or three starter options of your own so the app works right away.',
        simple: 'Make a variable called options. Put a list of two or three of your own choices in it.',
        blocks: ['initialize global options to: make a list("Pizza", "Tacos", "Sushi")'],
        newBlocks: [{ name: 'make a list', where: 'Lists drawer (blue gear adds slots)', what: 'Builds a list from the pieces you plug in.' }],
      },
      {
        title: 'Show the list',
        editor: 'blocks',
        body:
          'When the app opens, set the ListView\'s **Elements** to the list. Show how many items there are with **length of list**.',
        simple: 'When the app opens, show the list in the ListView and show how many items it has.',
        blocks: [
          'when Screen1.Initialize do',
          '  set OptionsView.Elements to: get global options',
          '  set CountLabel.Text to: join(length of list(get global options), " options")',
        ],
        check: 'Test now: refresh the Companion. Your starter options appear as rows, and the label says "3 options".',
        stuck: ['Elements needs a list. If you plug in a text block instead, the app shows an error.'],
        newBlocks: [{ name: 'length of list', where: 'Lists drawer', what: 'Tells how many items are in a list.' }],
      },
      {
        title: 'Add items (fill the blanks)',
        editor: 'blocks',
        body:
          'Use **add items to list**. Only add the option if the TextBox is **not empty** (you learned this in Conditionals). **Fill the blanks:** the first blank is the list to add to, the second is the text the user typed.\n\nThen clear the box and show the list again with the **same two blocks** you used in Screen1.Initialize. Build those two lines yourself.',
        simple: 'If the box is not empty, add its text to the list. Then clear the box and show the list again.',
        blocks: [
          'when AddButton.Click do',
          '  if not(is empty(OptionBox.Text))',
          '    add items to list: ___',
          '      item: ___',
          '    set OptionBox.Text to: ""',
          '    ...the same two "show the list" blocks from Screen1.Initialize...',
        ],
        check: 'Test now: type an option and tap Add. It appears as a new row and the count goes up by 1.',
        stuck: ['Your new item does not show? You changed the list but forgot to set OptionsView.Elements again.'],
        newBlocks: [{ name: 'add items to list', where: 'Lists drawer', what: 'Puts a new item at the end of a list.' }],
      },
      {
        title: 'Pick one at random (fill the blank)',
        editor: 'blocks',
        day: 2,
        body:
          'The **pick a random item** block does the work. But if the list is empty, it causes an error, so check the length first. **Fill the blank** with the number that means "no items".',
        simple: 'If the list has no items, ask the user to add some. Otherwise, show a random item.',
        blocks: [
          'when DecideButton.Click do',
          '  if length of list(get global options) = ___',
          '    set ResultLabel.Text to: "Add some options first!"',
          '  else',
          '    set ResultLabel.Text to: join("👉 ", pick a random item(get global options))',
        ],
        check: 'Test now: tap Decide a few times. A different option can show each time.',
        newBlocks: [{ name: 'pick a random item', where: 'Lists drawer', what: 'Gives back one item chosen by chance.' }],
      },
      {
        title: 'Loop through the list',
        editor: 'blocks',
        body:
          '**for each item in list** runs its blocks once for every item. Use it to make the Clear button announce what is being removed. Then empty the list with **create empty list** and show it again.\n\nAlso try **select list item** with index `1`. Which option do you get?',
        simple: 'Clear all shows each item it removes, using a loop. Then it makes the list empty.',
        blocks: [
          'when ClearButton.Click do',
          '  set ResultLabel.Text to: "Removed: "',
          '  for each item in list: get global options',
          '    set ResultLabel.Text to: join(ResultLabel.Text, get item, " ")',
          '  set global options to: create empty list',
          '  set OptionsView.Elements to: get global options',
          '  set CountLabel.Text to: "0 options"',
        ],
        check: 'Test now: tap Clear all. The label lists every removed option, and the ListView is empty.',
        stuck: ['Index 0 does not work in App Inventor. The first item is index 1.'],
        newBlocks: [
          { name: 'for each item in list', where: 'Control drawer', what: 'Repeats once for every item, and gives you that item.' },
          { name: 'select list item', where: 'Lists drawer', what: 'Gets the item at a position. The first position is 1.' },
        ],
      },
      {
        title: 'Undo button (words only)',
        editor: 'blocks',
        body:
          'Build this without a picture. Add a Button `UndoButton`. When it is clicked, **if the list is not empty**, remove the **last** item and show the list again. The last item\'s index is the length of the list.',
        simple: 'Undo takes away the last option. Check that the list is not empty first.',
        check: 'Test now: add two options, then tap Undo. Only the newest one disappears.',
        stuck: ['Use "remove list item" from the Lists drawer. Plug "length of list" into its index.'],
        newBlocks: [{ name: 'remove list item', where: 'Lists drawer', what: 'Takes out the item at a position.' }],
      },
      {
        title: 'Test, remix, submit',
        editor: 'phone',
        day: 3,
        body:
          'Add your own options and let the app decide. Tap Decide with an empty list to check your guard. Then do the **Remix**, export your `.aia`, and submit it.',
        simple: 'Test everything, including an empty list. Do the Remix. Export and submit.',
      },
    ],
    remix: {
      title: 'Remix: Numbered list',
      spec: 'Add a "Show numbered" button. When it is tapped, ResultLabel shows every option on its own line with a number in front: "1. Pizza", "2. Tacos", and so on.',
      hints: [
        'Use for each item in list, like the Clear button does.',
        'You need a counter variable that starts at 0 and goes up by 1 inside the loop.',
        'Use join with "\\n" at the end to start a new line, like the times table.',
      ],
    },
    challenge: {
      title: 'Bonus: Tap to remove',
      body:
        'Use `when OptionsView.AfterPicking` (it runs when a row is tapped) and **remove list item** with index `OptionsView.SelectionIndex` (the number of the row that was tapped), so tapping an option deletes it.',
    },
    quiz: [
      {
        q: 'A list is ("red", "green", "blue"). What does "select list item, index 2" give you?',
        options: ['"red"', '"green"', '"blue"', 'An error'],
        answer: 1,
        explain: 'App Inventor counts list positions starting at 1, so index 2 is the second item.',
      },
      {
        q: 'options is ("a", "b"). The app runs: add items to list options item "c", then sets Label1.Text to select list item(options, index: length of list(options)). What does the label show?',
        options: ['"a"', '"b"', '"c"', '3'],
        answer: 2,
        explain: 'After adding, the list has 3 items, so length is 3, and item 3 is "c".',
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
      'HorizontalArrangement and Fill parent are taught here for everyone (they were only in the optional Design Studio before). One-based indexing trips up students who later learn Python or JavaScript; name it explicitly. Both "make a list" and "create empty list" are stored as lists_create_with in the .aia file. The repeated "show the list" blocks are intentional duplication; point at them and promise the fix in Procedures. The Undo step is words only; it combines the empty-check pattern with a new block.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'core-procedures',
    title: 'Procedures',
    subtitle: 'Write it once, use it everywhere',
    icon: '🧩',
    track: 'core',
    concepts: ['Procedures', 'Parameters', 'Return values', 'DRY code'],
    periods: 3,
    xp: { quiz: 50, build: 120, bonus: 50 },
    project: {
      name: 'Tip Splitter',
      description:
        'Enter a restaurant bill and how many people are paying. Tap 15%, 18%, or 20% to see the tip, total, and what each person owes.',
    },
    objectives: [
      'Define a procedure with "to procedure do" and call it from several events',
      'Give a procedure parameters so it can work with different values',
      'Write a "to procedure result" that calculates and returns a value',
      'Use a local variable and format numbers as money',
      'Explain DRY ("Don\'t Repeat Yourself") and why it makes code easier to fix',
    ],
    intro:
      'Look back at your Decision Maker: the same "show the list" blocks appear three times. If you wanted to change them, you would have to fix all three, and you might miss one. A **procedure** is your own custom block: you build it once, give it a name, and use it as many times as you like. Programmers follow a rule called **DRY: Don\'t Repeat Yourself.** Today your company builds a Tip Splitter where three buttons share one procedure.',
    vocab: [
      { term: 'Procedure', def: 'A named group of blocks that you define once and call (use) many times.' },
      { term: 'Call', def: 'To run a procedure from somewhere else in your code.' },
      { term: 'Parameter', def: 'An input to a procedure, like the tip percent, so it can work with different values.' },
      { term: 'Return value', def: 'The answer a "procedure result" sends back to where it was called.' },
      { term: 'Local variable', def: 'A variable that only exists inside one block, like a scratch pad.' },
    ],
    steps: [
      {
        title: 'Design the calculator',
        editor: 'designer',
        body:
          'New project: `TipSplitter`. Add:\n\n- TextBox `BillBox` (Hint `Bill amount`, **NumbersOnly** checked)\n- TextBox `PeopleBox` (Hint `Number of people`, **NumbersOnly** checked, Text `1`)\n- A **HorizontalArrangement** with three Buttons: `Tip15Button`, `Tip18Button`, `Tip20Button` (Text `15%`, `18%`, `20%`)\n- Labels `TipLabel`, `TotalLabel`, `EachLabel`',
        simple: 'Make a project called TipSplitter. Add two number boxes, three tip buttons in a row, and three labels.',
        check: 'Test now: the three tip buttons sit side by side in one row.',
      },
      {
        title: 'The long way (try it first!)',
        editor: 'blocks',
        body:
          'Build just the 15% button the "long way" so you can see the problem. Imagine copying this for 18% and 20% and changing three numbers each time. If you find a mistake later, you must fix it in three places.',
        simple: 'Build the 15% button the long way. Notice how much you would have to copy for the other buttons.',
        blocks: [
          'when Tip15Button.Click do',
          '  set TipLabel.Text to: join("Tip: $", BillBox.Text × 0.15)',
          '  set TotalLabel.Text to: join("Total: $", BillBox.Text + BillBox.Text × 0.15)',
          '  set EachLabel.Text to: join("Each: $", (BillBox.Text + BillBox.Text × 0.15) / PeopleBox.Text)',
        ],
        check: 'Test now: bill 40, people 4, tap 15%. Tip shows 6, Total 46, Each 11.5.',
      },
      {
        title: 'A procedure that returns a value (fill the blank)',
        editor: 'blocks',
        day: 2,
        body:
          'Delete those blocks. Open the **Procedures** drawer and drag out **to procedure result**. Rename it `calcTip`. Click its blue gear and add two inputs (parameters): `bill` and `percent`. It **returns** the tip.\n\nBuild the math in this order: first multiply `bill × percent`, then put that whole block into the left side of a `/` block with `100` on the right. **Fill the blank** with the second parameter.',
        simple: 'Make your own block called calcTip. It takes a bill and a percent and gives back the tip: bill times percent, divided by 100.',
        blocks: ['to calcTip(bill, percent) result', '  (get bill × ___) / 100'],
        stuck: [
          'Cannot find "get bill"? Hover your mouse over the word bill on the procedure block.',
          'Wrong answer? Make sure the × block is INSIDE the left side of the / block.',
        ],
        newBlocks: [
          { name: 'to procedure result', where: 'Procedures drawer', what: 'Makes your own block that gives back an answer.' },
          { name: 'parameters', where: 'blue gear on the procedure block', what: 'Inputs your block needs, like bill and percent.' },
        ],
      },
      {
        title: 'A procedure that does something',
        editor: 'blocks',
        body:
          'Drag out **to procedure do**, name it `showResults`, and give it one parameter, `percent`.\n\nInside it, use **initialize local name to … in** (Variables drawer). A **local variable** is a scratch pad that only exists inside this block. Name it `tip` and set it to `call calcTip`. Put the three label blocks in its **in** section.\n\n**format as decimal** (Math drawer) shows a number with 2 places after the dot, like money.',
        simple: 'Make showResults. It works out the tip once, saves it in a local variable, and shows tip, total, and each person\'s share.',
        blocks: [
          'to showResults(percent) do',
          '  initialize local tip to: call calcTip(BillBox.Text, get percent)',
          '  in:',
          '    set TipLabel.Text to: join("Tip: $", format as decimal(get tip, 2))',
          '    set TotalLabel.Text to: join("Total: $", format as decimal(BillBox.Text + get tip, 2))',
          '    set EachLabel.Text to: join("Each: $", format as decimal((BillBox.Text + get tip) / PeopleBox.Text, 2))',
        ],
        stuck: [
          'Use "initialize local … in" (the one with an "in" section for blocks), not the one that plugs into a socket.',
          '"get tip" only works inside the "in" section. Outside it, the local variable does not exist.',
        ],
        newBlocks: [
          { name: 'initialize local … in', where: 'Variables drawer', what: 'A variable that only exists inside its "in" section.' },
          { name: 'format as decimal', where: 'Math drawer', what: 'Shows a number with a set number of decimal places, like 6.00.' },
          { name: 'to procedure do', where: 'Procedures drawer', what: 'Makes your own block that does a job.' },
        ],
      },
      {
        title: 'Call it from every button (words only for two)',
        editor: 'blocks',
        body:
          'Now each button is **one line**. Find `call showResults` at the bottom of the Procedures drawer. The 15% button is shown. Build the **18% and 20%** buttons yourself.',
        simple: 'Each tip button now needs only one block: call showResults with its percent. Build 18% and 20% yourself.',
        blocks: ['when Tip15Button.Click do', '  call showResults(percent: 15)'],
        check: 'Test now: bill 40, people 4, tap 20%. You see Tip: $8.00, Total: $48.00, Each: $12.00.',
        stuck: ['Do not see call showResults? Make sure your "to showResults" block has no red error mark.'],
      },
      {
        title: 'Fix it in one place',
        editor: 'blocks',
        day: 3,
        body:
          'Tap a tip button with an empty bill box. Error! Add input checking **in one place**: inside `showResults`, wrap everything in an **if**. If `BillBox` is empty or `PeopleBox` is empty or `PeopleBox.Text ≤ 0`, show `Fill in both boxes` in TipLabel. Otherwise, do the math. All three buttons get the fix at once.',
        simple: 'Add one if block inside showResults. If a box is empty, show a message. Every button is fixed at the same time.',
        blocks: [
          'to showResults(percent) do',
          '  if is empty(BillBox.Text) or is empty(PeopleBox.Text) or ___',
          '    set TipLabel.Text to: "Fill in both boxes"',
          '  else',
          '    ...your initialize local tip block goes here...',
        ],
        check: 'Test now: empty bill box, tap 18%. You see "Fill in both boxes" and no error.',
        stuck: ['The or block needs 3 slots here. Click its blue gear to add one.'],
      },
      {
        title: 'Remix and submit',
        body: 'Do the **Remix** below. Then export your `.aia` and submit it.',
        simple: 'Do the Remix. Export and submit.',
      },
    ],
    remix: {
      title: 'Remix: Your own procedure',
      spec: 'Write a new procedure result called perPerson with two parameters, total and people. It gives back total divided by people. Use it inside showResults instead of the long math for EachLabel.',
      hints: [
        'Copy the shape of calcTip: "to procedure result", then the blue gear for parameters.',
        'Call it with call perPerson, plugging in the total and PeopleBox.Text.',
        'Test with bill 40, 4 people, 20%: Each should still be $12.00.',
      ],
    },
    challenge: {
      title: 'Bonus: Custom tip & clean-up',
      body:
        'Add a TextBox for a custom tip percent and a fourth button that calls `showResults` with it. No new math needed! Then open an earlier project (Decision Maker, or any project with repeated blocks) and replace the repeated blocks with a procedure.',
    },
    quiz: [
      {
        q: 'Bill is 100 and people is 2. The user taps Tip18Button, which calls showResults(18). What does EachLabel show?',
        options: ['Each: $50.00', 'Each: $59.00', 'Each: $118.00', 'Each: $9.00'],
        answer: 1,
        explain: 'Tip = 100 × 18 / 100 = 18. Total = 118. Each = 118 / 2 = 59.00.',
      },
      {
        q: 'What is the difference between "to procedure do" and "to procedure result"?',
        options: ['There is no difference', '"result" sends back a value; "do" just runs blocks', '"do" can only be used once', '"result" cannot have parameters'],
        answer: 1,
        explain: 'A result procedure plugs into a socket like a math block, because it gives back an answer.',
      },
      {
        q: 'In "call showResults(percent: 18)," what is 18?',
        options: ['The name of the procedure', 'A global variable', 'The value given to the percent parameter', 'The return value'],
        answer: 2,
        explain: 'Parameters let the same procedure work with different values each time it is called.',
      },
      {
        q: 'You find a math mistake. Your app calls showResults from 4 buttons. How many places do you need to fix?',
        options: ['4', '1', '5', 'None; it fixes itself'],
        answer: 1,
        explain: 'That is DRY: the math lives in one procedure, so one fix updates every button.',
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
      'Have students build the long version first; the pain is the lesson. "Inputs" is fine vocabulary for parameters at this level. Local variables and format as decimal are taught here for everyone (format as decimal was only in Unit Converter before). The local variable is stored as local_declaration_statement and is not required by the checker. Percent math (× percent ÷ 100) is a good moment to connect to 7th-grade percent work. This is the last trunk lesson before the studio branch; make sure every company can read and write procedures, which all three capstones require.',
  },
]
