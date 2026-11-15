import React, { useState } from 'react';
import { Image } from 'react-native';
import { colors } from '../theme';

type Props = { uri: string; size?: number; transparent?: boolean };

export default function ProductImage({ uri, size = 72, transparent }: Props) {
    const [failed, setFailed] = useState(false);
    const source = failed ? uri : uri.replace(/\.png$/, '-small.png');

    return (
        <Image
            source={{ uri: source }}
            resizeMode="contain"
            onError={() => setFailed(true)}
            style={{ width: size, height: size, borderRadius: 12, backgroundColor: transparent ? 'transparent' : colors.input }}
        />
    );
}