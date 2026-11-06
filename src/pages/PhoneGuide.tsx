import { APP_INVENTOR_URL } from '../components/Layout'

export function PhoneGuide() {
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <h1>📱 Connect your phone</h1>
      <p className="muted">
        You build apps in MIT App Inventor, which opens in its own tab, and test them live on a real phone with the free <strong>MIT AI2 Companion</strong> app.
        AppVenture holds your lessons, quizzes, XP and submissions. Keep both tabs open side by side.
      </p>

      <div className="grid cols-2">
        <div className="card">
          <h3>Option 1 · AI Companion over Wi-Fi (best)</h3>
          <ol className="small" style={{ paddingLeft: '1.2em' }}>
            <li>Install <strong>MIT AI2 Companion</strong> from the Google Play Store or Apple App Store.</li>
            <li>Connect your phone to the <strong>same Wi-Fi network</strong> as your computer.</li>
            <li>
              In <a href={APP_INVENTOR_URL} target="_blank" rel="noreferrer">App Inventor</a>, open your project and choose <strong>Connect → AI Companion</strong>.
            </li>
            <li>In the Companion app, tap <strong>Scan QR code</strong> (or type the 6-letter code).</li>
            <li>Your app appears on the phone. Every change you make in the Designer or Blocks updates instantly.</li>
          </ol>
        </div>
        <div className="card">
          <h3>Option 2 · Install the app (.apk)</h3>
          <p className="small">
            If live connection is blocked on school Wi-Fi, choose <strong>Build → Android App (.apk)</strong> in App Inventor and scan the QR code it
            shows to download and install your app. It doesn't update live, so rebuild after changes. (Android only.)
          </p>
          <h3>Option 3 · Emulator or USB</h3>
          <p className="small" style={{ margin: 0 }}>
            With the aiStarter helper installed on the computer, <strong>Connect → Emulator</strong> shows a phone on screen, and <strong>Connect → USB</strong>{' '}
            works with an Android phone plugged in. Ask your teacher if these are set up.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>🔧 Troubleshooting</h3>
        <ul className="small" style={{ paddingLeft: '1.2em' }}>
          <li>
            <strong>Stuck "connecting"?</strong> Choose <strong>Connect → Reset Connection</strong>, close the Companion completely, and try again.
          </li>
          <li>
            <strong>Says the Companion is out of date?</strong> Update it from the app store. App Inventor and the Companion versions must match.
          </li>
          <li>
            <strong>Works at home but not at school?</strong> Some school networks block devices from talking to each other. Use Option 2, or ask your teacher.
          </li>
          <li>
            <strong>iPhone?</strong> The iOS Companion supports most components. A few (some sensors, sharing and file features) behave differently. If something
            doesn't work on iOS, test it on an Android phone or the emulator.
          </li>
          <li>
            <strong>No sound?</strong> Check the phone isn't on silent and the volume is up. TextToSpeech and Sound use the media volume.
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>❓ Why doesn't App Inventor open inside AppVenture?</h3>
        <p className="small" style={{ margin: 0 }}>
          App Inventor is MIT's own website, with its own Google sign-in and its own connection to your phone. Browsers don't allow that kind of site to be
          embedded inside another one, so we open it in a new tab. You still get the full App Inventor and live phone testing, and AppVenture checks your
          work when you upload the exported <code>.aia</code> project file.
        </p>
      </div>
    </div>
  )
}
