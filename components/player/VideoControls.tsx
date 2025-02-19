import { SetState, State } from "../state";
// import PlayIcon from "@/components/vectors/PlayIcon";
// import PauseIcon from "@/components/vectors/PauseIcon";
// import Back10S from "@/components/vectors/Back10S";
// import Forward10S from "@/components/vectors/Forward10S";
// import AudioMutedIcon from "@/components/vectors/AudioMutedIcon";
// import AudioHighIcon from "@/components/vectors/AudioHighIcon";
// import AudioLowIcon from "@/components/vectors/AudioLowIcon";
// import PIPIcon from "@/components/vectors/PIPIcon";
// import SettingsIcon from "@/components/vectors/SettingsIcon";
// import SubtitlesIcon from "@/components/vectors/SubtitlesIcon";
// import ArrowLeft from "@/components/vectors/Arrow";
// import RadioActive from "@/components/vectors/RadioActive";
// import RadioInactive from "@/components/vectors/RadioInactive";
// import Quality from "@/components/vectors/Quality";
// import Clock from "lucide-react";
// import Server from "lucide-react";
// import MiniScreenIcon from "@/components/vectors/MiniScreenIcon";
// import FullscreenIcon from "@/components/vectors/FullscreenIcon";
// import { formatDuration } from "@/lib/utils";
import Controls from "./controls/frontface/Controls";
import Loading from "./controls/frontface/Loading";
import Timeline from "./controls/Timeline";
import Footer from "./controls/footer/Controls";

export interface videoStoreOptions {
  videoStore: State & SetState;
}

export default function VideoControls({ videoStore }: videoStoreOptions) {
  const { isLoading } = videoStore;

  return (
    <>
      <div className="video__controls__container">
        <div className="header__video__controls"></div>
        <div className="center__video__controls">
          {isLoading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              <Controls videoStore={videoStore}/>
            </>
          )}
        </div>

        <Timeline videoStore={videoStore}/>

        <Footer videoStore={videoStore}/>
      </div>
    </>
  );
}
