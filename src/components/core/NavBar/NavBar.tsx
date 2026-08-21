import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.scss';

export default function NavBar() {
	/** CONSTS **/
	const navItems = [
		{ name: 'CV', href: '/' },
		{ name: 'Portfolio', href: '/portfolio' },
	];

	/** RENDER **/
	return (
		<header className={styles.SiteHeader}>
			<NavLink className={styles.BrandLink} to="/">
				Athinodoros

				<img
					className={styles.BrandLogo}
					src="/images/Monogram_favicon_512.png"
					alt="Athos CV Logo"
				/>

				Boudourakis
			</NavLink>

			<nav className={styles.SiteNav} aria-label="Main navigation">
				{navItems.map((item) => (
					<NavLink
						key={item.href}
						to={item.href}
						end={item.href === '/'}
						className={({ isActive }) =>
							`${styles.NavItem} ${isActive ? styles.Active : ''}`
						}
					>
						{item.name}
					</NavLink>
				))}
			</nav>
		</header>
	);
}