import React, { useState, useEffect } from 'react';

const AdBlockNotice = () => {
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsFirefox(navigator.userAgent.toLowerCase().includes('firefox'));
    }
  }, []);

  return (
    <div className="mt-4 px-4 md:px-0">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Ads Blocked</strong><br />
          {isFirefox ? (
            <>Firefox's Enhanced Tracking Protection is blocking ads. 
            Click the shield icon in your address bar to disable it for this site.</>
          ) : (
            <>Please consider disabling your ad blocker to support our free service.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default AdBlockNotice;