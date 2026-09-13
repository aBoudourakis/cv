import {useCallback, useRef, useState} from 'react';
import styles from './MusicWorks.module.scss';
import MusicWorkCard, {type TrackPlaybackState} from './MusicWorkCard';
import {musicWorks, musicWorksIntro, type musicWorkEntry} from '../values';

type TrackStates = Record<string, TrackPlaybackState>;

const IDLE_STATE: TrackPlaybackState = {status: 'idle', currentTime: 0};

/**
 * "Music & Composition" — a short audio showcase built on a single shared
 * <audio> element: only one track can ever be playing, so one element
 * coordinated here is simpler than one per card (see the "Audio-player
 * architecture" note in the implementation summary). It stays functionally
 * available but visually hidden — the visible UI is each MusicWorkCard's own
 * play/pause + seek control.
 *
 * Nothing downloads until a visitor presses play: the element uses
 * preload="none" and only receives a `src` inside handleRequestPlay, in
 * direct response to that user gesture.
 */
export default function MusicWorks() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
	const [trackStates, setTrackStates] = useState<TrackStates>({});

	const patchTrackState = useCallback((id: string, patch: Partial<TrackPlaybackState>) => {
		setTrackStates((prev) => ({
			...prev,
			[id]: {...IDLE_STATE, ...prev[id], ...patch},
		}));
	}, []);

	const handlePlaybackError = useCallback((id: string, error: unknown) => {
		// Development-useful, but never surfaced verbatim in the UI — see the
		// track's own "Audio preview could not be loaded." message instead.
		console.error(`Beyond Work: could not play music track "${id}"`, error);
		patchTrackState(id, {status: 'error'});
	}, [patchTrackState]);

	const handleRequestPlay = useCallback((work: musicWorkEntry) => {
		const audio = audioRef.current;
		if (!audio || !work.file) return;

		const isActive = activeTrackId === work.id;
		const status = trackStates[work.id]?.status ?? 'idle';

		/** Clicking the currently-playing track pauses it in place — the native 'pause' event (below) updates its UI. */
		if (isActive && status === 'playing') {
			audio.pause();
			return;
		}

		/** Resuming a track that's already loaded on the shared element, just paused. */
		if (isActive && status === 'paused') {
			audio.play().catch((error) => handlePlaybackError(work.id, error));
			return;
		}

		/** Switching tracks (or starting a fresh/previously-errored one): record where the
		 *  outgoing track was left (see handleLoadedMetadata, which restores this on replay),
		 *  then load and play the requested one. Reassigning `src` already stops the previous
		 *  resource, so no separate pause() call is needed here. */
		if (activeTrackId && activeTrackId !== work.id) {
			patchTrackState(activeTrackId, {status: 'paused', currentTime: audio.currentTime});
		}

		setActiveTrackId(work.id);
		patchTrackState(work.id, {status: 'loading'});

		audio.src = work.file;
		audio.load();
		audio.play().catch((error) => handlePlaybackError(work.id, error));
	}, [activeTrackId, trackStates, patchTrackState, handlePlaybackError]);

	const handleSeek = useCallback((work: musicWorkEntry, time: number) => {
		const audio = audioRef.current;
		if (!audio || activeTrackId !== work.id) return;

		audio.currentTime = time;
		patchTrackState(work.id, {currentTime: time});
	}, [activeTrackId, patchTrackState]);

	const handleTimeUpdate = useCallback(() => {
		const audio = audioRef.current;
		if (!audio || !activeTrackId) return;
		patchTrackState(activeTrackId, {currentTime: audio.currentTime});
	}, [activeTrackId, patchTrackState]);

	/** Also restores the outgoing-track position captured in handleRequestPlay, if this track had one — setting currentTime only "sticks" reliably once metadata for the newly-assigned src has loaded. */
	const handleLoadedMetadata = useCallback(() => {
		const audio = audioRef.current;
		if (!audio || !activeTrackId) return;

		const resumeAt = trackStates[activeTrackId]?.currentTime;
		if (resumeAt && Number.isFinite(resumeAt) && resumeAt > 0 && resumeAt < audio.duration) {
			audio.currentTime = resumeAt;
		}

		patchTrackState(activeTrackId, {duration: audio.duration});
	}, [activeTrackId, trackStates, patchTrackState]);

	const handlePlay = useCallback(() => {
		if (!activeTrackId) return;
		patchTrackState(activeTrackId, {status: 'playing'});
	}, [activeTrackId, patchTrackState]);

	const handlePause = useCallback(() => {
		const audio = audioRef.current;
		if (!audio || !activeTrackId) return;
		// onEnded (below) fires immediately after and takes precedence when playback
		// actually reached the end, so this only "sticks" for a genuine user pause.
		patchTrackState(activeTrackId, {status: 'paused', currentTime: audio.currentTime});
	}, [activeTrackId, patchTrackState]);

	const handleEnded = useCallback(() => {
		if (!activeTrackId) return;
		patchTrackState(activeTrackId, {status: 'idle', currentTime: 0});
	}, [activeTrackId, patchTrackState]);

	const handleAudioError = useCallback(() => {
		if (!activeTrackId) return;
		handlePlaybackError(activeTrackId, audioRef.current?.error);
	}, [activeTrackId, handlePlaybackError]);

	return (
		<section className={styles.MusicWorks} aria-labelledby="beyond-work-music">
			<h2 className={styles.SectionHeading} id="beyond-work-music">Music &amp; Composition</h2>
			<p className={styles.SectionIntro}>{musicWorksIntro}</p>

			<div className={styles.TrackList}>
				{musicWorks.map((work) => (
					<MusicWorkCard
						key={work.id}
						work={work}
						isActive={activeTrackId === work.id}
						playback={trackStates[work.id] ?? IDLE_STATE}
						onRequestPlay={handleRequestPlay}
						onSeek={handleSeek}
					/>
				))}
			</div>

			{/* Shared player: visually hidden but not display:none, kept mounted for the page's
			    lifetime so switching tracks is just a `src` change, not a mount/unmount. */}
			<audio
				ref={audioRef}
				className={styles.HiddenAudio}
				preload="none"
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				onPlay={handlePlay}
				onPause={handlePause}
				onEnded={handleEnded}
				onError={handleAudioError}
			/>
		</section>
	);
}
