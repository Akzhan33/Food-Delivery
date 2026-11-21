import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Order } from '../context/CartContext';
import { formatItemsCount, formatOrderDate, formatTenge } from '../utils/format';
import Button from './Button';
import ProductImage from './ProductImage';
import { colors, fonts } from '../theme';

type Props = {
    order: Order;
    onTrack: () => void;
    onCancel: () => void;
    onReorder: () => void;
};

const statusInfo = {
    ongoing: { label: 'В пути', color: colors.primary },
    completed: { label: 'Выполнен', color: '#12A06A' },
    canceled: { label: 'Отменён', color: colors.error },
};

export default function OrderCard({ order, onTrack, onCancel, onReorder }: Props) {
    const [open, setOpen] = useState(false);
    const status = statusInfo[order.status];
    const first = order.items[0];
    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const title = order.items.length > 1 ? `${first.product.title} и ещё ${order.items.length - 1}` : first.product.title;

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.kind}>Продукты</Text>
                <Text style={[styles.status, { color: status.color }]}>{status.label}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.main}>
                <ProductImage uri={first.product.thumbnail} size={64} />
                <View style={styles.info}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                        <Text style={styles.id}>№{order.id}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.price}>{formatTenge(order.total)}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.meta} numberOfLines={1}>
                            {formatOrderDate(order.createdAt)} • {formatItemsCount(count)}
                        </Text>
                    </View>
                </View>
            </View>

            {open ? (
                <View style={styles.items}>
                    {order.items.map((item) => (
                        <View key={item.product.id} style={styles.itemRow}>
                            <Text style={styles.itemName} numberOfLines={1}>
                                {item.quantity}× {item.product.title}
                            </Text>
                            <Text style={styles.itemPrice}>{formatTenge(item.product.price * item.quantity)}</Text>
                        </View>
                    ))}
                </View>
            ) : null}

            <View style={styles.actions}>
                {order.status === 'ongoing' ? (
                    <>
                        <Button title="Отследить" onPress={onTrack} style={styles.action} />
                        <Button title="Отменить" outline onPress={onCancel} style={styles.action} />
                    </>
                ) : (
                    <>
                        <Button title={open ? 'Скрыть' : 'Состав'} outline onPress={() => setOpen((value) => !value)} style={styles.action} />
                        <Button title="Повторить" onPress={onReorder} style={styles.action} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { paddingVertical: 4 },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    kind: { ...fonts.regular, fontSize: 14, color: colors.grayText },
    status: { ...fonts.bold, fontSize: 13 },
    divider: { height: 1, backgroundColor: colors.line, marginVertical: 12 },
    main: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    info: { flex: 1 },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    title: { ...fonts.bold, fontSize: 15, color: colors.title, flex: 1 },
    id: { ...fonts.regular, fontSize: 12, color: colors.grayText, textDecorationLine: 'underline' },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
    price: { ...fonts.bold, fontSize: 14, color: colors.title },
    separator: { width: 1, height: 14, backgroundColor: colors.line },
    meta: { ...fonts.regular, fontSize: 12, color: colors.gray, flex: 1 },
    items: { marginTop: 12, backgroundColor: colors.input, borderRadius: 12, padding: 12, gap: 8 },
    itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    itemName: { ...fonts.regular, fontSize: 13, color: colors.title, flex: 1 },
    itemPrice: { ...fonts.semiBold, fontSize: 13, color: colors.title },
    actions: { flexDirection: 'row', gap: 12, marginTop: 14 },
    action: { flex: 1, height: 44 },
});