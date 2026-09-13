// Get the app version from the package.json file
import packageJson from "../../package.json";

export const getAppVersion = () => {
	return packageJson.version;
}

export const getCurrentYear = () => {
	return new Date().getFullYear();
}

/**
 * Formats a duration in seconds as `m:ss` (e.g. 74 -> "1:14"). Used by the
 * Beyond Work music player. Falls back to a neutral placeholder for
 * unavailable/invalid values (NaN, Infinity, negative) instead of ever
 * rendering something like "NaN:NaN".
 */
export const formatDuration = (totalSeconds: number | undefined, fallback = '--:--'): string => {
	if (totalSeconds === undefined || !Number.isFinite(totalSeconds) || totalSeconds < 0) {
		return fallback;
	}

	const wholeSeconds = Math.floor(totalSeconds);
	const minutes = Math.floor(wholeSeconds / 60);
	const seconds = wholeSeconds % 60;

	return `${minutes}:${String(seconds).padStart(2, '0')}`;
}