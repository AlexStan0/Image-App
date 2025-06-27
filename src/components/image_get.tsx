'use client';

import React, { useState } from 'react';

const ImageGet: React.FC = () => {
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
                const base64 = reader.result as string;
                const encoded = encodeURIComponent(base64);
                const res = await fetch(`/api/label?image=${encoded}`);
                if (!res.ok) throw new Error('API error');
                const data = await res.json();
                setLabel(data.label || 'No label found');
                setSubmitted(true);
            };
            reader.readAsDataURL(selectedFile);
        } catch {
            setError('Failed to get label.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-[#111] rounded-2xl border-2 border-cyan-400 shadow-[0_0_32px_4px_rgba(34,211,238,0.6)] p-8 flex flex-col items-center min-w-[320px]">
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mb-4 text-white"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`center bg-cyan-400 text-black font-bold rounded-md px-6 py-2 shadow-md transition-all ${
                            loading
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-cyan-300'
                        }`}
                    >
                        {loading ? 'Submitting...' : 'Submit Image'}
                    </button>
                </form>
                {error && <p className="text-red-400 mt-4">{error}</p>}
                {label && <p className="text-white mt-2">Label: {label}</p>}
                {submitted && !error && (
                    <p className="text-cyan-400 mt-4 font-semibold animate-pulse drop-shadow-[0_0_8px_cyan]">
                        Image has been sent!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ImageGet;