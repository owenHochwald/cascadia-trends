// src/utils/queryStringBuilder.ts
import type { FilterState } from '../types/common-types';

/**
 * Builds a query string from the current filter state
 * @param filters - The current filter state from Redux
 * @returns Query string starting with '?' or empty string if no filters
 */
export const buildQueryString = (filters: FilterState): string => {
    const params = new URLSearchParams();

    // Price range - only add if different from default
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) {
        params.append('price_min', filters.priceRange[0].toString());
        params.append('price_max', filters.priceRange[1].toString());
    }

    // Square footage range - only add if different from default
    if (filters.sqftRange[0] > 0 || filters.sqftRange[1] < 5000) {
        params.append('sqft_min', filters.sqftRange[0].toString());
        params.append('sqft_max', filters.sqftRange[1].toString());
    }

    // Bedrooms - only add if not all options selected
    const allBedrooms = [1, 2, 3, 4, 5];
    if (filters.bedrooms.length !== allBedrooms.length ||
        !allBedrooms.every(bed => filters.bedrooms.includes(bed))) {
        params.append('bedrooms', filters.bedrooms.join(','));
    }

    // Date range - only add if different from default
    if (filters.dateRange[0] !== '2020-01-01' || filters.dateRange[1] !== '2023-12-31') {
        params.append('date_start', filters.dateRange[0]);
        params.append('date_end', filters.dateRange[1]);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
};

/**
 * Parses a query string back into a FilterState object
 * Useful for URL-based state persistence or bookmarking
 * @param queryString - Query string to parse
 * @returns Partial FilterState object
 */
export const parseQueryString = (queryString: string): Partial<FilterState> => {
    const params = new URLSearchParams(queryString);
    const filters: Partial<FilterState> = {};

    // Parse price range
    const priceMin = params.get('price_min');
    const priceMax = params.get('price_max');
    if (priceMin !== null && priceMax !== null) {
        filters.priceRange = [parseInt(priceMin), parseInt(priceMax)];
    }

    // Parse square footage range
    const sqftMin = params.get('sqft_min');
    const sqftMax = params.get('sqft_max');
    if (sqftMin !== null && sqftMax !== null) {
        filters.sqftRange = [parseInt(sqftMin), parseInt(sqftMax)];
    }

    // Parse bedrooms
    const bedroomsParam = params.get('bedrooms');
    if (bedroomsParam !== null) {
        filters.bedrooms = bedroomsParam.split(',').map(Number);
    }

    // Parse date range
    const dateStart = params.get('date_start');
    const dateEnd = params.get('date_end');
    if (dateStart !== null && dateEnd !== null) {
        filters.dateRange = [dateStart, dateEnd];
    }

    return filters;
};

/**
 * Validates filter values to ensure they're within acceptable ranges
 * @param filters - FilterState to validate
 * @returns Validated and sanitized FilterState
 */
export const validateFilters = (filters: FilterState): FilterState => {
    return {
        priceRange: [
            Math.max(0, Math.min(filters.priceRange[0], 2000000)),
            Math.max(filters.priceRange[0], Math.min(filters.priceRange[1], 2000000))
        ],
        sqftRange: [
            Math.max(0, Math.min(filters.sqftRange[0], 5000)),
            Math.max(filters.sqftRange[0], Math.min(filters.sqftRange[1], 5000))
        ],
        bedrooms: filters.bedrooms.filter(bed => bed >= 1 && bed <= 5),
        dateRange: [
            filters.dateRange[0] || '2020-01-01',
            filters.dateRange[1] || '2023-12-31'
        ]
    };
};

/**
 * Creates a human-readable description of current filters
 * Useful for displaying current filter state to users
 * @param filters - Current filter state
 * @returns Human-readable string describing filters
 */
export const getFilterDescription = (filters: FilterState): string => {
    const parts: string[] = [];

    // Price range description
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) {
        const min = filters.priceRange[0].toLocaleString();
        const max = filters.priceRange[1].toLocaleString();
        parts.push(`Price: $${min} - $${max}`);
    }

    // Square footage description
    if (filters.sqftRange[0] > 0 || filters.sqftRange[1] < 5000) {
        const min = filters.sqftRange[0].toLocaleString();
        const max = filters.sqftRange[1].toLocaleString();
        parts.push(`Size: ${min} - ${max} sqft`);
    }

    // Bedrooms description
    const allBedrooms = [1, 2, 3, 4, 5];
    if (filters.bedrooms.length !== allBedrooms.length ||
        !allBedrooms.every(bed => filters.bedrooms.includes(bed))) {
        const bedrooms = filters.bedrooms.sort().join(', ');
        parts.push(`Bedrooms: ${bedrooms}`);
    }

    // Date range description
    if (filters.dateRange[0] !== '2020-01-01' || filters.dateRange[1] !== '2023-12-31') {
        const start = new Date(filters.dateRange[0]).toLocaleDateString();
        const end = new Date(filters.dateRange[1]).toLocaleDateString();
        parts.push(`Date: ${start} - ${end}`);
    }

    return parts.length > 0 ? parts.join(' | ') : 'All properties';
};