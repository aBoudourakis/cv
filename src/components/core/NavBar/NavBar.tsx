export default function NavBar() {
	/** CONSTS **/
	const navItems = [
		{ name: 'CV', href: '/' },
		{ name: 'Portfolio', href: '/portfolio' },
	];

	/** RENDER **/
	return (
		<nav className="navbar">
			<ul className="nav-list">
				{navItems.map((item) => (
					<li key={item.name} className="nav-item">
						<a href={item.href} className="nav-link">
							{item.name}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}