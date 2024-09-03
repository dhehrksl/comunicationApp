import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ route, navigation }) => {
  const { email, profileImage, username } = route.params || {};
  const [newProfileImage, setNewProfileImage] = useState(profileImage);
  const [newUsername, setNewUsername] = useState(username);

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
      setNewProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://192.168.0.27:3309/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: newUsername,
          profileImage: newProfileImage,
        }),
      });

      if (response.ok) {
        Alert.alert('Profile Updated', `New username: ${newUsername}`);
        navigation.goBack();
      } else {
        Alert.alert('Update Failed', 'Unable to update profile.');
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={handleImagePick}>
        <Image
          source={{ uri: newProfileImage }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={newUsername}
        onChangeText={setNewUsername}
        placeholder="Username"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ddd',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditProfileScreen;
