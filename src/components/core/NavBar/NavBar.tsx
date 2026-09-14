import { Fragment } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavBar.module.scss';
import ThemeSwitch from 'src/components/core/ThemeSwitch/ThemeSwitch.tsx';
import WorkInProgressBadge from 'src/components/core/WorkInProgressBadge/WorkInProgressBadge.tsx';

export default function NavBar() {
	/** CONSTS **/
	const navItems: { name: string; href: string; secondary?: boolean; wip?: boolean }[] = [
		{ name: 'CV', href: '/CV' },
		{ name: 'Portfolio', href: '/portfolio' },
		{ name: 'Beyond Work', href: '/beyond-work', secondary: true, wip: true },
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
						src="/images/Monogram_favicon_128.webp"
						alt=""
						aria-hidden="true"
					/>
					<span className={styles.BrandNamePart}>Boudourakis</span>
				</span>
				<img
					className={styles.BrandMonogramCompact}
					src="/images/Monogram_favicon_128.webp"
					alt=""
					aria-hidden="true"
				/>
			</NavLink>

			<div className={styles.SiteControls}>
				<nav className={styles.SiteNav} aria-label="Main navigation">
					{navItems.map((item) => {
						const navLink = (
							<NavLink
								to={item.href}
								className={({ isActive }) =>
									[
										styles.NavItem,
										item.secondary ? styles.NavItemSecondary : '',
										isActive ? styles.Active : '',
									].filter(Boolean).join(' ')
								}
							>
								{item.name}
							</NavLink>
						);

						/** The WIP badge is a real <button> — it can't nest inside the NavLink's own <a>,
						 *  so it renders as a sibling wrapped alongside it, only for items that need one. */
						if (!item.wip) {
							return <Fragment key={item.href}>{navLink}</Fragment>;
						}

						return (
							<span className={styles.NavItemWrap} key={item.href}>
								{navLink}
								<WorkInProgressBadge
									variant="short"
									label={`${item.name} status: Work in Progress`}
									align="end"
								/>
							</span>
						);
					})}
				</nav>

				<span className={styles.ControlsDivider} aria-hidden="true" />

				<ThemeSwitch/>
			</div>
		</header>
	);
}
