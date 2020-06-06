//This is an example code for NavigationDrawer//
import React, {Component} from 'react';
import {Block, Text, theme} from 'galio-framework';
//import react in our code.
import {
  StyleSheet,
  View,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  Picker,
  ActivityIndicator,
} from 'react-native';
// import DialogProgress from 'react-native-dialog-progress';
// import all basic components

import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

export default function SignOut(props) {
  let _componentFocused = async () => {
    try {
      auth().signOut();
      await AsyncStorage.setItem('@login_details', '');
      await AsyncStorage.setItem('@user_id', '');
      await AsyncStorage.setItem('@user_info', '');
      props.navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
      console.log('signot');

    } catch (err) {
      await AsyncStorage.setItem('@login_details', '');
      await AsyncStorage.setItem('@user_id', '');
      await AsyncStorage.setItem('@user_info', '');

      //   this.props.navigation.navigate('SignIn');
      props.navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
      console.log('signot');
    }
  };

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      _componentFocused();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);
  return (
    <View>
      <Text style={{textAlign: 'center'}}>Signing out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
  },
  icon: {
    width: 100,
    height: 100,
  },
  textInput: {
    width: '80%',
    height: 40,
    borderColor: '#566573',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232323',
  },
  description: {
    fontSize: 16,
    color: '#3B3B3B',
  },
  topContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },
  loginFormTextInput: {
    marginStart: 100,
    borderBottomRightRadius: 25,

    height: 43,
    width: '80%',
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
});
