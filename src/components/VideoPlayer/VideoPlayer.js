import React, { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';
import video360p from '../../assests/video_360p.mp4'
import video480p from '../../assests/video_480p.mp4'
import video720p  from "../../assests/video_720p.mp4"
import video1080p from  "../../assests/video_1080p.mp4"
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SettingsIcon from '@mui/icons-material/Settings';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [resolution, setResolution] = useState('assets/video_360p.mp4');
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const updateTimeline = () => {
      setCurrentTime(video.currentTime);
    };

    const handleMetadataLoaded = () => {
      setTotalTime(video.duration);
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTimeline);
    video.addEventListener('loadedmetadata', handleMetadataLoaded);

    return () => {
      video.removeEventListener('timeupdate', updateTimeline);
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleTimelineInteraction = (event) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    videoRef.current.currentTime = newTime;
  };

  const handleTimelineMouseDown = (event) => {
    handleTimelineInteraction(event);
    document.addEventListener('mousemove', handleTimelineMouseMove);
    document.addEventListener('mouseup', handleTimelineMouseUp);
  };

  const handleTimelineMouseMove = (event) => {
    handleTimelineInteraction(event);
  };

  const handleTimelineMouseUp = () => {
    document.removeEventListener('mousemove', handleTimelineMouseMove);
    document.removeEventListener('mouseup', handleTimelineMouseUp);
  };

  const handleTimelineTouchStart = (event) => {
    handleTimelineInteraction(event.touches[0]);
    document.addEventListener('touchmove', handleTimelineTouchMove);
    document.addEventListener('touchend', handleTimelineTouchEnd);
  };

  const handleTimelineTouchMove = (event) => {
    handleTimelineInteraction(event.touches[0]);
  };

  const handleTimelineTouchEnd = () => {
    document.removeEventListener('touchmove', handleTimelineTouchMove);
    document.removeEventListener('touchend', handleTimelineTouchEnd);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    videoRef.current.currentTime -= 10; // Rewind by 10 seconds
  };

  const handleFastForward = () => {
    videoRef.current.currentTime += 10; // Fast forward by 10 seconds
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleResolutionChange = (e) => {
    setResolution(e.target.value);
    videoRef.current.src = e.target.value;
    videoRef.current.play();
  };

  const handleSpeedChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
    videoRef.current.playbackRate = parseFloat(e.target.value);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handlePictureInPicture = () => {
    videoRef.current.requestPictureInPicture();
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="video-container paused" data-volume-level="up" onClick={() => setIsSettingsOpen(false)}>
      <video
        className="video"
        ref={videoRef}
        src={video360p}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
      >
        Your browser does not support the video tag.
      </video>

      <div className="video-controls-container">
        <div className="timeline-container">
          <div
            className="timeline"
            ref={timelineRef}
            onMouseDown={handleTimelineMouseDown}
            onTouchStart={handleTimelineTouchStart}
          >
            <div
              className="progress-bar"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div
              className="thumb-indicator"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
            </div>
          </div>
        </div>
        <div className="controls">
          <button className="rewind3x" onClick={handleRewind}>
            <span className="material-symbols-outlined">fast_rewind</span>
          </button>
          <button className="play-pause-button" onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </button>
          <button className="fast-forward2x" onClick={handleFastForward}>
            <span className="material-symbols-outlined">fast_forward</span>
          </button>
          <div className="volume-containeer">
            <button className="volume" onClick={toggleMute}>
              {isMuted ? (
                <VolumeOffIcon />
              ) : volume > 0.5 ? (
                <VolumeUpIcon />
              ) : (
                <VolumeDownIcon />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="any"
              value={volume}
              className="volume-slider"
              onChange={handleVolumeChange}
            />
          </div>
          <div className="duration-containeer">
            <div className="current-time">{formatTime(currentTime)}</div> /{' '}
            <div className="total-time">{formatTime(totalTime)}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); toggleSettingsMenu(); }} ref={settingsRef}>
            <SettingsIcon />
          </button>
          <div className={`settings-menu ${isSettingsOpen ? 'open' : 'closed'}`}>
            <div onClick={(e) => e.stopPropagation()}>
              <label htmlFor="resolutionSelect">Resolution:</label>
              <select
                 id="resolutionSelect"
                 className="resolution-selector"
                 onChange={handleResolutionChange}
                 value={resolution}
              >
                <option value={video360p}>360p</option>
                <option value={video480p}>480p</option>
                <option value={video720p}>720p</option>
                <option value={video1080p}>1080p</option>
              </select>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <label htmlFor="speedSelect">Speed:</label>
              <select id="speedSelect" onChange={handleSpeedChange} value={playbackRate}>
                <option value="0.2">0.2x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>
          <button className="picture-in-picture-btn" onClick={handlePictureInPicture}>
            <PictureInPictureAltIcon />
          </button>
          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            <FullscreenIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
