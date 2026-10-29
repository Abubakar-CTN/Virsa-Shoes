const CHECKED_DATE = "2026-10-29";

// Prototype inventory only. This is not the source retailer's live stock.
const DEMO_STOCK_PER_COLOR = 8;

const WOMEN_SIZES = [
    "36/4",
    "37/5",
    "38/6",
    "39/7",
    "40/8",
    "41/9",
];

const KIDS_SIZES_24_34 = [
    "24", "25", "26", "27", "28", "29",
    "30", "31", "32", "33", "34",
];

const GIRLS_SIZES_29_38 = [
    "29", "30", "31", "32", "33",
    "34", "35", "36", "37", "38",
];

const KIDS_SIZES_29_34 = [
    "29", "30", "31", "32", "33", "34",
];

const BOYS_BOUNCE_SIZES = [
    "24", "25", "26", "27", "28", "29",
];

function makeProduct({
    id,
    sku,
    slug,
    name,
    gender,
    category,
    price,
    comparePrice,
    sizes,
    description,
    sourceUrl,
    variants,
}) {
    const colorVariants = variants.map((variant) => ({
        color: variant.color,
        sku: `${sku}:${variant.code}`,
        image: variant.image,
        images: [variant.image],
        stock: DEMO_STOCK_PER_COLOR,
        sourceUrl: variant.sourceUrl || sourceUrl,
    }));

    const stock = colorVariants.reduce(
        (total, variant) => total + variant.stock,
        0,
    );

    const hasComparePrice =
        Number.isFinite(comparePrice) &&
        comparePrice > price;

    return {
        id,
        sku,
        slug,
        name,
        brand: "NDURE",
        sourceBrand: "NDURE",

        gender,
        category,

        price,
        ...(hasComparePrice ? { comparePrice } : {}),
        ...(hasComparePrice
            ? {
                discount: Math.round(
                    ((comparePrice - price) / comparePrice) * 100,
                ),
            }
            : {}),

        sizes: [...sizes],
        colors: colorVariants.map((variant) => variant.color),
        colorVariants,

        image: colorVariants[0]?.image || "",
        stock,

        description,

        isFeatured: false,
        isPopular: false,
        isNew: false,

        sourceUrl,
        sourcePriceChecked: CHECKED_DATE,

        // Never confuse local prototype stock with NDURE inventory.
        stockIsDemo: true,
    };
}

