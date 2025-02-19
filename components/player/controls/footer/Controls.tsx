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
import { Clock, Languages, Server } from "lucide-react";
import MiniScreenIcon from "@/components/vectors/MiniScreenIcon";
import FullscreenIcon from "@/components/vectors/FullscreenIcon";
import { formatDuration } from "@/lib/utils";
import { videoStoreOptions } from "../../VideoControls";
import { servers } from "@/lib/servers";

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
    languages,
    setLanguages,
    currentLanguage,
    languagesExpanded,
    setCurrentLanguage,
    setLanguagesExpanded,
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
    setServersExpanded(false);
    setQualitiesExpanded(false);
    setLanguagesExpanded(false)
    setCaptionsExpanded(!captionsExpanded);
  };

  const toggleServer = () => {
    setCaptionsExpanded(false);
    setQualitiesExpanded(false);
    setLanguagesExpanded(false)
    setServersExpanded(!serversExpanded);
  };

  const toggleQuality = () => {
    setCaptionsExpanded(false);
    setServersExpanded(false);
    setLanguagesExpanded(false)
    setQualitiesExpanded(!qualitiesExpanded);
  };

  const toggleSettingsDropdown = () => {
    setCaptionsExpanded(false);
    setServersExpanded(false);
    setLanguagesExpanded(false)
    setSettingsExpanded(!settingsExpanded);
  };

  const toggleLanguages = () => {
    setCaptionsExpanded(false);
    setServersExpanded(false);
    setLanguagesExpanded(!languagesExpanded);
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
              <div onClick={toggleServer}>
                <button>
                  <Server /> Server
                </button>
                <span>
                  Server {currentServer + 1} <ArrowLeft />
                </span>
              </div>
              {serversExpanded ? (
                <>
                  <div className="expanded__list">
                    {servers.map((server, serverIndex) => {
                      return (
                        <div
                          onClick={() => {
                            setCurrentServer(serverIndex);
                          }}
                          key={serverIndex}
                        >
                          {serverIndex === currentServer ? (
                            <RadioActive />
                          ) : (
                            <RadioInactive />
                          )}
                          Server {serverIndex + 1}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <></>
              )}
              <div onClick={toggleLanguages}>
                <button>
                  <Languages /> Language
                </button>
                <span>
                  {currentLanguage.name} <ArrowLeft />
                </span>
              </div>
              {languagesExpanded ? (
                <>
                  <div className="expanded__list">
                    {languages.map((language) => {
                      console.log({language, currentLanguage})
                      return (
                        <div
                          onClick={() => {
                            setCurrentLanguage(language);
                          }}
                          key={language.name}
                        >
                          {language.name === currentLanguage.name ? (
                            <RadioActive />
                          ) : (
                            <RadioInactive />
                          )}
                          {language.name}
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
