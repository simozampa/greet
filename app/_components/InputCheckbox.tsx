import { cn } from "../_utils/helpers";

interface InputCheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
    type?: string;
    name?: string;
    id?: string;
    autoComplete?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    ref?: string | null;
    checked?: boolean
};

export default function InputCheckbox({
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
    checked,
    ...props
}: InputCheckboxProps) {

    return (
        <input
            type="checkbox"
            name={name}
            id={id}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            checked={checked}
            {...props}
            className={cn(
                'h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900',
                className ? className : ''
            )}
        />
    )
}