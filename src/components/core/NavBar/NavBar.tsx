import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavBar.module.scss';
import ThemeSwitch from 'src/components/core/ThemeSwitch/ThemeSwitch.tsx';

export default function NavBar() {
	/** CONSTS **/
	const navItems = [
		{ name: 'CV', href: '/CV' },
		{ name: 'Portfolio', href: '/portfolio' },
	];
	const location = useLocation();

	/** If already on the CV page, clicking the brand should scroll to the Profile section instead of re-navigating. **/
	const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (location.pathname.toLowerCase() !== '/cv') return;

		const profileSection = document.getElementById('cv-profile');
		if (!profileSection) return;

		event.preventDefault();
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		profileSection.scrollIntoView({
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			block: 'start',
		});
	};

	/** RENDER **/
	return (
		<header className={styles.SiteHeader}>
			<NavLink
				className={styles.BrandLink}
				to="/CV"
				aria-label="Athinodoros Boudourakis — home"
				onClick={handleBrandClick}
			>
				<span className={styles.BrandWordmark}>
					<span className={styles.BrandNamePart}>Athinodoros</span>
					<img
						className={styles.BrandMonogram}
						src="/images/Monogram_favicon_512.png"
						alt=""
						aria-hidden="true"
					/>
					<span className={styles.BrandNamePart}>Boudourakis</span>
				</span>
				<img
					className={styles.BrandMonogramCompact}
					src="/images/Monogram_favicon_512.png"
					alt=""
					aria-hidden="true"
				/>
			</NavLink>

			<div className={styles.SiteControls}>
				<nav className={styles.SiteNav} aria-label="Main navigation">
					{navItems.map((item) => (
						<NavLink
							key={item.href}
							to={item.href}
							className={({ isActive }) =>
								`${styles.NavItem} ${isActive ? styles.Active : ''}`
							}
						>
							{item.name}
						</NavLink>
					))}
				</nav>

				<span className={styles.ControlsDivider} aria-hidden="true" />

				<ThemeSwitch/>
			</div>
		</header>
	);
}
