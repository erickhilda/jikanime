import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  searchAnimeAsync,
  fetchTopAnimeAsync,
  setPage,
  setQuery,
  setFilters,
  cancelSearch,
} from '../store/slices/animeSlice';
import { SearchBar } from '../components/app/search-bar';
import { AnimeFilters } from '../components/app/anime-filters';
import { AnimeCard } from '../components/app/anime-card';
import { Pagination } from '../components/app/pagination';
import { LoadingSkeleton } from '../components/app/loading-skeleton';
import { EmptyState } from '../components/app/empty-state';
import { ErrorMessage } from '../components/app/error-message';
import { AnimatedBackground } from '../components/app/animated-background';
import { ExternalLink } from 'lucide-react';

function AnimeListPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const {
    results,
    currentPage,
    totalPages,
    query,
    loading,
    error,
    hasSearched,
    filters,
  } = useAppSelector((state) => state.anime);

  // Handle navigation from genre bubble chart
  useEffect(() => {
    const state = location.state as {
      genreId?: number;
      genreName?: string;
    } | null;
    if (state?.genreId && state?.genreName) {
      const genreId = state.genreId;
      const updatedFilters = {
        ...filters,
        genres: [genreId],
      };

      // Set genre filter
      dispatch(setFilters(updatedFilters));
      dispatch(setPage(1));

      // Use existing query if available, otherwise fetch top anime with genre filter
      if (query.trim()) {
        dispatch(
          searchAnimeAsync({
            query: query.trim(),
            page: 1,
            filters: updatedFilters,
          })
        );
      } else {
        dispatch(fetchTopAnimeAsync({ page: 1, filters: updatedFilters }));
      }

      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    if (!query.trim() && !hasSearched && results.length === 0) {
      dispatch(fetchTopAnimeAsync({ page: 1, filters }));
    }

    return () => {
      dispatch(cancelSearch());
    };
  }, []);

  const handleSearchChange = (searchQuery: string) => {
    dispatch(setQuery(searchQuery));
    dispatch(setPage(1));

    if (searchQuery.trim()) {
      dispatch(
        searchAnimeAsync({
          query: searchQuery.trim(),
          page: 1,
          filters,
        })
      );
    } else {
      dispatch(fetchTopAnimeAsync({ page: 1, filters }));
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    if (query.trim()) {
      dispatch(searchAnimeAsync({ query: query.trim(), page, filters }));
    } else {
      dispatch(fetchTopAnimeAsync({ page, filters }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    if (query.trim()) {
      dispatch(
        searchAnimeAsync({ query: query.trim(), page: currentPage, filters })
      );
    } else {
      dispatch(fetchTopAnimeAsync({ page: currentPage, filters }));
    }
  };

  const handleFilterChange = (
    filterType: 'status' | 'type' | 'rating',
    value: string
  ) => {
    dispatch(setFilters({ [filterType]: value }));
    dispatch(setPage(1));

    // Trigger search/fetch with new filters
    if (query.trim()) {
      dispatch(
        searchAnimeAsync({
          query: query.trim(),
          page: 1,
          filters: { ...filters, [filterType]: value },
        })
      );
    } else {
      dispatch(
        fetchTopAnimeAsync({
          page: 1,
          filters: { ...filters, [filterType]: value },
        })
      );
    }
  };

  const hasSearchOrFilter =
    hasSearched ||
    filters.status !== '' ||
    filters.type !== '' ||
    filters.rating !== '' ||
    filters.genres.length > 0;

  return (
    <div className='min-h-screen bg-white relative'>
      <AnimatedBackground variant='sakura' intensity='medium' />
      <div className='container mx-auto px-4 py-8 relative z-10'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2 text-center'>
            Unleash Your Anime Curiosity
          </h1>
          <p className='text-center text-foreground/70 mb-6'>
            Embark on a quest through worlds unknown—summon a new obsession with
            every search!
          </p>
          <div className='grid grid-cols-6 align-top gap-x-2'>
            <SearchBar
              value={query}
              onChange={handleSearchChange}
              placeholder='Search for anime...'
              debounceMs={250}
            />

            <AnimeFilters
              status={filters.status}
              type={filters.type}
              rating={filters.rating}
              onStatusChange={(value) => handleFilterChange('status', value)}
              onTypeChange={(value) => handleFilterChange('type', value)}
              onRatingChange={(value) => handleFilterChange('rating', value)}
            />
          </div>
        </div>

        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            <LoadingSkeleton count={20} />
          </div>
        )}

        {error && !loading && (
          <div className='py-8'>
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {!loading && !error && results.length === 0 && hasSearchOrFilter ? (
          <EmptyState
            message='No anime found'
            submessage='Try searching with different keywords or filters'
          />
        ) : null}

        {!loading && !error && results.length > 0 && (
          <>
            <div className='flex justify-between items-center'>
              <div className='mb-6 text-sm text-foreground/70'>
                {hasSearched ? (
                  <>
                    Found {results.length} result
                    {results.length !== 1 ? 's' : ''} on page {currentPage} of{' '}
                    {totalPages}
                  </>
                ) : (
                  <>
                    Top Anime - Page {currentPage} of {totalPages}
                  </>
                )}
              </div>
              <Link
                to='/genres'
                className='text-primary hover:text-primary-dark flex items-center gap-2 hover:underline hover:underline-offset-4'
              >
                Explore by genre: Genres <ExternalLink className='w-4 h-4' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8'>
              {results.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AnimeListPage;
