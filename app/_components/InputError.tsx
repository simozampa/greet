import { cn } from "../_utils/helpers";

interface InputErrorProps extends React.HTMLAttributes<HTMLSpanElement> {
    errorMessage?: string;
    className?: string;
};

export default function InputError({ errorMessage, className, ...props }: InputErrorProps) {
    return errorMessage ? (
        <span {...props}
            className={cn(
                'text-red-500 mt-1 text-xs',
                className ? className : ''
            )}
        >
            {errorMessage}
        </span>
    ) : null;
}