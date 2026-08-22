import styles from './Portfolio.module.scss';
import {ExternalLinkIcon} from 'src/components/core/Icons/Icons.tsx';
import {portfolioPagesImages, PORTFOLIO_PAGE_ASPECT_RATIO} from 'src/assets/values.ts';

const portfolioPdfUrl = '/Athos_Work_Samples_2017.pdf';

function Portfolio() {
	const pages = [...portfolioPagesImages].sort((a, b) => a.page - b.page);

	return (
		<div className={styles.Portfolio}>
			<div className={styles.ScrollArea}>
				<header className={styles.PortfolioHeader}>
					<div className={styles.PortfolioHeaderContent}>
						<div className={styles.HeaderRow}>
							<div>
								<p className={styles.Eyebrow}>Portfolio</p>
								<h1 className={styles.Title}>Selected Work Samples</h1>
							</div>

							<a className={styles.OpenLink} href={portfolioPdfUrl} target="_blank" rel="noopener noreferrer">
								Open PDF
								<ExternalLinkIcon/>
							</a>
						</div>

						<p className={styles.Disclaimer}>
							Selected work up to 2017 — more recent professional work is referenced in the CV.
						</p>
					</div>
				</header>

				<div className={styles.PortfolioPages}>
					{pages.map((portfolioPage, index) => (
						<figure className={styles.PortfolioPage} key={portfolioPage.page}>
							<img
								className={styles.PortfolioPageImage}
								src={portfolioPage.src}
								alt={portfolioPage.alt}
								width={1654}
								height={2339}
								style={{aspectRatio: PORTFOLIO_PAGE_ASPECT_RATIO}}
								loading={index === 0 ? 'eager' : 'lazy'}
								fetchPriority={index === 0 ? 'high' : 'auto'}
							/>
						</figure>
					))}
				</div>
			</div>
		</div>
	);
}

export default Portfolio
