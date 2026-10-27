import products from "../../services/mock/products";
import ProductGrid from "../../components/store/ProductGrid";

function Shop() {
    return (
        <main className="min-h-screen bg-surface-muted px-6 py-12">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple">
                        Virsa.Shoe
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                        Shop All Footwear
                    </h1>

                    <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
                        Explore our latest collection of premium footwear designed for
                        comfort, quality, and everyday style.
                    </p>
                </div>

                {/* Product Grid */}
                <ProductGrid products={products} />
            </div>
        </main>
    );
}

export default Shop;