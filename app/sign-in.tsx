import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import React from 'react';
import { BackButton } from '~/components/BackButton';
import { useRouter } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import Input from '~/components/Input';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '~/lib/useColorScheme';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '~/components/nativewindui/Button';
import Loading from '~/components/Loading';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { useAuth } from '~/context/auth';

const schema = yup.object().shape({
  email: yup.string().required('* Email harus di isi').email('Email tidak valid'),
  password: yup.string().required('* Password harus di isi'),
});

const SignIn = () => {
  const { login } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  type FormData = yup.InferType<typeof schema>;

  const onPressSend = async (formData: FormData) => {
    const email = formData.email.trim();
    const password = formData.password.trim();

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Gagal', error?.response?.data?.message || 'Ada masalah saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
          <View className="flex flex-1 gap-11 px-3">
            <BackButton onPress={() => router.back()} />

            <View className="gap-y-1">
              <Text className="text-3xl font-bold">Selamat Datang Kembali!</Text>
              <Text className="mt-2 text-lg font-normal tracking-wide">
                Masuk untuk Mengakses Berita Terkini dan Informasi Terbaru
              </Text>
            </View>
            <View className="gap-8 rounded-xl border border-border bg-card p-4 pb-6">
              <View className="mt-4 gap-2">
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      icon={
                        <AntDesign
                          name="mail"
                          size={24}
                          color={isDarkColorScheme ? 'white' : 'black'}
                        />
                      }
                      placeholder="Masukan Email Anda"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                  name="email"
                />
                {errors.email && (
                  <Text variant={'footnote'} className="text-red-500">
                    {errors.email.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      icon={
                        <AntDesign
                          name="lock"
                          size={24}
                          color={isDarkColorScheme ? 'white' : 'black'}
                        />
                      }
                      placeholder="Masukan Password"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                    />
                  )}
                  name="password"
                />
                {errors.password && (
                  <Text variant={'footnote'} className="text-red-500">
                    {errors.password.message}
                  </Text>
                )}
              </View>
              <Button onPress={handleSubmit(onPressSend)} disabled={loading}>
                {loading ? <Loading /> : <Text>Masuk</Text>}
              </Button>
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
