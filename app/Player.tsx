"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { fetchServer } from "@/lib/fetchServer";
import VideoControls from "@/components/player/VideoControls";
import { useVideoStore } from "@/components/state";

interface PlayerProps {
  type: "movie" | "tvShows";
  id: string;
  seasonNo?: number;
  tmdbOrImdbId?: number;
}

export default function Player({
  type,
  id,
  seasonNo = undefined,
  tmdbOrImdbId = undefined,
}: PlayerProps) {
  const {
    videoRef,
    setCurrentTime,
    setDuration,
    currentServer,
    setCaptions,
    setM3u8URL,
    setProgressPercentage,
    currentTime,
    isPlaying,
    isMuted,
    playbackSpeed,
    setIsPlaying,
    videoVolume,
    isPIP,
    isFullscreen,
    currentCaption,
    setIsPIP,
    m3u8URL,
    setQualities,
    currentQuality,
    setIsLoading,
    captions,
    setLanguages,
    languages,
  } = useVideoStore();
  const videoStore = useVideoStore();

  const hlsRef = useRef(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    console.log(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
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

      if (Array.isArray(serverData)) {
      }

      if (serverData.captions) {
        setCaptions([{ url: "", lang: "None" }, ...serverData.captions]);
      }

      if (serverData.playlistUrl) {
        setM3u8URL(serverData.playlistUrl);
      }

      if (serverData.sources) {
        setM3u8URL(serverData.sources[0].url);
      }
    };
    try {
      configureServer();
    } catch {}
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
    if (isPlaying) videoRef.current.play().catch(() => setIsPlaying(false));
    else videoRef.current.pause();
    videoRef.current.volume = isMuted ? 0 : videoVolume;
    videoRef.current.playbackRate = playbackSpeed;
  }, [isPlaying, videoVolume, isMuted, playbackSpeed]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPIP)
      videoRef.current.requestPictureInPicture().catch(() => setIsPIP(false));
    else if (document.pictureInPictureElement)
      document.exitPictureInPicture().catch(() => {});
  }, [isPIP]);

  useEffect(() => {
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
        className={`video__container ${!isPlaying ? "paused" : ""} ${
          isFullscreen ? "fullscreen" : ""
        }`}
      >
        <VideoControls videoStore={videoStore} />

        <video
          ref={videoRef}
          onClick={() => setIsPlaying(!isPlaying)}
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
