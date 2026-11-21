import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Field from '../components/Field';
import { BackIcon } from '../components/icons';
import { useUser } from '../context/UserContext';
import { validateEmail, validatePhone, validateRequired } from '../utils/validation';
import { colors, fonts } from '../theme';

type Errors = { name?: string; email?: string; phone?: string };

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const { user, updateUser } = useUser();

    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [bio, setBio] = useState(user?.bio ?? '');
    const [errors, setErrors] = useState<Errors>({});

    const clearError = (field: keyof Errors) => {
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const submit = () => {
        const found = {
            name: validateRequired(name, 'Введите имя'),
            email: validateEmail(email),
            phone: validatePhone(phone),
        };
        if (found.name || found.email || found.phone) {
            setErrors(found);
            return;
        }
        updateUser({ name: name.trim(), email: email.trim(), phone: phone.trim(), bio: bio.trim() });
        router.back();
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <CircleButton label="Назад" onPress={() => router.back()}>
                        <BackIcon />
                    </CircleButton>
                    <Text style={styles.title}>Редактировать профиль</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
                >
                    <View style={styles.avatar}>
                        <Avatar name={name} size={104} tone="orange" />
                    </View>

                    <Field
                        label="Полное имя"
                        placeholder="Иван Иванов"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            clearError('name');
                        }}
                        error={errors.name}
                        autoCapitalize="words"
                    />
                    <Field
                        label="Эл. почта"
                        placeholder="example@gmail.com"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            clearError('email');
                        }}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Field
                        label="Телефон"
                        placeholder="+7 700 000 00 00"
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text);
                            clearError('phone');
                        }}
                        error={errors.phone}
                        keyboardType="phone-pad"
                    />
                    <Field
                        label="О себе"
                        placeholder="Расскажите о себе"
                        value={bio}
                        onChangeText={setBio}
                        multiline
                    />

                    <Button title="Сохранить" onPress={submit} style={styles.save} />
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.white },
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
    title: { ...fonts.bold, fontSize: 22, color: colors.title },
    avatar: { alignItems: 'center', paddingVertical: 20 },
    save: { marginTop: 8 },
});