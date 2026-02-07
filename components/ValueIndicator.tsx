import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplet, Leaf } from 'lucide-react-native';

interface Props {
  text: string;
}

export default function ValueIndicator({ text }: Props) {
  if (!text) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Leaf size={16} color="#059669" />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
});
