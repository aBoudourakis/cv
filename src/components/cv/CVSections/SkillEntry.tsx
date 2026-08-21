import styles from './CVSections.module.scss';

interface ISkillEntryProps {
	skill: {page?: number, id?: string, label: string, items: string[]} | null;
}

export default function SkillEntry({ skill }: ISkillEntryProps) {
	/** RENDER **/
	if(!skill) return null;

	return (
		<div className={styles.SkillGroup} id={skill.id}>
			<div className={styles.SkillGroupHeader}>
				<span className={styles.SkillAccent}/>
				<h3 className={styles.SkillGroupTitle}>{skill.label}</h3>
			</div>

			<div className={styles.SkillList}>
				{skill.items.map((item, index) => (
					<span key={item} className={styles.SkillItem}>
						{index > 0 && <span className={styles.SkillSeparator}>•</span>}
						{item}
					</span>
				))}
			</div>
		</div>
	);
}
