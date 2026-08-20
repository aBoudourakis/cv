import './App.css'
import 'src/styles/global.scss'
import ThemeSwitch from "src/components/core/ThemeSwitch/ThemeSwitch.tsx";
import DesktopLayout from "src/layouts/desktopLayout.tsx";

function App() {
  return (
    <div className="app-shell">
      <DesktopLayout />
      <ThemeSwitch />
    </div>
  )
}

export default App
