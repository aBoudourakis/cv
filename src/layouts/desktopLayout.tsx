import styles from './layouts.module.scss';
import {Outlet} from "react-router-dom";
import NavBar from "src/components/core/NavBar/NavBar.tsx";
import Footer from "src/components/core/Footer/Footer.tsx";

export default function DesktopLayout() {
	return (
		<div className={styles.DesktopLayout}>
			<div className={styles.NavBar}>
				<NavBar/>
			</div>
			{/* The stable id is a portal target for full-bleed overlays (e.g. Beyond
			    Work's art lightbox — see ArtWorkLightbox.tsx) that need to cover the
			    page area between the nav and footer without being clipped by an
			    ancestor's own CSS transform (page-entrance animations create a new
			    containing block for position:fixed/absolute descendants). */}
			<div className={styles.Content} id="app-content-region">
				<Outlet/>
			</div>
			<div className={styles.Footer}>
				<Footer/>
			</div>
		</div>
	);
}