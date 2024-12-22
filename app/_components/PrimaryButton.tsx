import React from "react";
import { cn } from "../_utils/helpers";

interface PrimaryButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function PrimaryButton({ type, className, disabled, children, ...props }: PrimaryButtonProps) {
  return (
    <>
      <button
        type={type ? type : 'button'}
        {...props}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center text-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-600',
          className ? className : ''
        )}
      >
        {children}
      </button >
    </>
  )
}