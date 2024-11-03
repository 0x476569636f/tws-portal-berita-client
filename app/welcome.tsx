import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-around px-4">
        <View className="flex items-center">
          <Image className="h-60 w-60" source={require('~/assets/bg.png')} resizeMode="contain" />
        </View>
        <View className="gap-2">
          <Text className="text-center" variant={'largeTitle'}>
            Portal Berita
          </Text>
          <Text className="text-center" variant={'footnote'}>
            Tempatnya Baca Berita Terupdate
          </Text>
        </View>
        <View className="w-full gap-7">
          <Button onPress={() => router.push('/sign-in')}>
            <Text>Mulai Sekarang</Text>
          </Button>
        </View>
        <View className="mb-6 flex flex-row items-center gap-1">
          <Text variant={'subhead'}>Sudah punya akun?</Text>
          <Pressable onPress={() => router.push('/sign-in')}>
            <Text variant={'subhead'} className="font-semibold text-primary">
              Masuk
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;
