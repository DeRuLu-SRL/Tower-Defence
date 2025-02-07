// screens/ShopScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShopScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Shop</Text>
    {/* Add your shop items here */}
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1e1e1e', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { color: '#fff', fontSize: 24 },
});

export default ShopScreen;
