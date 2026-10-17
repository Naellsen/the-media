"use client";
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCard from "@/components/MediaCard";

export default function MediaRow({ title, items }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollPosition = () => {
        const { current } = scrollRef;
        if (current) {
            const { scrollLeft, scrollWidth, clientWidth } = current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    useEffect(() => {
        // Run check after component mounts and DOM paints
        const timer = setTimeout(checkScrollPosition, 100);
        window.addEventListener('resize', checkScrollPosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScrollPosition);
        };
    }, [items]);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -current.clientWidth : current.clientWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 300);
        }
    };

    return (
        <section className="px-4 sm:px-8 md:px-12 py-4 relative">
            <h1 className="text-lg md:text-xl font-bold text-white mb-3 px-2">{title}</h1>
            
            <div className="relative px-2">
                {/* Left Arrow - Hidden on mobile, visible on desktop when scrollable */}
                {canScrollLeft && (
                    <button 
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 transition shadow-xl border border-slate-700 items-center justify-center cursor-pointer"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Scrollable Container */}
                <div 
                    ref={scrollRef} 
                    onScroll={checkScrollPosition}
                    className="flex flex-nowrap overflow-x-auto gap-3 sm:gap-4 pb-4 scroll-smooth no-scrollbar touch-pan-x"
                >
                    {items.map((item, index) => (
                        <div key={item.id} className="flex-none w-36 sm:w-44 md:w-52">
                            <MediaCard item={item} index={index}/>
                        </div>
                    ))}
                </div>

                {canScrollRight && (
                    <button 
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 transition shadow-xl border border-slate-700 items-center justify-center cursor-pointer"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </section>
    );
}