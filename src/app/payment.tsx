import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import CardArt from '../components/CardArt';
import CircleButton from '../components/CircleButton';
import { BackIcon, CheckIcon } from '../components/icons';
import PaymentMethods, { BrandLogo, brandNames, PaymentMethod } from '../components/PaymentMethods';
import { useCart } from '../context/CartContext';
import { usePayment } from '../context/PaymentContext';
import { formatTenge } from '../utils/format';
import { colors, fonts } from '../theme';

export default function PaymentScreen() {
    const insets = useSafeAreaInsets();
    const { totalPrice } = useCart();
    const { cards } = usePayment();
    const [method, setMethod] = useState<PaymentMethod>('mastercard');
    const [chosenId, setChosenId] = useState<string | null>(null);

    const brandCards = method === 'cash' ? [] : cards.filter((card) => card.brand === method);
    const selectedCard = brandCards.find((card) => card.id === chosenId) ?? brandCards[0];
    const canPay = method === 'cash' || Boolean(selectedCard);

    const pay = () => {
        router.replace({ pathname: '/payment-success', params: { total: String(totalPrice) } });
    };

    const header = (
        <View style={styles.header}>
            <CircleButton label="Назад" onPress={() => router.back()}>
                <BackIcon />
            </CircleButton>
            <Text style={styles.title}>Оплата</Text>
        </View>
    );

    if (totalPrice === 0) {
        return (
            <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
                <StatusBar style="dark" />
                {header}
                <View style={styles.centerEmpty}>
                    <Text style={styles.emptyTitle}>Корзина пуста</Text>
                    <Text style={styles.emptyText}>Добавьте продукты, чтобы перейти к оплате.</Text>
                    <Button title="К продуктам" onPress={() => router.dismissAll()} style={styles.emptyButton} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <StatusBar style="dark" />
            {header}

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.content}>
                <PaymentMethods selected={method} onSelect={setMethod} />

                {method === 'cash' ? (
                    <View style={styles.panel}>
                        <Text style={styles.panelTitle}>Оплата наличными</Text>
                        <Text style={styles.panelText}>Вы оплатите заказ курьеру при получении.</Text>
                    </View>
                ) : brandCards.length === 0 ? (
                    <View style={styles.panel}>
                        <CardArt />
                        <Text style={styles.panelTitle}>Карта {brandNames[method]} не добавлена</Text>
                        <Text style={styles.panelText}>Вы можете добавить карту и сохранить её на потом.</Text>
                    </View>
                ) : (
                    <View style={styles.cards}>
                        {brandCards.map((card) => {
                            const active = card.id === selectedCard?.id;
                            return (
                                <Pressable
                                    key={card.id}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: active }}
                                    onPress={() => setChosenId(card.id)}
                                    style={[styles.cardRow, active && styles.cardRowActive]}
                                >
                                    <BrandLogo brand={card.brand} />
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardTitle}>
                                            {brandNames[card.brand]} •••• {card.last4}
                                        </Text>
                                        <Text style={styles.cardHolder}>{card.holder}</Text>
                                    </View>
                                    <View style={[styles.radio, active && styles.radioActive]}>{active ? <CheckIcon size={12} /> : null}</View>
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                {method !== 'cash' ? (
                    <Button
                        title="+ Добавить"
                        outline
                        onPress={() => router.push({ pathname: '/add-card', params: { brand: method } })}
                        style={styles.addButton}
                    />
                ) : null}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>ИТОГО:</Text>
                    <Text style={styles.totalPrice}>{formatTenge(totalPrice)}</Text>
                </View>
                <Button title="Оплатить и подтвердить" onPress={pay} disabled={!canPay} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    title: { ...fonts.bold, fontSize: 22, color: colors.title },
    scroll: { marginHorizontal: -12 },
    content: { paddingBottom: 24, paddingTop: 12, paddingHorizontal: 12 },
    panel: {
        marginTop: 24,
        backgroundColor: colors.input,
        borderRadius: 16,
        alignItems: 'center',
        paddingVertical: 28,
        paddingHorizontal: 24,
    },
    panelTitle: { ...fonts.bold, fontSize: 15, color: colors.title, textAlign: 'center', marginTop: 16 },
    panelText: { ...fonts.regular, fontSize: 13, color: colors.grayText, textAlign: 'center', marginTop: 6, lineHeight: 19 },
    cards: { marginTop: 24, gap: 12 },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: colors.input,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    cardRowActive: { borderColor: colors.primary, backgroundColor: colors.white },
    cardInfo: { flex: 1 },
    cardTitle: { ...fonts.semiBold, fontSize: 15, color: colors.title },
    cardHolder: { ...fonts.regular, fontSize: 13, color: colors.gray, marginTop: 2 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
    radioActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    addButton: { marginTop: 16 },
    footer: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16, gap: 16 },
    totalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
    totalLabel: { ...fonts.regular, fontSize: 13, color: colors.gray, letterSpacing: 0.5 },
    totalPrice: { ...fonts.bold, fontSize: 26, color: colors.title },
    centerEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
    emptyTitle: { ...fonts.bold, fontSize: 22, color: colors.title },
    emptyText: { ...fonts.regular, fontSize: 15, color: colors.grayText, textAlign: 'center', marginTop: 8 },
    emptyButton: { alignSelf: 'stretch', marginTop: 28 },
});