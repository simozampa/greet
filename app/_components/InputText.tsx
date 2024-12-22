import { cn } from "../_utils/helpers";

interface InputTextProps extends React.HTMLAttributes<HTMLInputElement> {
    type?: string;
    name?: string;
    id?: string;
    autoComplete?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    ref?: string | null;
};

export default function InputText({
    type,
    name,
    id,
    autoComplete,
    value,
    onChange,
    required,
    className,
    ref,
    disabled,
    ...props
}: InputTextProps) {

    return (
        <input
            type={type ? type : "text"}
            name={name}
            id={id}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            {...props}
            className={cn(
                'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6 disabled:cursor-not-allowed',
                className ? className : ''
            )}
        />
    )
}