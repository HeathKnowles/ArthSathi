import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 32 }}>Welcome!</ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => {}}>
          <ThemedText type="title" style={styles.buttonText}>Learn</ThemedText>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {}}>
          <ThemedText type="title" style={styles.buttonText}>Trade</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  button: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#1D3D47',
    fontWeight: 'bold',
  },
});
