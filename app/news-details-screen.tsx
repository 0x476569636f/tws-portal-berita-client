import React from 'react';
import { View, Image, ScrollView, useColorScheme, useWindowDimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { COLORS } from '~/theme/colors';
import { useLocalSearchParams } from 'expo-router';
import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';

const NewsDetailScreen = () => {
  const { width } = useWindowDimensions();
  const article = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const containsHTML = (text: any) => {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(text);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      hourCycle: 'h24',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const getPostAuthor = (obj: any) => {
    const data = JSON.parse(obj);
    return data.name;
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <Image
        source={{
          uri:
            article.imageUrl ||
            'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
        }}
        className="h-64 w-full object-cover"
      />
      <View className="px-4 py-6">
        <Text className="mb-3 text-2xl font-bold" style={{ color: colors.foreground }}>
          {article.judul}
        </Text>
        <View className="mb-4 flex-row items-center">
          <Ionicons name="person-outline" size={14} color={colors.grey} className="mr-2" />
          <Text className="mr-4 text-sm" style={{ color: colors.grey }}>
            {getPostAuthor(article.user)}
          </Text>
          <Ionicons name="calendar-outline" size={14} color={colors.grey} className="mr-2" />
          <Text className="text-sm" style={{ color: colors.grey }}>
            {formatDate(
              Array.isArray(article.createdAt) ? article.createdAt[0] : article.createdAt
            )}
          </Text>
        </View>
        <View className="mb-4 h-px bg-gray-200" />
        {containsHTML(article.isi) ? (
          <RenderHtml
            contentWidth={width - 32}
            source={{ html: Array.isArray(article.isi) ? article.isi.join('') : article.isi }}
            tagsStyles={{
              body: { color: colors.foreground, lineHeight: 24 },
              div: { color: colors.foreground, marginBottom: 16 },
              p: { color: colors.foreground, marginBottom: 16 },
              h1: {
                color: colors.foreground,
                fontSize: 24,
                fontWeight: 'bold',
                marginVertical: 16,
              },
              h2: {
                color: colors.foreground,
                fontSize: 22,
                fontWeight: 'bold',
                marginVertical: 14,
              },
              h3: {
                color: colors.foreground,
                fontSize: 20,
                fontWeight: 'bold',
                marginVertical: 12,
              },
              ul: { marginVertical: 12, paddingLeft: 20 },
              ol: { marginVertical: 12, paddingLeft: 20 },
              li: { color: colors.foreground, marginVertical: 4 },
              a: { color: colors.primary, textDecorationLine: 'underline' },
              strong: { color: colors.foreground, fontWeight: 'bold' },
              em: { color: colors.foreground, fontStyle: 'italic' },
              blockquote: {
                color: colors.grey,
                borderLeftWidth: 2,
                borderLeftColor: colors.primary,
                paddingLeft: 16,
                marginVertical: 16,
                fontStyle: 'italic',
              },
            }}
          />
        ) : (
          <Text className="text-base leading-6" style={{ color: colors.foreground }}>
            {article.isi}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default NewsDetailScreen;
