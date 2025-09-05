import { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function HomeScreen() {
  const router = require('expo-router').useRouter();
  const learnScale = useRef(new Animated.Value(1)).current;
  const tradeScale = useRef(new Animated.Value(1)).current;

  const animatePress = (scaleRef: Animated.Value, cb: () => void) => {
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleRef, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start(cb);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to ArthSathi!
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Your personal finance learning and trading playground.
      </ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: learnScale }] }}>
          <Pressable
            style={[styles.button, { backgroundColor: '#4A90E2', shadowColor: '#4A90E2' }]}
            onPress={() => animatePress(learnScale, () => router.push('/explore'))}
          >
            <ThemedText type="title" style={[styles.buttonText, { color: '#fff' }]}>Learn</ThemedText>
          </Pressable>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: tradeScale }] }}>
          <Pressable
            style={[styles.button, { backgroundColor: '#50E3C2', shadowColor: '#50E3C2' }]}
            onPress={() => animatePress(tradeScale, () => router.push('/trade'))}
          >
            <ThemedText type="title" style={[styles.buttonText, { color: '#fff' }]}>Trade</ThemedText>
          </Pressable>
        </Animated.View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(180deg, #E0F7FA 0%, #FFFFFF 100%)',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 32,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D3D47',
    textShadowColor: '#A1CEDC',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginBottom: 40,
    color: '#4A90E2',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  button: {
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
  },
});
