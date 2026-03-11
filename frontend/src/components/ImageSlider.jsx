import { useEffect, useMemo, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SafeImage from './SafeImage';

const ImageSlider = ({
    images = [],
    autoPlayMs = 4500,
    className = '',
    imageClassName = '',
    showArrows = true,
    showIndicators = true,
}) => {
    const slides = useMemo(() => images.filter(Boolean), [images]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length < 2 || !autoPlayMs) return undefined;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, autoPlayMs);
        return () => clearInterval(timer);
    }, [slides.length, autoPlayMs]);

    if (!slides.length) {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <SafeImage src={null} className={`w-full h-full object-cover ${imageClassName}`} alt="" />
            </div>
        );
    }

    const goPrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

    return (
        <div className={`relative overflow-hidden w-full h-full z-10 ${className}`}>
            {slides.map((src, idx) => (
                <div
                    key={`${src}-${idx}`}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                        idx === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                    style={{
                        backgroundImage: `url("${src}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <span className={`block w-full h-full ${imageClassName}`} aria-hidden="true" />
                </div>
            ))}

            {showArrows && slides.length > 1 && (
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-20">
                    <button
                        type="button"
                        onClick={goPrev}
                        className="h-10 w-10 border border-white/30 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                        aria-label="Previous slide"
                    >
                        <HiChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="h-10 w-10 border border-white/30 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                        aria-label="Next slide"
                    >
                        <HiChevronRight className="h-6 w-6" />
                    </button>
                </div>
            )}

            {showIndicators && slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={`indicator-${idx}`}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                                idx === activeIndex ? 'w-8 bg-amber-500' : 'w-3 bg-white/50 hover:bg-white'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
