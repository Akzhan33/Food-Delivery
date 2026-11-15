import React, { ComponentRef, ReactNode, Ref } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts } from '../theme';

export type InputRef = ComponentRef<typeof TextInput>;

type Props = TextInputProps & {
  label: string;
  right?: ReactNode;
  error?: string;
  labelRight?: ReactNode;
  inputRef?: Ref<InputRef>;
};

export default function Field({ label, right, error, labelRight, inputRef, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        {labelRight}
      </View>
      <View style={[styles.box, error ? styles.boxError : null]}>
        <TextInput
          {...rest}
          ref={inputRef}
          placeholderTextColor={colors.gray}
          selectionColor={colors.primary}
          style={[styles.input, style]}
        />
        {right}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { ...fonts.regular, fontSize: 12, color: colors.label },
  box: {
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
  },
  boxError: { borderColor: colors.error },
  error: { ...fonts.regular, fontSize: 12, color: colors.error, marginTop: 6 },
  input: { flex: 1, height: 56, ...fonts.regular, fontSize: 14, color: colors.grayText, paddingVertical: 0, outlineStyle: 'none' } as never,
});