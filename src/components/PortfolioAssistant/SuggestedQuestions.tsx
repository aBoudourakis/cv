import styles from './SuggestedQuestions.module.scss';
import { SUGGESTED_QUESTIONS } from './constants.ts';

interface SuggestedQuestionsProps {
	onSelect: (question: string) => void;
	disabled: boolean;
}

/**
 * Shown before the conversation starts. Each chip behaves exactly like
 * typing the question manually (docs/Clip_bot_specification.md #9).
 */
export default function SuggestedQuestions({ onSelect, disabled }: SuggestedQuestionsProps) {
	return (
		<div className={styles.Suggestions}>
			<p className={styles.SuggestionsLabel}>Suggested questions</p>
			<ul className={styles.SuggestionsList}>
				{SUGGESTED_QUESTIONS.map((question) => (
					<li key={question}>
						<button
							type="button"
							className={styles.SuggestionChip}
							onClick={() => onSelect(question)}
							disabled={disabled}
						>
							{question}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
