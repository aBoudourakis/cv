import { NavLink, Outlet } from 'react-router-dom'
import './App.css'
import 'src/styles/global.scss'
import ThemeSwitch from "src/components/core/ThemeSwitch/ThemeSwitch.tsx";
import Footer from "src/components/core/Footer/Footer.tsx";

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand-link" to="/">
          Athinodoros
          <img src="images/Monogram_favicon_512.png" alt="Athos CV Logo" height={'48px'}/>
          Boudourakis
        </NavLink>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/">CV</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
        </nav>
      </header>
      <main className="route-content">
        <Outlet />
      </main>
      <Footer />
      <ThemeSwitch />
    </div>
  )
}

export default App
