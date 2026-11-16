import React from 'react';
import { Text, View } from 'react-native';
import { getInitials } from '../utils/user';
import { UserIcon } from './icons';
import { colors, fonts } from '../theme';

type Props = {
    name: string;
    size?: number;
    tone?: 'orange' | 'dark' | 'soft';
};

const tones = {
    orange: { background: colors.primary, foreground: colors.white },
    dark: { background: colors.title, foreground: colors.white },
    soft: { background: '#FFE7D9', foreground: colors.primary },
};

export default function Avatar({ name, size = 40, tone = 'orange' }: Props) {
    const initials = getInitials(name);
    const { background, foreground } = tones[tone];

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: background,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {initials ? (
                <Text style={{ ...fonts.bold, fontSize: size * 0.38, color: foreground }}>{initials}</Text>
            ) : (
                <UserIcon color={foreground} size={size * 0.5} />
            )}
        </View>
    );
}