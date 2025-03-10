import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Caption {
  lang: string;
  url: string;
}

export interface Server {
  id: string;
  metaId: string;
  name: string;
  url: string;
  language: string;
  captions: Caption[];
  number: number;
}

export interface State {
  m3u8URL: string;
  isPlaying: boolean;
  isFullscreen: boolean;
  isPIP: boolean;
  videoVolume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  progressPercentage: number;
  settingsExpanded: boolean;
  qualities: (string | number)[];
  currentQuality: string;
  qualitiesExpanded: boolean;
  isLoading: boolean;
  captions: Caption[];
  currentCaption: Caption;
  serversExpanded: boolean;
  currentServer: Server | undefined;
  servers: Server[];
  captionsExpanded: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  playbackSpeed: number;
  favouriteServer: Server | null;
}

export interface SetState {
  setM3u8URL: (m3u8URL: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setIsPIP: (isPIP: boolean) => void;
  setVideoVolume: (videoVolume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setCurrentTime: (currentTime: number) => void;
  setDuration: (duration: number) => void;
  setProgressPercentage: (progressPercentage: number) => void;
  setSettingsExpanded: (settingsExpanded: boolean) => void;
  setQualities: (qualities: (string | number)[]) => void;
  setCurrentQuality: (currentQuality: string | number) => void;
  setQualitiesExpanded: (qualitiesExpanded: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setCaptions: (captions: { url: string; lang: string }[]) => void;
  setCurrentCaption: (currentCaption: { lang: string; url: string }) => void;
  setServersExpanded: (serversExpanded: boolean) => void;
  setCurrentServer: (currentServer: Server) => void;
  setCaptionsExpanded: (captionsExpanded: boolean) => void;
  setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) => void;
  setPlaybackSpeed: (number) => void;
  setServers: (servers: Server[]) => void;
  setFavouriteServer: (server: Server | null) => void;
}

export const useVideoStore = create<State & SetState>()(
  persist(
    (set) => ({
      m3u8URL: "",
      isPlaying: false,
      isLoading: true,
      isFullscreen: false,
      isPIP: false,
      isMuted: false,

      qualities: ["Auto"],
      captions: [{ lang: "None", url: "" }],

      videoVolume: 1,
      duration: 0,
      progressPercentage: 0,
      playbackSpeed: 1,

      currentQuality: "Auto",
      currentTime: 0,
      currentCaption: {
        lang: "None",
        url: "",
      },
      currentServer: undefined,
      servers: [],
      favouriteServer: null,

      serversExpanded: false,
      settingsExpanded: false,
      captionsExpanded: false,
      qualitiesExpanded: false,
      videoRef: { current: undefined },

      setM3u8URL: (m3u8URL: string) => set({ m3u8URL }),
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
      setIsPIP: (isPIP: boolean) => set({ isPIP }),
      setVideoVolume: (videoVolume: number) => set({ videoVolume }),
      setIsMuted: (isMuted: boolean) => set({ isMuted }),
      setCurrentTime: (currentTime: number) => set({ currentTime }),
      setDuration: (duration: number) => set({ duration }),
      setProgressPercentage: (progressPercentage: number) =>
        set({ progressPercentage }),
      setSettingsExpanded: (settingsExpanded: boolean) =>
        set({ settingsExpanded }),
      setQualities: (qualities: (string | number)[]) => set({ qualities }),
      setCurrentQuality: (currentQuality: string) => set({ currentQuality }),
      setQualitiesExpanded: (qualitiesExpanded: boolean) =>
        set({ qualitiesExpanded }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setCaptions: (captions: { url: string; lang: string }[]) =>
        set({ captions }),
      setCurrentCaption: (currentCaption: { lang: string; url: string }) =>
        set({ currentCaption }),
      setServersExpanded: (serversExpanded: boolean) =>
        set({ serversExpanded }),
      setCurrentServer: (currentServer: Server) => set({ currentServer }),
      setCaptionsExpanded: (captionsExpanded: boolean) =>
        set({ captionsExpanded }),
      setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) =>
        set({ videoRef }),
      setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),
      setServers: (servers: Server[]) => set({ servers }),
      setFavouriteServer: (server: Server | null) =>
        set({ favouriteServer: server }),
    }),
    {
      name: "video-store",
      partialize: (state) => ({ favouriteServer: state.favouriteServer }),
    }
  )
);
