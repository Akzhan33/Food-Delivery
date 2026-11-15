import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  right?: ReactNode;
  outline?: boolean;
};

export default function Button({ title, onPress, style, disabled, right, outline }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[styles.text, outline && styles.outlineText]}>{title.toUpperCase()}</Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  text: { ...fonts.bold, fontSize: 14, color: colors.white, letterSpacing: 0.4 },
  outlineText: { color: colors.primary },
  right: { position: 'absolute', right: 16 },
});