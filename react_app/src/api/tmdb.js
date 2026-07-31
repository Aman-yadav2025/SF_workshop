const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchApi = async (endpoint, options = {}) => {
  const url = new URL(`${API_BASE}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  
  if (options.params) {
    Object.keys(options.params).forEach(key => {
      if (options.params[key] !== undefined && options.params[key] !== '') {
        url.searchParams.append(key, options.params[key]);
      }
    });
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.status_message || 'API request failed');
  }
  return data;
};

// --- AUTHENTICATION ---
export const requestToken = async () => {
  const data = await fetchApi('/authentication/token/new');
  return data.request_token;
};

export const validateToken = async (username, password, request_token) => {
  return fetchApi('/authentication/token/validate_with_login', {
    method: 'POST',
    body: JSON.stringify({ username, password, request_token }),
  });
};

export const createSession = async (request_token) => {
  const data = await fetchApi('/authentication/session/new', {
    method: 'POST',
    body: JSON.stringify({ request_token }),
  });
  return data.session_id;
};

export const getAccountDetails = async (session_id) => {
  return fetchApi('/account', { params: { session_id } });
};

// --- MOVIES ---
export const getTrendingMovies = async () => {
  return fetchApi('/trending/movie/day');
};

export const discoverMovies = async (params) => {
  return fetchApi('/discover/movie', { params });
};

export const searchMovies = async (query, params = {}) => {
  return fetchApi('/search/movie', { params: { query, ...params } });
};

export const getGenres = async () => {
  return fetchApi('/genre/movie/list');
};

export const getMovieDetails = async (movieId) => {
  return fetchApi(`/movie/${movieId}`);
};

// --- WATCHLIST ---
export const getWatchlist = async (accountId, sessionId) => {
  return fetchApi(`/account/${accountId}/watchlist/movies`, {
    params: { session_id: sessionId },
  });
};

export const toggleWatchlist = async (accountId, sessionId, movieId, isWatchlisted) => {
  return fetchApi(`/account/${accountId}/watchlist`, {
    method: 'POST',
    params: { session_id: sessionId },
    body: JSON.stringify({
      media_type: 'movie',
      media_id: movieId,
      watchlist: isWatchlisted
    }),
  });
};
