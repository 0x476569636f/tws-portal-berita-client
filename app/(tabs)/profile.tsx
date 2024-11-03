import { Alert, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { useAuth } from '~/context/auth';
import Avatar from '~/components/Avatar';
import { Button } from '~/components/nativewindui/Button';
import { hp } from '~/lib/common';
import { getAvatarUrl } from '~/services/user';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Apakah anda yakin ingin keluar?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: logout,
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenWrapper routeName="Profil Saya">
      <View className="rounded-3xl bg-card">
        <View className="flex items-center justify-center">
          <View className="m-4">
            <Avatar
              uri={getAvatarUrl(user?.name ?? 'default')}
              size={hp(15)}
              style={{
                borderWidth: 1,
              }}
            />
          </View>

          <Text variant={'body'} className="font-bold">
            {user?.name.toUpperCase()}
          </Text>
          <Text variant={'footnote'}>{user?.email}</Text>
        </View>
        <View className="mt-6 p-4">
          <Button variant="primary" onPress={handleLogout}>
            <Text>Keluar</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;
