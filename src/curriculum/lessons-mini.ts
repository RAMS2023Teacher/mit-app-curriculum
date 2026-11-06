import type { Lesson } from '../types'

// Branch 1: "Your first product". Each company picks ONE of these three.
// All three practice global variables and if/else, in a different flavor.
// Later lessons must NOT rely on anything taught only here.

export const MINI_LESSONS: Lesson[] = [
  {
    id: 'mini-quiz',
    title: 'Quiz Show',
    subtitle: 'A trivia game that keeps score',
    icon: '🎯',
    track: 'mini',
    concepts: ['Global variables', 'If / else if / else', 'Comparing text', 'Notifier'],
    periods: 3,
    xp: { quiz: 40, build: 120, bonus: 40 },
    project: {
      name: 'Quiz Show',
      description:
        'A three-question trivia game. Players pick an answer, get instant feedback, tap Next, and see their final score at the end.',
    },
    objectives: [
      'Use global variables (score, questionNumber, correct) to track the state of a game',
      'Use if / else if / else to decide which question to show',
      'Compare the player\'s answer to the correct answer and update the score',
      'Show pop-up feedback with a Notifier and hide or show buttons with Visible',
    ],
    intro:
      'For a game company, the big question is: **is it fun to play?** Your first product is a quiz show. Behind the scenes, the app must *remember* three things the whole time: which question the player is on, the right answer to that question, and how many they got right. That memory lives in **global variables**, and **if** blocks decide what happens next.',
    vocab: [
      { term: 'Global variable', def: 'A named value that every block on the screen can read and change, like score.' },
      { term: 'State', def: 'Everything the app is remembering right now (current question, score, and so on).' },
      { term: 'Condition', def: 'A true-or-false question, like "is this answer the correct one?"' },
      { term: 'Notifier', def: 'A component that shows pop-up messages.' },
    ],
    steps: [
      {
        title: 'Design the game screen (your topic!)',
        editor: 'designer',
        body:
          '**Your choice:** pick a quiz topic (sports, animals, music, your school...).\n\nStart a project called `QuizShow`. Add:\n\n- A **Label** `QuestionLabel` (FontSize 20 or more)\n- Three **Buttons**: `AnswerA`, `AnswerB`, `AnswerC`\n- A **Button** `NextButton` (Text `Next ▶`). Uncheck its **Visible** box so it starts hidden.\n- A **Label** `ScoreLabel` (Text `Score: 0`)\n- A **Notifier** (User Interface drawer)',
        simple: 'Pick a quiz topic. Add a question label, three answer buttons, a hidden Next button, a score label, and a Notifier.',
        check: 'Test now: the phone shows the question label and three buttons. The Next button is hidden.',
        stuck: ['You can see hidden parts in the Designer if you check "Display hidden components in Viewer".'],
        newBlocks: [
          { name: 'Visible', where: 'Properties panel (or set … Visible in Blocks)', what: 'Shows or hides a part of the screen.' },
          { name: 'Notifier', where: 'Palette → User Interface', what: 'Shows pop-up messages.' },
        ],
      },
      {
        title: 'Create the game\'s memory (fill the blank)',
        editor: 'blocks',
        body:
          'Make three `initialize global` blocks: `score` starts at `0`, `questionNumber` starts at `1`, and `correct` will hold the right answer for the current question. **Fill the blank** for `correct` with an empty text block (Text drawer). The question blocks will fill it in.',
        simple: 'Make three variables: score (0), questionNumber (1), and correct (empty text).',
        blocks: ['initialize global score to: 0', 'initialize global questionNumber to: 1', 'initialize global correct to: ___'],
      },
      {
        title: 'Show question 1',
        editor: 'blocks',
        body:
          'Put an **if** block in `when Screen1.Initialize`. Use the blue gear to add two **else if** parts. For each question number, set the question text, the three answer texts, **and** the `correct` variable.\n\nQuestion 1 is shown. **Write your own questions 2 and 3** in the blanks.',
        simple: 'When the app opens, show question 1. For each question, set the question, the three answers, and the right answer.',
        blocks: [
          'when Screen1.Initialize do',
          '  if get global questionNumber = 1',
          '    set QuestionLabel.Text to: "What planet is closest to the sun?"',
          '    set AnswerA.Text to: "Venus"',
          '    set AnswerB.Text to: "Mercury"',
          '    set AnswerC.Text to: "Mars"',
          '    set global correct to: "Mercury"',
          '  else if get global questionNumber = 2',
          '    ...set the question, 3 answers, and correct for question 2: ___',
          '  else if get global questionNumber = 3',
          '    ...set the question, 3 answers, and correct for question 3: ___',
        ],
        check: 'Test now: refresh the Companion. Question 1 and its three answers appear.',
        stuck: ['The correct text must match the button text exactly, including capital letters and spaces.'],
      },
      {
        title: 'Check the answer',
        editor: 'blocks',
        day: 2,
        body:
          'This goes in `when AnswerA.Click`. Compare the button\'s own text to `correct`. If they match, add 1 to `score`. Either way, show a message, update the score, turn off the answer buttons (so nobody taps twice), and show **Next**.',
        simple: 'When an answer is tapped, check if its text equals the right answer. Add a point if it does. Then show the Next button.',
        blocks: [
          'when AnswerA.Click do',
          '  if AnswerA.Text = get global correct',
          '    set global score to: (get global score) + 1',
          '    call Notifier1.ShowAlert(notice: "Correct!")',
          '  else',
          '    call Notifier1.ShowAlert(notice: join("Nope! It was ", get global correct))',
          '  set ScoreLabel.Text to: join("Score: ", get global score)',
          '  set AnswerA.Enabled to: false',
          '  set AnswerB.Enabled to: false',
          '  set AnswerC.Enabled to: false',
          '  set NextButton.Visible to: true',
        ],
        check: 'Test now: tap the right answer for question 1. You see "Correct!", the score goes to 1, and Next appears.',
        stuck: ['Use the green Logic = block or the Text compare block to compare text.'],
      },
      {
        title: 'Answers B and C (words only)',
        editor: 'blocks',
        body:
          'Build `when AnswerB.Click` and `when AnswerC.Click` yourself. They are the same as AnswerA, but the **if** compares *that* button\'s text. Tip: right-click → **Duplicate**, then change the button name in the event and in the if test. (The Enabled and Visible lines stay the same.)',
        simple: 'Make the same blocks for AnswerB and AnswerC. Change which button\'s text is checked.',
        check: 'Test now: on question 1, tap a wrong answer. You see "Nope! It was Mercury" and the score does not change.',
        stuck: ['Red "duplicate event handler" error? The copy still says AnswerA in the event. Change the dropdown.'],
      },
      {
        title: 'Move to the next question',
        editor: 'blocks',
        body:
          'This goes in `when NextButton.Click`. Add 1 to `questionNumber`, hide Next, and turn the answers back on. Then: if `questionNumber > 3`, the game is over, so show the final score and hide the three answer buttons. **Else**, show the new question: copy the whole **if** block from Screen1.Initialize (right-click → **Duplicate**) and drop it into the else.',
        simple: 'Next adds 1 to the question number. After question 3, show "Game over". Otherwise, show the next question.',
        blocks: [
          'when NextButton.Click do',
          '  set global questionNumber to: (get global questionNumber) + 1',
          '  set NextButton.Visible to: false',
          '  set AnswerA.Enabled to: true   (and B, and C)',
          '  if get global questionNumber > 3',
          '    set QuestionLabel.Text to: join("Game over! You scored ", get global score)',
          '    set AnswerA.Visible to: false   (and B, and C)',
          '  else',
          '    ...a copy of the "show the question" if block...',
        ],
        check: 'Test now: answer all 3 questions. After the last Next, you see "Game over!" with your score.',
        stuck: [
          'Next shows the wrong question? The +1 block must come BEFORE the copied if block.',
          'Copying feels like a lot? It is. In the Procedures lesson you will learn how to avoid it.',
        ],
      },
      {
        title: 'Playtest, remix, submit',
        editor: 'phone',
        day: 3,
        body:
          'Have someone from another company play *without* seeing the answers. Does the score count correctly? Does the game end after question 3? Then do the **Remix**, export the `.aia`, and submit it.',
        simple: 'Let someone else play. Check the score and the ending. Do the Remix and submit.',
        frames: ['Our tester said ___.', 'We changed ___ because ___.'],
      },
    ],
    remix: {
      title: 'Remix: Question 4',
      spec: 'Add a fourth question. The game should now end after question 4, not 3.',
      hints: [
        'Add one more else if to BOTH copies of the "show the question" block.',
        'Find the number 3 in the game-over test and change it.',
      ],
    },
    challenge: {
      title: 'Bonus: Play again',
      body:
        'Add a **Play Again** button that only appears when the game is over. It resets `score` to 0 and `questionNumber` to 1, shows the answer buttons again, and shows question 1. Extra bonus: show a different message for a perfect score.',
    },
    quiz: [
      {
        q: 'Why are score and questionNumber global variables instead of just text in Labels?',
        options: [
          'Globals are faster to type',
          'The app needs to remember and change those values in many different events',
          'Labels cannot show numbers',
          'Global variables appear on the screen automatically',
        ],
        answer: 1,
        explain: 'Every answer button and the Next button need to read and change them. A global variable is the app\'s shared memory.',
      },
      {
        q: 'score is 1, questionNumber is 2, and correct is "Paris". AnswerC\'s text is "Paris". The player taps AnswerC. What does ScoreLabel show?',
        options: ['Score: 1', 'Score: 2', 'Score: 3', 'Score: Paris'],
        answer: 1,
        explain: 'AnswerC.Text equals correct, so score goes from 1 to 2, and the label shows Score: 2.',
      },
      {
        q: 'An if block has an "else" part. When does the else part run?',
        options: ['Always', 'Only when the test is true', 'Only when the test is false', 'Never, it is optional'],
        answer: 2,
        explain: 'else is the "otherwise" path: it runs only when the if test is false.',
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
      { kind: 'block', type: 'global_declaration', min: 3, label: 'Has at least 3 global variables' },
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'block', type: 'lexical_variable_set', label: 'Changes a variable with a set block' },
      { kind: 'component', type: 'Notifier', label: 'Has a Notifier' },
      { kind: 'method', method: 'ShowAlert', label: 'Calls Notifier.ShowAlert' },
      { kind: 'eventCount', min: 5, label: 'Has at least 5 event handlers' },
    ],
    teacherNotes:
      'The design is: Initialize shows question 1; each answer button grades against global correct and reveals Next; Next advances and shows the next question. The "show the question" block appears twice on purpose; it sets up the "why" for procedures. Text comparison is exact (capitals and spaces matter). Disabling the answer buttons after a tap stops score-farming. Ask partners to trace the variable values on paper for one full play-through.',
  },

  // ---------------------------------------------------------------------------
  {
    id: 'mini-sound',
    title: 'Soundboard',
    subtitle: 'Picture buttons that play sound clips',
    icon: '🔊',
    track: 'mini',
    concepts: ['Media files', 'Sound vs. Player', 'Boolean variables', 'If / else'],
    periods: 3,
    xp: { quiz: 40, build: 120, bonus: 40 },
    project: {
      name: 'Soundboard',
      description:
        'A grid of picture buttons that each play a sound clip, plus a Mute switch and a music button for background music.',
    },
    objectives: [
      'Upload image and sound files as media',
      'Choose between the Sound component (short clips) and the Player component (longer audio)',
      'Use a true/false global variable to remember a mode (muted or not)',
      'Use if / else to change what a button does based on that mode',
    ],
    intro:
      'Media companies make apps that look and sound great. A **soundboard** is a grid of buttons that each play a clip, like a drum kit or animal noises. To make it feel like a real product, you will add a **mute mode** that the app remembers with a **boolean** (true/false) variable.',
    vocab: [
      { term: 'Media file', def: 'A file (picture, sound, video) uploaded into your project.' },
      { term: 'Sound', def: 'Component for short sound effects. Plays right away, good for taps.' },
      { term: 'Player', def: 'Component for longer audio like music. Can stop and loop.' },
      { term: 'Boolean', def: 'A value that is either true or false.' },
    ],
    steps: [
      {
        title: 'Collect and upload media (your theme!)',
        editor: 'designer',
        body:
          '**Your choice:** pick a theme (drums, animals, game sounds, your own voice...).\n\nStart a project called `Soundboard`. Find 4 short sound clips (`.mp3` or `.wav`) and 4 matching pictures. Use free, school-safe sources your teacher approves, or record your own.\n\nUnder **Media** (bottom of the Components panel), click **Upload File** for each one. Keep each file under 1 MB.',
        simple: 'Pick a theme. Find 4 short sounds and 4 pictures. Upload them in the Media panel.',
        stuck: ['Big files load slowly or not at all. Use short clips (a few seconds) and small pictures.'],
        newBlocks: [{ name: 'Upload File', where: 'Media panel, under Components', what: 'Adds a picture or sound file to your project.' }],
      },
      {
        title: 'Build the button grid',
        editor: 'designer',
        body:
          '1. Add a **TableArrangement** (Layout drawer) with 2 columns and 2 rows.\n2. Drop a **Button** into each box. Set each button\'s **Image** to one of your pictures and clear its **Text**.\n3. Add one **Sound** (Media drawer) for effects and one **Player** for music.\n4. Add a Button `MuteButton` (Text `Mute: OFF`) and a Button `MusicButton` (Text `Play music`).',
        simple: 'Make a 2 by 2 grid of picture buttons. Add a Sound, a Player, a Mute button, and a Music button.',
        check: 'Test now: your phone shows four picture buttons in a grid.',
        newBlocks: [
          { name: 'TableArrangement', where: 'Palette → Layout', what: 'A grid with rows and columns.' },
          { name: 'Sound', where: 'Palette → Media', what: 'Plays short sound effects.' },
          { name: 'Player', where: 'Palette → Media', what: 'Plays longer audio, like music, and can loop.' },
        ],
      },
      {
        title: 'Play a clip on tap',
        editor: 'blocks',
        body:
          'One Sound component can play many clips: change its **Source** before calling **Play**. The file name must match the uploaded file exactly, including `.mp3`.',
        simple: 'When a picture button is tapped, set the Sound source to one file, then play it.',
        blocks: ['when Button1.Click do', '  set Sound1.Source to: "drum.mp3"', '  call Sound1.Play'],
        check: 'Test now: tap the first picture. Its sound plays.',
        stuck: [
          'No sound? File names must match exactly, including capital letters. "Drum.mp3" is not "drum.mp3".',
          'Still no sound? Check the phone or Chromebook is not muted.',
        ],
      },
      {
        title: 'The other three buttons (words only)',
        editor: 'blocks',
        body: 'Build the Click handlers for your other three picture buttons yourself. Each one uses its own sound file.',
        simple: 'Make the same blocks for your other three buttons, each with its own sound file.',
        check: 'Test now: all four buttons play different sounds.',
      },
      {
        title: 'Add mute mode with a boolean (fill the blank)',
        editor: 'blocks',
        day: 2,
        body:
          'Make a global variable `muted` set to `false` (Logic drawer). When MuteButton is clicked, flip it: true becomes false, false becomes true. **Fill the blank** with **not** (Logic drawer) holding `get global muted`. Then update the button text.',
        simple: 'Make a variable muted that starts false. The Mute button flips it, then changes its own text.',
        blocks: [
          'initialize global muted to: false',
          'when MuteButton.Click do',
          '  set global muted to: ___',
          '  if get global muted',
          '    set MuteButton.Text to: "Mute: ON"',
          '  else',
          '    set MuteButton.Text to: "Mute: OFF"',
        ],
        check: 'Test now: tap Mute twice. The text goes to "Mute: ON", then back to "Mute: OFF".',
        newBlocks: [
          { name: 'true / false', where: 'Logic drawer', what: 'The two boolean values.' },
          { name: 'not', where: 'Logic drawer', what: 'Flips true to false, and false to true.' },
        ],
      },
      {
        title: 'Respect the mute setting (fill the blank)',
        editor: 'blocks',
        body:
          'Go back to each sound button and put the two blocks inside an **if**. **Fill the blank** so the sound only plays when the app is *not* muted. The big idea: **the same event can do different things depending on what the app remembers.**',
        simple: 'Each picture button should only play when the app is not muted.',
        blocks: ['when Button1.Click do', '  if ___', '    set Sound1.Source to: "drum.mp3"', '    call Sound1.Play'],
        check: 'Test now: turn Mute ON. Tapping a picture plays nothing. Turn it OFF and it plays again.',
      },
      {
        title: 'Background music with Player',
        editor: 'blocks',
        body:
          'In the Designer, set **Player1.Source** to a music file and check **Loop**. In Blocks, make MusicButton start the music, or stop it if it is already playing. **Player1.IsPlaying** is true while music plays.',
        simple: 'The Music button starts the music, or stops it if it is already playing.',
        blocks: [
          'when MusicButton.Click do',
          '  if Player1.IsPlaying',
          '    call Player1.Stop',
          '    set MusicButton.Text to: "Play music"',
          '  else',
          '    call Player1.Start',
          '    set MusicButton.Text to: "Stop music"',
        ],
        check: 'Test now: tap Music. Music plays and the button says "Stop music". Tap again and it stops.',
      },
      {
        title: 'Test, remix, submit',
        editor: 'phone',
        day: 3,
        body:
          'Test every button with the volume up, then turn Mute ON and make sure nothing plays. Do the **Remix**, export the `.aia`, and submit it.',
        simple: 'Test every button and the mute. Do the Remix and submit.',
      },
    ],
    remix: {
      title: 'Remix: Surprise button',
      spec: 'Add a Surprise button. When it is tapped (and the app is not muted), it plays one of your four sounds, chosen at random.',
      hints: [
        'Use random integer from 1 to 4 and save it in a variable.',
        'Use if / else if to pick the Source for each number.',
        'Do not forget the mute check.',
      ],
    },
    devices: [
      { need: 'Phone has a silent switch (iPhone)', fallback: 'Flip the switch off silent. Sound and Player follow it.' },
      { need: 'School computer blocks sound', fallback: 'Test on a phone with the Companion, or use headphones.' },
    ],
    challenge: {
      title: 'Bonus: Make it vibrate',
      body:
        'Sound has a **Vibrate** method (it shakes the phone). Add a third mode, "Vibrate only", that vibrates for 200 milliseconds instead of playing a sound. Hint: use a number variable for the mode (0 = sound, 1 = mute, 2 = vibrate) and **else if**.',
    },
    quiz: [
      {
        q: 'Which component is best for playing a full song that the user can stop?',
        options: ['Sound', 'Player', 'Notifier', 'Label'],
        answer: 1,
        explain: 'Player is built for longer audio and has Start, Stop, and Loop. Sound is for short effects.',
      },
      {
        q: 'muted starts as false. The user taps MuteButton twice, then taps Button1 (which only plays "if not get global muted"). Does the sound play?',
        options: ['Yes', 'No', 'Only the first time', 'The app shows an error'],
        answer: 0,
        explain: 'false → true → false. muted is false again, so "not muted" is true and the sound plays.',
      },
      {
        q: 'You tap a button and nothing plays. The Source is "Drum.mp3" but the uploaded file is "drum.mp3". What happened?',
        options: ['The phone is broken', 'File names must match exactly, including capital letters', 'Sound can only play .wav files', 'You need a Player instead'],
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
        explain: 'The if block makes the same tap act differently depending on the mute state.',
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
      'Finding media takes longer than coding. Pre-approve a few free libraries or let students record clips with a phone voice recorder. Large files (>5 MB) slow the Companion and can fail to load. On some school Chromebooks audio is muted at the system level. The toggle with "not" is a key pattern; ask students to explain it out loud. Fair use of found sounds is a good discussion here (see the Talk it over prompt).',
  },

  // ---------------------------------------------------------------------------
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
        'Type a number, tap a button, and convert it, for example inches ↔ centimeters. The app shows a helpful message instead of crashing on bad input.',
    },
    objectives: [
      'Read a number the user types into a TextBox',
      'Use math blocks to multiply and divide',
      'Check input before doing math (empty, not a number)',
      'Store the conversion factor and unit names in global variables so they are easy to change',
    ],
    intro:
      'Tool companies build apps people use every day to get something done. A **unit converter** takes input, does a calculation, and shows a result. A good tool **never crashes on bad input**. Today you will check what the user typed with an **if** block before you trust it.',
    vocab: [
      { term: 'Input', def: 'Information the user gives the app, like a number typed in a TextBox.' },
      { term: 'Output', def: 'What the app shows back, like the converted answer.' },
      { term: 'Validation', def: 'Checking that input is OK before using it.' },
      { term: 'Constant', def: 'A value that does not change while the app runs, like 2.54 cm per inch.' },
    ],
    steps: [
      {
        title: 'Pick your conversion',
        body:
          '**Your choice:** with your partner, pick ONE conversion your users would want. Write down its factor:\n\n- inches → centimeters: **2.54**\n- miles → kilometers: **1.609**\n- pounds → kilograms: **0.4536**\n- cups → milliliters: **236.6**\n\nTo go forward you **multiply** by the factor. To go back you **divide**.',
        simple: 'Pick one conversion from the list. Write down its number (the factor). Forward = multiply. Back = divide.',
        frames: ['Our app converts ___ to ___. The factor is ___.'],
      },
      {
        title: 'Design the tool',
        editor: 'designer',
        body:
          'Start a project called `UnitConverter`. Add:\n\n- A **TextBox** `InputBox`. Check **NumbersOnly** and set the Hint to `Enter a number`.\n- A **HorizontalArrangement** with two **Buttons**: `ConvertButton` and `BackButton`. Set their Text to your units, like `in → cm` and `cm → in`.\n- A **Label** `ResultLabel` with a large font.\n- A **Notifier** for error messages.',
        simple: 'Make a project called UnitConverter. Add a number box, two buttons side by side, a big result label, and a Notifier.',
        check: 'Test now: the two buttons sit side by side and show your units.',
        newBlocks: [
          { name: 'HorizontalArrangement', where: 'Palette → Layout', what: 'Puts the parts inside it side by side.' },
          { name: 'Notifier', where: 'Palette → User Interface', what: 'Shows pop-up messages.' },
        ],
      },
      {
        title: 'Store your factor and units (fill the blanks)',
        editor: 'blocks',
        body:
          'Store your numbers once, in global variables. If you ever need to fix one, you change one block. **Fill the blanks** with YOUR factor and YOUR two unit names (for example `2.54`, `"in"`, `"cm"`).',
        simple: 'Make three variables: your factor, the "from" unit name, and the "to" unit name.',
        blocks: ['initialize global factor to: ___', 'initialize global fromUnit to: ___', 'initialize global toUnit to: ___'],
      },
      {
        title: 'Convert, but check first',
        editor: 'blocks',
        body:
          'Check the box before doing math: is it empty? Is it not a number? Only then multiply and show the result.\n\n**format as decimal** (Math drawer) rounds the answer to 2 places, so `25.4000001` shows as `25.40`.',
        simple: 'If the box is empty or not a number, show a message. Otherwise, multiply by the factor and show the answer.',
        blocks: [
          'when ConvertButton.Click do',
          '  if is empty(InputBox.Text)',
          '    call Notifier1.ShowAlert(notice: "Type a number first!")',
          '  else if not(is number?(InputBox.Text))',
          '    call Notifier1.ShowAlert(notice: "Numbers only, please.")',
          '  else',
          '    set ResultLabel.Text to: join(format as decimal(InputBox.Text × get global factor, 2), " ", get global toUnit)',
        ],
        check: 'Test now: type 10 and tap Convert. For inches → cm you see "25.40 cm".',
        stuck: ['The format as decimal block needs two things: the number, and how many places (2).'],
        newBlocks: [
          { name: 'format as decimal', where: 'Math drawer', what: 'Shows a number with a set number of decimal places.' },
          { name: 'is number?', where: 'Math drawer', what: 'True when a text can be used as a number.' },
        ],
      },
      {
        title: 'Go the other direction (words only)',
        editor: 'blocks',
        day: 2,
        body:
          'Build `when BackButton.Click` yourself. It does the same checks, but **divides** by `factor` and shows `fromUnit` at the end.',
        simple: 'Make the Back button. Same checks, but divide instead of multiply, and show the "from" unit.',
        check: 'Test now: type 25.4 and tap Back. For cm → in you see "10.00 in".',
        stuck: ['Duplicate the Convert handler, change the button name, the × block to ÷, and toUnit to fromUnit.'],
      },
      {
        title: 'Try to break it, then submit',
        editor: 'phone',
        body:
          'Good tool-makers try to break their own tools. Test an empty box, `0`, a decimal like `2.5`, a very big number, and (on keyboards that allow it) a single `.`. Does anything crash or look wrong? Fix it, do the **Remix**, export the `.aia`, and submit it.',
        simple: 'Try bad inputs to break your app. Fix any problems. Do the Remix and submit.',
        frames: ['When we typed ___, the app ___. We fixed it by ___.'],
      },
    ],
    remix: {
      title: 'Remix: History',
      spec: 'Add a HistoryLabel. Every time a conversion works, add a new line to it like "10 in = 25.40 cm", so the user can see all their past conversions.',
      hints: [
        'Join the OLD HistoryLabel.Text with the new line.',
        'Put "\\n" at the end of each new line so the next one starts on a new line.',
        'Build the new line with join: the input, the from unit, " = ", the answer, the to unit.',
      ],
    },
    challenge: {
      title: 'Bonus: Temperature mode',
      body:
        'Add °F → °C buttons. The formula is `C = (F − 32) × 5 ÷ 9`. Build it from the inside out: first `F − 32`, then put that inside `× 5`, then put that inside `÷ 9`. Then add a check: if the °C answer is below 0, also show "Brr! Below freezing."',
    },
    quiz: [
      {
        q: 'Why check "is empty" before doing math?',
        options: [
          'To make the app faster',
          'Doing math on empty text causes an error, so we show a message instead',
          'Because TextBoxes are always empty',
          'To change the keyboard',
        ],
        answer: 1,
        explain: 'Checking input stops bad input from crashing the app and helps the user fix the problem.',
      },
      {
        q: 'factor is 2.54 and toUnit is "cm". The user types 4 and taps Convert. What does ResultLabel show?',
        options: ['"4 cm"', '"10.16 cm"', '"1.57 cm"', '"6.54 cm"'],
        answer: 1,
        explain: '4 × 2.54 = 10.16, formatted with 2 decimal places, then " cm".',
      },
      {
        q: 'Why store 2.54 in a global variable called factor?',
        options: [
          'Numbers cannot be typed into math blocks',
          'It is easier to read, and you only change it in one place',
          'Global variables do math faster',
          'App Inventor requires it',
        ],
        answer: 1,
        explain: 'A named value makes code readable and means you only change one block.',
      },
      {
        q: 'To go from centimeters back to inches you should:',
        options: ['Multiply by 2.54', 'Divide by 2.54', 'Add 2.54', 'Subtract 2.54'],
        answer: 1,
        explain: 'Going back means doing the opposite: divide instead of multiply.',
      },
    ],
    checks: [
      { kind: 'component', type: 'TextBox', label: 'Has a TextBox for input' },
      { kind: 'anyBlock', types: ['math_multiply', 'math_division'], label: 'Uses multiply or divide' },
      { kind: 'block', type: 'text_isEmpty', label: 'Checks input with "is empty"' },
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'event', component: 'Button', event: 'Click', label: 'Uses a Button.Click event' },
      { kind: 'block', type: 'global_declaration', label: 'Stores the factor in a global variable' },
    ],
    teacherNotes:
      'The generic names (ConvertButton, BackButton, factor, fromUnit, toUnit) let each company keep the conversion they chose. App Inventor converts numeric text in math blocks, but empty text throws a runtime error ("The operation * cannot accept the arguments: [], [2.54]"). Let a few students hit that error on purpose before adding validation. NumbersOnly still allows an empty box and, on some keyboards, a lone "-" or "."; the "is number?" check handles those. format as decimal is also taught in core Procedures, so nothing later depends on this lesson.',
  },
]
