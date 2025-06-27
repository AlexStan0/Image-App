'use client';

import React, { useState } from 'react';
import CaptionPage from '@/components/Caption';
import SearchPage from '@/components/Search';

export default function Home() {
  
  const [active, setActive] = useState<'caption' | 'search'>('caption');

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Custom menu that uses state instead of links */}
      <nav className="w-full flex justify-center bg-gray-800 py-4 shadow-md">
        <button
          className={`mx-4 px-4 py-2 rounded-md font-semibold transition ${
            active === 'caption'
              ? 'bg-cyan-400 text-gray-900 shadow'
              : 'bg-gray-700 text-gray-200 hover:bg-cyan-700'
          }`}
          onClick={() => setActive('caption')}
        >
          Caption Image
        </button>
        <button
          className={`mx-4 px-4 py-2 rounded-md font-semibold transition ${
            active === 'search'
              ? 'bg-cyan-400 text-gray-900 shadow'
              : 'bg-gray-700 text-gray-200 hover:bg-cyan-700'
          }`}
          onClick={() => setActive('search')}
        >
          Search by Caption
        </button>
      </nav>
      {/* Render the selected page */}
      {active === 'caption' ? <CaptionPage /> : <SearchPage />}
    </div>
  );
}