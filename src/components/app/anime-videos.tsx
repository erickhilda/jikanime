import type { AnimeVideos } from '../../types/anime';
import { Play, ExternalLink } from 'lucide-react';

interface AnimeVideosProps {
  videos: AnimeVideos | null;
  loading: boolean;
}

export function AnimeVideosSection({ videos, loading }: AnimeVideosProps) {
  if (loading) {
    return (
      <div>
        <h3 className='text-xl font-semibold mb-3'>Videos</h3>
        <div className='flex items-center justify-center py-8'>
          <div className='w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin' />
        </div>
      </div>
    );
  }

  if (
    !videos ||
    videos.promos === null ||
    videos.promos === undefined ||
    videos.episodes === null ||
    videos.episodes === undefined
  ) {
    return (
      <div>
        <h3 className='text-xl font-semibold mb-3'>Videos</h3>
        <p className='text-foreground/70'>No videos found</p>
      </div>
    );
  }

  const extractYoutubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string): string | null => {
    const youtubeId = extractYoutubeId(url);
    return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;
  };

  return (
    <div>
      <h3 className='text-xl font-semibold mb-3'>Videos</h3>

      {videos.promos.length > 0 && (
        <div className='mb-6'>
          <h4 className='text-lg font-medium mb-3 text-foreground/80'>
            Promotional Videos
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {videos.promos.map((promo, index) => {
              const embedUrl = getEmbedUrl(promo.video_url);
              return (
                <div key={index} className='space-y-2'>
                  <h5 className='text-sm font-medium text-foreground/70'>
                    {promo.title}
                  </h5>
                  {embedUrl ? (
                    <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-secondary-background'>
                      <iframe
                        src={embedUrl}
                        title={promo.title}
                        className='w-full h-full'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={promo.video_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='relative w-full aspect-video rounded-lg overflow-hidden bg-secondary-background flex items-center justify-center group hover:opacity-90 transition-opacity'
                    >
                      {promo.image_url && (
                        <img
                          src={promo.image_url}
                          alt={promo.title}
                          className='w-full h-full object-cover'
                        />
                      )}
                      <div className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors'>
                        <ExternalLink className='w-8 h-8 text-white' />
                      </div>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {videos.episodes.length > 0 && (
        <div>
          <h4 className='text-lg font-medium mb-3 text-foreground/80'>
            Episodes
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {videos.episodes.map((episode, index) => (
              <a
                key={index}
                href={episode.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group relative w-full aspect-video rounded-lg overflow-hidden bg-secondary-background hover:opacity-90 transition-opacity'
              >
                {episode.images?.jpg?.image_url && (
                  <img
                    src={episode.images.jpg.image_url}
                    alt={episode.title}
                    className='w-full h-full object-cover'
                  />
                )}
                <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/50 group-hover:bg-black/60 transition-colors p-4'>
                  <Play className='w-8 h-8 text-white mb-2' />
                  <p className='text-white text-sm font-medium text-center line-clamp-2'>
                    {episode.title}
                  </p>
                  {episode.episode && (
                    <p className='text-white/80 text-xs mt-1'>
                      Episode {episode.episode}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
