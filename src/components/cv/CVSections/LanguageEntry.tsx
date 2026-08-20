import styles from './CVSections.module.scss';

interface ILanguageEntryProps {
	language: string;
	level: string;
}

export default function LanguageEntry({ language, level }: ILanguageEntryProps) {
  return (
    <div className={styles.LanguageEntry}>
      <div className={styles.Language}>{language}</div>
      <div className={styles.Level}>{level}</div>
    </div>
  );
}