import React, {Component} from 'react';
import {Block, Text, theme} from 'galio-framework';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TextInput,
  Picker,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Loader from '../Loader/loader';

const {width, height} = Dimensions.get('window');

//import ImagePicker from 'react-native-image-picker';
//import Icon from 'react-native-vector-icons/MaterialIcons';

// import DialogProgress from 'react-native-dialog-progress';
import Animation from 'lottie-react-native';
import game from '../../../assets/images/gaming.json';
import country from './country';


const options = {
  title: 'Registration is in Process.....',
  message: 'Please Wait',
  isCancelable: false,
};

export default class Registration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameInput: '',
      cityInput: '',
      contactInput: '',
      emailInput: '',
      passwordInput: '',
      gender: '',
      userId: '',
      filePath: {},
      loading: false,
    };
  }

  updateGender = (gender) => {
    this.setState({gender: gender});
  };

  componentDidMount() {
    this.animation.play();
  }


  
  loadingState=(val)=>{
    this.setState({
      loading: val
    })
  }

  Validate = () => {
    // DialogProgress.show(options);
    this.loadingState(true)

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const {
      nameInput,
      cityInput,
      contactInput,
      emailInput,
      passwordInput,
      gender,
    } = this.state;
    if (nameInput == '' || nameInput.length < 3) {
      alert('Enter Name');
      // DialogProgress.hide();
    this.loadingState(false)

    } else if (cityInput == '' || cityInput.length < 3) {
      alert('Enter City');
      // DialogProgress.hide();
    this.loadingState(false)

    } else if (contactInput == '' || contactInput.length < 10) {
      alert('Enter Contact');
      // DialogProgress.hide();
    this.loadingState(false)

    } else if (emailInput == '' || reg.test(emailInput) === false) {
      alert('Email is Not Correct');
      // DialogProgress.hide();
    this.loadingState(false)

      return false;
    } else if (passwordInput == '' || passwordInput.length < 6) {
      alert('Please enter Password , More than 6 characters');
      // DialogProgress.hide();
    this.loadingState(false)

      return false;
    } else if (gender == '') {
      alert('Please Select Gender');
      // DialogProgress.hide();
    this.loadingState(false)

    }
    // else if(bloodGroup==''){
    //   alert('Please Select Blood Group');
    //   DialogProgress.hide();
    // }
    // else if(this.state.imageSelected==false){
    //   alert('Please Select Your Image');
    //   DialogProgress.hide();
    // }
    else {
      // DialogProgress.show(options);
    this.loadingState(true)

      auth()
        .createUserWithEmailAndPassword(
          this.state.emailInput,
          this.state.passwordInput,
        )
        .then((res) => {
          this.setState({
            userId: res.user.uid,
          });

          // this.uploadImage();
          this.saveDataToDb();
        })
        .catch((error) => {
          // DialogProgress.hide();
    this.loadingState(false)

          Alert.alert('Error Occured',JSON.stringify(error));
        });
    }
  };

  saveDataToDb = () => {
    // DialogProgress.show(options);
    this.loadingState(true)


    try {

      messaging()
      .getToken()
      .then(token => {
      
      firestore()
        .collection('Users')
        .doc(this.state.userId)
        .set({
          name: this.state.nameInput,
          country: this.state.cityInput,
          contact: this.state.contactInput,
          email: this.state.emailInput.trim().toLowerCase(),
          password: this.state.passwordInput,
          gender: this.state.gender,
          id: this.state.userId,
          avatar:
            'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
          token: token,
          family: [],
          current: false, //Emergency = true
        })
        .then((data) => {
          // DialogProgress.hide();
    this.loadingState(false)

          Alert.alert(
            'Congratulations ! Your Registration is Successfull,You can Login Now',
          );
          this.props.navigation.navigate('SignIn');
        })
        .catch((error) => {
          // DialogProgress.hide();
    this.loadingState(false)

          Alert.alert('Error Ocurred',error.toString());
        });

      }); 
    } catch (error) {
      // DialogProgress.hide();
    this.loadingState(false)

      Alert.alert('Error Occured',error.toString());
    }
  };

  render() {
    return (
      <React.Fragment>
        <Loader visible={this.state.loading} />

      <ScrollView>
        <StatusBar
          backgroundColor="#EC3345"
          barStyle="light-content"></StatusBar>

        <Block flex style={Styles.Container}>
          <Block flex>
            <Block flex style={{width: '100%'}}>
              <Block
                style={{
                  width: 700,
                  height: 200,
                }}>
                <Block flex={2} row marginTop={40} marginLeft={20}>
                  <Block flex marginTop={30}>
                    <Text size={25} bold>
                      Welcome to
                    </Text>
                    <Text size={25} color={'#EC3345'}>
                      Social Distancing
                    </Text>
                  </Block>

                  <Block flex={2}>
                    <Animation
                      resizeMode={'cover'}
                      ref={(animation) => {
                        this.animation = animation;
                      }}
                      style={{
                        width: 140,
                        height: 140,
                      }}
                      loop={true}
                      source={game}
                    />
                  </Block>
                </Block>

                {/* <Block flex row middle marginTop={200} >
<TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                  }}

                  // onPress={this.chooseFile.bind(this)}
                >
                  <Block
                    card
                    style={[Styles.product,Styles.shadow,{
                      width: '70%',
                      
                      height: 180,
                      borderRadius: 50 / 2,
                      marginTop: 30,
                      justifyContent: 'center',
                    }]}>
                    <Block style={{marginTop: 0, alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/btn-boy.png')} 
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 400 / 2,
                         
                          alignSelf: 'center',
                        }}
                      />
                      <Text style={{marginTop: 5, color: '#ABABAB'}}>
                        Set your profile image
                      </Text>
                    </Block>
                  </Block>
                </TouchableOpacity>
</Block> */}
              </Block>

              <Block
                style={{
                  marginTop: 0,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  placeholder="Full Name"
                  placeholderColor="#c4c3cb"
                  style={Styles.loginFormTextInput}
                  onChangeText={(TextInputValue) =>
                    this.setState({nameInput: TextInputValue})
                  }
                />

                {/* <TextInput
                  placeholder="City"
                  placeholderColor="#c4c3cb"
                  style={Styles.loginFormTextInput}
                  onChangeText={(TextInputValue) =>
                    this.setState({cityInput: TextInputValue})
                  }
                /> */}

                <TextInput
                  placeholder="Contact"
                  placeholderColor="#c4c3cb"
                  style={Styles.loginFormTextInput}
                  onChangeText={(TextInputValue) =>
                    this.setState({contactInput: TextInputValue})
                  }
                />
                <TextInput
                  placeholder="Email"
                  placeholderColor="#c4c3cb"
                  style={Styles.loginFormTextInput}
                  onChangeText={(TextInputValue) =>
                    this.setState({emailInput: TextInputValue})
                  }
                />
                <TextInput
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderColor="#c4c3cb"
                  style={Styles.loginFormTextInput}
                  onChangeText={(TextInputValue) =>
                    this.setState({passwordInput: TextInputValue})
                  }
                />

                <Picker
                  style={{width: 320, marginTop: 20}}
                  selectedValue={this.state.cityInput}
                  onValueChange={(e)=>this.setState({cityInput:e})}>
                  <Picker.Item label="Select Country" value="" />
                  {country.map(e=><Picker.Item label={e} value={e} />)}
                </Picker>

                <Picker
                  style={{width: 320, marginTop: 20}}
                  selectedValue={this.state.gender}
                  onValueChange={this.updateGender}>
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </Block>

              <Block
                style={{
                  marginTop: 20,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Block
                  style={{
                    borderRadius: 10,
                    width: '50%',
                    marginTop: 0,
                    borderRadius: 50,
                    height: 50,
                    flexDirection: 'row',
                    backgroundColor: '#EC3345',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.Validate()}
                    style={{alignItems: 'center', width: '100%'}}>
                    <Block
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text bold style={{color: 'white', fontSize: 18}}>
                        Register Me
                      </Text>
                    </Block>
                  </TouchableOpacity>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
      </React.Fragment>
    
    );
  }
}

const Styles = StyleSheet.create({
  Container: {
    height: height,
    width: '100%',

    backgroundColor: '#f0f0f0',
  },

  cardStyle: {
    marginTop: 10,
    padding: 20,
    width: '93%',
    backgroundColor: '#fcfcfc',
    borderRadius: 40 / 2,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#566573',

    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  textStyle: {
    fontSize: 23,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',

    marginTop: 0,
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
  skillStyle: {
    fontSize: 18,
    color: '#696969',
  },
  rating: {
    marginTop: 10,
  },
  heading: {
    fontSize: 18,
    width: '90%',
    height: 50,
    color: '#696969',
  },
  jobheading: {
    fontSize: 18,
    width: '70%',
    height: 50,
  },
  product: {
    backgroundColor: theme.COLORS.WHITE,
    // marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 70,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});
