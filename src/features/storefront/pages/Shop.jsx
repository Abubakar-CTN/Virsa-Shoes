import { useMemo, useState } from "react";
import {
    ArrowDownUp,
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronDown,
    Heart,
    Search,
    SlidersHorizontal,
    Sparkles,
    Star,
    X,
} from "lucide-react";
import { Link } from "react-router";
import products from "../../../services/mock/products.js";

const formatPrice = (price) => `Rs ${price.toLocaleString("en-PK")}`;
const categories = [...new Set(products.map((product) => product.category))].sort();
const availableSizes = [...new Set(products.flatMap((product) => product.sizes))].sort((a, b) => Number(a) - Number(b));

const browseTiles = [
    { title: "Everyday sneakers", subtitle: "Off-duty, all day", categories: ["Sneakers"], image: "/images/shoes/sneaker-white.jpg" },
    { title: "Formal favourites", subtitle: "A sharper finish", categories: ["Formal"], image: "/images/shoes/brown-oxford.jpg" },
    { title: "Easy sandals", subtitle: "Relaxed by design", categories: ["Sandals"], image: "/images/shoes/brown-sandals-detail.jpg" },
    { title: "Flats & heels", subtitle: "A little more dressed up", categories: ["Flats", "Heels"], image: "/images/shoes/olive-heel.jpg" },
];

