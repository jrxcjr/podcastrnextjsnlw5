import "../style/global.scss";
import styles from "../style/app.module.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContext } from "../contexts/PlayerContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
 const [episodeList, setEpisodeList] = useState([]);
 const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
 const [isPlaying, setIsPlaying] = useState(false);

 function play(episode) {
  setEpisodeList([episode]);
  setCurrentEpisodeIndex(0);
  setIsPlaying(true);
 }

 function togglePlay() {
  setIsPlaying(!isPlaying);
 }

 return (
  <PlayerContext.Provider
   value={{ episodeList, currentEpisodeIndex, isPlaying, play, togglePlay }}
  >
   <div className={styles.wrapper}>
    <main>
     <Header />
     <Component {...pageProps} />;
    </main>
    <Player></Player>
   </div>
  </PlayerContext.Provider>
 );
}

export default MyApp;
