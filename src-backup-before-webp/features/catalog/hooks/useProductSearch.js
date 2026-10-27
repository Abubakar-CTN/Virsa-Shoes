
import { useCallback } from "react";
import { useSearchParams } from "react-router";

export default function useProductSearch() {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("q") ?? "";

    const setQuery = useCallback(
        (value) => {
            setSearchParams(
                (currentParams) => {
                    const nextParams = new URLSearchParams(currentParams);
                    const term = String(value ?? "");

                    if (term.trim()) {
                        nextParams.set("q", term);
                    } else {
                        nextParams.delete("q");
                    }

                    return nextParams;
                },
                { replace: true },
            );
        },
        [setSearchParams],
    );

    const submitSearch = useCallback(
        (value = query) => {
            setSearchParams((currentParams) => {
                const nextParams = new URLSearchParams(currentParams);
                const term = String(value ?? "").trim();

                if (term) {
                    nextParams.set("q", term);
                } else {
                    nextParams.delete("q");
                }

                return nextParams;
            });
        },
        [query, setSearchParams],
    );

    const clearSearch = useCallback(() => {
        setSearchParams(
            (currentParams) => {
                const nextParams = new URLSearchParams(currentParams);
                nextParams.delete("q");
                return nextParams;
            },
            { replace: true },
        );
    }, [setSearchParams]);

    return {
        query,
        setQuery,
        submitSearch,
        clearSearch,
    };
}
