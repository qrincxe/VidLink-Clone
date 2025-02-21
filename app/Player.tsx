"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { fetchServer } from "@/lib/fetchServer";
import VideoControls from "@/components/player/VideoControls";
import { Server, useVideoStore } from "@/components/state";
import { serversMeta } from "@/constants/serversMeta";
import { createId } from "@/lib/createId";

interface PlayerProps {
  type: "movie" | "tvShows";
  id: string;
  seasonNo?: number;
  tmdbOrImdbId?: number;
}

export default function Player({ type, id, seasonNo, tmdbOrImdbId }: PlayerProps) {
  const videoStore = useVideoStore();
  const {
    videoRef,
    setCurrentTime,
    setDuration,
    currentServer,
    setCurrentServer,
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
    setIsLoading,
    captions,
    setServers,
    servers,
  } = videoStore;

  const hlsRef = useRef(null);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const serverPromises = Object.keys(serversMeta).map(async (serverIndex) => {
          const serverData = await fetchServer(
            type,
            Number(serverIndex),
            id,
            seasonNo,
            tmdbOrImdbId
          );
          
          if (!serverData) return null;

          const newServers: Server[] = [];

          if (Array.isArray(serverData)) {
            newServers.push(
              ...serverData.map(({ language, link, captions = [] }) => ({
                id: createId(),
                language,
                url: link,
                captions,
                number: Number(serverIndex),
              }))
            );
          } else if (serverData.sources?.[0]) {
            newServers.push({
              id: createId(),
              language: "English",
              url: serverData.sources[0].url,
              captions: serverData.captions || [],
              number: Number(serverIndex),
            });
          } else if (serverData.playlistUrl) {
            const serverInfo: Server = {
              id: createId(),
              language: "English",
              url: serverData.playlistUrl,
              captions: serverData.captions || [],
              number: Number(serverIndex),
            };
            newServers.push(serverInfo);
          }

          return newServers;
        });

        const results = await Promise.all(serverPromises);
        const validServers = results.flat().filter(Boolean);
        
        setServers(validServers);
        if (!currentServer && validServers.length > 0) {
          setCurrentServer(validServers[0]);
        }
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    fetchServers();
  }, [id, tmdbOrImdbId, seasonNo, type]);

  useEffect(() => {
    if (!currentServer) return;
    const server = servers.find((s) => s.id === currentServer.id);
    if (server) setM3u8URL(server.url);
  }, [servers, currentServer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadeddata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadeddata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !m3u8URL) return;

    const initializeHLS = () => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(m3u8URL);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play();
          setQualities(["Auto", ...hls.levels.map(level => level.height.toString())]);
        });

        return () => {
          hls.destroy();
          hlsRef.current = null;
        };
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = m3u8URL;
      }
    };

    return initializeHLS();
  }, [m3u8URL]);

  // Video control effects
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
    
    videoRef.current.volume = isMuted ? 0 : videoVolume;
    videoRef.current.playbackRate = playbackSpeed;
  }, [isPlaying, videoVolume, isMuted, playbackSpeed]);

  // PIP effect
  useEffect(() => {
    if (!videoRef.current || !document.pictureInPictureEnabled) return;

    const handlePIP = async () => {
      try {
        if (isPIP) {
          await videoRef.current.requestPictureInPicture();
        } else if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
      } catch (error) {
        setIsPIP(false);
        console.error("PIP error:", error);
      }
    };

    handlePIP();
  }, [isPIP]);

  return (
    <div className="w-full h-full">
      <div className={`video__container ${!isPlaying ? "paused" : ""} ${isFullscreen ? "fullscreen" : ""}`}>
        <VideoControls videoStore={videoStore} />
        <video
          ref={videoRef}
          onClick={() => setIsPlaying(!isPlaying)}
          onPlaying={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
        >
          {captions.map((caption) => 
            caption.lang !== "None" && (
              <track
                key={caption.lang}
                kind="subtitles"
                srcLang={caption.lang}
                src={`${window.location.origin}/api/vtt?vttUrl=${caption.url}`}
              />
            )
          )}
        </video>
      </div>
    </div>
  );
}