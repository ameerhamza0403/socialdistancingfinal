import React from 'react';
import {withNavigation} from '@react-navigation/compat';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';

import styles from './style';
import {Item} from 'native-base';

const {width, height} = Dimensions.get('screen');
import * as rssParser from 'react-native-rss-parser';
import newsRss from '../../constants/NewsRss';
import {TouchableOpacity} from 'react-native-gesture-handler';

const images = [
  'https://image.freepik.com/free-photo/medicine-doctor-team-meeting-analysis_34200-351.jpg',
  'https://image.freepik.com/free-photo/medical-stethoscope-patient-medical-history-list-doctor-uniform_93956-321.jpg',
  'https://image.freepik.com/free-photo/aloe-vera-leaves-glass-coconut-front-view_23-2148536646.jpg',
  'https://image.freepik.com/free-photo/concentrated-doctor-working-with-virtual-screen_1134-639.jpg',
  'https://image.freepik.com/free-photo/portrait-nurse-wearing-medical-mask-gloves_23-2148535603.jpg',
  'https://image.freepik.com/free-photo/high-angle-stethoscope-with-keyboard_23-2148538263.jpg',
  'https://image.freepik.com/free-photo/top-view-stitched-heart-shape-with-stethoscope-against-bright-yellow-background_23-2148214043.jpg',
  'https://image.freepik.com/free-photo/close-up-hand-holding-pill_23-2148538297.jpg',
  'https://image.freepik.com/free-photo/close-up-doctor-is-showing-medical-analytics-data_33799-4417.jpg',
  'https://image.freepik.com/free-photo/hand-chooses-emoticon-icons-healthcare-medical-symbol-wooden-block-healthcare-medical-insurance-concept_39665-204.jpg',
  'https://image.freepik.com/free-photo/crop-hands-holding-heart-with-cross_23-2147796552.jpg',
  'https://image.freepik.com/free-photo/senior-woman-patient-touching-female-nurse-hand-shoulder_23-2147861496.jpg',
];

export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: '',
      imageIndex: 0,
      modalVisisble: false,
      serviceInfo: {},
      ratingModal: false,
      indexOfNews: 0,
    };
  }

  componentDidMount() {
    const focusListener = this.props.navigation.addListener('focus', () => {
      if (this.state.dataSource.length == 0) {
        this.getNewsList(1);
      }
      //console.log('Hey I am Back');
    });
    let totaldata = [];

    fetch(newsRss[this.state.indexOfNews])
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))

      .then((data) => {
        this.setState({
          dataSource: data,
          isLoading: false,
        });
      })
      .catch((e) => {
        Alert.alert('Check Internet or Restart App');
      });

    //  .then(newData => this.setState({dataSource: newData, isLoading: false}))
  }

  getNewsList = (index) => {
    //console.log('ytytytytytytytytyty')
    if (index < 0 || index == newsRss.length) {
      Alert.alert('End of News', 'No more data is available at this time :(');
      return;
    } else {
      this.setState({
        indexOfNews: index,
      });
    }
    this.setState({
      isLoading: true,
    });
    fetch(newsRss[index])
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))

      .then((data) => {
        this.setState({
          dataSource: data,
          isLoading: false,
        });
      })
      .catch((e) => {
        Alert.alert('Check Internet or Restart App');
      });
  };

  openWebSite = (link) => {
    // Alert.alert(link)
    Linking.openURL(link).catch((err) =>
      console.error("Couldn't load page", err),
    );
  };

  renderItem = (item) => {
    const random = images[(0 + Math.random() * 10).toFixed(0)];
    return (
      <TouchableWithoutFeedback onPress={() => this.openWebSite(item.id)}>
        <Block row={true} card flex style={[styles.product, styles.shadow]}>
          <TouchableWithoutFeedback onPress={() => this.openWebSite(item.id)}>
            <Block flex style={[styles.imageContainer, styles.shadow]}>
              <Image
                key={item.id}
                source={{uri: random}}
                style={styles.horizontalImage}
              />
            </Block>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.openWebSite(item.id)}>
            <Block flex space="between" style={styles.productDescription}>
              <Text size={14} style={styles.productTitle}>
                {item.title.length < 100
                  ? `${item.title}`
                  : `${item.title.substring(0, 100)}...`}
              </Text>
              <Text size={12} color={'black'}>
                {item.description.length < 50 && item.title.length < 50
                  ? `${item.description}`
                  : `${item.description.substring(0, 50)}...`}
              </Text>
            </Block>
          </TouchableWithoutFeedback>
        </Block>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Block>
          <StatusBar
            backgroundColor="#EC3345"
            barStyle="light-content"></StatusBar>

          <ActivityIndicator
            color="#24A0ED"
            size="large"
            style={{marginTop: 10}}></ActivityIndicator>
        </Block>
      );
    }

    return (
      <React.Fragment>
        <Block style={styles.profile} flex>
          {/* {//console.log("My",this.state.dataSource.items)} */}
          <Block row flex={15} style={{paddingHorizontal: 5}} top>
            <ScrollView>
              {this.state.dataSource.items.map((e) => this.renderItem(e))}
            </ScrollView>
          </Block>
          {/* <FlatList
            data={this.state.dataSource.items}
            renderItem={this.renderItem}
            horizontal={false}
            numColumns={1}
            keyExtractor={(item, index) => index}
          /> */}

          <Block row bottom flex={1} padding={10}>
            <Block flex={1}>
              <TouchableOpacity
                onPress={() => this.getNewsList(this.state.indexOfNews - 1)}>
                <Block>
                  <Text
                    style={{borderRightWidth: 1, borderColor: 'black'}}
                    center>
                    Back
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
            <Block flex={1}>
              <TouchableOpacity
                onPress={() => this.getNewsList(this.state.indexOfNews + 1)}>
                <Block>
                  <Text center>Next</Text>
                </Block>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </React.Fragment>
    );
  }
}
