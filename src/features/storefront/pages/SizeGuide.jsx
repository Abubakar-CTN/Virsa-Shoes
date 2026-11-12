
import { useMemo, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Info,
    Ruler,
} from "lucide-react";
import { Link } from "react-router";

const measurementSteps = [
    {
        number: "01",
        title: "Prepare your foot",
        description:
            "Place a sheet of paper on a hard, flat floor with one edge against a straight wall. Measure without shoes.",
    },
    {
        number: "02",
        title: "Mark your longest toe",
        description:
            "Stand naturally with your heel lightly touching the wall. Mark the tip of your longest toe on the paper.",
    },
    {
        number: "03",
        title: "Measure the length",
        description:
            "Measure from the wall-side heel position to the toe mark. Record the result in centimetres or inches.",
    },
];

const fittingTips = [
    "Measure both feet rather than assuming they are identical.",
    "Use the measurement of your larger foot when checking a size.",
    "Measure later in the day when your feet may be slightly larger.",
    "Your longest toe may not always be your big toe.",
    "Check the available sizes and fit information on each product page.",
];

export default function SizeGuide() {
    const [unit, setUnit] = useState("cm");
    const [footLength, setFootLength] = useState("");

    const measurement = useMemo(() => {
        if (footLength.trim() === "") return null;

        const value = Number(footLength);
        const maxLength = unit === "cm" ? 40 : 15.75;

        if (
            !Number.isFinite(value) ||
            value <= 0 ||
            value > maxLength
        ) {
            return null;
        }

        const centimetres =
            unit === "cm" ? value : value * 2.54;

        const inches =
            unit === "in" ? value : value / 2.54;

        return {
            centimetres: centimetres.toFixed(1),
            inches: inches.toFixed(2),
        };
    }, [footLength, unit]);

    function handleUnitChange(nextUnit) {
        if (nextUnit === unit) return;

        if (footLength.trim() !== "") {
            const value = Number(footLength);
            const maxLength = unit === "cm" ? 40 : 15.75;

            if (
                Number.isFinite(value) &&
                value > 0 &&
                value <= maxLength
            ) {
                const converted =
                    unit === "cm"
                        ? value / 2.54
                        : value * 2.54;

                setFootLength(
                    nextUnit === "cm"
                        ? converted.toFixed(1)
                        : converted.toFixed(2),
                );
            } else {
                setFootLength("");
            }
        }

        setUnit(nextUnit);
    }

    const hasInvalidMeasurement =
        footLength.trim() !== "" && measurement === null;

    return (
        <main className="min-h-screen bg-white text-[#0F172A]">
            {/* Breadcrumb */}
            <div className="border-b border-[#E2E8F0]">
                <nav
                    aria-label="Breadcrumb"
                    className="mx-auto flex max-w-[1200px] items-center gap-2 px-5 py-4 text-xs text-slate-500 sm:px-8 lg:px-10"
                >
                    <Link
                        to="/"
                        className="transition-colors hover:text-[#6D28D9]"
                    >
                        Home
                    </Link>

                    <span aria-hidden="true">/</span>

                    <Link
                        to="/shop"
                        className="transition-colors hover:text-[#6D28D9]"
                    >
                        Shop
                    </Link>

                    <span aria-hidden="true">/</span>

                    <span
                        aria-current="page"
                        className="font-medium text-[#0F172A]"
                    >
                        Size Guide
                    </span>
                </nav>
            </div>

            {/* Hero and Measurement Converter */}
            <section className="bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:py-20">
                    <div>
                        <div className="grid size-12 place-items-center rounded-xl bg-[#F3E8FF] text-[#6D28D9]">
                            <Ruler size={24} aria-hidden="true" />
                        </div>

                        <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            FIND YOUR FIT
                        </p>

                        <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-0.05em] sm:text-5xl">
                            The right fit starts with a measurement.
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            A few careful measurements can help you
                            understand your foot length before choosing
                            your next pair. Follow the guide and keep
                            your measurement handy while shopping.
                        </p>

                        <a
                            href="#how-to-measure"
                            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
                        >
                            Learn how to measure
                            <ArrowRight size={16} aria-hidden="true" />
                        </a>
                    </div>

                    {/* Foot Length Converter */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.16em] text-[#6D28D9]">
                                    MEASUREMENT TOOL
                                </p>

                                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                                    Foot length converter
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Convert your measurement between units.
                                </p>
                            </div>

                            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                                <Ruler size={19} aria-hidden="true" />
                            </span>
                        </div>

                        <div className="mt-7">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="foot-length"
                                    className="text-sm font-semibold text-[#0F172A]"
                                >
                                    Enter your foot length
                                </label>

                                <div
                                    role="group"
                                    aria-label="Measurement unit"
                                    className="flex rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1"
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleUnitChange("cm")}
                                        aria-pressed={unit === "cm"}
                                        className={`min-h-8 min-w-12 rounded-md px-3 text-xs font-semibold transition-colors ${unit === "cm"
                                                ? "bg-[#6D28D9] text-white"
                                                : "text-slate-600 hover:text-[#6D28D9]"
                                            }`}
                                    >
                                        CM
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleUnitChange("in")}
                                        aria-pressed={unit === "in"}
                                        className={`min-h-8 min-w-12 rounded-md px-3 text-xs font-semibold transition-colors ${unit === "in"
                                                ? "bg-[#6D28D9] text-white"
                                                : "text-slate-600 hover:text-[#6D28D9]"
                                            }`}
                                    >
                                        IN
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    id="foot-length"
                                    type="number"
                                    min="0.1"
                                    max={unit === "cm" ? "40" : "15.75"}
                                    step={unit === "cm" ? "0.1" : "0.01"}
                                    inputMode="decimal"
                                    value={footLength}
                                    onChange={(event) =>
                                        setFootLength(event.target.value)
                                    }
                                    placeholder={
                                        unit === "cm"
                                            ? "e.g. 25.5"
                                            : "e.g. 10.04"
                                    }
                                    aria-invalid={hasInvalidMeasurement}
                                    aria-describedby="measurement-help"
                                    className="h-14 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 pr-14 text-lg font-semibold tabular-nums outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/15 aria-[invalid=true]:border-red-500"
                                />

                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                                    {unit}
                                </span>
                            </div>

                            <p
                                id="measurement-help"
                                className="mt-2 text-xs leading-5 text-slate-500"
                            >
                                {unit === "cm"
                                    ? "Enter a positive measurement in centimetres, up to 40 cm."
                                    : "Enter a positive measurement in inches, up to 15.75 inches."}
                            </p>
                        </div>

                        {measurement ? (
                            <div
                                aria-live="polite"
                                className="mt-6 grid grid-cols-2 gap-3"
                            >
                                <div className="rounded-lg border border-[#DDD6FE] bg-[#FAF8FF] p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                        Centimetres
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold tabular-nums text-[#6D28D9]">
                                        {measurement.centimetres}
                                        <span className="ml-1 text-xs font-medium">
                                            cm
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                        Inches
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold tabular-nums text-[#0F172A]">
                                        {measurement.inches}
                                        <span className="ml-1 text-xs font-medium">
                                            in
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : hasInvalidMeasurement ? (
                            <p
                                role="alert"
                                className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                            >
                                Enter a valid positive foot length within
                                the permitted measurement range.
                            </p>
                        ) : (
                            <div className="mt-6 rounded-lg bg-[#F8FAFC] p-4">
                                <p className="text-xs leading-6 text-slate-600">
                                    Your centimetre and inch measurements
                                    will appear here after you enter a
                                    valid length.
                                </p>
                            </div>
                        )}

                        <div className="mt-5 flex items-start gap-2 border-t border-[#E2E8F0] pt-4">
                            <Info
                                size={16}
                                className="mt-0.5 shrink-0 text-[#6D28D9]"
                                aria-hidden="true"
                            />

                            <p className="text-xs leading-5 text-slate-500">
                                This tool converts length units only. It
                                does not calculate or recommend a shoe size.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Measurement Instructions */}
            <section
                id="how-to-measure"
                className="mx-auto max-w-[1200px] scroll-mt-8 px-5 py-14 sm:px-8 sm:py-20 lg:px-10"
            >
                <div className="max-w-2xl">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                        THREE SIMPLE STEPS
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                        How to measure your feet.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                        Follow these steps carefully to get a useful
                        heel-to-toe measurement.
                    </p>
                </div>

                <div className="mt-9 grid gap-4 md:grid-cols-3">
                    {measurementSteps.map((step) => (
                        <article
                            key={step.number}
                            className="border border-[#E2E8F0] bg-white p-6 sm:p-7"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-[0.16em] text-[#6D28D9]">
                                    STEP {step.number}
                                </span>

                                <Ruler
                                    size={20}
                                    className="text-slate-400"
                                    aria-hidden="true"
                                />
                            </div>

                            <h3 className="mt-7 text-lg font-semibold">
                                {step.title}
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Fitting Advice */}
            <section className="border-y border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1200px] gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            BEFORE YOU CHOOSE
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
                            A better fit begins with the details.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            Foot measurements are a useful starting
                            point. The shape and fit of footwear can
                            differ between products, so always review
                            the information provided for the pair you
                            plan to buy.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {fittingTips.map((tip) => (
                            <div
                                key={tip}
                                className="flex items-start gap-3 border-b border-[#E2E8F0] pb-4 last:border-0"
                            >
                                <CheckCircle2
                                    size={19}
                                    className="mt-0.5 shrink-0 text-[#6D28D9]"
                                    aria-hidden="true"
                                />

                                <p className="text-sm leading-6 text-slate-600">
                                    {tip}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Sizing Information */}
            <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
                <div className="rounded-xl border border-[#DDD6FE] bg-[#FAF8FF] p-6 sm:p-9">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Check the size on each product.
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                A universal Virsa.Shoe size-to-centimetre
                                conversion has not been verified across
                                the current product range. Review each
                                product's available size options and
                                fit information before ordering.
                            </p>
                        </div>

                        <Link
                            to="/shop"
                            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                        >
                            Browse footwear
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        to="/faq"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
                    >
                        Still have a question?
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
