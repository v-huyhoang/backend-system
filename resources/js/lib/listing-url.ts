export function mergeListingUrl(currentUrl: string, changes: Record<string, string | null>): string {
    const url = new URL(currentUrl, 'http://localhost');
    Object.entries(changes).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
    });
    return `${url.pathname}${url.search}`;
}

export function preserveListingFilters(currentUrl: string, locationUrl: string): string {
    const current = new URL(currentUrl, 'http://localhost');
    const destination = new URL(locationUrl, 'http://localhost');
    current.searchParams.forEach((value, key) => destination.searchParams.set(key, value));
    return `${destination.pathname}${destination.search}`;
}
