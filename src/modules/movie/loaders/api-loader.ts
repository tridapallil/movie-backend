import { tdbmApi } from "../../../infrastructure/apis/tdbm";
import {
  parseMovieList,
  parseMovie,
  fetchTimes,
  mergeMoviesPagesIntoMovies,
  getNumberOfRequests
} from "../parsers";
import {
  IPage,
  ITMDBMovie,
  IMovieDetails,
  IMovie,
  ITMDBMovieDetails
} from "../types";

export interface IUpcomingFilters {
  name?: string;
}

const fetchPage = async (page: number) =>
  tdbmApi.get<IPage<ITMDBMovie>>("movie/upcoming", {
    params: { page }
  });

const fetchListFromApi = async ({
  page,
  limit
}: {
  page: number;
  limit: number;
}): Promise<ITMDBMovie[]> => {
  const numberOfRequests = getNumberOfRequests(limit);
  const pages = await fetchTimes(numberOfRequests, page, fetchPage);
  const movies = mergeMoviesPagesIntoMovies(pages);
  return movies;
};

const limitMovies = (movies: ITMDBMovie[], limit: number) =>
  movies.splice(0, limit);

export const upcoming = async (
  limit: number = 20,
  page: number = 1
): Promise<IMovie[]> => {
  const apiMovies = await fetchListFromApi({ page, limit });
  const movies = parseMovieList(limitMovies(apiMovies, limit));

  return movies;
};

export const get = async (id: number): Promise<IMovieDetails> => {
  const apiMovie = await tdbmApi.get<ITMDBMovieDetails>(`movie/${id}`);
  const movie = parseMovie(apiMovie.data);
  return movie;
};
