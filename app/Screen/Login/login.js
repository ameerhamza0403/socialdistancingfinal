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
import Loader from '../Loader/loader'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

const options = {
  title: 'Signing you in',
  message: 'Please Wait',
  isCancelable: false,
};

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      isLoading: false,
      loading: false,
    };
  }

  showLoader = () => {
    this.setState({isLoading: true});
  };
  hideLoader = () => {
    this.setState({isLoading: false});
  };

  loadingState=(val)=>{
    this.setState({
      loading: val
    })
  }

  async componentDidMount() {
    //console.disableYellowBox = true;
    //console.log('signin')
  }

  _ValidateFunction = async () => {
    // DialogProgress.show(options);
    this.loadingState(true)
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const {emailInput, passwordInput} = this.state;
    if (emailInput == '' || reg.test(emailInput) === false) {
      alert('Email is Not Correct');
      // DialogProgress.hide();
    this.loadingState(false)

      return false;
    } else if (passwordInput == '' || passwordInput.length < 6) {
      alert('Please enter Password , More than 6 characters');
      // DialogProgress.hide();
    this.loadingState(false)

      return false;
    } else {
      this._storeData();
    }
  };

  _storeData = async () => {
    // DialogProgress.show(options);
    this.loadingState(true)

    auth()
      .signInWithEmailAndPassword(
        this.state.emailInput.trim().toLowerCase(),
        this.state.passwordInput,
      )
      .then(async (res) => {
        try {
          //console.log('res',res);
          await AsyncStorage.setItem(
            '@login_details',
            JSON.stringify({
              email: this.state.emailInput,
              password: this.state.passwordInput,
            }),
          );
          await AsyncStorage.setItem('@user_id', res.user.uid);
          const user = await firestore()
            .collection('Users')
            .where('id', '==', res.user.uid)
            .get();
          //console.log('==========', user._docs[0].data());
          await AsyncStorage.setItem(
            '@user_info',
            JSON.stringify(user._docs[0].data()),
          );

         //console.log(await AsyncStorage.getItem('@user_info'))

          // DialogProgress.hide();
    this.loadingState(false)

          this.props.navigation.navigate('Dashboard');
        } catch (error) {
          // DialogProgress.hide();
    this.loadingState(false)

          Alert.alert('Error Occured ! ');
          //console.log(error);
        }
      })
      .catch((error) => {
        // DialogProgress.hide();
    this.loadingState(false)

        Alert.alert('Error', JSON.stringify(error.message));
      })
      .finally(() => {
        // this.setState({ showspin: false });
      });
  };

  //Screen1 Component
  render() {
    return (
      <React.Fragment>
        <Loader visible={this.state.loading} />
      <ScrollView>
        <Block style={styles.MainContainer}>
          <StatusBar
            backgroundColor="#EC3345"
            barStyle="light-content"></StatusBar>

          <Block
            flex
            style={{
              width: '100%',
              backgroundColor: '#EC3345',
              borderBottomRightRadius: 50,
              borderBottomLeftRadius: 50,
            }}>
            <Block flex={2} middle>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>
                Welcome Back
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginTop: 5,

                  color: '#fff',
                }}>
                Feel free to Login anytime !
              </Text>
            </Block>
          </Block>

          <Block
            flex={1}
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Block style={{width: '100%', flexDirection: 'row'}}>
              <TextInput
                clearButtonMode="always"
                placeholder="Email"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={(TextInputValue) =>
                  this.setState({emailInput: TextInputValue})
                }
              />
            </Block>

            <Block style={{width: '100%', flexDirection: 'row'}}>
              <TextInput
                clearButtonMode="always"
                placeholder="Password"
                secureTextEntry={true}
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={(TextInputValue) =>
                  this.setState({passwordInput: TextInputValue})
                }
              />
            </Block>
            {/* <Block
              style={{
                alignItems: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignContent: 'flex-end',
                width: '75%',
                marginTop: 10,
              }}>
              <Text bold style={{color: '#707173'}}>
                Forget Password?
              </Text>
            </Block> */}

            <Block
              style={{
                borderRadius: 50,
                width: '70%',
                marginTop: 10,
                height: 50,
                flexDirection: 'row',
                backgroundColor: '#EC3345',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this._ValidateFunction()}
                style={{alignItems: 'center', width: '100%'}}>
                <Block
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text bold style={{color: 'white', fontSize: 18}}>
                    Signin
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>

            <Block
              style={{
                borderRadius: 50,
                width: '70%',
                marginTop: 10,
                height: 50,
                flexDirection: 'row',
                backgroundColor: '#EC3345',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SignUp')}
                style={{alignItems: 'center', width: '100%'}}>
                <Block
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text bold style={{color: 'white', fontSize: 18}}>
                    Signup
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
            <Block style={{flexDirection: 'row'}}></Block>

            <ActivityIndicator
              style={{marginTop: 20, marginBottom: 20}}
              animating={this.state.isLoading}
              size="large"
              color="#EC3345"
            />
          </Block>
        </Block>
      </ScrollView>
      </React.Fragment>
    );
  }
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

// const LoginStack = createStackNavigator({

//   Home: {
//     screen: LoginScreen,
//     navigationOptions: {
//       header: null,

//     },

//   },
//   RegistrationScreen: {
//     screen: RegistrationScreen,
//     navigationOptions: {
//       header: null,

//     },
//   },
//   DoctorHome: {
//     screen: DoctorHome,
//     navigationOptions: {
//       header: null,

//     },
//   },

//   DonorHome: {
//     screen:  DonorHome,
//     navigationOptions: {
//       header: null,
//     },
//   },

//   RecieverHome: {
//     screen:  RecieverHome,
//     navigationOptions: {
//       header: null,
//     },
//   },
//   AssistantHome: {
//     screen: AssistantHome,
//     navigationOptions: {
//       header: null,
//     },
//   },

// });

// export default createAppContainer(LoginStack);
