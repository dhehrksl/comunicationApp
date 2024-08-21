import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings Screen</Text>
  </View>
  
);

const HomePage = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="chat" component={SettingsScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
  </Tab.Navigator>


);
const posts = [
    { id: '1', imageUri: 'https://upload3.inven.co.kr/upload/2024/08/20/bbs/i1292540631.jpg?MW=800'},
    { id: '2', imageUri: 'https://upload3.inven.co.kr/upload/2024/08/21/bbs/i1742587213.jpg?MW=800' },
    { id: '3', imageUri: 'https://upload3.inven.co.kr/upload/2024/08/20/bbs/i1292540631.jpg?MW=800' },
  ];
  
  const HomeScreen = () => {
    const renderItem = ({ item }) => (
      <View style={styles.postContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.postImage} />
        <TextInput></TextInput>
      </View>

    );
  
    return (
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    );
  };
  const styles = StyleSheet.create({
    postContainer: {
      marginBottom: 10,
    },
    postImage: {
      width: width,
      height: width,
    },
    commentView:{
    }
  });

export default HomePage;
