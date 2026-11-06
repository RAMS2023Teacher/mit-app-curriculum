import type { Lesson } from '../types'

// Game Studio path: Canvas, sprites, motion, game state, then an original game.
// Scaffolding fades across the path: full blocks → blanks (___) → words only.

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
        'A bug appears on the screen. Tap it to score a point, and it jumps to a random new spot. How fast can you get to 20?',
    },
    objectives: [
      'Use a Canvas as a game board and understand its x/y coordinate system',
      'Add an ImageSprite and respond to its Touched event',
      'Move a sprite to a random position that always stays on screen',
      'Track and display a score, and end the game with a win condition',
    ],
    intro:
      'Welcome to the **Game Studio**! Almost every 2D game has the same parts: a **board** (the Canvas) and **characters** (sprites) that move on it. Every spot on the board has an **x** (how far from the left) and a **y** (how far from the top). Today you build a tapping game and learn the math that keeps your character on the screen.',
    vocab: [
      { term: 'Canvas', def: 'A drawing area that holds sprites. The top-left corner is x = 0, y = 0.' },
      { term: 'Sprite', def: 'A character or object in a game that can move and notice touches and crashes.' },
      { term: 'Coordinates', def: 'An (x, y) pair that says where something is. y gets BIGGER as you go DOWN.' },
      { term: 'Random integer', def: 'A whole number picked by chance between two limits.' },
    ],
    steps: [
      {
        title: 'Set up the game board',
        editor: 'designer',
        body:
          'Start a project called `BugTap`. Add a **Label** named `ScoreLabel` (Text `Score: 0`) at the top. From the **Drawing and Animation** drawer add a **Canvas**. Set its **Width** and **Height** to *Fill parent* so it fills the rest of the screen. Give it a **BackgroundColor**, or upload a **BackgroundImage** (grass, a kitchen floor…).',
        simple: 'Make a project called BugTap. Add a Label for the score. Add a Canvas and make it fill the screen.',
        check: 'Test now: your phone shows the score label and a colored game board under it.',
        newBlocks: [{ name: 'Canvas', where: 'Palette → Drawing and Animation', what: 'A game board where sprites can move.' }],
        stuck: ['The Canvas is tiny? Set BOTH Width and Height to Fill parent.'],
      },
      {
        title: 'Add your sprite',
        editor: 'designer',
        body:
          'Upload a small picture of a bug (or a coin, or a balloon). A PNG with a see-through background looks best. **Crop it tightly**: empty space around the picture still counts as part of the sprite. Drag an **ImageSprite** *onto the Canvas*. Set its **Picture** to your image and its **Width** and **Height** to `60` pixels. Rename it `Bug`.',
        simple: 'Upload a small bug picture. Put an ImageSprite on the Canvas. Use your picture and make it 60 by 60. Name it Bug.',
        check: 'Test now: you see your bug on the board on your phone.',
        newBlocks: [{ name: 'ImageSprite', where: 'Palette → Drawing and Animation', what: 'A picture that can move and be tapped. It only works inside a Canvas.' }],
        stuck: [
          'The sprite will not drop? It must go INSIDE the Canvas, not on the screen around it.',
          'Picture looks huge? Set Width and Height to 60 pixels, not Automatic.',
        ],
      },
      {
        title: 'Understand the coordinates',
        body:
          'On a Canvas, `x = 0, y = 0` is the **top-left** corner. x grows to the right. y grows **downward**, the opposite of math class! A sprite\'s X and Y are the spot of its *top-left corner*.\n\nTo keep the bug fully on screen, X must stay between `0` and `Canvas1.Width − Bug.Width`. Y works the same way with Height. Sketch a phone on paper with your partner and label the four corners before you code.',
        simple: 'The top-left corner is 0, 0. y gets bigger going DOWN. To keep the bug on screen, X can be from 0 up to (Canvas width minus bug width).',
        stuck: ['Think of reading a page: you start at the top-left and go right and down.'],
      },
      {
        title: 'Score when the bug is tapped',
        editor: 'blocks',
        body:
          'Make a global variable `score`. When the bug is touched, add 1 and show the new score. Fill in the two blanks yourself: what should score start at, and what text goes before the number? The Touched event also gives you `x` and `y` (where the finger was). You do not need them today.',
        simple: 'Make a score variable. When the bug is tapped, add 1 to the score and show it. Fill in the blanks.',
        blocks: [
          'initialize global score to ___',
          'when Bug.Touched x y do',
          '  set global score to get global score + 1',
          '  set ScoreLabel.Text to join ___ get global score',
        ],
        check: 'Test now: tap the bug. The label shows Score: 1, then Score: 2…',
        stuck: [
          'Can\'t find "get global score"? Hover over the word "score" in the initialize block, then drag the "get" out.',
          'Score shows "Score:1" with no space? Put a space inside the quotes: "Score: ".',
        ],
      },
      {
        title: 'Jump to a random spot',
        editor: 'blocks',
        day: 2,
        body:
          'Still inside `Bug.Touched`, call **MoveTo** with random numbers. The largest x keeps the whole bug on screen. Fill in the y blank yourself: it works like x, but with Height.',
        simple: 'Inside Bug.Touched, move the bug to a random place. Use the same math for y as for x, but use Height.',
        blocks: [
          'when Bug.Touched x y do',
          '  set global score to get global score + 1',
          '  set ScoreLabel.Text to join "Score: " get global score',
          '  call Bug.MoveTo',
          '    x: random integer from 0 to Canvas1.Width - Bug.Width',
          '    y: random integer from 0 to ___',
        ],
        check: 'Test now: every tap makes the bug jump. Tap 20 times: it is never cut off at an edge.',
        newBlocks: [{ name: 'random integer from … to …', where: 'Math drawer', what: 'Picks a whole number by chance between the two limits.' }],
        stuck: [
          'Bug goes off the bottom? Check that the y blank uses Canvas1.Height − Bug.Height, not Width.',
          'Bug stuck in the top-left corner? Canvas1.Width can be −1 before the screen is drawn. Only move the bug inside Touched, not in Screen1.Initialize.',
          'The minus block is in the Math drawer. Snap Canvas1.Width into the left side and Bug.Width into the right.',
        ],
      },
      {
        title: 'Win condition, test, submit',
        editor: 'blocks',
        body:
          'Put an **if** at the *bottom* of `Bug.Touched`, after the score goes up. When `score = 20`, show "You win!" and hide the bug by setting its **Visible** to `false`. Then play the whole game on your phone. Export the `.aia` and submit it.',
        simple: 'At the bottom of Bug.Touched, add an if. When the score is 20, show "You win!" and hide the bug.',
        blocks: [
          'when Bug.Touched x y do',
          '  …the score and MoveTo blocks from before…',
          '  if get global score = 20',
          '    set ScoreLabel.Text to "You win!"',
          '    set Bug.Visible to false',
        ],
        check: 'Test now: at 20 taps the bug disappears and the label says You win!',
        newBlocks: [{ name: 'Visible', where: 'click the component → set Bug.Visible to', what: 'false hides a component; true shows it again.' }],
        stuck: [
          'The if must be INSIDE Bug.Touched. A loose if block never runs.',
          'Nothing happens at 20? Use the = block from the Math drawer, and make sure the if is below the score change.',
        ],
      },
    ],
    remix: {
      title: 'Decoy bee',
      spec:
        'Add a second sprite: a bee. It also jumps to a random spot whenever it is tapped. Tapping the bee takes away 2 points, but the score can never go below 0. The bee must always stay fully on screen.',
      hints: [
        'Copy the Bug.Touched blocks (right-click → Duplicate) and change them for the bee.',
        'Subtract 2, then use an if: if score < 0, set score to 0.',
        'For on-screen math, use Bee.Width and Bee.Height, not the bug\'s.',
      ],
    },
    devices: [
      { need: 'No phone today', fallback: 'Use Connect → Emulator if your teacher set it up. Click the bug with the mouse.' },
      { need: 'iPhone', fallback: 'Canvas and sprites work in the iOS Companion. Everything in this lesson works.' },
    ],
    challenge: {
      title: 'Bonus: Beat the clock',
      body:
        'Add a **Clock** that counts down 30 seconds in a Label. When time runs out, hide the bug and show the final score. Extra bonus: make the bug jump on its own every 2 seconds, even if nobody taps it.',
    },
    quiz: [
      {
        q: 'On an App Inventor Canvas, where is the point x = 0, y = 0?',
        options: ['The center', 'The bottom-left corner', 'The top-left corner', 'The bottom-right corner'],
        answer: 2,
        explain: 'The origin is the top-left. x grows to the right and y grows downward.',
      },
      {
        q: 'The Canvas is 300 wide and the bug is 60 wide. What is the largest X that keeps the whole bug on screen?',
        options: ['300', '360', '240', '60'],
        answer: 2,
        explain: 'X is the bug\'s left edge. 300 − 60 = 240, so the right edge lands exactly on the side of the Canvas.',
      },
      {
        q: 'Where must an ImageSprite be placed in the Designer?',
        options: ['Anywhere on Screen1', 'Inside a Canvas', 'Inside a HorizontalArrangement', 'In the Media panel'],
        answer: 1,
        explain: 'Sprites live on a Canvas. That is what lets them move, be touched, and crash into things.',
      },
      {
        q: 'The score is 19. The player taps the bug once. What does the label show after Bug.Touched runs?',
        options: ['Score: 19', 'Score: 20', 'You win!', 'Nothing changes'],
        answer: 2,
        explain: 'The score becomes 20 first, then the if at the bottom is true, so the label is changed to "You win!".',
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
      'Day 1 ends after the scoring step; Day 2 starts at "Jump to a random spot". The upside-down y-axis trips up nearly everyone: sketch a phone on the board with coordinates in each corner. Students now fill in two blanks (start value, label text, y-bound); circulate during the y-bound blank because it is the first time they write the math themselves. The remix (decoy bee) is the "you do": no blocks given, and it reuses the clamp-at-zero idea from conditionals. Encourage original sprite art rather than copyrighted characters.',
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
      description: 'Balls bounce around the screen. Drag your player to dodge them. If one hits you, the game is over.',
    },
    objectives: [
      'Make sprites move on their own with Heading, Speed, and Interval',
      'Bounce off walls with the EdgeReached event and the Bounce method',
      'Detect when two sprites touch with CollidedWith',
      'Move the player by dragging, and keep the player on screen',
    ],
    intro:
      'Last time your sprite only moved when you tapped it. Real games have things that **move on their own**. Give a sprite a **direction** (Heading) and a **speed**, and it moves across the Canvas by itself. Then you need to know when it hits a wall or *another sprite*. This is called **collision detection**, and almost every action game uses it.',
    vocab: [
      { term: 'Heading', def: 'The direction a sprite moves, in degrees: 0 = right, 90 = up, 180 = left, 270 = down.' },
      { term: 'Speed', def: 'How many pixels a sprite moves each step.' },
      { term: 'Interval', def: 'How many milliseconds between steps. Smaller = moves more often.' },
      { term: 'Collision', def: 'When two sprites overlap on the Canvas.' },
    ],
    steps: [
      {
        title: 'Board, player, and enemies',
        editor: 'designer',
        body:
          'Start a project called `DodgeIt`. Add a **Label** named `StatusLabel`, then a **Canvas** (Fill parent, both ways). On the Canvas place:\n\n- An **ImageSprite** named `Player` (your hero, about 50×50, cropped tightly)\n- Two **Ball** components named `Enemy1` and `Enemy2`. Set **Radius** to `15` and pick a bright **PaintColor**. Start them near the middle, not touching an edge.',
        simple: 'Make a project called DodgeIt. Add a label and a Canvas. On the Canvas, add one ImageSprite called Player and two Balls called Enemy1 and Enemy2.',
        check: 'Test now: you see the player and two balls on the board.',
        newBlocks: [{ name: 'Ball', where: 'Palette → Drawing and Animation', what: 'A round sprite. You set its size with Radius and its color with PaintColor.' }],
      },
      {
        title: 'Set the enemies in motion',
        editor: 'designer',
        body:
          'Select `Enemy1`. Set **Speed** to `8`, **Interval** to `50`, and **Heading** to `45` (up and to the right). Give `Enemy2` a different Heading, like `200`. Watch your phone: they move! But they get stuck at the edge. You will fix that next.',
        simple: 'Give Enemy1 Speed 8, Interval 50 and Heading 45. Give Enemy2 a different Heading. They start moving.',
        check: 'Test now: both balls move in different directions and stop at an edge.',
        stuck: [
          'Heading 90 goes UP even though y grows down. Headings use compass angles: 0 right, 90 up, 180 left, 270 down.',
          'Interval is the time between steps for THIS sprite. It is not the Clock\'s TimerInterval.',
        ],
      },
      {
        title: 'Bounce off the walls',
        editor: 'blocks',
        body:
          'When a ball hits the edge, **EdgeReached** tells you *which* edge. Pass that edge into **Bounce**, which turns the ball around for you. Here is Enemy1.\n\n**Now you:** build the same handler for `Enemy2` on your own. No blocks given!',
        simple: 'When Enemy1 hits an edge, bounce it. Then make the same blocks for Enemy2 by yourself.',
        blocks: ['when Enemy1.EdgeReached edge do', '  call Enemy1.Bounce', '    edge: get edge'],
        check: 'Test now: both balls bounce around the board and never get stuck.',
        newBlocks: [{ name: 'Bounce', where: 'click Enemy1 → call Enemy1.Bounce', what: 'Turns the ball so it bounces off the edge it hit.' }],
        stuck: [
          'Only Enemy1 bounces? You need a second EdgeReached block for Enemy2.',
          'Can\'t find "get edge"? Hover over the word edge on the event block.',
          'A ball shakes in a corner? It started touching the edge. Move it toward the middle in the Designer.',
        ],
      },
      {
        title: 'Drag the player',
        editor: 'blocks',
        body:
          '**Dragged** runs again and again while a finger slides on the player. It gives you the finger\'s `currentX` and `currentY`. Subtract half the player\'s size so your finger is in the middle of the sprite. Fill in the y blank yourself. Note: Dragged only works if your finger *starts on the player*.',
        simple: 'When you drag the player, move it to your finger. Subtract half its size so your finger is in the middle. Fill in the blank for y.',
        blocks: [
          'when Player.Dragged startX startY prevX prevY currentX currentY do',
          '  call Player.MoveTo',
          '    x: get currentX - Player.Width / 2',
          '    y: ___',
        ],
        check: 'Test now: put your finger on the player and slide. It follows your finger.',
        stuck: [
          'Player does not move? Start the drag ON the player, not on empty Canvas.',
          'Player jumps away from your finger? Check the y blank: currentY − Player.Height / 2.',
        ],
      },
      {
        title: 'Keep the player on screen',
        editor: 'blocks',
        body:
          'Right now you can drag the player half off the edge. **No blocks given:** after the MoveTo, use **if** blocks so that if `Player.X` is bigger than `Canvas1.Width − Player.Width`, you set `Player.X` to that number. Do the same for Y with Height. This is the same "stay on screen" math as Bug Tap.',
        simple: 'Stop the player from leaving the screen. If Player.X is too big, set it back to the biggest allowed number. Do the same for Y.',
        check: 'Test now: drag the player hard to the right and bottom edges. It stops at the edge.',
        stuck: [
          'The largest allowed X is Canvas1.Width − Player.Width, like Bug Tap.',
          'The ifs go INSIDE Player.Dragged, below the MoveTo.',
          'Use the > block from the Math drawer.',
        ],
      },
      {
        title: 'Detect the crash',
        editor: 'blocks',
        day: 2,
        body:
          '**CollidedWith** runs when the player overlaps another sprite. `other` tells you which one. To stop the game, set each enemy\'s **Enabled** to `false` (that freezes it). The first line is given. **You** write the rest: a status message and freezing both enemies.',
        simple: 'When the player hits a ball, show "Game over" and freeze both balls by setting Enabled to false.',
        blocks: [
          'when Player.CollidedWith other do',
          '  set StatusLabel.Text to "💥 Game over!"',
          '  ___ (freeze Enemy1)',
          '  ___ (freeze Enemy2)',
        ],
        check: 'Test now: let a ball hit you. Both balls stop and the label says Game over.',
        stuck: [
          '"I didn\'t touch it!" Empty space around your picture still counts. Crop the image tightly.',
          'Only one ball stops? You need two set …Enabled blocks, one for each enemy.',
        ],
      },
      {
        title: 'Playtest and submit',
        editor: 'phone',
        body:
          'Play several rounds. Too easy? Raise Speed. Too hard? Lower it or make the balls smaller. Finding the right challenge is called **game balancing**. Write one sentence in your notes about what you changed. Export your `.aia` and submit it.',
        simple: 'Play many times. Make it not too easy and not too hard. Write what you changed. Submit.',
        frames: ['At first the game was too ___ because ___.', 'We changed ___ from ___ to ___, and now ___.'],
      },
    ],
    remix: {
      title: 'Enemy number 3',
      spec:
        'Add a third enemy that is smaller and faster than the others and starts from a different place. It must bounce off walls and freeze when the game ends, like the others.',
      hints: [
        'In the Designer, copy the settings of Enemy1 but change Radius, Speed and Heading.',
        'It needs its own EdgeReached handler.',
        'Add one more set …Enabled to false inside Player.CollidedWith.',
      ],
    },
    devices: [
      { need: 'No phone today', fallback: 'Use the emulator and drag with the mouse. It can feel slow; that is the emulator, not your code.' },
      { need: 'iPhone', fallback: 'Dragging and collisions work in the iOS Companion.' },
    ],
    challenge: {
      title: 'Bonus: Restart and survive',
      body:
        'Add a **Start** button that re-enables the enemies and moves them back near the top with MoveTo (not into a corner, or they can get stuck). Add a **Clock** that counts how many seconds the player survives, and show it when the game ends.',
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
          'Turns the ball so it bounces off the edge it hit',
          'Moves the ball to the center',
          'Makes the ball bigger',
        ],
        answer: 1,
        explain: 'Bounce uses the edge from the event to change the heading, like a real bounce.',
      },
      {
        q: 'The Canvas is 320 wide and the player is 50 wide. You drag the player so Player.X becomes 300. What does your keep-on-screen if set Player.X to?',
        options: ['300', '320', '270', '50'],
        answer: 2,
        explain: '300 is bigger than 320 − 50 = 270, so the if sets X to 270.',
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
      'Day 2 starts at "Detect the crash". Three handlers are now words-only or blanks (Enemy2 bounce, keep-on-screen, freeze both enemies); expect the keep-on-screen step to need a quick whiteboard reminder of the Bug Tap math. Heading uses math-class angles (90 = up) even though y grows downward; say this out loud. Collisions use the image box, so padding causes "I didn\'t touch it!" complaints. On slow phones, Interval below ~30 ms can stutter. A ball that starts touching an edge can shake in place; start balls away from edges.',
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
        'Upgrade Dodge It with 3 lives, a score that goes up while you survive, levels that speed up the enemies, and a high score that is saved even after you close the app.',
    },
    objectives: [
      'Keep track of game state with several global variables (score, lives, level)',
      'Organize code into resetGame and gameOver procedures',
      'Use a Clock to raise the score and difficulty over time',
      'Save and load a high score with TinyDB',
    ],
    intro:
      'A game that ends on the first hit gets boring fast. Real games have **lives**, **levels**, and a **high score** to beat. Now your app has to remember many values at once. That is called **game state**. To keep your code tidy, you will put the big moments, *start a game* and *end a game*, into **procedures**. And with **TinyDB**, your high score stays saved even when the app is closed.',
    vocab: [
      { term: 'Game state', def: 'All the values that describe the game right now: score, lives, level.' },
      { term: 'Game loop', def: 'Code that runs again and again (here, Clock1.Timer) to update the game.' },
      { term: 'TinyDB', def: 'A component that saves values on the phone so they are still there next time.' },
      { term: 'Tag', def: 'The name a value is saved under in TinyDB, like "dodgeHighScore".' },
    ],
    steps: [
      {
        title: 'Plan the state',
        body:
          'Open your **Dodge It** project. Use **Projects → Save project as…** and name the copy `DodgeIt2`, so your old game stays safe. Before coding, list on paper every value the game must remember: `score`, `lives`, `level`. What should each one be at the start of a new game?',
        simple: 'Make a copy of Dodge It called DodgeIt2. On paper, list what the game must remember: score, lives, level. Write the starting number for each.',
        frames: ['The game must remember ___. At the start it is ___.'],
        newBlocks: [{ name: 'Save project as…', where: 'Projects menu', what: 'Makes a copy of your project with a new name.' }],
      },
      {
        title: 'Add components and globals',
        editor: 'designer',
        body:
          'Add a **Clock** (Sensors drawer). Set **TimerInterval** to `1000` (1 second) and **uncheck TimerEnabled**, so it waits for Start. Also uncheck **Enabled** on both enemies, so nothing moves until Start. Add a **TinyDB** (Storage drawer), Labels `ScoreLabel`, `LivesLabel`, `HighLabel`, and a **Button** `StartButton`. Then make these globals:',
        simple: 'Add a Clock, a TinyDB, three labels and a Start button. Turn OFF the Clock and the enemies in the Designer. Make three global variables.',
        blocks: ['initialize global score to 0', 'initialize global lives to 3', 'initialize global level to 1'],
        check: 'Test now: when the app opens, nothing moves until you press Start (Start does nothing yet).',
        newBlocks: [
          { name: 'TinyDB', where: 'Palette → Storage', what: 'Saves values on the phone that stay after the app closes.' },
        ],
        stuck: [
          'TimerInterval is the Clock\'s time between Timer events. Interval on a Ball is a different thing.',
          'Score ticking before Start? Uncheck TimerEnabled on Clock1 in the Designer.',
        ],
      },
      {
        title: 'The resetGame procedure',
        editor: 'blocks',
        body:
          'From the **Procedures** drawer drag out `to procedure do` and name it `resetGame`. Everything a fresh game needs goes here: reset the numbers and labels, put the player and BOTH enemies back in safe spots (not corners), and turn everything on. The labels are blanks for you.',
        simple: 'Make a procedure called resetGame. It sets everything back to the start: numbers, labels, player, both enemies. Then it turns the Clock on.',
        blocks: [
          'to resetGame do',
          '  set global score to 0',
          '  set global lives to 3',
          '  set global level to 1',
          '  set ScoreLabel.Text to ___',
          '  set LivesLabel.Text to ___',
          '  set StatusLabel.Text to ""',
          '  call Player.MoveTo x: 130 y: 400',
          '  call Enemy1.MoveTo x: 40 y: 40',
          '  call Enemy2.MoveTo x: 200 y: 60',
          '  set Enemy1.Speed to 5',
          '  set Enemy2.Speed to 5',
          '  set Enemy1.Enabled to true',
          '  set Enemy2.Enabled to true',
          '  set Clock1.TimerEnabled to true',
        ],
        stuck: [
          'Is your Canvas smaller? Pick MoveTo numbers that fit your screen. Keep enemies away from the player and the corners.',
          'The empty "" text block clears the label.',
        ],
      },
      {
        title: 'Start button',
        editor: 'blocks',
        body:
          '**No blocks given:** when `StartButton` is clicked, call `resetGame`. You can find the call block in the Procedures drawer after you make the procedure.',
        simple: 'When Start is clicked, call resetGame. Build it yourself.',
        check: 'Test now: press Start. The enemies move, the score starts at 0, and lives show 3.',
        stuck: ['The "call resetGame" block appears in the Procedures drawer only after you name the procedure.'],
      },
      {
        title: 'Lose a life (not the whole game)',
        editor: 'blocks',
        day: 2,
        body:
          'Change `Player.CollidedWith`. Take away one life. Then move away **the enemy that hit you**: compare `other` with `Enemy1` using the **=** block. If the enemy stays on top of you, you lose more lives. Use `≤ 0`, not `= 0`: if two hits happen at once, lives could skip past 0.',
        simple: 'When you get hit, lose one life. Move the enemy that hit you away. If lives are 0 or less, call gameOver.',
        blocks: [
          'when Player.CollidedWith other do',
          '  set global lives to get global lives - 1',
          '  set LivesLabel.Text to join "Lives: " get global lives',
          '  if other = Enemy1',
          '    call Enemy1.MoveTo x: 40 y: 40',
          '  else',
          '    call Enemy2.MoveTo x: 200 y: 60',
          '  if get global lives ≤ ___',
          '    call gameOver',
        ],
        check: 'Test now (after the next steps): one hit takes away exactly one life.',
        newBlocks: [
          { name: 'other = Enemy1', where: 'Logic drawer (=) + click Enemy1 at the bottom of its blocks', what: 'Checks which sprite you crashed into.' },
        ],
        stuck: [
          'Lose all 3 lives at once? The enemy is still on top of you. Make sure the right enemy moves away.',
          'The Enemy1 block for the compare is the plain green "Enemy1" block at the very bottom of Enemy1\'s list.',
        ],
      },
      {
        title: 'The game loop: score and levels',
        editor: 'blocks',
        body:
          'Every second you survive is 1 point. Every 10 points is a new level. The Math **modulo** block gives the remainder: `modulo of score ÷ 10 = 0` is true at 10, 20, 30… **You** fill the inside of the if: add 1 to `level`, and add 2 to BOTH enemies\' Speed.',
        simple: 'Each second, add 1 point. Every 10 points, go up one level and make both enemies faster.',
        blocks: [
          'when Clock1.Timer do',
          '  set global score to get global score + 1',
          '  set ScoreLabel.Text to join "Score: " get global score',
          '  if modulo of get global score ÷ 10 = 0',
          '    ___ (level up)',
          '    ___ (speed up both enemies)',
        ],
        check: 'Test now: the score goes up each second, and at 10 the balls get faster.',
        newBlocks: [{ name: 'modulo of … ÷ …', where: 'Math drawer', what: 'The remainder after dividing. 20 ÷ 10 has remainder 0.' }],
        stuck: ['Speed up: set Enemy1.Speed to Enemy1.Speed + 2. Do the same for Enemy2.'],
      },
      {
        title: 'gameOver and the saved high score',
        editor: 'blocks',
        day: 3,
        body:
          'TinyDB **GetValue** reads a saved value. If nothing is saved yet, it gives the `valueIfTagNotThere` number. **StoreValue** saves a value. In `gameOver`, stop everything, then save the score if it beats the old best. Use a tag that belongs to this game, like `"dodgeHighScore"`.',
        simple: 'gameOver stops the game. It reads the old best score. If your score is bigger, it saves your score as the new best.',
        blocks: [
          'to gameOver do',
          '  set Clock1.TimerEnabled to false',
          '  set Enemy1.Enabled to false',
          '  set Enemy2.Enabled to false',
          '  if get global score > call TinyDB1.GetValue tag: "dodgeHighScore" valueIfTagNotThere: 0',
          '    call TinyDB1.StoreValue tag: "dodgeHighScore" valueToStore: get global score',
          '    set StatusLabel.Text to "🏆 New high score!"',
          '  set HighLabel.Text to join "Best: " call TinyDB1.GetValue tag: "dodgeHighScore" valueIfTagNotThere: 0',
        ],
        newBlocks: [
          { name: 'TinyDB1.StoreValue / GetValue', where: 'click TinyDB1', what: 'StoreValue saves a value under a tag. GetValue reads it back.' },
        ],
        stuck: [
          'Spell the tag exactly the same every time. "dodgeHighScore" and "DodgeHighScore" are different.',
          'Strange old high score? Other Companion apps may use the same tag. Use a unique tag.',
        ],
      },
      {
        title: 'Show the best score when the app opens',
        editor: 'blocks',
        body:
          '**No blocks given:** in `Screen1.Initialize`, set `HighLabel.Text` to "Best: " joined with the saved high score from TinyDB (use 0 if nothing is saved).',
        simple: 'When the app opens, show the saved best score. Build it yourself.',
        check: 'Test now: play, set a high score, close the Companion and reconnect. The best score is still there.',
        stuck: ['You can copy the last line of gameOver into Screen1.Initialize.'],
      },
      {
        title: 'Test the whole loop and submit',
        editor: 'phone',
        body:
          'Test a full cycle: Start, lose all lives, see game over, press Start again. Does everything reset, including both enemies and the player? Fix anything that does not. Export the `.aia` and submit.',
        simple: 'Play a whole game twice in a row. Everything must reset when you press Start. Then submit.',
        check: 'Done when: a second game starts with score 0, 3 lives, and slow enemies.',
      },
    ],
    remix: {
      title: 'Pause button',
      spec:
        'Add a Pause button. Tapping it once freezes the game: the Clock and both enemies stop, and the button text changes to "Resume". Tapping it again starts everything again and changes the text back to "Pause".',
      hints: [
        'Make a global variable paused that starts as false.',
        'In PauseButton.Click, use if / else on paused. Remember to flip paused to the other value.',
        'Freeze and unfreeze with set …Enabled and set Clock1.TimerEnabled.',
      ],
    },
    devices: [
      { need: 'No phone today', fallback: 'The emulator works. TinyDB saves on the emulator too.' },
      { need: 'iPhone', fallback: 'Everything in this lesson works in the iOS Companion.' },
    ],
    challenge: {
      title: 'Bonus: Power-ups',
      body:
        'Add a heart sprite that appears every 15 seconds at a random spot (use Visible to show and hide it). Touching it gives +1 life (max 5). Put the "spawn a heart" code in its own procedure, and use **if** to keep lives at 5 or less.',
    },
    quiz: [
      {
        q: 'Why put the start-of-game code in a resetGame procedure?',
        options: [
          'Procedures run faster than events',
          'It keeps the code in one place, so Start (or Play Again) can call it',
          'TinyDB requires it',
          'Global variables only work inside procedures',
        ],
        answer: 1,
        explain: 'Procedures let you name a group of blocks and reuse it without copying.',
      },
      {
        q: 'Lives is 1. Enemy2 hits the player. What happens, step by step?',
        options: [
          'Lives becomes 0, Enemy1 moves, nothing else',
          'Lives becomes 0, Enemy2 moves away, then gameOver runs',
          'Lives stays 1 because Enemy2 is not checked',
          'gameOver runs before lives changes',
        ],
        answer: 1,
        explain: 'Lives goes to 0, "other = Enemy1" is false so the else moves Enemy2, then lives ≤ 0 is true, so gameOver runs.',
      },
      {
        q: 'Clock1 has TimerInterval 1000. How often does Clock1.Timer run?',
        options: ['Every 1000 seconds', 'Once', 'Every second', '1000 times per second'],
        answer: 2,
        explain: 'TimerInterval is in milliseconds; 1000 ms = 1 second.',
      },
      {
        q: 'The score is 29. One more Clock1.Timer runs. What happens?',
        options: [
          'Score 30, and level goes up because 30 modulo 10 = 0',
          'Score 30, nothing else',
          'Level goes up but score stays 29',
          'The game ends',
        ],
        answer: 0,
        explain: 'Score becomes 30 first. The remainder of 30 ÷ 10 is 0, so the level-up blocks run.',
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
      'Budget 3 periods: Day 2 starts at "Lose a life", Day 3 at "gameOver". Words-only handlers: StartButton.Click and Screen1.Initialize; blanks: labels, ≤ 0, level-up body. The worked code now resets BOTH enemies and the player and moves the enemy that actually hit (other = Enemy1), which fixes the classic "lost all 3 lives at once" bug; still expect a few teams to see it if they forget the move, which is a good debugging moment. TinyDB data in the Companion is shared across all Companion apps, so insist on unique tags; TinyDB.ClearAll resets during testing.',
  },

  {
    id: 'games-capstone',
    title: 'Capstone: Your Original Game',
    subtitle: 'Design, build, and playtest a game of your own',
    icon: '🕹️',
    track: 'games',
    concepts: ['Game design', 'Planning', 'Iteration', 'Combining everything'],
    periods: 7,
    xp: { quiz: 60, build: 300, bonus: 100 },
    project: {
      name: 'Your Studio\'s Original Game',
      description:
        'Your company designs and builds an original game: your idea, your art, your rules, using sprites, motion, game state, and procedures.',
    },
    objectives: [
      'Pick a doable game idea and write a pitch, core loop, controls, and win/lose rules',
      'Plan the work: at most 3 MUST features, a NICE list, and who does what',
      'Build in sprints that each end with something you can play',
      'Playtest with another company and improve the game from their feedback',
    ],
    intro:
      'Your **Game Studio** is ready to make its first original game. Real studios do not start by coding. They start with an **idea**, a **plan**, and a quick paper test. Then they build in short **sprints**, test often, and cut features that are not fun. Keep it **small and polished**: a simple game that works beats a big game that does not.',
    vocab: [
      { term: 'Core loop', def: 'The action the player does again and again (for example: dodge → collect → speed up).' },
      { term: 'MUST / NICE', def: 'MUST features are needed for the game to work. NICE features are extras if there is time.' },
      { term: 'Sprint', def: 'A short work period that ends with something working.' },
      { term: 'Scope creep', def: 'When a project keeps growing until it cannot be finished.' },
    ],
    ideas: [
      {
        title: 'Catcher',
        pitch: 'Things fall from the top. Drag a basket to catch the good ones and avoid the bad ones.',
        uses: ['ImageSprite + Dragged', 'Heading 270 + Speed', 'CollidedWith + other', 'score and lives', 'MoveTo random x'],
        stretch: 'Falling things get faster every 10 points.',
      },
      {
        title: 'Dodger',
        pitch: 'Survive as long as you can while enemies bounce around. A new enemy appears every level.',
        uses: ['Ball + Bounce', 'Dragged', 'Clock score', 'levels with modulo', 'TinyDB high score'],
        stretch: 'A shield power-up that makes you safe for 3 seconds.',
      },
      {
        title: 'Whack-a-mole',
        pitch: 'Targets pop up in random spots for a short time. Tap them before they hide.',
        uses: ['Visible', 'Clock', 'MoveTo random', 'Touched', 'score and a timer'],
        stretch: 'A "bomb" target that costs you points.',
      },
      {
        title: 'Maze run',
        pitch: 'Guide your character to the goal with arrow buttons without touching the walls.',
        uses: ['Buttons that change X and Y', 'CollidedWith walls (ImageSprites)', 'if', 'timer', 'procedures'],
        stretch: 'Tilt controls with the AccelerometerSensor (Toolbox step).',
      },
      {
        title: 'Endless runner (lite)',
        pitch: 'Obstacles slide in from the right. Tap to jump over them. How far can you get?',
        uses: ['Heading 180 + Speed', 'MoveTo to reset obstacles', 'Clock for the jump', 'score', 'gameOver procedure'],
        stretch: 'Two kinds of obstacles with different speeds.',
      },
    ],
    steps: [
      {
        title: 'Pick an idea and pitch it',
        body:
          'Look at the **idea cards** below, or invent your own game of the same size. As a company, choose ONE. Write your pitch in the **planner card** in AppVenture. Your twist is what makes it yours: a theme, a rule, or a control. Get a thumbs-up from your teacher before you build.',
        simple: 'Choose one idea card, or a small idea of your own. Write your pitch in the planner. Ask your teacher to approve it.',
        frames: [
          'It\'s a game where you ___.',
          'Over and over, the player ___. (core loop)',
          'You control it by ___ (tap / drag / buttons).',
          'You win when ___. You lose when ___.',
          'Our twist is ___.',
        ],
      },
      {
        title: 'Plan the work',
        body:
          'In the planner, list **at most 3 MUST features**: the smallest game that is still fun. Put everything else on the **NICE** list. Then choose roles: one **Builder** (hands on the mouse) and one **Navigator** (reads the plan, spots mistakes). Swap roles every sprint and record it in the contribution log.',
        simple: 'Write up to 3 MUST features and a NICE list. Pick who is Builder and who is Navigator. Switch every sprint.',
        frames: ['MUST 1: The player can ___.', 'MUST 2: The game keeps track of ___.', 'MUST 3: The game ends when ___.', 'NICE: ___'],
        stuck: ['Too many MUST features? Ask: "Is the game still a game without this?" If yes, it is NICE.'],
      },
      {
        title: 'Paper test, then Sprint 1: something moves',
        editor: 'designer',
        day: 2,
        body:
          'First, 10 minutes: draw your screen on paper and "play" it with paper pieces. Fix anything confusing. Then **Sprint 1**: build the board, the player, your controls, and one thing to dodge, catch, or tap. Plain colored balls are fine for now. Real art comes later.',
        simple: 'Test your idea on paper for 10 minutes. Then build the board, the player and the controls. Add one thing that moves.',
        check: 'Done when: you can control the player on your phone, and one object moves.',
      },
      {
        title: 'Toolbox: blocks you may want',
        editor: 'blocks',
        body:
          'Some games need a few new tools. Use only what your plan needs.\n\n- **Sound**: upload a short clip, add a Sound component, set its Source, then `call Sound1.Play`.\n- **Visible**: `set Coin.Visible to false` hides a sprite.\n- **Which sprite hit me?** `if other = Coin` (Logic =) inside CollidedWith.\n- **Tilt**: an AccelerometerSensor gives `xAccel`. Move the player by it. If it goes the wrong way, change − to +.',
        simple: 'New tools: Sound plays a clip. Visible hides things. "other = Coin" checks what you hit. Tilt uses the AccelerometerSensor.',
        blocks: [
          'when Player.CollidedWith other do',
          '  if other = Coin',
          '    call Sound1.Play',
          '    set Coin.Visible to false',
          'when AccelerometerSensor1.AccelerationChanged xAccel yAccel zAccel do',
          '  set Player.X to Player.X - get xAccel',
        ],
        newBlocks: [
          { name: 'Sound', where: 'Palette → Media', what: 'Plays a short audio file you upload.' },
          { name: 'AccelerometerSensor', where: 'Palette → Sensors', what: 'Tells you how the phone is tilted.' },
        ],
        stuck: [
          'No sound? Check the phone is not on silent, and that Source matches the uploaded file name exactly.',
          'Tilt does nothing on the emulator. Tilt needs a real phone.',
        ],
      },
      {
        title: 'Sprint 2: rules and state',
        editor: 'blocks',
        day: 3,
        body:
          'Add score, lives or a timer, how you win and lose, and a **Clock** game loop. Use **procedures** for big moments: `startGame` and `endGame`. Swap Builder and Navigator now. This sprint usually takes **two periods**. Write everything yourselves: you have done each piece before in Dodge It 2.0.',
        simple: 'Add score, lives or a timer. Add winning and losing. Make startGame and endGame procedures. Switch roles.',
        check: 'Done when: a full round can start, end, and start again with everything reset.',
        stuck: ['Look back at resetGame and gameOver in Dodge It 2.0. Your game needs the same kinds of procedures.'],
      },
      {
        title: 'When you are stuck',
        body:
          'Use these steps in order before asking the teacher:\n\n1. **Read** the warning or error (the yellow ⚠ or red ✖ at the bottom left).\n2. **Test a smaller piece**: right-click a block → **Do It** to see its value on a connected phone.\n3. **Check names**: is it Enemy1 or Enmey1? Same tag spelling?\n4. **Ask another company** (1 minute).\n5. **Ask the teacher**, and say what you already tried.',
        simple: 'Stuck? 1. Read the error. 2. Test one block with Do It. 3. Check spelling. 4. Ask another company. 5. Ask the teacher.',
        newBlocks: [{ name: 'Do It', where: 'right-click any block (phone connected)', what: 'Runs that one block now and shows the result.' }],
        frames: ['We are stuck on ___. We already tried ___.'],
      },
      {
        title: 'Playtest with another company',
        editor: 'phone',
        day: 5,
        body:
          'Swap phones with another company. Watch **quietly** while they play. Then ask the three questions below and write down the answers. As a team, pick the **top 2 fixes** and make them. Balance difficulty by changing speeds, sizes, and timer lengths.',
        simple: 'Let another company play. Watch and do not help. Ask the questions. Fix the 2 most important things.',
        frames: [
          'Tester: The most fun part was ___.',
          'Tester: I got confused when ___.',
          'Tester: It felt too easy / too hard because ___.',
          'Our top 2 fixes are ___ and ___.',
        ],
      },
      {
        title: 'Sprint 3: polish and submit',
        day: 6,
        body:
          'Swap roles again. Add real art, a sound, and an instructions Label that hides (Visible false) when the game starts. Only then try one NICE feature. Clean up blocks (right-click → Clean up Blocks). Export the `.aia` and submit it. In the notes, write what you changed after playtesting. Fill in the contribution log for each partner.',
        simple: 'Add real pictures, a sound, and instructions. Try one NICE feature. Clean up your blocks. Submit and fill in who did what.',
        check: 'Done when: someone new can open the app, read how to play, and finish a round without your help.',
        frames: ['After playtesting we changed ___ because the tester ___.'],
      },
    ],
    devices: [
      { need: 'No phone today', fallback: 'Build with the emulator. Avoid tilt controls; use drag or buttons instead.' },
      { need: 'iPhone', fallback: 'Sprites, Clock, TinyDB and Sound work in the iOS Companion.' },
    ],
    challenge: {
      title: 'Bonus: Level up the design',
      body:
        'Add one feature from your NICE list that changes how the game plays: a second level with a new layout, a power-up, or tilt controls. In your notes, explain how playtesters reacted to it.',
    },
    quiz: [
      {
        q: 'What is a game\'s "core loop"?',
        options: [
          'The Clock.Timer block',
          'The main action the player repeats again and again',
          'A for-each loop in your blocks',
          'The final level',
        ],
        answer: 1,
        explain: 'The core loop is the repeating gameplay, like dodge → collect → speed up. If it is fun, the game is fun.',
      },
      {
        q: 'Your plan has 6 MUST features and it is day 4. What should you do?',
        options: [
          'Work faster and add them all',
          'Move features to the NICE list until only the smallest fun game is left',
          'Start a new idea',
          'Skip playtesting',
        ],
        answer: 1,
        explain: 'Cutting scope keeps the project finishable. A small working game beats a big broken one.',
      },
      {
        q: 'Inside Player.CollidedWith you want to add a point ONLY when the player touches a Coin. Which test do you use?',
        options: ['if Player.Visible', 'if other = Coin', 'if score = Coin', 'if Coin.Enabled'],
        answer: 1,
        explain: '"other" is the sprite you hit. Comparing it with Coin tells you it was the coin.',
      },
      {
        q: 'At the end of each sprint, your game should be:',
        options: ['Completely finished', 'Playable in some form, even if rough', 'Published to the Gallery', 'Exported to a new project'],
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
      'Seven periods: Day 1 pick + plan, Day 2 paper test + Sprint 1, Days 3–4 Sprint 2, Day 5 playtest, Day 6 Sprint 3, Day 7 buffer/finish. Approve each plan in the planner card before building; push teams to 3 MUST features. Builder/Navigator roles swap every sprint and are recorded in the contribution log; check it against what you see. The idea cards are all buildable with this path\'s skills; the Toolbox step covers Sound, Visible, other-comparison and tilt. The auto-checks can be met by a reskinned Dodge It, so judge originality from the plan and the twist. Struggling teams: the Dodger card with one new mechanic is a fine target.',
  },
]
