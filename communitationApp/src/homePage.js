import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  console.log('HomeScreen email:', email);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://192.168.0.27:3309/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('응답 데이터:', data);
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('예상하지 않은 데이터 형식:', data);
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    const fetchLikedPosts = async () => {
      try {
        const userId = 'currentUserId';
        const response = await fetch(`http://192.168.0.27:3309/posts/liked/${userId}`);
        if (response.ok) {
          const likedPostIds = await response.json();
          setLikedPosts(new Set(likedPostIds));
        } else {
          console.error('응답 오류:', response.status, await response.text());
        }
      } catch (error) {
        console.error('좋아요 상태 조회 오류:', error);
      }
    };

    fetchPosts();
    fetchLikedPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const isLiked = likedPosts.has(postId);
      const url = `http://192.168.0.27:3309/posts/${isLiked ? 'unlike' : 'like'}/${postId}`;
      console.log(url);
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: email }) 
      });

      if (isLiked) {
        setLikedPosts(prev => {
          const updated = new Set(prev);
          updated.delete(postId);
          return updated;
        });
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, likesCount: post.likesCount - 1 } : post
          )
        );
      } else {
        setLikedPosts(prev => new Set(prev).add(postId));
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, likesCount: post.likesCount + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedPostId;
    const isLiked = likedPosts.has(item.id);
    const comments = Array.isArray(item.comments) ? item.comments : [];

    return (
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <Text style={styles.username}>User</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('PostDetailsScreen', { post: item })}>
          <Image source={{ uri: item.imageUri }} style={styles.postImage} />
        </TouchableOpacity>
        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <Image 
              source={isLiked ? require('../assets/like2.png') : require('../assets/like.png')} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{item.likesCount}</Text>
        </View>
        <TextInput style={styles.textInput} placeholder="댓글을 추가하세요" placeholderTextColor="#888" />
        <View style={styles.commentsContainer}>
          {comments.map((comment, index) => {
            if (index < 3 || isExpanded) {
              return (
                <Text key={index} style={styles.commentText}>
                  {comment}
                </Text>
              );
            }
            return null;
          })}
          {comments.length > 3 && (
            <TouchableOpacity onPress={() => setExpandedPostId(isExpanded ? null : item.id)}>
              <Text style={styles.readMore}>
                {isExpanded ? '간략히 보기' : '더보기'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
    />
  )
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: width * 0.7,
    borderRadius: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  description: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentText: {
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 10,
  },
  readMore: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
});

export default HomeScreen;
