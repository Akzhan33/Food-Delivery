import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export default function TrackMap() {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice">
            <Rect width="375" height="812" fill="#F2F3F7" />

            <Path d="M250 60 C290 40 360 50 390 90 C380 130 320 140 280 120 C255 105 240 80 250 60 Z" fill="#FFD79A" />
            <Path d="M-10 190 C40 170 110 170 150 200 C120 215 60 235 -10 250 Z" fill="#FFD79A" />
            <Path d="M170 700 C220 640 300 600 380 590 L390 640 C320 650 250 700 200 790 L150 790 C150 760 160 720 170 700 Z" fill="#FFD79A" />
            <Path d="M-10 700 C20 690 60 720 70 800 L-10 800 Z" fill="#FFD79A" />

            <Path d="M230 270 C270 230 340 200 385 215 C390 270 370 330 345 365 L300 350 L255 330 C240 310 225 290 230 270 Z" fill="#9BE3A8" />
            <Path d="M70 590 C110 575 150 570 175 585 C175 625 150 665 130 690 C100 670 75 640 70 590 Z" fill="#9BE3A8" />

            <Path d="M-20 480 L400 330" stroke="#FFFFFF" strokeWidth={26} />
            <Path d="M140 -20 C170 150 230 330 280 520 S330 760 345 840" stroke="#FFFFFF" strokeWidth={22} fill="none" />
            <Path d="M-20 130 C100 120 250 80 400 30" stroke="#FFFFFF" strokeWidth={16} fill="none" />
            <Path d="M-20 650 C120 600 250 610 400 640" stroke="#FFFFFF" strokeWidth={18} fill="none" />
            <Path d="M60 330 L-20 420" stroke="#FFFFFF" strokeWidth={10} />
            <Path d="M220 560 L400 520" stroke="#FFFFFF" strokeWidth={10} />
            <Path d="M0 370 L200 560" stroke="#FFFFFF" strokeWidth={8} />
            <Path d="M300 300 L260 400" stroke="#FFFFFF" strokeWidth={8} />
            <Circle cx="100" cy="290" r="42" stroke="#FFFFFF" strokeWidth={8} fill="none" />
            <Circle cx="310" cy="690" r="38" stroke="#FFFFFF" strokeWidth={8} fill="none" />

            <Path
                d="M95 440 C120 420 126 400 120 378 C114 358 128 345 155 337 C205 322 255 312 295 285 L300 235"
                stroke="#FF7622"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            <Circle cx="95" cy="440" r="34" fill="#E5484D" opacity={0.18} />
            <Circle cx="95" cy="440" r="24" fill="#E5484D" />
            <Path d="M95 428 C89 428 85 432 85 437 C85 444 95 452 95 452 C95 452 105 444 105 437 C105 432 101 428 95 428 Z" stroke="#FFFFFF" strokeWidth={2} fill="none" />
            <Circle cx="95" cy="437" r="3" stroke="#FFFFFF" strokeWidth={2} fill="none" />

            <Circle cx="300" cy="215" r="42" fill="#FDC22E" opacity={0.16} />
            <Circle cx="300" cy="215" r="30" fill="#FDC22E" opacity={0.32} />
            <Circle cx="300" cy="215" r="18" fill="#F5A623" />
            <Circle cx="300" cy="215" r="5" fill="#FFFFFF" />
        </Svg>
    );
}