import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import { BackIcon } from '../components/icons';
import ProductImage from '../components/ProductImage';
import TrackMap from '../components/TrackMap';
import { useCart } from '../context/CartContext';
import { formatOrderDate } from '../utils/format';
import { colors, fonts } from '../theme';

export default function TrackOrderScreen() {
    const insets = useSafeAreaInsets();
    const { lastOrder } = useCart();

    if (!lastOrder) {
        return (
            <View style={[styles.empty, { paddingTop: insets.top + 16 }]}>
                <StatusBar style="dark" />
                <Text style={styles.emptyTitle}>Нет активных заказов</Text>
                <Text style={styles.emptyText}>Оформите заказ, и здесь появится его отслеживание.</Text>
                <Button title="К продуктам" onPress={() => router.dismissAll()} style={styles.emptyButton} />
            </View>
        );
    }

    const first = lastOrder.items[0];
    const lines = lastOrder.items.slice(0, 2);
    const rest = lastOrder.items.length - lines.length;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={StyleSheet.absoluteFill}>
                <TrackMap />
            </View>

            <View style={[styles.header, { top: insets.top + 12 }]}>
                <CircleButton dark label="Назад" onPress={() => router.back()}>
                    <BackIcon color={colors.white} />
                </CircleButton>
                <Text style={styles.title}>Отслеживание заказа</Text>
            </View>

            <View style={[styles.card, { bottom: Math.max(insets.bottom, 12) + 12 }]}>
                <View style={styles.handle} />
                <View style={styles.top}>
                    <ProductImage uri={first.product.thumbnail} size={72} />
                    <View style={styles.info}>
                        <Text style={styles.orderTitle}>Заказ №{lastOrder.id}</Text>
                        <Text style={styles.orderDate}>Оформлен: {formatOrderDate(lastOrder.createdAt)}</Text>
                        {lines.map((item) => (
                            <Text key={item.product.id} style={styles.line} numberOfLines={1}>
                                {item.quantity}× {item.product.title}
                            </Text>
                        ))}
                        {rest > 0 ? <Text style={styles.more}>и ещё {rest}</Text> : null}
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.statusRow}>
                    <Text style={styles.status}>Курьер в пути</Text>
                    <Text style={styles.eta}>≈ 25 мин</Text>
                </View>
                <Text style={styles.address} numberOfLines={2}>
                    Адрес: {lastOrder.address}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F3F7' },
    header: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 14 },
    title: { ...fonts.bold, fontSize: 18, color: colors.title },
    card: {
        position: 'absolute',
        left: 16,
        right: 16,
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 16,
        shadowColor: '#1F2A44',
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line, marginBottom: 14 },
    top: { flexDirection: 'row', gap: 14 },
    info: { flex: 1 },
    orderTitle: { ...fonts.bold, fontSize: 17, color: colors.title },
    orderDate: { ...fonts.regular, fontSize: 12, color: colors.gray, marginTop: 2, marginBottom: 6 },
    line: { ...fonts.medium, fontSize: 13, color: colors.title, marginTop: 2 },
    more: { ...fonts.regular, fontSize: 12, color: colors.gray, marginTop: 2 },
    divider: { height: 1, backgroundColor: colors.line, marginVertical: 14 },
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    status: { ...fonts.bold, fontSize: 15, color: colors.primary },
    eta: { ...fonts.semiBold, fontSize: 15, color: colors.title },
    address: { ...fonts.regular, fontSize: 13, color: colors.grayText, marginTop: 8 },
    empty: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { ...fonts.bold, fontSize: 22, color: colors.title },
    emptyText: { ...fonts.regular, fontSize: 15, color: colors.grayText, textAlign: 'center', marginTop: 8 },
    emptyButton: { alignSelf: 'stretch', marginTop: 28 },
});