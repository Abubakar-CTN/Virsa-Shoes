import { MessageSquareText, ShieldCheck, Star } from "lucide-react";

export default function ProductReviews({ product }) {
    const rating = Math.min(
        5,
        Math.max(0, Number(product.rating) || 0)
    );

    const reviewCount = Math.max(
        0,
        Math.floor(Number(product.reviews) || 0)
    );

    const ratingPercentage = (rating / 5) * 100;

    const formattedRating = rating.toFixed(1);

    return (
        <section
            id="reviews"
            aria-labelledby="product-reviews-heading"
            className="mt-16 scroll-mt-24 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12"
        >
            {/* Section heading */}
            <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-violet-700">
                    CUSTOMER FEEDBACK
                </p>

                <h2
                    id="product-reviews-heading"
                    className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
                >
                    Ratings & reviews
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Explore the rating summary for this footwear style.
                </p>
            </div>

            {/* Rating summary */}
            <div className="mt-6 grid gap-6 border border-slate-200 bg-white p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center sm:p-7">
                <div className="sm:border-r sm:border-slate-200 sm:pr-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                        Overall rating
                    </p>

                    <div className="mt-3 flex items-center gap-2.5">
                        <span className="text-5xl font-extrabold tracking-[-0.05em] text-slate-950">
                            {formattedRating}
                        </span>

                        <Star
                            size={27}
                            fill="currentColor"
                            strokeWidth={1.5}
                            className="text-amber-500"
                            aria-hidden="true"
                        />
                    </div>

                    {/* Visual rating indicator */}
                    <div
                        className="mt-3"
                        role="img"
                        aria-label={`${formattedRating} out of 5 stars`}
                    >
                        <div className="relative inline-flex overflow-hidden">
                            <div className="flex gap-1 text-slate-200">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <Star
                                        key={index}
                                        size={17}
                                        fill="currentColor"
                                        strokeWidth={1}
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>

                            <div
                                className="absolute inset-y-0 left-0 overflow-hidden text-amber-500"
                                style={{ width: `${ratingPercentage}%` }}
                                aria-hidden="true"
                            >
                                <div className="flex w-max gap-1">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            key={index}
                                            size={17}
                                            fill="currentColor"
                                            strokeWidth={1}
                                            className="shrink-0"
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        Based on the product catalog summary
                    </p>
                </div>

                {/* Review count information */}
                <div className="flex items-start gap-4">
                    <div className="grid size-11 shrink-0 place-items-center bg-violet-50 text-violet-700">
                        <MessageSquareText
                            size={21}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-slate-950">
                            {reviewCount.toLocaleString("en-PK")}{" "}
                            {reviewCount === 1 ? "review" : "reviews"}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            This is the review count currently available
                            in the mock product data.
                        </p>

                        <div className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-4">
                            <ShieldCheck
                                size={17}
                                className="mt-0.5 shrink-0 text-emerald-700"
                                aria-hidden="true"
                            />

                            <p className="text-xs leading-5 text-slate-500">
                                Individual customer comments and verified
                                purchase records are not connected yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Written reviews placeholder */}
            <div className="mt-5 flex flex-col items-center border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center sm:py-10">
                <div className="grid size-12 place-items-center bg-white text-slate-500 shadow-sm">
                    <MessageSquareText
                        size={22}
                        aria-hidden="true"
                    />
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-slate-900">
                    Customer stories are coming soon
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Written reviews will appear here when a real review
                    data source is connected. We won't display invented
                    customer feedback.
                </p>
            </div>
        </section>
    );
}