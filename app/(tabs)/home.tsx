import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/nativewindui/Button';
import { useAuth } from '~/context/auth';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <ScreenWrapper>
      <View>
        <Text>Welcome, {JSON.stringify(user)}</Text>
        <Button onPress={logout}>
          <Text>Logout</Text>
        </Button>
      </View>
    </ScreenWrapper>
  );
}
