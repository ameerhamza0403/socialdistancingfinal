/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import FirebaseApp from '@react-native-firebase/app';
import {Container, Root, Spinner} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from './app/Screen/SplashScreen/splash';
import Setup from './app/boot';
import LoginScreen from './app/Screen/Login/login';

const App = () => {
  const [isLoading, setIsLoading] = React.useState('');

  React.useEffect(async () => {
    // console.log('before initialization',FirebaseApp)
    // await FirebaseApp.initializeApp({
    //   apiKey: 'AIzaSyAoq3wwJBcGj0Kvk7gULMJ2600NolEj1VM',
    //   authDomain: 'social-distancing-49175.firebaseapp.com',
    //   databaseURL: 'https://social-distancing-49175.firebaseio.com',
    //   projectId: 'social-distancing-49175',
    //   storageBucket: 'social-distancing-49175.appspot.com',
    //   messagingSenderId: '263202139718',
    //   appId: '1:263202139718:web:22f9a9e01413f30d1f2447',
    //   measurementId: 'G-RDPT7TKNRG',
    // });
    try {
      const value = JSON.parse(await AsyncStorage.getItem('@login_details'));
      if (value !== null) {
        // value previously stored
        auth()
          .signInWithEmailAndPassword(value.email, value.password)
          .then(async (res) => {
            try {
              console.log('res', res);
              await AsyncStorage.setItem('@user_id', res.user.uid);
              const user = await firestore()
                .collection('Users')
                .where('id', '==', res.user.uid)
                .get();
              console.log('==========', user._docs[0].data());
              await AsyncStorage.setItem(
                '@user_info',
                JSON.stringify(user._docs[0].data()),
              );
              setIsLoading('Dashboard');
            } catch (error) {
              setIsLoading('SignIn');
            }
          })
          .catch((error) => {
            setIsLoading('SignIn');
          })
          .finally(() => {
            // this.setState({ showspin: false });
          });
      } else {
        setIsLoading('SignIn');
      }
    } catch (e) {
      // error reading value
    }
  }, []);
  if (isLoading == '') {
    return <SplashScreen />;
  } else {
    return <Setup route={isLoading} />;
  }
};

// function SplashScreen(props) {
//   return (
//     <ScrollView>
//       <View
//         style={{
//           width: '100%',
//           height: Dimensions.get('window').height,
//           justifyContent: 'center',
//           alignItems: 'center',
//           flex: 1,
//         }}>
//         <StatusBar
//           backgroundColor="#9C26B0"
//           barStyle="light-content"></StatusBar>

//         {/* <LinearGradient
//           colors={['#9C26B0', '#AF2489']}
//           style={{
//             flex: 1,
//             width: '100%',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}> */}
//         <View>
//           <Text
//             style={{
//               color: 'black',
//               fontSize: 40,
//               fontWeight: 'bold',
//               marginBottom: 150,
//               fontFamily: 'AmericanTypewriter-Light',
//             }}>
//             {' '}
//             Social Distancing{' '}
//           </Text>
//         </View>

//         <View
//           style={{
//             width: 20,
//             height: 20,
//             marginTop: 50,

//             alignItems: 'center',
//           }}>
//           <Spinner color="red" />
//         </View>
//         {/* </LinearGradient> */}
//       </View>
//     </ScrollView>
//   );
// }

export default App;
