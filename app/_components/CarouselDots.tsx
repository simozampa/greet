import { cn } from "../_utils/helpers";

type Props = {
    itemsLength: number;
    selectedIndex: number;
};
const Dots = ({ itemsLength, selectedIndex }: Props) => {
    const arr = new Array(itemsLength).fill(0);
    return (
        <div className="absolute flex gap-1 -translate-y-4 left-1/2 -translate-x-1/2">
            {arr.map((_, index) => {
                const selected = index === selectedIndex;
                return (
                    <div
                        key={index}
                        className={cn({
                            "h-2 w-2 rounded-full transition-all duration-300 bg-white ring-[0.3px] ring-gray-900":
                                true,
                            // tune down the opacity if slide is not selected
                            "opacity-50": !selected,
                        })}
                    >
                    </div>
                );
            })}
        </div>
    );
};
export default Dots;