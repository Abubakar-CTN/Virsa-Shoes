import { Star } from "lucide-react";

function Rating({
    value = 0,
    count,
    reviews,
    showValue = true,
    size = "sm",
    className = "",
}) {
    const rating = Math.min(5, Math.max(0, Number(value) || 0));
    const reviewCount = reviews ?? count;

    const starSizes = {
        sm: 14,
        md: 18,
        lg: 22,
    };

    return (
        <div
            className={`inline-flex flex-wrap items-center gap-2 ${className}`}
            aria-label={`${rating.toFixed(1)} out of 5 stars`}
        >
            <span className="inline-flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={starSizes[size] || starSizes.sm}
                        fill={star <= Math.round(rating) ? "currentColor" : "none"}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                ))}
            </span>

            {showValue && (
                <span className="text-sm font-bold text-slate-800">
                    {rating.toFixed(1)}
                </span>
            )}

            {reviewCount != null && (
                <span className="text-xs text-slate-500">
                    ({reviewCount} reviews)
                </span>
            )}
        </div>
    );
}

export default Rating;