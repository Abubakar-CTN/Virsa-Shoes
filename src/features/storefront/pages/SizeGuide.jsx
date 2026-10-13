import { Ruler, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router";

const measurementSteps = [
    {
        number: "01",
        title: "Place your foot",
        description:
            "Stand on a sheet of paper with your heel lightly touching a wall.",
    },
    {
        number: "02",
        title: "Measure the length",
        description:
            "Mark the tip of your longest toe and measure from the wall to that mark.",
    },
    {
        number: "03",
        title: "Measure both feet",
        description:
            "Use the measurement of your larger foot when comparing sizes.",
    },
];

export default function SizeGuide() {
    return (
        <section className="bg-[#FBF8F1] px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-4xl">
                <div className="text-center">
                    <div className="mx-auto mb-5 grid size-14 place-items-center rounded-xl bg-[#F3EBDD] text-[#78531F]">
                        <Ruler size={27} aria-hidden="true" />
                    </div>

                    <p className="text-xs font-bold tracking-[0.16em] text-[#78531F]">
                        FIND YOUR FIT
                    </p>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#33251B] sm:text-4xl">
                        Shoe Size Guide
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
                        A comfortable fit starts with a careful measurement.
                        Follow these steps before choosing your footwear size.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {measurementSteps.map((step) => (
                        <article
                            key={step.number}
                            className="rounded-xl border border-[#E6D8BC] bg-white p-6"
                        >
                            <span className="text-sm font-extrabold text-[#B28B3D]">
                                {step.number}
                            </span>
                            <h2 className="mt-4 text-lg font-bold text-[#33251B]">
                                {step.title}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="mt-6 flex gap-3 rounded-xl border border-[#E6D8BC] bg-white p-5">
                    <Info
                        size={21}
                        className="mt-0.5 shrink-0 text-[#78531F]"
                        aria-hidden="true"
                    />
                    <p className="text-sm leading-6 text-slate-600">
                        Shoe sizing can vary by style. Check the available
                        sizes and any fit information on the individual
                        product page before ordering.
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/shop"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#78531F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5D3D14]"
                    >
                        Explore footwear
                        <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}