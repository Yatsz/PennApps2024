import React from 'react';
import dynamic from 'next/dynamic';

const MappedinMap = dynamic(() => import('../lib/components/MappedinMap'), { ssr: false });

const Home: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MappedinMap />
    </div>
  );
};

export default Home;