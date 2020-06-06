import React from 'react';
import {
  Dimensions,
  Platform,
  Image,
  Modal,
  PermissionsAndroid,
  Alert,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Share,
  AsyncStorage,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from '../../Component/Icon';
import {
  Block,
  Text,
  theme,
  Button,
  Card,
  Checkbox,
  Input,
} from 'galio-framework';
import style from './style';
const {width, height} = Dimensions.get('screen');
import * as Animatable from 'react-native-animatable';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';

const OS = Platform.OS == 'ios' ? true : false;
import Animation from 'lottie-react-native';
import radar from '../../../assets/images/addfriend.json';

import database from '@react-native-firebase/database';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Loader from '../Loader/loader';

const colors = [
  '#b4fac7',
  '#cbfab4',
  '#eafab4',
  '#faf5b4',
  '#fad3b4',
  '#fac0b4',
  '#fab4b4',
  '#b4fadd',
  '#b4faef',
  '#b4e7fa',
  '#b4c4fa',
  '#ceb4fa',
  '#eeb4fa',
  '#fab4e4',
];
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: {
        family: [],
      },
      friendsData: [],
      modalVisible: false,
      emailAddress: '',
      searchUser: null,
      status: null,
      modalVisibleLocation: false,
      selectedUser: null,
      currentLongitude: '',
      currentLongitude: '',
      loading: false,
    };
    this.listener = null;
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem('@user_id');
    this.setState({
      userId: id,
    });
    //console.log('id::::', id);

    // this.listener = this.props.navigation.addListener('focus', () => {
    // The screen is focused
    // Call any action
    this.findFriends(id);
    // });
  }

  loadingStatus = (val) => {
    this.setState({
      loading: val,
    });
  };

  // componentWillUnmount() {
  //   this.props.navigation.removeListener('focus', () => {
  //     // The screen is focused
  //     // Call any action
  //     this.findFriends(id);
  //   });
  // }

  getStatusLocation = (family) => {
    let finalArr = [];
    this.loadingStatus(true);
    for (let index = 0; index < family.length; index++) {
      firestore()
        .collection('Users')
        .doc(family[index].id)
        .get()
        .then((res) => {
          database()
            .ref('positionGeo')
            .child(family[index].id)
            .once('value', (loc) => {
              let obj = {
                location: loc._snapshot.value.l,
                status: res._data.current,
                name: res._data.name,
                contact: res._data.contact,
                avatar: res._data.avatar,
                token: res._data.token,
                email: res._data.email,
                id: family[index].id,
              };
              finalArr[family[index].id] = obj;
              if (index == family.length - 1) {
                console.log(finalArr);
                this.loadingStatus(false);

                this.setState({
                  friendsData: finalArr,
                });
              }
            });
        });
    }
    // //console.log('asdasdasdasdasdasdasdasdasd234234', arr);
  };

  findFriends = (id) => {
    // //console.log('again', id);
    this.loadingStatus(true);

    this.setState({
      friends: {
        family: [],
      },
    });
    try {
      firestore()
        .collection('Users')
        .where('id', '==', id)
        .get()
        .then(async (myData) => {
          this.getStatusLocation(myData._docs[0]._data.family);
          this.setState({
            status: myData._docs[0]._data.current,
            friends: myData._docs[0]._data,
            modalVisible: false,
          });
          this.loadingStatus(false);
        })
        .catch((error) => {
          // DialogProgress.hide();
          this.loadingStatus(false);

          Alert.alert(
            'Error Occured',
            // , JSON.stringify(error)
          );
        });
    } catch (error) {
      this.loadingStatus(false);

      Alert.alert(
        'Error Occured',
        // , JSON.stringify(error)
      );
    }
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  ShareApp = async () => {
    const user = await AsyncStorage.getItem('@user_info');

    //console.log(user);
    Share.share({
      message: `Hey! Add me as your family member on Social distancing through this email ${
        JSON.parse(user).email
      }`,
    })
      .then((result) => console.log(result))
      .catch((errorMsg) => console.log(errorMsg));
  };
  sendAlert = (id) => {};

  callLocation(that) {}
  UpdatePosition = (position) => {};

  handleGetDirections = () => {
    const data = {
      source: {
        latitude: JSON.parse(this.state.currentLatitude),
        longitude: JSON.parse(this.state.currentLongitude),
      },
      destination: {
        latitude: JSON.parse(this.state.selectedUser.location[0]),
        longitude: JSON.parse(this.state.selectedUser.location[1]),
      },
      params: [
        {
          key: 'travelmode',
          value: 'driving', // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate', // this instantly initializes navigation using the given travel mode
        },
      ],
      // waypoints: [
      //   {
      //     latitude: -33.8600025,
      //     longitude: 18.697452
      //   },
      //   {
      //     latitude: -33.8600026,
      //     longitude: 18.697453
      //   },
      //      {
      //     latitude: -33.8600036,
      //     longitude: 18.697493
      //   }
      // ]
    };

    getDirections(data);
  };

  renderItem = ({item}) => (
    // <Block flex={1} marginLeft={20} marginTop={10}>
    //   <TouchableOpacity>
    //     <Block flex style={[style.shadow]}>
    //       <Block style={{flexDirection: 'row'}}>
    //         <Block style={{marginTop: 10, flex: 1}}>
    //           <Image
    //             source={{
    //               uri:
    //                 'https://image.freepik.com/free-photo/senior-woman-patient-touching-female-nurse-hand-shoulder_23-2147861496.jpg',
    //             }}
    //             style={{width: 60, height: 60, borderRadius: 30}}
    //           />
    //         </Block>

    //         <Block
    //           flex={5}
    //           style={{
    //             flexDirection: 'column',
    //             marginLeft: 10,
    //             marginTop: 15,
    //           }}>
    //           <Text
    //             style={{
    //               fontSize: 17,
    //               fontWeight: 'bold',
    //               color: '#57595d',
    //               width: '75%',
    //               height: 20,
    //             }}>
    //             {item.name}
    //           </Text>
    //           <Text
    //             style={{
    //               width: '100%',
    //               marginTop: 8,
    //               fontSize: 15,
    //               color: '#57595d',
    //             }}>
    //             {item.contact}
    //           </Text>
    //         </Block>
    //         <Block marginRight={10} marginTop={20}>
    //           <TouchableOpacity onPress={() => this.sendAlert(item.id)}>
    //             <Text
    //               style={{
    //                 width: '100%',
    //                 marginTop: 8,
    //                 fontSize: 15,
    //                 color: '#57595d',
    //               }}>
    //               Send Alert
    //             </Text>
    //           </TouchableOpacity>
    //         </Block>
    //       </Block>
    //     </Block>
    //   </TouchableOpacity>
    // </Block>
    <React.Fragment></React.Fragment>
  );

  render() {
    return (
      <React.Fragment>
        <Loader visible={this.state.loading} />
        <ScrollView>
          <Block style={style.container}>
            <StatusBar
              backgroundColor="#EC3345"
              barStyle="light-content"></StatusBar>

            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({
                  modalVisible: false,
                });
              }}>
              <View
                style={{
                  width: '100%',
                  height: '40%',
                  backgroundColor: 'rgb(0,0,0)',
                  opacity: 0.5,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      modalVisible: false,
                      emailAddress: '',
                      searchUser: null,
                    })
                  }>
                  <View style={{height: '100%', width: '100%'}}></View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '60%',
                  backgroundColor: '#d6d6d6',
                  // borderTopLeftRadius: 30,
                  // borderTopRightRadius: 30,
                }}>
                <View style={{padding: 10}}>
                  <ScrollView>
                    <Block flexDirection="row" padding={10}>
                      <Block left width="80%">
                        <Input
                          placeholder="Search friends by Email"
                          style={{height: 40, borderWidth: 0}}
                          value={this.state.emailAddress}
                          onChangeText={(text) =>
                            this.setState({
                              emailAddress: text,
                            })
                          }
                        />
                      </Block>
                      <Block right>
                        <Block margin={10}>
                          <TouchableOpacity
                            onPress={async () => {
                              this.setState({
                                searchUser: null,
                              });
                              this.loadingStatus(true);

                              const text = this.state.emailAddress
                                .trim()
                                .toLowerCase();
                              //console.log(text);
                              if (emailRegex.test(text) && text.length > 0) {
                                try {
                                  const users = await firestore()
                                    .collection('Users')
                                    .where('email', '==', text)
                                    .get();
                                  //console.log(users);
                                  this.setState({
                                    searchUser: users._docs[0].data(),
                                  });
                                  this.loadingStatus(false);
                                } catch (error) {
                                  //console.log(error);
                                  this.loadingStatus(false);

                                  Alert.alert(
                                    'Error!',
                                    'Person not found, Try adding another email id',
                                  );
                                }
                              } else {
                                this.loadingStatus(false);

                                Alert.alert(
                                  'Incorrect Details!',
                                  'Please enter correct email address',
                                );
                              }
                            }}>
                            <Icon
                              family="AntDesign"
                              size={35}
                              name="search1"
                              color={'red'}
                            />
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    </Block>
                    {this.state.searchUser !== null && (
                      <React.Fragment>
                        <Block
                          flexDirection="row"
                          middle
                          padding={5}
                          style={{
                            borderWidth: 1,
                            borderColor: 'red',
                            borderRadius: 5,
                            backgroundColor: '#ffcfcf',
                          }}>
                          <Block left width="80%">
                            <Block style={{flexDirection: 'row'}}>
                              <Block style={{marginTop: 10, flex: 2}}>
                                <Image
                                  source={{
                                    uri: this.state.searchUser.avatar,
                                  }}
                                  style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                  }}
                                />
                              </Block>

                              <Block
                                flex={8}
                                style={{
                                  flexDirection: 'column',
                                  marginLeft: 40,
                                  marginTop: 15,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    color: '#57595d',
                                    width: '75%',
                                    height: 20,
                                  }}>
                                  {this.state.searchUser.name.slice(0, 11)}
                                </Text>
                                <Text
                                  style={{
                                    width: '100%',
                                    marginTop: 4,
                                    fontSize: 15,
                                    color: '#57595d',
                                  }}>
                                  {this.state.searchUser.contact.slice(0, 14)}
                                </Text>
                              </Block>
                              <Block marginLeft={10} marginTop={20}>
                                <TouchableOpacity
                                  onPress={async () => {
                                    this.loadingStatus(true);

                                    const userEmail = JSON.parse(
                                      await AsyncStorage.getItem('@user_info'),
                                    );
                                    //console.log(userEmail);
                                    let alreadyFriend = this.state.friends.family.filter(
                                      (e) => e.id == this.state.searchUser.id,
                                    );
                                    //console.log('aready?', alreadyFriend);
                                    if (
                                      this.state.searchUser.email
                                        .trim()
                                        .toLowerCase() ==
                                      userEmail.email.toLowerCase()
                                    ) {
                                      this.loadingStatus(false);

                                      Alert.alert(
                                        'Error',
                                        'Cannot add yourself in the list!',
                                      );
                                    } else if (alreadyFriend.length !== 0) {
                                      this.loadingStatus(false);

                                      Alert.alert(
                                        'Error',
                                        'User already in your friend list',
                                      );
                                    } else {
                                      let newPerson = this.state.friends.family;
                                      newPerson.push({
                                        name: this.state.searchUser.name,
                                        email: this.state.searchUser.email,
                                        contact: this.state.searchUser.contact,
                                        token: this.state.searchUser.token,
                                        id: this.state.searchUser.id,
                                        avatar: this.state.searchUser.avatar,
                                      });
                                      firestore()
                                        .collection('Users')
                                        .doc(this.state.userId)
                                        .update({
                                          family: newPerson,
                                        })
                                        .then((val) => {
                                          let newPersonToMe = this.state
                                            .searchUser.family;
                                          newPersonToMe.push({
                                            name: this.state.friends.name,
                                            email: this.state.friends.email,
                                            contact: this.state.friends.contact,
                                            token: this.state.friends.token,
                                            id: this.state.friends.id,
                                            avatar: this.state.friend.avatar,
                                          });
                                          firestore()
                                            .collection('Users')
                                            .doc(this.state.searchUser.id)
                                            .update({
                                              family: newPersonToMe,
                                            })
                                            .then((val2) => {
                                              this.findFriends(
                                                this.state.userId,
                                              );
                                              this.loadingStatus(false);
                                            })
                                            .catch((err) => {
                                              this.loadingStatus(false);

                                              Alert.alert(
                                                'Error',
                                                'Failed to add this user!',
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          this.loadingStatus(false);

                                          Alert.alert(
                                            'Error',
                                            'Failed to add this user',
                                          );
                                        });
                                    }
                                  }}>
                                  <Text
                                    style={{
                                      width: '100%',
                                      // marginTop: 8,
                                      fontSize: 15,
                                      color: 'white',
                                      fontWeight: 'bold',
                                      padding: 5,
                                      borderRadius: 5,
                                      backgroundColor: 'red',
                                    }}>
                                    Add Friend
                                  </Text>
                                </TouchableOpacity>
                              </Block>
                            </Block>
                          </Block>
                        </Block>
                      </React.Fragment>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisibleLocation}
              onRequestClose={() => {
                this.setState({
                  modalVisible: false,
                });
              }}>
              <View
                style={{
                  width: '100%',
                  height: '20%',
                  backgroundColor: 'rgb(0,0,0)',
                  opacity: 0.5,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      modalVisibleLocation: false,
                      selectedUser: null,
                    })
                  }>
                  <View style={{height: '100%', width: '100%'}}></View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '80%',
                  backgroundColor: '#d6d6d6',
                  // borderTopLeftRadius: 30,
                  // borderTopRightRadius: 30,
                }}>
                <View>
                  {this.state.modalVisibleLocation && (
                    <ScrollView>
                      <Block
                        flexDirection="row"
                        style={{height: (height * 70) / 100}}>
                        <MapView
                          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                          style={{width: '100%', height: '100%'}}
                          region={{
                            latitude: JSON.parse(this.state.currentLatitude),
                            longitude: JSON.parse(this.state.currentLongitude),
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                          }}>
                          <MapViewDirections
                            origin={{
                              latitude: this.state.currentLatitude,
                              longitude: this.state.currentLongitude,
                            }}
                            destination={{
                              llatitude: JSON.parse(
                                this.state.selectedUser.location[0],
                              ),
                              longitude: JSON.parse(
                                this.state.selectedUser.location[1],
                              ),
                            }}
                            apikey={'AIzaSyDiPWI4uoEHVuWEuJJB4Gd9NKsOmIm07J0'}
                            strokeWidth={5}
                            strokeColor="red"
                          />
                          <Marker
                            coordinate={{
                              latitude: JSON.parse(this.state.currentLatitude),
                              longitude: JSON.parse(
                                this.state.currentLongitude,
                              ),
                            }}
                            title={'You'}
                            description={''}
                            pinColor={'green'}
                          />
                          <Marker
                            coordinate={{
                              latitude: JSON.parse(
                                this.state.selectedUser.location[0],
                              ),
                              longitude: JSON.parse(
                                this.state.selectedUser.location[1],
                              ),
                            }}
                            title={this.state.selectedUser.name}
                            description={''}
                          />
                        </MapView>
                      </Block>
                      <TouchableOpacity
                        onPress={() => {
                          this.handleGetDirections();
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: 'white',
                            backgroundColor: 'red',
                            padding: (height * 2.5) / 100,
                          }}>
                          Open Maps App
                          <Icon
                            family="AntDesign"
                            size={15}
                            name="caretright"
                            color={'white'}
                          />
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              </View>
            </Modal>

            <Block flex={1} marginLeft={20}>
              <Block flex style={[style.product, style.shadow]}>
                <TouchableOpacity onPress={() => this.ShareApp()}>
                  <Block style={{flexDirection: 'row'}}>
                    <Block style={{marginTop: 10, flex: 1}}>
                      <Image
                        source={require('../../../assets/images/share.png')}
                        style={{width: 60, height: 60, borderRadius: 30}}
                      />
                    </Block>

                    <Block
                      flex={5}
                      style={{
                        flexDirection: 'column',
                        marginLeft: 10,
                        marginTop: 15,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: '#57595d',
                          width: '75%',
                          height: 20,
                        }}>
                        Invite Friends
                      </Text>
                      <Text
                        style={{
                          width: '100%',
                          marginTop: 10,
                          fontSize: 15,
                          color: '#57595d',
                        }}>
                        Share Social Distancing to your Friends
                      </Text>
                    </Block>
                  </Block>
                </TouchableOpacity>
              </Block>
            </Block>

            <Block flexDirection="row" style={{paddingTop: 10}}>
              <Block
                marginTop={30}
                backgroundColor={'#EC3345'}
                height={30}
                paddingLeft={5}
                width={'30%'}
                left
                style={{borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                <Block middle marginTop={5}>
                  <TouchableOpacity
                    onPress={() => this.findFriends(this.state.userId)}>
                    <Text color={'#fff'} bold>
                      My Friends{' '}
                      <Icon
                        family="AntDesign"
                        size={15}
                        name="reload1"
                        color={'white'}
                      />
                    </Text>
                  </TouchableOpacity>
                </Block>
              </Block>

              <Block marginTop={30} height={30} width={'70%'} right>
                <TouchableOpacity onPress={() => this.openModal()}>
                  <Block marginTop={5}>
                    <Text
                      color={'white'}
                      style={{
                        backgroundColor: 'red',
                        padding: 5,
                        // borderRadius: 5,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                      }}
                      bold>
                      <Icon
                        family="AntDesign"
                        size={15}
                        name="pluscircle"
                        color={'white'}
                      />{' '}
                      Add Friends
                    </Text>
                  </Block>
                </TouchableOpacity>
              </Block>
            </Block>

            <Block flexDirection="row">
              <Block
                // marginTop={20}
                // marginBottom={20}
                // height={100}
                width={'100%'}
                middle>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      `Change your Status to ${
                        this.state.status ? 'Healthy' : 'In Emergency'
                      }`,
                      'Your Status is visible to all your friends and they can view your current location to reach to you in any emergency situation.',
                      [
                        {
                          text: 'No',
                          onPress: () => {
                            console.log('Cancel Pressed');
                          },
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => {
                            this.loadingStatus(true);

                            firestore()
                              .collection('Users')
                              .doc(this.state.userId)
                              .update({
                                current: !this.state.status,
                              })
                              .then((val) => {
                                if (
                                  !this.state.status &&
                                  this.state.friends.family.length > 0
                                ) {
                                  let arr;
                                  let Qtitle =
                                    'I am in Emergency, Please Help!';
                                  let QBody = `${this.state.friends.name} shared his location, Reach him out via using Social distancing Location Tracker`;

                                  this.state.friends.family.map((e, i) => {
                                    // arr.push(e.token),

                                    //console.log('toekn', arr);
                                    fetch(
                                      `https://us-central1-social-distancing-49175.cloudfunctions.net/notifylocation?token=${e.token}&body=${QBody}&title=${Qtitle}`,
                                      {
                                        method: 'GET',
                                        // body: {
                                        //   token: arr,
                                        //   body: `${this.state.friends.name} shared his location, Reach him out via using Social distancing Location Tracker`,
                                        //   title:
                                        //     'I am in Emergency, Please Help!',
                                        // },
                                      },
                                    )
                                      .then(() => {
                                        // res.json().then((resp) => {
                                        if (
                                          i ==
                                          this.state.friends.family.length - 1
                                        ) {
                                          this.loadingStatus(false);

                                          this.findFriends(this.state.userId);
                                        }
                                        // console.log('Notification msg', resp);
                                      })
                                      .catch((err) => {
                                        this.loadingStatus(false);

                                        // console.log('Notification Error', err);
                                      });
                                  });
                                } else {
                                  this.findFriends(this.state.userId);
                                  this.loadingStatus(false);
                                }
                              })
                              .catch((err) => {
                                this.loadingStatus(false);

                                Alert.alert(
                                  'Error',
                                  'Unable to Change your Status',
                                );
                              });
                          },
                        },
                      ],
                    );
                  }}>
                  <Block middle marginTop={2} marginBottom={2}>
                    {/* <Text color={'black'} bold style={{textAlign: 'center'}}> */}
                    {/* <Icon
                      family="AntDesign"
                      size={65}
                      name={this.state.status ? 'frowno' : 'smileo'}
                      color={this.state.status ?'red':'green'}
                    />{' '} */}
                    {this.state.status != null && (
                      <Image
                        source={
                          this.state.status
                            ? require('./alert.png')
                            : require('./gym.png')
                        }
                        style={{
                          width: 80,
                          height: 80,
                          // borderRadius: 30,
                        }}
                      />
                    )}
                    {/* {`My Current Status: ${
                      this.state.status ? 'In Emergency' : 'Healthy'
                    }`} */}
                    {/* </Text> */}
                  </Block>
                </TouchableOpacity>
              </Block>
            </Block>

            <Block flex={9} marginTop={15} marginBottom={20} padding={5}>
              {/* <FlatList
              data={Object.values(this.state.friends)}
              renderItem={this.renderItem}
              horizontal={false}
              numColumns={1}
              keyExtractor={(item, index) => index}
            /> */}
              {
                this.state.friends.family.length > 0 &&
                  this.state.friendsData[
                    this.state.friends.family[
                      this.state.friends.family.length - 1
                    ].id
                  ] != undefined &&
                  this.state.friends.family.map((e) => (
                    <Block
                      flexDirection="row"
                      middle
                      padding={1}
                      style={{
                        borderWidth: 1,
                        borderColor: 'red', //colors[(0 + Math.random() * 13).toFixed(0)],
                        borderRadius: 25,
                        marginTop: 5,
                        backgroundColor: this.state.friendsData[e.id].status
                          ? '#ffcfcf'
                          : '#EFEFEF', // colors[(0 + Math.random() * 13).toFixed(0)],
                      }}>
                      <Block left width="90%">
                        <Block style={{flexDirection: 'row'}}>
                          <Block style={{marginTop: 10, flex: 2}}>
                            <Image
                              source={{
                                uri: e.avatar,
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                              }}
                            />
                          </Block>

                          <Block
                            flex={8}
                            style={{
                              flexDirection: 'column',
                              marginLeft: 40,
                              marginTop: 15,
                            }}>
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: '#57595d',
                                width: '75%',
                                height: 20,
                              }}>
                              {e.name.slice(0, 11)}
                            </Text>
                            <Text
                              style={{
                                width: '100%',
                                marginTop: 4,
                                fontSize: 10,
                                color: '#57595d',
                              }}>
                              {e.contact.slice(0, 14)}
                            </Text>
                            {this.state.friendsData[e.id].status && (
                              <Image
                                source={require('./alert.png')}
                                style={{
                                  width: 30,
                                  height: 30,
                                  // borderRadius: 30,
                                }}
                              />
                            )}
                            {/* <Text
                            style={{
                              width: '100%',
                              marginTop: 4,
                              fontSize: 15,
                              color: '#57595d',
                            }}> */}
                            {/* <Icon
                              family="AntDesign"
                              size={15}
                              name="frowno"
                              color={'red'}
                            /> */}
                            {/* {'In Emergency'}
                          </Text> */}
                          </Block>
                          <Block marginLeft={10} marginTop={20}>
                            <TouchableOpacity
                              onPress={async () => {
                                // let arr = [];
                                let Qtitle = 'I am in Emergency, Please Help!';
                                let QBody = `${this.state.friends.name} shared his location, Reach him out via using Social distancing Location Tracker`;
                                // arr.push(this.state.friendsData[e.id].token);
                                // console.log('arr for token', arr)
                                try {
                                  await fetch(
                                    `https://us-central1-social-distancing-49175.cloudfunctions.net/notifylocation?token=${
                                      JSON.stringify(this.state.friendsData[e.id].token)
                                    }&body=${QBody}&title=${Qtitle}`,
                                    {
                                      method: 'GET',
                                      // body: {
                                      //   token: arr,
                                      //   body: `${this.state.friends.name} shared his location, Reach him out via using Social distancing Location Tracker`,
                                      //   title: 'I am in Emergency, Please Help!',
                                      // },
                                    },
                                  );
                                  // .then(() => {
                                  // console.log(res.json())
                                  Alert.alert(
                                    JSON.stringify(`${e.name} has recieved your current location`),
                                    JSON.stringify(
                                      `All your friends can see your location(${
                                        this.state.friendsData[e.id].location[0]
                                      },${
                                        this.state.friendsData[e.id].location[1]
                                      }) and reach out to you in any emergency situation`,
                                    ),
                                  );
                                  // console.log('Notification msg', res);
                                  // })
                                  // .catch((err) => {
                                  //   // console.log('Notification Error', err);
                                  // });
                                } catch (err) {}
                              }}>
                              <Text
                                style={{
                                  width: '100%',
                                  // marginTop: 8,
                                  fontSize: 15,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  padding: 5,
                                  borderRadius: 5,
                                  backgroundColor: 'red',
                                }}>
                                Alert
                              </Text>
                            </TouchableOpacity>
                          </Block>
                          <Block marginLeft={10} marginTop={20}>
                            <TouchableOpacity
                              onPress={() => {
                                // console.log('positoaaaaaaaaaaaaaa');
                                this.loadingStatus(true);

                                Geolocation.getCurrentPosition(
                                  //Will give you the current location
                                  (position) => {
                                    // console.log('positoaaaaaaaaaaaaaa');

                                    const currentLongitude = JSON.stringify(
                                      position.coords.longitude,
                                    );
                                    //getting the Longitude from the location json
                                    const currentLatitude = JSON.stringify(
                                      position.coords.latitude,
                                    );
                                    // console.log('positoaaaaaaaaaaaaaa');

                                    // console.log('positoaaaaaaaaaaaaaa', position);

                                    //getting the Latitude from the location json
                                    this.setState({
                                      currentLongitude: currentLongitude,
                                      currentLatitude: currentLatitude,
                                      modalVisibleLocation: true,
                                    });
                                    this.loadingStatus(false);

                                    //Setting state Latitude to re re-render the Longitude Text
                                    // this.UpdatePosition({currentLatitude, currentLongitude});
                                    //console.log('new1', geoQuery)
                                  },
                                  (error) => {
                                    this.loadingStatus(false);

                                    Alert.alert(
                                      'Error:',
                                      // JSON.stringify(error.message),
                                    );
                                  },
                                  {
                                    enableHighAccuracy: true,
                                    timeout: 20000,
                                    maximumAge: 1000,
                                  },
                                );
                                this.setState({
                                  selectedUser: this.state.friendsData[e.id],
                                });
                              }}>
                              <Text
                                style={{
                                  width: '100%',
                                  // marginTop: 8,
                                  fontSize: 15,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  padding: 5,
                                  borderRadius: 5,
                                  backgroundColor: 'red',
                                }}>
                                View
                              </Text>
                            </TouchableOpacity>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                  ))
                // : (
                //   <ActivityIndicator />
                // )
              }
            </Block>
            <Block flex={1}></Block>
          </Block>
        </ScrollView>
      </React.Fragment>
    );
  }
}
