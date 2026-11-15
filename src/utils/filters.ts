import { Product } from '../api/products';

export type SortKey = 'default' | 'priceAsc' | 'priceDesc' | 'nameAsc';
export type PriceKey = 'all' | 'low' | 'mid' | 'high';

export type Filters = {
    sort: SortKey;
    category: string;
    price: PriceKey;
};

export const ALL_CATEGORIES = 'Все';

export const DEFAULT_FILTERS: Filters = { sort: 'default', category: ALL_CATEGORIES, price: 'all' };

export function isDefaultFilters(filters: Filters) {
    return (
        filters.sort === DEFAULT_FILTERS.sort &&
        filters.category === DEFAULT_FILTERS.category &&
        filters.price === DEFAULT_FILTERS.price
    );
}

function normalize(text: string) {
    return text.trim().toLowerCase().replace(/ё/g, 'е');
}

function matchesPrice(price: number, key: PriceKey) {
    if (key === 'low') return price < 1000;
    if (key === 'mid') return price >= 1000 && price <= 3000;
    if (key === 'high') return price > 3000;
    return true;
}

export function applyFilters(products: Product[], filters: Filters, search: string) {
    const query = normalize(search);
    const filtered = products.filter(
        (item) =>
            (filters.category === ALL_CATEGORIES || item.category === filters.category) &&
            matchesPrice(item.price, filters.price) &&
            (!query || normalize(item.title).includes(query)),
    );
    const sorted = [...filtered];
    if (filters.sort === 'priceAsc') sorted.sort((a, b) => a.price - b.price);
    if (filters.sort === 'priceDesc') sorted.sort((a, b) => b.price - a.price);
    if (filters.sort === 'nameAsc') sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    return sorted;
}