import { videoStoreOptions } from "../VideoControls";

export default function Timeline({ videoStore }: videoStoreOptions) {
  const {
    isLoading,
    duration,
    progressPercentage,
    setCurrentTime,
    setProgressPercentage,
    videoRef,
  } = videoStore;
  return (
    <>
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
            Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
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
            Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
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
    </>
  );
}
