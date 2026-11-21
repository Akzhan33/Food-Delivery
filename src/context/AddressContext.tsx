import React, { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type AddressLabel = 'home' | 'work' | 'other';

export type SavedAddress = {
    id: string;
    label: AddressLabel;
    address: string;
    street: string;
    postCode: string;
    apartment: string;
};

export type AddressInput = Omit<SavedAddress, 'id'>;

export const labelNames: Record<AddressLabel, string> = {
    home: 'Дом',
    work: 'Работа',
    other: 'Другое',
};

type AddressValue = {
    addresses: SavedAddress[];
    addAddress: (input: AddressInput) => void;
    updateAddress: (id: string, input: AddressInput) => void;
    removeAddress: (id: string) => void;
};

const AddressContext = createContext<AddressValue | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const counter = useRef(0);

    const addAddress = useCallback((input: AddressInput) => {
        counter.current += 1;
        const id = `a${counter.current}`;
        setAddresses((current) => [...current, { ...input, id }]);
    }, []);

    const updateAddress = useCallback((id: string, input: AddressInput) => {
        setAddresses((current) => current.map((item) => (item.id === id ? { ...input, id } : item)));
    }, []);

    const removeAddress = useCallback((id: string) => {
        setAddresses((current) => current.filter((item) => item.id !== id));
    }, []);

    const value = useMemo(
        () => ({ addresses, addAddress, updateAddress, removeAddress }),
        [addresses, addAddress, updateAddress, removeAddress],
    );

    return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddresses нужно использовать внутри AddressProvider');
    }
    return context;
}