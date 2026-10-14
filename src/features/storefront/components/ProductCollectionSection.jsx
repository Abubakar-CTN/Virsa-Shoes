import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function ProductCollectionSection({
    eyebrow,
    title,
    description,
    products = [],
    linkTo = "/shop",
    linkText = "Explore collection",
    renderProduct,
}) {
    if (!products.length) return null;

    return (
        <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div className="max-w-2xl">
                    <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-[#78531F]">
                        {eyebrow}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#3D2A1D] sm:text-3xl lg:text-[38px]">
                        {title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                </div>

                <Link
                    to={linkTo}
                    className="inline-flex w-fit items-center gap-2 border-b border-[#78531F] pb-1 text-xs font-semibold text-[#3D2A1D] hover:text-[#78531F]"
                >
                    {linkText}
                    <ArrowRight size={15} aria-hidden="true" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                {products.map((product) => (
                    <Fragment key={product.slug}>
                        {renderProduct(product)}
                    </Fragment>
                ))}
            </div>
        </section>
    );
}