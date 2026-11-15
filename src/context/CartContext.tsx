import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Product } from '../api/products';

export type CartItem = {
    product: Product;
    quantity: number;
};

export type Order = {
    id: string;
    items: CartItem[];
    total: number;
    address: string;
    createdAt: number;
};

type CartValue = {
    items: CartItem[];
    totalCount: number;
    totalPrice: number;
    address: string;
    lastOrder: Order | null;
    getQuantity: (id: string) => number;
    add: (product: Product) => void;
    decrease: (id: string) => void;
    clear: () => void;
    setAddress: (value: string) => void;
    placeOrder: () => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [address, setAddressState] = useState('');
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const itemsRef = useRef<CartItem[]>([]);
    const addressRef = useRef('');

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    const add = useCallback((product: Product) => {
        setItems((current) => {
            const found = current.find((item) => item.product.id === product.id);
            if (found) {
                return current.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
                );
            }
            return [...current, { product, quantity: 1 }];
        });
    }, []);

    const decrease = useCallback((id: string) => {
        setItems((current) =>
            current.flatMap((item) => {
                if (item.product.id !== id) return [item];
                return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
            }),
        );
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const setAddress = useCallback((value: string) => {
        addressRef.current = value;
        setAddressState(value);
    }, []);

    const placeOrder = useCallback(() => {
        const current = itemsRef.current;
        if (current.length === 0) return;
        const total = current.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const now = Date.now();
        itemsRef.current = [];
        setLastOrder({ id: String(now).slice(-5), items: current, total, address: addressRef.current, createdAt: now });
        setItems([]);
    }, []);

    const value = useMemo(() => {
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const getQuantity = (id: string) => items.find((item) => item.product.id === id)?.quantity ?? 0;
        return { items, totalCount, totalPrice, address, lastOrder, getQuantity, add, decrease, clear, setAddress, placeOrder };
    }, [items, address, lastOrder, add, decrease, clear, setAddress, placeOrder]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart нужно использовать внутри CartProvider');
    }
    return context;
}