import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '~/context/auth';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const _layout = () => {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="add-news"
        options={{
          href: user?.role === 'ADMIN' ? undefined : null,
          title: 'Tambah Berita',
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="add" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil Saya',
          tabBarIcon: ({ color, size }) => <AntDesign name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default _layout;
