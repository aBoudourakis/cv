import './App.css'
import 'src/styles/global.scss'
import DesktopLayout from "src/layouts/desktopLayout.tsx";
import PortfolioAssistant from "src/components/PortfolioAssistant/PortfolioAssistant.tsx";

function App() {
	return (
		<div className="app-shell">
			<DesktopLayout/>
			<PortfolioAssistant/>
		</div>
	)
}

export default App
