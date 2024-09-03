import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TextInput, FlatList, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const PostDetailsScreen = ({ route }) => {
  const { post, email } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://192.168.0.27:3309/posts/${post.postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.id]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await axios.post(`http://192.168.0.27:3309/posts/${post.postId}/comments`, {
          email: email,
          comment: newComment,
        });
        setNewComment('');
        const response = await axios.get(`http://192.168.0.27:3309/posts/${post.postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if(email == post.email){
            try {
        await axios.delete(`http://192.168.0.27:3309/posts/${post.postId}/comments/${commentId}`);
        const response = await axios.get(`http://192.168.0.27:3309/posts/${post.postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
    Alert.alert('다른 아이디 삭제 불가');
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentEmailText}>{item.email}</Text>
      <Text style={styles.commentText}>{item.comment}</Text>
      <TouchableOpacity onPress={() => handleDeleteComment(item.postId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.imageUri }} style={styles.image} />
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.commentsList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  image: {
    width: width - 20,
    height: width - 20,
    alignSelf: 'center',
    borderRadius: 10,
  },
  commentsList: {
    marginTop: 10,
    marginBottom: 10,
  },
  commentContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
    position: 'relative',
  },
  commentText: {
    fontSize: 12,
    color: '#333',
  },
  commentEmailText: {
    fontSize: 16,
    color: '#333',
    padding : 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#0095f6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  deleteButtonText: {
    color: '#f44336',
  },
});

export default PostDetailsScreen;
