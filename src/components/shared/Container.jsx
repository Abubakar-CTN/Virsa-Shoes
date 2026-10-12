function Container({
    children,
    as: Component = "div",
    size = "xl",
    className = "",
    ...props
}) {
    const sizes = {
        sm: "max-w-3xl",
        md: "max-w-4xl",
        lg: "max-w-5xl",
        xl: "max-w-7xl",
        "2xl": "max-w-[1440px]",
        full: "max-w-none",
    };

    return (
        <Component
            className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizes[size] || sizes.xl
                } ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}

export default Container;