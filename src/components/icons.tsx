import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
type IconProps = { color?: string; size?: number };

const base = { fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function FilterIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M3 7h18M3 17h12" stroke={color} strokeWidth={2.2} />
        </Svg>
    );
}

export function CartIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h7.9a1.6 1.6 0 0 0 1.6-1.2L20 8H6.2" stroke={color} strokeWidth={2} />
            <Circle cx="9.5" cy="19.5" r="1.5" fill={color} />
            <Circle cx="16.5" cy="19.5" r="1.5" fill={color} />
        </Svg>
    );
}

export function PlusIcon({ color = '#FFFFFF', size = 16 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.6} />
        </Svg>
    );
}

export function MinusIcon({ color = '#FF7622', size = 16 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M5 12h14" stroke={color} strokeWidth={2.6} />
        </Svg>
    );
}

export function BackIcon({ color = '#181C2E', size = 18 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="m15 5-7 7 7 7" stroke={color} strokeWidth={2.4} />
        </Svg>
    );
}

export function CheckIcon({ color = '#FFFFFF', size = 40 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="m5 12 5 5 9-10" stroke={color} strokeWidth={2.6} />
        </Svg>
    );
}

export function SearchIcon({ color = '#A0A5BA', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2.2} fill="none" />
            <Path {...base} d="m20 20-3.5-3.5" stroke={color} strokeWidth={2.2} />
        </Svg>
    );
}

export function CloseIcon({ color = '#FFFFFF', size = 12 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth={3} />
        </Svg>
    );
}

export function UserIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} fill="none" />
            <Path {...base} d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

export function ChatIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

export function SendIcon({ color = '#FFFFFF', size = 18 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M21 3 10 14M21 3l-7 18-4-7-7-4z" stroke={color} strokeWidth={2.2} />
        </Svg>
    );
}

export function ChevronIcon({ color = '#A0A5BA', size = 16 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="m9 5 7 7-7 7" stroke={color} strokeWidth={2.4} />
        </Svg>
    );
}

export function BoxIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5 12 12l9-4.5M12 12v9" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

export function LogoutIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9" stroke={color} strokeWidth={2} />
        </Svg>
    );
}
export function HomeIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

export function WorkIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Rect x="3" y="7" width="18" height="13" rx="2" stroke={color} strokeWidth={2} fill="none" />
            <Path {...base} d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

export function PinIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" stroke={color} strokeWidth={2} />
            <Circle cx="12" cy="10" r="2.5" stroke={color} strokeWidth={2} fill="none" />
        </Svg>
    );
}

export function EditIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zM14 7l3 3" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

export function TrashIcon({ color = '#181C2E', size = 20 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path {...base} d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" stroke={color} strokeWidth={2} />
        </Svg>
    );
}