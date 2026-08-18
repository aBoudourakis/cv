import './footer.css'
import {getAppVersion, getCurrentYear} from "src/utils/helpers.ts";

export default function Footer() {
	/** RENDER **/
	return (
		<footer className="footer">
			<p>© {getCurrentYear()} Athinodoros Boudourakis. All rights reserved.</p>
			<p className="version">v.{getAppVersion()}</p>
		</footer>
	);
}