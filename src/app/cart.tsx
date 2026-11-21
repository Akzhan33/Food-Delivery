import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Field, { InputRef } from '../components/Field';
import { BackIcon } from '../components/icons';
import ProductImage from '../components/ProductImage';
import QuantityControl from '../components/QuantityControl';
import { labelNames, useAddresses } from '../context/AddressContext';
import { CartItem, useCart } from '../context/CartContext';
import { formatAddress } from '../utils/address';
import { formatTenge } from '../utils/format';
import { colors, fonts } from '../theme';

function CartRow({ item }: { item: CartItem }) {
    const { add, decrease } = useCart();
    const { product, quantity } = item;

    return (
        <View style={styles.row}>
            <View style={styles.imageTile}>
                <ProductImage uri={product.thumbnail} size={72} transparent />
            </View>
            <View style={styles.rowInfo}>
                <Text style={styles.rowTitle} numberOfLines={2}>
                    {product.title}
                </Text>
                <Text style={styles.rowTotal}>{formatTenge(product.price * quantity)}</Text>
                <View style={styles.rowBottom}>
                    <Text style={styles.rowUnit}>
                        {formatTenge(product.price)} · за 1 {product.unit}
                    </Text>
                    <QuantityControl dark quantity={quantity} onIncrease={() => add(product)} onDecrease={() => decrease(product.id)} />
                </View>
            </View>
        </View>
    );
}

export default function CartScreen() {
    const insets = useSafeAreaInsets();
    const { items, totalCount, totalPrice, address, setAddress, clear } = useCart();
    const { addresses } = useAddresses();
    const [addressError, setAddressError] = useState('');
    const addressInput = useRef<InputRef>(null);

    const order = () => {
        if (!address.trim()) {
            setAddressError('Введите адрес доставки');
            return;
        }
        router.push('/payment');
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
                <StatusBar style="light" />
                <View style={styles.header}>
                    <CircleButton ghost label="Назад" onPress={() => router.back()}>
                        <BackIcon color={colors.white} />
                    </CircleButton>
                    <Text style={styles.title}>Корзина</Text>
                    {items.length > 0 ? (
                        <Pressable accessibilityRole="button" hitSlop={10} onPress={clear}>
                            <Text style={styles.clear}>ОЧИСТИТЬ</Text>
                        </Pressable>
                    ) : null}
                </View>

                {items.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.centerTitle}>Корзина пуста</Text>
                        <Text style={styles.centerText}>Добавьте продукты из списка.</Text>
                        <Button title="К продуктам" onPress={() => router.back()} style={styles.centerButton} />
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.product.id}
                            renderItem={({ item }) => <CartRow item={item} />}
                            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.list}
                        />
                        <View style={[styles.panel, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                            {addresses.length > 0 ? (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                    style={styles.saved}
                                    contentContainerStyle={styles.savedRow}
                                >
                                    {addresses.map((item) => (
                                        <Pressable
                                            key={item.id}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Адрес: ${labelNames[item.label]}`}
                                            onPress={() => {
                                                setAddress(formatAddress(item));
                                                setAddressError('');
                                            }}
                                            style={styles.savedChip}
                                        >
                                            <Text style={styles.savedChipText}>{labelNames[item.label]}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            ) : null}
                            <Field
                                label="Адрес доставки"
                                placeholder="Улица, дом, квартира"
                                value={address}
                                onChangeText={(text) => {
                                    setAddress(text);
                                    setAddressError('');
                                }}
                                error={addressError}
                                inputRef={addressInput}
                                labelRight={
                                    <Pressable accessibilityRole="button" hitSlop={10} onPress={() => addressInput.current?.focus()}>
                                        <Text style={styles.edit}>ИЗМЕНИТЬ</Text>
                                    </Pressable>
                                }
                            />
                            <View style={styles.totalRow}>
                                <View style={styles.totalLeft}>
                                    <Text style={styles.totalLabel}>ИТОГО:</Text>
                                    <Text style={styles.totalPrice}>{formatTenge(totalPrice)}</Text>
                                </View>
                                <Text style={styles.totalCount}>Товаров: {totalCount}</Text>
                            </View>
                            <Button title="Оформить заказ" onPress={order} />
                        </View>
                    </>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.dark },
    container: { flex: 1, backgroundColor: colors.dark },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, marginBottom: 20 },
    title: { ...fonts.bold, fontSize: 22, color: colors.white, flex: 1 },
    clear: { ...fonts.bold, fontSize: 13, color: colors.primary, letterSpacing: 0.5 },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    imageTile: {
        width: 104,
        height: 104,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.07)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowInfo: { flex: 1 },
    rowTitle: { ...fonts.regular, fontSize: 16, color: colors.white },
    rowTotal: { ...fonts.bold, fontSize: 18, color: colors.white, marginTop: 6 },
    rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
    rowUnit: { ...fonts.regular, fontSize: 12, color: '#8A8FA6', flex: 1, marginRight: 8 },
    panel: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    saved: { flexGrow: 0, marginBottom: 14 },
    savedRow: { gap: 8 },
    savedChip: { paddingHorizontal: 16, height: 36, borderRadius: 18, backgroundColor: '#FFF1E6', alignItems: 'center', justifyContent: 'center' },
    savedChipText: { ...fonts.semiBold, fontSize: 13, color: colors.primary },
    edit: { ...fonts.bold, fontSize: 12, color: colors.primary, letterSpacing: 0.5 },
    totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    totalLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
    totalLabel: { ...fonts.regular, fontSize: 13, color: colors.gray, letterSpacing: 0.5 },
    totalPrice: { ...fonts.bold, fontSize: 26, color: colors.title },
    totalCount: { ...fonts.regular, fontSize: 13, color: colors.primary },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60, paddingHorizontal: 20 },
    centerTitle: { ...fonts.bold, fontSize: 22, color: colors.white },
    centerText: { ...fonts.regular, fontSize: 15, color: '#8A8FA6', textAlign: 'center', marginTop: 8 },
    centerButton: { alignSelf: 'stretch', marginTop: 28 },
});