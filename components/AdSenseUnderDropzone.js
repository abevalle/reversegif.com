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
      style={{ display: 'inline-block', width: '728px', height: '90px' }}
      data-ad-client="ca-pub-7359270153499473"
      data-ad-slot="8440382746"
    />
  );
};

export default AdSenseUnderDropzone;