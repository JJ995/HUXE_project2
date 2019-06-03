import { MovieDBMovie } from './MovieDBMovie';

export interface MovieDBMoviesResultData {
  page: number;
  total_results: number;
  total_pages: number;
  results: [MovieDBMovie];
}
