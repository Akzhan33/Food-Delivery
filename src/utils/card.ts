import { validateRequired } from './validation';

export function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function validateHolder(value: string) {
    return validateRequired(value, 'Введите имя владельца карты');
}

export function validateCardNumber(value: string) {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Введите номер карты';
    if (digits.length !== 16) return 'Номер карты должен содержать 16 цифр';
    return '';
}

export function validateExpiry(value: string) {
    if (!value) return 'Введите срок действия';
    const match = /^(\d{2})\/(\d{2})$/.exec(value);
    if (!match) return 'Формат срока: ММ/ГГ';
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return 'Неверный месяц';
    const now = new Date();
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        return 'Срок карты истёк';
    }
    return '';
}

export function validateCvc(value: string) {
    if (!value) return 'Введите CVC';
    if (!/^\d{3}$/.test(value)) return 'CVC — 3 цифры';
    return '';
}