import {NavLink} from "react-router-dom";

export default function NavBar() {
	/** CONSTS **/
	const navItems = [
		{name: 'CV', href: '/'},
		{name: 'Portfolio', href: '/portfolio'},
	];

	/** RENDER **/
	return (
		<header className="site-header">
			<NavLink className="brand-link" to="/">
				Athinodoros
				<img src="images/Monogram_favicon_512.png" alt="Athos CV Logo" height={'48px'}/>
				Boudourakis
			</NavLink>
			<nav className="site-nav" aria-label="Main navigation">
				{
					navItems.map((item) => (
						<NavLink key={item.name} to={item.href}>{item.name}</NavLink>
					))
				}
			</nav>
		</header>
	);
}