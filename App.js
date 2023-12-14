import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthProvider from './context/useAuth';
import TokensProvider from './context/useTokens';
import HistoryProvider from './context/useHistory';

export default function App() {
  return (
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
  );
}

