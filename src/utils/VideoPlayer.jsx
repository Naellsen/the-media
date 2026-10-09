'use client';

import YouTube from 'react-youtube';

export default function SimplePlayer({ youtubeId }) {
  const opts = {
    height: 'full',
    width: 'full',
    playerVars: {
      autoplay: 0,
    },
  };

  return <YouTube videoId={youtubeId} opts={opts} />;
}