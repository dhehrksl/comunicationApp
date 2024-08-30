import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToServer, postToDatabase } from '../server/api';
import { useRoute } from '@react-navigation/native';

const AddScreen = () => {
  const route = useRoute();
  const { email } = route.params || {};
  console.log('HomeScreen email:', email);
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState('');

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need permission to access your media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    try {
      const imageUrl = await uploadImageToServer(imageUri);
      await postToDatabase({ imageUri: imageUrl, title: 'Post Title', description: caption, email });
      alert('게시물이 성공적으로 작성되었습니다!');
      setImageUri(null);
      setCaption('');
    } catch (error) {
      console.error('게시물 생성 오류:', error);
      alert('게시물 생성에 실패했습니다. ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Select Image" onPress={handleSelectImage} />
      <TextInput
        style={styles.inputTitle}
        placeholder="제목"
        value={caption}
        onChangeText={setCaption}
      />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      <TextInput
        style={styles.input}
        placeholder="내용"
        value={caption}
        onChangeText={setCaption}
      />
      <Button title="Post" onPress={handlePost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 40,
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  inputTitle: {
    height: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
});

export default AddScreen;
