import { useState } from 'react';
import type { AnimePicture } from '../../types/anime';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface AnimePicturesProps {
  pictures: AnimePicture[] | null;
  loading: boolean;
}

export function AnimePicturesSection({
  pictures,
  loading,
}: AnimePicturesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (loading) {
    return (
      <div>
        <h3 className='text-xl font-semibold mb-3'>Pictures</h3>
        <div className='flex items-center justify-center py-8'>
          <div className='w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin' />
        </div>
      </div>
    );
  }

  if (!pictures || pictures.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        <h3 className='text-xl font-semibold mb-3'>Pictures</h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {pictures.map((picture, index) => {
            const imageUrl =
              picture.jpg.large_image_url ||
              picture.jpg.image_url ||
              picture.webp.large_image_url ||
              picture.webp.image_url;
            const thumbnailUrl =
              picture.jpg.small_image_url ||
              picture.jpg.image_url ||
              picture.webp.small_image_url ||
              picture.webp.image_url;

            if (!imageUrl) return null;

            return (
              <button
                key={index}
                onClick={() => setSelectedImage(imageUrl)}
                className='relative w-full aspect-square rounded-lg overflow-hidden bg-secondary-background hover:opacity-90 transition-opacity group'
              >
                <img
                  src={thumbnailUrl || imageUrl}
                  alt={`Anime picture ${index + 1}`}
                  className='w-full h-full object-cover'
                  loading='lazy'
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
              </button>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className='max-w-4xl p-0'>
          <DialogHeader className='p-6 pb-0'>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className='relative p-6'>
              <img
                src={selectedImage}
                alt='Full size preview'
                className='w-full h-auto rounded-lg'
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
