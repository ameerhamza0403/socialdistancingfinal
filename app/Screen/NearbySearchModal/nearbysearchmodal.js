// import React, {Component} from 'react';

// import {
//   StyleSheet,
//   Dimensions,
//   ScrollBlock,
//   Image,
//   ImageBackground,
//   Platform,
//   Linking,
//   Modal,
//   View,
//   TouchableWithoutFeedback,
//   TouchableHighlight,
//   AsyncStorage,
//   Alert,
//   FlatList,
// } from 'react-native';
// import SearchBar from 'react-native-search-bar';
// import database from '@react-native-firebase/database';
// import {
//   Block,
//   Text,
//   theme,
//   Button,
//   Card,
//   Checkbox,
//   Input,
// } from 'galio-framework';

// import style from './style';

// const {width, height} = Dimensions.get('screen');
// const thumbMeasure = (width - 48 - 32) / 3;

// class BookingInfo extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dataSource: '',
//       isLoading: false,
//       userId: '',
//       userName: '',
//       userContact: '',
//       searchText:'',
//       userName:'',
//       userContact:'',
//       fetched:false
//     };
//   }

//   async componentDidMount() {
//     const id = await AsyncStorage.getItem('Id', 0);
//     this.setState({
//       userId: id,
//     });

//     try {
//       const that = this;
//       //getting user data
//         database()
//         .ref('Users')
//         .child(this.state.userId)
//         .once('value', function (myData) {
//           console.log('My ', myData.val().name);

//           that.setState({
//             userName: myData.val().name,
//             userContact: myData.val().contact,
//             isLoading: false,
//           });
//         });


//     } catch (error) {
//       Alert.alert(error);
//     }
//   }
//   AddFriend = (id, name, contact) => {
//     console.log(id)
    
//     try {
//         database()
//         .ref('Friends')
//         .child(this.state.userId)
//         .child(id)
//         .set({
//           id: id,
//           name: name,
//           contact: contact,
//         })
//         .then((data) => {
//             database()
//             .ref('Friends')
//             .child(id)
//             .child(this.state.userId)
//             .set({
//               id: this.state.userId,
//               name: this.state.userName,
//               contact: this.state.userContact,
//             });
//           Alert.alert('Friend Added !');
//         })
//         .catch((error) => {
//           Alert.alert(error.toString());
//         });
//     } catch (err) {
//       Alert.alert(err);
//     }
//   };
//   search=()=> {
//     let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
//     const {searchText} = this.state
//     if(searchText =='' || reg.test(searchText) ===false)
//     {
//       Alert.alert('Enter Email only !')
//     }
    
// else {
//   const that = this;
//   console.log(this.state.searchText)
//     database().ref('Users').orderByChild('Email')
//   .equalTo(this.state.searchText).on("value", function(snapshot) {
//     console.log('my data', snapshot.val());
//     that.setState({
//       dataSource:snapshot.val(),     
    
//     })
 
// });
  
// if(Object.keys(this.state.dataSource).length == 0){
//   console.log("error")

// }
// else {
//   this.setState({
//     fetched:true
//   })
// }
// }
//   }

//   // renderItem = ({item}) => (
//   //   <Block flex={1} marginLeft={20} marginTop={10}>
//   //     <TouchableHighlight>
//   //       <Block flex style={[style.shadow]}>
//   //         <Block style={{flexDirection: 'row'}}>
//   //           <Block style={{marginTop: 10, flex: 1}}>
//   //             <Image
//   //               source={{
//   //                 uri:
//   //                   'https://image.freepik.com/free-photo/senior-woman-patient-touching-female-nurse-hand-shoulder_23-2147861496.jpg',
//   //               }}
//   //               style={{width: 60, height: 60, borderRadius: 30}}
//   //             />
//   //           </Block>
  
  

//   //           <Block
//   //             flex={5}
//   //             style={{
//   //               flexDirection: 'column',
//   //               marginLeft: 10,
//   //               marginTop: 15,
//   //             }}>
//   //             <Text
//   //               style={{
//   //                 fontSize: 17,
//   //                 fontWeight: 'bold',
//   //                 color: '#57595d',
//   //                 width: '75%',
//   //                 height: 20,
//   //               }}>
//   //               {item.name}
//   //             </Text>
//   //             <Text
//   //               style={{
//   //                 width: '100%',
//   //                 marginTop: 8,
//   //                 fontSize: 15,
//   //                 color: '#57595d',
//   //               }}>
//   //               {item.Contact}
//   //             </Text>
//   //           </Block>
//   //           <TouchableHighlight
//   //             onPress={() => this.AddFriend(item.Id, item.Name, item.Contact)}>
//   //             <Block marginTop={30} flex={2} marginRight={20}>
//   //               <Text>Add</Text>
//   //             </Block>
//   //           </TouchableHighlight>
//   //         </Block>
//   //       </Block>
//   //     </TouchableHighlight>
//   //   </Block>
//   // );
 

//   render() {
//     return (
//       <React.Fragment>
//         <Modal
//           animationType="fade"
//           transparent={true}
//           //   presentationStyle={'fullScreen'}
//           visible={this.props.modalVisisble}
//           onRequestClose={() => this.props.onCloseModal()}>
//           <Block safe style={style.container}>
//             <Block style={[style.fadeArea]}></Block>
//             <Block style={style.workArea}>
//               <Block row marginTop={20}>
//                 <Block flex={2} center>
//                   <Text h5 size={16} bold>
//                     Search !
//                   </Text>
//                 </Block>
//               </Block>

//               <Block flex>
//               <SearchBar
//           returnKeyType='search'
//           lightTheme
//           placeholder='Search by Email...'
//           onChangeText={(text) =>
//             this.setState({searchText: text})
//           }
//           onSearchButtonPress={()=>this.search()}
        
//       />
       
//               </Block>
             

//               <Block flex={9} marginTop={10} marginBottom={20}>
             
//               {this.state.fetched? 
              
//               <Block>

//           <FlatList
//                   data={Object.values(this.state.dataSource)}
//                   renderItem={this.renderItem}
//                   horizontal={false}
//                   numColumns={1}
//                   keyExtractor={(item, index) => index}
//                 />


//               </Block> : <Block center flex marginTop={150}>
                
//                 <Text bold color={'#EC3345'}>
//                  Enter Email to Search your family Member</Text></Block>}
//               </Block> 
//             </Block>
//           </Block>
//         </Modal>
//       </React.Fragment>
//     );
//   }
// }

// export default BookingInfo;
