import type { Lesson } from '../types'

// Branch 1: "Your first product". Each company picks ONE of these three.
// All three practice global variables and if/else, in a different flavor.

export const MINI_LESSONS: Lesson[] = [
  {
    id: 'mini-quiz',
    title: 'Quiz Show',
    subtitle: 'A trivia game that keeps score',
    icon: '🎯',
    track: 'mini',
    concepts: ['Global variables', 'If / else if / else', 'Comparing text', 'Notifier'],
    periods: 2,
    xp: { quiz: 40, build: 120, bonus: 40 },
    project: {
      name: 'Quiz Show',
      description:
        'A three-question trivia game. Players pick an answer, get instant feedback, and see their final score at the end.',
    },
    objectives: [
      'Use two global variables (score and questionNumber) to track the state of a game',
      'Use if / else if / else to decide which question to show',
      'Compare the player\'s answer to the correct answer and update the score',
      'Show pop-up feedback with a Notifier',
    ],
    intro:
      'Game companies live and die by one thing: **is it fun to play?** Your first product is a quiz show. Behind the scenes, the app has to *remember* two things the whole time it runs: which question the player is on, and how many they got right. That memory lives in **global variables**, and **if** blocks decide what happens next.',
    vocab: [
      { term: 'Global variable', def: 'A named value that every block on the screen can read and change, like score.' },
      { term: 'State', def: 'Everything the app is remembering right now (current question, score, etc.).' },
      { term: 'Condition', def: 'A true-or-false question, like "is the answer equal to B?"' },
      { term: 'Notifier', def: 'A non-visible component that shows pop-up alerts and messages.' },
    ],
    steps: [
      {
        title: 'Design the game screen',
        editor: 'designer',
        body:
          'Start a new project called `QuizShow`. Add:\n\n- A **Label** named `QuestionLabel` (make the font size big, 20+)\n- Three **Buttons** named `AnswerA`, `AnswerB`, `AnswerC`\n- A **Label** named `ScoreLabel` with Text `Score: 0`\n- A **Notifier** (User Interface drawer). It is non-visible.\n\nTip: rename components with the **Rename** button under the Components list. Good names make your blocks much easier to read.',
      },
      {
        title: 'Create the game\'s memory',
        editor: 'blocks',
        body:
          'Open **Variables** and drag out two `initialize global` blocks. Name them `score` and `questionNumber`. Both start at `0` and `1`.\n\nThese blocks sit on their own. They are not inside an event, because they run once when the app starts.',
        blocks: ['initialize global score to 0', 'initialize global questionNumber to 1'],
      },
      {
        title: 'Show the right question',
        editor: 'blocks',
        body:
          'Use an **if** block with the blue gear (mutator) to add **else if** branches. Check which question number we are on and set the question and button texts. Put this in `when Screen1.Initialize` so question 1 shows when the app opens.\n\nWrite your own questions! The example below shows question 1; copy the pattern for 2 and 3.',
        blocks: [
          'when Screen1.Initialize do',
          '  if get global questionNumber = 1',
          '    set QuestionLabel.Text to "What planet is closest to the sun?"',
          '    set AnswerA.Text to "Venus"',
          '    set AnswerB.Text to "Mercury"',
          '    set AnswerC.Text to "Mars"',
          '  else if get global questionNumber = 2',
          '    set QuestionLabel.Text to "..."',
          '  else if get global questionNumber = 3',
          '    set QuestionLabel.Text to "..."',
        ],
      },
      {
        title: 'Check the answer',
        editor: 'blocks',
        body:
          'When a player taps a button, compare it to the correct answer for the current question. If they are right, add 1 to `score` and say so with the Notifier; otherwise show the right answer.\n\nUse the **Logic** `and` block so the check only counts on the right question.',
        blocks: [
          'when AnswerB.Click do',
          '  if get global questionNumber = 1 and AnswerB.Text = "Mercury"',
          '    set global score to get global score + 1',
          '    call Notifier1.ShowAlert notice: "Correct!"',
          '  else',
          '    call Notifier1.ShowAlert notice: "Nope!"',
          '  set ScoreLabel.Text to join "Score: " get global score',
        ],
      },
      {
        title: 'Move to the next question',
        editor: 'blocks',
        body:
          'After every answer, add 1 to `questionNumber` and show the next question. You will need the "show the question" blocks in more than one place. For now, it is OK to copy them (right-click → **Duplicate**). In a few lessons you will learn **procedures** to avoid copying.\n\nWhen `questionNumber` is greater than 3, the game is over: show the final score and hide the answer buttons by setting their **Visible** property to `false`.',
        blocks: [
          'set global questionNumber to get global questionNumber + 1',
          'if get global questionNumber > 3',
          '  set QuestionLabel.Text to join "Game over! You scored " get global score',
          '  set AnswerA.Visible to false',
        ],
      },
      {
        title: 'Playtest and submit',
        editor: 'phone',
        body:
          'Play your game on the phone. Have your partner play *without* seeing the answers. Does the score count correctly? Does the game end after question 3?\n\nExport the `.aia` file (**Projects → Export selected project**) and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Play again',
      body:
        'Add a **Play Again** button that only appears when the game is over. It should reset `score` to 0 and `questionNumber` to 1, show the buttons again, and display question 1. Extra bonus: show a different message for a perfect score.',
    },
    quiz: [
      {
        q: 'Why are score and questionNumber global variables instead of being typed into Labels?',
        options: [
          'Globals are faster to type',
          'The app needs to remember and change those values across many different events',
          'Labels cannot show numbers',
          'Global variables appear on the screen automatically',
        ],
        answer: 1,
        explain: 'Every answer button needs to read and change the score. A global variable is the app\'s shared memory.',
      },
      {
        q: 'What does "set global score to get global score + 1" do?',
        options: [
          'Sets the score to 1',
          'Adds 1 to whatever the score currently is',
          'Creates a new variable',
          'Shows the score on the screen',
        ],
        answer: 1,
        explain: 'It reads the current score, adds 1, and stores the result back. This is called incrementing.',
      },
      {
        q: 'An if block has an "else" section. When does the else section run?',
        options: ['Always', 'Only when the condition is true', 'Only when the condition is false', 'Never, it is optional'],
        answer: 2,
        explain: 'else is the "otherwise" path: it runs only when the if condition is false.',
      },
      {
        q: 'The game never ends after question 3. Which bug is MOST likely?',
        options: [
          'The Notifier is missing',
          'questionNumber is never increased, so it stays at 1',
          'The Labels are too small',
          'score is a global variable',
        ],
        answer: 1,
        explain: 'If questionNumber never changes, "questionNumber > 3" can never become true.',
      },
    ],
    checks: [
      { kind: 'block', type: 'global_declaration', min: 2, label: 'Has at least 2 global variables' },
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'block', type: 'lexical_variable_set', label: 'Changes a variable with a set block' },
      { kind: 'component', type: 'Notifier', label: 'Has a Notifier' },
      { kind: 'method', method: 'ShowAlert', label: 'Calls Notifier.ShowAlert' },
      { kind: 'eventCount', min: 3, label: 'Has at least 3 event handlers' },
    ],
    teacherNotes:
      'Students will copy-paste a lot here. That is intentional: it sets up the "why" for procedures in core-procedures. Watch for comparing a Button.Text to a misspelled answer string; text comparison is exact (capitals and spaces matter). A common bug is putting the "next question" blocks before the answer check, so the wrong question is graded. Ask partners to trace the variable values on paper for one full play-through.',
  },

  {
    id: 'mini-sound',
    title: 'Soundboard',
    subtitle: 'Picture buttons that play sound clips',
    icon: '🔊',
    track: 'mini',
    concepts: ['Media files', 'Sound vs. Player', 'Boolean variables', 'If / else'],
    periods: 2,
    xp: { quiz: 40, build: 120, bonus: 40 },
    project: {
      name: 'Soundboard',
      description:
        'A grid of picture buttons that each play a sound clip, plus a Mute switch and a Loop mode for background music.',
    },
    objectives: [
      'Upload image and sound files as media assets',
      'Choose between the Sound component (short clips) and the Player component (longer audio)',
      'Use a true/false global variable to remember a mode (muted or not)',
      'Use if / else to change what a button does based on that mode',
    ],
    intro:
      'Media companies make apps that look and sound great. A **soundboard** is a grid of buttons that each play a clip, like a drum kit, animal noises, or your teacher\'s famous catch-phrases (ask first!). To make it feel like a real product, you will add a **mute mode** that the app remembers with a **boolean** (true/false) variable.',
    vocab: [
      { term: 'Media / asset', def: 'A file (picture, sound, video) uploaded into your project.' },
      { term: 'Sound', def: 'Component for short sound effects. Plays instantly, good for taps.' },
      { term: 'Player', def: 'Component for longer audio like music. Can pause, stop, and loop.' },
      { term: 'Boolean', def: 'A value that is either true or false.' },
    ],
    steps: [
      {
        title: 'Collect and upload media',
        editor: 'designer',
        body:
          'Start a project called `Soundboard`. Find 4 short sound clips (`.mp3` or `.wav`) and 4 matching images. Use free, school-safe sources your teacher approves, or record your own.\n\nIn the Designer, under **Media** (bottom of the Components panel), click **Upload File** for each one. Keep files small: under 1 MB each makes the Companion load faster.',
      },
      {
        title: 'Build the button grid',
        editor: 'designer',
        body:
          '1. Add a **TableArrangement** (Layout drawer) with 2 columns and 2 rows.\n2. Drop a **Button** into each cell. Set each button\'s **Image** property to one of your pictures and clear its **Text**.\n3. Add one **Sound** component (Media drawer) for effects and one **Player** for background music.\n4. Add a **Button** named `MuteButton` with Text `Mute: OFF` and a **Button** named `MusicButton` with Text `Play music`.',
      },
      {
        title: 'Play a clip on tap',
        editor: 'blocks',
        body:
          'A single Sound component can play many clips: just change its **Source** before calling **Play**. Repeat this for each button with its own file name (it must match the uploaded file exactly, including `.mp3`).',
        blocks: ['when Button1.Click do', '  set Sound1.Source to "drum.mp3"', '  call Sound1.Play'],
      },
      {
        title: 'Add mute mode with a boolean',
        editor: 'blocks',
        body:
          'Create a global variable `muted` set to `false`. When MuteButton is clicked, flip it using the Logic **not** block. Then update the button text so users know which mode they are in.',
        blocks: [
          'initialize global muted to false',
          'when MuteButton.Click do',
          '  set global muted to not get global muted',
          '  if get global muted',
          '    set MuteButton.Text to "Mute: ON"',
          '  else',
          '    set MuteButton.Text to "Mute: OFF"',
        ],
      },
      {
        title: 'Respect the mute setting',
        editor: 'blocks',
        body:
          'Go back to each sound button and wrap the Play block in an **if**: only play when the app is *not* muted. This is the big idea of today: **the same event can do different things depending on the app\'s state.**',
        blocks: [
          'when Button1.Click do',
          '  if not get global muted',
          '    set Sound1.Source to "drum.mp3"',
          '    call Sound1.Play',
        ],
      },
      {
        title: 'Background music with Player',
        editor: 'blocks',
        body:
          'In the Designer, set **Player1.Source** to your music file and check **Loop**. In Blocks, make MusicButton start the music, or stop it if it is already playing. Use **Player1.IsPlaying** as the condition.',
        blocks: [
          'when MusicButton.Click do',
          '  if Player1.IsPlaying',
          '    call Player1.Stop',
          '    set MusicButton.Text to "Play music"',
          '  else',
          '    call Player1.Start',
          '    set MusicButton.Text to "Stop music"',
        ],
      },
      {
        title: 'Test and submit',
        editor: 'phone',
        body:
          'Test every button with the volume up, then turn Mute ON and make sure nothing plays. Export the `.aia` file and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Make it vibrate',
      body:
        'Sound has a **Vibrate** method. Add a third mode, "Vibrate only", that vibrates for 200 milliseconds instead of playing a sound. Hint: you may want a number variable for the mode (0 = sound, 1 = mute, 2 = vibrate) and **else if**.',
    },
    quiz: [
      {
        q: 'Which component is best for playing a full song that the user can stop?',
        options: ['Sound', 'Player', 'Notifier', 'Label'],
        answer: 1,
        explain: 'Player is built for longer audio and has Start, Pause, Stop, and Loop. Sound is for short effects.',
      },
      {
        q: 'What does "set global muted to not get global muted" do?',
        options: [
          'Always sets muted to false',
          'Deletes the variable',
          'Flips muted: true becomes false and false becomes true',
          'Plays a sound',
        ],
        answer: 2,
        explain: 'The "not" block flips a boolean. This is called a toggle.',
      },
      {
        q: 'You tap a button and nothing plays. The Source is set to "Drum.mp3" but the file you uploaded is "drum.mp3". What happened?',
        options: [
          'The phone is broken',
          'File names must match exactly, including capital letters',
          'Sound can only play .wav files',
          'You need a Player instead',
        ],
        answer: 1,
        explain: 'App Inventor looks for the exact file name. "Drum" and "drum" are different.',
      },
      {
        q: 'Why do we check "if not get global muted" inside each sound button?',
        options: [
          'So the button only plays when the app is not in mute mode',
          'To make the sound louder',
          'To upload the file',
          'Because Sound requires an if block',
        ],
        answer: 0,
        explain: 'The if block makes the same tap behave differently depending on the mute state.',
      },
    ],
    checks: [
      { kind: 'anyComponent', types: ['Sound', 'Player'], label: 'Has a Sound or Player component' },
      { kind: 'component', type: 'Button', min: 3, label: 'Has at least 3 Buttons' },
      { kind: 'block', type: 'global_declaration', label: 'Has a global variable (mute mode)' },
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'eventCount', min: 4, label: 'Has at least 4 event handlers' },
      { kind: 'anyBlock', types: ['logic_negate', 'logic_boolean'], label: 'Uses true/false (boolean) logic' },
    ],
    teacherNotes:
      'Media sourcing takes longer than coding. Pre-approve a few free libraries or let students record clips with a phone voice recorder. Large files (>5 MB) slow the Companion and can fail to load; the project size limit also matters later. On some school Chromebooks audio is muted at the OS level. The toggle with "not" is a key pattern; ask students to explain it out loud.',
  },

  {
    id: 'mini-convert',
    title: 'Unit Converter',
    subtitle: 'A handy tool that does the math for you',
    icon: '📏',
    track: 'mini',
    concepts: ['User input', 'Math blocks', 'Input validation', 'If / else'],
    periods: 2,
    xp: { quiz: 40, build: 120, bonus: 40 },
    project: {
      name: 'Unit Converter',
      description:
        'Type a number, tap a button, and convert it, for example inches ↔ centimeters. The app politely refuses empty input.',
    },
    objectives: [
      'Read a number the user types into a TextBox',
      'Use math blocks to multiply and divide',
      'Validate input: check for an empty box before doing math',
      'Store the conversion factor in a global variable so it is easy to change',
    ],
    intro:
      'Tool companies build apps people use every day to get something done. A **unit converter** is a classic: it takes input, does a calculation, and shows a result. The secret of a good tool is that it **never crashes on bad input**. Today you will learn to check what the user typed with an **if** block before you trust it.',
    vocab: [
      { term: 'Input', def: 'Information the user gives the app, like a number typed in a TextBox.' },
      { term: 'Output', def: 'What the app shows back, like the converted answer.' },
      { term: 'Validation', def: 'Checking input is OK before using it.' },
      { term: 'Constant', def: 'A value that does not change while the app runs, like 2.54 cm per inch.' },
    ],
    steps: [
      {
        title: 'Pick your conversion',
        body:
          'With your partner, choose a conversion your users would actually want: inches ↔ centimeters (×2.54), miles ↔ kilometers (×1.609), pounds ↔ kilograms (×0.4536), or °F ↔ °C (a bonus challenge, because it needs more than one math step). Write the formula down before you code.',
      },
      {
        title: 'Design the tool',
        editor: 'designer',
        body:
          'Start a project called `UnitConverter`. Add:\n\n- A **TextBox** named `InputBox`. Check **NumbersOnly** so the phone shows a number keypad, and set the Hint to `Enter a number`.\n- Two **Buttons** in a **HorizontalArrangement**: `ToCmButton` ("in → cm") and `ToInButton` ("cm → in").\n- A **Label** named `ResultLabel` with a large font.\n- A **Notifier** for error messages.',
      },
      {
        title: 'Store the conversion factor',
        editor: 'blocks',
        body:
          'Instead of typing `2.54` in several places, store it once in a global variable. If you ever need to fix it, you change one block.',
        blocks: ['initialize global cmPerInch to 2.54'],
      },
      {
        title: 'Convert, but validate first',
        editor: 'blocks',
        body:
          'Use the Text drawer\'s **is empty** block to check the TextBox. If it is empty, show an alert. Otherwise, multiply and show the result.',
        blocks: [
          'when ToCmButton.Click do',
          '  if is empty InputBox.Text',
          '    call Notifier1.ShowAlert notice: "Type a number first!"',
          '  else',
          '    set ResultLabel.Text to join InputBox.Text × get global cmPerInch " cm"',
        ],
      },
      {
        title: 'Go the other direction',
        editor: 'blocks',
        body:
          'Duplicate the block for `ToInButton.Click`. This time **divide** by `cmPerInch` and change the label text to `" in"`. Tip: results like `3.937007874` look messy. Use the Math block **format as decimal** with 2 places to round.',
        blocks: [
          'when ToInButton.Click do',
          '  if is empty InputBox.Text',
          '    call Notifier1.ShowAlert notice: "Type a number first!"',
          '  else',
          '    set ResultLabel.Text to join format as decimal (InputBox.Text / get global cmPerInch) places 2 " in"',
        ],
      },
      {
        title: 'Try to break it, then submit',
        editor: 'phone',
        body:
          'Good tool-makers try to break their own tools. Test: an empty box, `0`, a decimal like `2.5`, and a huge number. Does anything crash or look wrong? Fix it, export the `.aia`, and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Temperature mode',
      body:
        'Add °F → °C buttons. The formula is `C = (F − 32) × 5 ÷ 9`, which takes three math blocks nested in the right order. Then add a check: if the °C answer is below 0, also show "Brr! Below freezing."',
    },
    quiz: [
      {
        q: 'Why check "is empty InputBox.Text" before doing math?',
        options: [
          'To make the app faster',
          'Doing math on empty text causes an error, so we warn the user instead',
          'Because TextBoxes are always empty',
          'To change the keyboard',
        ],
        answer: 1,
        explain: 'Validation stops bad input from crashing the app and helps the user fix the problem.',
      },
      {
        q: 'What does the NumbersOnly property on a TextBox do?',
        options: [
          'Converts words to numbers',
          'Shows a number keypad so users type numbers',
          'Makes the TextBox invisible',
          'Rounds the answer',
        ],
        answer: 1,
        explain: 'NumbersOnly brings up the numeric keyboard. You still need to check for empty input.',
      },
      {
        q: 'Why store 2.54 in a global variable called cmPerInch?',
        options: [
          'Numbers cannot be typed directly into math blocks',
          'It is easier to read, and you only change it in one place',
          'Global variables do math faster',
          'It is required by App Inventor',
        ],
        answer: 1,
        explain: 'A named constant makes code readable and avoids repeating the same "magic number".',
      },
      {
        q: 'To go from centimeters back to inches you should:',
        options: ['Multiply by 2.54', 'Divide by 2.54', 'Add 2.54', 'Subtract 2.54'],
        answer: 1,
        explain: 'Converting back means doing the opposite operation: divide instead of multiply.',
      },
    ],
    checks: [
      { kind: 'component', type: 'TextBox', label: 'Has a TextBox for input' },
      { kind: 'anyBlock', types: ['math_multiply', 'math_division'], label: 'Uses multiply or divide' },
      { kind: 'block', type: 'text_isEmpty', label: 'Validates input with "is empty"' },
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'event', component: 'Button', event: 'Click', label: 'Uses a Button.Click event' },
      { kind: 'block', type: 'global_declaration', label: 'Stores the factor in a global variable' },
    ],
    teacherNotes:
      'App Inventor will auto-convert numeric text in math blocks, but empty text throws a runtime error ("The operation * cannot accept the arguments: [], [2.54]"). Let a few students hit that error on purpose before adding validation; it makes the lesson stick. NumbersOnly still allows an empty box and, on some keyboards, a lone "-" or ".". Fahrenheit is a great differentiator for students who finish early.',
  },
]
