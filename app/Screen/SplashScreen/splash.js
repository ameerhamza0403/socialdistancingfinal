import React from 'react';
import {
  Dimensions,
  Platform,
  Image,
  PermissionsAndroid,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import style from './style';
const {width, height} = Dimensions.get('screen');

const OS = Platform.OS == 'ios' ? true : false;
// import Animation from 'lottie-react-native';
// import radar from '../../../assets/images/map.json';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    console.disableYellowBox = true;

    // this.animation.play();
  };

  render() {
    return (
      <ScrollView>
        <React.Fragment>
          <Block style={style.container}>
            <StatusBar
              backgroundColor="#EC3345"
              barStyle="light-content"></StatusBar>

            <Block center flex={1} marginTop={100}>
              {/* <Animation
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
              /> */}
              <Image
                source={require('./logo.jpeg')}
                style={{
                  width: 120,
                  height: 120,
                }}
              />
            </Block>
            <Block center flex={1} marginTop={10}>
              <Text bold size={35} color={'#EC3345'}>
                Social Distancing
              </Text>
              <Block center padding={5} marginLeft={0} marginTop={30}>
                <Text size={12} style={{textAlign: 'center'}}>
                  Trace family mambers in Problematic situations, View latest
                  news on pandemic, maintain social distance from people and
                  much more!!{' '}
                </Text>
              </Block>
            </Block>
          </Block>
        </React.Fragment>
      </ScrollView>
    );
  }
}
