import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useRef, useState } from 'react';
import { Animated, Easing, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const STATIC_PRICES: Record<string, number> = {
  RELIANCE: 2500,
  TCS: 3700,
  INFY: 1450,
  HDFCBANK: 1600,
  SBIN: 600,
};

const INITIAL_BALANCE = 100000;

export default function TradeScreen() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState('BUY');
  const [message, setMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ type: string; symbol: string; qty: number; price: number; time: string }>>([]);
  const tradeAnim = useRef(new Animated.Value(1)).current;

  const handleTrade = () => {
    Animated.sequence([
      Animated.timing(tradeAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(tradeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
    const qty = parseInt(quantity);
    const key = symbol.toUpperCase();
    const price = STATIC_PRICES[key];
    if (!symbol || !qty || !price) {
      setMessage('Please enter a valid symbol and quantity.');
      return;
    }
    const cost = qty * price;
    if (action === 'BUY') {
      if (cost > balance) {
        setMessage('Insufficient funds!');
        return;
      }
      setBalance(b => b - cost);
      setPortfolio(p => ({
        ...p,
        [key]: (p[key] || 0) + qty,
      }));
      setMessage(`Bought ${qty} ${key} @ ₹${price} each!`);
      setHistory(h => [
        { type: 'BUY', symbol: key, qty, price, time: new Date().toLocaleTimeString() },
        ...h,
      ]);
    } else {
      if ((portfolio[key] || 0) < qty) {
        setMessage('Not enough shares to sell!');
        return;
      }
      setBalance(b => b + cost);
      setPortfolio(p => ({
        ...p,
        [key]: p[key] - qty,
      }));
      setMessage(`Sold ${qty} ${key} @ ₹${price} each!`);
      setHistory(h => [
        { type: 'SELL', symbol: key, qty, price, time: new Date().toLocaleTimeString() },
        ...h,
      ]);
    }
    setSymbol('');
    setQuantity('');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Trade</ThemedText>
      <View style={styles.balanceBox}>
        <ThemedText style={styles.balanceText}>Balance: ₹{balance}</ThemedText>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Symbol (e.g. RELIANCE)"
          value={symbol}
          onChangeText={setSymbol}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: action === 'BUY' ? '#4A90E2' : '#50E3C2' }]}
          onPress={() => setAction(action === 'BUY' ? 'SELL' : 'BUY')}
        >
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>{action}</ThemedText>
        </TouchableOpacity>
      </View>
      <Animated.View style={{ transform: [{ scale: tradeAnim }] }}>
        <TouchableOpacity style={styles.tradeBtn} onPress={handleTrade}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Execute Trade</ThemedText>
        </TouchableOpacity>
      </Animated.View>
      {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      <ThemedText style={styles.portfolioTitle}>Portfolio</ThemedText>
      <FlatList
        data={Object.entries(portfolio).filter(([_, qty]) => qty > 0)}
        keyExtractor={([symbol]) => symbol}
        renderItem={({ item }) => (
          <View style={styles.portfolioItem}>
            <ThemedText style={styles.portfolioSymbol}>{item[0]}</ThemedText>
            <ThemedText style={styles.portfolioQty}>Qty: {item[1]}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={styles.emptyPortfolio}>No holdings yet.</ThemedText>}
      />
      <ThemedText style={styles.historyTitle}>History</ThemedText>
      <FlatList
        data={history}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <ThemedText style={{ color: item.type === 'BUY' ? '#4A90E2' : '#50E3C2', fontWeight: 'bold' }}>{item.type}</ThemedText>
            <ThemedText>{item.symbol}</ThemedText>
            <ThemedText>Qty: {item.qty}</ThemedText>
            <ThemedText>₹{item.price}</ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#888' }}>{item.time}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={styles.emptyHistory}>No trades yet.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D3D47',
    textAlign: 'center',
  },
  balanceBox: {
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 1,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tradeBtn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
  },
  message: {
    color: '#D0021B',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  portfolioTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  portfolioItem: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    alignItems: 'center',
    elevation: 1,
  },
  portfolioSymbol: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  portfolioQty: {
    color: '#1D3D47',
  },
  emptyPortfolio: {
    color: '#888',
    fontStyle: 'italic',
    marginVertical: 8,
    textAlign: 'center',
  },
  historyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  historyItem: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginVertical: 2,
    alignItems: 'center',
    elevation: 1,
  },
  emptyHistory: {
    color: '#888',
    fontStyle: 'italic',
    marginVertical: 8,
    textAlign: 'center',
  },
});
