import { useEffect } from 'react';

const GTMAdSense = () => {
  useEffect(() => {
    // Push AdSense initialization event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'loadAdSense',
        adClient: 'ca-pub-7359270153499473'
      });
    }
  }, []);

  return null;
};

export default GTMAdSense;