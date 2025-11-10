import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Anime } from '../../types/anime';
import { Star } from 'lucide-react';
import { Badge } from '../ui/badge';

interface AnimeCardProps {
  anime: Anime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/anime/${anime.mal_id}`);
  };

  const imageUrl = anime.images.jpg.large_image_url || anime.images.jpg.image_url;
  const title = anime.title_english || anime.title || 'Untitled';
  const score = anime.score ? anime.score.toFixed(1) : 'N/A';

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] h-full flex flex-col overflow-hidden pt-0 gap-3"
      onClick={handleClick}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-secondary-background">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground/50">
            No Image
          </div>
        )}
        {anime.score && (
          <Badge variant='neutral' className='absolute top-2 right-2 backdrop-blur-sm'>
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            {score}
          </Badge>
        )}
      </div>
      <CardHeader className="flex-1">
        <CardTitle className="line-clamp-2 text-base leading-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
          {anime.type && <span>{anime.type}</span>}
          {anime.episodes && <span>• {anime.episodes} eps</span>}
          {anime.year && <span>• {anime.year}</span>}
        </div>
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 3).map((genre) => (
              <Badge variant='neutral' className='text-xs px-2 py-1 rounded-full bg-secondary-background text-foreground/80'> 
                {genre.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

