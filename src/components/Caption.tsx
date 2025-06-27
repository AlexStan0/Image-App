'use client';

import React, { useState } from 'react';

const CaptionPage: React.FC = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [label, setLabel] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setLabel(null);
            setError(null);
            setSubmitted(false);
        }

    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!selectedFile) {
            setError('Please select an image file.');
            return;
        }

        setLoading(true);
        setError(null);
        setLabel(null);

        try {

            const reader = new FileReader();
            reader.onloadend = async () => {

                try {

                    const base64 = reader.result as string;
                    const res = await fetch('/api/label', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: base64 }),
                    });

                    if (!res.ok) throw new Error('API error');
                    const data = await res.json();
                    setLabel(data.label || 'No label found');
                    setSubmitted(true);

                } catch {
                    setError('Failed to get label.');
                } finally {
                    setLoading(false);
                }

            };

            reader.readAsDataURL(selectedFile);
            
        } catch {
            setError('Failed to get label.');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="bg-gray-800 rounded-2xl border-2 border-cyan-400 shadow-[0_0_32px_4px_rgba(34,211,238,0.15)] p-8 flex flex-col items-center min-w-[320px]">
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                    <label
                        htmlFor="file-upload"
                        className="mb-4 px-7 py-3 bg-cyan-300 text-gray-900 font-bold rounded-lg shadow-xl border-2 border-cyan-500 cursor-pointer hover:bg-cyan-200 hover:text-cyan-900 transition-all ring-2 ring-cyan-200"
                    >
                        {selectedFile ? selectedFile.name : 'Choose Image'}
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`center bg-cyan-400 text-gray-900 font-bold rounded-md px-6 py-2 shadow-md transition-all ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-300'
                        }`}
                    >
                        {loading ? 'Submitting...' : 'Submit Image'}
                    </button>
                </form>
                {error && <p className="text-red-400 mt-4">{error}</p>}
                {label && <p className="text-gray-100 mt-2">Label: {label}</p>}
                {submitted && !error && (
                    <p className="text-cyan-400 mt-4 font-semibold animate-pulse drop-shadow-[0_0_8px_cyan]">
                        Image has been sent!
                    </p>
                )}
            </div>
        </div>
    );
};

export default CaptionPage;