function ProductCard({ product, saved, onToggleSave }) {
    const discount = product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <article className="group min-w-0">
            <div className="relative overflow-hidden bg-[#F0EADF]">
                <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="block aspect-[4/4.55] overflow-hidden">
                    <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="size-full object-cover transition duration-500 ease-out group-hover:scale-[1.045]" />
                </Link>

                <div className="absolute left-3 top-3 flex max-w-[75%] flex-wrap gap-1.5">
                    {product.isNew && <span className="bg-[#FFFCF6] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.12em] text-[#3D2A1D]">NEW IN</span>}
                    {discount > 0 && <span className="bg-[#3D2A1D] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.08em] text-white">-{discount}%</span>}
                </div>

                <button type="button" onClick={() => onToggleSave(product.id)} aria-label={saved ? `Unsave ${product.name}` : `Save ${product.name}`} aria-pressed={saved} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7833C] ${saved ? "bg-[#3D2A1D] text-white" : "bg-white/95 text-[#3D2A1D] hover:bg-[#E8CC82]"}`}>
                    <Heart size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
                </button>

                <Link to={`/products/${product.slug}`} className="absolute inset-x-3 bottom-3 hidden min-h-10 items-center justify-center gap-2 bg-white/95 px-3 text-[10px] font-bold tracking-[0.08em] text-[#3D2A1D] shadow-sm transition hover:bg-[#E8CC82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7833C] sm:flex sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
                    VIEW DETAILS <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
            </div>

            <div className="pt-4">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#91764A]">{product.category}</p>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-[#6D5E4C]" title="Sample rating">
                        <Star size={12} fill="currentColor" className="text-[#B18A3A]" aria-hidden="true" />
                        {product.rating} <span className="text-[#A49683]">({product.reviews})</span>
                    </span>
                </div>
                <Link to={`/products/${product.slug}`} className="mt-1.5 block text-[13px] font-semibold leading-5 text-[#33251B] transition hover:text-[#8B672D] sm:text-sm">{product.name}</Link>
                <p className="mt-1 text-[10px] text-[#958570]">{product.colors.join(" / ")}</p>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-bold tracking-[-0.02em] text-[#33251B]">{formatPrice(product.price)}</span>
                    {product.comparePrice > product.price && <span className="text-[11px] text-[#A3998A] line-through">{formatPrice(product.comparePrice)}</span>}
                </div>
            </div>
        </article>
    );
}

function FilterTitle({ children }) {
    return <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.13em] text-[#3D2A1D]">{children}</h3>;
}

export default function Shop() {
    const [query, setQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceBand, setPriceBand] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const [newestOnly, setNewestOnly] = useState(false);
    const [saleOnly, setSaleOnly] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [savedIds, setSavedIds] = useState([]);

    const filteredProducts = useMemo(() => {
        const term = query.trim().toLowerCase();
        const result = products.filter((product) => {
            const searchable = [product.name, product.category, product.brand, ...product.colors].join(" ").toLowerCase();
            const matchesTerm = !term || searchable.includes(term);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesSize = selectedSizes.length === 0 || product.sizes.some((size) => selectedSizes.includes(size));
            const matchesPrice = priceBand === "all"
                || (priceBand === "under5000" && product.price < 5000)
                || (priceBand === "5000to7000" && product.price >= 5000 && product.price <= 7000)
                || (priceBand === "over7000" && product.price > 7000);
            const matchesNew = !newestOnly || product.isNew;
            const matchesSale = !saleOnly || product.comparePrice > product.price;
            return matchesTerm && matchesCategory && matchesSize && matchesPrice && matchesNew && matchesSale;
        });

        return result.sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "newest") return Number(b.isNew) - Number(a.isNew);
            return Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isPopular) - Number(a.isPopular);
        });
    }, [query, selectedCategories, selectedSizes, priceBand, newestOnly, saleOnly, sortBy]);

    const activeFiltersCount = selectedCategories.length + selectedSizes.length + Number(priceBand !== "all") + Number(newestOnly) + Number(saleOnly);

    function toggleCategory(category) {
        setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
    }

    function toggleSize(size) {
        setSelectedSizes((current) => current.includes(size) ? current.filter((item) => item !== size) : [...current, size]);
    }

    function clearFilters() {
        setQuery("");
        setSelectedCategories([]);
        setSelectedSizes([]);
        setPriceBand("all");
        setNewestOnly(false);
        setSaleOnly(false);
        setSortBy("featured");
    }

    function selectCollection(collection) {
        setSelectedCategories(collection.categories);
        setFiltersOpen(false);
        document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function toggleSaved(id) {
        setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    }

    const filtersPanel = (
        <div className="space-y-6 border border-[#E8DECD] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#33251B]">Refine the edit</h2>
                <button type="button" onClick={clearFilters} className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B672D] underline-offset-4 hover:underline">Reset</button>
            </div>

            <div>
                <FilterTitle>Shop by style</FilterTitle>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <label key={category} className="flex cursor-pointer items-center gap-3 text-xs text-[#6F604D]">
                            <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} className="size-4 rounded-sm accent-[#78531F]" />
                            <span className="flex-1">{category}</span>
                            <span className="text-[10px] text-[#A99B87]">{products.filter((product) => product.category === category).length}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border-t border-[#F0E8DB] pt-5">
                <FilterTitle>Price range</FilterTitle>
                <select value={priceBand} onChange={(event) => setPriceBand(event.target.value)} aria-label="Filter by price range" className="min-h-11 w-full border border-[#E5DAC7] bg-[#FFFEFC] px-3 text-xs text-[#49392B] outline-none focus:border-[#A7833C] focus:ring-2 focus:ring-[#C9A34C]/20">
                    <option value="all">All prices</option>
                    <option value="under5000">Under Rs 5,000</option>
                    <option value="5000to7000">Rs 5,000–7,000</option>
                    <option value="over7000">Over Rs 7,000</option>
                </select>
            </div>

            <div className="border-t border-[#F0E8DB] pt-5">
                <FilterTitle>Size · UK</FilterTitle>
                <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                        const selected = selectedSizes.includes(size);
                        return <button key={size} type="button" aria-pressed={selected} onClick={() => toggleSize(size)} className={`grid size-9 place-items-center border text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34C] ${selected ? "border-[#3D2A1D] bg-[#3D2A1D] text-white" : "border-[#E5DAC7] bg-white text-[#655441] hover:border-[#A7833C]"}`}>{size}</button>;
                    })}
                </div>
            </div>

            <div className="space-y-3 border-t border-[#F0E8DB] pt-5">
                <label className="flex cursor-pointer items-center gap-3 text-xs text-[#6F604D]">
                    <input type="checkbox" checked={newestOnly} onChange={(event) => setNewestOnly(event.target.checked)} className="size-4 rounded-sm accent-[#78531F]" /> New arrivals
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-xs text-[#6F604D]">
                    <input type="checkbox" checked={saleOnly} onChange={(event) => setSaleOnly(event.target.checked)} className="size-4 rounded-sm accent-[#78531F]" /> Sale styles
                </label>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FCFAF5] pb-16 text-[#33251B]">
            <section className="overflow-hidden border-b border-[#E8DECD] bg-[#F4EEE2]">
                <div className="mx-auto grid max-w-[1480px] items-center gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12 lg:px-12 lg:py-14">
                    <div className="relative z-10">
                        <nav aria-label="Breadcrumb" className="mb-7 text-[10px] font-medium tracking-[0.05em] text-[#897762]">
                            <Link to="/" className="transition hover:text-[#78531F]">Home</Link>
                            <span className="px-2 text-[#B0A18A]">/</span>
                            <span className="text-[#3D2A1D]">Shop all</span>
                        </nav>

                        <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-[#977332]">
                            <span className="h-px w-7 bg-[#B18A3A]" /> THE VIRSA EDIT · 01
                        </p>

                        <h1 className="mt-5 max-w-xl text-[42px] font-semibold leading-[1.02] tracking-[-0.065em] text-[#33251B] sm:text-6xl lg:text-[68px]">
                            Find your<br />
                            <span className="font-medium italic text-[#94733D]">everyday pair.</span>
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-[#766653] sm:text-[15px]">
                            Considered footwear for busy mornings, long days and plans that turn into something more.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <a href="#shop-results" className="inline-flex min-h-12 items-center gap-3 bg-[#3D2A1D] px-5 text-xs font-bold text-white transition hover:bg-[#78531F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7833C]">
                                Explore all styles <ArrowRight size={15} aria-hidden="true" />
                            </a>
                            <span className="text-[10px] text-[#897762]">{products.length} sample styles to explore</span>
                        </div>
                    </div>

                    <div className="relative mx-auto min-h-[275px] w-full max-w-[560px] sm:min-h-[345px]">
                        <div className="absolute inset-x-8 bottom-2 top-2 bg-[#E5D9C4] sm:inset-x-12" />
                        <div className="absolute right-3 top-0 h-[73%] w-[75%] overflow-hidden bg-[#E8E0D3] sm:right-8">
                            <img src="/images/shoes/brown-oxford.jpg" alt="Brown footwear from the sample edit" loading="eager" className="size-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 left-1 h-[54%] w-[43%] overflow-hidden border-[5px] border-[#F4EEE2] bg-[#E8E0D3] sm:left-5 sm:border-[7px]">
                            <img src="/images/shoes/black-loafers.jpg" alt="Black loafers from the sample edit" loading="eager" className="size-full object-cover" />
                        </div>
                        <div className="absolute bottom-5 right-1 max-w-[170px] bg-[#FFFCF6] p-4 shadow-[0_12px_32px_rgba(61,42,29,0.12)] sm:bottom-8 sm:right-2">
                            <p className="text-[9px] font-bold tracking-[0.18em] text-[#977332]">THE DAILY EDIT</p>
                            <p className="mt-2 text-sm font-semibold leading-5 text-[#3D2A1D]">Good design.<br />Easy choices.</p>
                        </div>
                        <div className="absolute left-5 top-5 grid size-12 place-items-center rounded-full border border-white/70 bg-[#FFFCF6]/90 text-[#8B672D] sm:left-8 sm:top-8">
                            <Sparkles size={19} aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="browse-styles-heading" className="mx-auto max-w-[1480px] px-5 pt-9 sm:px-8 sm:pt-12 lg:px-12">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[9px] font-bold tracking-[0.2em] text-[#977332]">A GOOD PLACE TO START</p>
                        <h2 id="browse-styles-heading" className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#33251B] sm:text-2xl">Browse by style</h2>
                    </div>
                    <p className="hidden text-[11px] text-[#897762] sm:block">Choose a collection to refine the edit</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {browseTiles.map((tile) => (
                        <button key={tile.title} type="button" onClick={() => selectCollection(tile)} className="group relative flex min-h-[118px] items-end overflow-hidden bg-[#EDE4D4] text-left sm:min-h-[150px]">
                            <img src={tile.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#24170F]/85 via-[#24170F]/15 to-transparent" />
                            <div className="relative flex w-full items-end justify-between gap-2 p-3.5 sm:p-4">
                                <div>
                                    <p className="text-[12px] font-semibold text-white sm:text-sm">{tile.title}</p>
                                    <p className="mt-1 text-[9px] text-white/75 sm:text-[10px]">{tile.subtitle}</p>
                                </div>
                                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/50 text-white transition group-hover:bg-[#E8CC82] group-hover:text-[#33251B]">
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section id="shop-results" className="mx-auto max-w-[1480px] scroll-mt-8 px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12">
                <div className="flex flex-col gap-5 border-b border-[#E8DECD] pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[9px] font-bold tracking-[0.2em] text-[#977332]">THE COLLECTION</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#33251B] sm:text-3xl">Shop all footwear</h2>
                        <p className="mt-2 text-xs leading-5 text-[#897762]">Sample catalogue for exploring styles, prices and sizes.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:min-w-[330px]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8A74]" aria-hidden="true" />
                            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by style or category" aria-label="Search products" className="min-h-11 w-full border border-[#E5DAC7] bg-white pl-10 pr-3 text-xs text-[#33251B] outline-none placeholder:text-[#A99B87] focus:border-[#A7833C] focus:ring-2 focus:ring-[#C9A34C]/20" />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] text-[#897762]" aria-live="polite"><span className="font-bold text-[#3D2A1D]">{filteredProducts.length}</span> styles</p>
                            <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} aria-controls="shop-mobile-filters" className="inline-flex min-h-10 items-center gap-2 border border-[#DCCDAE] bg-white px-3 text-xs font-semibold text-[#49392B] lg:hidden">
                                <SlidersHorizontal size={14} aria-hidden="true" /> Filters {activeFiltersCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-[#3D2A1D] text-[10px] text-white">{activeFiltersCount}</span>}
                            </button>
                            <label className="flex min-h-10 items-center gap-2 border border-[#E5DAC7] bg-white pl-3 pr-2">
                                <ArrowDownUp size={13} className="text-[#8C795C]" aria-hidden="true" />
                                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products" className="max-w-[175px] bg-transparent py-2 text-[11px] font-semibold text-[#49392B] outline-none">
                                    <option value="featured">Featured</option>
                                    <option value="newest">New arrivals</option>
                                    <option value="price-low">Price: low to high</option>
                                    <option value="price-high">Price: high to low</option>
                                    <option value="rating">Top rated</option>
                                </select>
                                <ChevronDown size={13} className="text-[#8C795C]" aria-hidden="true" />
                            </label>
                        </div>
                    </div>
                </div>

                <div id="shop-mobile-filters" className={`mt-5 lg:hidden ${filtersOpen ? "block" : "hidden"}`}>
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-bold text-[#33251B]">Refine your search</p>
                        <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="grid size-9 place-items-center border border-[#E8DECD] bg-white"><X size={15} aria-hidden="true" /></button>
                    </div>
                    {filtersPanel}
                </div>

                <div className="grid items-start gap-8 py-7 lg:grid-cols-[225px_minmax(0,1fr)] lg:gap-8 lg:py-8 xl:grid-cols-[245px_minmax(0,1fr)] xl:gap-10">
                    <aside className="hidden lg:sticky lg:top-6 lg:block">{filtersPanel}</aside>

                    <div className="min-w-0">
                        {(activeFiltersCount > 0 || query.trim()) && (
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#897762]">Active filters</span>
                                {selectedCategories.map((category) => <button key={category} type="button" onClick={() => toggleCategory(category)} className="inline-flex min-h-7 items-center gap-1.5 border border-[#E8DECD] bg-white px-2.5 text-[10px] text-[#655441]">{category}<X size={11} aria-hidden="true" /></button>)}
                                {selectedSizes.map((size) => <button key={size} type="button" onClick={() => toggleSize(size)} className="inline-flex min-h-7 items-center gap-1.5 border border-[#E8DECD] bg-white px-2.5 text-[10px] text-[#655441]">Size {size}<X size={11} aria-hidden="true" /></button>)}
                                {query.trim() && <button type="button" onClick={() => setQuery("")} className="inline-flex min-h-7 items-center gap-1.5 border border-[#E8DECD] bg-white px-2.5 text-[10px] text-[#655441]">“{query.trim()}”<X size={11} aria-hidden="true" /></button>}
                                <button type="button" onClick={clearFilters} className="ml-auto text-[10px] font-bold text-[#8B672D] underline-offset-4 hover:underline">Clear all</button>
                            </div>
                        )}

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-9 min-[600px]:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-5">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} saved={savedIds.includes(product.id)} onToggleSave={toggleSaved} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-[#DCCDAE] bg-white px-6 text-center">
                                <div className="grid size-12 place-items-center bg-[#F5EFE3] text-[#78531F]"><Search size={19} aria-hidden="true" /></div>
                                <h3 className="mt-4 text-lg font-semibold text-[#33251B]">No styles found</h3>
                                <p className="mt-2 max-w-sm text-xs leading-6 text-[#81715E]">Try a broader search or remove one of your filters.</p>
                                <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#3D2A1D] px-5 text-xs font-bold text-white transition hover:bg-[#78531F]"><Check size={14} aria-hidden="true" /> Clear filters</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-between gap-4 border-t border-[#E8DECD] pt-5 sm:flex-row sm:items-center">
                    <p className="max-w-2xl text-[10px] leading-5 text-[#978771]">Demo catalogue: prices, ratings and stock are sample data. Saved hearts are temporary page state; persistent wishlist and live inventory will be connected later.</p>
                    <Link to="/size-guide" className="inline-flex min-h-10 shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#78531F] underline-offset-4 hover:underline">Need help with sizing? <ArrowRight size={13} aria-hidden="true" /></Link>
                </div>
            </section>
        </main>
    );
}