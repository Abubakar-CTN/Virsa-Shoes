
const products = [
    {
        id: 1,
        name: "Urban Runner X1",
        slug: "urban-runner-x1",
        category: "Sneakers",
        brand: "Virsa",
        price: 5499,
        comparePrice: 6999,
        discount: 21,
        rating: 4.8,
        reviews: 124,
        stock: 18,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: true,
        isPopular: true,
        isNew: false,
        image: "/images/shoes/sneaker-white.webp",
        colorVariants: [
            {
                color: "White",
                images: ["/images/shoes/sneaker-white.webp"],
                stock: 18,
            },
        ],
    },
    {
        id: 2,
        name: "Classic Leather Pro",
        slug: "classic-leather-pro",
        category: "Formal",
        brand: "Virsa",
        price: 7499,
        comparePrice: 8999,
        discount: 17,
        rating: 4.7,
        reviews: 98,
        stock: 12,
        sizes: ["7", "8", "9", "10"],
        isFeatured: true,
        isPopular: true,
        isNew: false,
        image: "/images/shoes/formal-pattern.webp",
        colorVariants: [
            {
                color: "Brown",
                images: ["/images/shoes/formal-pattern.webp"],
                stock: 12,
            },
        ],
    },
    {
        id: 3,
        name: "Street Flex",
        slug: "street-flex",
        category: "Casual",
        brand: "Virsa",
        price: 4599,
        comparePrice: 5999,
        discount: 23,
        rating: 4.6,
        reviews: 76,
        stock: 25,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: false,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/formal-lifestyle.webp",
        colorVariants: [
            {
                color: "Blue",
                images: ["/images/shoes/formal-lifestyle.webp"],
                stock: 25,
            },
        ],
    },
    {
        id: 4,
        name: "Aero Sport Max",
        slug: "aero-sport-max",
        category: "Sports",
        brand: "Virsa",
        price: 6299,
        comparePrice: 7499,
        discount: 16,
        rating: 4.9,
        reviews: 156,
        stock: 20,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: true,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/running-black.webp",
        colorVariants: [
            {
                color: "Black",
                images: ["/images/shoes/running-black.webp"],
                stock: 20,
            },
        ],
    },
    {
        id: 5,
        name: "Daily Comfort",
        slug: "daily-comfort",
        category: "Casual",
        brand: "Virsa",
        price: 3999,
        comparePrice: 4999,
        discount: 20,
        rating: 4.5,
        reviews: 64,
        stock: 30,
        sizes: ["7", "8", "9", "10"],
        isFeatured: false,
        isPopular: false,
        isNew: true,
        image: "/images/shoes/leather-sandals.webp",
        colorVariants: [
            {
                color: "White",
                images: ["/images/shoes/leather-sandals.webp"],
                stock: 30,
            },
        ],
    },
    {
        id: 6,
        name: "Royal Derby",
        slug: "royal-derby",
        category: "Formal",
        brand: "Virsa",
        price: 8299,
        comparePrice: 9999,
        discount: 17,
        rating: 4.8,
        reviews: 87,
        stock: 9,
        sizes: ["7", "8", "9", "10"],
        isFeatured: true,
        isPopular: false,
        isNew: false,
        image: "/images/shoes/brown-dress.webp",
        colorVariants: [
            {
                color: "Brown",
                images: ["/images/shoes/brown-dress.webp"],
                stock: 9,
            },
        ],
    },
    {
        id: 7,
        name: "Cloud Walk",
        slug: "cloud-walk",
        category: "Sneakers",
        brand: "Virsa",
        price: 5799,
        comparePrice: 6799,
        discount: 15,
        rating: 4.7,
        reviews: 112,
        stock: 16,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: false,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/formal-classic.webp",
        colorVariants: [
            {
                color: "Grey",
                images: ["/images/shoes/formal-classic.webp"],
                stock: 16,
            },
        ],
    },
    {
        id: 8,
        name: "Elite Street Pro",
        slug: "elite-street-pro",
        category: "Sneakers",
        brand: "Virsa",
        price: 6899,
        comparePrice: 7999,
        discount: 14,
        rating: 4.9,
        reviews: 203,
        stock: 6,
        sizes: ["8", "9", "10", "11"],
        isFeatured: true,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/formal-dark.webp",
        colorVariants: [
            {
                color: "Black",
                images: ["/images/shoes/formal-dark.webp"],
                stock: 6,
            },
        ],
    },
    {
        id: 9,
        name: "Metro Leather Loafer",
        slug: "metro-leather-loafer",
        category: "Formal",
        brand: "Virsa",
        price: 6999,
        comparePrice: 8499,
        rating: 4.7,
        reviews: 72,
        stock: 14,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: true,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/black-loafers.webp",
        colorVariants: [
            {
                color: "Black",
                images: ["/images/shoes/black-loafers.webp"],
                stock: 14,
            },
        ],
    },
    {
        id: 10,
        name: "Signature Buckle Derby",
        slug: "signature-buckle-derby",
        category: "Formal",
        brand: "Virsa",
        price: 7799,
        rating: 4.8,
        reviews: 53,
        stock: 11,
        sizes: ["7", "8", "9", "10"],
        isFeatured: true,
        isPopular: false,
        isNew: false,
        image: "/images/shoes/black-buckle-formal.webp",
        colorVariants: [
            {
                color: "Black",
                images: ["/images/shoes/black-buckle-formal.webp"],
                stock: 11,
            },
        ],
    },
    {
        id: 11,
        name: "Heritage Brown Oxford",
        slug: "heritage-brown-oxford",
        category: "Formal",
        brand: "Virsa",
        price: 8199,
        comparePrice: 9999,
        rating: 4.8,
        reviews: 61,
        stock: 10,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: true,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/brown-oxford.webp",
        colorVariants: [
            {
                color: "Brown",
                images: ["/images/shoes/brown-oxford.webp"],
                stock: 10,
            },
        ],
    },
    {
        id: 12,
        name: "Olive Evening Heel",
        slug: "olive-evening-heel",
        category: "Heels",
        brand: "Virsa",
        price: 5899,
        rating: 4.6,
        reviews: 38,
        stock: 8,
        sizes: ["6", "7", "8", "9", "10"],
        isFeatured: false,
        isPopular: false,
        isNew: true,
        image: "/images/shoes/olive-heel.webp",
        colorVariants: [
            {
                color: "Olive",
                images: ["/images/shoes/olive-heel.webp"],
                stock: 8,
            },
        ],
    },
    {
        id: 13,
        name: "Buckle Leather Sandal",
        slug: "buckle-leather-sandal",
        category: "Sandals",
        brand: "Virsa",
        price: 3499,
        comparePrice: 4299,
        rating: 4.5,
        reviews: 42,
        stock: 19,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: false,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/brown-sandals-detail.webp",
        colorVariants: [
            {
                color: "Brown",
                images: ["/images/shoes/brown-sandals-detail.webp"],
                stock: 19,
            },
        ],
    },
    {
        id: 14,
        name: "Luna Classic Flats",
        slug: "luna-classic-flats",
        category: "Flats",
        brand: "Virsa",
        price: 3799,
        rating: 4.6,
        reviews: 47,
        stock: 13,
        sizes: ["6", "7", "8", "9", "10"],
        isFeatured: false,
        isPopular: true,
        isNew: false,
        image: "/images/shoes/black-womens-flats.webp",
        colorVariants: [
            {
                color: "Black",
                images: ["/images/shoes/black-womens-flats.webp"],
                stock: 13,
            },
        ],
    },
    {
        id: 15,
        name: "Sienna Platform Sandal",
        slug: "sienna-platform-sandal",
        category: "Sandals",
        brand: "Virsa",
        price: 4299,
        comparePrice: 5199,
        rating: 4.5,
        reviews: 32,
        stock: 16,
        sizes: ["6", "7", "8", "9", "10"],
        isFeatured: false,
        isPopular: false,
        isNew: true,
        image: "/images/shoes/beige-platform-sandals.webp",
        colorVariants: [
            {
                color: "Beige",
                images: ["/images/shoes/beige-platform-sandals.webp"],
                stock: 16,
            },
        ],
    },

    // Multi-colour demo product. The images are temporary branded assets.
    {
        id: 16,
        name: "Street Mesh Runner",
        slug: "street-mesh-runner",
        category: "Sports",
        brand: "Virsa",
        price: 5999,
        rating: 4.7,
        reviews: 58,
        stock: 17,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: true,
        isPopular: true,
        isNew: true,
        image: "/images/shoes/variants/street-mesh-runner-black-01.webp",
        colorVariants: [
            {
                color: "Black",
                images: [
                    "/images/shoes/variants/street-mesh-runner-black-01.webp",
                    "/images/shoes/variants/street-mesh-runner-black-02.webp",
                ],
                stock: 6,
            },
            {
                color: "White",
                images: [
                    "/images/shoes/variants/street-mesh-runner-white-01.webp",
                    "/images/shoes/variants/street-mesh-runner-white-02.webp",
                ],
                stock: 5,
            },
            {
                color: "Blue",
                images: [
                    "/images/shoes/variants/street-mesh-runner-blue-01.webp",
                    "/images/shoes/variants/street-mesh-runner-blue-02.webp",
                ],
                stock: 6,
            },
        ],
    },
    {
        id: 17,
        name: "White Street Trainer",
        slug: "white-street-trainer",
        category: "Sneakers",
        brand: "Virsa",
        price: 5499,
        comparePrice: 6499,
        rating: 4.6,
        reviews: 44,
        stock: 21,
        sizes: ["7", "8", "9", "10", "11"],
        isFeatured: true,
        isPopular: false,
        isNew: true,
        image: "/images/shoes/white-sneakers-floor.webp",
        colorVariants: [
            {
                color: "White",
                images: ["/images/shoes/white-sneakers-floor.webp"],
                stock: 21,
            },
        ],
    },
];

// Normalize variant data and derive product.colors from available variants.
const productsWithColorVariants = products.map((product) => {
    const colorVariants = (product.colorVariants ?? [])
        .map((variant) => {
            const color = String(variant.color ?? "").trim();

            const images = [
                ...new Set(
                    (Array.isArray(variant.images) ? variant.images : [])
                        .filter(
                            (image) =>
                                typeof image === "string" &&
                                image.trim().length > 0
                        )
                        .map((image) => image.trim())
                ),
            ];

            const stock = Math.max(
                0,
                Math.floor(Number(variant.stock) || 0)
            );

            return { color, images, stock };
        })
        .filter(
            (variant) =>
                variant.color &&
                variant.images.length > 0 &&
                variant.stock > 0
        );

    return {
        ...product,
        colorVariants,
        colors: colorVariants.map((variant) => variant.color),
    };
});

export default productsWithColorVariants;
