const React = require("react-native");
const { Platform, Dimensions } = React;
const {width,height} = Dimensions.get('window');
import { Block, Text, theme } from 'galio-framework';
import materialTheme from '../../constants/Theme';
export default {

    profile: {
      width:'100%',
      height:height
     
      },
    
      product: {
        backgroundColor: theme.COLORS.WHITE,
        // marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 100,
      },
     title: {
        flex: 1,
        flexWrap: 'wrap',
        paddingBottom: 6,
      },
      description: {
     
      },
      shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
      },
     
      product: {
        backgroundColor: theme.COLORS.WHITE,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
      },
      productTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingBottom: 6,
      },
      productDescription: {
        padding: theme.SIZES.BASE / 2,
      },
      imageContainer: {
        elevation: 1,
      },
      image: {
        borderRadius: 3,
        marginHorizontal: theme.SIZES.BASE / 2,
        marginTop: -16,
      },
      horizontalImage: {
        height: 100,
        width: 'auto',
        marginTop: -16,
        borderRadius: 5,
        marginHorizontal: theme.SIZES.BASE / 2,
        borderWidth: 3,
        borderColor: '#e6e5e3'

      },
      fullImage: {
        height: 215,
        width: width - theme.SIZES.BASE * 3,
      },
      shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
      },

}