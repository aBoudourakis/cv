/**
 * Page-local data for the standalone COVID-19 Shield Cyprus page.
 * Kept separate from presentation (CovidShieldCyprus.tsx) and styling
 * (CovidShieldCyprus.module.scss), mirroring the project's data/component/style
 * separation used elsewhere (see src/assets/values.ts for the Portfolio page).
 */

const IMAGE_BASE_PATH = '/images/covidShieldCyprus/covid-shield-cyprus-';
const TOTAL_IMAGES = 34;
const LOGO_IMAGE_NUMBER = 11;

interface CovidShieldImage {
	number: number;
	src: string;
	width: number;
	height: number;
	alt: string;
}

/** Actual pixel dimensions of every source photograph, used to preserve aspect ratio and avoid layout shift. */
const IMAGE_DIMENSIONS: Record<number, { width: number; height: number }> = {
	1: {width: 900, height: 1600},
	2: {width: 900, height: 1600},
	3: {width: 900, height: 1600},
	4: {width: 1600, height: 900},
	5: {width: 591, height: 1280},
	6: {width: 510, height: 581},
	7: {width: 1062, height: 1099},
	8: {width: 900, height: 1600},
	9: {width: 900, height: 1600},
	10: {width: 900, height: 1600},
	11: {width: 1125, height: 1119},
	12: {width: 900, height: 1600},
	13: {width: 1600, height: 1200},
	14: {width: 1200, height: 1600},
	15: {width: 1200, height: 1600},
	16: {width: 1200, height: 1600},
	17: {width: 1600, height: 1200},
	18: {width: 1200, height: 1600},
	19: {width: 1200, height: 1600},
	20: {width: 720, height: 1280},
	21: {width: 1200, height: 1600},
	22: {width: 901, height: 1600},
	23: {width: 1200, height: 1600},
	24: {width: 1200, height: 1600},
	25: {width: 1600, height: 1200},
	26: {width: 1200, height: 1600},
	27: {width: 1200, height: 1600},
	28: {width: 1200, height: 1600},
	29: {width: 1200, height: 1600},
	30: {width: 1200, height: 1600},
	31: {width: 1200, height: 1600},
	32: {width: 1200, height: 1600},
	33: {width: 960, height: 1280},
	34: {width: 1280, height: 960},
};

/** A small rotation of concise, meaningful descriptions used as alt text — the raw filenames are never exposed to assistive tech. */
const GALLERY_ALT_PHRASES = [
	'COVID-19 Shield Cyprus volunteers 3D printing face shield components',
	'3D-printed face shield frames ready for assembly',
	'Assembling protective face shields by hand',
	'Face shields prepared for distribution to medical staff',
	'Volunteers packaging face shields for delivery',
	'Completed face shields boxed for hospitals and clinics',
	'Close-up of a finished protective face shield',
	'Behind the scenes of the grassroots production process',
];

function imagePath(number: number): string {
	return `${IMAGE_BASE_PATH}${String(number).padStart(2, '0')}.webp`;
}

export const logoImage: CovidShieldImage = {
	number: LOGO_IMAGE_NUMBER,
	src: imagePath(LOGO_IMAGE_NUMBER),
	...IMAGE_DIMENSIONS[LOGO_IMAGE_NUMBER],
	alt: 'COVID-19 Shield Cyprus logo',
};

export const galleryImages: CovidShieldImage[] = Array.from({length: TOTAL_IMAGES}, (_, index) => index + 1)
	.filter((number) => number !== LOGO_IMAGE_NUMBER)
	.map((number, position) => ({
		number,
		src: imagePath(number),
		...IMAGE_DIMENSIONS[number],
		alt: GALLERY_ALT_PHRASES[position % GALLERY_ALT_PHRASES.length],
	}));
