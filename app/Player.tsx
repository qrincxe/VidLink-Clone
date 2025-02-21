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
    setCurrentServer,
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
    setServers,
    servers,
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
    const fetchServers = async () => {
      for (const serverIndex in serversMeta) {
        const serverData = await fetchServer(
          type,
          Number(serverIndex),
          id,
          seasonNo,
          tmdbOrImdbId
        );

        if (!serverData) return;
        /**
   * [
  {
    "language": "Hindi",
    "link": "https://i-cdn-0.vista335lopq.com/stream2/i-cdn-0/a992af17d36b4ea9531c436ab6fa3dd8/MJTMsp1RshGTygnMNRUR2N2MSlnWXZEdMNDZzQWe5MDZzMmdZJTO1R2RWVHZDljekhkSsl1VwYnWtx2cihVT2pFVJdnWEVkMOpmSplleCpWWXVFMa1mSqllaJdnWEpEaadUR610RGtmWXVUP:1740168988:94.232.244.159:7babe8511efca1e23cc28a96d1783fd5c26934c3d6b98dc909df6ab80edd82b4/index.m3u8"
  },
  {
    "language": "English",
    "link": "https://i-cdn-0.vista335lopq.com/stream2/i-cdn-0/a992af17d36b4ea9531c436ab6fa3dd8/MJTMsp1RshGTygnMNRUR2N2MSlnWXZEdMNDZzQWe5MDZzMmdZJTO1R2RWVHZDljekhkSsl1VwYnWtx2cihVT25UbZNjWqtWNPRVQ55kaVVjTt1kMN1WS65kaGxmWUlkMNR0Y140RFBTWqdWP:1740168988:94.232.244.159:dc7f11bca7c3a28d8b06a084fb6727df0df77a1b040ea1cab60f25116d69c505/index.m3u8"
  }
]
   */

        if (Array.isArray(serverData)) {
          for (const { language, link, captions = [] } of serverData) {
            const serverInfo: Server = {
              id: createId(),
              language,
              url: link,
              captions: captions || [],
              number: Number(serverIndex),
            };
            setServers([...servers, serverInfo]);
          }
        }
        /**
 * {
  "sources": [
    {
      "quality": "HLS",
      "source": "#Hà Nội (Vietsub) (Full)",
      "url": "https://s2.phim1280.tv/20231017/20MEMVbZ/index.m3u8",
      "format": "hls"
    }
  ],
  "captions": []
}
 */
        if (serverData.sources) {
          const source = serverData?.sources?.at(0);
          if (!source) return;
          const serverInfo: Server = {
            id: createId(),
            language: "English",
            url: source.url,
            captions: serverData?.captions,
            number: Number(serverIndex),
          };
          setServers([...servers, serverInfo]);
        }

        /**
         * {
  "playlistUrl": "https://tralvoxmoon.xyz/file2/hVVXChVCKftfkcE4G5Pabueu~TFYKm7z3fJ9BpS151g8M5Jm8oCGq4+8gswvJouLmt~LvyDqwY0jyy0BOD1iBCBQeLuo77glkzOaW8y3fV9Gw~cG5EE1qzr5BfhUadCo3GwH1AVUudBYcIT7akGNw7nYrk071CXDcury7~dwoo8=/cGxheWxpc3QubTN1OA==.m3u8",
  "captions": [
    {
      "url": "https://cca.megafiles.store/a6/96/a696a1e5a8079caa360ca3136d9f2b7f/a696a1e5a8079caa360ca3136d9f2b7f.vtt",
      "lang": "Arabic"
    },
    {
      "url": "https://cca.megafiles.store/7a/dc/7adcb1142882f2dba88bf8ea762a9575/7adcb1142882f2dba88bf8ea762a9575.vtt",
      "lang": "English"
    }
  ]
}
         */
        if (serverData.playlistUrl) {
          const serverInfo: Server = {
            id: createId(),
            language: "English",
            url: serverData.playlistUrl,
            captions: serverData?.captions,
            number: Number(serverIndex),
          };
          setServers([...servers, serverInfo]);
          if (!currentServer) {
            setCurrentServer(serverInfo);
          }
        }
      }
    };
    fetchServers();
  }, [id, tmdbOrImdbId, seasonNo, type]);

  useEffect(() => {
    const configureServer = async () => {
      const server = servers.find((server) => server.id === currentServer.id);
      if (!server) return;
      setM3u8URL(server.url);
    };
    try {
      configureServer();
    } catch {}
  }, [id, tmdbOrImdbId, seasonNo, type, servers, currentServer]);

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
  }, [videoRef]);

  useEffect(() => {
    if (videoRef.current)
      setProgressPercentage(currentTime / videoRef.current.duration);
  }, [videoRef, currentTime]);

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
                src={`${window.location.origin}/api/vtt?vttUrl=${caption.url}`}
              ></track>
            ) : null;
          })}
        </video>
      </div>
    </div>
  );
}
