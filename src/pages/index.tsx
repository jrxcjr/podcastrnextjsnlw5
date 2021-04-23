import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticProps } from "next";
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

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
 episodes: Episode[];
};

export default function Home(props: HomeProps) {
 console.log(props.episodes);
 //the props called here are the ones fetched in the server.json
 //by that async function getServerSideProps

 return (
  <div>
   <h1>Index</h1>
   <p>{JSON.stringify(props.episodes)}</p>
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

 return {
  props: {
   episodes,
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
