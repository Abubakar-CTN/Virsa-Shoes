import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Skeleton from "../../components/ui/Skeleton";

function Home() {
    return (
        <main className="min-h-screen bg-surface-muted px-6 py-12">
            <div className="mx-auto max-w-4xl">

                {/* Brand */}
                <div className="rounded-3xl bg-surface p-8 text-center shadow-xl">
                    <Badge variant="brand">
                        Virsa.Shoe
                    </Badge>

                    <h1 className="mt-6 text-4xl font-bold text-text-primary sm:text-5xl">
                        Premium Footwear
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-text-secondary">
                        Discover modern footwear with premium design,
                        comfort, quality, and style.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button size="lg">
                            Shop Now
                        </Button>

                        <Button variant="outline" size="lg">
                            Explore Collection
                        </Button>
                    </div>
                </div>

                {/* Badge Tests */}
                <div className="mt-8 rounded-3xl bg-surface p-8 shadow-lg">
                    <h2 className="mb-5 text-xl font-bold text-text-primary">
                        Badge Test
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        <Badge variant="default">
                            Default
                        </Badge>

                        <Badge variant="success">
                            In Stock
                        </Badge>

                        <Badge variant="warning">
                            Low Stock
                        </Badge>

                        <Badge variant="danger">
                            Out of Stock
                        </Badge>

                        <Badge variant="info">
                            New
                        </Badge>

                        <Badge variant="brand">
                            Featured
                        </Badge>
                    </div>
                </div>

                {/* Spinner Test */}
                <div className="mt-8 rounded-3xl bg-surface p-8 shadow-lg">
                    <h2 className="mb-5 text-xl font-bold text-text-primary">
                        Spinner Test
                    </h2>

                    <div className="flex items-center gap-6">
                        <Spinner size="sm" />
                        <Spinner size="md" />
                        <Spinner size="lg" />
                    </div>
                </div>

                {/* Skeleton Test */}
                <div className="mt-8 rounded-3xl bg-surface p-8 shadow-lg">
                    <h2 className="mb-5 text-xl font-bold text-text-primary">
                        Skeleton Test
                    </h2>

                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full max-w-md" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-12 w-32 rounded-xl" />
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Home;