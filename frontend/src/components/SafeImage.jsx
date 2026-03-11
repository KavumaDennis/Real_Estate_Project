import React, { useState, useEffect } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';

/** Base URL for storage (backend origin). Images are served from {baseUrl}/storage/... */
const getStorageBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    return apiUrl.replace(/\/api\/?$/, '') || 'http://localhost:8000';
};

const getFrontendAssetBaseUrl = () => {
    const base = import.meta.env.BASE_URL || '/';
    return base.endsWith('/') ? base : `${base}/`;
};

/**
 * Normalize image src to a full URL. Handles:
 * - Full URLs (http/https) - use as-is
 * - data: URLs - use as-is
 * - Paths starting with / - prepend backend base URL
 * - Relative paths (e.g. "properties/xyz.jpg") - prepend baseUrl/storage/
 */
const normalizeImageSrc = (src) => {
    if (!src || typeof src !== 'string') return null;
    const trimmed = src.trim();
    if (!trimmed) return null;
    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('blob:')
    ) {
        return trimmed;
    }
    const baseUrl = getStorageBaseUrl();
    if (trimmed.startsWith('/')) {
        // Keep frontend public assets (e.g. /Residential.jpg, /bg-img.png) on the current origin.
        // Only normalize backend storage paths.
        if (trimmed.startsWith('/storage/')) {
            return baseUrl + trimmed;
        }
        const assetBase = getFrontendAssetBaseUrl();
        if (assetBase !== '/' && trimmed.startsWith(assetBase)) {
            return trimmed;
        }
        return `${assetBase}${trimmed.slice(1)}`;
    }
    // Relative path - avoid double "storage/" if path already contains it
    const path = trimmed.startsWith('storage/') ? trimmed : `storage/${trimmed}`;
    return `${baseUrl}/${path}`;
};

const SafeImage = ({ src, alt, className, ...props }) => {
    const [error, setError] = useState(false);
    const [fallbackError, setFallbackError] = useState(false);

    // Reset error when src changes (e.g. after loading new data)
    useEffect(() => {
        setError(false);
        setFallbackError(false);
    }, [src]);

    const processedSrc = normalizeImageSrc(src);
    const fallbackSrc = `${getFrontendAssetBaseUrl()}default.png`;

    if (!processedSrc || error) {
        if (fallbackError) {
            return (
                <div className={`flex flex-col items-center justify-center bg-gray-50 border border-black/5 ${className}`} {...props}>
                    <HiOutlinePhotograph className="h-10 w-10 text-gray-300 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">No Image Found</span>
                </div>
            );
        }

        return (
            <img
                src={fallbackSrc}
                alt={alt || 'default'}
                className={`${className}`}
                onError={() => setFallbackError(true)}
                {...props}
            />
        );
    }

    return (
        <img
            src={processedSrc}
            alt={alt || ''}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
};

export default SafeImage;
export { getStorageBaseUrl, normalizeImageSrc };
