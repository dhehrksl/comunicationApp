import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Pressable } from 'react-native';
import axios from 'axios';

const apiUrl = 'http://192.168.0.27:3309';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInEnabled, setSignInEnabled] = useState(false);

  const handleLogin = async () => {
    if (!email || !validateEmail(email)) {
      Alert.alert("올바른 이메일을 입력해주세요");
    } else if (!password) {
      Alert.alert("비밀번호를 입력해주세요");
    } else {
      try {
        const response = await axios.post(`${apiUrl}/login`, { email, password });
        console.log('로그인 성공:', response.data);
        navigation.navigate('HomeTabs', { email });
      } catch (error) {
        console.error('로그인 실패:', error);
        Alert.alert("이메일과 비밀번호를 확인해주세요");
      }
      setEmail('');
      setPassword('');
      setSignInEnabled(false);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    setSignInEnabled(email.trim() !== '' && password.trim() !== '');
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Pressable
        onPress={signInEnabled ? handleLogin : null}
        disabled={!signInEnabled}
        style={styles.button}
      >
        <Text>로그인</Text>
      </Pressable>
      <TouchableOpacity onPress={() => navigation.navigate('Join')}>
        <Text style={styles.signupLink}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  signupLink: {
    color: '#007bff',
    textAlign: 'center',
  },
});

export default LoginScreen;
