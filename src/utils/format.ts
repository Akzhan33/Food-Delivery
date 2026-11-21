export function formatTenge(value: number) {
    return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;
}

const months = ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];

export function formatOrderDate(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${date.getDate()} ${months[date.getMonth()]}, ${hours}:${minutes}`;
}

export function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
export function formatItemsCount(count: number) {
    const lastTwo = count % 100;
    const last = count % 10;
    let word = 'товаров';
    if (lastTwo < 11 || lastTwo > 14) {
        if (last === 1) word = 'товар';
        else if (last >= 2 && last <= 4) word = 'товара';
    }
    return `${count} ${word}`;
}