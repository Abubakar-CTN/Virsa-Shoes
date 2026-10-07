import { Heart, ShoppingCart, Star } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function ProductCard({ product }) {
    const {
        name,
        category,
        price,
        comparePrice,
        discount,
        rating,
        reviews,
        stock,
        image,
    } = product;

    return (
        <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-surface-soft">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Discount */}
                {discount > 0 && (
                    <div className="absolute left-3 top-3">
                        <Badge variant="danger">
                            -{discount}%
                        </Badge>
                    </div>
                )}

                {/* Wishlist */}
                <button
                    type="button"
                    aria-label={`Add ${name} to wishlist`}
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-sm backdrop-blur transition hover:scale-105 hover:text-brand-purple"
                >
                    <Heart className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">
                    {category}
                </p>

                <h2 className="mt-2 text-lg font-bold text-text-primary">
                    {name}
                </h2>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                        <span className="text-sm font-semibold text-text-primary">
                            {rating}
                        </span>
                    </div>

                    <span className="text-sm text-text-muted">
                        ({reviews})
                    </span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-xl font-bold text-text-primary">
                        Rs. {price.toLocaleString()}
                    </span>

                    {comparePrice && (
                        <span className="text-sm text-text-muted line-through">
                            Rs. {comparePrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock */}
                <p
                    className={`mt-2 text-sm font-medium ${stock > 0
                            ? "text-success"
                            : "text-danger"
                        }`}
                >
                    {stock > 0
                        ? `${stock} items available`
                        : "Out of stock"}
                </p>

                {/* Add to Cart */}
                <Button
                    className="mt-4 w-full"
                    disabled={stock === 0}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </div>
        </article>
    );
}

export default ProductCard;