import {useId} from 'react';
import type {CSSProperties} from 'react';
import styles from './MusicWorkCard.module.scss';
import {LoadingIcon, PauseIcon, PlayIcon} from 'src/components/core/Icons/Icons.tsx';
import {formatDuration} from 'src/utils/helpers.ts';
import type {musicWorkEntry} from '../values';

export type TrackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface TrackPlaybackState {
	status: TrackStatus;
	currentTime: number;
	duration?: number;
}

interface MusicWorkCardProps {
	work: musicWorkEntry;
	/** Playback state for this track — only meaningful while `isActive` is true; a track that has never been the active one is always shown idle at 0:00. */
	playback: TrackPlaybackState;
	isActive: boolean;
	onRequestPlay: (work: musicWorkEntry) => void;
	onSeek: (work: musicWorkEntry, time: number) => void;
}

/**
 * A single, discreet "Music & Composition" entry — title/metadata plus a
 * custom play/pause + seek control built on the native <audio> element owned
 * by the parent MusicWorks section (see MusicWorks.tsx). This component is
 * purely presentational: it renders whatever playback state it's handed and
 * reports intent (play/pause/seek) upward.
 */
export default function MusicWorkCard({work, playback, isActive, onRequestPlay, onSeek}: MusicWorkCardProps) {
	const sliderId = useId();

	const status = isActive ? playback.status : 'idle';
	const currentTime = isActive ? playback.currentTime : 0;
	const duration = isActive ? playback.duration : undefined;

	const isPlaying = status === 'playing';
	const isLoading = status === 'loading';
	const hasDuration = typeof duration === 'number' && Number.isFinite(duration) && duration > 0;
	const progressPercent = hasDuration
		? Math.min(100, Math.max(0, (currentTime / (duration as number)) * 100))
		: 0;

	/** Genre/category and instruments read as one quiet metadata line rather than separate badges. */
	const meta = [work.type, ...(work.instruments ?? [])].filter(Boolean).join(' · ');

	const playPauseLabel = `${isPlaying ? 'Pause' : 'Play'} ${work.title}`;

	return (
		<div className={styles.Card}>
			<button
				type="button"
				className={styles.PlayButton}
				onClick={() => onRequestPlay(work)}
				aria-label={playPauseLabel}
				aria-pressed={isPlaying}
				disabled={!work.file}
			>
				{isLoading ? <LoadingIcon/> : isPlaying ? <PauseIcon/> : <PlayIcon/>}
			</button>

			<div className={styles.Info}>
				<h3 className={styles.Title}>{work.title}</h3>
				{meta && <p className={styles.Meta}>{meta}</p>}
				{work.description && <p className={styles.Description}>{work.description}</p>}

				<div className={styles.ProgressRow}>
					<input
						id={sliderId}
						type="range"
						className={styles.Progress}
						style={{'--progress-percent': `${progressPercent}%`} as CSSProperties}
						min={0}
						max={hasDuration ? duration : 0}
						step={0.1}
						value={hasDuration ? Math.min(currentTime, duration as number) : 0}
						onChange={(event) => onSeek(work, Number(event.target.value))}
						disabled={!hasDuration}
						aria-label={`Seek through ${work.title}`}
						aria-valuetext={`${formatDuration(currentTime)} of ${hasDuration ? formatDuration(duration) : 'unknown duration'}`}
					/>
					<span className={styles.Time}>
						{formatDuration(currentTime)} / {hasDuration ? formatDuration(duration) : '--:--'}
					</span>
				</div>

				{status === 'error' && (
					<p className={styles.ErrorMessage} role="alert">Audio preview could not be loaded.</p>
				)}
			</div>
		</div>
	);
}
