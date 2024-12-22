import { SelectOption } from "../_utils";
import { cn } from "../_utils/helpers";

interface InputSelectProps extends React.HTMLAttributes<HTMLSelectElement> {
    id?: string;
    name?: string;
    value?: string;
    options: SelectOption[];
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    autoComplete?: string;
    className?: string;
    ref?: string | null
};

export default function InputSelect({
    id,
    name,
    value,
    options,
    onChange,
    autoComplete,
    className,
    ref,
    ...props
}: InputSelectProps) {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            {...props}
            className={cn(
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm',
                className ? className : ''
            )}
            ref={ref}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}