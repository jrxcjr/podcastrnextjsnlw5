import "../style/global.scss";
import styles from "../style/app.module.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContextProvider } from "../contexts/PlayerContext";

function MyApp({ Component, pageProps }) {
 return (
  <PlayerContextProvider>
   <div className={styles.wrapper}>
    <main>
     <Header />
     <Component {...pageProps} />;
    </main>
    <Player></Player>
   </div>
  </PlayerContextProvider>
 );
}

export default MyApp;
