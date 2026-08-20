import styles from './CVSections.module.scss';

interface ISkillEntryProps {
	skill: {page?: number, label: string, items: string[]} | null;
}

export default function SkillEntry({ skill }: ISkillEntryProps) {
	/** RENDER **/
	if(!skill) return null;

	return (
		<div className={styles.Skill}>
			<div className={styles.Label}>{skill.label}</div>
			<div className={styles.Items}>
				{skill.items.map((item, index) => (
					<span key={index} className={styles.Item}>{item}</span>
				))}
			</div>
		</div>
	);
}