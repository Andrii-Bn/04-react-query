import axios from "axios";
import type { Movie } from "../types/movie";
import toast from "react-hot-toast";

interface ResponseParams {
  results: Movie[];
  total_pages: number;
}

interface FetchParams {
  params: {
    query: string;
    page: number;
  };
  headers: {
    accept: string;
    Authorization: string;
  };
}

export default async function fetchMovies(
  searchValue: string,
  page: number = 1
): Promise<{ results: Movie[]; totalPages: number }> {
  if (!searchValue.trim()) return { results: [], totalPages: 0 };
  const fetchUrl: string = `https://api.themoviedb.org/3/search/movie`;
  const fetchParams: FetchParams = {
    params: {
      query: searchValue,
      page,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  };
  try {
    const response = await axios.get<ResponseParams>(fetchUrl, fetchParams);
    if (response.data.results.length === 0) {
      toast.error("No movies found for your request");
      return { results: [], totalPages: 0 };
    }
    console.log(response);
    return {
      results: response.data.results,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
