import type { Lesson } from '../types'

// Tool Works path: practical apps that collect input, remember data, and use the phone's sensors.

export const TOOLS_LESSONS: Lesson[] = [
  {
    id: 'tools-forms',
    title: 'Smart Forms',
    subtitle: 'Collect input and catch mistakes before they happen',
    icon: '📝',
    track: 'tools',
    concepts: ['User input', 'Validation', 'Boolean logic', 'Procedures with results'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Smart Order Form',
      description:
        'An order form for a school snack stand (or your own idea) with a name box, a quantity, a size picker, add-on checkboxes and a pickup date. It will not submit until everything is filled in correctly. Then it shows an order summary.',
    },
    objectives: [
      'Collect different kinds of input with TextBox, CheckBox, Spinner and DatePicker',
      'Validate input with "is empty", "is number?" and conditionals before using it',
      'Write a formIsValid procedure that gives back true or false',
      'Build a readable summary with join and show messages with Notifier',
    ],
    intro:
      'Welcome to **Tool Works**! People use tools to get things done. The first rule of a good tool is: **never trust the input**. Users leave boxes blank, type letters where numbers go, and tap Submit too early. Today your company builds a **Smart Order Form**. It checks everything first (that is called **validation**) and explains problems kindly instead of crashing.',
    vocab: [
      { term: 'Input', def: 'Information the user gives the app by typing, tapping, choosing, or picking a date.' },
      { term: 'Validation', def: 'Checking that input is complete and makes sense before the app uses it.' },
      { term: 'Boolean', def: 'A value that is either true or false. CheckBox.Checked is a boolean.' },
      { term: 'Notifier', def: 'A non-visible component that shows pop-up messages.' },
    ],
    steps: [
      {
        title: 'Lay out the form',
        editor: 'designer',
        body:
          'New project: `OrderForm`. Inside a **VerticalArrangement** (Width *Fill parent*) add:\n\n- `txtName`: **TextBox**, Hint "Your name"\n- `txtQty`: **TextBox**, Hint "How many?", check **NumbersOnly**\n- `spnSize`: **Spinner**, ElementsFromString `Small, Medium, Large`\n- `chkExtra1` "Add chips" and `chkExtra2` "Add drink": **CheckBoxes**\n- `datePickup`: **DatePicker**, Text "Pick a pickup date"\n- `btnSubmit` (Button) and `lblSummary` (Label)\n- **User Interface → Notifier**',
        simple: 'Make a new project called OrderForm. Put the boxes, pickers and buttons inside a VerticalArrangement.',
        newBlocks: [
          { name: 'VerticalArrangement', where: 'Palette → Layout', what: 'A box that stacks components from top to bottom.' },
          { name: 'Spinner', where: 'Palette → User Interface', what: 'A drop-down menu. It always has one choice selected.' },
          { name: 'DatePicker', where: 'Palette → User Interface', what: 'A button that opens a calendar.' },
          { name: 'Notifier', where: 'Palette → User Interface', what: 'Shows pop-up messages.' },
        ],
      },
      {
        title: 'Remember if a date was picked',
        editor: 'blocks',
        body:
          'A DatePicker always has *some* date, even if the user never touched it. So you need a variable that is false until the user really picks one. `AfterDateSet` runs when they do. Fill in the blank.',
        simple: 'Make a variable "dateChosen" that starts as false. When the user picks a date, set it to true.',
        blocks: [
          'initialize global dateChosen to false',
          'when datePickup.AfterDateSet do',
          '  set global dateChosen to ___',
          '  set datePickup.Text to join(datePickup.Month, "/", datePickup.Day, "/", datePickup.Year)',
        ],
        check: 'Test now: pick a date. The button text should change to the date, like 5/14/2026.',
      },
      {
        title: 'A procedure that answers a question',
        editor: 'blocks',
        body:
          'Use **to procedure result** (it has a socket on the left). Its answer is one true/false expression. Use **is number?** (Math drawer) before comparing, so blank or odd text cannot crash the app. Fill in the blank.\n\nYou do not need to check the Spinner: it always has a choice.',
        simple: 'Make a procedure "formIsValid". It gives back true only if the name is filled in, the quantity is a number above 0, and a date was picked.',
        blocks: [
          'to formIsValid result',
          '  (not(is empty(txtName.Text)))',
          '  and (is number?(txtQty.Text))',
          '  and (txtQty.Text > 0)',
          '  and (___)',
        ],
        newBlocks: [
          { name: 'to procedure result', where: 'Procedures drawer', what: 'A procedure that gives back one value, like true or false.' },
          { name: 'is number?', where: 'Math drawer', what: 'True if the text is a number. Use it before comparing with > or <.' },
        ],
        stuck: [
          'Want more than two "and" parts? Click the blue gear on the "and" block and drag in more inputs.',
          'Error about "> cannot accept" ""? Put "is number?" before the "> 0" part.',
        ],
      },
      {
        title: 'Explain the first problem',
        editor: 'blocks',
        body:
          'formIsValid says **if** something is wrong. A second procedure says **what** is wrong. It shows a message for the first problem it finds. Finish the last two branches yourself: "How many would you like?" and "Pick a pickup date."',
        simple: 'Make a procedure "showProblem". It shows a message for the first thing that is wrong.',
        blocks: [
          'to showProblem',
          '  if is empty(txtName.Text)',
          '    call Notifier1.ShowAlert(notice: "Please enter your name.")',
          '  else if not(is number?(txtQty.Text)) or (txtQty.Text ≤ 0)',
          '    call Notifier1.ShowAlert(notice: ___)',
          '  else if ___',
          '    call Notifier1.ShowAlert(notice: "Pick a pickup date.")',
        ],
        stuck: ['Notifier.ShowAlert shows a message, but it does NOT stop the code after it. That is why each message is in its own else-if branch.'],
      },
      {
        title: 'Submit only when valid',
        editor: 'blocks',
        day: 2,
        body:
          'Now Submit is short and easy to read, because the hard work is in the procedures. Build it **from words only**:\n\n- If `call formIsValid` is true: show a summary in `lblSummary` with **join** (name, quantity, `spnSize.Selection`, extras, date).\n- Else: `call showProblem`.\n- For extras: use a local variable that starts as "" and add " + chips" if `chkExtra1.Checked`.',
        simple: 'Build it yourself: if the form is valid, show a summary. If not, show the problem.',
        check: 'Test now: fill in everything and tap Submit. You should see one summary line, like "Ana: 2 x Large + chips — pickup 5/14/2026".',
        stuck: ['"local variable" is in the Variables drawer: "initialize local ___ to ___ in". Put your other blocks inside it.'],
      },
      {
        title: 'Try to break it',
        editor: 'phone',
        body:
          'Swap phones with your partner and try to break each other\'s forms: leave every box blank, type `0`, skip the date, tap Submit five times. Every mistake should get a friendly message and **no crash**. Fix anything that gets through, then export the `.aia` and submit it.',
        simple: 'Try to break your partner\'s form. Fix any crash. Export the .aia and submit it.',
        check: 'Done when: blank name, quantity 0 and no date each show their own message.',
      },
    ],
    remix: {
      title: 'Remix: Price tag',
      spec: 'Show the price in the summary. Small is $2, Medium is $3, Large is $4. Multiply by the quantity, and add $1 for each checked extra.',
      hints: [
        'Make a "to procedure result" called calculatePrice.',
        'Use if / else if on spnSize.Selection to pick the size price.',
        'Use a local variable for the total, and add 1 for each checked box.',
      ],
    },
    challenge: {
      title: 'Bonus: Confirm before ordering',
      body:
        'Use **Notifier.ShowChooseDialog** to ask "Place this order?" with Yes and No buttons. Only show the summary in the **AfterChoosing** event when the choice is "Yes".',
    },
    quiz: [
      {
        q: 'txtName is empty, txtQty is "2", and a date was picked. What does formIsValid give back?',
        options: ['true', 'false', '2', 'An error'],
        answer: 1,
        explain: 'All parts of an "and" must be true. The name is empty, so the first part is false and the answer is false.',
      },
      {
        q: 'What is validation?',
        options: [
          'Making the app look nice',
          'Checking input is complete and sensible before the app uses it',
          'Publishing the app to the store',
          'Saving data to the phone',
        ],
        answer: 1,
        explain: 'Validation protects your app and your users from blank or nonsense input.',
      },
      {
        q: 'Why is formIsValid a "procedure with result" instead of a plain procedure?',
        options: [
          'Plain procedures cannot contain if blocks',
          'It answers a question (true or false) that btnSubmit.Click can use in an if',
          'Result procedures run faster',
          'Only result procedures can show alerts',
        ],
        answer: 1,
        explain: 'A procedure with a result gives back a value, so "if call formIsValid" can decide what to do.',
      },
      {
        q: 'chkExtra1.Checked is true and chkExtra2.Checked is false. Which expression is true?',
        options: [
          'chkExtra1.Checked and chkExtra2.Checked',
          'not chkExtra1.Checked',
          'chkExtra1.Checked or chkExtra2.Checked',
          'chkExtra2.Checked',
        ],
        answer: 2,
        explain: '"or" is true when at least one side is true. "and" needs both.',
      },
    ],
    checks: [
      { kind: 'component', type: 'TextBox', label: 'Has a TextBox' },
      { kind: 'anyComponent', types: ['CheckBox', 'Spinner', 'DatePicker'], label: 'Has a CheckBox, Spinner, or DatePicker' },
      { kind: 'component', type: 'Notifier', label: 'Has a Notifier' },
      { kind: 'block', type: 'text_isEmpty', label: 'Checks for empty input ("is empty")' },
      { kind: 'block', type: 'controls_if', label: 'Uses conditionals to validate' },
      { kind: 'block', type: 'text_join', label: 'Builds a summary with join' },
      { kind: 'anyBlock', types: ['procedures_defreturn', 'procedures_defnoreturn'], label: 'Defines a validation procedure' },
    ],
    teacherNotes:
      'The validation is split into formIsValid (a single boolean expression, which fits App Inventor\'s "to procedure result" socket) and showProblem (an if/else-if chain of alerts). This avoids the "return inside if" pattern App Inventor does not have. App Inventor\'s "and" stops early, so "is number?" protects the "> 0" comparison. The "try to break it" swap is the most valuable 10 minutes; consider a shout-out for the team that finds the most bugs. Connect validation to real life: what happens when a website accepts a blank email?',
  },
  {
    id: 'tools-tinydb',
    title: 'Saving Data with TinyDB',
    subtitle: 'Make your app remember things after it closes',
    icon: '💾',
    track: 'tools',
    concepts: ['Persistence', 'Key-value storage', 'Lists', 'Screen.Initialize'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Forever To-Do List',
      description: 'A to-do list that remembers every task, even after the app is closed or the phone restarts. Tap a task to mark it done and remove it.',
    },
    objectives: [
      'Explain the difference between a variable (forgotten when the app closes) and stored data',
      'Save and load a list with TinyDB StoreValue and GetValue using a tag',
      'Load saved data in Screen1.Initialize, using valueIfTagNotThere for the very first run',
      'Add and remove items in a list and keep the ListView and TinyDB in sync',
    ],
    intro:
      'Close any app you built so far and open it again. Everything is gone! Variables are short-term memory. Useful tools need **long-term memory**. Programmers call this **persistence**. App Inventor\'s **TinyDB** is a tiny database on the phone. It saves each value under a name called a **tag**, like a label on a box. Today your company builds a to-do list that never forgets.',
    vocab: [
      { term: 'Persistence', def: 'Data that is still there after the app closes.' },
      { term: 'TinyDB', def: 'A non-visible component that saves values on the phone under a text tag.' },
      { term: 'Tag', def: 'The name a value is saved under, like "tasks". Use the exact same tag to get it back.' },
      { term: 'valueIfTagNotThere', def: 'What GetValue gives back if nothing was saved yet, such as an empty list on the first run.' },
    ],
    steps: [
      {
        title: 'Design the list',
        editor: 'designer',
        body:
          'New project: `ForeverToDo`. Add:\n\n- A **HorizontalArrangement** with `txtTask` (TextBox, Hint "New task", Width *Fill parent*) and `btnAdd` (Button "Add")\n- `lstTasks`: **ListView**, Height *Fill parent*\n- `lblCount`: Label\n- **Storage → TinyDB** (non-visible)',
        simple: 'Make a new project called ForeverToDo. Add a TextBox and an Add button in a row, a ListView, a Label and a TinyDB.',
        newBlocks: [{ name: 'TinyDB', where: 'Palette → Storage', what: 'Saves data on the phone so it is still there next time.' }],
      },
      {
        title: 'A variable plus a save procedure',
        editor: 'blocks',
        body:
          'Keep the tasks in a global list while the app runs. Whenever the list changes, call **one** procedure that saves it to TinyDB **and** updates the screen. Then you can never do one and forget the other. Fill in the blank.',
        simple: 'Make a "tasks" list. Make a procedure "saveAndShow" that saves the list and shows it.',
        blocks: [
          'initialize global tasks to (create empty list)',
          'to saveAndShow',
          '  call TinyDB1.StoreValue(tag: "tasks", valueToStore: get global tasks)',
          '  set lstTasks.Elements to ___',
          '  set lblCount.Text to join(length of list(get global tasks), " tasks left")',
        ],
      },
      {
        title: 'Load on startup',
        editor: 'blocks',
        body:
          '`Screen1.Initialize` runs once when the app opens. That is when you load. On the very first run nothing is saved yet, so **valueIfTagNotThere** gives you an empty list instead of an error.',
        simple: 'When the app opens, load the saved list. If nothing is saved, use an empty list.',
        blocks: [
          'when Screen1.Initialize do',
          '  set global tasks to call TinyDB1.GetValue(tag: "tasks", valueIfTagNotThere: create empty list)',
          '  call saveAndShow',
        ],
        check: 'Test now: you should see "0 tasks left" with no error.',
        stuck: ['Error "add items to list: not a list" later? valueIfTagNotThere must be "create empty list", not "".'],
      },
      {
        title: 'Add tasks (with validation!)',
        editor: 'blocks',
        day: 2,
        body:
          'Build `btnAdd.Click` **from words only**:\n\n- If the TextBox is **not empty**:\n  - add `txtTask.Text` to the tasks list\n  - clear the TextBox (set it to "")\n  - call saveAndShow',
        simple: 'Build it yourself: if the box is not empty, add the task, clear the box, and save.',
        check: 'Test now: add "Homework". You should see it in the list and "1 tasks left". Tap Add with an empty box: nothing should be added.',
      },
      {
        title: 'Tap to complete',
        editor: 'blocks',
        body:
          'When a task is tapped, remove it by its position, then save. You need three new blocks. Build it **from words only**:\n\n- Use `when lstTasks.AfterPicking`.\n- Inside it, `remove list item` from the tasks list at index `lstTasks.SelectionIndex`.\n- Then call saveAndShow.',
        simple: 'Build it yourself: when a task is tapped, remove it from the list and save.',
        newBlocks: [
          { name: 'ListView.AfterPicking', where: 'click lstTasks in the Blocks panel', what: 'Runs when the user taps a row.' },
          { name: 'ListView.SelectionIndex', where: 'click lstTasks in the Blocks panel', what: 'The position (1, 2, 3…) of the tapped row.' },
          { name: 'remove list item', where: 'Lists drawer', what: 'Removes the item at a position from a list.' },
        ],
        check: 'Test now: tap a task. It should disappear and the count should go down by 1.',
        stuck: ['The wrong task disappears? Use SelectionIndex (a number), not Selection (the text).'],
      },
      {
        title: 'The real test: close it',
        editor: 'phone',
        body:
          'Add three tasks. Now **fully close** the app: with the Companion, choose **Connect → Reset Connection** and connect again. Your tasks should come back! Export the `.aia` and submit it.',
        simple: 'Add three tasks. Close the app and open it again. The tasks should still be there.',
        check: 'Done when: your tasks come back after you reconnect.',
        stuck: [
          'Tasks did not come back? Check that the tag is spelled the same ("tasks") in StoreValue and GetValue.',
          'Switched to a different project? The Companion may clear saved data. Test again in this project.',
        ],
      },
    ],
    remix: {
      title: 'Remix: Clear all',
      spec: 'Add a "Clear all" button that empties the whole list and saves, so the count shows "0 tasks left" even after you reopen the app.',
      hints: [
        'Set the tasks variable to "create empty list".',
        'Then call the procedure you already have.',
      ],
    },
    challenge: {
      title: 'Bonus: Confirm before deleting',
      body:
        'Tapping a task deletes it right away, which is risky! Use **Notifier.ShowChooseDialog** to ask "Mark \'X\' as done?" and only remove it in **AfterChoosing** when the choice is "Yes". Save the index in a global variable between the two events.',
    },
    quiz: [
      {
        q: 'You set a global variable, close the app, and open it again. What happens to the value?',
        options: [
          'It is saved automatically',
          'It goes back to its "initialize global" value, because variables do not persist',
          'It is stored in TinyDB',
          'The app will not open',
        ],
        answer: 1,
        explain: 'Variables last only while the app is running. TinyDB keeps data between runs.',
      },
      {
        q: 'You saved with tag "tasks" but load with tag "Tasks". What do you get?',
        options: ['Your saved list', 'An error message', 'The valueIfTagNotThere value, because tags must match exactly', 'Half of the list'],
        answer: 2,
        explain: 'Tags are exact labels, and capital letters matter. A different tag is a different box.',
      },
      {
        q: 'The app runs for the very first time. Nothing is saved yet. What does lblCount show after Initialize?',
        options: ['An error', '"0 tasks left"', '"tasks left"', 'Nothing'],
        answer: 1,
        explain: 'GetValue gives back the empty list from valueIfTagNotThere. Its length is 0.',
      },
      {
        q: 'Why does every change call saveAndShow instead of saving in each event separately?',
        options: [
          'TinyDB can only be called from a procedure',
          'One procedure keeps saving and showing together, so the list, screen and database never get out of sync',
          'It uses less battery',
          'ListView requires it',
        ],
        answer: 1,
        explain: 'With "save + show" in one place, a new feature cannot skip a step by accident.',
      },
    ],
    checks: [
      { kind: 'component', type: 'TinyDB', label: 'Has a TinyDB' },
      { kind: 'method', method: 'StoreValue', label: 'Saves data with TinyDB.StoreValue' },
      { kind: 'method', method: 'GetValue', label: 'Loads data with TinyDB.GetValue' },
      { kind: 'event', component: 'Form', event: 'Initialize', label: 'Loads data in "when Screen1.Initialize"' },
      { kind: 'component', type: 'ListView', label: 'Has a ListView' },
      { kind: 'block', type: 'lists_add_items', label: 'Adds items to a list' },
      { kind: 'block', type: 'lists_remove_item', label: 'Removes items from a list' },
    ],
    teacherNotes:
      'Two handlers are words-only on purpose; circulate with "which event? which list block?" instead of showing blocks. The most common bug is a tag mismatch ("tasks" vs "Tasks"); have students store the tag in a global variable if they keep making typos. If your school allows installing apps, building the .apk is the strongest persistence demo. Privacy discussion: what kinds of data should an app NOT store on a shared phone?',
  },
  {
    id: 'tools-sensors',
    title: 'Sensors, Maps & Screens',
    subtitle: 'Use GPS, save a spot, and open a second screen',
    icon: '📍',
    track: 'tools',
    concepts: ['Sensors', 'Multiple screens', 'Sharing data between screens', 'Maps'],
    periods: 2,
    xp: { quiz: 50, build: 150, bonus: 50 },
    project: {
      name: 'Find My Car',
      description: 'Save your GPS location with one tap ("I parked here"), then open a map screen that puts a pin on the saved spot so you can find your way back.',
    },
    objectives: [
      'Read the phone\'s location with LocationSensor and the LocationChanged event',
      'Save latitude and longitude with TinyDB so another screen can use them',
      'Add a second screen and open it with "open another screen"',
      'Show a saved location on a Map with a Marker and SetLocation',
    ],
    intro:
      'Your phone has many **sensors**: GPS, a motion sensor, a step counter and a compass. Tools become powerful when they react to the real world. Today your company builds **Find My Car**. It saves where you are and shows it on a map later. You will also build your first **two-screen** app. Screens are like separate rooms: they share information through TinyDB.',
    vocab: [
      { term: 'Sensor', def: 'A component that measures something in the real world, like location, motion, or steps.' },
      { term: 'Latitude / Longitude', def: 'Two numbers that show any place on Earth (north-south and east-west).' },
      { term: 'Screen', def: 'A separate page of an app with its own components and blocks.' },
      { term: 'Marker', def: 'A pin on a Map component. SetLocation moves it to a latitude and longitude.' },
    ],
    devices: [
      { need: 'No GPS indoors, or location is blocked', fallback: 'Add a "Use school location" button that saves your school\'s latitude and longitude (look them up on a map website) instead of the sensor values. The map screen works the same.' },
      { need: 'No phone (emulator only)', fallback: 'The emulator has no real GPS. Use the "Use school location" button above.' },
      { need: 'The map is grey', fallback: 'The school network may block map pictures. The pin still works. Try on a phone hotspot or at home, or show the saved numbers in a Label.' },
    ],
    steps: [
      {
        title: 'Screen1: the parking button',
        editor: 'designer',
        body:
          'New project: `FindMyCar`. On **Screen1** add:\n\n- `lblWhere`: Label ("Waiting for GPS...")\n- `btnPark`: Button, "🅿️ I parked here"\n- `btnFind`: Button, "🗺️ Find my car"\n- **Sensors → LocationSensor**: check **Enabled**, TimeInterval `1000`\n- **Storage → TinyDB**',
        simple: 'Make a new project called FindMyCar. Add a Label, two buttons, a LocationSensor and a TinyDB.',
        newBlocks: [{ name: 'LocationSensor', where: 'Palette → Sensors', what: 'Uses GPS to find the phone\'s latitude and longitude.' }],
      },
      {
        title: 'Watch the location change',
        editor: 'blocks',
        body:
          '`LocationChanged` runs whenever the phone gets a new GPS reading. It gives you **latitude** and **longitude**. Show them so you know the sensor works. Fill in the blank.',
        simple: 'When the location changes, show the latitude and longitude in the Label.',
        blocks: [
          'when LocationSensor1.LocationChanged latitude longitude altitude speed do',
          '  set lblWhere.Text to join("You are at ", get latitude, ", ", ___)',
        ],
        check: 'Test now: near a window you should see two numbers, like "You are at 42.2, -71.4".',
        stuck: [
          'Tapped "Deny" on location? On Android go to Settings → Apps → MIT AI2 Companion → Permissions → Location → Allow.',
          'Still "Waiting for GPS"? Indoors GPS is slow. Move near a window, or use the school-location fallback in the device box.',
        ],
      },
      {
        title: 'Save the spot',
        editor: 'blocks',
        body:
          'Build `btnPark.Click` **from words only**:\n\n- If `LocationSensor1.Latitude = 0`: show "No GPS yet. Try again near a window." (0 means no reading yet.)\n- Else: use `TinyDB1.StoreValue` twice, with tag `"carLat"` for Latitude and tag `"carLong"` for Longitude. Then show "Spot saved!"',
        simple: 'Build it yourself: if there is no GPS yet, say so. If there is, save the latitude and longitude.',
        check: 'Test now: tap Park. You should see "Spot saved!" (or the "No GPS yet" message).',
      },
      {
        title: 'Add a map screen',
        editor: 'designer',
        day: 2,
        body:
          'Click **Add Screen** at the top and name it `MapScreen`. On it add a **Maps → Map** (Width and Height *Fill parent*), a **Maps → Marker** dropped **onto the Map**, a Button `btnBack` ("Back") and a **TinyDB**. Keep its Namespace as `TinyDB1`, the same as Screen1. Back on Screen1:',
        simple: 'Add a second screen called MapScreen with a Map, a Marker, a Back button and a TinyDB. On Screen1, the Find button opens MapScreen.',
        blocks: ['when btnFind.Click do', '  call open another screen(screenName: "MapScreen")'],
        newBlocks: [
          { name: 'open another screen', where: 'Control drawer', what: 'Opens a screen by its name, in quotes.' },
          { name: 'open another screen with start value', where: 'Control drawer', what: 'Opens a screen and sends it one value. The new screen reads it with "get start value".' },
          { name: 'Map and Marker', where: 'Palette → Maps', what: 'A map of the world, and a pin you can put on it.' },
        ],
        stuck: ['The new screen does not see Screen1\'s variables. That is normal. Screens share data through TinyDB (or a start value).'],
      },
      {
        title: 'Drop the pin',
        editor: 'blocks',
        body:
          'Switch the Blocks editor to **MapScreen** with the screen menu at the top. When it opens, load the saved spot and move the marker there. Fill in the blank. Then build `btnBack.Click` yourself: it calls `close screen` (Control drawer).',
        simple: 'On MapScreen, load the saved spot and put the pin there. The Back button closes the screen.',
        blocks: [
          'when MapScreen.Initialize do',
          '  initialize local lat to call TinyDB1.GetValue(tag: "carLat", valueIfTagNotThere: 0)',
          '  initialize local long to call TinyDB1.GetValue(tag: "carLong", valueIfTagNotThere: 0)',
          '  in:',
          '    if (get lat = 0)',
          '      set Marker1.Visible to false',
          '    else',
          '      call Marker1.SetLocation(latitude: get lat, longitude: ___)',
          '      call Map1.PanTo(latitude: get lat, longitude: get long, zoom: 17)',
        ],
        check: 'Test now: tap Find. You should see the map with a pin on your saved spot. Back returns to Screen1.',
        stuck: [
          'Two "initialize local" blocks: put the second one inside the first, then your if inside the second.',
          'Pin in the ocean off Africa? The tags do not match, so it loaded 0. Check "carLat" and "carLong" spelling on both screens.',
          'Use "close screen" to go back. Do not open Screen1 again, or you stack up copies of it.',
        ],
      },
      {
        title: 'Field test, export and submit',
        editor: 'phone',
        body:
          'With your teacher\'s OK, save a spot, walk to the other side of the room or the hallway, and open the map. Is the pin where you parked? GPS indoors can be off by 10–50 meters. Write down what you noticed. Export the `.aia` and submit it.',
        simple: 'Save a spot, walk away, and open the map. Is the pin right? Export the .aia and submit it.',
        frames: ['The pin was ___ meters from where we parked.', 'GPS worked better when ___.'],
      },
    ],
    remix: {
      title: 'Remix: How long ago?',
      spec: 'When you park, also save the time. On MapScreen, show "Parked at 3:42 PM" in a Label above the map.',
      hints: [
        'Add a Clock component to both screens. Clock1.Now gives the current time.',
        'Save it in TinyDB with a new tag, like "carTime".',
        'On MapScreen, use Clock1.FormatTime on the loaded value and show it in the Label.',
      ],
    },
    challenge: {
      title: 'Bonus: More sensors',
      body:
        'Turn Find My Car into a walking tool: add a **Pedometer** that counts steps since you parked (reset it in btnPark.Click) and show "Steps from car: N". Or use the **AccelerometerSensor** Shaking event as a hands-free "park here".',
    },
    quiz: [
      {
        q: 'You tap Park while LocationSensor1.Latitude is 0. What happens?',
        options: [
          'The spot 0, 0 is saved',
          'lblWhere shows "No GPS yet. Try again near a window." and nothing is saved',
          'The app opens MapScreen',
          'The app crashes',
        ],
        answer: 1,
        explain: 'The if checks for 0 first. Only the else branch saves to TinyDB.',
      },
      {
        q: 'Screen1 sets a global variable. Can MapScreen read it directly?',
        options: [
          'Yes, global means every screen can see it',
          'No. Each screen has its own variables, so share data with TinyDB (or a start value)',
          'Only if both screens have a Map',
          'Only on iPhones',
        ],
        answer: 1,
        explain: 'Screens are like separate rooms. TinyDB is a shared box both can open.',
      },
      {
        q: 'Why check whether LocationSensor1.Latitude = 0 before saving?',
        options: [
          '0 means the phone is at the North Pole',
          '0 usually means there is no GPS reading yet, so saving it would put the pin in the ocean',
          'TinyDB cannot store 0',
          'The Map only accepts negative numbers',
        ],
        answer: 1,
        explain: 'Latitude 0, longitude 0 is in the Atlantic Ocean. Treat it as "no reading yet".',
      },
      {
        q: 'Which block moves the pin to the saved spot?',
        options: ['call Marker1.SetLocation latitude longitude', 'set Map1.Visible to true', 'call open another screen', 'call LocationSensor1.Enabled'],
        answer: 0,
        explain: 'SetLocation places the Marker at the latitude and longitude you give it.',
      },
    ],
    checks: [
      {
        kind: 'anyComponent',
        types: ['LocationSensor', 'Pedometer', 'AccelerometerSensor', 'OrientationSensor'],
        label: 'Uses a sensor',
      },
      { kind: 'screens', min: 2, label: 'Has at least 2 screens' },
      { kind: 'block', type: 'controls_openAnotherScreen', label: 'Opens another screen' },
      { kind: 'component', type: 'TinyDB', label: 'Shares data with TinyDB' },
      { kind: 'component', type: 'Map', label: 'Has a Map' },
      { kind: 'method', method: 'SetLocation', label: 'Moves a Marker with SetLocation' },
    ],
    teacherNotes:
      'GPS indoors is unreliable; plan a hallway or courtyard walk, or point students to the "Use school location" fallback in the device box. Test that Map tiles load on the school network before class (blocked tiles give a grey map). Location is personal data: discuss why apps ask permission and why sharing your live location is a big deal. Start value is introduced as a callout only; TinyDB is the main way screens share data in this course.',
  },
  {
    id: 'tools-capstone',
    title: 'Capstone: Your Utility App',
    subtitle: 'Solve a real problem for a real person',
    icon: '🛠️',
    track: 'tools',
    concepts: ['User research', 'Requirements', 'Iteration', 'User testing'],
    periods: 8,
    xp: { quiz: 60, build: 300, bonus: 100 },
    project: {
      name: 'Your Original Utility App',
      description:
        'Your company interviews a real user (a teacher, coach, sibling, or classmate), finds a problem they have, and builds a tool app that solves it, such as a homework tracker, practice log or chore chart.',
    },
    objectives: [
      'Interview a real user and turn what you learn into a problem statement',
      'Write up to 3 testable must-have requirements and sketch a wireframe',
      'Build in sprints, using TinyDB, two screens, procedures and validation',
      'Test with your real user, collect feedback, and improve the app',
    ],
    intro:
      'The best tools come from **listening to people**. Product teams interview users, find out what annoys them, and design around it. In this capstone your Tool Works company does the same. You find a real person with a real problem, build an app for them, put it in their hands, and improve it based on what they say.',
    vocab: [
      { term: 'User research', def: 'Talking to and watching the people who will use your app to learn what they really need.' },
      { term: 'Problem statement', def: '"[User] needs a way to [do something] because [reason]."' },
      { term: 'Requirement', def: 'A specific thing the app must do, written so you can test if it works.' },
      { term: 'Feedback', def: 'What users tell you (or show you) after trying your app. Use it to plan the next version.' },
    ],
    ideas: [
      {
        title: 'Practice Log',
        pitch: 'A musician or athlete logs each practice (date + minutes) and sees the total for the week.',
        uses: ['TinyDB', 'list of entries', 'validation (is number?)', 'a second screen for history'],
        stretch: 'Show the longest practice.',
      },
      {
        title: 'Homework Tracker',
        pitch: 'A student adds assignments with a due date and taps them off when done.',
        uses: ['TinyDB', 'DatePicker', 'ListView + remove list item', 'two screens'],
        stretch: 'Show "due today" items first.',
      },
      {
        title: 'Chore Chart',
        pitch: 'A family member checks off chores each day, and the app remembers what is done.',
        uses: ['TinyDB', 'CheckBoxes or ListView', 'saveAndShow procedure', 'a settings screen to add chores'],
        stretch: 'A "reset for a new day" button.',
      },
      {
        title: 'Club Attendance',
        pitch: 'A club leader taps names to mark who came, and sees a count for each meeting.',
        uses: ['TinyDB', 'list of names', 'ListView AfterPicking', 'a second screen for past meetings'],
        stretch: 'Show each member\'s total.',
      },
      {
        title: 'Reading Log',
        pitch: 'A reader logs books with pages read and sees their progress toward a goal.',
        uses: ['TinyDB', 'validation', 'math to add up pages', 'two screens'],
        stretch: 'A goal setting saved in TinyDB.',
      },
    ],
    devices: [
      { need: 'Your user has an iPhone', fallback: 'Your user can test on the iPhone Companion, or try the app on your phone during the test.' },
      { need: 'Installing an .apk is blocked', fallback: 'Skip the .apk. Your user tests the app on your phone with the Companion while you watch.' },
      { need: 'No phone (emulator only)', fallback: 'Run the user test in the emulator on your computer. TinyDB works there too.' },
    ],
    steps: [
      {
        title: 'Find your user and interview them',
        body:
          'Choose one real person who is not in your company, such as a teacher, coach, family member or club leader. Interview them for 5–10 minutes. Write down their answers. Pick an idea card only if it matches what they said.',
        simple: 'Pick a real person. Ask them what they keep track of and what is hard about it. Write down what they say.',
        frames: [
          'What is something you keep track of every day or week?',
          'What part of it is annoying or easy to forget?',
          'How do you do it now (paper, memory, another app)?',
          'If an app helped, what is the ONE thing it must do?',
        ],
      },
      {
        title: 'Problem statement and plan',
        day: 2,
        body:
          'Write your **problem statement**. Then fill in the **planner card** on this page:\n\n- **MUST** (max 3): testable requirements, like "The user can add a practice with minutes, and it is still there after the app restarts"\n- **NICE**: everything else\n- **Who does what** in each sprint\n\nYour app must use TinyDB, at least 2 screens, a procedure and validation. Your teacher approves the plan before you code.',
        simple: 'Write one sentence about the user\'s problem. Write up to 3 must-have features. Get your teacher\'s OK.',
        frames: [
          '___ needs a way to ___ because ___.',
          'MUST 1: The user can ___, and we can test it by ___.',
          'Our TinyDB tags will be: ___.',
        ],
        stuck: ['Idea needs accounts, messages between phones, or online data? Shrink it to one phone. That is your MVP.'],
      },
      {
        title: 'Sprint 1: the main screen',
        editor: 'designer',
        day: 3,
        body:
          'Goal: **MUST 1 works on Screen1**. The Builder drags components and blocks; the Navigator reads the plan and checks names and tags. Write your TinyDB tags on paper first. A mismatched tag is the #1 bug in two-screen apps. Log who did what in the contribution log.',
        simple: 'Make your first must-have work on Screen1. One partner builds. The other checks the plan and names.',
        check: 'Done when: you can add data, close the app, open it again, and the data is still there.',
      },
      {
        title: 'Sprint 2: the backbone',
        editor: 'blocks',
        day: 4,
        body:
          'Swap Builder and Navigator. Good tool apps use the same backbone you used all path long: **load** in Initialize → **validate** input → **change** the data → call **one** procedure that saves and refreshes. Make sure your app has this shape:',
        simple: 'Swap jobs. Load when the app opens. Check the input. Change the list. Save and show it with one procedure.',
        blocks: [
          'when Screen1.Initialize do',
          '  set global records to call TinyDB1.GetValue(tag: "records", valueIfTagNotThere: create empty list)',
          '  call saveAndShow',
          'when btnAdd.Click do',
          '  if is empty(txtEntry.Text)',
          '    call Notifier1.ShowAlert(notice: "Type something first!")',
          '  else',
          '    call add items to list(list: get global records, item: txtEntry.Text)',
          '    call saveAndShow',
        ],
        check: 'Done when: blank input shows a message, and good input is saved and shown.',
      },
      {
        title: 'Sprint 3: the second screen',
        editor: 'blocks',
        day: 5,
        body:
          'Swap jobs again. Goal: **all MUST features work**, including your second screen. The second screen loads its data from TinyDB with the **same tags**. Use `close screen` to go back.',
        simple: 'Swap jobs. Finish the second screen. Use the same TinyDB tags on both screens.',
        check: 'Done when: data saved on one screen shows up on the other screen.',
        stuck: ['Data "disappears" on the second screen? Compare the tags letter by letter. "log" and "logs" are different.'],
      },
      {
        title: 'When you are stuck',
        body:
          'Try these in order before asking the teacher:\n\n1. **Read** the red error or the warning on the block.\n2. **Test a smaller piece**: does just that one event work?\n3. **Check names and tags**: right component? same tag on both screens?\n4. **Ask another company** (2 minutes max).\n5. **Ask the teacher**, and say what you already tried.',
        simple: 'Read the error. Test a small part. Check names and tags. Ask another company. Then ask the teacher.',
        frames: ['We expected ___ but instead ___.', 'We already tried ___.'],
      },
      {
        title: 'Test with your real user',
        editor: 'phone',
        day: 7,
        body:
          'Put the app in your user\'s hands (or a classmate acting as them) and give them a real task: "Log yesterday\'s practice." **Do not help.** Watch where they stop or look confused. Afterward, ask the questions below and write down their answers.',
        simple: 'Your user tries the app. Do not help. Watch where they get stuck. Ask what to change.',
        frames: [
          'Would you really use this? Why or why not?',
          'Where did you get stuck?',
          'What would make it better?',
          'Our user got stuck when ___, so we will ___.',
        ],
      },
      {
        title: 'Improve and ship',
        editor: 'designer',
        day: 8,
        body:
          'Fix the most important feedback first. Then polish: upload an icon picture and set **Screen1 → Icon**, set **AppName**, use clear labels and friendly error messages. Test the "first run" (no data) and "full list" cases. Export the `.aia` and submit with your problem statement, plan and user feedback.',
        simple: 'Fix the biggest problem your user found. Add an icon and app name. Test, export and submit.',
        newBlocks: [
          { name: 'Upload File', where: 'Designer → Media panel', what: 'Adds a picture to your project, for example an icon.' },
          { name: 'Screen1 → Icon', where: 'Designer → select Screen1 → Properties', what: 'The picture people see on their home screen.' },
        ],
        check: 'Done when: your user\'s top problem is fixed, and the app works with no data and with lots of data.',
      },
    ],
    challenge: {
      title: 'Bonus: Ship it to your user',
      body:
        'If your school allows it, build the **.apk** (Build → Android App) and install it on your user\'s device (with their permission). Have them use it for a few days. Add a short "what changed after real use" note, one feature they asked for, and a quote from your user.',
    },
    quiz: [
      {
        q: 'Why interview a real user before building?',
        options: [
          'It is required by App Inventor',
          'So you build something people actually need instead of guessing',
          'To get their Google password',
          'Interviews make the app run faster',
        ],
        answer: 1,
        explain: 'User research replaces guesses with real information about what bothers people.',
      },
      {
        q: 'Which is the best-written requirement?',
        options: [
          'The app should be good',
          'The app is easy',
          'The user can add a task with a due date, and it is still there after the app restarts',
          'The app uses lots of blocks',
        ],
        answer: 2,
        explain: 'A good requirement is specific and testable: you can check yes or no whether it works.',
      },
      {
        q: 'Screen1 saves with tag "log" and Screen2 loads tag "logs". What does Screen2 show?',
        options: [
          'The saved data',
          'Only the valueIfTagNotThere value, so the data seems to disappear',
          'App Inventor fixes the tag automatically',
          'The data twice',
        ],
        answer: 1,
        explain: 'Tags must match exactly. Agree on tag names as a team and write them down.',
      },
      {
        q: 'Your user says the app is confusing. What is the best response?',
        options: [
          'Explain that they are using it wrong',
          'Ask where exactly they got stuck, then change the design and test again',
          'Add more buttons',
          'Find a different user who likes it',
        ],
        answer: 1,
        explain: 'Feedback drives improvement. Find the exact stuck point, fix it, and test again.',
      },
    ],
    checks: [
      { kind: 'component', type: 'TinyDB', label: 'Saves data with TinyDB' },
      { kind: 'screens', min: 2, label: 'Has at least 2 screens' },
      { kind: 'anyBlock', types: ['procedures_defnoreturn', 'procedures_defreturn'], label: 'Defines a procedure' },
      { kind: 'block', type: 'controls_if', label: 'Uses conditionals (validation)' },
      { kind: 'totalBlocks', min: 40, label: 'Has at least 40 blocks' },
    ],
    teacherNotes:
      'Eight periods: 1 interview, 1 problem statement + plan, 3 sprints, 1 stuck/catch-up buffer, 1 user test, 1 improve + ship. Line up "client" volunteers in advance (staff, coaches, older students) and brief them to give honest feedback. Approve the planner card before coding. Partners swap Builder/Navigator each sprint instead of splitting screens, because App Inventor cannot merge two people\'s screens into one project; the contribution log records who did what. Weigh the problem statement, plan and feedback notes as heavily as the .aia checks.',
  },
]