const audienceProducts = [
    // =========================================================
    // WOMEN — 10 PRODUCTS
    // =========================================================

    // 1. Existing product: retain its ID and URL.
    makeProduct({
        id: "reference-ndure-w-zes-0009",
        sku: "W-PL-ZES-0009",
        slug: "ndure-womens-strappy-sandals-w-pl-zes-0009",
        name: "Women's Strappy Sandals",
        gender: "women",
        category: "Sandals",
        price: 3149,
        comparePrice: 4499,
        sizes: WOMEN_SIZES,
        description:
            "Strappy sandals with contrasting panels and a chunky sole.",
        sourceUrl:
            "https://www.ndure.com/products/womens-strappy-sandals-w-pl-zes-0009-fwn-tan",
        variants: [
            {
                code: "FWN-TAN",
                color: "Fawn / Tan",
                image:
                    "https://www.ndure.com/cdn/shop/files/W-PL-ZES-0009-FAWN-TAN_done.jpg?v=1759391119&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-strappy-sandals-w-pl-zes-0009-fwn-tan",
            },
            {
                code: "NVY-ORG",
                color: "Navy / Orange",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_8d6f4c19-b42b-4fbc-bd27-b3fc727d017a.jpg?v=1759316791&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-strappy-sandals-w-pl-zes-0009-nvy-org",
            },
        ],
    }),

    // 2. Existing product: retain its ID and URL.
    makeProduct({
        id: "reference-ndure-w-sic-0011",
        sku: "W-PL-SIC-0011",
        slug: "ndure-womens-flex-it-comfort-sandals-w-pl-sic-0011",
        name: "Women's Flex-it Comfort Sandals",
        gender: "women",
        category: "Sandals",
        price: 4199,
        comparePrice: 5999,
        sizes: WOMEN_SIZES,
        description:
            "Cross-strap sandals with a cushioned insole and lightweight sole.",
        sourceUrl:
            "https://www.ndure.com/products/womens-textured-sandals-w-pl-sic-0011-fawn",
        variants: [
            {
                code: "FAWN",
                color: "Fawn",
                image:
                    "https://www.ndure.com/cdn/shop/files/3_3b512e5a-8c36-4ba0-957f-bc86bd3183d8.jpg?v=1772780219&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-textured-sandals-w-pl-sic-0011-fawn",
            },
            {
                code: "BLACK",
                color: "Black",
                image:
                    "https://www.ndure.com/cdn/shop/files/4_6a101ceb-d064-429e-9e7d-0a7ca271a3e4.jpg?v=1752864292&width=1445",
                sourceUrl:
                    "https://www.ndure.com/products/womens-textured-sandals-w-pl-sic-0011-black",
            },
        ],
    }),

    // 3. Metal-detail loafers.
    makeProduct({
        id: "reference-ndure-w-fst-0025",
        sku: "W-BL-FST-0025",
        slug: "ndure-womens-metal-detail-loafers-w-bl-fst-0025-fawn",
        name: "Women's Metal Detail Loafers",
        gender: "women",
        category: "Loafers",
        price: 3699,
        sizes: WOMEN_SIZES,
        description:
            "Classic loafers with a metal detail and a clean everyday silhouette.",
        sourceUrl:
            "https://www.ndure.com/products/womens-metal-detail-loafers-w-bl-fst-0025-fawn",
        variants: [
            {
                code: "FAWN",
                color: "Fawn",
                image:
                    "https://www.ndure.com/cdn/shop/files/4_9aeba582-90ac-4cb0-b943-83b86a3aa12b.jpg?v=1792562687&width=1946",
            },
        ],
    }),

    // 4. Contrast-panel platform sneakers.
    makeProduct({
        id: "reference-ndure-w-asd-0001",
        sku: "W-SN-ASD-0001",
        slug: "ndure-womens-contrast-panel-platform-sneakers-w-sn-asd-0001",
        name: "Women's Contrast Panel Platform Sneakers",
        gender: "women",
        category: "Sneakers",
        price: 4999,
        sizes: WOMEN_SIZES,
        description:
            "Lace-up platform sneakers with contrasting colour panels.",
        sourceUrl:
            "https://www.ndure.com/products/womens-contrast-sneakers-w-sn-asd-0001-wht-blk",
        variants: [
            {
                code: "WHT-BLK",
                color: "White / Black",
                image:
                    "https://www.ndure.com/cdn/shop/files/5_5ab1e77d-6338-4fef-9ac3-4477d6d2c5cf.jpg?v=1790054463&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-contrast-sneakers-w-sn-asd-0001-wht-blk",
            },
            {
                code: "GRY-PNK",
                color: "Grey / Pink",
                image:
                    "https://www.ndure.com/cdn/shop/files/3_27361d19-49c7-4b72-8f5f-28ab3f091c2d.jpg?v=1767683495&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-contrast-sneakers-w-sn-asd-0001-gry-pnk",
            },
        ],
    }),

    // 5. Contrast-stripe sneakers.
    makeProduct({
        id: "reference-ndure-w-ste-0002",
        sku: "W-SN-STE-0002",
        slug: "ndure-womens-contrast-stripe-sneakers-w-sn-ste-0002",
        name: "Women's Contrast Stripe Sneakers",
        gender: "women",
        category: "Sneakers",
        price: 4999,
        sizes: WOMEN_SIZES,
        description:
            "Low-profile sneakers with contrast side stripes and a clean shape.",
        sourceUrl:
            "https://www.ndure.com/products/womens-contrast-stripe-sneakers-w-sn-ste-0002-navy",
        variants: [
            {
                code: "NAVY",
                color: "Navy",
                image:
                    "https://www.ndure.com/cdn/shop/files/3_1c8b7d10-f098-4dea-b860-f3e277997b29.jpg?v=1789102484&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-contrast-stripe-sneakers-w-sn-ste-0002-navy",
            },
            {
                code: "RED",
                color: "Red",
                image:
                    "https://www.ndure.com/cdn/shop/files/4_fdf029ca-3614-4a90-bf90-51032e356e81.jpg?v=1786943310&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-contrast-stripe-sneakers-w-sn-ste-0002-red",
            },
        ],
    }),

    // 6. Everyday sneakers.
    makeProduct({
        id: "reference-ndure-w-tor-0008",
        sku: "W-PR-TOR-0008",
        slug: "ndure-womens-everyday-sneakers-w-pr-tor-0008",
        name: "Women's Everyday Sneakers",
        gender: "women",
        category: "Sneakers",
        price: 3999,
        sizes: WOMEN_SIZES,
        description:
            "Everyday lace-up sneakers with a simple, versatile profile.",
        sourceUrl:
            "https://www.ndure.com/products/womens-everyday-sneakers-w-pr-tor-0008-burgundi",
        variants: [
            {
                code: "BURGUNDI",
                color: "Burgundi",
                image:
                    "https://www.ndure.com/cdn/shop/files/4_f976276a-7180-48ca-81a1-15faa85d2f41.jpg?v=1790054389&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-everyday-sneakers-w-pr-tor-0008-burgundi",
            },
            {
                code: "BEIGE",
                color: "Beige",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_29c56e7b-a7b6-48b5-86cb-1df19c04e03c.jpg?v=1789102386&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-everyday-sneakers-w-pr-tor-0008-beige",
            },
        ],
    }),

    // 7. Low-profile panelled sneakers.
    makeProduct({
        id: "reference-ndure-w-mdn-0006",
        sku: "W-SN-MDN-0006",
        slug: "ndure-womens-low-profile-panelled-sneakers-w-sn-mdn-0006",
        name: "Women's Low-Profile Panelled Sneakers",
        gender: "women",
        category: "Sneakers",
        price: 3999,
        sizes: WOMEN_SIZES,
        description:
            "Low-profile panelled sneakers with a simple everyday design.",
        sourceUrl:
            "https://www.ndure.com/products/womens-low-profile-panelled-sneakers-w-sn-mdn-0006-black",
        variants: [
            {
                code: "BLACK",
                color: "Black",
                image:
                    "https://www.ndure.com/cdn/shop/files/5_730d941a-3618-4444-bec5-7da18eeabb22.jpg?v=1788853483&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-low-profile-panelled-sneakers-w-sn-mdn-0006-black",
            },
            {
                code: "BEIGE",
                color: "Beige",
                image:
                    "https://www.ndure.com/cdn/shop/files/5_e0a8a6ed-d4c4-4c5f-8212-c15ae60ead1a.jpg?v=1789126439&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-low-profile-panelled-sneakers-w-sn-mdn-0006-beige",
            },
        ],
    }),

    // 8. Multicoloured panel sneakers.
    makeProduct({
        id: "reference-ndure-w-don-0022",
        sku: "W-SN-DON-0022",
        slug: "ndure-womens-multicolored-panel-sneakers-w-sn-don-0022",
        name: "Women's Multicolored Panel Sneakers",
        gender: "women",
        category: "Sneakers",
        price: 2639,
        comparePrice: 3299,
        sizes: WOMEN_SIZES,
        description:
            "Lace-up sneakers with a multicoloured patterned side panel.",
        sourceUrl:
            "https://www.ndure.com/products/womens-lace-up-sneakers-w-sn-don-0022-beige",
        variants: [
            {
                code: "BEIGE",
                color: "Beige",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_5c39e6ab-3de8-4f60-aa82-a387b554c7ef.jpg?v=1759313078&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/womens-lace-up-sneakers-w-sn-don-0022-beige",
            },
        ],
    }),

    // 9. Flex-it comfort slides.
    makeProduct({
        id: "reference-ndure-w-doc-0016",
        sku: "W-PL-DOC-0016",
        slug: "ndure-womens-flex-it-comfort-slides-w-pl-doc-0016-beige",
        name: "Women's Flex-it Comfort Slides",
        gender: "women",
        category: "Slides",
        price: 3149,
        comparePrice: 4499,
        sizes: WOMEN_SIZES,
        description:
            "Easy slip-on slides for relaxed everyday wear.",
        sourceUrl:
            "https://www.ndure.com/products/womens-comfy-slides-w-pl-doc-0016-beige",
        variants: [
            {
                code: "BEIGE",
                color: "Beige",
                image:
                    "https://www.ndure.com/cdn/shop/files/W-PL-DOC-0016-BEIGE.jpg?v=1772778986&width=1946",
            },
        ],
    }),

    // 10. Pointed-toe heels.
    makeProduct({
        id: "reference-ndure-w-hl-blk-0120",
        sku: "W-HL-BLK-0120",
        slug: "ndure-womens-pointed-toe-heels-w-hl-blk-0120-black",
        name: "Women's Pointed Toe Heels",
        gender: "women",
        category: "Heels",
        price: 3149,
        comparePrice: 4499,
        sizes: WOMEN_SIZES,
        description:
            "Pointed-toe heels with studded strap detailing and a padded insole.",
        sourceUrl:
            "https://www.ndure.com/products/womens-pointed-toe-heels-w-hl-blk-0120-black",
        variants: [
            {
                code: "BLACK",
                color: "Black",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_14c17a92-d021-4731-9d46-5e8087942163.jpg?v=1752864836&width=1946",
            },
        ],
    }),

    // =========================================================
    // KIDS — 10 PRODUCTS
    // =========================================================

    // 1. Existing product.
    makeProduct({
        id: "reference-ndure-g-hel-0003",
        sku: "G-SN-HEL-0003",
        slug: "ndure-girls-easy-fit-sneakers-g-sn-hel-0003",
        name: "Girls' Easy Fit Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 4499,
        sizes: GIRLS_SIZES_29_38,
        description:
            "Easy-fit sneakers with a practical strap closure for everyday wear.",
        sourceUrl:
            "https://www.ndure.com/products/girls-easyfit-sneakers-g-sn-hel-0003-nvy-pnk",
        variants: [
            {
                code: "NVY-PNK",
                color: "Navy / Pink",
                image:
                    "https://www.ndure.com/cdn/shop/files/G-SN-HEL-0003-NVY-PNK_5.jpg?v=1792394927&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/girls-easyfit-sneakers-g-sn-hel-0003-nvy-pnk",
            },
            {
                code: "PNK-GRY",
                color: "Pink / Grey",
                image:
                    "https://www.ndure.com/cdn/shop/files/G-SN-HEL-0003-PNK-GRY_5.jpg?v=1792395172&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/girls-easyfit-sneakers-g-sn-hel-0003-pnk-gry",
            },
        ],
    }),

    // 2. Existing product.
    makeProduct({
        id: "reference-ndure-b-cld-0007",
        sku: "B-SN-CLD-0007",
        slug: "ndure-boys-low-profile-sneakers-b-sn-cld-0007",
        name: "Boys' Low Profile Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 4299,
        sizes: KIDS_SIZES_29_34,
        description:
            "Low-profile sneakers with a streamlined silhouette for everyday use.",
        sourceUrl:
            "https://www.ndure.com/products/boys-low-profile-sneakers-b-sn-cld-0007-black",
        variants: [
            {
                code: "BLACK",
                color: "Black",
                image:
                    "https://www.ndure.com/cdn/shop/files/4_8121d1aa-f4a5-43be-90dd-f5a57d3cdfa0.jpg?v=1786527532&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/boys-low-profile-sneakers-b-sn-cld-0007-black",
            },
            {
                code: "ESPRESSO",
                color: "Espresso",
                image:
                    "https://www.ndure.com/cdn/shop/files/4_912f21f9-49ff-4758-a693-f97aa9d49f9f.jpg?v=1787112972&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/boys-low-profile-sneakers-b-sn-cld-0007-espresso",
            },
        ],
    }),

    // 3. Girls' flower-print sneakers.
    makeProduct({
        id: "reference-ndure-g-don-0011",
        sku: "G-SN-DON-0011",
        slug: "ndure-girls-flower-print-sneakers-g-sn-don-0011-pink",
        name: "Girls' Flower Print Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 2999,
        sizes: KIDS_SIZES_24_34,
        description:
            "Flower-print sneakers with a rounded toe and lightweight everyday design.",
        sourceUrl:
            "https://www.ndure.com/products/girls-floral-sneakers-g-sn-don-0011-pink",
        variants: [
            {
                code: "PINK",
                color: "Pink",
                image:
                    "https://www.ndure.com/cdn/shop/files/4_bc00d433-b43f-4b57-94df-ae9da1a1215b.jpg?v=1791174530&width=1946",
            },
        ],
    }),

    // 4. Girls' contrast sneakers.
    makeProduct({
        id: "reference-ndure-g-qnt-0007",
        sku: "G-SN-QNT-0007",
        slug: "ndure-girls-contrast-sneakers-g-sn-qnt-0007-blk-lil",
        name: "Girls' Contrast Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 3499,
        sizes: KIDS_SIZES_24_34,
        description:
            "Contrast-colour sneakers with a mesh upper and lightweight sole.",
        sourceUrl:
            "https://www.ndure.com/products/girls-contrast-sneakers-g-sn-qnt-0007-blk-lil",
        variants: [
            {
                code: "BLK-LIL",
                color: "Black / Lilac",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_2d902782-83ab-42fb-aa82-68dee9a857fa.jpg?v=1788507002&width=1946",
            },
        ],
    }),

    // 5. Boys' double-strap ankle boots.
    makeProduct({
        id: "reference-ndure-b-mun-0007",
        sku: "B-BT-MUN-0007",
        slug: "ndure-boys-double-strap-ankle-boots-b-bt-mun-0007",
        name: "Boys' Double Strap Ankle Boots",
        gender: "kids",
        category: "Boots",
        price: 3999,
        sizes: KIDS_SIZES_24_34,
        description:
            "Ankle boots with double straps, contrast stitching and a cushioned collar.",
        sourceUrl:
            "https://www.ndure.com/products/boys-double-strap-ankle-boots-b-bt-mun-0007-tan",
        variants: [
            {
                code: "TAN",
                color: "Tan",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_f04df5c6-3007-49f3-8594-9b96eb64f550.jpg?v=1788505759&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/boys-double-strap-ankle-boots-b-bt-mun-0007-tan",
            },
            {
                code: "ESPRESSO",
                color: "Espresso",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_ffa2f283-fa04-457c-87dd-13fd3f68487d.jpg?v=1761219522&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/boys-double-strap-ankle-boots-b-bt-mun-0007-espresso",
            },
        ],
    }),

    // 6. Girls' contrast-stripe sneakers.
    makeProduct({
        id: "reference-ndure-g-ste-0008",
        sku: "G-SN-STE-0008",
        slug: "ndure-girls-contrast-stripe-sneakers-g-sn-ste-0008",
        name: "Girls' Contrast Stripe Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 4299,
        sizes: KIDS_SIZES_29_34,
        description:
            "Everyday sneakers with contrast side stripes and a clean silhouette.",
        sourceUrl:
            "https://www.ndure.com/products/girls-contrast-stripe-sneakers-g-sn-ste-0008-wht-blk",
        variants: [
            {
                code: "WHT-BLK",
                color: "White / Black",
                image:
                    "https://www.ndure.com/cdn/shop/files/5_8bdebfa8-bb21-43bd-b830-c16fa57867ca.jpg?v=1788502109&width=1946",
            },
        ],
    }),

    // 7. Girls' chunky slip-on sneakers.
    makeProduct({
        id: "reference-ndure-g-hel-0002",
        sku: "G-SN-HEL-0002",
        slug: "ndure-girls-chunky-slip-on-sneakers-g-sn-hel-0002-pink",
        name: "Girls' Chunky Slip-On Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 3299,
        sizes: GIRLS_SIZES_29_38,
        description:
            "Stretch-knit slip-on sneakers with a cushioned, lightweight design.",
        sourceUrl:
            "https://www.ndure.com/products/girls-chunky-slip-on-sneakers-g-sn-hel-0002-pink",
        variants: [
            {
                code: "PINK",
                color: "Pink",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_55c5fe04-43e8-4ea1-a705-04737de7a500.jpg?v=1788501745&width=1946",
            },
        ],
    }),

    // 8. Girls' dreamy mesh kicks.
    makeProduct({
        id: "reference-ndure-g-hmb-0004",
        sku: "G-SN-HMB-0004",
        slug: "ndure-girls-dreamy-mesh-kicks-g-sn-hmb-0004-gry-fuc",
        name: "Girls' Dreamy Mesh Kicks",
        gender: "kids",
        category: "Sneakers",
        price: 1999,
        comparePrice: 3999,
        sizes: GIRLS_SIZES_29_38,
        description:
            "Mesh sneakers with dual hook-and-loop straps and a padded insole.",
        sourceUrl:
            "https://www.ndure.com/products/girls-dreamy-mesh-kicks-g-sn-hmb-0004-gry-fuc",
        variants: [
            {
                code: "GRY-FUC",
                color: "Grey / Fuchsia",
                image:
                    "https://www.ndure.com/cdn/shop/files/3_ee682b07-046a-4015-97ff-7599a68d2a61.jpg?v=1736330638&width=1445",
            },
        ],
    }),

    // 9. Boys' mesh sneakers.
    makeProduct({
        id: "reference-ndure-b-qnt-0006",
        sku: "B-SN-QNT-0006",
        slug: "ndure-boys-mesh-sneakers-b-sn-qnt-0006-nvy-red",
        name: "Boys' Mesh Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 3499,
        sizes: KIDS_SIZES_24_34,
        description:
            "Mesh sneakers with contrasting panels and a lightweight everyday sole.",
        sourceUrl:
            "https://www.ndure.com/products/boys-mesh-sneakers-b-sn-qnt-0006-nvy-red",
        variants: [
            {
                code: "NVY-RED",
                color: "Navy / Red",
                image:
                    "https://www.ndure.com/cdn/shop/files/3_7d759b22-cce5-4dc7-8e13-22908ecf1501.jpg?v=1759303809&width=1946",
            },
        ],
    }),

    // 10. Boys' bounce sneakers.
    makeProduct({
        id: "reference-ndure-b-sor-0002",
        sku: "B-SN-SOR-0002",
        slug: "ndure-boys-bounce-sneakers-b-sn-sor-0002",
        name: "Boys' Bounce Sneakers",
        gender: "kids",
        category: "Sneakers",
        price: 2199,
        sizes: BOYS_BOUNCE_SIZES,
        description:
            "Lightweight sneakers with adjustable straps and a padded insole.",
        sourceUrl:
            "https://www.ndure.com/products/boys-bounce-sneakers-b-sn-sor-0002-black",
        variants: [
            {
                code: "BLACK",
                color: "Black",
                image:
                    "https://www.ndure.com/cdn/shop/files/3_a2608048-307d-4865-a424-b0734d50eeb5.jpg?v=1732774842&width=1445",
                sourceUrl:
                    "https://www.ndure.com/products/boys-bounce-sneakers-b-sn-sor-0002-black",
            },
            {
                code: "CBT-BLU",
                color: "Cobalt / Blue",
                image:
                    "https://www.ndure.com/cdn/shop/files/1_f87f57b9-162d-4a5e-9561-ea924ae3bd50.jpg?v=1736332866&width=1946",
                sourceUrl:
                    "https://www.ndure.com/products/boys-bounce-sneakers-b-sn-sor-0002-cbt-blu",
            },
        ],
    }),
];

export default audienceProducts;