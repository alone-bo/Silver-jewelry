import { useEffect, useRef, useState } from 'react'
import { cx } from '../lib/format'
import { PauseIcon, PlayIcon, VolumeIcon, VolumeOffIcon } from './Icons'
import poster from '@/assets/videos/silver-making-poster.jpg'
import film from '@/assets/videos/silver-making.mp4'

/**
 * Silent, looping atelier film. Starts muted (browser autoplay rules) with a
 * speaker control that switches on the recorded hammering sound, plus a
 * play/pause control and a loop hint.
 */
export function HeroVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      video.pause()
      setPlaying(false)
      return
    }
    video.play().catch(() => setPlaying(false))
  }, [])

  const toggleSound = async () => {
    const video = videoRef.current
    if (!video) return
    if (muted) {
      video.muted = false
      video.volume = 0.9
      try {
        await video.play()
        setPlaying(true)
      } catch {
        video.muted = true
        setMuted(true)
        return
      }
      setMuted(false)
    } else {
      video.muted = true
      setMuted(true)
    }
  }

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try {
        await video.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <div className={cx('relative overflow-hidden bg-ink', className)}>
      <video
        ref={videoRef}
        className={cx('hero-video h-full w-full object-cover transition-opacity duration-700', started ? 'opacity-100' : 'opacity-0')}
        src={film}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="A silversmith hammering a silver vessel into shape — silent loop"
        onPlaying={() => {
          setPlaying(true)
          setStarted(true)
        }}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      />

      {/* Cover frame — holds until the film actually starts, then fades away */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className={cx(
          'hero-video pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
          started ? 'opacity-0' : 'opacity-100',
        )}
      />

      {/* Sound toggle */}

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-3 pt-14 md:p-4 md:pt-16">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause the film' : 'Play the film'}
          className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center border border-ivory/45 bg-ink/35 text-ivory backdrop-blur-sm transition-colors hover:border-ivory hover:bg-ivory hover:text-ink"
        >
          {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? 'Sound on — play hammering audio' : 'Sound off — mute hammering audio'}
          className="pointer-events-auto absolute bottom-3 right-3 z-10 flex cursor-pointer items-center gap-2 border border-ivory/45 bg-ink/45 px-3 py-2 text-[10px] font-medium tracking-[0.16em] text-ivory uppercase backdrop-blur-sm transition-colors hover:border-ivory hover:bg-ivory hover:text-ink md:bottom-4 md:right-4"
        >
          {muted ? <VolumeOffIcon size={15} /> : <VolumeIcon size={15} />}
          <span>{muted ? 'Sound on' : 'Sound off'}</span>
        </button>
      </div>
    </div>
  )
}
