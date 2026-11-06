import type { Lesson } from '../types'

// Game Studio path: Canvas, sprites, motion, game state, then an original game.

export const GAMES_LESSONS: Lesson[] = [
  {
    id: 'games-sprites',
    title: 'Canvas & Sprites',
    subtitle: 'Make characters you can tap',
    icon: '🐞',
    track: 'games',
    concepts: ['Canvas coordinates', 'ImageSprite', 'Random numbers', 'Touch events'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Bug Tap',
      description:
        'A bug appears on the screen. Tap it to score a point, and it instantly jumps to a random new spot. How fast can you get to 20?',
    },
    objectives: [
      'Use a Canvas as a game board and understand its x/y coordinate system',
      'Add an ImageSprite and respond to its Touched event',
      'Move a sprite to a random position that always stays on screen',
      'Track and display a score',
    ],
    intro:
      'Welcome to the **Game Studio**! Almost every 2D game is built on the same idea: a **board** (the Canvas) with **characters** (sprites) that move around on it. Every spot on the board has an **x** (how far from the left) and a **y** (how far from the top). Today you will build a tapping game, and learn the math that keeps your character on the screen.',
    vocab: [
      { term: 'Canvas', def: 'A drawing area that holds sprites. The top-left corner is x = 0, y = 0.' },
      { term: 'Sprite', def: 'A character or object in a game that can move and detect touches and collisions.' },
      { term: 'Coordinates', def: 'An (x, y) pair saying where something is. y gets BIGGER as you go DOWN.' },
      { term: 'Random integer', def: 'A whole number picked by chance between two limits.' },
    ],
    steps: [
      {
        title: 'Set up the game board',
        editor: 'designer',
        body:
          'Start a project called `BugTap`. Add a **Label** named `ScoreLabel` (Text `Score: 0`) at the top. Then from the **Drawing and Animation** drawer add a **Canvas**. Set its **Width** to *Fill parent* and **Height** to *Fill parent* so it takes up the rest of the screen. Give it a **BackgroundColor** or upload a **BackgroundImage** (grass, a kitchen floor…).',
      },
      {
        title: 'Add your sprite',
        editor: 'designer',
        body:
          'Upload a small picture of a bug (or any target, like a coin or a balloon). PNG with a transparent background looks best. Drag an **ImageSprite** *onto the Canvas*. Sprites only work inside a Canvas. Set its **Picture** to your image and its **Width** and **Height** to about `60` pixels. Rename it `Bug`.',
      },
      {
        title: 'Understand the coordinates',
        body:
          'On a Canvas, `x = 0, y = 0` is the **top-left** corner. x grows to the right, y grows **downward** (the opposite of math class!). A sprite\'s X and Y are the position of its *top-left corner*.\n\nSo to keep the bug fully on screen, its X must be between `0` and `Canvas1.Width − Bug.Width`. Same idea for Y with Height. Sketch this on paper with your partner before coding.',
      },
      {
        title: 'Score when the bug is tapped',
        editor: 'blocks',
        body:
          'Create a global `score`. When the bug is touched, add 1 and update the label. The Touched event gives you `x` and `y` (where the finger was). You do not need them today, but they are there.',
        blocks: [
          'initialize global score to 0',
          'when Bug.Touched x y do',
          '  set global score to get global score + 1',
          '  set ScoreLabel.Text to join "Score: " get global score',
        ],
      },
      {
        title: 'Jump to a random spot',
        editor: 'blocks',
        body:
          'Still inside `Bug.Touched`, call **MoveTo** with random coordinates. Use **random integer from 0 to** the largest position that keeps the bug on screen.',
        blocks: [
          'when Bug.Touched x y do',
          '  set global score to get global score + 1',
          '  set ScoreLabel.Text to join "Score: " get global score',
          '  call Bug.MoveTo',
          '    x: random integer from 0 to Canvas1.Width - Bug.Width',
          '    y: random integer from 0 to Canvas1.Height - Bug.Height',
        ],
      },
      {
        title: 'Win condition, test, submit',
        editor: 'phone',
        body:
          'Add an **if** inside Touched: when `score = 20`, show "You win!" in the label and set `Bug.Visible` to `false`. Play it on your phone. Is the bug ever cut off at an edge? If so, re-check your MoveTo math. Export the `.aia` and submit it below.',
        blocks: [
          'if get global score = 20',
          '  set ScoreLabel.Text to "You win!"',
          '  set Bug.Visible to false',
        ],
      },
    ],
    challenge: {
      title: 'Bonus: Beat the clock',
      body:
        'Add a **Clock** that counts down 30 seconds in a Label. When time runs out, hide the bug and show the final score. Extra bonus: add a second "bad" sprite that **subtracts** 2 points if you tap it by mistake.',
    },
    quiz: [
      {
        q: 'On an App Inventor Canvas, where is the point x = 0, y = 0?',
        options: ['The center', 'The bottom-left corner', 'The top-left corner', 'The bottom-right corner'],
        answer: 2,
        explain: 'The origin is the top-left. x increases to the right and y increases downward.',
      },
      {
        q: 'Why do we use "Canvas1.Width − Bug.Width" as the largest random X?',
        options: [
          'To make the bug move faster',
          'Because X is the sprite\'s left edge; this keeps the whole bug on screen',
          'Because random numbers must be smaller than 100',
          'To center the bug',
        ],
        answer: 1,
        explain: 'If X were the full Canvas width, the bug\'s left edge would be at the right edge and it would be off screen.',
      },
      {
        q: 'Where must an ImageSprite be placed in the Designer?',
        options: ['Anywhere on Screen1', 'Inside a Canvas', 'Inside a HorizontalArrangement', 'In the Media panel'],
        answer: 1,
        explain: 'Sprites live on a Canvas. That is what lets them move, be touched, and collide.',
      },
      {
        q: 'Which event runs when the player taps the sprite?',
        options: ['Bug.Click', 'Bug.Touched', 'Canvas1.Initialize', 'Bug.EdgeReached'],
        answer: 1,
        explain: 'Sprites use Touched (with the x and y of the tap) instead of Click.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Canvas', label: 'Has a Canvas' },
      { kind: 'component', type: 'ImageSprite', label: 'Has an ImageSprite' },
      { kind: 'event', component: 'ImageSprite', event: 'Touched', label: 'Uses an ImageSprite.Touched event' },
      { kind: 'method', method: 'MoveTo', label: 'Calls MoveTo' },
      { kind: 'block', type: 'math_random_int', label: 'Uses a random integer' },
      { kind: 'block', type: 'global_declaration', label: 'Tracks the score in a global variable' },
    ],
    teacherNotes:
      'The inverted y-axis trips up nearly everyone; a quick whiteboard sketch of a phone with coordinates in the corners saves a lot of time. Canvas.Width is only reliable after the screen lays out. If students call MoveTo in Screen1.Initialize with Fill parent, they may get 0 or -1, so move the first jump into Touched or a short Clock delay. Encourage original sprite art (drawn in a free editor) rather than copyrighted characters.',
  },

  {
    id: 'games-motion',
    title: 'Motion & Collisions',
    subtitle: 'Things that move, bounce, and crash',
    icon: '☄️',
    track: 'games',
    concepts: ['Heading & Speed', 'Edge detection', 'Collision detection', 'Drag controls'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Dodge It',
      description:
        'Balls bounce around the screen. Drag your player to dodge them; if one hits you, it\'s game over.',
    },
    objectives: [
      'Make sprites move on their own with Heading, Speed, and Interval',
      'Bounce off walls with the EdgeReached event and the Bounce method',
      'Detect when two sprites touch with CollidedWith',
      'Move the player by dragging a finger across the Canvas',
    ],
    intro:
      'Last time your sprite only moved when tapped. Real games have things that **move on their own**. App Inventor sprites have built-in motion: give one a **direction** (Heading) and a **speed**, and it glides across the Canvas by itself. Then you need to know when it hits a wall or *another sprite*, which is called **collision detection**, the heart of almost every action game.',
    vocab: [
      { term: 'Heading', def: 'The direction a sprite moves in degrees: 0 = right, 90 = up, 180 = left, 270 = down.' },
      { term: 'Speed', def: 'How many pixels a sprite moves each step.' },
      { term: 'Interval', def: 'How many milliseconds between each step. Smaller = smoother/faster.' },
      { term: 'Collision', def: 'When two sprites overlap on the Canvas.' },
    ],
    steps: [
      {
        title: 'Board, player, and enemies',
        editor: 'designer',
        body:
          'Start a project called `DodgeIt`. Add a **Canvas** (Fill parent, both ways). On it, place:\n\n- An **ImageSprite** named `Player` (your hero, about 50×50)\n- Two **Ball** components named `Enemy1` and `Enemy2`. Set **Radius** to `15` and pick a bright **PaintColor**.\n\nAdd a **Label** named `StatusLabel` above the Canvas.',
      },
      {
        title: 'Set the enemies in motion',
        editor: 'designer',
        body:
          'Select `Enemy1` and set **Speed** to `8`, **Interval** to `50`, and **Heading** to `45` (up and to the right). Give `Enemy2` a different heading, like `200`. Watch your phone: they move! But they get stuck at the edge… let\'s fix that.',
      },
      {
        title: 'Bounce off the walls',
        editor: 'blocks',
        body:
          'When a ball hits the edge, the **EdgeReached** event tells you *which* edge. Pass that straight into **Bounce**, which flips the heading for you. Do this for both enemies.',
        blocks: ['when Enemy1.EdgeReached edge do', '  call Enemy1.Bounce', '    edge: get edge'],
      },
      {
        title: 'Drag the player',
        editor: 'blocks',
        body:
          'The **Dragged** event fires over and over while a finger slides on the sprite. It gives you the finger\'s `currentX` and `currentY`. Move the player there. Subtract half the player\'s size so your finger is in the middle of the sprite.',
        blocks: [
          'when Player.Dragged startX startY prevX prevY currentX currentY do',
          '  call Player.MoveTo',
          '    x: get currentX - Player.Width / 2',
          '    y: get currentY - Player.Height / 2',
        ],
      },
      {
        title: 'Detect the crash',
        editor: 'blocks',
        body:
          '**CollidedWith** fires when the player overlaps another sprite, and `other` tells you which one. Stop the game by setting every enemy\'s **Enabled** to `false` (that freezes its motion).',
        blocks: [
          'when Player.CollidedWith other do',
          '  set StatusLabel.Text to "💥 Game over!"',
          '  set Enemy1.Enabled to false',
          '  set Enemy2.Enabled to false',
        ],
      },
      {
        title: 'Playtest and submit',
        editor: 'phone',
        body:
          'Play several rounds. Too easy? Raise the Speed. Too hard? Lower it or make the balls smaller. Finding the right challenge is called **game balancing**. Export your `.aia` and submit it.',
      },
    ],
    challenge: {
      title: 'Bonus: Restart and survive',
      body:
        'Add a **Start** button that re-enables the enemies and moves them back to the top corners with MoveTo. Add a **Clock** that counts how many seconds the player survives, and show it in StatusLabel when the game ends.',
    },
    quiz: [
      {
        q: 'A sprite has Heading 180. Which way does it move?',
        options: ['Right', 'Up', 'Left', 'Down'],
        answer: 2,
        explain: '0 is right, 90 is up, 180 is left, 270 is down, like a compass turned on its side.',
      },
      {
        q: 'What does "call Enemy1.Bounce edge: get edge" do inside EdgeReached?',
        options: [
          'Deletes the ball',
          'Changes the ball\'s heading so it reflects off the edge it hit',
          'Moves the ball to the center',
          'Makes the ball bigger',
        ],
        answer: 1,
        explain: 'Bounce uses the edge number from the event to reflect the heading, like a real bounce.',
      },
      {
        q: 'In Player.CollidedWith, what is "other"?',
        options: [
          'The edge of the screen',
          'The sprite or ball the player collided with',
          'The player\'s score',
          'The Canvas',
        ],
        answer: 1,
        explain: '"other" is the component that was hit, so you can react differently to enemies vs. coins.',
      },
      {
        q: 'You want enemies to move faster. Which change does NOT help?',
        options: ['Increase Speed', 'Decrease Interval', 'Increase Interval', 'Both A and B help'],
        answer: 2,
        explain: 'A bigger Interval means more time between steps, so the sprite moves slower.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Canvas', label: 'Has a Canvas' },
      { kind: 'anyComponent', types: ['Ball', 'ImageSprite'], label: 'Has moving sprites (Ball or ImageSprite)' },
      { kind: 'method', method: 'Bounce', label: 'Calls Bounce' },
      { kind: 'event', component: 'Ball', event: 'EdgeReached', label: 'Uses a Ball.EdgeReached event' },
      { kind: 'event', component: 'ImageSprite', event: 'CollidedWith', label: 'Uses an ImageSprite.CollidedWith event' },
      { kind: 'event', component: 'ImageSprite', event: 'Dragged', label: 'Uses an ImageSprite.Dragged event' },
    ],
    teacherNotes:
      'Heading uses math-class angles (counter-clockwise, 90 = up), even though y grows downward; acknowledge the inconsistency openly. Collision detection uses the sprites\' bounding boxes, so transparent padding in images causes "I didn\'t touch it!" complaints; crop images tightly. On slow phones, Interval below ~30 ms can stutter. If a ball spawns overlapping an edge it can get "stuck" bouncing; start balls away from edges.',
  },

  {
    id: 'games-state',
    title: 'Score, Lives & Levels',
    subtitle: 'Game state, difficulty, and a saved high score',
    icon: '❤️',
    track: 'games',
    concepts: ['Game state', 'Procedures', 'Clock timers', 'Saving data (TinyDB)'],
    periods: 3,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Dodge It 2.0',
      description:
        'Upgrade Dodge It with 3 lives, a score that ticks up while you survive, levels that speed up the enemies, and a high score that is saved even after you close the app.',
    },
    objectives: [
      'Keep track of game state with several global variables (score, lives, level)',
      'Organize code into resetGame and gameOver procedures',
      'Use a Clock to raise the score and difficulty over time',
      'Save and load a high score with TinyDB',
    ],
    intro:
      'A game that ends on the first hit gets boring fast. Real games have **lives**, **levels**, and a **high score** to beat. That means your app is tracking a lot of **state** at once. To keep it from becoming spaghetti, you will put the big moments, *start a game* and *end a game*, into **procedures** you can call from anywhere. And with **TinyDB**, your high score survives even when the app is closed.',
    vocab: [
      { term: 'Game state', def: 'All the values that describe the game right now: score, lives, level, playing or not.' },
      { term: 'Game loop', def: 'Code that runs over and over (here, Clock.Timer) to update the game.' },
      { term: 'TinyDB', def: 'A component that saves values on the phone so they are still there next time.' },
      { term: 'Tag', def: 'The name a value is saved under in TinyDB, like "highScore".' },
    ],
    steps: [
      {
        title: 'Plan the state',
        body:
          'Open your **Dodge It** project and use **Projects → Save project as…** to make `DodgeIt2`. Before coding, list on paper every value the game must remember: `score`, `lives`, `level`, and whether the game is running. What should each be at the start of a new game?',
      },
      {
        title: 'Add components and globals',
        body:
          'In the Designer add a **Clock** (Sensors drawer) with **TimerInterval** `1000` (1 second), a **TinyDB** (Storage drawer), and Labels for `ScoreLabel`, `LivesLabel`, and `HighLabel`. Add a **Button** named `StartButton`. Then in Blocks create the globals:',
        blocks: ['initialize global score to 0', 'initialize global lives to 3', 'initialize global level to 1'],
      },
      {
        title: 'The resetGame procedure',
        editor: 'blocks',
        body:
          'From the **Procedures** drawer drag out `to procedure do` and name it `resetGame`. Everything needed to start a fresh game goes here. Call it from `StartButton.Click`.',
        blocks: [
          'to resetGame do',
          '  set global score to 0',
          '  set global lives to 3',
          '  set global level to 1',
          '  set Enemy1.Speed to 5',
          '  set Enemy1.Enabled to true',
          '  set Clock1.TimerEnabled to true',
          'when StartButton.Click do',
          '  call resetGame',
        ],
      },
      {
        title: 'Lose a life (not the whole game)',
        editor: 'blocks',
        body:
          'Change `Player.CollidedWith`: subtract a life and move the enemy away so it doesn\'t hit again instantly. Only when lives reach 0 do you call `gameOver`.',
        blocks: [
          'when Player.CollidedWith other do',
          '  set global lives to get global lives - 1',
          '  set LivesLabel.Text to join "Lives: " get global lives',
          '  call Enemy1.MoveTo x: 0 y: 0',
          '  if get global lives ≤ 0',
          '    call gameOver',
        ],
      },
      {
        title: 'The game loop: score and levels',
        editor: 'blocks',
        body:
          'Every second you survive is a point. Every 10 points is a new level, and the enemies speed up. The Math **modulo** block gives the remainder: `modulo of score ÷ 10 = 0` is true at 10, 20, 30…',
        blocks: [
          'when Clock1.Timer do',
          '  set global score to get global score + 1',
          '  set ScoreLabel.Text to join "Score: " get global score',
          '  if modulo of get global score ÷ 10 = 0',
          '    set global level to get global level + 1',
          '    set Enemy1.Speed to Enemy1.Speed + 2',
        ],
      },
      {
        title: 'gameOver and the saved high score',
        editor: 'blocks',
        body:
          'TinyDB **GetValue** reads a saved value (or a default if nothing is saved yet); **StoreValue** saves one. Compare, save if it\'s a new record, and show it. Also load the high score in `Screen1.Initialize` so it appears as soon as the app opens.',
        blocks: [
          'to gameOver do',
          '  set Clock1.TimerEnabled to false',
          '  set Enemy1.Enabled to false',
          '  if get global score > call TinyDB1.GetValue tag: "highScore" valueIfTagNotThere: 0',
          '    call TinyDB1.StoreValue tag: "highScore" valueToStore: get global score',
          '    set StatusLabel.Text to "🏆 New high score!"',
          '  set HighLabel.Text to join "Best: " call TinyDB1.GetValue tag: "highScore" valueIfTagNotThere: 0',
        ],
      },
      {
        title: 'Test the whole loop and submit',
        editor: 'phone',
        body:
          'Test a full cycle: start, lose all lives, see game over, start again. Does everything reset? Close the Companion and reconnect: is the high score still there? Export the `.aia` and submit.',
      },
    ],
    challenge: {
      title: 'Bonus: Power-ups',
      body:
        'Add a heart sprite that appears every 15 seconds at a random spot. Touching it gives +1 life (max 5). Put the "spawn a heart" code in its own procedure, and use **if** to cap lives at 5.',
    },
    quiz: [
      {
        q: 'Why put the start-of-game code in a resetGame procedure?',
        options: [
          'Procedures run faster than events',
          'It groups the code in one place so it can be called from anywhere, like a Start or Play Again button',
          'TinyDB requires it',
          'Global variables only work inside procedures',
        ],
        answer: 1,
        explain: 'Procedures let you name a chunk of code and reuse it without copying blocks.',
      },
      {
        q: 'What is TinyDB used for in this game?',
        options: [
          'Moving the enemies',
          'Counting seconds',
          'Saving the high score on the phone so it lasts after the app closes',
          'Detecting collisions',
        ],
        answer: 2,
        explain: 'Global variables reset when the app restarts. TinyDB stores data on the device.',
      },
      {
        q: 'Clock1 has TimerInterval 1000. How often does Clock1.Timer run?',
        options: ['Every 1000 seconds', 'Once', 'Every second', '1000 times per second'],
        answer: 2,
        explain: 'TimerInterval is in milliseconds; 1000 ms = 1 second.',
      },
      {
        q: 'Players lose all 3 lives from a single hit. What is the most likely cause?',
        options: [
          'TinyDB is full',
          'CollidedWith fires several times while the sprites keep overlapping',
          'The Clock is too slow',
          'The score is a global variable',
        ],
        answer: 1,
        explain: 'If the enemy stays on top of the player, collisions keep firing. Move the enemy away right after a hit.',
      },
    ],
    checks: [
      { kind: 'block', type: 'global_declaration', min: 2, label: 'Has at least 2 global variables' },
      { kind: 'block', type: 'procedures_defnoreturn', label: 'Defines a procedure' },
      { kind: 'component', type: 'Clock', label: 'Has a Clock' },
      { kind: 'event', component: 'Clock', event: 'Timer', label: 'Uses a Clock.Timer event' },
      { kind: 'component', type: 'TinyDB', label: 'Has a TinyDB' },
      { kind: 'method', method: 'StoreValue', label: 'Saves data with StoreValue' },
      { kind: 'method', method: 'GetValue', label: 'Loads data with GetValue' },
    ],
    teacherNotes:
      'This is the hardest Game Studio lesson; budget 3 periods. The multiple-collision bug (losing all lives at once) will happen to most teams. Let them discover it, then discuss fixes (move the enemy, or use a global "invincible" flag cleared by a second Clock). TinyDB data in the Companion is stored per Companion, not per project, so tags from other apps may collide; encourage unique tags like "dodgeHighScore". Clear it with TinyDB.ClearAll during testing if needed.',
  },

  {
    id: 'games-capstone',
    title: 'Capstone: Your Original Game',
    subtitle: 'Design, build, and playtest a game of your own',
    icon: '🕹️',
    track: 'games',
    concepts: ['Game design', 'Prototyping', 'Iteration', 'Combining everything'],
    periods: 6,
    xp: { quiz: 60, build: 300, bonus: 100 },
    project: {
      name: 'Your Studio\'s Original Game',
      description:
        'Your company designs and builds an original game from scratch: your idea, your art, your rules, using sprites, motion, game state, and procedures.',
    },
    objectives: [
      'Write a one-paragraph game pitch and define the core loop, controls, and win/lose conditions',
      'Sketch a paper prototype before building',
      'Build the game in short sprints, each ending with something playable',
      'Playtest with another company and improve the game based on feedback',
    ],
    intro:
      'This is it: your **Game Studio** ships its first original title. Professional studios don\'t start by coding; they start with an **idea**, a **paper prototype**, and a plan. Then they build in short **sprints**, playtest constantly, and cut features that aren\'t fun. You will do the same. Keep the idea **small and polished**: a simple game that works beats a huge game that doesn\'t.',
    vocab: [
      { term: 'Core loop', def: 'The action the player repeats over and over (e.g., dodge → collect → speed up).' },
      { term: 'Prototype', def: 'A quick, rough version of a game used to test whether the idea is fun.' },
      { term: 'Sprint', def: 'A short, focused work period that ends with something working.' },
      { term: 'Scope', def: 'How big the project is. "Scope creep" is when it keeps growing until it can\'t be finished.' },
    ],
    steps: [
      {
        title: 'Pitch it (Day 1)',
        body:
          'As a company, brainstorm 3 game ideas, then pick ONE. Write a short design doc in the submission notes (or a Google Doc) answering:\n\n- **Pitch**: one sentence. "It\'s a game where you…"\n- **Core loop**: what does the player do over and over?\n- **Controls**: tap, drag, tilt (AccelerometerSensor), or buttons?\n- **Win / lose**: how does a round end?\n- **Twist**: what makes it different from Bug Tap or Dodge It?\n\nGet a thumbs-up from your teacher before building.',
      },
      {
        title: 'Paper prototype (Day 1)',
        body:
          'Draw the game screen on paper. Cut out the sprites. One partner "plays" while the other moves the paper pieces like the computer would. Does the idea work? Is it fun? Is there anything confusing? Change the design *now*, while it is cheap.',
      },
      {
        title: 'Sprint 1: Something moves (Day 2)',
        editor: 'designer',
        body:
          'Goal: the **core loop works**, even with ugly placeholder art. Canvas, player sprite, controls, and at least one thing to dodge, catch, or tap. Divide the work: one partner builds the Designer layout and art, the other writes the movement blocks, then switch and review each other\'s work.',
      },
      {
        title: 'Sprint 2: Rules and state (Days 3–4)',
        editor: 'blocks',
        body:
          'Add score, lives or a timer, win/lose, and a **Clock** game loop. Use **procedures** for big moments: `startGame`, `endGame`, and any action you repeat. A good capstone uses at least two global variables and if blocks to make decisions.',
        blocks: [
          'initialize global score to 0',
          'initialize global timeLeft to 30',
          'to startGame do',
          '  set global score to 0',
          '  set global timeLeft to 30',
          '  set Clock1.TimerEnabled to true',
          'when Clock1.Timer do',
          '  set global timeLeft to get global timeLeft - 1',
          '  if get global timeLeft = 0',
          '    call endGame',
        ],
      },
      {
        title: 'Playtest with another company (Day 5)',
        editor: 'phone',
        body:
          'Swap with another company. Watch silently while they play, then ask:\n\n- What was fun? What was frustrating?\n- Did you understand what to do without being told?\n- Was it too easy or too hard?\n\nPick the **top 2 fixes** and make them. Balance difficulty by adjusting speeds, sizes, and timer lengths.',
      },
      {
        title: 'Sprint 3: Polish and submit (Day 6)',
        body:
          'Add real art, sound effects (a Sound component on scoring or crashing), a title screen or instructions label, and a high score with TinyDB if you have time. Clean up blocks and fix warnings. Export the `.aia` and submit it with your design doc in the notes and a short summary of what you changed after playtesting.',
      },
    ],
    challenge: {
      title: 'Bonus: Level up the design',
      body:
        'Add a feature from a later "version 2.0" list: multiple levels with different layouts, a second screen for instructions, tilt controls with AccelerometerSensor or OrientationSensor, or a power-up system. Describe in your notes how it changed playtesters\' experience.',
    },
    quiz: [
      {
        q: 'What is a game\'s "core loop"?',
        options: [
          'The Clock.Timer block',
          'The main action the player repeats over and over',
          'A for-each loop in your blocks',
          'The final level',
        ],
        answer: 1,
        explain: 'The core loop is the repeating gameplay, like jump → collect → avoid. If it\'s fun, the game is fun.',
      },
      {
        q: 'Why make a paper prototype before building?',
        options: [
          'App Inventor requires a drawing',
          'It is a cheap, fast way to test whether the idea is fun and clear before spending days coding',
          'To use as the background image',
          'It replaces playtesting',
        ],
        answer: 1,
        explain: 'Changing paper takes seconds; changing finished code takes hours.',
      },
      {
        q: 'Your team keeps adding new features and the game still doesn\'t work. This is called:',
        options: ['Debugging', 'Scope creep', 'Collision detection', 'Iteration'],
        answer: 1,
        explain: 'Scope creep makes projects impossible to finish. Lock the core first, then add extras.',
      },
      {
        q: 'At the end of each sprint, your game should be:',
        options: [
          'Completely finished',
          'Playable in some form, even if rough',
          'Published to the Gallery',
          'Exported to a new project',
        ],
        answer: 1,
        explain: 'Ending each sprint with something playable means you always have a working version to test.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Canvas', label: 'Has a Canvas' },
      { kind: 'anyComponent', types: ['ImageSprite', 'Ball'], label: 'Has an ImageSprite or Ball' },
      { kind: 'anyBlock', types: ['procedures_defnoreturn', 'procedures_defreturn'], label: 'Defines a procedure' },
      { kind: 'block', type: 'global_declaration', min: 2, label: 'Has at least 2 global variables' },
      { kind: 'block', type: 'controls_if', label: 'Uses an if block' },
      { kind: 'component', type: 'Clock', label: 'Has a Clock' },
      { kind: 'totalBlocks', min: 40, label: 'Has at least 40 blocks' },
    ],
    teacherNotes:
      'Approve each pitch before building and push teams to shrink scope: "What is the smallest version that is still fun?" Daily stand-ups (what did we do, what\'s next, what\'s blocking us) keep partners accountable. Check that both partners contributed; the design doc should name who did what. Original art and audio only, or properly licensed. Struggling teams can remix Dodge It 2.0 with a new theme and one new mechanic, which still meets every check.',
  },
]
