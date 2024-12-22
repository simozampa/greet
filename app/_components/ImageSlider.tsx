import Carousel from "./Carousel";
import Image from "next/image"

interface ImageSliderProps {
    images: string[]
}

export default function ImageSlider({ images }: ImageSliderProps) {

    return (
        <div className="relative w-full lg:max-w-xl rounded-xl overflow-hidden shadow-md">
            <Carousel loop>
                {images.map((src: string, index: number) => (
                    <div className="relative h-96 flex-[0_0_100%]" key={index}>
                        <Image
                            src={src}
                            fill
                            sizes="30rem"
                            priority={true}
                            className="object-cover"
                            alt="Listing image"
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}