export function validateRequired(value: string, message: string) {
    return value.trim() ? '' : message;
}

export function validateEmail(value: string) {
    const email = value.trim();
    if (!email) return 'Введите почту';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Введите корректную почту';
    return '';
}
export function validatePhone(value: string) {
    const phone = value.trim();
    if (!phone) return '';
    if (!/^\+?[\d\s()-]{10,18}$/.test(phone)) return 'Введите корректный номер';
    return '';
}

export function validatePostCode(value: string) {
    const code = value.trim();
    if (!code) return '';
    if (!/^\d{5,6}$/.test(code)) return 'Индекс — 5 или 6 цифр';
    return '';
}