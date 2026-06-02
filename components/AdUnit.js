import React, { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-7359270153499473';

// A single AdSense display unit.
//
// Defaults to a *responsive* unit (data-ad-format="auto"), which fills based on
// the width of its container — this is the most reliable setup and works with
// "Display ads → responsive" units created in AdSense.
//
// IMPORTANT: never render this inside a `display:none` container (e.g. Tailwind
// `hidden`/`lg:hidden`). AdSense measures the slot width at push time; a hidden
// ancestor reports width 0, which makes AdSense error with "availableWidth=0"
// and permanently kills the slot. Conditionally MOUNT the unit for the active
// breakpoint instead of CSS-hiding it.
const AdUnit = ({
  className = "",
  style = {},
  slot = "8440382746",
  format = "auto",
  responsive = true,
}) => {
  const adRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || hasInitialized.current) return;
    try {
      // Canonical AdSense pattern: push onto the queue array unconditionally.
      // If adsbygoogle.js hasn't loaded yet, this creates the stub array and the
      // request is processed once the script arrives — so the ad fills
      // regardless of script-load timing (which is why a one-shot, script-gated
      // push intermittently left blanks on subsequent page loads).
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasInitialized.current = true;
    } catch (err) {
      console.log('AdSense initialization error:', err);
    }
  }, []);

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', ...style }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdUnit;
