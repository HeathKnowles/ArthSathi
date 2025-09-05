import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useRef, useState } from "react";
import { Animated, Easing, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function LearnScreen() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: 'Hi! Ask me anything about finance, SIP, or risk profiling.' },
  ]);
  const [loading, setLoading] = useState(false);
  const inputAnim = useRef(new Animated.Value(0)).current;

  const handleSend = async () => {
    if (!query.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), sender: 'user', text: query },
    ]);
    setLoading(true);
    Animated.timing(inputAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    try {
      const res = await fetch('http://10.124.253.191:3001/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { id: String(prev.length + 2), sender: 'bot', text: data.answer || 'No answer.' },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: String(prev.length + 2), sender: 'bot', text: 'Error connecting to backend.' },
      ]);
    }
    setQuery('');
    setLoading(false);
    Animated.timing(inputAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  };

  const renderItem = ({ item }: any) => (
    <Animated.View style={[styles.message, item.sender === 'user' ? styles.userMsg : styles.botMsg, {
      transform: [{ scale: item.sender === 'user' ? 1.05 : 1 }],
      opacity: 1,
    }]}> 
      <ThemedText style={{ color: item.sender === 'user' ? '#4A90E2' : '#1D3D47', fontWeight: '500' }}>{item.text}</ThemedText>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Learn</ThemedText>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
        <Animated.View style={[styles.inputBar, { transform: [{ translateY: inputAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }] }] }>
          <TextInput
            style={styles.searchBar}
            placeholder="Ask a question (e.g. What is SIP?)"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>{loading ? '...' : 'Send'}</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D3D47',
    textAlign: 'center',
  },
  message: {
    marginVertical: 8,
    padding: 14,
    borderRadius: 16,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#A1CEDC',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#D0F0FF',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  inputBar: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    elevation: 4,
    shadowColor: '#A1CEDC',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchBar: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    elevation: 2,
  },
});
