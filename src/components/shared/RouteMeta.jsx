import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import products from "../../services/mock/products.js";

const DEFAULT_META = {
    "/": {
        title: "Virsa.Shoe | Step Into Your Own Style",
        description:
            "Discover modern footwear with Virsa.Shoe. Explore shoes designed for everyday comfort and personal style.",
    },
    "/shop": {
        title: "Shop Shoes | Virsa.Shoe",
        description:
            "Explore footwear styles for everyday wear and different occasions at Virsa.Shoe.",
    },
    "/search": {
        title: "Search Footwear | Virsa.Shoe",
        description:
            "Find footwear using the Virsa.Shoe product search.",
    },
    "/cart": {
        title: "Shopping Bag | Virsa.Shoe",
        description:
            "Review the footwear selected in your Virsa.Shoe shopping bag.",
    },
    "/wishlist": {
        title: "My Wishlist | Virsa.Shoe",
        description:
            "Review your saved footwear selections at Virsa.Shoe.",
    },
    "/checkout": {
        title: "Checkout | Virsa.Shoe",
        description:
            "Review your order details before completing checkout at Virsa.Shoe.",
    },
    "/about": {
        title: "About Us | Virsa.Shoe",
        description:
            "Learn more about Virsa.Shoe and our footwear storefront.",
    },
    "/contact": {
        title: "Contact Us | Virsa.Shoe",
        description:
            "Contact the Virsa.Shoe team for assistance with products and orders.",
    },
    "/faq": {
        title: "Frequently Asked Questions | Virsa.Shoe",
        description:
            "Find answers to common questions about shopping at Virsa.Shoe.",
    },
    "/track-order": {
        title: "Track Your Order | Virsa.Shoe",
        description:
            "Check your order status using the available tracking details.",
    },
    "/size-guide": {
        title: "Footwear Size Guide | Virsa.Shoe",
        description:
            "Use the Virsa.Shoe size guide to help choose your footwear size.",
    },
    "/store-locator": {
        title: "Store Locator | Virsa.Shoe",
        description:
            "Find store information available through Virsa.Shoe.",
    },
};

const PRIVATE_PREFIXES = [
    "/admin",
    "/owner",
    "/account",
    "/customer",
    "/cart",
    "/checkout",
    "/wishlist",
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/track-order",
];

const FALLBACK_DESCRIPTION =
    "Explore footwear and discover your style with Virsa.Shoe.";

function normalizePath(pathname) {
    if (pathname === "/") return "/";
    return pathname.replace(/\/+$/, "");
}

function getProductMeta(pathname) {
    const match = pathname.match(/^\/products\/([^/]+)$/);

    if (!match) return null;

    let slug;

    try {
        slug = decodeURIComponent(match[1]);
    } catch {
        slug = match[1];
    }

    const product = products.find((item) => item.slug === slug);

    if (!product) {
        return {
            title: "Product Not Found | Virsa.Shoe",
            description:
                "This footwear product could not be found. Explore the Virsa.Shoe shop to discover other styles.",
        };
    }

    return {
        title: `${product.name} | VIRSA.SHOE`,
        description:
            product.description ||
            `Discover ${product.name} by ${product.brand || "Virsa"}. Explore product details and available options at Virsa.Shoe.`,
    };
}

function readOwnerMeta(pathname) {
    try {
        const saved = localStorage.getItem(
            "virsa.owner.seo-pages.v1",
        );

        if (!saved) return null;

        const pages = JSON.parse(saved);

        if (!Array.isArray(pages)) return null;

        return (
            pages.find(
                (page) =>
                    typeof page.path === "string" &&
                    normalizePath(page.path) === pathname,
            ) || null
        );
    } catch {
        return null;
    }
}

function ensureMeta(selector, attribute, key, content) {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    element.setAttribute("content", content);
}

function applyMetadata(pathname) {
    const isPrivate = PRIVATE_PREFIXES.some(
        (prefix) =>
            pathname === prefix ||
            pathname.startsWith(`${prefix}/`),
    );

    const productMeta = getProductMeta(pathname);
    const defaultMeta =
        DEFAULT_META[pathname] ||
        productMeta || {
            title: "Virsa.Shoe | Step Into Your Own Style",
            description: FALLBACK_DESCRIPTION,
        };

    const ownerMeta = readOwnerMeta(pathname);

    const title =
        typeof ownerMeta?.title === "string" &&
            ownerMeta.title.trim()
            ? ownerMeta.title.trim()
            : defaultMeta.title;

    const description =
        typeof ownerMeta?.description === "string" &&
            ownerMeta.description.trim()
            ? ownerMeta.description.trim()
            : defaultMeta.description;

    const shouldNoindex =
        isPrivate || ownerMeta?.status === "Noindex";

    document.title = title;

    ensureMeta(
        'meta[name="description"]',
        "name",
        "description",
        description,
    );

    ensureMeta(
        'meta[name="robots"]',
        "name",
        "robots",
        shouldNoindex ? "noindex, nofollow" : "index, follow",
    );

    ensureMeta(
        'meta[property="og:title"]',
        "property",
        "og:title",
        title,
    );

    ensureMeta(
        'meta[property="og:description"]',
        "property",
        "og:description",
        description,
    );

    ensureMeta(
        'meta[name="twitter:title"]',
        "name",
        "twitter:title",
        title,
    );

    ensureMeta(
        'meta[name="twitter:description"]',
        "name",
        "twitter:description",
        description,
    );
}

export default function RouteMeta() {
    const location = useLocation();

    useEffect(() => {
        applyMetadata(normalizePath(location.pathname));
    }, [location.pathname]);

    return <Outlet />;
}