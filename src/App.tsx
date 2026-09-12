import './App.css'
import 'src/styles/global.scss'
import DesktopLayout from "src/layouts/desktopLayout.tsx";
import PortfolioAssistant from "src/components/PortfolioAssistant/PortfolioAssistant.tsx";
import { useViewportHeight } from "src/utils/useViewportHeight.ts";

function App() {
	useViewportHeight();

	return (
		<div className="app-shell">
			<DesktopLayout/>
			<PortfolioAssistant/>
		</div>
	)
}

export default App
