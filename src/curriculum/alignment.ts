// Alignment of each lesson to the Massachusetts DLCS Framework (2016), grades 6-8.
// `how` is a short teacher-facing note on where the lesson addresses the standard.
// Standard text lives in standards.ts. Edit this file to change the alignment.

export interface Alignment {
  code: string
  how: string
}

export const ALIGNMENT: Record<string, Alignment[]> = {
  'core-hello': [
    { code: '6-8.CT.d.3', how: 'Builds a working app (Talk To Me) that meets a stated goal, in pairs.' },
    { code: '6-8.DTC.a.1', how: 'Uses and compares the Designer, the Blocks editor and the AI Companion, and what each one is for.' },
    { code: '6-8.CS.a.2', how: 'Sees apps as application software they can create, not only use.' },
    { code: '6-8.CS.a.7', how: 'Troubleshoots the Companion connection: Wi-Fi network, reconnecting, sound volume.' },
  ],
  'core-events': [
    { code: '6-8.CT.d.3', how: 'Builds Mood Switcher, an app driven by Click, LongClick and Initialize events.' },
    { code: '6-8.CT.b.2', how: 'Each input (tap, long-press, app start) produces a specific, testable output.' },
    { code: '6-8.CS.a.4', how: 'Bonus: uses the accelerometer sensor to trigger an event.' },
  ],
  'side-design': [
    { code: '6-8.DTC.a.4', how: 'Designs a polished, multimedia "about us" screen using layout tools.' },
    { code: '6-8.DTC.a.3', how: 'Combines an image file, text and buttons into one finished screen.' },
    { code: '6-8.CT.a.3', how: 'Breaks the screen into nested arrangements (a hierarchy of containers).' },
  ],
  'core-variables': [
    { code: '6-8.CT.d.4', how: 'Uses variables and math expressions to track coins and upgrades.' },
    { code: '6-8.CT.c.2', how: 'The "numbers vs. text" experiment shows how the app stores and handles different data types.' },
    { code: '6-8.CT.d.3', how: 'Builds the Tap Tycoon clicker game in pairs.' },
  ],
  'core-conditionals': [
    { code: '6-8.CT.b.1', how: 'Designs a solution with if / else if / else.' },
    { code: '6-8.CT.b.2', how: 'Play-tests guesses and predicts "too high" or "too low" for each input.' },
    { code: '6-8.CT.b.5', how: '"Guard against bad input" handles blank entries and the 1–100 range.' },
    { code: '6-8.CT.d.4', how: 'Combines variables, comparisons and conditionals in one program.' },
  ],
  'side-debug': [
    { code: '6-8.CT.d.6', how: 'Finds and fixes three bugs through repeated test-and-fix cycles.' },
    { code: '6-8.CT.d.5', how: 'Inspects values with Do It and traces the buggy code step by step.' },
    { code: '6-8.CS.a.7', how: 'Follows a routine for diagnosing software problems (warnings, errors, values).' },
  ],
  'mini-quiz': [
    { code: '6-8.CT.b.1', how: 'Checks each answer with conditionals.' },
    { code: '6-8.CT.d.4', how: 'Uses score and question-number variables with conditionals and expressions.' },
    { code: '6-8.CT.d.3', how: 'Builds a complete trivia game in pairs.' },
  ],
  'mini-sound': [
    { code: '6-8.DTC.a.2', how: 'Works with image and audio file types (PNG, JPG, MP3, WAV) and why each exists.' },
    { code: '6-8.DTC.a.3', how: 'Combines image and audio files into one soundboard app.' },
    { code: '6-8.CT.b.1', how: 'A boolean mute mode decides with if / else whether to play.' },
    { code: '6-8.CAS.b.3', how: 'Talk it over: when is it fair to use a sound clip you found online?' },
  ],
  'mini-convert': [
    { code: '6-8.CT.d.4', how: 'Writes math expressions for the conversion formulas.' },
    { code: '6-8.CT.b.5', how: 'Validates input and "tries to break it" with empty or odd values.' },
    { code: '6-8.CT.b.2', how: 'Predicts converted values for given inputs and checks them.' },
  ],
  'core-loops': [
    { code: '6-8.CT.b.1', how: 'Uses repetition: a Clock timer and a for-each-number loop.' },
    { code: '6-8.CT.b.4', how: '"Timer or loop?" compares two ways to repeat and when each fits.' },
    { code: '6-8.CT.d.4', how: 'Implements looping behavior with a counter variable and conditionals.' },
  ],
  'core-lists': [
    { code: '6-8.CT.d.4', how: 'Uses list variables, expressions and loops together.' },
    { code: '6-8.CT.b.1', how: 'Uses "for each item" repetition to process every option.' },
    { code: '6-8.CT.d.3', how: 'Builds Decision Maker to solve an everyday problem.' },
  ],
  'core-procedures': [
    { code: '6-8.CT.a.2', how: 'Defines calculateTip once and reuses it for every tip button.' },
    { code: '6-8.CT.d.2', how: 'Procedures hide the math details from the button handlers.' },
    { code: '6-8.CT.d.1', how: 'Compares the repetitive version with the procedure version (length, effort to change).' },
    { code: '6-8.CT.d.4', how: 'Uses functions with parameters and return values.' },
  ],
  'games-sprites': [
    { code: '6-8.CT.a.1', how: 'Represents a position on screen with x and y coordinates.' },
    { code: '6-8.CT.b.5', how: 'Keeps the bug on screen with Canvas.Width − Bug.Width as the boundary.' },
    { code: '6-8.CT.d.3', how: 'Builds the Bug Tap game in pairs.' },
  ],
  'games-motion': [
    { code: '6-8.CT.e.1', how: 'Models motion with heading, speed and bouncing. Talk it over: what real physics does the game leave out, and why is that OK?' },
    { code: '6-8.CT.b.5', how: 'Handles screen edges with EdgeReached and Bounce.' },
    { code: '6-8.CT.d.4', how: 'Combines events, conditionals and variables for collisions.' },
  ],
  'games-state': [
    { code: '6-8.CT.d.4', how: 'Uses all five: loops (Clock), conditionals, expressions, variables and procedures.' },
    { code: '6-8.CT.d.2', how: 'resetGame and gameOver procedures hide the details of game state.' },
    { code: '6-8.CT.b.3', how: '"Plan the state" breaks the game into lives, score, levels and saving.' },
  ],
  'games-capstone': [
    { code: '6-8.CT.b.3', how: 'Breaks an original game into sprints and sub-solutions as a team.' },
    { code: '6-8.CT.d.3', how: 'Builds an original game that meets the company\'s own design goal.' },
    { code: '6-8.CT.d.6', how: 'Playtests with another company and iterates.' },
    { code: '6-8.DTC.b.2', how: 'Collaborates as a company across planning, building and testing.' },
    { code: '6-8.CAS.b.9', how: 'Talk it over: who owns your original art, and how could you license it for others to reuse?' },
  ],
  'media-camera': [
    { code: '6-8.CAS.b.7', how: 'Talk it over: the app asks for camera permission. Why do apps have to ask?' },
    { code: '6-8.CAS.a.3', how: 'Talk it over: once a photo is shared, can you ever take it back?' },
    { code: '6-8.DTC.a.2', how: 'Works with image files from the camera and the gallery.' },
    { code: '6-8.CT.d.4', how: 'Uses a list, an index variable, conditionals and a showPhoto procedure.' },
  ],
  'media-paint': [
    { code: '6-8.DTC.a.4', how: 'Creates a tool for making original digital art.' },
    { code: '6-8.CT.b.2', how: 'Finger positions (inputs) map directly to lines and dots drawn (outputs).' },
    { code: '6-8.CT.d.4', how: 'Uses events with parameters, variables and properties as state.' },
  ],
  'media-sound': [
    { code: '6-8.CS.a.4', how: 'Uses the microphone as an input sensor through SoundRecorder.' },
    { code: '6-8.DTC.a.2', how: 'Works with recorded audio files and their file paths.' },
    { code: '6-8.CAS.b.7', how: 'Talk it over: what could a sneaky app do with microphone permission?' },
    { code: '6-8.CT.d.4', how: 'Uses a list of files, a state variable and conditionals.' },
  ],
  'media-capstone': [
    { code: '6-8.CT.b.3', how: 'Breaks an original media app into an MVP and sprints.' },
    { code: '6-8.CT.d.6', how: 'User-tests with another company and iterates.' },
    { code: '6-8.DTC.a.4', how: 'Designs and creates an original multimedia product as a team.' },
    { code: '6-8.CAS.b.3', how: 'Talk it over: where did every image and sound come from, and may you use each one?' },
  ],
  'tools-forms': [
    { code: '6-8.CT.b.5', how: 'Validates every field so the form only submits correct data.' },
    { code: '6-8.CT.d.2', how: 'A validateForm procedure hides the checking details.' },
    { code: '6-8.CT.b.1', how: 'Uses conditionals and boolean logic to decide if the form is valid.' },
  ],
  'tools-tinydb': [
    { code: '6-8.CT.c.3', how: 'Creates and uses a simple database: adds, loads and removes records with TinyDB.' },
    { code: '6-8.CT.c.2', how: 'Explores how data is stored so it survives closing the app.' },
    { code: '6-8.CT.d.4', how: 'Uses a list variable, procedures and conditionals.' },
  ],
  'tools-sensors': [
    { code: '6-8.CS.a.6', how: 'Uses the phone\'s GPS to collect and present location data.' },
    { code: '6-8.CT.c.5', how: 'Uses data-collection technology and a mapping system to show results.' },
    { code: '6-8.CS.d.1', how: 'Uses location services and online map tiles that the device gets from services.' },
    { code: '6-8.CAS.a.3', how: 'Talk it over: who should be able to see your location?' },
  ],
  'tools-capstone': [
    { code: '6-8.CS.b.1', how: 'Talk it over: which parts of the user\'s problem is an app better at than a person?' },
    { code: '6-8.CT.b.3', how: 'Breaks a real user\'s problem into requirements and sprints.' },
    { code: '6-8.CT.d.6', how: 'Tests with the real user and iterates.' },
    { code: '6-8.DTC.b.2', how: 'Collaborates as a company and with an outside user.' },
  ],
  'launch-day': [
    { code: '6-8.DTC.b.1', how: 'Delivers a 60-second pitch that informs and persuades, with a live demo.' },
    { code: '6-8.CAS.b.5', how: 'Talk it over: Gallery apps share their blocks openly. How is that different from App Store apps?' },
    { code: '6-8.CAS.c.1', how: 'The pitch explains how the app could affect its users and community.' },
    { code: '6-8.DTC.b.2', how: 'Peer-tests another company\'s app and gives feedback.' },
  ],
  'solo-build': [
    { code: '6-8.CT.d.3', how: 'Each student, alone, builds a new app that meets a written spec (the transfer task).' },
    { code: '6-8.CT.d.4', how: 'The spec requires loops or a Clock, conditionals, expressions, variables and a procedure.' },
    { code: '6-8.CT.b.3', how: 'Breaks the spec into parts and plans which skill solves each part.' },
    { code: '6-8.CT.d.5', how: '"Explain your code": traces their own blocks step by step for the teacher.' },
  ],
}

/** One short discussion question shown to students on the "Ship it" stage. */
export const DISCUSS: Record<string, string> = {
  'mini-sound': 'Can you use any song or sound you find online in your app? What makes it OK to use?',
  'games-motion': 'Real balls slow down and fall. Your game ignores friction and gravity. Why is that OK?',
  'games-capstone': 'You made your own art. Who owns it? How could you let other people reuse it?',
  'media-camera': 'Your app asked to use the camera. Why do apps have to ask? And once you share a photo, can you take it back?',
  'media-sound': 'Your app asked to use the microphone. What could a sneaky app do with that?',
  'media-capstone': 'Where did every picture and sound in your app come from? Are you allowed to use each one?',
  'tools-sensors': 'Your app knows where you parked. Who else should be allowed to see your location?',
  'tools-capstone': 'Which parts of your user\'s problem is the app better at than a person? Which parts still need a human?',
  'launch-day': 'Anyone can open the blocks of an app in the App Inventor Gallery. Is that good or bad? How is it different from App Store apps?',
}

export const alignmentFor = (lessonId: string) => ALIGNMENT[lessonId] ?? []
