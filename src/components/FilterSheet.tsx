import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { CloseIcon } from './icons';
import { DEFAULT_FILTERS, Filters, PriceKey, SortKey } from '../utils/filters';
import { colors, fonts } from '../theme';

const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'default', label: 'По умолчанию' },
    { key: 'priceAsc', label: 'Сначала дешёвые' },
    { key: 'priceDesc', label: 'Сначала дорогие' },
    { key: 'nameAsc', label: 'По алфавиту' },
];

const priceOptions: { key: PriceKey; label: string }[] = [
    { key: 'all', label: 'Любая' },
    { key: 'low', label: 'до 1 000 ₸' },
    { key: 'mid', label: '1 000–3 000 ₸' },
    { key: 'high', label: 'от 3 000 ₸' },
];

type Props = {
    visible: boolean;
    categories: string[];
    value: Filters;
    onApply: (filters: Filters) => void;
    onClose: () => void;
};

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={onPress}
            style={[styles.chip, selected && styles.chipSelected]}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </Pressable>
    );
}

function FilterDialog({ categories, value, onApply, onClose }: Omit<Props, 'visible'>) {
    const [draft, setDraft] = useState<Filters>(value);

    return (
        <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Закрыть" />
            <View style={styles.card}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Фильтр поиска</Text>
                    <Pressable accessibilityRole="button" accessibilityLabel="Закрыть" onPress={onClose} style={styles.close}>
                        <CloseIcon color={colors.title} size={14} />
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.section}>СОРТИРОВКА</Text>
                    <View style={styles.chips}>
                        {sortOptions.map((option) => (
                            <Chip key={option.key} label={option.label} selected={draft.sort === option.key} onPress={() => setDraft({ ...draft, sort: option.key })} />
                        ))}
                    </View>

                    <Text style={styles.section}>КАТЕГОРИЯ</Text>
                    <View style={styles.chips}>
                        {categories.map((item) => (
                            <Chip key={item} label={item} selected={draft.category === item} onPress={() => setDraft({ ...draft, category: item })} />
                        ))}
                    </View>

                    <Text style={styles.section}>ЦЕНА</Text>
                    <View style={styles.chips}>
                        {priceOptions.map((option) => (
                            <Chip key={option.key} label={option.label} selected={draft.price === option.key} onPress={() => setDraft({ ...draft, price: option.key })} />
                        ))}
                    </View>
                </ScrollView>

                <Button title="Применить" onPress={() => onApply(draft)} style={styles.apply} />
                <Pressable accessibilityRole="button" hitSlop={10} onPress={() => setDraft(DEFAULT_FILTERS)} style={styles.reset}>
                    <Text style={styles.resetText}>Сбросить</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function FilterSheet({ visible, ...rest }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={rest.onClose}>
            <FilterDialog {...rest} />
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(18,18,35,0.55)' },
    card: { maxHeight: '88%', backgroundColor: colors.white, borderRadius: 20, padding: 20 },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    title: { ...fonts.semiBold, fontSize: 16, color: colors.title },
    close: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ECF0F4', alignItems: 'center', justifyContent: 'center' },
    section: { ...fonts.regular, fontSize: 11, color: colors.gray, letterSpacing: 0.8, marginTop: 18, marginBottom: 12 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 16, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
    chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { ...fonts.medium, fontSize: 14, color: colors.grayText },
    chipTextSelected: { color: colors.white },
    apply: { marginTop: 22 },
    reset: { alignItems: 'center', paddingTop: 16, paddingBottom: 2 },
    resetText: { ...fonts.regular, fontSize: 14, color: colors.primary },
});