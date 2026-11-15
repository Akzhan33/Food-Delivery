import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Field from '../components/Field';
import { CloseIcon } from '../components/icons';
import { useCart } from '../context/CartContext';
import { usePayment } from '../context/PaymentContext';
import {
    formatCardNumber,
    formatExpiry,
    validateCardNumber,
    validateCvc,
    validateExpiry,
    validateHolder,
} from '../utils/card';
import { colors, fonts } from '../theme';

type Errors = { holder?: string; number?: string; expiry?: string; cvc?: string };

export default function AddCardScreen() {
    const insets = useSafeAreaInsets();
    const { brand: brandParam } = useLocalSearchParams<{ brand?: string }>();
    const brand = brandParam === 'visa' ? 'visa' : 'mastercard';
    const { totalPrice } = useCart();
    const { addCard } = usePayment();

    const [holder, setHolder] = useState('');
    const [number, setNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [errors, setErrors] = useState<Errors>({});

    const clearError = (field: keyof Errors) => {
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const submit = () => {
        const found = {
            holder: validateHolder(holder),
            number: validateCardNumber(number),
            expiry: validateExpiry(expiry),
            cvc: validateCvc(cvc),
        };
        if (found.holder || found.number || found.expiry || found.cvc) {
            setErrors(found);
            return;
        }
        addCard({ brand, holder: holder.trim(), last4: number.replace(/\D/g, '').slice(-4) });
        router.replace({ pathname: '/payment-success', params: { total: String(totalPrice) } });
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <CircleButton label="Закрыть" onPress={() => router.back()}>
                        <CloseIcon color={colors.title} size={16} />
                    </CircleButton>
                    <Text style={styles.title}>Добавить карту</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 16, paddingTop: 8 }}
                >
                    <Field
                        label="Имя владельца карты"
                        placeholder="IVAN IVANOV"
                        value={holder}
                        onChangeText={(text) => {
                            setHolder(text);
                            clearError('holder');
                        }}
                        error={errors.holder}
                        autoCapitalize="characters"
                        autoCorrect={false}
                    />
                    <Field
                        label="Номер карты"
                        placeholder="0000 0000 0000 0000"
                        value={number}
                        onChangeText={(text) => {
                            setNumber(formatCardNumber(text));
                            clearError('number');
                        }}
                        error={errors.number}
                        keyboardType="number-pad"
                    />
                    <View style={styles.row}>
                        <View style={styles.half}>
                            <Field
                                label="Срок действия"
                                placeholder="ММ/ГГ"
                                value={expiry}
                                onChangeText={(text) => {
                                    setExpiry(formatExpiry(text));
                                    clearError('expiry');
                                }}
                                error={errors.expiry}
                                keyboardType="number-pad"
                            />
                        </View>
                        <View style={styles.half}>
                            <Field
                                label="CVC"
                                placeholder="•••"
                                value={cvc}
                                onChangeText={(text) => {
                                    setCvc(text.replace(/\D/g, '').slice(0, 3));
                                    clearError('cvc');
                                }}
                                error={errors.cvc}
                                keyboardType="number-pad"
                                secureTextEntry
                            />
                        </View>
                    </View>
                    <Button title="Добавить и оплатить" onPress={submit} style={styles.button} />
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.white },
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    title: { ...fonts.bold, fontSize: 22, color: colors.title },
    row: { flexDirection: 'row', gap: 12 },
    half: { flex: 1 },
    button: { marginTop: 12 },
});