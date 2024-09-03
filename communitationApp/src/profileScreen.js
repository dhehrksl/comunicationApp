import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const numColumns = 3;

const ProfileScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [profileImage, setProfileImage] = useState('');
  const [username, setUsername] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`http://192.168.0.27:3309/profile/${email}`);
      const responseListData = await axios.get(`http://192.168.0.27:3309/allPosts/${email}`);
      console.log(responseListData.data);

      setUserPosts(responseListData.data);
      setProfileImage(response.data.profileImage || ''); 
      setUsername(response.data.name || '');
    } catch (error) {
      console.error('프로필 데이터 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [email]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [email])
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen', { email, profileImage, username });
  };

  const handleLogout = () => {
    Alert.alert('Logged Out');
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleImagePress = (post) => {
    navigation.navigate('PostDetailsScreen', { post });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={{ uri: profileImage || 'https://via.placeholder.com/120' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{username || 'No Username'}</Text>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <FontAwesome name="edit" size={16} color="white" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={16} color="white" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postsGrid}>
        {userPosts.map((post, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(post)}>
            <Image source={{ uri: post.imageUri }} style={styles.postImage} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ddd',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0095f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  postsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postImage: {
    width: (width - 40) / numColumns,
    height: (width - 40) / numColumns,
    marginBottom: 2,
  },
});

export default ProfileScreen;
