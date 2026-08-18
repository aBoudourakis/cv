// Get the app version from the package.json file
import packageJson from "../../package.json";

export const getAppVersion = () => {
	return packageJson.version;
}

export const getCurrentYear = () => {
	return new Date().getFullYear();
}