'use client';

import React, { useState } from 'react';

const SearchPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<{ url: string; caption: string }[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearchLoading(true);
        setSearchResults([]);
        try {
            const res = await fetch(`/api/label?caption=${encodeURIComponent(search)}`);
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            setSearchResults(data.results || []);
        } catch {
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="flex flex-1 flex-col items-center justify-center w-full">
                {searchResults.length > 0 && (
                    <div className="flex flex-col items-center w-full">
                        <div className="flex justify-center">
                            <div className="bg-gray-800 rounded-xl shadow-[0_0_32px_4px_rgba(34,211,238,0.15)] p-6 flex flex-col items-center">
                                <img
                                    src={searchResults[0].url}
                                    alt={searchResults[0].caption}
                                    className="w-[32rem] h-[32rem] object-contain rounded-lg mb-4"
                                />
                                <span className="text-gray-100 text-center text-lg">{searchResults[0].caption}</span>
                            </div>
                        </div>
                    </div>
                )}
                {!searchLoading && searchResults.length === 0 && (
                    <div className="mt-16 text-gray-400 text-center text-lg">No results yet.</div>
                )}
            </div>

            <form
                onSubmit={handleSearch}
                className="w-full max-w-xl flex flex-col items-center mb-24"
            >
                <div className="flex w-full bg-gray-800 rounded-full shadow-lg border border-cyan-400 px-4 py-2">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search images by caption..."
                        className="flex-1 bg-transparent outline-none text-gray-100 text-lg px-2"
                    />
                    <button
                        type="submit"
                        disabled={searchLoading}
                        className="ml-2 px-6 py-2 bg-cyan-400 text-gray-900 font-semibold rounded-full shadow transition hover:bg-cyan-300 disabled:opacity-50"
                    >
                        {searchLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchPage;