import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import ConfirmDialog from '../components/ConfirmDialog';
import { BackIcon, EditIcon, HomeIcon, PinIcon, TrashIcon, WorkIcon } from '../components/icons';
import { AddressLabel, labelNames, SavedAddress, useAddresses } from '../context/AddressContext';
import { formatAddress } from '../utils/address';
import { colors, fonts } from '../theme';

const labelColors: Record<AddressLabel, string> = { home: '#3E8EDD', work: '#A855C7', other: colors.primary };

function LabelIcon({ label }: { label: AddressLabel }) {
    const color = labelColors[label];
    if (label === 'home') return <HomeIcon color={color} size={22} />;
    if (label === 'work') return <WorkIcon color={color} size={22} />;
    return <PinIcon color={color} size={22} />;
}

export default function AddressesScreen() {
    const insets = useSafeAreaInsets();
    const { addresses, removeAddress } = useAddresses();
    const [removing, setRemoving] = useState<SavedAddress | null>(null);

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <CircleButton label="Назад" onPress={() => router.back()}>
                    <BackIcon />
                </CircleButton>
                <Text style={styles.title}>Мои адреса</Text>
            </View>

            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.iconCircle}>
                            <LabelIcon label={item.label} />
                        </View>
                        <View style={styles.texts}>
                            <Text style={styles.label}>{labelNames[item.label].toUpperCase()}</Text>
                            <Text style={styles.address}>{formatAddress(item)}</Text>
                        </View>
                        <View style={styles.actions}>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={`Изменить адрес: ${labelNames[item.label]}`}
                                hitSlop={8}
                                onPress={() => router.push({ pathname: '/add-address', params: { id: item.id } })}
                            >
                                <EditIcon color={colors.primary} size={20} />
                            </Pressable>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={`Удалить адрес: ${labelNames[item.label]}`}
                                hitSlop={8}
                                onPress={() => setRemoving(item)}
                            >
                                <TrashIcon color={colors.primary} size={20} />
                            </Pressable>
                        </View>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>Адресов пока нет</Text>
                        <Text style={styles.emptyText}>Добавьте адрес, чтобы быстрее оформлять заказы.</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 12, flexGrow: 1 }}
            />

            <View style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: 12 }}>
                <Button title="Добавить новый адрес" onPress={() => router.push('/add-address')} />
            </View>

            <ConfirmDialog
                visible={removing !== null}
                title="Удалить адрес?"
                text={removing ? `Адрес «${labelNames[removing.label]}» будет удалён.` : ''}
                confirmLabel="Удалить"
                onCancel={() => setRemoving(null)}
                onConfirm={() => {
                    if (removing) removeAddress(removing.id);
                    setRemoving(null);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
    title: { ...fonts.bold, fontSize: 22, color: colors.title },
    card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.input, borderRadius: 16, padding: 16 },
    iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
    texts: { flex: 1 },
    label: { ...fonts.bold, fontSize: 12, color: colors.title, letterSpacing: 0.5 },
    address: { ...fonts.regular, fontSize: 13, lineHeight: 19, color: colors.grayText, marginTop: 4 },
    actions: { flexDirection: 'row', gap: 16, alignSelf: 'flex-start' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
    emptyTitle: { ...fonts.bold, fontSize: 18, color: colors.title },
    emptyText: { ...fonts.regular, fontSize: 14, color: colors.grayText, textAlign: 'center', marginTop: 6 },
});