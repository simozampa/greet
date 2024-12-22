import React from "react";
import { cn } from "../_utils/helpers";

interface SecondaryButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function SecondaryButton({ type, className, disabled, children, ...props }: SecondaryButtonProps) {
  return (
    <>
      <button
        type={type ? type : 'button'}
        {...props}
        disabled={disabled}
        className={cn(
          
          'flex items-center justify-center text-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
          className ? className : ''
        )}
      >
        {children}
      </button >
    </>
  )
}