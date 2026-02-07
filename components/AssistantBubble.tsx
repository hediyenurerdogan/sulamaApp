import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface Props {
  message: string;
}

export default function AssistantBubble({ message }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Sparkles size={20} color="white" />
        </View>
      </View>
      <View style={styles.bubble}>
        <Text style={styles.title}>Akıllı Asistan</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  title: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#10B981',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
    lineHeight: 20,
  },
});
