import { cn } from "../_utils/helpers";

interface InputSuccessProps extends React.HTMLAttributes<HTMLSpanElement> {
    successMessage?: string;
    className?: string;
};

export default function InputSuccess({ successMessage, className, ...props }: InputSuccessProps) {
    return successMessage ? (
        <span {...props}
            className={cn(
                'text-green-500 mt-1 text-xs',
                className ? className : ''
            )}
        >
            {successMessage}
        </span>
    ) : null;
}