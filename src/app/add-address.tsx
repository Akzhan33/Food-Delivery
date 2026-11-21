import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressMap from '../components/AddressMap';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Field from '../components/Field';
import { BackIcon, PinIcon } from '../components/icons';
import { AddressLabel, labelNames, useAddresses } from '../context/AddressContext';
import { validatePostCode, validateRequired } from '../utils/validation';
import { colors, fonts } from '../theme';

type Errors = { address?: string; street?: string; postCode?: string };

const labels: AddressLabel[] = ['home', 'work', 'other'];

export default function AddAddressScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { addresses, addAddress, updateAddress } = useAddresses();
    const existing = addresses.find((item) => item.id === id);

    const [label, setLabel] = useState<AddressLabel>(existing?.label ?? 'home');
    const [address, setAddress] = useState(existing?.address ?? '');
    const [street, setStreet] = useState(existing?.street ?? '');
    const [postCode, setPostCode] = useState(existing?.postCode ?? '');
    const [apartment, setApartment] = useState(existing?.apartment ?? '');
    const [errors, setErrors] = useState<Errors>({});

    const clearError = (field: keyof Errors) => {
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const submit = () => {
        const found = {
            address: validateRequired(address, 'Введите адрес'),
            street: validateRequired(street, 'Введите улицу'),
            postCode: validatePostCode(postCode),
        };
        if (found.address || found.street || found.postCode) {
            setErrors(found);
            return;
        }
        const input = {
            label,
            address: address.trim(),
            street: street.trim(),
            postCode: postCode.trim(),
            apartment: apartment.trim(),
        };
        if (existing) {
            updateAddress(existing.id, input);
        } else {
            addAddress(input);
        }
        router.back();
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.flex}>
                <StatusBar style="dark" />
                <View style={styles.map}>
                    <AddressMap />
                </View>
                <View style={[styles.back, { top: insets.top + 12 }]}>
                    <CircleButton dark label="Назад" onPress={() => router.back()}>
                        <BackIcon color={colors.white} />
                    </CircleButton>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scroll}
                >
                    <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
                        <Field
                            label="Адрес"
                            placeholder="Город, улица, дом"
                            value={address}
                            onChangeText={(text) => {
                                setAddress(text);
                                clearError('address');
                            }}
                            error={errors.address}
                            left={<PinIcon color={colors.grayText} size={20} />}
                        />
                        <View style={styles.row}>
                            <View style={styles.half}>
                                <Field
                                    label="Улица"
                                    placeholder="Название улицы"
                                    value={street}
                                    onChangeText={(text) => {
                                        setStreet(text);
                                        clearError('street');
                                    }}
                                    error={errors.street}
                                />
                            </View>
                            <View style={styles.half}>
                                <Field
                                    label="Индекс"
                                    placeholder="010000"
                                    value={postCode}
                                    onChangeText={(text) => {
                                        setPostCode(text.replace(/\D/g, '').slice(0, 6));
                                        clearError('postCode');
                                    }}
                                    error={errors.postCode}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                        <Field label="Квартира" placeholder="Номер квартиры" value={apartment} onChangeText={setApartment} />

                        <Text style={styles.section}>НАЗВАНИЕ АДРЕСА</Text>
                        <View style={styles.chips}>
                            {labels.map((item) => {
                                const active = item === label;
                                return (
                                    <Pressable
                                        key={item}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: active }}
                                        onPress={() => setLabel(item)}
                                        style={[styles.chip, active && styles.chipActive]}
                                    >
                                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{labelNames[item]}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Button title="Сохранить адрес" onPress={submit} style={styles.save} />
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.white },
    map: { position: 'absolute', top: 0, left: 0, right: 0, height: 320 },
    back: { position: 'absolute', left: 20 },
    scroll: { paddingTop: 260 },
    card: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 24 },
    row: { flexDirection: 'row', gap: 12 },
    half: { flex: 1 },
    section: { ...fonts.regular, fontSize: 12, color: colors.label, marginBottom: 10 },
    chips: { flexDirection: 'row', gap: 10 },
    chip: { paddingHorizontal: 22, height: 42, borderRadius: 21, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center' },
    chipActive: { backgroundColor: colors.primary },
    chipText: { ...fonts.medium, fontSize: 14, color: colors.grayText },
    chipTextActive: { color: colors.white },
    save: { marginTop: 24 },
});