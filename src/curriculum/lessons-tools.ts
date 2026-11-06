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
        'An order form for a school snack stand (or your own idea) with a name box, size picker, add-on checkboxes and pickup date. It refuses to submit until everything is filled in correctly, then shows a neat order summary.',
    },
    objectives: [
      'Collect different kinds of input with TextBox, CheckBox, Spinner and DatePicker',
      'Validate input with "is empty" and conditionals before using it',
      'Write a validateForm procedure that returns true or false',
      'Build a readable summary with join and show messages with Notifier',
    ],
    intro:
      'Welcome to **Tool Works**! Tools are apps people rely on to get things done, and the first rule of a good tool is: **never trust the input**. Users leave boxes blank, type letters where numbers go, and tap Submit too early. Today your company builds a **Smart Order Form** that checks everything (that is called **validation**) and explains problems kindly instead of crashing.',
    vocab: [
      { term: 'Input', def: 'Information the user gives the app by typing, tapping, choosing, or picking a date.' },
      { term: 'Validation', def: 'Checking that input is complete and makes sense before the app uses it.' },
      { term: 'Boolean', def: 'A value that is either true or false. CheckBox.Checked is a boolean.' },
      { term: 'Notifier', def: 'A non-visible component that pops up alerts and choice dialogs.' },
    ],
    steps: [
      {
        title: 'Lay out the form',
        editor: 'designer',
        body:
          'New project: `OrderForm`. Inside a **VerticalArrangement** (Width *Fill parent*) add:\n\n- `txtName`: **TextBox**, Hint "Your name"\n- `txtQty`: **TextBox**, Hint "How many?", check **NumbersOnly**\n- `spnSize`: **Spinner**, set **ElementsFromString** to `Small, Medium, Large`\n- `chkExtra1` and `chkExtra2`: **CheckBoxes**, for example "Add chips" and "Add drink"\n- `datePickup`: **DatePicker**, Text "Pick a pickup date"\n- `btnSubmit` (Button) and `lblSummary` (Label)\n- **User Interface → Notifier** (non-visible)',
      },
      {
        title: 'A procedure that answers a question',
        editor: 'blocks',
        body:
          'Use the **"to procedure result"** block (it has a socket on the left). It *returns* true when the form is OK and false when it is not, showing a helpful alert for the **first** problem found. Each `if` checks one rule.',
        blocks: [
          'to validateForm result',
          '  if is empty txtName.Text',
          '    call Notifier1.ShowAlert notice "Please enter your name."',
          '    return false',
          '  else if is empty txtQty.Text or txtQty.Text = 0',
          '    call Notifier1.ShowAlert notice "How many would you like?"',
          '    return false',
          '  else if get global dateChosen = false',
          '    call Notifier1.ShowAlert notice "Pick a pickup date."',
          '    return false',
          '  else',
          '    return true',
        ],
      },
      {
        title: 'Remember the date was picked',
        editor: 'blocks',
        body:
          'A DatePicker always has *some* date, so you need a variable to know whether the user actually chose one. `AfterDateSet` fires when they do. In App Inventor, `return` lives in the Control drawer, and you may need to rebuild the procedure above with "do … result" blocks. Ask a partner to check the shape.',
        blocks: [
          'initialize global dateChosen to false',
          'when datePickup.AfterDateSet do',
          '  set global dateChosen to true',
          '  set datePickup.Text to join datePickup.Month "/" datePickup.Day "/" datePickup.Year',
        ],
      },
      {
        title: 'Submit only when valid',
        editor: 'blocks',
        body:
          'Now the Submit button is short and readable, because the hard work lives in the procedure. Use **join** to build a summary from every input. The CheckBox **Checked** property is a boolean you can test with `if`.',
        blocks: [
          'when btnSubmit.Click do',
          '  if call validateForm',
          '    initialize local extras to ""',
          '      if chkExtra1.Checked',
          '        set extras to join get extras " + chips"',
          '      if chkExtra2.Checked',
          '        set extras to join get extras " + drink"',
          '      set lblSummary.Text to join txtName.Text ": " txtQty.Text " x " spnSize.Selection get extras " — pickup " datePickup.Text',
        ],
      },
      {
        title: 'Try to break it',
        editor: 'phone',
        body:
          'Swap phones with your partner and try to break each other\'s forms: leave every box blank, type `0`, skip the date, tap Submit five times. Every mistake should get a friendly message and **no crash**. Fix anything that slips through, then export the `.aia` and submit it.',
      },
    ],
    challenge: {
      title: 'Bonus: Price calculator & confirm',
      body:
        'Add a second procedure `calculatePrice` that **returns** a total: a price per size (use an if/else if chain or a list), times quantity, plus $1 per checked extra. Then use **Notifier.ShowChooseDialog** to ask "Place order for $X?" with Yes/No buttons, and only show the summary after Yes in the AfterChoosing event.',
    },
    quiz: [
      {
        q: 'What is validation?',
        options: [
          'Making the app look nice',
          'Checking input is complete and sensible before the app uses it',
          'Publishing the app to the store',
          'Saving data to the phone',
        ],
        answer: 1,
        explain: 'Validation protects your app (and your users) from blank or nonsense input.',
      },
      {
        q: 'Which block checks whether a TextBox was left blank?',
        options: ['length of list', 'is empty', 'join', 'is number?'],
        answer: 1,
        explain: '"is empty" (from the Text drawer) returns true when the text has no characters.',
      },
      {
        q: 'Why is validateForm a "procedure with result" instead of a plain procedure?',
        options: [
          'Plain procedures cannot contain if blocks',
          'It needs to answer a question (true or false) that btnSubmit.Click can use in an if',
          'Result procedures run faster',
          'Only result procedures can show alerts',
        ],
        answer: 1,
        explain: 'A procedure with a result returns a value, so "if call validateForm" can decide whether to continue.',
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
      'The "return" pattern inside if/else if is the trickiest part. App Inventor\'s "to procedure result" takes a single expression, so students usually need a "do … result" block (Control drawer) or a local variable set in each branch and returned at the end. Both are fine; accept either as long as validateForm answers true/false. The "try to break it" swap is the most valuable 10 minutes of the lesson; consider giving a small XP shout-out to the team that finds the most bugs in someone else\'s form. Connect validation to real life: what happens when a website accepts a blank email?',
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
      description:
        'A to-do list that remembers every task even after the app is closed or the phone restarts. Tap a task to mark it done and remove it.',
    },
    objectives: [
      'Explain the difference between a variable (forgotten when the app closes) and stored data (persistent)',
      'Save and load a list with TinyDB StoreValue and GetValue using a tag',
      'Load saved data in Screen1.Initialize, using valueIfTagNotThere for the very first run',
      'Add and remove items in a list and keep the ListView and TinyDB in sync',
    ],
    intro:
      'Close almost any app you built so far and reopen it, and everything is gone. Variables live in the phone\'s short-term memory. Useful tools need **long-term memory**, which programmers call **persistence**. App Inventor\'s **TinyDB** is a tiny database on the phone that stores values under name tags, like labeled jars on a shelf. Today your company builds a to-do list that never forgets.',
    vocab: [
      { term: 'Persistence', def: 'Data that survives after the app closes.' },
      { term: 'TinyDB', def: 'A non-visible component that stores values on the phone under a text tag.' },
      { term: 'Tag', def: 'The name a value is saved under, like "tasks". Use the exact same tag to get it back.' },
      { term: 'valueIfTagNotThere', def: 'What GetValue returns if nothing has been saved yet, such as an empty list on the first run.' },
    ],
    steps: [
      {
        title: 'Design the list',
        editor: 'designer',
        body:
          'New project: `ForeverToDo`. Add:\n\n- A **HorizontalArrangement** with `txtTask` (TextBox, Hint "New task", Width *Fill parent*) and `btnAdd` (Button "Add")\n- `lstTasks`: **ListView**, Height *Fill parent*\n- `lblCount`: Label\n- **Storage → TinyDB** (non-visible)',
      },
      {
        title: 'A variable plus a save procedure',
        editor: 'blocks',
        body:
          'Keep the tasks in a global list while the app runs. Whenever the list changes, call **one** procedure that saves it to TinyDB and refreshes the screen. Then you can never forget to do one without the other.',
        blocks: [
          'initialize global tasks to',
          '  create empty list',
          'to saveAndShow',
          '  call TinyDB1.StoreValue',
          '    tag: "tasks"',
          '    valueToStore: get global tasks',
          '  set lstTasks.Elements to get global tasks',
          '  set lblCount.Text to join length of list get global tasks " tasks left"',
        ],
      },
      {
        title: 'Load on startup',
        editor: 'blocks',
        body:
          '`Screen1.Initialize` runs once when the app opens. That is the moment to load. On the very first run nothing is saved yet, so **valueIfTagNotThere** gives you an empty list instead of an error.',
        blocks: [
          'when Screen1.Initialize do',
          '  set global tasks to call TinyDB1.GetValue',
          '    tag: "tasks"',
          '    valueIfTagNotThere: create empty list',
          '  call saveAndShow',
        ],
      },
      {
        title: 'Add tasks (with validation!)',
        editor: 'blocks',
        body:
          'Use what you learned about input: do not add blank tasks. After adding, clear the TextBox so it is ready for the next one.',
        blocks: [
          'when btnAdd.Click do',
          '  if not is empty txtTask.Text',
          '    call add items to list list get global tasks item txtTask.Text',
          '    set txtTask.Text to ""',
          '    call saveAndShow',
        ],
      },
      {
        title: 'Tap to complete',
        editor: 'blocks',
        body:
          'When a task is tapped, remove it from the list by its **SelectionIndex**, then save. Because saveAndShow updates TinyDB *and* the ListView, they stay in sync.',
        blocks: [
          'when lstTasks.AfterPicking do',
          '  call remove list item list get global tasks index lstTasks.SelectionIndex',
          '  call saveAndShow',
        ],
      },
      {
        title: 'The real test: close it',
        editor: 'phone',
        body:
          'Add three tasks. Now **fully close** the app. With the Companion, use **Connect → Reset Connection** and reconnect. Your tasks should come back! (For the strongest test, build the .apk with **Build → Android App** and restart the phone.) Export the `.aia` and submit it.',
      },
    ],
    challenge: {
      title: 'Bonus: Confirm & clear all',
      body:
        'Tapping a task deletes it instantly, which is risky! Use **Notifier.ShowChooseDialog** to ask "Mark \'X\' as done?" and only remove it in **AfterChoosing** when the choice is "Yes". Remember the index in a global variable between the two events. Then add a "Clear all" button that uses **TinyDB.ClearTag**.',
    },
    quiz: [
      {
        q: 'You set a global variable, close the app, and reopen it. What happens to the value?',
        options: [
          'It is saved automatically',
          'It goes back to its "initialize global" value, because variables do not persist',
          'It is stored in TinyDB',
          'The app will not open',
        ],
        answer: 1,
        explain: 'Variables live only while the app is running. TinyDB is how you keep data between runs.',
      },
      {
        q: 'You saved with tag "tasks" but load with tag "Tasks". What do you get?',
        options: [
          'Your saved list',
          'An error message',
          'The valueIfTagNotThere value, because tags must match exactly',
          'Half of the list',
        ],
        answer: 2,
        explain: 'Tags are exact labels, and capital letters matter. A different tag is a different jar on the shelf.',
      },
      {
        q: 'Why load the data inside Screen1.Initialize?',
        options: [
          'It runs once when the app opens, before the user does anything',
          'It runs every time a button is clicked',
          'TinyDB only works in Initialize',
          'It makes the ListView bigger',
        ],
        answer: 0,
        explain: 'Initialize is the app\'s "startup" event: the right moment to restore saved data.',
      },
      {
        q: 'Why does every change call saveAndShow instead of saving in each event separately?',
        options: [
          'TinyDB can only be called from a procedure',
          'One procedure keeps saving and displaying together, so the list, screen and database never get out of sync',
          'It uses less battery',
          'ListView requires it',
        ],
        answer: 1,
        explain: 'Putting "save + refresh" in one place means adding a new feature cannot accidentally skip a step.',
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
      'The Companion keeps TinyDB data between reconnects for the same project, but data can be wiped when switching projects, so the strongest persistence demo is an installed .apk. The most common bug is a tag mismatch ("tasks" vs "Tasks" vs "task"). Have students put the tag in a global variable if they keep making typos. Students who skip valueIfTagNotThere (or leave it as "") get a crash on the first run when "add items to list" receives text instead of a list. That is a great live debugging moment. Privacy discussion: what kinds of data should an app NOT store on a shared phone?',
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
      description:
        'Save your current GPS location with one tap ("park here"), then open a map screen that drops a marker on the saved spot so you can find your way back.',
    },
    objectives: [
      'Read the phone\'s location with LocationSensor and the LocationChanged event',
      'Save latitude and longitude with TinyDB so another screen can use them',
      'Add a second screen and open it with "open another screen"',
      'Show a saved location on a Map with a Marker and SetLocation',
    ],
    intro:
      'Your phone is packed with **sensors**: GPS, an accelerometer, a step counter, a compass. Tools become powerful when they react to the real world. Today your company builds **Find My Car**: it saves where you are and shows it on a map later. You will also build your first **two-screen** app and learn that screens are like separate rooms. They share information through TinyDB.',
    vocab: [
      { term: 'Sensor', def: 'A component that measures something about the real world, like location, motion, or steps.' },
      { term: 'Latitude / Longitude', def: 'Two numbers that pinpoint any place on Earth (north-south and east-west).' },
      { term: 'Screen', def: 'A separate page of an app with its own components and blocks.' },
      { term: 'Marker', def: 'A pin on a Map component. SetLocation moves it to a latitude and longitude.' },
    ],
    steps: [
      {
        title: 'Screen1: the parking button',
        editor: 'designer',
        body:
          'New project: `FindMyCar`. On **Screen1** add:\n\n- `lblWhere`: Label ("Waiting for GPS...")\n- `btnPark`: Button, "🅿️ I parked here"\n- `btnFind`: Button, "🗺️ Find my car"\n- **Sensors → LocationSensor**: check **Enabled**, TimeInterval `1000`\n- **Storage → TinyDB**\n\nThe phone will ask for **location permission**. Allow it, and test near a window or outdoors for a better GPS signal.',
      },
      {
        title: 'Watch the location change',
        editor: 'blocks',
        body:
          '`LocationChanged` fires whenever the phone gets a new GPS reading and hands you **latitude** and **longitude**. Show them so you know the sensor is working.',
        blocks: [
          'when LocationSensor1.LocationChanged latitude longitude altitude speed do',
          '  set lblWhere.Text to join "You are at " get latitude ", " get longitude',
        ],
      },
      {
        title: 'Save the spot',
        editor: 'blocks',
        body:
          'When Park is tapped, store the sensor\'s current **Latitude** and **Longitude** properties in TinyDB. Guard it with a conditional: a latitude of 0 means there is no GPS fix yet.',
        blocks: [
          'when btnPark.Click do',
          '  if LocationSensor1.Latitude = 0',
          '    set lblWhere.Text to "No GPS yet. Try again near a window."',
          '  else',
          '    call TinyDB1.StoreValue tag "carLat" valueToStore LocationSensor1.Latitude',
          '    call TinyDB1.StoreValue tag "carLong" valueToStore LocationSensor1.Longitude',
          '    set lblWhere.Text to "Spot saved!"',
        ],
      },
      {
        title: 'Add a map screen',
        editor: 'designer',
        body:
          'Click **Add Screen** at the top and name it `MapScreen`. On it add:\n\n- **Maps → Map** (Width and Height *Fill parent*)\n- **Maps → Marker** dragged **onto the Map**\n- A Button `btnBack` ("Back")\n- A **TinyDB**. It must have the same **Namespace** as Screen1 (the default `TinyDB1` is fine) to see the same data.\n\nBack on Screen1, open the screen when Find is tapped:',
        blocks: ['when btnFind.Click do', '  call open another screen screenName "MapScreen"'],
      },
      {
        title: 'Drop the pin',
        editor: 'blocks',
        body:
          'Switch the Blocks editor to **MapScreen** using the screen dropdown. When it opens, load the saved spot, move the marker there, and center the map. Use `close screen` to go back.',
        blocks: [
          'when MapScreen.Initialize do',
          '  initialize local lat to call TinyDB1.GetValue tag "carLat" valueIfTagNotThere 0',
          '    initialize local long to call TinyDB1.GetValue tag "carLong" valueIfTagNotThere 0',
          '      if get lat = 0',
          '        set Marker1.Visible to false',
          '      else',
          '        call Marker1.SetLocation latitude get lat longitude get long',
          '        call Map1.PanTo latitude get lat longitude get long zoom 17',
          'when btnBack.Click do',
          '  call close screen',
        ],
      },
      {
        title: 'Field test, export and submit',
        editor: 'phone',
        body:
          'With your teacher\'s OK, save a spot, walk to the other side of the room or the hallway, and open the map. Is the pin where you parked? GPS indoors can be off by 10-50 meters. Write down what you noticed. Export the `.aia` and submit it.',
      },
    ],
    challenge: {
      title: 'Bonus: More sensors',
      body:
        'Turn Find My Car into a walking tool: add a **Pedometer** that counts steps since you parked (reset it in btnPark.Click), and show "Steps from car: N". Or use the **AccelerometerSensor** Shaking event as a hands-free "park here". Show the step count on MapScreen too, passing it through TinyDB.',
    },
    quiz: [
      {
        q: 'Which event gives you a new latitude and longitude?',
        options: [
          'LocationSensor1.LocationChanged',
          'Screen1.Initialize',
          'Map1.Ready',
          'TinyDB1.GetValue',
        ],
        answer: 0,
        explain: 'LocationChanged fires with fresh latitude and longitude whenever the GPS updates.',
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
        explain: 'Screens are like separate rooms. TinyDB is a shared shelf both can reach.',
      },
      {
        q: 'Why check whether LocationSensor1.Latitude = 0 before saving?',
        options: [
          '0 means the phone is at the North Pole',
          '0 usually means there is no GPS fix yet, so saving it would put the pin in the ocean',
          'TinyDB cannot store 0',
          'The Map only accepts negative numbers',
        ],
        answer: 1,
        explain: 'Latitude 0, longitude 0 is in the Atlantic Ocean. Treat it as "no reading yet".',
      },
      {
        q: 'Which block moves the pin to the saved spot?',
        options: [
          'call Marker1.SetLocation latitude longitude',
          'set Map1.Visible to true',
          'call open another screen',
          'call LocationSensor1.Enabled',
        ],
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
      'GPS indoors is unreliable; plan for a quick hallway or courtyard walk, or let students use the Map\'s LocationSensor-free fallback by setting a test latitude/longitude by hand (for example, the school\'s coordinates). The Map component needs internet to load tiles. School networks that block OpenStreetMap tile servers will show a blank grey map, so test before class. Location is personal data: discuss why an app should ask permission and why sharing your live location is a big deal. Students without location permission can still complete the screens + TinyDB part using the AccelerometerSensor or Pedometer alternative from the bonus.',
  },
  {
    id: 'tools-capstone',
    title: 'Capstone: Your Utility App',
    subtitle: 'Solve a real problem for a real person',
    icon: '🛠️',
    track: 'tools',
    concepts: ['User research', 'Requirements', 'Iteration', 'User testing'],
    periods: 6,
    xp: { quiz: 60, build: 300, bonus: 100 },
    project: {
      name: 'Your Original Utility App',
      description:
        'Your company interviews a real user (a teacher, coach, sibling, or classmate), discovers a problem they have, and builds a tool app that solves it: a homework tracker, practice log, lunch-line counter, chore chart, or something nobody has thought of yet.',
    },
    objectives: [
      'Interview a real user and turn what you learn into a problem statement',
      'Write requirements (must-have vs. nice-to-have) and sketch a wireframe',
      'Build in sprints, using TinyDB, multiple screens, procedures and validation',
      'Test with your real user, collect feedback, and iterate',
    ],
    intro:
      'The best tools are not invented at a desk. They come from **listening to people**. Professional product teams interview users, find their frustrations, and design around them. In this capstone your Tool Works company does exactly that. You will find a real person with a real problem, build an app for them, put it in their hands, and improve it based on what they say.',
    vocab: [
      { term: 'User research', def: 'Talking to and watching the people who will use your app to learn what they actually need.' },
      { term: 'Problem statement', def: '"[User] needs a way to [do something] because [reason]."' },
      { term: 'Requirement', def: 'A specific thing the app must do, written so you can test whether it works.' },
      { term: 'Feedback', def: 'What users tell you (or show you) after trying your app. It is fuel for the next version.' },
    ],
    steps: [
      {
        title: 'Find your user',
        body:
          'Choose one real person who is not in your company, such as a teacher, coach, family member, or club leader. Interview them for 5-10 minutes. Good questions:\n\n1. What is something you keep track of or repeat every day or week?\n2. What part of it is annoying or easy to forget?\n3. How do you do it now (paper, memory, another app)?\n\nWrite their answers down. Then write your **problem statement**: *[User] needs a way to [___] because [___].* Put it in your submission notes.',
      },
      {
        title: 'Requirements and wireframe',
        body:
          'Turn the problem into requirements, written so they can be tested ("The user can add a practice session with a date and minutes"). Sort them into **must-have** (your MVP) and **nice-to-have**.\n\nSketch every screen on paper. Your app must include: **TinyDB** (it remembers data), **at least 2 screens**, **at least one procedure**, and **input validation** with conditionals. Get your teacher to initial the plan before coding.',
      },
      {
        title: 'Sprint 1: the MVP',
        editor: 'designer',
        body:
          'Build only the must-haves. Divide the work by screen: each partner owns one screen, then you connect them together. Agree on your TinyDB **tags** first and write them down. A mismatched tag is the #1 multi-screen bug.',
      },
      {
        title: 'Structure your code',
        editor: 'blocks',
        body:
          'Strong tool apps share the same backbone you have used all path long: load in Initialize, validate input, change the data, then call one procedure that saves and refreshes. Make sure your app has this shape:',
        blocks: [
          'when Screen1.Initialize do',
          '  set global records to call TinyDB1.GetValue tag "records" valueIfTagNotThere create empty list',
          '  call saveAndShow',
          'when btnAdd.Click do',
          '  if is empty txtEntry.Text',
          '    call Notifier1.ShowAlert notice "Type something first!"',
          '  else',
          '    call add items to list list get global records item txtEntry.Text',
          '    call saveAndShow',
        ],
      },
      {
        title: 'Test with your real user',
        editor: 'phone',
        body:
          'Put the app in your user\'s hands (or a classmate role-playing them) and give them a real task: "Log yesterday\'s practice." **Do not help.** Watch where they hesitate. Afterward ask: *Would you actually use this? What would make it better?* Write the top 3 pieces of feedback in your notes.',
      },
      {
        title: 'Sprint 2: iterate and ship',
        editor: 'blocks',
        body:
          'Fix the most important feedback first. Then polish: an app **Icon**, clear labels, friendly error messages, and test the "first run" (empty data) and "full list" cases. Close and reopen the app to prove data is saved. Export the `.aia` and submit with your problem statement, requirements, and user feedback.',
      },
    ],
    challenge: {
      title: 'Bonus: Ship it to your user',
      body:
        'Build the **.apk** (Build → Android App), install it on your user\'s device (with their permission), and have them use it for a few days. Add a short "what changed after real use" note, plus one feature they asked for after day one. Include a quote from your user in your notes.',
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
        explain: 'User research replaces guesses with evidence about what is really frustrating people.',
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
        q: 'Your two partners each built a screen. Screen1 saves with tag "log" and Screen2 loads tag "logs". What happens?',
        options: [
          'It works fine',
          'Screen2 always gets valueIfTagNotThere, so the data seems to disappear',
          'App Inventor fixes the tag automatically',
          'The app saves twice',
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
        explain: 'Feedback drives iteration. Find the specific stuck point, fix it, and retest.',
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
      'Plan about six periods: 1 interview + problem statement, 1 requirements + wireframe, 2-3 build sprints, 1 user test + iterate. Line up "client" volunteers in advance (staff, coaches, older students) so every company has a real user, and brief them to give honest feedback. Watch for ideas needing accounts, shared online data, or messaging between phones; steer those toward a single-device MVP. When reviewing, weigh the process evidence in the notes (problem statement, requirements, feedback, changes made) as heavily as the .aia checks. This is the strongest portfolio piece in the course and works well for a showcase night.',
  },
]
