import { useEffect, useState } from 'react';
import { getGenres } from '../services/jikanApi';
import type { Genre } from '../types/anime';
import { GenreBubbleChart } from '../components/app/genre-bubble-chart';
import { AnimatedBackground } from '../components/app/animated-background';
import { LoadingSkeleton } from '../components/app/loading-skeleton';
import { ErrorMessage } from '../components/app/error-message';

function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        abortController = new AbortController();

        const response = await getGenres(abortController.signal);
        setGenres(response.data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(
            err && typeof err === 'object' && 'message' in err
              ? (err as { message: string }).message
              : 'Failed to fetch genres'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();

    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    getGenres()
      .then((response) => {
        setGenres(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : 'Failed to fetch genres'
        );
        setLoading(false);
      });
  };

  return (
    <div className='min-h-screen bg-white relative'>
      <AnimatedBackground variant='sakura' intensity='medium' />
      <div className='container mx-auto px-4 py-8 relative z-10'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2 text-center'>
            Explore Anime by Genre
          </h1>
          <p className='text-center text-foreground/70 mb-6'>
            Click on any bubble to discover anime in that genre
          </p>
        </div>

        {loading && (
          <div className='flex justify-center items-center min-h-[600px]'>
            <LoadingSkeleton count={1} />
          </div>
        )}

        {error && !loading && (
          <div className='py-8'>
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {!loading && !error && genres.length > 0 && (
          <div className='flex justify-center'>
            <GenreBubbleChart genres={genres} width={1200} height={800} />
          </div>
        )}
      </div>
    </div>
  );
}

export default GenresPage;

