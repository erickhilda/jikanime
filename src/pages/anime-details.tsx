import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchAnimeDetailsAsync,
  fetchAnimeVideosAsync,
  fetchAnimePicturesAsync,
  fetchAnimeRelationsAsync,
  clearDetails,
  cancelDetailsFetch,
} from '../store/slices/animeDetailsSlice';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import Button from '../components/ui/button/button';
import { ErrorMessage } from '../components/app/error-message';
import { AnimeVideosSection } from '../components/app/anime-videos';
import { AnimePicturesSection } from '../components/app/anime-pictures';
import { AnimeRelationsSection } from '../components/app/anime-relations';
import { AnimatedBackground } from '../components/app/animated-background';
import { ArrowLeft, Star, Calendar, Tv, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BackButton = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <Button
      variant='neutral'
      onClick={handleBack}
      className='mb-6 flex items-center gap-2'
    >
      <ArrowLeft className='w-4 h-4' />
      Back to Search
    </Button>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen bg-white relative'>
      <AnimatedBackground variant='sakura' intensity='medium' />
      <div className='container mx-auto px-4 py-8 relative z-10'>
        {children}
      </div>
    </div>
  );
};

function AnimeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    anime,
    loading,
    error,
    videos,
    videosLoading,
    pictures,
    picturesLoading,
    relations,
    relationsLoading,
  } = useAppSelector((state) => state.animeDetails);

  useEffect(() => {
    if (id) {
      const animeId = parseInt(id, 10);
      if (!isNaN(animeId)) {
        dispatch(fetchAnimeDetailsAsync(animeId));
        dispatch(fetchAnimeVideosAsync(animeId));
        dispatch(fetchAnimePicturesAsync(animeId));
        dispatch(fetchAnimeRelationsAsync(animeId));
      }
    }

    return () => {
      dispatch(clearDetails());
      dispatch(cancelDetailsFetch());
    };
  }, [id, dispatch]);

  const handleRetry = () => {
    if (id) {
      const animeId = parseInt(id, 10);
      if (!isNaN(animeId)) {
        dispatch(fetchAnimeDetailsAsync(animeId));
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <PageWrapper>
        <BackButton handleBack={handleBack} />
        <div className='flex items-center justify-center py-16'>
          <div className='text-center'>
            <div className='w-16 h-16 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-4' />
            <p className='text-foreground/70'>Loading anime details...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </PageWrapper>
    );
  }

  if (!anime) {
    return (
      <PageWrapper>
        <BackButton handleBack={handleBack} />
        <div className='text-center py-16'>
          <p className='text-foreground/70'>Anime not found</p>
        </div>
      </PageWrapper>
    );
  }

  const imageUrl =
    anime.images.jpg.large_image_url || anime.images.jpg.image_url;
  const title = anime.title_english || anime.title || 'Untitled';
  const titleJapanese = anime.title_japanese;
  const score = anime.score ? anime.score.toFixed(1) : 'N/A';
  const synopsis = anime.synopsis || 'No synopsis available.';

  return (
    <PageWrapper>
      <BackButton handleBack={handleBack} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-1'>
          <Card className='sticky top-8 py-0'>
            <div className='relative w-full aspect-3/4 overflow-hidden bg-secondary-background rounded-t-base'>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-foreground/50'>
                  No Image
                </div>
              )}
            </div>
            <CardContent>
              {anime.score && (
                <div className='flex items-center gap-1 mb-4'>
                  <Star className='w-5 h-5 fill-yellow-500 text-yellow-500' />
                  <span className='text-2xl font-bold'>{score}</span>
                  <span className='text-foreground/70'>
                    ({anime.scored_by?.toLocaleString()} votes)
                  </span>
                </div>
              )}

              <div className='space-y-3 text-sm'>
                {anime.type && (
                  <div className='flex items-center gap-2'>
                    <Tv className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Type:</span>
                    <span className='font-semibold'>{anime.type}</span>
                  </div>
                )}

                {anime.episodes && (
                  <div className='flex items-center gap-2'>
                    <Tv className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Episodes:</span>
                    <span className='font-semibold'>{anime.episodes}</span>
                  </div>
                )}

                {anime.duration && (
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Duration:</span>
                    <span className='font-semibold'>{anime.duration}</span>
                  </div>
                )}

                {anime.status && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Status:</span>
                    <span className='font-semibold'>{anime.status}</span>
                  </div>
                )}

                {anime.aired?.string && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Aired:</span>
                    <span className='font-semibold'>{anime.aired.string}</span>
                  </div>
                )}

                {anime.members && (
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Members:</span>
                    <span className='font-semibold'>
                      {anime.members.toLocaleString()}
                    </span>
                  </div>
                )}

                {anime.rank && (
                  <div className='flex items-center gap-2'>
                    <Star className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Rank:</span>
                    <span className='font-semibold'>#{anime.rank}</span>
                  </div>
                )}

                {anime.popularity && (
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-foreground/50' />
                    <span className='text-foreground/70'>Popularity:</span>
                    <span className='font-semibold'>#{anime.popularity}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-3xl mb-2'>{title}</CardTitle>
              {titleJapanese && (
                <p className='text-lg text-foreground/70'>{titleJapanese}</p>
              )}
              {anime.title_synonyms && anime.title_synonyms.length > 0 && (
                <p className='text-sm text-foreground/60 mt-2'>
                  Also known as: {anime.title_synonyms.join(', ')}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {synopsis && (
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>Synopsis</h3>
                    <p className='text-foreground/80 leading-relaxed whitespace-pre-line'>
                      {synopsis}
                    </p>
                  </div>
                )}

                {anime.background && (
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>Background</h3>
                    <p className='text-foreground/80 leading-relaxed whitespace-pre-line'>
                      {anime.background}
                    </p>
                  </div>
                )}

                {anime.genres && anime.genres.length > 0 && (
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>Genres</h3>
                    <div className='flex flex-wrap gap-2'>
                      {anime.genres.map((genre) => (
                        <Badge
                          key={genre.mal_id}
                          variant='neutral'
                          className='text-sm'
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {anime.studios && anime.studios.length > 0 && (
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>Studios</h3>
                    <div className='flex flex-wrap gap-2'>
                      {anime.studios.map((studio) => (
                        <Badge
                          key={studio.mal_id}
                          variant='neutral'
                          className='text-sm'
                        >
                          {studio.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {anime.producers && anime.producers.length > 0 && (
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>Producers</h3>
                    <div className='flex flex-wrap gap-2'>
                      {anime.producers.map((producer) => (
                        <Badge
                          key={producer.mal_id}
                          variant='neutral'
                          className='text-sm'
                        >
                          {producer.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {anime.source && (
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>Source</h3>
                    <p className='text-foreground/80'>{anime.source}</p>
                  </div>
                )}

                {anime.rating && (
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>Rating</h3>
                    <p className='text-foreground/80'>{anime.rating}</p>
                  </div>
                )}

                <AnimeVideosSection videos={videos} loading={videosLoading} />

                <AnimePicturesSection
                  pictures={pictures}
                  loading={picturesLoading}
                />

                <AnimeRelationsSection
                  relations={relations}
                  loading={relationsLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

export default AnimeDetailsPage;
