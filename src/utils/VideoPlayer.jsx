'use client';

import YouTube from 'react-youtube';

export default function SimplePlayer({ youtubeId }) {
  const opts = {
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <YouTube 
        videoId={youtubeId} 
        opts={opts} 
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}