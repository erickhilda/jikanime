import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface AnimeFiltersProps {
  status: string;
  type: string;
  rating: string;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onRatingChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'airing', label: 'Airing' },
  { value: 'complete', label: 'Complete' },
  { value: 'upcoming', label: 'Upcoming' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
  { value: 'cm', label: 'CM' },
  { value: 'pv', label: 'PV' },
  { value: 'tv_special', label: 'TV Special' },
];

const RATING_OPTIONS = [
  { value: 'all', label: 'All Ratings' },
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg13', label: 'PG-13 - Teens 13 or older' },
  { value: 'r17', label: 'R - 17+ (violence & profanity)' },
  { value: 'r', label: 'R+ - Mild Nudity' },
  { value: 'rx', label: 'Rx - Hentai' },
];

export function AnimeFilters({
  status,
  type,
  rating,
  onStatusChange,
  onTypeChange,
  onRatingChange,
}: AnimeFiltersProps) {
  const handleStatusChange = (value: string) => {
    onStatusChange(value === 'all' ? '' : value);
  };

  const handleTypeChange = (value: string) => {
    onTypeChange(value === 'all' ? '' : value);
  };

  const handleRatingChange = (value: string) => {
    onRatingChange(value === 'all' ? '' : value);
  };

  const displayStatus = status === '' ? 'all' : status;
  const displayType = type === '' ? 'all' : type;
  const displayRating = rating === '' ? 'all' : rating;

  return (
    <div className='grid grid-cols-3 gap-2 justify-center mt-4 lg:mt-0 col-span-6 lg:col-span-3 w-full'>
      <Select value={displayStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className='lg:col-span-1 col-span-3'>
          <SelectValue placeholder='Status' />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={displayType} onValueChange={handleTypeChange}>
        <SelectTrigger className='lg:col-span-1 col-span-3'>
          <SelectValue placeholder='Type' />
        </SelectTrigger>
        <SelectContent>
          {TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={displayRating} onValueChange={handleRatingChange}>
        <SelectTrigger className='lg:col-span-1 col-span-3'>
          <SelectValue placeholder='Rating' />
        </SelectTrigger>
        <SelectContent>
          {RATING_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
