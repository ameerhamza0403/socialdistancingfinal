const React = require("react-native");
const { Platform, Dimensions } = React;
const {width,height} = Dimensions.get('window');
import {theme,} from 'galio-framework';
export default {

    container:{
       flex:1
    },
    fadeArea:{
        backgroundColor: 'rgb(0, 0, 0)',
        height: height/5+height/7,
        marginBottom: -height/7,
        opacity: 0.6
    },
    workArea:{
        backgroundColor: '#fff',
        height: height-(height/9),
        borderRadius: width/12,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    workAreaCard:{
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    line:{
        height:1,

        backgroundColor:'#ABABAB',
        
        
      },
      time:{
        borderColor:'#000',
        borderRadius:1.2,
        height:22,width:80,
        borderWidth:1.5,
       
        marginRight:10
      },  product: {
        backgroundColor: theme.COLORS.WHITE,
         marginVertical: theme.SIZES.BASE,
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
}