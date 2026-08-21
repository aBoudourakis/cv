import styles from './Portfolio.module.scss';

const portfolioUrl = '/Athos_Work_Samples_2017.pdf';

function Portfolio() {
  return (
    <div className={styles.Portfolio}>
      <div className={styles.Header}>
        {/*<h1>Portfolio</h1>*/}
        <p className={styles.Disclaimer}>
          ⚠ The portfolio below showcases selected work up to 2017. For more recent projects and current professional work, please refer to the CV section and its related project links.
        </p>

        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open PDF ↗
        </a>
      </div>

      <iframe
        src={portfolioUrl}
        title="Athinodoros Boudourakis Portfolio"
        className={styles.PdfViewer}
      />
    </div>
  );
}

export default Portfolio
