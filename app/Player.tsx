"use client";

import { useEffect, useRef, useState } from "react";
import PlayIcon from "@/components/vectors/PlayIcon";
import FullscreenIcon from "@/components/vectors/FullscreenIcon";
import PIPIcon from "@/components/vectors/PIPIcon";
import SettingsIcon from "@/components/vectors/SettingsIcon";
import AudioHighIcon from "@/components/vectors/AudioHighIcon";
import SubtitlesIcon from "@/components/vectors/SubtitlesIcon";
import PauseIcon from "@/components/vectors/PauseIcon";
import MiniScreenIcon from "@/components/vectors/MiniScreenIcon";
import AudioMutedIcon from "@/components/vectors/AudioMutedIcon";
import AudioLowIcon from "@/components/vectors/AudioLowIcon";
import Back10S from "@/components/vectors/Back10S";
import Forward10S from "@/components/vectors/Forward10S";
import ArrowLeft from "@/components/vectors/Arrow";
import RadioActive from "@/components/vectors/RadioActive";
import RadioInactive from "@/components/vectors/RadioInactive";
import { formatDuration } from "@/lib/utils";
import Hls from "hls.js";
import Quality from "@/components/vectors/Quality";
import { Clock, Server } from "lucide-react";
import { fetchServer } from "@/lib/fetchServer";

interface PlayerProps {
  autoPlay?: boolean;
  fullscreen?: boolean;
  PIP?: boolean;
  volume?: number;
  muted?: boolean;
  title?: string;
  type: "movie" | "tvShows";
  id: string;
  seasonNo?: number;
  tmdbOrImdbId?: number;
}

