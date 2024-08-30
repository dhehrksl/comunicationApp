import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PostDetailsScreen = ({ route }) => {
  const { post } = route.params;

  const comments = Array.isArray(post.comments) ? post.comments : [];

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.imageUri }} style={styles.image} />
      <View style={styles.detailsContainer}>
        {comments.map((comment, index) => (
          <Text key={index} style={styles.commentText}>
            {comment}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: width,
    height: width,
  },
  detailsContainer: {
    marginTop: 10,
  },
  commentText: {
    fontSize: 14,
    color: 'black',
  },
});

export default PostDetailsScreen;
