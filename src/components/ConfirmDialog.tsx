import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { colors, fonts } from '../theme';

type Props = {
    visible: boolean;
    title: string;
    text: string;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({ visible, title, text, confirmLabel, cancelLabel = 'Отмена', onConfirm, onCancel }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Закрыть" />
                <View style={styles.card}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.text}>{text}</Text>
                    <View style={styles.row}>
                        <Button title={cancelLabel} outline onPress={onCancel} style={styles.button} />
                        <Button title={confirmLabel} onPress={onConfirm} style={styles.button} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(18,18,35,0.55)' },
    card: { backgroundColor: colors.white, borderRadius: 20, padding: 20 },
    title: { ...fonts.bold, fontSize: 18, color: colors.title },
    text: { ...fonts.regular, fontSize: 14, lineHeight: 21, color: colors.grayText, marginTop: 8 },
    row: { flexDirection: 'row', gap: 12, marginTop: 22 },
    button: { flex: 1, height: 48 },
});