import React, { useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';

const SafeImage = ({ src, alt, className, ...props }) => {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-50 border border-black/5 ${className}`} {...props}>
                <HiOutlinePhotograph className="h-10 w-10 text-gray-300 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">No Image Found</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
};

export default SafeImage;
