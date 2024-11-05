// app/add-news.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { Text } from '~/components/nativewindui/Text';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { COLORS } from '~/theme/colors';
import { Picker, PickerItem } from '~/components/nativewindui/Picker';

interface HandleHeadProps {
  tintColor: string;
}

interface Category {
  id: number;
  namaKategori: string;
}

export default function AddNews() {
  const richText = useRef<RichEditor | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  const handleHead = ({ tintColor }: HandleHeadProps): JSX.Element => (
    <Text style={{ color: tintColor }}>H1</Text>
  );

  useEffect(() => {
    fetchCategories();
  });

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/api/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil data kategori');
    }
  };

  const submitNews = async (): Promise<void> => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul berita tidak boleh kosong');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Konten berita tidak boleh kosong');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL!}/api/news/create`,
        {
          kategoriId: selectedCategory,
          userId: user.id,
          judul: title,
          isi: content,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        Alert.alert('Sukses', 'Berita berhasil ditambahkan');
        setTitle('');
        setContent('');
        richText.current?.setContentHTML('');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Terjadi kesalahan saat mendaftar';
        Alert.alert('Gagal', errorMessage);
      } else {
        Alert.alert('Gagal', 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  };

  const editorInitialHeight = 300;

  const toolbarActions = [
    actions.setBold,
    actions.setItalic,
    actions.setUnderline,
    actions.heading1,
    actions.insertBulletsList,
    actions.insertOrderedList,
    actions.insertLink,
    actions.alignLeft,
    actions.alignCenter,
    actions.alignRight,
  ] as const;

  return (
    <ScreenWrapper routeName="Tambah Berita">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ padding: 16, gap: 16 }}>
            {/* Title Input */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                Judul Berita
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Masukkan judul berita"
                placeholderTextColor={colors.grey}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.grey3,
                  backgroundColor: colors.card,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.foreground,
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                Kategori
              </Text>
              <View
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.grey3,
                  backgroundColor: colors.card,
                  overflow: 'hidden',
                }}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => setSelectedCategory(Number(itemValue))}
                  style={{
                    color: colors.foreground,
                    backgroundColor: 'transparent',
                  }}>
                  {categories.map((category) => (
                    <PickerItem
                      key={category.id}
                      label={category.namaKategori}
                      value={category.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Content Editor */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                Konten Berita
              </Text>
              <View
                style={{
                  overflow: 'hidden',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.grey3,
                  backgroundColor: colors.card,
                }}>
                <RichEditor
                  ref={richText}
                  onChange={setContent}
                  placeholder="Tulis konten berita di sini..."
                  initialHeight={editorInitialHeight}
                  editorStyle={{
                    backgroundColor: colors.card,
                    color: colors.foreground,
                    placeholderColor: colors.grey,
                    contentCSSText: `font-family: sans-serif; font-size: 16px; padding: 12px; color: ${colors.foreground};`,
                  }}
                />
              </View>

              {/* Editor Toolbar */}
              <View
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.grey3,
                  backgroundColor: colors.card,
                }}>
                <RichToolbar
                  editor={richText}
                  actions={toolbarActions}
                  iconMap={{ heading1: handleHead }}
                  iconTint={colors.primary}
                  selectedIconTint={colors.primary}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={submitNews}
              style={{
                marginTop: 24,
                width: '100%',
                borderRadius: 8,
                backgroundColor: colors.primary,
                paddingVertical: 16,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.card,
                }}>
                Tambah Berita
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
