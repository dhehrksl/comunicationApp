import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image , TouchableOpacity } from 'react-native';
import LoginScreen from '../communitationApp/src/main';
import JoinMember from '../communitationApp/src/joinMember';
import HomeScreen from './src/homePage';
import ProfileScreen from './src/profileScreen';
import AddScreen from './src/addScreen';
import PostDetailsScreen from './src/postDetails';
import EditProfileScreen from './src/editProfileScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

const HomeTabNavigator = ({ route, navigation }) => {
  const { email } = route.params || {};

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        initialParams={{ email }}
        options={{ 
          tabBarLabel: '홈', 
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size, height: size, tintColor: color }}
            />
          )
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        initialParams={{ email }}
        options={{ 
          tabBarLabel: '프로필', 
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() => navigation.navigate('Profile', { email })}
            />
          )
        }} 
      />
      <Tab.Screen
        name="AddScreen"
        component={AddScreen}
        initialParams={{ email }}
        options={{
          tabBarLabel: '추가',
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() => navigation.navigate('AddScreen', { email })}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Join" component={JoinMember} />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabNavigator}
        />
        <Stack.Screen name="PostDetailsScreen" component={PostDetailsScreen} />
        <Stack.Screen name="EditProfileScreen"
        component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}