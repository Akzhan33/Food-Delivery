import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronIcon } from './icons';
import { colors, fonts } from '../theme';

type Props = {
    icon: ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
};

export default function MenuRow({ icon, title, subtitle, onPress, danger }: Props) {
    return (
        <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
            <View style={[styles.iconTile, danger && styles.iconTileDanger]}>{icon}</View>
            <View style={styles.texts}>
                <Text style={[styles.title, danger && styles.titleDanger]}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {danger ? null : <ChevronIcon />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
    iconTile: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1E6', alignItems: 'center', justifyContent: 'center' },
    iconTileDanger: { backgroundColor: '#FDECEC' },
    texts: { flex: 1 },
    title: { ...fonts.medium, fontSize: 15, color: colors.title },
    titleDanger: { color: colors.error },
    subtitle: { ...fonts.regular, fontSize: 12, color: colors.gray, marginTop: 2 },
});