export default function Player({
  autoPlay = false,
  fullscreen = false,
  PIP = false,
  volume = 1,
  muted = false,
  title = "Pubg Footage",
  type,
  id,
  seasonNo = undefined,
  tmdbOrImdbId = undefined,
}: PlayerProps) {
  const [m3u8URL, setM3u8URL] = useState();
  const [playing, setPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const [isPIP, setIsPIP] = useState(PIP);
  const [videoVolume, setVideoVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [qualities, setQualities] = useState<string[]>(["Auto"]);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [qualitiesExpanded, setQualitiesExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [captions, setCaptions] = useState([{ lang: "None", url: "" }]);
  const [currentCaption, setCurrentCaption] = useState({
    lang: "None",
    url: "",
  });
  const [serversExpanded, setServersExpanded] = useState(false);
  const [currentServer, setCurrentServer] = useState(0);
  const [captionsExpanded, setCaptionsExpanded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const offset = (duration: number) => {
    if (videoRef.current) videoRef.current.currentTime += duration;
  };

  const toggleSettingsDropdown = () => {
    setSettingsExpanded(!settingsExpanded);
  };

  const toggleQuality = () => {
    setCaptionsExpanded(false);
    setQualitiesExpanded(!qualitiesExpanded);
  };

  const toggleCaptions = () => {
    setQualitiesExpanded(false);
    setCaptionsExpanded(!captionsExpanded);
  };

  useEffect(() => {
    const configureServer = async () => {
      const serverData = await fetchServer(
        type,
        currentServer,
        id,
        seasonNo,
        tmdbOrImdbId
      );

      if (serverData.captions) {
        setCaptions([{ url: "", lang: "None" }, ...serverData.captions]);
      }

      if (serverData.playlistUrl) {
        setM3u8URL(serverData.playlistUrl);
      }
    };
    configureServer();
  }, [id, tmdbOrImdbId, seasonNo, type, currentServer]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    videoRef.current.addEventListener("loadeddata", handleLoadedMetadata);
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current)
      setProgressPercentage(currentTime / videoRef.current.duration);
  }, [videoRef, currentTime]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.play().catch(() => setPlaying(false));
    else videoRef.current.pause();
    videoRef.current.volume = isMuted ? 0 : videoVolume;
  }, [playing, videoVolume, isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPIP)
      videoRef.current.requestPictureInPicture().catch(() => setIsPIP(false));
    else if (document.pictureInPictureElement)
      document.exitPictureInPicture().catch(() => {});
  }, [isPIP]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePlayback = () => { 

  }

  const toggleServer = () => {
    
  }

  useEffect(() => {
    console.log(m3u8URL);
    if (Hls.isSupported() && m3u8URL) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(m3u8URL);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videoRef.current.play();
        setQualities([
          "Auto",
          ...hls.levels.map((level) => level.height.toString()),
        ]);
      });
      hls.on(Hls.Events.LEVEL_SWITCHING, function () {
        console.log("Level switching");
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("Error loading HLS", event, data);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = m3u8URL;
      videoRef.current.addEventListener("loadedmetadata", function () {
        videoRef.current.play();
      });
    }
  }, [m3u8URL]);

  useEffect(() => {
    if (hlsRef.current && currentQuality !== "Auto") {
      const levelIndex = hlsRef.current.levels.findIndex(
        (level) => level.height.toString() === currentQuality
      );
      if (levelIndex !== -1) hlsRef.current.currentLevel = levelIndex;
    }
  }, [hlsRef, currentQuality]);

  useEffect(() => {
    const tracks = videoRef.current.textTracks;

    for (const track of tracks) {
      console.log(track.language);
      track.mode =
        currentCaption.lang === track.language ? "showing" : "disabled";
    }
  }, [currentCaption]);

  return (
    <div className="w-full h-full">
      <div
        className={`video__container ${!playing ? "paused" : ""} ${
          isFullscreen ? "fullscreen" : ""
        }`}
      >
        <div className="video__controls__container">
          <div className="header__video__controls"></div>
          <div className="center__video__controls">
            {isLoading ? (
              <>
                <div className="place-items-center grid w-full h-full">
                  <div className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => offset(-10)} className="back_10s_btn">
                  <Back10S />
                </button>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="play__pause__btn"
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button onClick={() => offset(+10)} className="forward_10s_btn">
                  <Forward10S />
                </button>
              </>
            )}
          </div>

          <div
            className="timeline__container"
            style={
              {
                "--timeline-color": "blue",
                "--progress-position":
                  isLoading && duration === 0 ? 0 : progressPercentage,
              } as React.CSSProperties
            }
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent =
                Math.min(Math.max(0, e.clientX - rect.x), rect.width) /
                rect.width;
              const time = percent * duration;
              setCurrentTime(time);
              setProgressPercentage(percent);

              if (videoRef.current) {
                videoRef.current.currentTime = time;
              }
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent =
                Math.min(Math.max(0, e.clientX - rect.x), rect.width) /
                rect.width;
              const time = percent * duration;
              if ((e.buttons & 1) === 1) {
                setCurrentTime(time);
                setProgressPercentage(percent);

                if (videoRef.current) {
                  videoRef.current.currentTime = time;
                }
              }
            }}
          >
            <div className="timeline">
              <div className="thumb__indicator"></div>
            </div>
          </div>

          <div className="controls">
            <button
              onClick={() => setPlaying(!playing)}
              className="play__pause__btn"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
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
                    "--volume-percentage": `${
                      (isMuted ? 0 : videoVolume) * 100
                    }%`,
                  } as React.CSSProperties
                }
              />
            </div>

            <div className="duration__title__container">
              <div className="duration__container">
                <div className="current__time">
                  {formatDuration(currentTime)}
                </div>
                <span className="hidden md:flex">/</span>
                <div className="hidden md:flex duration__time">
                  {formatDuration(duration)}
                </div>
              </div>
              <span className="hidden md:flex seperator">|</span>
              <div className="title__container">
                <div className="hidden md:flex video__title">{title}</div>
              </div>
            </div>

            <button onClick={() => setIsPIP(!isPIP)} className="pip__btn">
              <PIPIcon />
            </button>

            <div className={`dropdown ${settingsExpanded ? "active" : null}`}>
              <button
                onClick={toggleSettingsDropdown}
                className="settings__btn"
              >
                <SettingsIcon />
              </button>
              <div
                className={`dropdown__menu ${
                  settingsExpanded ? "active" : null
                }`}
              >
                <div className="dropdown__content">
                  <div onClick={toggleQuality}>
                    <button onClick={toggleQuality}>
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
                      1x <ArrowLeft />
                    </span>
                  </div>
                  <div onClick={toggleServer}>
                    <button>
                      <Server /> Server
                    </button>
                    <span>
                      Server {currentServer} <ArrowLeft />
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
                </div>
              </div>
            </div>

            <button onClick={toggleFullscreen} className="mini__full__btn">
              {isFullscreen ? <MiniScreenIcon /> : <FullscreenIcon />}
            </button>
          </div>
        </div>

        <video
          ref={videoRef}
          onClick={() => setPlaying(!playing)}
          onPlaying={() => {
            setIsLoading(false);
          }}
          onWaiting={() => {
            setIsLoading(true);
          }}
        >
          {captions.map((caption) => {
            return caption.lang !== "None" ? (
              <track
                kind="subtitles"
                srcLang={caption.lang}
                src={`http://localhost:3000/api/vtt?vttUrl=${caption.url}`}
              ></track>
            ) : null;
          })}
        </video>
      </div>
    </div>
  );
}
