export interface MovieDBMovieListResultData {
  data: {
    moviedbmovielist: [{
      username: string;
      movieid: number;
      posterurl: string;
    }]
  };
  loading: boolean;
  networkStatus: number;
  stale: boolean;
}
