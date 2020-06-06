const React = require("react-native");
const { Platform, Dimensions } = React;
const {width,height} = Dimensions.get('window');
export default {

    container:{
        height: height,
    },
    radarContainer:{
        width:'100%',
        height:250
    },
    button:{
        backgroundColor:'#000',
        width:'50%',height:50
    }

}