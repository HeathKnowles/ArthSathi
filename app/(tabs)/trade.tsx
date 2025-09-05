import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

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

  const handleTrade = () => {
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

  const handleReset = () => {
    setBalance(INITIAL_BALANCE);
    setPortfolio({});
    setHistory([]);
    setMessage('Game reset!');
  };

  const portfolioList: [string, number][] = Object.entries(portfolio).filter(([_, qty]) => qty > 0) as [string, number][];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Trade</ThemedText>
      <ThemedText style={styles.balance}>Balance: ₹{balance.toLocaleString()}</ThemedText>
      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <ThemedText style={{ color: '#1D3D47', fontWeight: 'bold' }}>Reset Game</ThemedText>
      </TouchableOpacity>
      {message && (
        <View style={styles.messageBox}>
          <ThemedText>{message}</ThemedText>
        </View>
      )}
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
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, action === 'BUY' && styles.selected]} onPress={() => setAction('BUY')}>
          <ThemedText style={styles.actionText}>Buy</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, action === 'SELL' && styles.selected]} onPress={() => setAction('SELL')}>
          <ThemedText style={styles.actionText}>Sell</ThemedText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.tradeBtn} onPress={handleTrade}>
        <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>{action}</ThemedText>
      </TouchableOpacity>
  <ThemedText type="subtitle" style={{ marginTop: 24 }}>Portfolio</ThemedText>
      <FlatList
        data={portfolioList}
        keyExtractor={([symbol]) => symbol}
        renderItem={({ item }) => {
          const [symbol, qty] = item;
          return (
            <View style={styles.portfolioItem}>
              <ThemedText>{symbol}</ThemedText>
              <ThemedText>Qty: {qty}</ThemedText>
              <ThemedText>Price: ₹{STATIC_PRICES[symbol]}</ThemedText>
            </View>
          );
        }}
        ListEmptyComponent={<ThemedText>No holdings yet.</ThemedText>}
        style={{ marginTop: 8 }}
      />

      <ThemedText type="subtitle" style={{ marginTop: 24 }}>Transaction History</ThemedText>
      <FlatList
        data={history}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <ThemedText>{item.time}</ThemedText>
            <ThemedText>{item.type} {item.qty} {item.symbol} @ ₹{item.price}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText>No trades yet.</ThemedText>}
        style={{ marginTop: 8 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  balance: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A1CEDC',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#A1CEDC',
  },
  actionText: {
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  tradeBtn: {
    backgroundColor: '#1D3D47',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  resetBtn: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  messageBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    marginVertical: 2,
  },
  portfolioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginVertical: 4,
  },
});
