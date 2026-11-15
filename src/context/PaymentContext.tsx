import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type CardBrand = 'visa' | 'mastercard';

export type SavedCard = {
    id: string;
    brand: CardBrand;
    holder: string;
    last4: string;
};

type PaymentValue = {
    cards: SavedCard[];
    addCard: (card: Omit<SavedCard, 'id'>) => void;
};

const PaymentContext = createContext<PaymentValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
    const [cards, setCards] = useState<SavedCard[]>([]);

    const addCard = useCallback((card: Omit<SavedCard, 'id'>) => {
        setCards((current) => [...current, { ...card, id: String(Date.now()) }]);
    }, []);

    const value = useMemo(() => ({ cards, addCard }), [cards, addCard]);

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment нужно использовать внутри PaymentProvider');
    }
    return context;
}