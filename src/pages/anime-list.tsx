import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  searchAnimeAsync,
  fetchTopAnimeAsync,
  setPage,
  setQuery,
  cancelSearch,
} from '../store/slices/animeSlice';
import { SearchBar } from '../components/app/search-bar';
import { AnimeCard } from '../components/app/anime-card';
import { Pagination } from '../components/app/pagination';
import { LoadingSkeleton } from '../components/app/loading-skeleton';
import { EmptyState } from '../components/app/empty-state';
import { ErrorMessage } from '../components/app/error-message';

function AnimeListPage() {
  const dispatch = useAppDispatch();
  const { results, currentPage, totalPages, query, loading, error, hasSearched } =
    useAppSelector((state) => state.anime);

  useEffect(() => {
    // Load top anime on initial mount if no search query
    if (!query.trim() && !hasSearched && results.length === 0) {
      dispatch(fetchTopAnimeAsync(1));
    }

    return () => {
      dispatch(cancelSearch());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleSearchChange = (searchQuery: string) => {
    dispatch(setQuery(searchQuery));
    dispatch(setPage(1));

    if (searchQuery.trim()) {
      dispatch(searchAnimeAsync({ query: searchQuery.trim(), page: 1 }));
    } else {
      // When search is cleared, show top anime again
      dispatch(fetchTopAnimeAsync(1));
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    if (query.trim()) {
      dispatch(searchAnimeAsync({ query: query.trim(), page }));
    } else {
      dispatch(fetchTopAnimeAsync(page));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    if (query.trim()) {
      dispatch(searchAnimeAsync({ query: query.trim(), page: currentPage }));
    } else {
      dispatch(fetchTopAnimeAsync(currentPage));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center">Unleash Your Anime Curiosity</h1>
          <p className="text-center text-foreground/70 mb-6">
            Embark on a quest through worlds unknown—summon a new obsession with every search!
          </p>
          <SearchBar
            value={query}
            onChange={handleSearchChange}
            placeholder="Search for anime..."
            debounceMs={250}
          />
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <LoadingSkeleton count={20} />
          </div>
        )}

        {error && !loading && (
          <div className="py-8">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <EmptyState
            message="No anime found"
            submessage="Try searching with different keywords"
          />
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="mb-6 text-sm text-foreground/70">
              {hasSearched ? (
                <>
                  Found {results.length} result{results.length !== 1 ? 's' : ''} on
                  page {currentPage} of {totalPages}
                </>
              ) : (
                <>
                  Top Anime - Page {currentPage} of {totalPages}
                </>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
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
