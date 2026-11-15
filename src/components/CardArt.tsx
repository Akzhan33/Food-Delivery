import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

export default function CardArt({ width = 190 }: { width?: number }) {
    const height = (width * 120) / 190;
    return (
        <Svg width={width} height={height} viewBox="0 0 190 120">
            <G transform="rotate(-6 95 60)">
                <Rect x="10" y="10" width="170" height="100" rx="12" fill="#F4572B" />
                <Path d="M10 70 L110 10 L180 10 L180 40 L70 110 L22 110 Q10 110 10 98 Z" fill="#FF8A3D" />
                <Path d="M60 10 L130 10 L50 110 L10 110 L10 90 Z" fill="#FFC857" opacity={0.85} />
                <Rect x="24" y="28" width="30" height="22" rx="4" fill="#FFFFFF" opacity={0.95} />
                <Circle cx="150" cy="86" r="10" fill="#FFFFFF" opacity={0.35} />
                <Circle cx="162" cy="86" r="10" fill="#FFFFFF" opacity={0.35} />
                <Rect x="24" y="88" width="60" height="6" rx="3" fill="#FFFFFF" opacity={0.7} />
            </G>
        </Svg>
    );
}