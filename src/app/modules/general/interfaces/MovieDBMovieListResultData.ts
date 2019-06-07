import { MovieDBListMovie } from './MovieDBListMovie';

export interface MovieDBMovieListResultData {
  moviedbmovielists: [MovieDBListMovie];
  loading: boolean;
  networkStatus: number;
  stale: boolean;
}
