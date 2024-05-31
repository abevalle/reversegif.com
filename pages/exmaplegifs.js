import React from 'react';

const ExampleGifs = () => {
  const gifs = [
    'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
    'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
    'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
    'https://media.giphy.com/media/l0HlUOry8A07NfL5q/giphy.gif',
  ];

  return (
    <div className="text-center p-4">
      <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4">
        <div className="mb-4 md:mb-0">
          <p className="text-lg text-gray-900 dark:text-gray-100">No GIF?</p>
          <p className="text-lg text-gray-900 dark:text-gray-100">Try one of these:</p>
        </div>
        <div className="flex space-x-4">
          {gifs.map((gif, index) => (
            <img key={index} src={gif} alt={`Example GIF ${index + 1}`} className="w-16 h-16 rounded-lg" />
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
