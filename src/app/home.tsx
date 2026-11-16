import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchProducts, Product } from '../api/products';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import CategoryChips from '../components/CategoryChips';
import CircleButton from '../components/CircleButton';
import FilterSheet from '../components/FilterSheet';
import { CartIcon, FilterIcon } from '../components/icons';
import Logo from '../components/Logo';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import SearchField from '../components/SearchField';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { ALL_CATEGORIES, applyFilters, DEFAULT_FILTERS, Filters, isDefaultFilters } from '../utils/filters';
import { colors, fonts } from '../theme';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { totalCount } = useCart();
  const { user, signOut } = useUser();
  const firstName = user?.name.split(' ')[0] ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((items) => {
        if (!cancelled) {
          setProducts(items);
          setError('');
        }
      })
      .catch(() => {
        if (!cancelled) setError('Не удалось загрузить продукты. Проверьте интернет.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const categories = useMemo(() => [ALL_CATEGORIES, ...Array.from(new Set(products.map((item) => item.category)))], [products]);

  const visible = useMemo(() => applyFilters(products, filters, search), [products, filters, search]);

  const filtersActive = !isDefaultFilters(filters);

  const logout = () => {
    signOut();
    router.replace('/login');
  };

  const retry = () => {
    setLoading(true);
    setAttempt((n) => n + 1);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <CircleButton label="Фильтры и сортировка" dot={filtersActive} onPress={() => setFilterOpen(true)}>
          <FilterIcon />
        </CircleButton>
        <Logo size={26} />
        <CircleButton label="Корзина" dark badge={totalCount} onPress={() => router.push('/cart')}>
          <CartIcon color={colors.white} />
        </CircleButton>
      </View>

      <View style={styles.greetingRow}>
        <Text style={styles.greeting}>
          {firstName ? `Привет, ${firstName}! ` : 'Привет! '}
          <Text style={styles.greetingBold}>{getGreeting()}!</Text>
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Аккаунт" onPress={() => router.push('/profile')}>
          <Avatar name={user?.name ?? ''} size={40} />
        </Pressable>
      </View>
      <SearchField value={search} onChangeText={setSearch} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Повторить" onPress={retry} style={styles.retry} />
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <View>
              <View style={styles.chips}>
                <CategoryChips
                  categories={categories}
                  selected={filters.category}
                  onSelect={(category) => setFilters({ ...filters, category })}
                />
              </View>
              <PromoBanner />
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Все продукты</Text>
                <Text style={styles.sectionCount}>
                  {visible.length} из {products.length}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Ничего не найдено</Text>
              <Text style={styles.emptyText}>Попробуйте изменить запрос или категорию.</Text>
            </View>
          }
          ListFooterComponent={
            <Pressable accessibilityRole="button" hitSlop={10} onPress={logout} style={styles.logout}>
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </Pressable>
          }
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}

      <FilterSheet
        visible={filterOpen}
        categories={categories}
        value={filters}
        onApply={(next) => {
          setFilters(next);
          setFilterOpen(false);
        }}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  greeting: { ...fonts.regular, fontSize: 16, color: colors.grayText, flex: 1 },
  greetingBold: { ...fonts.bold, color: colors.title },
  list: { marginTop: 8 },
  chips: { marginHorizontal: -4, marginBottom: 14 },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 22, marginBottom: 14 },
  sectionTitle: { ...fonts.bold, fontSize: 20, color: colors.title },
  sectionCount: { ...fonts.regular, fontSize: 14, color: colors.gray },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { ...fonts.regular, fontSize: 15, color: colors.grayText, textAlign: 'center', marginBottom: 20 },
  retry: { alignSelf: 'stretch' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { ...fonts.bold, fontSize: 18, color: colors.title },
  emptyText: { ...fonts.regular, fontSize: 14, color: colors.grayText, marginTop: 6, textAlign: 'center' },
  logout: { alignItems: 'center', paddingVertical: 24 },
  logoutText: { ...fonts.regular, fontSize: 15, color: colors.primary },
});