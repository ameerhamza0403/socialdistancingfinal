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
  AsyncStorage,
  Vibration,
  ScrollView,
  View,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import style from './style';
const {width, height} = Dimensions.get('screen');
import Geolocation from 'react-native-geolocation-service';
const OS = Platform.OS == 'ios' ? true : false;
import Animation from 'lottie-react-native';
import radar from '../../../assets/images/location.json';
import SearchModal from '../NearbySearchModal/nearbysearchmodal';
import PushNotification from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

import database from '@react-native-firebase/database';
var Geofire = require('geofire').GeoFire;

function Separator() {
  return <View style={Platform.OS === 'android' ? styles.separator : null} />;
}
export default class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLongitude: 'unknown', //Initial Longitude
      currentLatitude: 'unknown', //Initial Latitude
      searchModal: false,
      userId: '',
      corona: [],
      position: {
        currentLatitude: '',
        currentLongitude: '',
        distance: '',
      },
    };
    this.geofireRef = new Geofire(database().ref('positionGeo'));
  }

  handleGetDirections = () => {
    const data = {
      source: {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
      },
      destination: {
        latitude: 31.582045,
        longitude: 74.329376,
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
    };

    getDirections(data);
  };

  onCloseModal = () => {
    this.setState({
      searchModal: false,
    });
  };

  async componentDidMount() {
    // this.getCases();
    // var geoQuery = geoFire.query({
    //   center: [10.38, 2.41],
    //   radius: 10.5
    // });

    const id = await AsyncStorage.getItem('@user_id');
    if (id == null) {
      this.props.navigation.navigate('SignIn');
    }
    try {
      messaging()
        .getToken()
        .then((token) => {
          // console.log('token:::', token)
          firestore().collection('Users').doc(id).update({
            token: token,
          });
        })
        .catch((err) => {
          Alert.alert('Notification Crashed!',JSON.stringify(err));
        });
      messaging().onTokenRefresh((token) => {
        // console.log('token Refreshed');
        firestore().collection('Users').doc(id).update({
          token: token,
        });
      });
    } catch (error) {
      Alert.alert('Notification Crashed!');
    }
    //console.log('componment --------', id);
    this.setState({
      userId: id,
    });
    PushNotification.configure({
      onNotification: function (notification) {
        //console.log('NOTIFICATION:', notification);
        Alert.alert('Notification', notification);
      },
    });

    this.animation.play();
    //Checking for the permission just after component loaded
    var that = this;
    if (Platform.OS === 'ios') {
      this.callLocation();
    } else {
      try {
        // var config={
        //   authorizationLevel: 'auto',
        //   skipPermissionRequests: true
        // }
        // geolocation.setRNConfiguration(config);
        // Geolocation.requestAuthorization();

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          // {
          //   title: 'Location Access Required',
          //   message: 'This App needs to Access your location',
          // },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          that.callLocation();
        } else {
          Alert.alert('Permission Denied', 'Error');
        }
      } catch (err) {
        Alert.alert('Error Occured');
      }
    }
  }

  getCases = () => {
    fetch('https://covid-19.dataflowkit.com/v1', {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    })
      .then((res) =>
        res.json().then(async (res) => {
          let user = await AsyncStorage.getItem('@user_info');
          user = JSON.parse(user);
          const myCountry = res.filter((e) => {
            if (e.Country_text == user.Country) {
              return e;
            }
          });
          let arr = [];
          arr.push(res[0]);
          arr.push(myCountry);
          this.setState({
            corona: arr,
          });
          //console.log('___________________', arr);
        }),
      )
      .catch((err) =>
        Alert.alert('Error Fetching', 'Check Your Internet and Try Again'),
      );
  };

  callLocation = () => {
    var geoQuery = 'jj';
    //alert("callLocation Called");
    //console.log('here');
    this.geofireRef.set(this.state.userId, [30.0, 30.0]).then(
      () => {
        // console.log(
        //   this.state.userId,
        //   'Provided key has been added to GeoFire',
        // );
      },
      function (error) {
        // console.log('Error: ' + error);
      },
    );

    geoQuery = this.geofireRef.query({
      center: [20.0, 120.0],
      radius: 0.002,
    });
    // console.log('new', geoQuery);

    geoQuery.on(
      'key_entered',
      (key, location, distance) => {
        console.log(
          'hererererererer',this.state.userId,key +
            ' entered query at ' +
            location +
            ' (' +
            distance +
            ' km from center)',

        );
        if (key != this.state.userId) {
          this.callAlert(key);
        }
      },
    );
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
        this.setState({currentLongitude: currentLongitude});
        //Setting state Longitude to re re-render the Longitude Text
        this.setState({currentLatitude: currentLatitude});
        //Setting state Latitude to re re-render the Longitude Text
        // this.UpdatePosition({currentLatitude, currentLongitude});
        //console.log('new1', geoQuery)

      },
      (error) => Alert.alert('Error:', JSON.stringify(error.message)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    this.watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change latitude": 31.5825168, "longitude": 74.4039802,
        //console.log('position changed:', position);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        // console.log('checking location', position.coords)
        this.geofireRef
          .set(this.state.userId, [
            position.coords.latitude,
            position.coords.longitude,
          ])
          .then(
            function () {
              // console.log('Provided key has been added to GeoFire- Real');
            },
            function (error) {
              // console.log('Error: ' + error);
            },
          );
          console.log('Geofire1 before', geoQuery);
          geoQuery.updateCriteria({
            center: [position.coords.latitude, position.coords.longitude],
          })
          console.log('Geofire1 after', geoQuery);
        this.UpdatePosition({currentLatitude, currentLongitude});
      },
      (error) =>{
        //  Alert.alert('Location Error', JSON.stringify(error.message)),
      },
      {distanceFilter: 1,enableHighAccuracy: true},
    );

    // //console.log(this.watchID);
  };

  callAlert = (key) => {
    database()
      .ref(`position/${key}`)
      .once('value')
      .then(async (snapshot) => {
        //console.log('User data: ', snapshot.val());
        var distance =
          this.distance(
            this.state.position.currentLatitude,
            this.state.position.currentLongitude,
            snapshot.val().position.lat,
            snapshot.val().position.lng,
            'K',
          ) * 1000;
        //console.log(distance);
        if (distance < 3) {
          const users = await firestore()
            .collection('Users')
            .where('id', '==', key)
            .get();
          Vibration.vibrate(10 * 1000);
          Alert.alert(
            'Beaware! Someone is around',
            `${
              users._docs[0].data().name
            } is standing approx. at ${distance.toFixed(1)} meters from you`,
            [
              {
                text: 'OK',
                onPress: () => Vibration.cancel(),
              },
            ],
          );
        }
      });
  };

  UpdatePosition = (position) => {
    let rio = {
      currentLatitude: position.currentLatitude,
      currentLongitude: position.currentLongitude,
      distance:
        this.distance(
          '31.5825168',
          '74.4039802',
          position.currentLatitude,
          position.currentLongitude,
          'K',
        ) * 1000,
    };
    this.setState({
      position: rio,
    });
    // const myLat=lat
    // const myLong=long
    //console.log('///' + JSON.stringify(position));
    // //console.log("///" + myLong)
    try {
      database()
        .ref('position')
        .child(this.state.userId)
        .update({
          position: {
            lat: position.currentLatitude,
            lng: position.currentLongitude,
          },
        }).then(()=>{
          console.log('position upodated')
        })

      //   firebase.database.ref('Users' + '1').child('CurrentLatitude').update(myLat)
      // firebase.database.render('Users'+ '1').child('CurrentLongitude').update(myLong)
    } catch (err) {
      Alert.alert('Error in Database', 'Check Your Internet and Try Again');
    }
  };

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  };

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
  };

  find = () => {
    // var geoQuery = geoFire.query({
    //   center: [this.state.currentLatitude,this.state.currentLongitude],
    //   radius: 10.5
    // })
    // var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
    //   //console.log(key + " entered query at " + location + " (" + distance + " km from center)");
    // });
  };
  render() {
    const ONE_SECOND_IN_MS = 1000;

    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS,
      3 * ONE_SECOND_IN_MS,
    ];

    const PATTERN_DESC =
      Platform.OS === 'android'
        ? 'wait 1s, vibrate 2s, wait 3s'
        : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';
    return (
      <React.Fragment>
        <Block style={style.container}>
          <StatusBar
            backgroundColor="#EC3345"
            barStyle="light-content"></StatusBar>

          {/* {this.state.corona.length > 0 && (
            <React.Fragment>
              <ScrollView>
              <View>
              
              </View>
                </ScrollView>
            </React.Fragment>
          )} */}

          <Block center flex={3} marginTop={50} style={style.radarContainer}>
            <Animation
              resizeMode={'cover'}
              ref={(animation) => {
                this.animation = animation;
              }}
              style={{
                width: 250,
                height: 200,
              }}
              loop={true}
              source={radar}
              autoSize
            />
          </Block>

          <Block center flex={2}>
            <Block
              style={{
                borderRadius: 50,
                width: '70%',
                marginTop: 10,
                height: 50,
                flexDirection: 'row',
                // backgroundColor: '#EC3345',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* <TouchableOpacity
                onPress={() => Vibration.vibrate(10 * ONE_SECOND_IN_MS)}
                style={{alignItems: 'center', width: '100%'}}>
                <Block
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}> */}
              <Text bold style={{color: 'red', fontSize: 18}}>
                Monitoring your surrounding.. !
              </Text>
              {/* </Block>
              </TouchableOpacity> */}
            </Block>
          </Block>
        </Block>
      </React.Fragment>
    );
  }
}
