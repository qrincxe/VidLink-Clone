import PlayIcon from "@/components/vectors/PlayIcon";
import PauseIcon from "@/components/vectors/PauseIcon";
import Back10S from "@/components/vectors/Back10S";
import Forward10S from "@/components/vectors/Forward10S";
import { videoStoreOptions } from "../../VideoControls";

export default function Controls({ videoStore }: videoStoreOptions) {
  const { setIsPlaying, isPlaying, videoRef } = videoStore;

  const offset = (duration: number) => {
    if (videoRef.current) videoRef.current.currentTime += duration;
  };

  return (
    <>
      <button onClick={() => offset(-10)} className="back_10s_btn">
        <Back10S />
      </button>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="play__pause__btn"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button onClick={() => offset(+10)} className="forward_10s_btn">
        <Forward10S />
      </button>
    </>
  );
}
