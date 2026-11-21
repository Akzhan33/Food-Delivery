import { SavedAddress } from '../context/AddressContext';

export function formatAddress(item: SavedAddress) {
    return [item.address, item.apartment ? `кв. ${item.apartment}` : ''].filter(Boolean).join(', ');
}