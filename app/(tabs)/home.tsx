import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { COLORS } from '~/theme/colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker, PickerItem } from '~/components/nativewindui/Picker';

type News = {
  id: number;
  judul: string;
  isi: string;
  kategoriId: number;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  };
};

const NewsScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [newsArticles, setNewsArticles] = useState<News[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(99999);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllNews();
    setRefreshing(false);
  };

  useEffect(() => {
    getAllNews();
  }, [limit]);

  const getAllNews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/api/news?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.news) {
        setNewsArticles(data.news);
      }
    } catch (error) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengambil data');
    }
  };

  const removeHtmlTags = (str: string): string => {
    if (str === null || str === '') {
      return '';
    }
    return str.replace(/<[^>]*>/g, '');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const renderItem = ({ item }: { item: News }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/news-details-screen',
          params: { ...item, user: JSON.stringify(item.user) },
        })
      }
      className={`flex-row border-b p-4 border-${colors.grey4}`}
      style={{ backgroundColor: colors.card }}>
      <Image
        source={{ uri: item.imageUrl }}
        className="h-24 w-24 rounded"
        style={{ backgroundColor: colors.grey4 }}
      />
      <View className="ml-4 flex-1">
        <Text
          className={`mb-1 text-lg font-bold`}
          style={{ color: colors.foreground }}
          numberOfLines={2}>
          {item.judul}
        </Text>
        <View style={{ maxHeight: 60, overflow: 'hidden' }}>
          <Text>{removeHtmlTags(item.isi).split(' ').slice(0, 8).join(' ')}...</Text>
        </View>
        <View className="mt-2 flex-row justify-between">
          <Text style={{ color: colors.grey, fontSize: 12 }}>{item.user.name}</Text>
          <Text style={{ color: colors.grey, fontSize: 12 }}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper routeName="Beranda">
      <Picker
        selectedValue={limit}
        style={{ height: 50, width: 150, color: colors.foreground, backgroundColor: 'transparent' }}
        onValueChange={(itemValue) => setLimit(itemValue)}>
        <PickerItem label="Semua Berita" value={99999} />
        <PickerItem label="5 Berita Terakhir" value={5} />
        <PickerItem label="10 Berita Terakhir" value={10} />
      </Picker>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <FlatList
          data={newsArticles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewsScreen;
