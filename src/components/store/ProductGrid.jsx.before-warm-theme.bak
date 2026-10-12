import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
    if (products.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
                <p className="text-text-secondary">
                    No products found.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}

export default ProductGrid;