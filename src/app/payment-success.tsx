import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Illustration from '../components/Illustration';
import { useCart } from '../context/CartContext';
import { formatTenge } from '../utils/format';
import { colors, fonts } from '../theme';

export default function PaymentSuccessScreen() {
    const insets = useSafeAreaInsets();
    const { total } = useLocalSearchParams<{ total?: string }>();
    const { clear } = useCart();

    useEffect(() => {
        clear();
    }, [clear]);

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) }]}>
            <Stack.Screen options={{ gestureEnabled: false }} />
            <StatusBar style="dark" />
            <View style={styles.center}>
                <Illustration name="success" width={300} height={260} />
                <Text style={styles.title}>Поздравляем!</Text>
                <Text style={styles.text}>Вы успешно оплатили заказ. Приятного аппетита!</Text>
                {total ? <Text style={styles.total}>Сумма: {formatTenge(Number(total))}</Text> : null}
            </View>
            <Button title="К продуктам" onPress={() => router.dismissAll()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { ...fonts.bold, fontSize: 24, color: colors.title, marginTop: 20 },
    text: { ...fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grayText, textAlign: 'center', marginTop: 10, maxWidth: 280 },
    total: { ...fonts.semiBold, fontSize: 16, color: colors.primary, marginTop: 14 },
});