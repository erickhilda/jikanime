import { useNavigate } from 'react-router-dom';
import type { AnimeRelation } from '../../types/anime';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowRight } from 'lucide-react';

interface AnimeRelationsProps {
  relations: AnimeRelation[] | null;
  loading: boolean;
}

export function AnimeRelationsSection({
  relations,
  loading,
}: AnimeRelationsProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div>
        <h3 className='text-xl font-semibold mb-3'>Related Works</h3>
        <div className='flex items-center justify-center py-8'>
          <div className='w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin' />
        </div>
      </div>
    );
  }

  if (!relations || relations.length === 0) {
    return null;
  }

  const handleRelationClick = (malId: number) => {
    navigate(`/anime/${malId}`);
  };

  return (
    <div>
      <h3 className='text-xl font-semibold mb-3'>Related Works</h3>
      <div className='space-y-4'>
        {relations.map((relation, index) => {
          if (!relation.entry || relation.entry.length === 0) return null;

          return (
            <div key={index} className='space-y-2'>
              <h4 className='text-lg font-medium text-foreground/80'>
                {relation.relation}
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {relation.entry.map((entry) => {
                  // display no entry message
                  if (entry.type !== 'anime')
                    return (
                      <div key={entry.mal_id} className='text-foreground/60'>
                        No entry found
                      </div>
                    );

                  return (
                    <Card
                      key={entry.mal_id}
                      className='cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] group'
                      onClick={() => handleRelationClick(entry.mal_id)}
                    >
                      <CardHeader className='pb-3'>
                        <CardTitle className='text-base leading-tight flex items-center justify-between gap-2'>
                          <span className='line-clamp-2 flex-1'>
                            {entry.name}
                          </span>
                          <ArrowRight className='w-4 h-4 text-foreground/50 group-hover:text-foreground/80 transition-colors shrink-0' />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <p className='text-xs text-foreground/60'>
                          {entry.type}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
