import './App.css'
import 'src/styles/global.scss'
import DesktopLayout from "src/layouts/desktopLayout.tsx";

function App() {
	return (
		<div className="app-shell">
			<DesktopLayout/>
		</div>
	)
}

export default App
