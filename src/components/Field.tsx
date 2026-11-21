import React, { ComponentRef, ReactNode, Ref } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts } from '../theme';

export type InputRef = ComponentRef<typeof TextInput>;

type Props = TextInputProps & {
  label: string;
  left?: ReactNode;
  right?: ReactNode;
  error?: string;
  labelRight?: ReactNode;
  inputRef?: Ref<InputRef>;
};

export default function Field({ label, left, right, error, labelRight, inputRef, style, ...rest }: Props) {
  const multiline = Boolean(rest.multiline);

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        {labelRight}
      </View>
      <View style={[styles.box, multiline && styles.boxMultiline, error ? styles.boxError : null]}>
        {left ? <View style={styles.left}>{left}</View> : null}
        <TextInput
          {...rest}
          ref={inputRef}
          placeholderTextColor={colors.gray}
          selectionColor={colors.primary}
          style={[styles.input, multiline && styles.inputMultiline, style]}
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
  boxMultiline: { height: 110, alignItems: 'flex-start', paddingVertical: 14 },
  boxError: { borderColor: colors.error },
  left: { marginRight: 10 },
  error: { ...fonts.regular, fontSize: 12, color: colors.error, marginTop: 6 },
  input: { flex: 1, height: 56, ...fonts.regular, fontSize: 14, color: colors.grayText, paddingVertical: 0, outlineStyle: 'none' } as never,
  inputMultiline: { height: 80, textAlignVertical: 'top' },
});