import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { CheckIcon } from './icons';
import { colors, fonts } from '../theme';

export type PaymentMethod = 'cash' | 'visa' | 'mastercard';

export const brandNames = { cash: 'Наличные', visa: 'Visa', mastercard: 'Mastercard' } as const;

const methods: PaymentMethod[] = ['cash', 'visa', 'mastercard'];

export function BrandLogo({ brand }: { brand: PaymentMethod }) {
    if (brand === 'visa') {
        return <Text style={styles.visa}>VISA</Text>;
    }
    if (brand === 'mastercard') {
        return (
            <Svg width={34} height={22} viewBox="0 0 34 22">
                <Circle cx="12" cy="11" r="10" fill="#EB001B" />
                <Circle cx="22" cy="11" r="10" fill="#F79E1B" fillOpacity={0.9} />
            </Svg>
        );
    }
    return (
        <Svg width={30} height={22} viewBox="0 0 30 22">
            <Rect x="1" y="3" width="28" height="16" rx="3" fill="none" stroke={colors.primary} strokeWidth={2} />
            <Circle cx="15" cy="11" r="3.5" fill="none" stroke={colors.primary} strokeWidth={2} />
            <Path d="M5 8v6M25 8v6" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

type Props = {
    selected: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
};

export default function PaymentMethods({ selected, onSelect }: Props) {
    return (
        <View style={styles.row}>
            {methods.map((method) => {
                const active = method === selected;
                return (
                    <Pressable
                        key={method}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={brandNames[method]}
                        onPress={() => onSelect(method)}
                        style={styles.item}
                    >
                        <View style={[styles.tile, active && styles.tileActive]}>
                            <BrandLogo brand={method} />
                            {active ? (
                                <View style={styles.check}>
                                    <CheckIcon size={10} />
                                </View>
                            ) : null}
                        </View>
                        <Text style={[styles.label, active && styles.labelActive]}>{brandNames[method]}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 12 },
    item: { flex: 1, alignItems: 'center' },
    tile: {
        alignSelf: 'stretch',
        height: 68,
        borderRadius: 14,
        backgroundColor: colors.input,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileActive: { borderColor: colors.primary, backgroundColor: colors.white },
    check: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { ...fonts.regular, fontSize: 12, color: colors.grayText, marginTop: 8 },
    labelActive: { ...fonts.semiBold, color: colors.title },
    visa: { fontSize: 18, fontWeight: '800', fontStyle: 'italic', color: '#1A1F71', letterSpacing: 0.5 },
});