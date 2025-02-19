// import { useVideoStore } from "@/components/state";

// export const toggleFullscreen = async () => {
//   const { setIsFullscreen, videoRef } = useVideoStore();
//   if (!document.fullscreenElement) {
//     await videoRef.current?.parentElement?.requestFullscreen();
//     setIsFullscreen(true);
//   } else {
//     await document.exitFullscreen();
//     setIsFullscreen(false);
//   }
// };
