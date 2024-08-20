import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const JoinMember = () => {
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');


  const handleSignUp = () => {
    fetch('http://192.168.0.27:3309/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail: joinEmail, userPassWord: joinPassword }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        Alert.alert('Success', '회원가입이 완료되었습니다!');
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', '회원가입 중 오류가 발생했습니다.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        label="Email"
        value={joinEmail}
        onChangeText={text => setJoinEmail(text)}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={joinPassword}
        onChangeText={text => setJoinPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button onPress={handleSignUp} mode="contained" style={styles.button}>
        회원가입
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default JoinMember;
