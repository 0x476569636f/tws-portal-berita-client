import React from 'react';
import { hp } from '~/lib/common';
import { Image } from 'expo-image';
import { useColorScheme } from '~/lib/useColorScheme';

type AvatarProps = {
  uri: string;
  size?: number;
  style?: any;
  className?: string;
  source?: string;
};

const Avatar: React.FC<AvatarProps> = ({ uri, size = hp(4.5), style, className, source }) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Image
      source={uri}
      style={{
        width: size,
        height: size,
        borderColor: isDarkColorScheme ? '#FFFFFF' : '#000000',
        borderRadius: size / 2,
        ...style,
      }}
      className={className}
    />
  );
};

export default Avatar;
