const React = require("react-native");
const { Platform, Dimensions } = React;
const {width,height} = Dimensions.get('window');
import {Block, Text, theme, Button, Card,Checkbox,Input} from 'galio-framework';
export default {

    container:{
        height: height,
    },
   
 
    product: {
        // backgroundColor: theme.COLORS.WHITE,
        //  marginVertical: theme.SIZES.BASE,
        // borderWidth: 0,
        // minHeight: 70,
      },
      shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
      },

}