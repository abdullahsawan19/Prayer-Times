import "./App.css";
import Payars from "./components/payars";
import { DarkModeProvider } from "./DarkModeContext";
import { PrayerTimesProvider } from "./PrayerTimesContext";

function App() {
  return (
    <div className="App">
      <DarkModeProvider>
        <PrayerTimesProvider city="Cairo" country="Egypt">
          <Payars />
        </PrayerTimesProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;
