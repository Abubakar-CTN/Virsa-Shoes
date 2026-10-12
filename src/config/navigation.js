export const storefrontNavigation = [
    {
        label: "NEW IN",
        to: "/shop?sort=new",
        groups: [
            {
                title: "JUST ARRIVED",
                links: [
                    { label: "Latest Arrivals", to: "/shop?sort=new" },
                    { label: "Trending Styles", to: "/shop?sort=popular" },
                    { label: "Everyday Sneakers", to: "/categories/sneakers" },
                ],
            },
            {
                title: "DISCOVER",
                links: [
                    { label: "Shop All Footwear", to: "/shop" },
                    { label: "Casual Shoes", to: "/categories/casual" },
                    { label: "Comfort Collection", to: "/categories/comfort" },
                ],
            },
        ],
    },
    {
        label: "MEN",
        to: "/categories/men",
        groups: [
            {
                title: "SHOP MEN",
                links: [
                    { label: "All Men's Shoes", to: "/categories/men" },
                    { label: "Sneakers", to: "/categories/sneakers" },
                    { label: "Formal Shoes", to: "/categories/formal" },
                    { label: "Casual Shoes", to: "/categories/casual" },
                ],
            },
            {
                title: "MORE STYLES",
                links: [
                    { label: "Loafers", to: "/categories/loafers" },
                    { label: "Sandals", to: "/categories/sandals" },
                    { label: "Slides", to: "/categories/slides" },
                    { label: "Peshawari", to: "/categories/peshawari" },
                ],
            },
        ],
    },
    {
        label: "WOMEN",
        to: "/categories/women",
        groups: [
            {
                title: "SHOP WOMEN",
                links: [
                    { label: "All Women's Shoes", to: "/categories/women" },
                    { label: "Sneakers", to: "/categories/sneakers" },
                    { label: "Flats", to: "/categories/flats" },
                    { label: "Heels", to: "/categories/heels" },
                ],
            },
            {
                title: "EVERYDAY STYLE",
                links: [
                    { label: "Sandals", to: "/categories/sandals" },
                    { label: "Casual Shoes", to: "/categories/casual" },
                    { label: "Slides", to: "/categories/slides" },
                    { label: "Shop All", to: "/shop" },
                ],
            },
        ],
    },
    {
        label: "KIDS",
        to: "/categories/kids",
        groups: [
            {
                title: "SHOP KIDS",
                links: [
                    { label: "All Kids' Shoes", to: "/categories/kids" },
                    { label: "School Shoes", to: "/categories/school-shoes" },
                    { label: "Kids' Sneakers", to: "/categories/sneakers" },
                ],
            },
            {
                title: "EVERYDAY COMFORT",
                links: [
                    { label: "Sandals", to: "/categories/sandals" },
                    { label: "Slides", to: "/categories/slides" },
                    { label: "Shop All Footwear", to: "/shop" },
                ],
            },
        ],
    },
    {
        label: "COLLECTIONS",
        to: "/shop",
        groups: [
            {
                title: "EXPLORE",
                links: [
                    { label: "Everyday Essentials", to: "/categories/everyday" },
                    { label: "Work & Occasion", to: "/categories/formal" },
                    { label: "Weekend Styles", to: "/categories/casual" },
                ],
            },
            {
                title: "SHOP BY STYLE",
                links: [
                    { label: "Sneakers", to: "/categories/sneakers" },
                    { label: "Formal", to: "/categories/formal" },
                    { label: "Casual", to: "/categories/casual" },
                    { label: "Shop Everything", to: "/shop" },
                ],
            },
        ],
    },
    {
        label: "SALE",
        to: "/shop?sale=true",
        sale: true,
    },
];
