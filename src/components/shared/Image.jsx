import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

function Image({
    src,
    alt = "",
    className = "",
    wrapperClassName = "",
    loading = "lazy",
    fallback,
    objectFit = "cover",
    ...props
}) {
    const [failed, setFailed] = useState(!src);

    useEffect(() => {
        setFailed(!src);
    }, [src]);

    if (!src || failed) {
        return (
            <div
                role="img"
                aria-label={alt || "Image unavailable"}
                className={`flex items-center justify-center overflow-hidden bg-slate-100 text-slate-400 ${wrapperClassName} ${className}`}
            >
                {fallback || <ImageOff size={28} aria-hidden="true" />}
            </div>
        );
    }

    return (
        <img
            {...props}
            src={src}
            alt={alt}
            loading={loading}
            onError={() => setFailed(true)}
            className={`${objectFit === "contain" ? "object-contain" : "object-cover"} ${className}`}
        />
    );
}

export default Image;