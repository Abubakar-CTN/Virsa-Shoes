import { forwardRef } from "react";
import clsx from "clsx";

const Button = forwardRef(
    function Button(
        {
            children,
            variant = "primary",
            size = "md",
            className,
            type = "button",
            ...props
        },
        ref
    ) {
        const variants = {
            primary:
                "bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl",

            secondary:
                "bg-brand-sky text-white shadow-md hover:bg-brand-blue",

            outline:
                "border border-border bg-surface text-text-primary hover:border-brand-purple hover:text-brand-purple",

            ghost:
                "bg-transparent text-text-primary hover:bg-surface-soft",

            danger:
                "bg-danger text-white hover:bg-red-700",
        };

        const sizes = {
            sm: "px-3 py-2 text-sm",
            md: "px-5 py-3 text-sm",
            lg: "px-6 py-3.5 text-base",
        };

        return (
            <button
                ref={ref}
                type={type}
                className={clsx(
                    "inline-flex items-center justify-center rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 disabled:cursor-not-allowed disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

export default Button;