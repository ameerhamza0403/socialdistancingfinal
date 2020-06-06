import React, {Component} from 'react';
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
  Modal,
  View,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';

const {width, height} = Dimensions.get('screen');

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidUpdate(prevProps, PrevState) {
    if (this.props.visible != prevProps.visible) {
      this.setState({
        visible: !this.state.visible,
      });
    }
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({
            visible: false,
          });
        }}>
        <View
          style={{
            width: '100%',
            height: height,
            backgroundColor: '#000000',
            opacity: 0.6,
          }}>
          <View style={{textAlign: 'center', marginTop: height / 2.3}}>
            <ActivityIndicator size={100} color={'white'} />
            <Text style={{textAlign: 'center'}} color='white'>{this.props.text ? this.props.text : 'Loading...'}</Text>
          </View>
        </View>
      </Modal>
    );
  }
}
