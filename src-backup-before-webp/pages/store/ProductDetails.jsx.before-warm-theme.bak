import { useParams, Link } from "react-router";
import {
    ArrowLeft,
    Heart,
    ShoppingCart,
    Star,
} from "lucide-react";

import products from "../../services/mock/products";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

function ProductDetails() {
    const { slug } = useParams();

    const product = products.find(
        (item) => item.slug === slug
    );

    if (!product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-surface-muted px-6">
                <div className="text-center">
                    <p className="text-6xl font-black text-brand-purple">
                        404
                    </p>

                    <h1 className="mt-4 text-3xl font-bold text-text-primary">
                        Product Not Found
                    </h1>

                    <p className="mt-3 text-text-secondary">
                        The product you are looking for does not exist.
                    </p>

                    <Link
                        to="/shop"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white transition hover:bg-brand-purple-dark"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-surface-muted px-6 py-12">
            <div className="mx-auto max-w-7xl">

                {/* Back Link */}
                <Link
                    to="/shop"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-brand-purple"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Shop
                </Link>

                {/* Product */}
                <div className="grid gap-10 rounded-3xl bg-surface p-6 shadow-lg md:grid-cols-2 md:p-10">

                    {/* Image */}
                    <div className="relative overflow-hidden rounded-2xl bg-surface-soft">
                        {product.discount > 0 && (
                            <div className="absolute left-4 top-4 z-10">
                                <Badge variant="danger">
                                    -{product.discount}%
                                </Badge>
                            </div>
                        )}

                        <img
                            src={product.image}
                            alt={product.name}
                            className="aspect-square h-full w-full object-cover"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col justify-center">

                        <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple">
                            {product.category}
                        </p>

                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-text-primary">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="mt-4 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />

                                <span className="font-semibold text-text-primary">
                                    {product.rating}
                                </span>
                            </div>

                            <span className="text-sm text-text-muted">
                                ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mt-6 flex items-center gap-3">
                            <span className="text-3xl font-bold text-text-primary">
                                Rs. {product.price.toLocaleString()}
                            </span>

                            {product.comparePrice && (
                                <span className="text-lg text-text-muted line-through">
                                    Rs. {product.comparePrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="mt-4">
                            {product.stock > 0 ? (
                                <Badge variant="success">
                                    {product.stock} items available
                                </Badge>
                            ) : (
                                <Badge variant="danger">
                                    Out of Stock
                                </Badge>
                            )}
                        </div>

                        {/* Sizes */}
                        <div className="mt-8">
                            <h2 className="mb-3 text-sm font-semibold text-text-primary">
                                Select Size
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-brand-purple hover:text-brand-purple"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="mt-6">
                            <h2 className="mb-3 text-sm font-semibold text-text-primary">
                                Select Color
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-brand-purple hover:text-brand-purple"
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button
                                size="lg"
                                disabled={product.stock === 0}
                                className="flex-1 sm:flex-none"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>

                            <button
                                type="button"
                                aria-label={`Add ${product.name} to wishlist`}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-text-primary transition hover:border-brand-purple hover:text-brand-purple"
                            >
                                <Heart className="h-5 w-5" />
                            </button>
                        </div>

                        {/* SKU */}
                        <p className="mt-6 text-sm text-text-muted">
                            SKU: VIRSA-{product.id.toString().padStart(4, "0")}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductDetails;