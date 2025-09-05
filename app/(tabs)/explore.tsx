import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LearnScreen() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: 'Hi! Ask me anything about finance, SIP, or risk profiling.' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), sender: 'user', text: query },
    ]);
    setLoading(true);
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
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>Learn</ThemedText>
        <TextInput
          style={styles.searchBar}
          placeholder="Ask a question (e.g. What is SIP?)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.message, item.sender === 'user' ? styles.userMsg : styles.botMsg]}>
              <ThemedText>{item.text}</ThemedText>
            </View>
          )}
          style={styles.chat}
        />
        {loading && <View style={{ alignItems: 'center', marginBottom: 8 }}><ThemedText>Loading...</ThemedText></View>}
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
          <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Send</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#A1CEDC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  chat: {
    flex: 1,
    marginBottom: 16,
  },
  message: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#A1CEDC',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#1D3D47',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
});
