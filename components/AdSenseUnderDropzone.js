import React, { useEffect } from 'react';

const AdSenseUnderDropzone = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ 
        display: 'block',
        width: '100%',
        maxWidth: '728px',
        height: '90px',
        margin: '0 auto'
      }}
      data-ad-client="ca-pub-7359270153499473"
      data-ad-slot="8440382746"
      data-ad-format="horizontal"
      data-full-width-responsive="false"
    />
  );
};

export default AdSenseUnderDropzone;