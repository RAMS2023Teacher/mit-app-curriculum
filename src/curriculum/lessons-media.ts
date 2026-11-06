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
      'Welcome to the **Media House**! Media apps use the phone\'s camera, microphone and screen. Today your company builds a **Photo Booth**. The app keeps photos in a **list**. An **index** variable remembers which photo is showing. Photo galleries, music players and slideshows all use this same "list + index" pattern.',
    vocab: [
      { term: 'Event parameter', def: 'A value an event gives your code, like the "image" in Camera.AfterPicture. Hover over it to get a "get image" block.' },
      { term: 'File path', def: 'Text that says where a file is on the phone. The list stores file paths, not the pictures themselves.' },
      { term: 'Index', def: 'A number that says which item in a list you mean. In App Inventor the first item is index 1.' },
      { term: 'Sharing', def: 'A non-visible component that sends text or a file to another app (messages, email, Drive).' },
    ],
    devices: [
      { need: 'iPhone', fallback: 'Use the "From gallery" ImagePicker. On some iPhones, camera photos cannot be shared, so test Share with a gallery photo.' },
      { need: 'No phone (emulator only)', fallback: 'The emulator has no camera. Upload 3 images (Media panel → Upload File) and add them to the photos list in Screen1.Initialize. Next, Previous and the index work the same.' },
      { need: 'School device blocks the camera', fallback: 'Skip btnSnap. Use the ImagePicker, or the uploaded images from the line above. You still pass every check.' },
    ],
    steps: [
      {
        title: 'Lay out the booth',
        editor: 'designer',
        body:
          'Start a new project named `PhotoBooth`. Add:\n\n- **User Interface → Image**: Width *Fill parent*, Height `300` pixels\n- A **HorizontalArrangement** with four Buttons: `btnSnap` ("Snap"), `btnPrev` ("◀"), `btnNext` ("▶"), `btnShare` ("Share")\n- **Media → ImagePicker**: rename it `pickGallery`, Text "From gallery"\n- **Media → Camera** and **Social → Sharing** (non-visible)\n- A **Label** `lblCount`',
        simple: 'Make a new project called PhotoBooth. Add an Image, four buttons in a row, an ImagePicker, a Camera, a Sharing component and a Label.',
        newBlocks: [
          { name: 'Image', where: 'Palette → User Interface', what: 'Shows a picture. Set its Picture property to a file path.' },
          { name: 'ImagePicker', where: 'Palette → Media', what: 'A button that opens the phone\'s photo gallery.' },
          { name: 'Camera', where: 'Palette → Media', what: 'Opens the phone camera and gives you the photo\'s file path.' },
        ],
      },
      {
        title: 'Make a list and an index',
        editor: 'blocks',
        body:
          'The app must remember **all** the photos and **which one** is showing. Make two global variables: an empty list for photo paths, and an index that starts at 0 (no photo yet).',
        simple: 'Make two variables. "photos" is an empty list. "index" starts at 0.',
        blocks: ['initialize global photos to (create empty list)', 'initialize global index to 0'],
      },
      {
        title: 'Write a showPhoto procedure',
        editor: 'blocks',
        body:
          'Several buttons need to update the screen, so put that code in **one procedure**. The `if` stops a crash when the list is still empty: you cannot select item 1 from an empty list.',
        simple: 'Make one procedure that shows the current photo. First check that the list is not empty.',
        blocks: [
          'to showPhoto',
          '  if (length of list(get global photos) > 0)',
          '    set Image1.Picture to select list item(list: get global photos, index: get global index)',
          '    set lblCount.Text to join("Photo ", get global index, " of ", length of list(get global photos))',
          '  else',
          '    set lblCount.Text to "No photos yet"',
        ],
        stuck: ['"Select list item: index too large"? The index is bigger than the list length. Check where you change the index.'],
      },
      {
        title: 'Capture photos',
        editor: 'blocks',
        body:
          'When **Snap** is clicked, open the camera. `Camera1.AfterPicture` runs next and gives you **image** (a file path). Add it to the list, move the index to the newest photo, and show it.\n\nThen fill in the blanks to do the same for the gallery. The picked photo is in `pickGallery.Selection`.',
        simple: 'Snap opens the camera. Add the new photo to the list and show it. Then do the same for the gallery button.',
        blocks: [
          'when btnSnap.Click do',
          '  call Camera1.TakePicture',
          'when Camera1.AfterPicture image do',
          '  call add items to list(list: get global photos, item: get image)',
          '  set global index to length of list(get global photos)',
          '  call showPhoto',
          'when pickGallery.AfterPicking do',
          '  call add items to list(list: get global photos, item: ___)',
          '  set global index to ___',
          '  call showPhoto',
        ],
        check: 'Test now: take a photo or pick one. You should see it in the Image and "Photo 1 of 1" in the label.',
        stuck: [
          'Tapped "Deny" on the camera question? On Android go to Settings → Apps → MIT AI2 Companion → Permissions → Camera → Allow.',
          'Nothing shows? Check that "call showPhoto" is the last block inside each event.',
        ],
      },
      {
        title: 'Next, Previous and wrap-around',
        editor: 'blocks',
        day: 2,
        body:
          'Next adds 1 to the index. If the index goes past the last photo, it **wraps around** to 1. Fill in the blank. Then build `btnPrev.Click` yourself, with no blocks shown: subtract 1, and if the index goes below 1, jump to the last photo.',
        simple: 'Next goes to the next photo. After the last photo, go back to photo 1. Then build Previous by yourself.',
        blocks: [
          'when btnNext.Click do',
          '  if (length of list(get global photos) > 0)',
          '    set global index to (get global index + 1)',
          '    if (get global index > ___)',
          '      set global index to 1',
          '    call showPhoto',
        ],
        check: 'Test now: with 3 photos, tap ▶ four times. You should see Photo 1, 2, 3, then 1 again. Do the same with ◀.',
        stuck: ['Previous jumps to "Photo 0"? Your check should be "index < 1", and then set the index to the length of the list.'],
      },
      {
        title: 'Share your favorite',
        editor: 'blocks',
        body:
          'The Sharing component sends a file to another app. Only share if a photo is showing.',
        simple: 'Share sends the current photo to another app. Only do it when a photo is showing.',
        blocks: [
          'when btnShare.Click do',
          '  if (get global index > 0)',
          '    call Sharing1.ShareFile(file: select list item(list: get global photos, index: get global index))',
        ],
        check: 'Test now: tap Share. You should see a list of apps to send the photo to.',
        stuck: ['Share does nothing on an iPhone? Some iPhones cannot share camera photos. Pick a photo from the gallery and try again.'],
      },
      {
        title: 'Test, export and submit',
        editor: 'phone',
        body:
          'Test every button with **zero** photos first. Does anything crash? Then add three photos and flip past both ends. Close the app and open it again: the photos are gone. That is normal, because variables are forgotten when an app closes. Export with **Projects → Export selected project (.aia)**.',
        simple: 'Test with no photos. Then test with three photos. Export the .aia file.',
        stuck: ['Photos disappear when the app closes? That is expected. A list in a variable is not saved.'],
      },
    ],
    remix: {
      title: 'Remix: Shuffle button',
      spec: 'Add a "Shuffle" button that jumps to a random photo. If there are no photos, it should show "No photos yet" and not crash.',
      hints: [
        'You need "random integer from 1 to ___" from the Math drawer.',
        'The top number is the length of the photos list.',
        'Put it inside an if that checks the list is not empty, then call showPhoto.',
      ],
    },
    challenge: {
      title: 'Bonus: Delete & slideshow',
      body:
        'Add a **Delete** button that removes the current photo with `remove list item`. Fix the index so it never points past the end. Then add a **Clock** and a "Slideshow" button that turns **TimerEnabled** on and off to move to the next photo every 2 seconds.',
    },
    quiz: [
      {
        q: 'The photos list has 3 items and index is 1. The user taps ◀ Previous (with wrap-around). Which photo shows?',
        options: ['Photo 0', 'Photo 1', 'Photo 2', 'Photo 3'],
        answer: 3,
        explain: 'Index 1 minus 1 is 0. That is below 1, so it wraps to the last photo, number 3.',
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
      'Device fallbacks are now student-facing (see the device box). Demonstrate the empty-list crash live: tap Next with no photos and read the error together. The Previous handler is the first "build it yourself" moment on this path; let students struggle a few minutes before showing the mirror-image answer. Photos are file paths in a variable, so they vanish on restart (TinyDB is on the Tools path; mention it to curious students).',
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
        'A finger-painting app with color buttons, a brush-size slider, tap-to-stamp dots, a Clear button, and a way to save your drawing.',
    },
    objectives: [
      'Explain how x/y coordinates work on a Canvas (0,0 is the top-left corner)',
      'Use the parameters of Canvas.Dragged and Canvas.Touched to draw lines and circles',
      'Change drawing properties (PaintColor, LineWidth) while the app runs',
      'Read a Slider value with the PositionChanged event',
    ],
    intro:
      'Every drawing app works the same way. As your finger moves, the phone reports many **x, y coordinates**. The app draws a short line from each point to the next. Thousands of tiny lines look like one smooth stroke. Today your company builds **Paint Pad**. You will use coordinates again for animation, maps and games.',
    vocab: [
      { term: 'Canvas', def: 'A drawing surface component. It can draw lines, circles and text, and detect touches.' },
      { term: 'Coordinate', def: 'A pair of numbers (x, y) for a spot on the Canvas. x grows to the right and y grows DOWN.' },
      { term: 'Dragged event', def: 'Runs again and again while a finger moves on the Canvas. It gives the previous point and the current point.' },
      { term: 'Slider', def: 'A bar you drag. It reports a number (ThumbPosition) between MinValue and MaxValue.' },
    ],
    devices: [
      { need: 'No phone (emulator only)', fallback: 'Drawing works in the emulator: hold the mouse button down and drag.' },
      { need: 'Save does not show in the Gallery', fallback: 'Newer Android phones keep saved drawings inside the app. Show the saved path in the label instead, or share it with Sharing.ShareFile.' },
    ],
    steps: [
      {
        title: 'Build the studio',
        editor: 'designer',
        body:
          'New project: `PaintPad`. Add:\n\n- **Drawing and Animation → Canvas**: Width *Fill parent*, Height `350` pixels, BackgroundColor White, LineWidth `5`\n- A **HorizontalArrangement** with Buttons `btnRed`, `btnBlue`, `btnBlack` (set each BackgroundColor to match)\n- **User Interface → Slider** `sldSize`: MinValue `1`, MaxValue `30`, ThumbPosition `5`\n- Buttons `btnClear` ("Clear") and `btnSave` ("Save")\n- A **Label** `lblStatus`',
        simple: 'Make a new project called PaintPad. Add a Canvas, three color buttons in a row, a Slider, Clear and Save buttons, and a Label.',
        newBlocks: [
          { name: 'Canvas', where: 'Palette → Drawing and Animation', what: 'A surface you can draw on and touch.' },
          { name: 'Slider', where: 'Palette → User Interface', what: 'A bar you drag to choose a number.' },
        ],
      },
      {
        title: 'Draw with Dragged',
        editor: 'blocks',
        body:
          '`Canvas1.Dragged` gives you **prevX, prevY** (where the finger was a moment ago) and **currentX, currentY** (where it is now). Draw a line between them. Hover over each parameter to get its "get" block. Fill in the two blanks.',
        simple: 'When the finger moves, draw a line from the old point to the new point.',
        blocks: [
          'when Canvas1.Dragged startX startY prevX prevY currentX currentY draggedAnySprite do',
          '  call Canvas1.DrawLine(x1: get prevX, y1: get prevY, x2: ___, y2: ___)',
        ],
        check: 'Test now: drag your finger on the white area. You should see a black line follow it.',
        stuck: ['The line jumps from the top-left corner? You used startX/startY. Use currentX and currentY.'],
      },
      {
        title: 'Tap to stamp a dot',
        editor: 'blocks',
        body:
          'A single tap is not a drag, so nothing appears. Build this one **from words only**:\n\n- Use `when Canvas1.Touched`. It gives you **x** and **y**.\n- Inside it, call `Canvas1.DrawCircle` at x, y.\n- Make the radius half the brush size: `Canvas1.LineWidth / 2`. Set fill to true.',
        simple: 'Build it yourself: when the Canvas is touched, draw a filled circle where the finger is.',
        check: 'Test now: tap once. You should see a round dot the same size as your lines.',
        stuck: ['No dot? Check that "fill" is set to true, and that the radius is not 0.'],
      },
      {
        title: 'Colors and brush size',
        editor: 'blocks',
        day: 2,
        body:
          'The Canvas remembers its **PaintColor** and **LineWidth**. A change only affects lines drawn *after* it. The Slider gives you **thumbPosition**. Round it to a whole number.\n\nBuild `btnBlue` and `btnBlack` yourself, the same way as red.',
        simple: 'The red button changes the paint color. The slider changes the brush size. Make the blue and black buttons yourself.',
        blocks: [
          'when btnRed.Click do',
          '  set Canvas1.PaintColor to (color red)',
          'when sldSize.PositionChanged thumbPosition do',
          '  set Canvas1.LineWidth to round(get thumbPosition)',
          '  set lblStatus.Text to join("Brush size: ", ___)',
        ],
        check: 'Test now: pick blue and move the slider to the right. New lines should be blue and thicker. Old lines stay the same.',
        stuck: ['The label says "Brush size: 12.4567"? Put the round block around thumbPosition.'],
      },
      {
        title: 'Clear and save',
        editor: 'blocks',
        body:
          '`Canvas1.Clear` erases everything. `Canvas1.Save` saves the drawing as a picture and **gives back** its file path. Build `btnClear.Click` yourself. Save is below.',
        simple: 'Clear erases the drawing. Save stores it and shows where it was saved.',
        blocks: ['when btnSave.Click do', '  set lblStatus.Text to join("Saved to ", call Canvas1.Save)'],
        check: 'Test now: draw, tap Save, then Clear. You should see a file path in the label, then a blank canvas.',
        stuck: ['Cannot find the saved picture in your Gallery? Newer phones keep it inside the app. The path in the label proves it worked.'],
      },
      {
        title: 'Test, export and submit',
        editor: 'phone',
        body:
          'Draw slowly, then quickly. Do you see gaps? Tap dots at different sizes. Try every color, then Clear and Save. Export the `.aia` and submit it below.',
        simple: 'Test all the buttons and the slider. Export the .aia file and submit it.',
      },
    ],
    remix: {
      title: 'Remix: Spray mode',
      spec: 'Add a "Spray" button that turns spray mode on and off. In spray mode, dragging draws small dots near the finger (a few pixels away at random) instead of lines.',
      hints: [
        'Use a global variable "spray" that is true or false. The button flips it.',
        'In Dragged, use if / else: if spray, draw a small circle, else draw the line.',
        'For "near the finger", use currentX + random integer from -10 to 10.',
      ],
    },
    challenge: {
      title: 'Bonus: Eraser & rainbow brush',
      body:
        'Add an **Eraser** button that sets PaintColor to the Canvas background color. Then add a "Rainbow" mode: a global list of colors and an index that moves forward every time Dragged runs, so the stroke changes color as you draw.',
    },
    quiz: [
      {
        q: 'LineWidth is 10. You tap the Canvas at (50, 80). What does your Touched code draw?',
        options: ['A line from (0,0) to (50,80)', 'A filled circle at (50, 80) with radius 5', 'A circle at (80, 50)', 'Nothing'],
        answer: 1,
        explain: 'Touched gives x = 50 and y = 80. The radius is LineWidth / 2 = 5.',
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
        explain: 'Each Dragged event is one tiny movement. Thousands of short lines connected end to end look like one smooth stroke.',
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
        explain: 'PaintColor is a setting for future drawing. Lines already on the Canvas do not change.',
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
        explain: 'PositionChanged runs whenever the thumb moves and gives the new thumbPosition number.',
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
      'Unplugged warm-up: grid on the board with (0,0) at the top-left; students "draw" by calling out coordinates. Many expect y to grow upward as in math class. Touched and Clear are words-only on purpose; circulate and ask "which event? which method?" rather than giving blocks. Fast strokes on slow phones look jagged, which is a good talk about how often events fire.',
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
      description: 'Record voice clips, collect them in a playlist, and tap any clip in the list to play it back. A small podcast studio on your phone.',
    },
    objectives: [
      'Record audio with SoundRecorder Start/Stop and handle AfterSoundRecorded',
      'Play audio files by setting Player.Source and calling Player.Start',
      'Keep two parallel lists in sync (file paths and display names)',
      'Show a list on screen with ListView and respond to AfterPicking',
    ],
    intro:
      'Podcasts, voice memos and beat makers are all audio apps. Today your Media House builds a **Sound Studio**. It uses **events** for record and stop, a **variable** that remembers if you are recording, **lists** that hold every clip, and **conditionals** so one button can do two jobs. A ListView shows your list as a playlist you can tap.',
    vocab: [
      { term: 'SoundRecorder', def: 'A non-visible component that records from the microphone and gives you the saved file path.' },
      { term: 'Player', def: 'Plays an audio file. Set its Source to a file path, then call Start.' },
      { term: 'ListView', def: 'A list on the screen you can scroll. Its Elements property is a list. AfterPicking runs when a row is tapped.' },
      { term: 'Parallel lists', def: 'Two lists where item N of one matches item N of the other, like a clip\'s name and its file.' },
    ],
    devices: [
      { need: 'No phone (emulator only)', fallback: 'The emulator usually cannot record. Upload 3 short sound files (Media panel → Upload File). In Screen1.Initialize, add their names to both lists. Skip the Record button; the playlist works the same.' },
      { need: 'iPhone', fallback: 'Recording may not work in the iPhone Companion. Use the uploaded-files option above, or test recording on a partner\'s Android phone.' },
      { need: 'School device blocks the microphone', fallback: 'Use the uploaded-files option above. You still pass every check if you keep the SoundRecorder component in the project.' },
    ],
    steps: [
      {
        title: 'Design the studio',
        editor: 'designer',
        body:
          'New project: `SoundStudio`. Add:\n\n- A Button `btnRecord` with Text "● Record" and a big font\n- A Label `lblStatus` ("Ready")\n- **User Interface → ListView** `lstClips` (Height *Fill parent*)\n- **Media → SoundRecorder** and **Media → Player** (non-visible)',
        simple: 'Make a new project called SoundStudio. Add a Record button, a Label, a ListView, a SoundRecorder and a Player.',
        newBlocks: [
          { name: 'SoundRecorder', where: 'Palette → Media', what: 'Records sound from the microphone.' },
          { name: 'Player', where: 'Palette → Media', what: 'Plays a sound file.' },
          { name: 'ListView', where: 'Palette → User Interface', what: 'Shows a list on the screen. Users can tap a row.' },
        ],
      },
      {
        title: 'Variables for state and storage',
        editor: 'blocks',
        body:
          'One Button will start **and** stop recording, so the app must remember which mode it is in. That memory is called **state**. You also need two lists: file paths (for the Player) and names (for the ListView).',
        simple: 'Make three variables: "recording" (true or false), "clipFiles" (a list) and "clipNames" (a list).',
        blocks: [
          'initialize global recording to false',
          'initialize global clipFiles to (create empty list)',
          'initialize global clipNames to (create empty list)',
        ],
      },
      {
        title: 'One button, two jobs',
        editor: 'blocks',
        body:
          'If you are recording, stop. Otherwise, start. Flip the variable and change the button text so the user knows what a tap will do. Fill in the two blanks.',
        simple: 'If recording, stop. If not, start. Change the button text each time.',
        blocks: [
          'when btnRecord.Click do',
          '  if get global recording',
          '    call SoundRecorder1.Stop',
          '    set global recording to ___',
          '    set btnRecord.Text to "● Record"',
          '  else',
          '    call SoundRecorder1.Start',
          '    set global recording to ___',
          '    set btnRecord.Text to "■ Stop"',
          '    set lblStatus.Text to "Recording..."',
        ],
        check: 'Test now: tap the button twice. It should change to "■ Stop", then back to "● Record".',
        stuck: [
          'Tapped "Deny" on the microphone question? On Android go to Settings → Apps → MIT AI2 Companion → Permissions → Microphone → Allow.',
          'The button never changes back? Check that one blank is false and the other is true.',
        ],
      },
      {
        title: 'Save each clip to the playlist',
        editor: 'blocks',
        day: 2,
        body:
          'After `Stop`, App Inventor runs `AfterSoundRecorded` and gives you **sound**: the clip\'s file path. Build this event **from words only**:\n\n1. Add `get sound` to `clipFiles`.\n2. Add `join("Clip ", length of list(clipFiles))` to `clipNames`.\n3. Set `lstClips.Elements` to `clipNames`.\n4. Set `lblStatus.Text` to "Saved!"',
        simple: 'Build it yourself: when a recording is saved, add the file and a name to the lists, then show the names in the ListView.',
        check: 'Test now: record two short clips. You should see "Clip 1" and "Clip 2" in the list.',
        stuck: ['The list stays empty? Check that you set lstClips.Elements AFTER adding to clipNames.'],
      },
      {
        title: 'Tap to play',
        editor: 'blocks',
        body:
          'When a row is tapped, `lstClips.SelectionIndex` is its position. The lists are **parallel**, so the same position in `clipFiles` is the right sound file. Fill in the blank.',
        simple: 'When a clip name is tapped, find the file at the same position and play it.',
        blocks: [
          'when lstClips.AfterPicking do',
          '  set Player1.Source to select list item(list: get global clipFiles, index: ___)',
          '  call Player1.Start',
          '  set lblStatus.Text to join("Playing ", lstClips.Selection)',
        ],
        newBlocks: [
          { name: 'ListView.SelectionIndex', where: 'click lstClips in the Blocks panel', what: 'The position (1, 2, 3…) of the row the user tapped.' },
        ],
        check: 'Test now: tap "Clip 1". You should hear your first recording.',
        stuck: ['Plays the wrong clip? You may have used Selection (the text) instead of SelectionIndex (the number).'],
      },
      {
        title: 'Test, export and submit',
        editor: 'phone',
        body:
          'Record three clips: your company name, your slogan and a fun fact. Tap each in the list. Do they play the right clip? Close and reopen the app: the clips are gone, because lists in variables are not saved. Export the `.aia` and submit it.',
        simple: 'Record three clips and play each one. Export the .aia file and submit it.',
      },
    ],
    remix: {
      title: 'Remix: Surprise clip',
      spec: 'Add a "Surprise" button that plays a random clip from the playlist. If there are no clips yet, show "Record something first!" and do not crash.',
      hints: [
        'Check the length of clipFiles with an if first.',
        'Pick a random index from 1 to the length of the list.',
        'Use that same index to set Player1.Source, then call Player1.Start.',
      ],
    },
    challenge: {
      title: 'Bonus: Rename & delete clips',
      body:
        'Add a TextBox so the user can name a clip before saving it (use the name if the TextBox is not empty, otherwise "Clip N"). Then add a Delete button that removes the selected clip from **both** lists with `remove list item`, so they stay in sync.',
    },
    quiz: [
      {
        q: 'recording is false. The user taps btnRecord two times. What does the button say now?',
        options: ['"■ Stop"', '"● Record"', '"Recording..."', '"Saved!"'],
        answer: 1,
        explain: 'Tap 1 starts recording and shows "■ Stop". Tap 2 stops and changes it back to "● Record".',
      },
      {
        q: 'Why does Sound Studio need a "recording" true/false variable?',
        options: [
          'SoundRecorder cannot work without one',
          'So one button knows whether to Start or Stop: the app has to remember its state',
          'To make the recording louder',
          'Variables are needed for the ListView to scroll',
        ],
        answer: 1,
        explain: 'One button doing two jobs needs to remember which mode the app is in. That memory is called state.',
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
      'Thirty students recording at once is loud: headphones with a mic, hallway recording, or "whisper mode". Students on the uploaded-files fallback (emulator, iOS, blocked mic) should still build AfterSoundRecorded for the check, even if they cannot run it. The parallel-lists idea is a big step; draw two columns on the board and cross out the same row in both.',
  },
  {
    id: 'media-capstone',
    title: 'Capstone: Your Media App',
    subtitle: 'Design, build, test, and polish an original media app',
    icon: '🎬',
    track: 'media',
    concepts: ['Design process', 'Requirements', 'Iteration', 'User testing'],
    periods: 7,
    xp: { quiz: 60, build: 300, bonus: 100 },
    project: {
      name: 'Your Original Media App',
      description:
        'Your company invents its own media app, such as a photo scavenger hunt, a team soundboard or a draw-on-a-photo app, and takes it from idea to tested product.',
    },
    objectives: [
      'Write a one-sentence pitch that names the audience and what your app does for them',
      'Plan up to 3 must-have features and a list of nice-to-haves',
      'Build in short sprints, testing on a real phone after every sprint',
      'Run a user test with another company and improve the app based on their feedback',
    ],
    intro:
      'This is the big one. Real media companies do not start by coding. They start with **people**: who will use this, and why will they like it? Your company follows the **design process**: pitch → plan → build in sprints → test with users → improve. Use the blocks from your path and core lessons, plus the Toolbox step below.',
    vocab: [
      { term: 'Pitch', def: 'A short description that makes people want your app: "For [audience], our app [does what] so they can [benefit]."' },
      { term: 'Wireframe', def: 'A quick sketch of each screen showing where components go. Boxes and labels, no art.' },
      { term: 'Sprint', def: 'A short work session with one clear goal, ending with something you can test.' },
      { term: 'MVP', def: 'Minimum Viable Product: the smallest version of your app that still does its main job.' },
      { term: 'Iterate', def: 'Improve in rounds: build, test, learn, and change.' },
    ],
    ideas: [
      {
        title: 'Photo Scavenger Hunt',
        pitch: 'Players get a list of things to find, take a photo of each one, and see their score.',
        uses: ['Camera or ImagePicker', 'a list of prompts + index', 'score variable', 'if / else'],
        stretch: 'A Clock timer for each prompt.',
      },
      {
        title: 'Team Soundboard',
        pitch: 'Record your team\'s catchphrases and play them back from a named playlist.',
        uses: ['SoundRecorder', 'Player', 'parallel lists', 'ListView'],
        stretch: 'A TextBox to name each clip before saving.',
      },
      {
        title: 'Doodle on a Photo',
        pitch: 'Pick a photo, draw on top of it, add a caption, and save it.',
        uses: ['ImagePicker', 'Canvas.BackgroundImage', 'Dragged + DrawLine', 'DrawText', 'Slider'],
        stretch: 'Color buttons and an eraser.',
      },
      {
        title: 'Before & After Slideshow',
        pitch: 'Collect photos of a project (a drawing, a room, a plant) and play them as an automatic slideshow.',
        uses: ['ImagePicker', 'list + index', 'Clock', 'showPhoto procedure'],
        stretch: 'A speed Slider for the slideshow.',
      },
      {
        title: 'Mood Journal',
        pitch: 'Each day, pick a photo and record a short voice note about your day. Flip back through past days.',
        uses: ['ImagePicker', 'SoundRecorder', 'Player', 'parallel lists', 'Next/Previous'],
        stretch: 'Show the date with each entry.',
      },
    ],
    devices: [
      { need: 'Camera or microphone blocked, or no phone', fallback: 'Pick an idea that uses ImagePicker, uploaded files (Media → Upload File) or the Canvas. All of these work in the emulator.' },
    ],
    steps: [
      {
        title: 'Pick & pitch',
        body:
          'Read the idea cards on this page, or invent your own. Brainstorm at least **three** ideas in 5 minutes, then vote on one. Your app must use at least one **media component**, a **list**, a **procedure** and **if / else**. Write your pitch in the planner card and in your submission notes.',
        simple: 'Choose an idea card or make your own. Write one sentence about who the app is for and what it does.',
        frames: ['For ___, our app ___ so they can ___.', 'The main thing a user does in our app is ___.', 'We picked this idea because ___.'],
      },
      {
        title: 'Plan: must-have and nice-to-have',
        body:
          'Fill in the **planner card** on this page:\n\n- **MUST** (max 3): the features your app is useless without\n- **NICE**: everything else, only if time is left\n- **Who does what**: Builder and Navigator for each sprint\n\nSketch your screen on paper with every component labeled. Your teacher approves the plan before you code.',
        simple: 'Write up to 3 must-have features. Write extra ideas as nice-to-have. Draw your screen. Get your teacher\'s OK.',
        frames: ['MUST 1: The user can ___.', 'NICE: It would be cool if ___.', 'In Sprint 1 ___ is Builder and ___ is Navigator.'],
        stuck: ['More than 3 MUST features? Ask: "Is the app useless without this?" If not, move it to NICE.'],
      },
      {
        title: 'Toolbox: blocks you may need',
        editor: 'blocks',
        body:
          'These blocks were not in earlier lessons. Use them only if your plan needs them. Upload File is how you add your own pictures and sounds to a project.',
        simple: 'These are new blocks you may need. Only use the ones your plan needs.',
        newBlocks: [
          { name: 'Upload File', where: 'Designer → Media panel (under the component tree)', what: 'Adds your own picture or sound file to the project.' },
          { name: 'Canvas.BackgroundImage', where: 'click Canvas1 in the Blocks panel', what: 'Puts a picture behind your drawing. Set it to a file path, like ImagePicker.Selection.' },
          { name: 'Canvas.DrawText', where: 'click Canvas1 in the Blocks panel', what: 'Writes text on the Canvas at an x, y point.' },
          { name: 'Player.Source', where: 'click Player1 in the Blocks panel', what: 'Set it to the name of an uploaded sound, like "cheer.mp3", then call Start.' },
        ],
        blocks: [
          'when pickPhoto.AfterPicking do',
          '  set Canvas1.BackgroundImage to pickPhoto.Selection',
          'when btnCaption.Click do',
          '  call Canvas1.DrawText(text: txtCaption.Text, x: 20, y: 40)',
        ],
      },
      {
        title: 'Sprint 1: the main feature',
        editor: 'designer',
        day: 2,
        body:
          'Goal: **MUST 1 works on a phone**, even if it looks plain. The Builder drags components and blocks. The Navigator reads the plan, checks names, and spots mistakes. Use clear names (`btnRecord`, not `Button7`). Log who did what in the contribution log.',
        simple: 'Make your first must-have feature work. One partner builds. The other partner reads the plan and checks.',
        check: 'Done when: you can show MUST 1 working on a phone to another student.',
      },
      {
        title: 'Sprint 2: the rest of the MUST list',
        editor: 'blocks',
        day: 3,
        body:
          'Swap Builder and Navigator. Goal: **all MUST features work**. Any code that appears in two places should become a procedure. Many media apps use a procedure that refreshes the screen. Check for an empty list **first**:',
        simple: 'Swap jobs. Make all must-have features work. Put repeated code in a procedure.',
        blocks: [
          'to refreshScreen',
          '  if (length of list(get global items) = 0)',
          '    set lblStatus.Text to "Nothing here yet. Add something!"',
          '  else',
          '    set lblTitle.Text to select list item(list: get global items, index: get global current)',
          '    set lblStatus.Text to join(get global current, " / ", length of list(get global items))',
        ],
        check: 'Done when: every MUST works, and the app does not crash when the list is empty.',
      },
      {
        title: 'Sprint 3: fix and add one NICE',
        editor: 'blocks',
        day: 4,
        body:
          'Swap jobs again. Goal: **no crashes**, then add **one** NICE feature. Test every button with zero items, one item and many items.',
        simple: 'Swap jobs. Fix bugs. Add one nice-to-have feature.',
        check: 'Done when: you tested every button with an empty list and nothing crashed.',
      },
      {
        title: 'When you are stuck',
        body:
          'Try these in order before asking the teacher:\n\n1. **Read** the red error or the warning on the block.\n2. **Test a smaller piece**: does just that one event work?\n3. **Check names**: is it the right component? the right variable?\n4. **Ask another company** (2 minutes max).\n5. **Ask the teacher**, and say what you already tried.',
        simple: 'Read the error. Test a small part. Check names. Ask another company. Then ask the teacher.',
        frames: ['We expected ___ but instead ___.', 'We already tried ___.'],
      },
      {
        title: 'User test with another company',
        editor: 'phone',
        day: 6,
        body:
          'Swap phones with another company. The testers use your app **without help**. Stay quiet and take notes! Then ask:\n\n1. What did you think the app was for?\n2. Where did you get stuck?\n3. What is one thing you would add?\n\nWrite their top 3 answers in your notes.',
        simple: 'Another team tries your app. Do not help them. Write down where they got stuck.',
        frames: ['The tester thought our app was for ___.', 'They got stuck when ___.', 'We will change ___ because ___.'],
      },
      {
        title: 'Polish and ship',
        editor: 'designer',
        day: 7,
        body:
          'Fix the biggest problem testers found. Then polish: upload an icon picture and set **Screen1 → Icon**, set **AppName**, use clear button labels and matching colors. Test one last time, export the `.aia`, and submit with your pitch, plan and test notes.',
        simple: 'Fix the biggest problem from testing. Add an app icon and name. Export and submit.',
        newBlocks: [
          { name: 'Screen1 → Icon', where: 'Designer → select Screen1 → Properties', what: 'The picture people see on their home screen. Upload it first.' },
          { name: 'Screen1 → AppName', where: 'Designer → select Screen1 → Properties', what: 'The name shown under the icon.' },
        ],
        check: 'Done when: the app has an icon and a name, and testers\' top problem is fixed.',
      },
    ],
    challenge: {
      title: 'Bonus: Ship-quality polish',
      body:
        'Earn the bonus by adding **all three**: (1) a Help button that shows short instructions in a Label, (2) a list of 3 changes you made because of user testing, in your notes, and (3) a 30-second screen recording or video of a real user trying your app, linked in your notes.',
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
        q: 'It is Sprint 2. Your MUST list has 5 features and only 2 work. What is the best move?',
        options: [
          'Add a NICE feature to make it more fun',
          'Cut the MUST list to the 3 most important features and finish those',
          'Start a new idea',
          'Keep all 5 and hope to finish',
        ],
        answer: 1,
        explain: 'A small app that works is better than a big app that crashes. Move extra features to NICE.',
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
        explain: 'Confusion is useful information. Real users will not have you there to explain, so the app has to explain itself.',
      },
      {
        q: 'items is an empty list. refreshScreen runs "select list item(items, 1)" BEFORE checking the length. What happens?',
        options: ['It shows "Nothing here yet"', 'The app shows an error, because there is no item 1', 'It shows item 0', 'Nothing happens'],
        answer: 1,
        explain: 'Always check for an empty list first. Selecting from an empty list is an error.',
      },
    ],
    checks: [
      {
        kind: 'anyComponent',
        types: ['Camera', 'ImagePicker', 'Player', 'SoundRecorder', 'Canvas'],
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
      'Seven periods: 1 pick/pitch/plan, 3 sprints, 1 stuck-protocol buffer or catch-up, 1 user test, 1 polish. Approve the planner card before coding; steer multiplayer or online ideas toward a single-phone MVP. Every idea card uses only media-path and core skills plus the Toolbox step. Builder/Navigator roles swap each sprint and are logged in the contribution log; read it alongside the .aia check, which proves concepts are present but not who built them. Weigh the pitch, plan and test notes as process evidence.',
  },
]
