import type { Lesson } from '../types'

// Media House path: apps that capture, create, and play pictures, drawings and sound.

export const MEDIA_LESSONS: Lesson[] = [
  {
    id: 'media-camera',
    title: 'Camera & Images',
    subtitle: 'Snap, pick, and flip through photos',
    icon: '📸',
    track: 'media',
    concepts: ['Media components', 'Event parameters', 'Lists', 'Index variables'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Photo Booth',
      description:
        'Take photos with the camera or pick them from the gallery, keep them in a list, flip through them with Next and Previous, and share your favorite.',
    },
    objectives: [
      'Use the Camera and ImagePicker components to get photos into an app',
      'Read an event parameter (the "image" from AfterPicture) and use it in your code',
      'Store photos in a list and move through it with an index variable',
      'Share a file to other apps with the Sharing component',
    ],
    intro:
      'Welcome to the **Media House**! Media apps turn your phone into a studio. The camera, microphone and screen are all components you can control with blocks. Today your company builds a **Photo Booth**: the app collects photos into a **list**, and an **index** variable remembers which photo you are looking at. That same "list + index" pattern powers every photo gallery, music player and slideshow app you have ever used.',
    vocab: [
      { term: 'Event parameter', def: 'A value an event hands to your code, like the "image" in Camera.AfterPicture. Hover over it to get a "get image" block.' },
      { term: 'File path', def: 'Text that says where a file lives on the phone. Photos are stored as file paths, not as pictures inside a variable.' },
      { term: 'Index', def: 'A number that says which item in a list you mean. In App Inventor the first item is index 1.' },
      { term: 'Sharing', def: 'A non-visible component that hands text or a file to another app (messages, email, Drive).' },
    ],
    steps: [
      {
        title: 'Lay out the booth',
        editor: 'designer',
        body:
          'Start a new project named `PhotoBooth`. Add:\n\n- **User Interface → Image**: set **Width** to *Fill parent* and **Height** to `300` pixels\n- A **HorizontalArrangement** holding four Buttons: `btnSnap` ("Snap"), `btnPrev` ("◀"), `btnNext` ("▶"), `btnShare` ("Share")\n- **Media → ImagePicker**: rename it `pickGallery` and set its Text to "From gallery"\n- **Media → Camera** and **Social → Sharing** (both non-visible)\n- A **Label** named `lblCount` to show "Photo 1 of 3"',
      },
      {
        title: 'Make a list and an index',
        editor: 'blocks',
        body:
          'Your app needs to remember **all** the photos and **which one** is showing. Create two global variables: an empty list for photo paths, and an index that starts at 0 (no photo yet).',
        blocks: ['initialize global photos to', '  create empty list', 'initialize global index to 0'],
      },
      {
        title: 'Write a showPhoto procedure',
        editor: 'blocks',
        body:
          'Several buttons need to update the screen, so put that code in **one procedure** and call it from everywhere. Remember: do not repeat yourself (DRY). The `if` protects the app from crashing when the list is still empty.',
        blocks: [
          'to showPhoto',
          '  if length of list get global photos > 0',
          '    set Image1.Picture to select list item list get global photos index get global index',
          '    set lblCount.Text to join "Photo " get global index " of " length of list get global photos',
          '  else',
          '    set lblCount.Text to "No photos yet"',
        ],
      },
      {
        title: 'Capture photos',
        editor: 'blocks',
        body:
          'When **Snap** is clicked, open the camera. When the photo is taken, `Camera1.AfterPicture` runs and hands you the **image** parameter (a file path). Add it to the list, jump the index to the newest photo, and show it. Do the same for the gallery with `pickGallery.AfterPicking` and its **Selection** property.',
        blocks: [
          'when btnSnap.Click do',
          '  call Camera1.TakePicture',
          'when Camera1.AfterPicture image do',
          '  call add items to list list get global photos item get image',
          '  set global index to length of list get global photos',
          '  call showPhoto',
          'when pickGallery.AfterPicking do',
          '  call add items to list list get global photos item pickGallery.Selection',
          '  set global index to length of list get global photos',
          '  call showPhoto',
        ],
      },
      {
        title: 'Next, Previous and wrap-around',
        editor: 'blocks',
        body:
          'Next adds 1 to the index; Previous subtracts 1. Use a conditional so the index **wraps around**: going past the last photo returns to photo 1, and going before photo 1 jumps to the last one. Build `btnPrev.Click` yourself. It is the mirror image of Next.',
        blocks: [
          'when btnNext.Click do',
          '  if length of list get global photos > 0',
          '    set global index to get global index + 1',
          '    if get global index > length of list get global photos',
          '      set global index to 1',
          '    call showPhoto',
        ],
      },
      {
        title: 'Share your favorite',
        editor: 'blocks',
        body:
          'The Sharing component sends a file to any app on the phone that can accept it. Only share if there is a photo showing. Test on your phone: tap **Share** and you should see a list of apps.',
        blocks: [
          'when btnShare.Click do',
          '  if get global index > 0',
          '    call Sharing1.ShareFile',
          '      file: select list item list get global photos index get global index',
        ],
      },
      {
        title: 'Test, export and submit',
        editor: 'phone',
        body:
          'Test every button with **zero** photos first. Does anything crash? Then take three photos and flip forward and back past both ends. Export with **Projects → Export selected project (.aia)** and submit it below.',
      },
    ],
    challenge: {
      title: 'Bonus: Delete & slideshow',
      body:
        'Add a **Delete** button that removes the current photo from the list with `remove list item` and fixes the index so it never points past the end. Then add a **Clock** and a "Slideshow" button that toggles **TimerEnabled** to auto-advance every 2 seconds.',
    },
    quiz: [
      {
        q: 'In "when Camera1.AfterPicture image", what is "image"?',
        options: [
          'A component you dragged into the Designer',
          'An event parameter holding the file path of the new photo',
          'A global variable you must initialize first',
          'The name of the Image component',
        ],
        answer: 1,
        explain: 'Event parameters are values the event passes to your code. Hover over "image" to get a "get image" block.',
      },
      {
        q: 'Your list has 4 photos and global index is 4. The user taps Next. With wrap-around, what should index become?',
        options: ['5', '0', '1', '4'],
        answer: 2,
        explain: 'Index 5 does not exist, so the "if index > length" check sets it back to 1, the first item in App Inventor lists.',
      },
      {
        q: 'Why put the screen-updating code in a showPhoto procedure?',
        options: [
          'Procedures make the app run on iPhones',
          'App Inventor requires every app to have a procedure',
          'Several events need the same code, so one procedure avoids repeating it and fixes bugs in one place',
          'Procedures make photos load in higher quality',
        ],
        answer: 2,
        explain: 'Snap, gallery, Next and Previous all call showPhoto. That is the DRY principle: Don\'t Repeat Yourself.',
      },
      {
        q: 'The app crashes when you tap Next before taking any photos. What is the best fix?',
        options: [
          'Wrap the code in an if that checks the list length is greater than 0',
          'Delete the Next button',
          'Set the index to 100',
          'Make the Image component bigger',
        ],
        answer: 0,
        explain: 'Selecting an item from an empty list is an error. Guard it with a conditional so the code only runs when there is a photo.',
      },
    ],
    checks: [
      { kind: 'anyComponent', types: ['Camera', 'ImagePicker'], label: 'Has a Camera or ImagePicker' },
      { kind: 'component', type: 'Image', label: 'Has an Image to display photos' },
      { kind: 'anyBlock', types: ['lists_create_with', 'lists_add_items'], label: 'Stores photos in a list' },
      { kind: 'block', type: 'lists_select_item', label: 'Selects a photo from the list by index' },
      { kind: 'block', type: 'controls_if', label: 'Uses a conditional (empty list / wrap-around)' },
      { kind: 'anyBlock', types: ['procedures_defnoreturn', 'procedures_defreturn'], label: 'Defines a procedure' },
    ],
    teacherNotes:
      'The Companion can take photos on most Android phones; on some iOS versions Camera returns paths that Sharing cannot open, so focus on ImagePicker there. The emulator has no real camera. Photos are stored as file paths, so the list is lost when the app closes (TinyDB comes later in the Tools path; mention it for curious students). The empty-list crash in the quiz is worth demonstrating live. Have a student tap Next with no photos and read the error together.',
  },
  {
    id: 'media-paint',
    title: 'Drawing Canvas',
    subtitle: 'Turn your finger into a paintbrush',
    icon: '🎨',
    track: 'media',
    concepts: ['Canvas coordinates', 'Event parameters', 'Properties as state', 'Sliders'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Paint Pad',
      description:
        'A finger-painting app with color buttons, a brush-size slider, tap-to-stamp dots, a Clear button, and a way to save your masterpiece.',
    },
    objectives: [
      'Explain how x/y coordinates work on a Canvas (0,0 is the top-left corner)',
      'Use the parameters of Canvas.Dragged and Canvas.Touched to draw lines and circles',
      'Change drawing properties (PaintColor, LineWidth) while the app runs',
      'Read a Slider value with the PositionChanged event',
    ],
    intro:
      'Every drawing app works the same way underneath. As your finger moves, the phone reports a stream of **x, y coordinates**, and the app draws a short line between each point and the next. String thousands of tiny lines together and you get a smooth stroke. Today your company builds **Paint Pad** and learns to think in coordinates, a skill you will use for animation, maps, and games.',
    vocab: [
      { term: 'Canvas', def: 'A drawing surface component. It can draw lines, circles and text, and detect touches.' },
      { term: 'Coordinate', def: 'A pair of numbers (x, y) for a spot on the Canvas. x grows to the right and y grows DOWN.' },
      { term: 'Dragged event', def: 'Fires over and over while a finger moves on the Canvas, giving the previous and current points.' },
      { term: 'Slider', def: 'A draggable bar that reports a number (ThumbPosition) between a MinValue and MaxValue.' },
    ],
    steps: [
      {
        title: 'Build the studio',
        editor: 'designer',
        body:
          'New project: `PaintPad`. Add:\n\n- **Drawing and Animation → Canvas**: Width *Fill parent*, Height `350` pixels, BackgroundColor White\n- A **HorizontalArrangement** with color Buttons `btnRed`, `btnBlue`, `btnBlack` (set each button\'s BackgroundColor to match)\n- **User Interface → Slider** named `sldSize`: MinValue `1`, MaxValue `30`, ThumbPosition `5`\n- Buttons `btnClear` ("Clear") and `btnSave` ("Save")\n- A **Label** `lblStatus`\n\nSet the Canvas **LineWidth** to `5` so it matches the slider.',
      },
      {
        title: 'Draw with Dragged',
        editor: 'blocks',
        body:
          '`Canvas1.Dragged` gives you **prevX, prevY** (where the finger was a moment ago) and **currentX, currentY** (where it is now). Draw a line between them. Hover over each parameter name to get its "get" block.',
        blocks: [
          'when Canvas1.Dragged startX startY prevX prevY currentX currentY draggedAnySprite do',
          '  call Canvas1.DrawLine',
          '    x1: get prevX',
          '    y1: get prevY',
          '    x2: get currentX',
          '    y2: get currentY',
        ],
      },
      {
        title: 'Tap to stamp a dot',
        editor: 'blocks',
        body:
          'A single tap does not drag, so nothing appears. Fix that with `Canvas1.Touched`, which gives you **x** and **y**. Draw a filled circle whose radius is half the brush size, so taps match your lines.',
        blocks: [
          'when Canvas1.Touched x y touchedAnySprite do',
          '  call Canvas1.DrawCircle',
          '    centerX: get x',
          '    centerY: get y',
          '    radius: Canvas1.LineWidth / 2',
          '    fill: true',
        ],
      },
      {
        title: 'Colors and brush size',
        editor: 'blocks',
        body:
          'The Canvas remembers its **PaintColor** and **LineWidth**. Changing a property changes every line drawn *after* that. The Slider\'s PositionChanged event hands you **thumbPosition**; round it so the width is a whole number. Build `btnBlue` and `btnBlack` the same way as red.',
        blocks: [
          'when btnRed.Click do',
          '  set Canvas1.PaintColor to color red',
          'when sldSize.PositionChanged thumbPosition do',
          '  set Canvas1.LineWidth to round get thumbPosition',
          '  set lblStatus.Text to join "Brush size: " round get thumbPosition',
        ],
      },
      {
        title: 'Clear and save',
        editor: 'blocks',
        body:
          '`Canvas1.Clear` erases everything. `Canvas1.Save` stores the drawing as a picture on the phone and **returns** its file path, so you can show where it went.',
        blocks: [
          'when btnClear.Click do',
          '  call Canvas1.Clear',
          'when btnSave.Click do',
          '  set lblStatus.Text to join "Saved to " call Canvas1.Save',
        ],
      },
      {
        title: 'Test, export and submit',
        editor: 'phone',
        body:
          'Draw slowly, then quickly. Do you see gaps? Tap dots at different brush sizes. Try every color, then Clear and Save. Export the `.aia` and submit it below, with a screenshot link of your best drawing in the notes!',
      },
    ],
    challenge: {
      title: 'Bonus: Eraser & rainbow brush',
      body:
        'Add an **Eraser** button that sets PaintColor to the Canvas background color. Then add a "Rainbow" mode: a global list of colors and an index that advances every time Dragged fires, so the stroke cycles through colors as you draw.',
    },
    quiz: [
      {
        q: 'On a Canvas, where is the point (0, 0)?',
        options: ['The center', 'The bottom-left corner', 'The top-left corner', 'The bottom-right corner'],
        answer: 2,
        explain: 'Screens measure from the top-left. x grows to the right and y grows downward.',
      },
      {
        q: 'Why does Paint Pad draw a line from (prevX, prevY) to (currentX, currentY) inside Dragged?',
        options: [
          'Dragged only fires once per stroke',
          'Dragged fires many times as the finger moves; connecting each pair of points makes a smooth stroke',
          'DrawLine is the only block that works on a Canvas',
          'It makes the app save automatically',
        ],
        answer: 1,
        explain: 'Each Dragged event is one tiny movement. Thousands of short lines connected end-to-end look like one smooth stroke.',
      },
      {
        q: 'You tap the Blue button and then draw. Your OLD red lines…',
        options: [
          'turn blue',
          'stay red, because PaintColor only affects what is drawn after it changes',
          'disappear',
          'turn black',
        ],
        answer: 1,
        explain: 'Properties like PaintColor are settings for future drawing. Pixels already on the Canvas do not change.',
      },
      {
        q: 'Which event tells you the Slider has moved, and what value does it give?',
        options: [
          'Slider.Click, giving true/false',
          'Slider.PositionChanged, giving thumbPosition',
          'Slider.Dragged, giving x and y',
          'Slider.AfterPicking, giving Selection',
        ],
        answer: 1,
        explain: 'PositionChanged fires whenever the thumb moves and passes the new thumbPosition number.',
      },
    ],
    checks: [
      { kind: 'component', type: 'Canvas', label: 'Has a Canvas' },
      { kind: 'event', component: 'Canvas', event: 'Dragged', label: 'Uses "when Canvas.Dragged"' },
      { kind: 'method', method: 'DrawLine', label: 'Calls Canvas.DrawLine' },
      { kind: 'component', type: 'Slider', label: 'Has a Slider' },
      { kind: 'event', component: 'Slider', event: 'PositionChanged', label: 'Uses "when Slider.PositionChanged"' },
      { kind: 'method', method: 'Clear', label: 'Has a way to Clear the canvas' },
    ],
    teacherNotes:
      'A quick unplugged warm-up helps: put a grid on the board with (0,0) at the top-left and have students "draw" by calling out coordinates. Students often expect y to grow upward, as in math class. Fast strokes on slower phones can look jagged; that is a good conversation about how often events fire. Canvas.Save writes to app-private storage on newer Android versions, so the saved path may not appear in the Gallery app. That is expected. If students want to share, combine it with Sharing.ShareFile from the previous lesson.',
  },
  {
    id: 'media-sound',
    title: 'Sound Studio',
    subtitle: 'Record, store, and play back your own audio',
    icon: '🎙️',
    track: 'media',
    concepts: ['Recording media', 'Lists of files', 'ListView', 'App state'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Sound Studio',
      description:
        'Record voice clips, collect them in a playlist, and tap any clip in the list to play it back. A pocket podcast studio.',
    },
    objectives: [
      'Record audio with SoundRecorder Start/Stop and handle AfterSoundRecorded',
      'Play audio files by setting Player.Source and calling Player.Start',
      'Keep two parallel lists in sync (file paths and display names)',
      'Show a list on screen with ListView and respond to AfterPicking',
    ],
    intro:
      'Podcasts, voice memos, beat makers: audio apps are huge. Today your Media House builds a **Sound Studio**. It brings together everything from the trunk: **events** for record and stop, a **variable** that tracks whether you are recording, **lists** that hold every clip, and **conditionals** that keep the buttons from getting confused. A ListView turns your list into a tappable playlist.',
    vocab: [
      { term: 'SoundRecorder', def: 'A non-visible component that records from the microphone and reports the saved file path.' },
      { term: 'Player', def: 'Plays an audio file. Set its Source to a file path, then call Start.' },
      { term: 'ListView', def: 'A visible, scrollable list. Its Elements property is a list; AfterPicking fires when a row is tapped.' },
      { term: 'Parallel lists', def: 'Two lists where item N of one matches item N of the other, like a clip\'s name and its file.' },
    ],
    steps: [
      {
        title: 'Design the studio',
        editor: 'designer',
        body:
          'New project: `SoundStudio`. Add:\n\n- A Button `btnRecord` with Text "● Record" and a big font\n- A Label `lblStatus` ("Ready")\n- **User Interface → ListView** named `lstClips` (Height *Fill parent*)\n- **Media → SoundRecorder** and **Media → Player** (non-visible)\n\nThe first time you record, the phone will ask for **microphone permission**. Tap Allow.',
      },
      {
        title: 'Variables for state and storage',
        editor: 'blocks',
        body:
          'One Button will both start **and** stop recording, so the app must remember which mode it is in. That is called **state**. You also need two lists: the file paths (for the Player) and friendly names (for the ListView).',
        blocks: [
          'initialize global recording to false',
          'initialize global clipFiles to',
          '  create empty list',
          'initialize global clipNames to',
          '  create empty list',
        ],
      },
      {
        title: 'One button, two jobs',
        editor: 'blocks',
        body:
          'If you are already recording, stop. Otherwise start. Flip the variable and update the button so the user always knows what tapping will do.',
        blocks: [
          'when btnRecord.Click do',
          '  if get global recording',
          '    call SoundRecorder1.Stop',
          '    set global recording to false',
          '    set btnRecord.Text to "● Record"',
          '  else',
          '    call SoundRecorder1.Start',
          '    set global recording to true',
          '    set btnRecord.Text to "■ Stop"',
          '    set lblStatus.Text to "Recording..."',
        ],
      },
      {
        title: 'Save each clip to the playlist',
        editor: 'blocks',
        body:
          'After `Stop`, App Inventor fires `AfterSoundRecorded` with the **sound** parameter: the clip\'s file path. Add the path to `clipFiles` and a name like "Clip 3" to `clipNames`, then refresh the ListView by setting its **Elements**.',
        blocks: [
          'when SoundRecorder1.AfterSoundRecorded sound do',
          '  call add items to list list get global clipFiles item get sound',
          '  call add items to list list get global clipNames item join "Clip " length of list get global clipFiles',
          '  set lstClips.Elements to get global clipNames',
          '  set lblStatus.Text to "Saved!"',
        ],
      },
      {
        title: 'Tap to play',
        editor: 'blocks',
        body:
          'When a row is tapped, `lstClips.SelectionIndex` tells you its position. Because the lists are **parallel**, the same index in `clipFiles` is the right audio file.',
        blocks: [
          'when lstClips.AfterPicking do',
          '  set Player1.Source to select list item list get global clipFiles index lstClips.SelectionIndex',
          '  call Player1.Start',
          '  set lblStatus.Text to join "Playing " lstClips.Selection',
        ],
      },
      {
        title: 'Test, export and submit',
        editor: 'phone',
        body:
          'Record three clips: say your company name, your slogan, and a fun fact. Tap each in the list. Do they play the right clip? What happens if you tap Record twice quickly? Export the `.aia` and submit it.',
      },
    ],
    challenge: {
      title: 'Bonus: Rename & delete clips',
      body:
        'Add a TextBox so the user can name a clip before saving it (use the name if the TextBox is not empty, otherwise "Clip N"). Then add a long-press or a Delete button that removes the selected clip from **both** lists with `remove list item`, keeping them in sync.',
    },
    quiz: [
      {
        q: 'Why does Sound Studio need a "recording" true/false variable?',
        options: [
          'SoundRecorder cannot work without one',
          'So one button knows whether to Start or Stop: the app has to remember its state',
          'To make the recording louder',
          'Variables are needed for the ListView to scroll',
        ],
        answer: 1,
        explain: 'A single button doing two jobs needs memory of which mode the app is in. That memory is called state.',
      },
      {
        q: 'Where does the file path of a new recording come from?',
        options: [
          'The "sound" parameter of SoundRecorder1.AfterSoundRecorded',
          'Player1.Source',
          'lstClips.Selection',
          'btnRecord.Text',
        ],
        answer: 0,
        explain: 'AfterSoundRecorded fires after Stop and passes the saved file path as "sound".',
      },
      {
        q: 'clipNames = ["Clip 1","Clip 2","Clip 3"]. The user taps "Clip 2". What does lstClips.SelectionIndex hold?',
        options: ['"Clip 2"', '1', '2', '3'],
        answer: 2,
        explain: 'SelectionIndex is the position of the tapped row. Lists in App Inventor start at 1, so the second row is 2.',
      },
      {
        q: 'You delete an item from clipNames but forget clipFiles. What goes wrong?',
        options: [
          'Nothing; the lists are linked automatically',
          'The lists are out of sync, so tapping a name plays the wrong clip',
          'The app records twice as long',
          'The ListView turns blank forever',
        ],
        answer: 1,
        explain: 'Parallel lists only work if they change together. Remove the same index from both.',
      },
    ],
    checks: [
      { kind: 'component', type: 'SoundRecorder', label: 'Has a SoundRecorder' },
      { kind: 'component', type: 'Player', label: 'Has a Player' },
      { kind: 'event', component: 'SoundRecorder', event: 'AfterSoundRecorded', label: 'Uses "when SoundRecorder.AfterSoundRecorded"' },
      { kind: 'component', type: 'ListView', label: 'Has a ListView playlist' },
      { kind: 'event', component: 'ListView', event: 'AfterPicking', label: 'Uses "when ListView.AfterPicking"' },
      { kind: 'block', type: 'lists_add_items', label: 'Adds recordings to a list' },
    ],
    teacherNotes:
      'Thirty students recording at once is loud. Consider headphones with a mic, recording in the hallway, or "whisper mode". The emulator usually cannot record. On iOS the Companion\'s SoundRecorder support has been limited in some versions; pair an iPhone user with an Android partner if needed. Clips are stored as temporary file paths, so the playlist resets when the app restarts. That is a natural hook for TinyDB if a team asks. The parallel-lists idea is a big conceptual step; draw two columns on the board and cross out the same row in both.',
  },
  {
    id: 'media-capstone',
    title: 'Capstone: Your Media App',
    subtitle: 'Design, build, test, and polish an original media app',
    icon: '🎬',
    track: 'media',
    concepts: ['Design process', 'Requirements', 'Iteration', 'User testing'],
    periods: 6,
    xp: { quiz: 60, build: 300, bonus: 100 },
    project: {
      name: 'Your Original Media App',
      description:
        'Your company invents a media app nobody has built before, such as a meme maker, a stop-motion studio, a soundboard for your team, or a photo scavenger hunt, and takes it from idea to tested product.',
    },
    objectives: [
      'Write a one-sentence pitch that names the audience and the problem or fun your app solves',
      'Sketch a wireframe and turn it into a list of must-have and nice-to-have features',
      'Build in short sprints, testing on a real phone after every sprint',
      'Run a user test with another company and improve the app based on their feedback',
    ],
    intro:
      'This is the big one. Real media companies do not start by coding. They start with **people**: who will use this, and why will they love it? Your company will follow the same **design process** professionals use: pitch → plan → build in sprints → test with real users → improve. You already know every block you need. Now you combine them into something original.',
    vocab: [
      { term: 'Pitch', def: 'A short, convincing description: "For [audience], our app [does what] so they can [benefit]."' },
      { term: 'Wireframe', def: 'A quick sketch of each screen showing where components go. Boxes and labels, no art.' },
      { term: 'Sprint', def: 'A short work session with one clear goal, ending with something you can test.' },
      { term: 'MVP', def: 'Minimum Viable Product: the smallest version of your app that still does its main job.' },
      { term: 'Iterate', def: 'Improve in rounds: build, test, learn, and change.' },
    ],
    steps: [
      {
        title: 'Pitch it',
        body:
          'As a company, brainstorm at least **five** media app ideas in 5 minutes. No idea is too silly yet. Then vote on one and write your pitch:\n\n**For** ___ **our app** ___ **so they can** ___.\n\nGood ideas use at least one media superpower: camera, photos, drawing, recording, or playing sound or video. Write the pitch in your submission notes.',
      },
      {
        title: 'Wireframe and requirements',
        body:
          'On paper, sketch every screen of your app. Label each component (Button, Canvas, ListView…). Then make two lists:\n\n- **Must-have** (your MVP): the 3-4 features the app is useless without\n- **Nice-to-have**: everything else\n\nYour app must use: at least one **media component**, a **list**, at least one **procedure**, and **conditionals**. Plan where each one goes. Get your teacher to initial the wireframe before you code.',
      },
      {
        title: 'Sprint 1: the MVP',
        editor: 'designer',
        body:
          'Build **only** your must-haves. Split the work: one partner lays out the Designer while the other plans the blocks on paper, then switch. Use good names (`btnRecord`, not `Button7`). By the end of the sprint the main feature should work on a phone, even if it is ugly.',
      },
      {
        title: 'Organize with procedures',
        editor: 'blocks',
        body:
          'Before adding more, clean up. Any code that appears in two places should become a procedure. A common shape for media apps is a procedure that refreshes the screen from your variables:',
        blocks: [
          'to refreshScreen',
          '  set lblTitle.Text to select list item list get global titles index get global current',
          '  if length of list get global items = 0',
          '    set lblStatus.Text to "Nothing here yet. Add something!"',
          '  else',
          '    set lblStatus.Text to join get global current " / " length of list get global items',
        ],
      },
      {
        title: 'User test with another company',
        editor: 'phone',
        body:
          'Swap phones with another company. The testers use your app **without help**, so stay silent and take notes! Ask them afterward:\n\n1. What did you think the app was for?\n2. Where did you get stuck or confused?\n3. What is one thing you would add?\n\nWrite their top 3 pieces of feedback in your submission notes.',
      },
      {
        title: 'Sprint 2: iterate and polish',
        editor: 'blocks',
        body:
          'Fix the biggest problem testers found first, then add nice-to-haves. Polish: an app **Icon**, consistent colors and fonts, clear button labels, and no crashes on empty lists. Test everything one last time, export the `.aia`, and submit with your pitch and test notes.',
      },
    ],
    challenge: {
      title: 'Bonus: Ship-quality polish',
      body:
        'Earn the bonus by adding **all three**: (1) your app remembers data after it closes (TinyDB), (2) a second screen such as a help or about screen, and (3) a 30-second demo video or screen recording of a real user trying your app, linked in your notes.',
    },
    quiz: [
      {
        q: 'What should your company do FIRST in the design process?',
        options: [
          'Start dragging components into the Designer',
          'Decide who the app is for and what it does for them (the pitch)',
          'Pick the app icon',
          'Write all the blocks for every screen',
        ],
        answer: 1,
        explain: 'Designers start with people. A clear pitch keeps every later decision focused.',
      },
      {
        q: 'What is an MVP?',
        options: [
          'The student who wrote the most blocks',
          'The final, perfect version of the app',
          'The smallest version that still does the app\'s main job',
          'A type of App Inventor component',
        ],
        answer: 2,
        explain: 'A Minimum Viable Product proves the core idea works before you spend time on extras.',
      },
      {
        q: 'During a user test, the tester gets confused. What should you do?',
        options: [
          'Grab the phone and show them how',
          'Explain the app before they start',
          'Stay quiet, write down where they got stuck, and fix it later',
          'Tell them they are using it wrong',
        ],
        answer: 2,
        explain: 'Confusion is valuable data. Real users will not have you there to explain, so the app has to explain itself.',
      },
      {
        q: 'The same 4 blocks that update your screen appear in 3 different events. What is the best improvement?',
        options: [
          'Leave it; it works',
          'Move them into a procedure and call it from each event',
          'Delete two of the events',
          'Copy them into a fourth event too',
        ],
        answer: 1,
        explain: 'A procedure means one place to read, test, and fix that code.',
      },
    ],
    checks: [
      {
        kind: 'anyComponent',
        types: ['Camera', 'ImagePicker', 'Player', 'Sound', 'SoundRecorder', 'VideoPlayer', 'Canvas'],
        label: 'Uses at least one media component',
      },
      {
        kind: 'anyBlock',
        types: ['lists_create_with', 'lists_add_items', 'lists_select_item', 'lists_pick_random_item'],
        label: 'Uses a list',
      },
      { kind: 'anyBlock', types: ['procedures_defnoreturn', 'procedures_defreturn'], label: 'Defines a procedure' },
      { kind: 'block', type: 'controls_if', label: 'Uses conditionals' },
      { kind: 'totalBlocks', min: 40, label: 'Has at least 40 blocks' },
    ],
    teacherNotes:
      'Plan about six periods: 1 pitch + wireframe, 3 build sprints, 1 user testing, 1 polish and submit. Require a teacher sign-off on the wireframe before coding, because this catches over-ambitious ideas (multiplayer, social networks) early. Steer those toward a single-phone MVP. Run user testing as a structured rotation: each company tests two other apps with a printed feedback form. When reviewing, read the pitch and test notes in the submission alongside the .aia check. The checks prove the required concepts are present, but the notes show the process. Consider awarding the bonus generously for strong iteration evidence.',
  },
]
