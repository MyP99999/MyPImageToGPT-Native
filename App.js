import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView className="flex-1 bg-slate-600">
        <StackNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
}

