import React from 'react';

const AdBlockNotice = () => {
  return (
    <div className="mt-4 px-4 md:px-0">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Ad Blocker Detected</strong><br />
          Please consider disabling your ad blocker to support our free service.
        </p>
      </div>
    </div>
  );
};

export default AdBlockNotice;