import React from 'react';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

export default function AddressMap() {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 375 320" preserveAspectRatio="xMidYMid slice">
            <Rect width="375" height="320" fill="#F2F3F7" />

            <Path d="M-10 70 C60 40 150 70 200 60 C260 50 300 30 390 20 L390 55 C310 70 260 90 190 100 C120 108 50 90 -10 100 Z" fill="#FFD79A" />
            <Path d="M30 150 C55 135 85 150 80 185 C60 200 35 190 30 150 Z" fill="#FFD79A" />
            <Path d="M300 285 C330 265 380 255 400 270 L400 330 C360 330 320 320 300 285 Z" fill="#FFD79A" />

            <Path d="M215 95 C250 70 320 70 355 100 C360 140 335 175 310 185 L270 165 C235 145 210 125 215 95 Z" fill="#9BE3A8" />
            <Path d="M-5 25 C25 15 55 30 50 55 C30 70 0 60 -5 25 Z" fill="#9BE3A8" />
            <Path d="M150 305 C180 290 220 290 240 305 L240 330 L150 330 Z" fill="#9BE3A8" />

            <Path d="M-20 250 L400 120" stroke="#FFFFFF" strokeWidth={22} />
            <Path d="M120 -10 C140 90 175 190 215 330" stroke="#FFFFFF" strokeWidth={18} fill="none" />
            <Path d="M-20 160 C80 150 200 190 400 230" stroke="#FFFFFF" strokeWidth={14} fill="none" />
            <Path d="M290 -10 L330 330" stroke="#FFFFFF" strokeWidth={12} />
            <Path d="M-10 110 L110 60" stroke="#FFFFFF" strokeWidth={8} />
            <Path d="M20 290 L140 220" stroke="#FFFFFF" strokeWidth={8} />
            <Circle cx="70" cy="250" r="46" stroke="#FFFFFF" strokeWidth={8} fill="none" />

            <Circle cx="190" cy="165" r="30" fill="#FFFFFF" opacity={0.7} />
            <Circle cx="190" cy="165" r="12" fill="#FF5A2C" />

            <Rect x="120" y="100" width="140" height="30" rx="8" fill="#2A2D3E" />
            <Path d="M182 130 L190 140 L198 130 Z" fill="#2A2D3E" />
            <SvgText x="190" y="120" fontSize="12" fill="#FFFFFF" textAnchor="middle">
                Ваш адрес
            </SvgText>
        </Svg>
    );
}