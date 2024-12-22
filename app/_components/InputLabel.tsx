import { cn } from "../_utils/helpers";

interface InputLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
    name: string;
    htmlFor: string;
    required?: boolean;
    className?: string;
};

export default function InputLabel({ name, htmlFor, className, required, ...props }: InputLabelProps) {
    return (
        <label
            {...props}
            htmlFor={htmlFor}
            className={cn(
                'block text-sm font-medium text-gray-700',
                className ? className : ''
            )}
        >
            {name}{required ? (<span className="text-red-500">*</span>) : ''}
        </label>
    )
}