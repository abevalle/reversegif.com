import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ExampleGifs = () => {
  const allGifs = [
    'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
    'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
    'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
    'https://media.giphy.com/media/l0HlUOry8A07NfL5q/giphy.gif',
    'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif',
    'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
  ];

  const [selectedGifs, setSelectedGifs] = useState([]);

  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    const selectRandomGifs = () => {
      const gifsToDisplay = [...allGifs];
      shuffleArray(gifsToDisplay);
      return gifsToDisplay.slice(0, 4); // Select 4 random GIFs
    };

    setSelectedGifs(selectRandomGifs());
  }, []);

  return (
    <div className="text-center p-4">
      <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4">
        <div className="mb-4 md:mb-0">
          <p className="text-lg text-gray-900 dark:text-gray-100">No GIF?</p>
          <p className="text-lg text-gray-900 dark:text-gray-100">Try one of these:</p>
        </div>
        <div className="flex space-x-4">
          {selectedGifs.map((gif, index) => (
            <div key={index} className="w-16 h-16 relative rounded-lg overflow-hidden">
              <Image
                src={gif}
                alt={`Example GIF ${index + 1}`}
                fill
                sizes="100px"
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
        By uploading a GIF you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a>. To learn more about how reversegif handles your personal data, check our <a href="/privacy" className="text-blue-500">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default ExampleGifs;
