import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CircleButton from '../components/CircleButton';
import ConfirmDialog from '../components/ConfirmDialog';
import { BackIcon } from '../components/icons';
import OrderCard from '../components/OrderCard';
import { useCart } from '../context/CartContext';
import { colors, fonts } from '../theme';

type Tab = 'ongoing' | 'history';

const tabs: { key: Tab; label: string }[] = [
    { key: 'ongoing', label: 'Текущие' },
    { key: 'history', label: 'История' },
];

export default function OrdersScreen() {
    const insets = useSafeAreaInsets();
    const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
    const { orders, cancelOrder, reorder } = useCart();
    const [tab, setTab] = useState<Tab>(tabParam === 'history' ? 'history' : 'ongoing');
    const [cancelId, setCancelId] = useState<string | null>(null);

    const list = orders.filter((order) => (tab === 'ongoing' ? order.status === 'ongoing' : order.status !== 'ongoing'));

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <CircleButton label="Назад" onPress={() => router.back()}>
                    <BackIcon />
                </CircleButton>
                <Text style={styles.title}>Мои заказы</Text>
            </View>

            <View style={styles.tabs}>
                {tabs.map((item) => {
                    const active = item.key === tab;
                    return (
                        <Pressable
                            key={item.key}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                            onPress={() => setTab(item.key)}
                            style={[styles.tab, active && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, active && styles.tabTextActive]}>{item.label}</Text>
                        </Pressable>
                    );
                })}
            </View>

            <FlatList
                data={list}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onTrack={() => router.push({ pathname: '/track-order', params: { id: item.id } })}
                        onCancel={() => setCancelId(item.id)}
                        onReorder={() => {
                            reorder(item);
                            router.push('/cart');
                        }}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>{tab === 'ongoing' ? 'Нет текущих заказов' : 'История пуста'}</Text>
                        <Text style={styles.emptyText}>
                            {tab === 'ongoing' ? 'Оформленные заказы появятся здесь.' : 'Завершённые и отменённые заказы появятся здесь.'}
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 24, flexGrow: 1 }}
            />

            <ConfirmDialog
                visible={cancelId !== null}
                title="Отменить заказ?"
                text={`Заказ №${cancelId ?? ''} будет отменён.`}
                confirmLabel="Отменить заказ"
                cancelLabel="Не отменять"
                onCancel={() => setCancelId(null)}
                onConfirm={() => {
                    if (cancelId) cancelOrder(cancelId);
                    setCancelId(null);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    title: { ...fonts.bold, fontSize: 22, color: colors.title },
    tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
    tabActive: { borderBottomColor: colors.primary },
    tabText: { ...fonts.medium, fontSize: 15, color: colors.gray },
    tabTextActive: { color: colors.primary },
    separator: { height: 1, backgroundColor: colors.line, marginVertical: 16 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
    emptyTitle: { ...fonts.bold, fontSize: 18, color: colors.title },
    emptyText: { ...fonts.regular, fontSize: 14, color: colors.grayText, textAlign: 'center', marginTop: 6 },
});