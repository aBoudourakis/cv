import styles from './layouts.module.scss';
import {Outlet} from "react-router-dom";
import NavBar from "src/components/core/NavBar/NavBar.tsx";

export default function DesktopLayout() {
	return (
		<div className={styles.DesktopLayout}>
			<div className={styles.NavBar}>
				<NavBar />
			</div>
			<div className={styles.Content}>
			<Outlet />
			</div>
		</div>
	);
}