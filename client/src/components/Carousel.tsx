import { useEffect, useState } from 'react';

type CarouselProps = {
  photos: string[]; // Array of image URLs
};

export function Carousel({ photos }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % photos.length);
    }, 2000);
    return () => clearTimeout(timerId);
  }, [currentIndex, photos.length]);

  // Navigate to the next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  // Navigate to the previous image
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  // Navigate to a specific image by index
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Image Container */}
      <div className="overflow-hidden rounded-lg shadow-lg max-w-full mx-auto">
        <img
          src={photos[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          style={{ width: 500, height: 500, objectFit: 'contain' }} // this style tag is deciding the size of the carousel images
          className="mx-auto" // Contain images in the container without stretching
        />
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="carousel-button absolute top-1/2 left-4 transform -translate-y-1/2">
        &#10094;
      </button>

      <button
        onClick={nextSlide}
        className="carousel-button absolute top-1/2 right-4 transform -translate-y-1/2">
        &#10095;
      </button>

      {/* Dots */}
      {/* Dots - Positioned outside and at the bottom of the image */}
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`dot-button    ${
              currentIndex === index ? 'active' : 'inactive'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
