import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import CircleButton from '../components/CircleButton';
import { BackIcon, BoxIcon, CartIcon, ChatIcon, LogoutIcon, PinIcon, UserIcon } from '../components/icons';
import MenuRow from '../components/MenuRow';
import { useAddresses } from '../context/AddressContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { colors, fonts } from '../theme';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { user, signOut } = useUser();
    const { orders, totalCount } = useCart();
    const { addresses } = useAddresses();
    const ongoingCount = orders.filter((order) => order.status === 'ongoing').length;

    const logout = () => {
        signOut();
        router.dismissAll();
        router.replace('/login');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <CircleButton label="Назад" onPress={() => router.back()}>
                    <BackIcon />
                </CircleButton>
                <Text style={styles.title}>Профиль</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
                <View style={styles.userBlock}>
                    <Avatar name={user?.name ?? ''} size={96} tone="orange" />
                    <Text style={styles.name}>{user?.name || 'Гость'}</Text>
                    <Text style={styles.email}>{user?.email || 'Почта не указана'}</Text>
                    {user?.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}
                </View>

                <View style={styles.group}>
                    <MenuRow
                        icon={<UserIcon color={colors.primary} />}
                        title="Личные данные"
                        subtitle="Имя, почта, телефон"
                        onPress={() => router.push('/edit-profile')}
                    />
                    <View style={styles.divider} />
                    <MenuRow
                        icon={<PinIcon color={colors.primary} />}
                        title="Мои адреса"
                        subtitle={addresses.length > 0 ? `Сохранено: ${addresses.length}` : 'Адресов пока нет'}
                        onPress={() => router.push('/addresses')}
                    />
                </View>

                <View style={styles.group}>
                    <MenuRow
                        icon={<BoxIcon color={colors.primary} />}
                        title="Мои заказы"
                        subtitle={ongoingCount > 0 ? `Текущих: ${ongoingCount}` : orders.length > 0 ? `Всего: ${orders.length}` : 'Заказов пока нет'}
                        onPress={() => router.push('/orders')}
                    />
                    <View style={styles.divider} />
                    <MenuRow icon={<ChatIcon color={colors.primary} />} title="Чат с курьером" onPress={() => router.push('/chat')} />
                    <View style={styles.divider} />
                    <MenuRow
                        icon={<CartIcon color={colors.primary} />}
                        title="Корзина"
                        subtitle={totalCount > 0 ? `Товаров: ${totalCount}` : 'Пока пусто'}
                        onPress={() => router.push('/cart')}
                    />
                </View>

                <View style={styles.group}>
                    <MenuRow icon={<LogoutIcon color={colors.error} />} title="Выйти из аккаунта" danger onPress={logout} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
    title: { ...fonts.bold, fontSize: 22, color: colors.title },
    userBlock: { alignItems: 'center', paddingVertical: 20 },
    name: { ...fonts.bold, fontSize: 22, color: colors.title, marginTop: 16 },
    email: { ...fonts.regular, fontSize: 14, color: colors.gray, marginTop: 4 },
    phone: { ...fonts.regular, fontSize: 14, color: colors.gray, marginTop: 2 },
    group: { backgroundColor: colors.input, borderRadius: 16, marginTop: 16, overflow: 'hidden' },
    divider: { height: 1, backgroundColor: colors.white, marginLeft: 70 },
});