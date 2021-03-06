import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from "./home.module.scss";

type Episode = {
 id: string;
 title: string;
 thumbnail: string;
 members: string;
 publishedAt: string;
 duration: number;
 durationAsString: string;
 description: string;
 url: string;
};

type HomeProps = {
 latestEpisodes: Episode[];
 allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
 const { playList } = useContext(PlayerContext);
 const episodeList = [...latestEpisodes, ...allEpisodes];

 return (
  <div className={styles.homepage}>
   <section className={styles.latestEpisodes}>
    <h2>Latest Episodes</h2>

    <ul>
     {latestEpisodes.map((episode, index) => {
      return (
       <li key={episode.id}>
        <Image
         width={192}
         height={192}
         src={episode.thumbnail}
         alt={episode.title}
         objectFit="cover"
        />

        <div className={styles.episodesDetails}>
         <Link href={`/episodes/${episode.id}`}>
          <a>{episode.title}</a>
         </Link>
         <p>{episode.members}</p>
         <span>{episode.publishedAt} </span>
         <span>{episode.durationAsString} </span>
        </div>

        <button
         type="button"
         onClick={() => playList(episodeList, index + latestEpisodes.length)}
        >
         <img src="/play-green.svg" alt="Play Episode" />
        </button>
       </li>
      );
     })}
    </ul>
   </section>
   <section className={styles.allEpisodes}>
    <h2>All Episodes</h2>
    <table cellSpacing={0}>
     <thead>
      <tr>
       <th></th>
       <th>Podcast</th>
       <th>Participants</th>
       <th>Date</th>
       <th>Length</th>
       <th></th>
      </tr>
     </thead>
     <tbody>
      {allEpisodes.map((episode, index) => {
       return (
        <tr key={episode.id}>
         <td>
          <Image
           width={120}
           height={120}
           src={episode.thumbnail}
           alt={episode.title}
           objectFit="cover"
          />
         </td>
         <td>
          <Link href={`/episodes/${episode.id}`}>
           <a>{episode.title}</a>
          </Link>
         </td>
         <td>{episode.members}</td>
         <td style={{ width: 100 }}>{episode.publishedAt}</td>
         <td>{episode.durationAsString}</td>
         <td>
          <button
           type="button"
           onClick={() => playList(episodeList, index + latestEpisodes.length)}
          >
           <img src="/play-green.svg" alt="Play Episode" />
          </button>
         </td>
        </tr>
       );
      })}
     </tbody>
    </table>
   </section>
  </div>
 );
}

//SSG

export const getStaticProps: GetStaticProps = async () => {
 const { data } = await api.get("episodes", {
  params: {
   _limit: 12,
   _sort: "published at",
   _order: "desc",
  },
 });

 const episodes = data.map((episode) => {
  return {
   id: episode.id,
   title: episode.title,
   thumbnail: episode.thumbnail,
   members: episode.members,
   publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
    locale: ptBR,
   }),
   duration: Number(episode.file.duration),
   durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
   description: episode.description,
   url: episode.file.url,
  };
 });

 const latestEpisodes = episodes.slice(0, 2);
 const allEpisodes = episodes.slice(2, episodes.length);

 return {
  props: {
   latestEpisodes,
   allEpisodes,
  },
  revalidate: 60 * 60 * 8, //time for revalidating the data
 };
};

//SPA WAY
// import { useEffect } from "react";
//     useEffect(()=> {
//         fetch('http://localhost:3333/episodes')
//         .then(response=>response.json())
//         .then(data=>console.log(data))
//     }, []) //it takes two params, what to run and when, when first then what
//SSR
// export async function getServerSideProps() {
//  const response = await fetch("http://localhost:3333/episodes");
//  const data = await response.json();

//  return {
//   props: {
//    //here only props are needed to be props
//    episodes: data,
//   },
//  };
// }
