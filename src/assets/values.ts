/** A single rendered portfolio page image, sourced from the converted PDF pages under /public/portfolio. */
export interface PortfolioPageImage {
	/** Structural sequence number — the authoritative order, independent of array position. */
	page: number;
	/** Public-root path to the page image. */
	src: string;
	/** Short internal label, useful for code organisation/future navigation. Not necessarily rendered. */
	title: string;
	/** Accessible description used as the image's alt text. */
	alt: string;
}

/** Original image dimensions (all pages share the same A4-proportioned canvas), used to reserve layout space and avoid shift while images load. */
export const PORTFOLIO_PAGE_ASPECT_RATIO = 1654 / 2339;

/** Single source of truth for the Portfolio page sequence — add/remove/reorder entries here only. */
export const portfolioPagesImages: PortfolioPageImage[] = [
	{
		page: 1,
		src: '/portfolio/athos-work-samples-01.webp',
		title: 'Work Samples 2017 — Cover',
		alt: 'Athos Boudourakis Work Samples 2017 cover page',
	},
	{
		page: 2,
		src: '/portfolio/athos-work-samples-02.webp',
		title: 'Web Engineering',
		alt: 'Web engineering work samples: web applications and commercial websites',
	},
	{
		page: 3,
		src: '/portfolio/athos-work-samples-03.webp',
		title: 'Web Design',
		alt: 'Web design work samples for commercial websites',
	},
	{
		page: 4,
		src: '/portfolio/athos-work-samples-04.webp',
		title: 'Corporate Branding — Print',
		alt: 'Corporate branding work samples: business cards and catalogs',
	},
	{
		page: 5,
		src: '/portfolio/athos-work-samples-05.webp',
		title: 'Corporate Branding — Logo Design',
		alt: 'Corporate branding work samples: logo design',
	},
	{
		page: 6,
		src: '/portfolio/athos-work-samples-06.webp',
		title: '3D Modeling',
		alt: '3D modeling work samples using reference material with custom texturing and materials',
	},
	{
		page: 7,
		src: '/portfolio/athos-work-samples-07.webp',
		title: '3D Modeling — Cultural Heritage',
		alt: '3D modeling work samples: digitalisation of cultural heritage and recreation of real-life objects',
	},
	{
		page: 8,
		src: '/portfolio/athos-work-samples-08.webp',
		title: '3D Modeling — Production Pipeline',
		alt: '3D modeling work samples: modeling from scratch, camera tracking, environment lighting, virtual product representation, sculpting, texturing and lighting',
	},
	{
		page: 9,
		src: '/portfolio/athos-work-samples-09.webp',
		title: 'Digital Drawing',
		alt: 'Digital drawing work samples: pen-tablet drawing, texturing, painting and shading',
	},
	{
		page: 10,
		src: '/portfolio/athos-work-samples-10.webp',
		title: 'Photoshop',
		alt: 'Photoshop work samples: multiple image-source composition and painting effects',
	},
	{
		page: 11,
		src: '/portfolio/athos-work-samples-11.webp',
		title: 'Hand Drawing',
		alt: 'Hand drawing work samples: pencil, acrylic and oil work',
	},
	{
		page: 12,
		src: '/portfolio/athos-work-samples-12.webp',
		title: '3D Animation & Video Editing',
		alt: '3D animation and video editing work samples: camera mapping and visual effects, trailer creation, sound design, green-screen editing and HTML5 encoding',
	},
];