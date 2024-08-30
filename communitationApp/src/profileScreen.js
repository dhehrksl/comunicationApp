import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 3;

const ProfileScreen = () => {
  const posts = [
    'https://health.chosun.com/site/data/img_dir/2023/01/10/2023011001501_0.jpg',
    'http://news.samsungdisplay.com/wp-content/uploads/2018/08/SDC%EB%89%B4%EC%8A%A4%EB%A3%B8_%EC%82%AC%EC%A7%848%ED%8E%B8_180806_%EB%8F%84%EB%B9%84%EB%9D%BC.png',
    'https://www.example.com/post3.jpg',
    'https://www.example.com/post4.jpg',
    'https://www.example.com/post5.jpg',
    'https://www.example.com/post6.jpg',
  ];

  const handleEditProfile = () => {
    alert('Edit Profile');
  };

  const handleLogout = () => {
    alert('Logged Out');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://health.chosun.com/site/data/img_dir/2023/01/10/2023011001501_0.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>프로필</Text>
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
        {posts.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.postImage} />
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
  bio: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
    textAlign: 'center',
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
