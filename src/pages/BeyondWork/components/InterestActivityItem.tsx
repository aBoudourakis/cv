import styles from './InterestActivityItem.module.scss';
import InfoPopover from './InfoPopover';
import type {InterestActivity} from '../values';

interface InterestActivityItemProps {
	activity: InterestActivity;
}

/**
 * A single "Interests & Activities" entry: a quiet name/description pair,
 * plus an optional info control (see InfoPopover.tsx) that reveals
 * `activity.more` on demand. InfoPopover itself renders nothing when `more`
 * is empty, so most entries stay exactly two lines.
 */
export default function InterestActivityItem({activity}: InterestActivityItemProps) {
	const {name, description, more} = activity;
	if (!name) return null;

	return (
		<li className={styles.Item}>
			<div className={styles.Heading}>
				<span className={styles.Name}>{name}</span>
				<InfoPopover label={name} more={more}/>
			</div>

			{description && <p className={styles.Description}>{description}</p>}
		</li>
	);
}
