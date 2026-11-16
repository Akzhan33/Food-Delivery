import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { CartProvider } from '../context/CartContext';
import { PaymentProvider } from '../context/PaymentContext';
import { UserProvider } from '../context/UserContext';
import { colors } from '../theme';

export default function RootLayout() {
  const [loaded] = useFonts({ Poppins_700Bold });

  if (!loaded) return null;

  return (
    <UserProvider>
      <CartProvider>
        <PaymentProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: colors.white },
            }}
          />
        </PaymentProvider>
      </CartProvider>
    </UserProvider>
  );
}