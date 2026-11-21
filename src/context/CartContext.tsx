import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Product } from '../api/products';

export type CartItem = {
    product: Product;
    quantity: number;
};

export type OrderStatus = 'ongoing' | 'completed' | 'canceled';

export type Order = {
    id: string;
    items: CartItem[];
    total: number;
    address: string;
    createdAt: number;
    status: OrderStatus;
};

type CartValue = {
    items: CartItem[];
    totalCount: number;
    totalPrice: number;
    address: string;
    orders: Order[];
    lastOrder: Order | null;
    activeOrder: Order | null;
    getQuantity: (id: string) => number;
    add: (product: Product) => void;
    decrease: (id: string) => void;
    clear: () => void;
    setAddress: (value: string) => void;
    placeOrder: () => void;
    cancelOrder: (id: string) => void;
    completeOrder: (id: string) => void;
    reorder: (order: Order) => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [address, setAddressState] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const itemsRef = useRef<CartItem[]>([]);
    const addressRef = useRef('');
    const orderCounter = useRef(1000);

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
        const order: Order = {
            id: String(orderCounter.current++),
            items: current,
            total,
            address: addressRef.current,
            createdAt: Date.now(),
            status: 'ongoing',
        };
        itemsRef.current = [];
        setOrders((list) => [order, ...list]);
        setItems([]);
    }, []);

    const changeStatus = useCallback((id: string, status: OrderStatus) => {
        setOrders((list) => list.map((order) => (order.id === id && order.status === 'ongoing' ? { ...order, status } : order)));
    }, []);

    const cancelOrder = useCallback((id: string) => changeStatus(id, 'canceled'), [changeStatus]);

    const completeOrder = useCallback((id: string) => changeStatus(id, 'completed'), [changeStatus]);

    const reorder = useCallback((order: Order) => {
        setItems((current) => {
            const next = [...current];
            for (const item of order.items) {
                const index = next.findIndex((entry) => entry.product.id === item.product.id);
                if (index >= 0) {
                    next[index] = { ...next[index], quantity: next[index].quantity + item.quantity };
                } else {
                    next.push({ ...item });
                }
            }
            return next;
        });
    }, []);

    const value = useMemo(() => {
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const getQuantity = (id: string) => items.find((item) => item.product.id === id)?.quantity ?? 0;
        const lastOrder = orders[0] ?? null;
        const activeOrder = orders.find((order) => order.status === 'ongoing') ?? null;
        return {
            items,
            totalCount,
            totalPrice,
            address,
            orders,
            lastOrder,
            activeOrder,
            getQuantity,
            add,
            decrease,
            clear,
            setAddress,
            placeOrder,
            cancelOrder,
            completeOrder,
            reorder,
        };
    }, [items, address, orders, add, decrease, clear, setAddress, placeOrder, cancelOrder, completeOrder, reorder]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart нужно использовать внутри CartProvider');
    }
    return context;
}