import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const JoinMember = () => {
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joinUserName, setJoinUserName] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleSignUp = () => {
    fetch('http://192.168.0.27:3309/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: joinEmail, password: joinPassword, name: joinUserName }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        Alert.alert('Success', '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료하세요.');
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', '회원가입 중 오류가 발생했습니다.');
      });
  };

  // const handleVerify = () => {
  //   fetch('http://192.168.0.27:3309/verify/:token', {
  //     method: 'GET',
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.verified) {
  //         setIsVerified(true);
  //         Alert.alert('Success', '이메일 인증이 완료되었습니다.');
  //       } else {
  //         Alert.alert('Error', '이메일 인증이 아직 완료되지 않았습니다.');
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //       Alert.alert('Error', '인증 상태 확인 중 오류가 발생했습니다.');
  //     });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입 및 인증</Text>
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
      <TextInput
        label="Name"
        value={joinUserName}
        onChangeText={text => setJoinUserName(text)}
        style={styles.input}
      />
      <Button
        onPress={handleSignUp}
        mode="contained"
        style={styles.button}
      >
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
