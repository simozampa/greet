import { cn } from "../_utils/helpers";

interface InputTextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
    type?: string;
    name?: string;
    id?: string;
    autoComplete?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    className?: string;
    ref?: string | null
};

export default function InputTextArea({
    type,
    name,
    id,
    autoComplete,
    value,
    onChange,
    required,
    className,
    ref,
    ...props
}: InputTextAreaProps) {

    return (
        <textarea
            name={name}
            id={id}
            autoComplete={autoComplete}
            value={value}
            required={required}
            onChange={onChange}
            rows={3}
            className={cn(
                'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6',
                className ? className : ''
            )}
            {...props}
        />
    )
}