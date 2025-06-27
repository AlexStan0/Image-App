import React from 'react';
import Link from 'next/link';

interface MenuProps {
    active: string;
}

const Menu: React.FC<MenuProps> = ({ active }) => (
    <nav className="w-full flex justify-center bg-gray-800 py-4 shadow-md">
        <Link href="/caption" passHref>
            <button
                className={`mx-4 px-4 py-2 rounded-md font-semibold transition ${
                    active === 'caption'
                        ? 'bg-cyan-400 text-gray-900 shadow'
                        : 'bg-gray-700 text-gray-200 hover:bg-cyan-700'
                }`}
            >
                Caption Image
            </button>
        </Link>
        <Link href="/search" passHref>
            <button
                className={`mx-4 px-4 py-2 rounded-md font-semibold transition ${
                    active === 'search'
                        ? 'bg-cyan-400 text-gray-900 shadow'
                        : 'bg-gray-700 text-gray-200 hover:bg-cyan-700'
                }`}
            >
                Search by Caption
            </button>
        </Link>
    </nav>
);

export default Menu;