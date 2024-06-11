import React from 'react';

export default function PostMetadata({ author, date, tags }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">By {author}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Published on {date}</p>
      <div className="flex flex-wrap mt-2">
        {tags && tags.slice(0, 6).map((tag, index) => (
          <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
