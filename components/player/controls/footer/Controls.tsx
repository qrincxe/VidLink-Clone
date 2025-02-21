import PlayIcon from "@/components/vectors/PlayIcon";
import PauseIcon from "@/components/vectors/PauseIcon";
import AudioMutedIcon from "@/components/vectors/AudioMutedIcon";
import AudioHighIcon from "@/components/vectors/AudioHighIcon";
import AudioLowIcon from "@/components/vectors/AudioLowIcon";
import PIPIcon from "@/components/vectors/PIPIcon";
import SettingsIcon from "@/components/vectors/SettingsIcon";
import SubtitlesIcon from "@/components/vectors/SubtitlesIcon";
import ArrowLeft from "@/components/vectors/Arrow";
import RadioActive from "@/components/vectors/RadioActive";
import RadioInactive from "@/components/vectors/RadioInactive";
import Quality from "@/components/vectors/Quality";
import { Clock, CloudIcon, Server } from "lucide-react";
import MiniScreenIcon from "@/components/vectors/MiniScreenIcon";
import FullscreenIcon from "@/components/vectors/FullscreenIcon";
import { formatDuration } from "@/lib/utils";
import { videoStoreOptions } from "../../VideoControls";

export default function Footer({ videoStore }: videoStoreOptions) {
  const {
    isPlaying,
    duration,
    videoVolume,
    isMuted,
    currentTime,
    setIsPlaying,
    setIsMuted,
    captions,
    qualities,
    settingsExpanded,
    qualitiesExpanded,
    captionsExpanded,
    currentQuality,
    setCurrentQuality,
    currentCaption,
    setCurrentCaption,
    isFullscreen,
    setIsFullscreen,
    isPIP,
    setIsPIP,
    currentServer,
    setVideoVolume,
    setQualitiesExpanded,
    setCaptionsExpanded,
    setSettingsExpanded,
    serversExpanded,
    setCurrentServer,
    setServersExpanded,
    playbackSpeed,
    setPlaybackSpeed,
    servers,
  } = videoStore;

  const togglePlayback = () => {
    switch (playbackSpeed) {
      case 0.5:
        setPlaybackSpeed(1);
        break;
      case 1:
        setPlaybackSpeed(1.25);
        break;
      case 1.25:
        setPlaybackSpeed(1.5);
        break;
      case 1.5:
        setPlaybackSpeed(2);
        break;
      case 2:
        setPlaybackSpeed(0.5);
        break;
      default:
        setPlaybackSpeed(1);
    }
  };

  const toggleCaptions = () => {
    setQualitiesExpanded(false);
    setCaptionsExpanded(!captionsExpanded);
  };

  const toggleServers = () => {
    setCaptionsExpanded(false);
    setQualitiesExpanded(false);
    setSettingsExpanded(false);
    setServersExpanded(!serversExpanded);
  };

  const toggleQuality = () => {
    setCaptionsExpanded(false);
    setQualitiesExpanded(!qualitiesExpanded);
  };

  const toggleSettingsDropdown = () => {
    setCaptionsExpanded(false);
    setSettingsExpanded(!settingsExpanded);
  };

  return (
    <>
      <div className="controls">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="play__pause__btn"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="volume__container">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="volume__button"
          >
            {isMuted || videoVolume === 0 ? (
              <AudioMutedIcon />
            ) : videoVolume > 0.5 ? (
              <AudioHighIcon />
            ) : (
              <AudioLowIcon />
            )}
          </button>
          <input
            className="hidden md:flex volume__slider"
            type="range"
            min="0"
            max="1"
            step="any"
            value={isMuted ? 0 : videoVolume}
            onChange={(e) => setVideoVolume(Number(e.target.value))}
            style={
              {
                "--volume-percentage": `${(isMuted ? 0 : videoVolume) * 100}%`,
              } as React.CSSProperties
            }
          />
        </div>

        <div className="duration__title__container">
          <div className="duration__container">
            <div className="current__time">{formatDuration(currentTime)}</div>
            <span className="hidden md:flex">/</span>
            <div className="hidden md:flex duration__time">
              {formatDuration(duration)}
            </div>
          </div>
          <span className="hidden md:flex seperator">|</span>
          <div className="title__container">
            <div className="hidden md:flex video__title"></div>
          </div>
        </div>

        <button onClick={() => setIsPIP(!isPIP)} className="pip__btn">
          <PIPIcon />
        </button>
        <div
          onClick={toggleServers}
          className={`dropdown ${serversExpanded ? "active" : null}`}
        >
          <button className="settings__btn">
            <CloudIcon />
          </button>
          <div
            className={`dropdown__menu ${serversExpanded ? "active" : null}`}
          >
            <div className="dropdown__content">
              {serversExpanded ? (
                <>
                  <div className="expanded__list">
                    {servers
                      // .sort(
                      //   (serverA, serverB) => serverA.number - serverB.number
                      // )
                      .map((server) => {
                        return (
                          <div
                            onClick={() => {
                              setCurrentServer(server);
                            }}
                            key={server.id}
                          >
                            {server.id === currentServer.id ? (
                              <RadioActive />
                            ) : (
                              <RadioInactive />
                            )}
                            {server.language} - {server.number}
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className={`dropdown ${settingsExpanded ? "active" : null}`}>
          <button onClick={toggleSettingsDropdown} className="settings__btn">
            <SettingsIcon />
          </button>
          <div
            className={`dropdown__menu ${settingsExpanded ? "active" : null}`}
          >
            <div className="dropdown__content">
              <div onClick={toggleQuality}>
                <button>
                  <Quality /> Quality
                </button>
                <span>
                  {Number.isNaN(Number(currentQuality))
                    ? currentQuality
                    : `${currentQuality}p`}
                  <ArrowLeft />
                </span>
              </div>
              {qualitiesExpanded ? (
                <>
                  <div className="expanded__list">
                    {qualities.map((quality) => {
                      return (
                        <div
                          onClick={() => {
                            setCurrentQuality(quality);
                          }}
                          key={quality}
                        >
                          {quality === currentQuality ? (
                            <RadioActive />
                          ) : (
                            <RadioInactive />
                          )}
                          {Number.isNaN(Number(quality))
                            ? quality
                            : `${quality}p`}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}

              <div onClick={toggleCaptions}>
                <button>
                  <SubtitlesIcon /> Captions
                </button>
                <span>
                  {currentCaption.lang} <ArrowLeft />
                </span>
              </div>
              {captionsExpanded ? (
                <>
                  <div className="expanded__list">
                    {captions.map((caption) => {
                      return (
                        <div
                          onClick={() => {
                            setCurrentCaption(caption);
                          }}
                          key={caption.url}
                        >
                          {caption.url === currentCaption?.url ? (
                            <RadioActive />
                          ) : (
                            <RadioInactive />
                          )}
                          {caption.lang}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <></>
              )}
              <div onClick={togglePlayback}>
                <button>
                  <Clock /> Playback
                </button>
                <span>
                  {playbackSpeed}x <ArrowLeft />
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="mini__full__btn"
        >
          {isFullscreen ? <MiniScreenIcon /> : <FullscreenIcon />}
        </button>
      </div>
    </>
  );
}
