'use client'

import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import React from "react";
import { PropsWithChildren, useEffect, useState } from "react";
import CarouselDots from "./CarouselDots";

// Define the props
type Props = PropsWithChildren & EmblaOptionsType;

const Carousel = ({ children, ...options }: Props) => {
    // 1. useEmblaCarousel returns a emblaRef and we must attach the ref to a container.
    // EmblaCarousel will use that ref as basis for swipe and other functionality.
    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    // We need to track the selectedIndex to allow this component to re-render in react.
    // Since emblaRef is a ref, it won't re-render even if there are internal changes to its state.
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        function selectHandler() {
            // selectedScrollSnap gives us the current selected index.
            const index = emblaApi?.selectedScrollSnap();
            setSelectedIndex(index || 0);
        }

        emblaApi?.on("select", selectHandler);
        // cleanup
        return () => {
            emblaApi?.off("select", selectHandler);
        };
    }, [emblaApi]);

    const length = React.Children.count(children);

    return (
        // Attach ref to a div
        // 2. The wrapper div must have overflow:hidden
        <>
            <div ref={emblaRef}>
                {/* 3. The inner div must have a display:flex property */}
                {/* 4. We pass the children as-is so that the outside component can style it accordingly */}
                <div className="flex">{children}</div>
            </div>
            <CarouselDots itemsLength={length} selectedIndex={selectedIndex} />
        </>


    );
};
export default Carousel;