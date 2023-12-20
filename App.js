import 'expo-dev-client';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthProvider from './context/useAuth';
import TokensProvider from './context/useTokens';
import HistoryProvider from './context/useHistory';
import * as WebBrowser from 'expo-web-browser'
import { StripeProvider } from '@stripe/stripe-react-native';

WebBrowser.maybeCompleteAuthSession()

export default function App() {
  return (
    <StripeProvider
      publishableKey = {process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    >
      <NavigationContainer>
        <AuthProvider>
          <TokensProvider>
            <HistoryProvider>
              <SafeAreaView className="flex-1 bg-slate-600">
                <StackNavigator />
              </SafeAreaView>
            </HistoryProvider>
          </TokensProvider>
        </AuthProvider>
      </NavigationContainer >
    </StripeProvider>
  );
}

