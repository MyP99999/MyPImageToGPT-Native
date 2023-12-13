import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthProvider from './context/useAuth';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SafeAreaView className="flex-1 bg-slate-800">
          <StackNavigator />
        </SafeAreaView>
      </AuthProvider>
    </NavigationContainer>
  );
}

