import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Easing, Animated, Dimensions} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import CustomDrawerContent from './navigation/Menu';
import {Icon, Header} from './Component';
import {Images, materialTheme} from './constants/';
import DashboadComponent from './Screen/Dashboard/dashboard';
import NewsList from './Screen/NewsList/NewsList';
import LoginScreen from './Screen/Login/login';
import SignScreen from './Screen/Signup/signup';
import MyFamily from './Screen/MyFamily/myfamily';
import SignOut from './Screen/SignOut/SignOut';

const {width} = Dimensions.get('screen');

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

const profile = {
  avatar: Images.Profile,
  name: 'Rachel Brown',
  type: 'Seller',
  plan: 'Pro',
  rating: 4.8,
};

DashboardStack = (props) => {
  return (
    <Stack.Navigator
      mode="card"
      headerMode="screen"
      initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={DashboadComponent}
        options={{
          header: ({navigation, scene}) => (
            <Header
              // search
              // tabs
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

SignUpStack = () => {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Signup"
        component={SignScreen}
        options={{
          header: ({navigation, scene}) => (
            <React.Fragment></React.Fragment>
            // <Header
            //   // search
            //   // tabs
            //   title="Home"
            //   navigation={navigation}
            //   scene={scene}
            // />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

SignInStack = () => {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          header: ({navigation, scene}) => (
            <React.Fragment></React.Fragment>
            // <Header
            //   // search
            //   // tabs
            //   title="Home"
            //   navigation={navigation}
            //   scene={scene}
            // />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

MyFamilyStack = () => {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Family"
        component={MyFamily}
        options={{
          header: ({navigation, scene}) => (
            <Header
              // search
              // tabs
              title="Family"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

NewsListStack = (props) => {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="News"
        component={NewsList}
        options={{
          header: ({navigation, scene}) => (
            <Header
              // search
              // tabs
              title="Latest Health News"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

SignOutStack = (props) => {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Sign Out"
        component={SignOut}
        options={{
          header: ({navigation, scene}) => (
            <React.Fragment></React.Fragment>
            // <Header
            //   // search
            //   // tabs
            //   title="Latest Health News"
            //   navigation={navigation}
            //   scene={scene}
            // />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const AppStack = (props) => {
  return (
    <Drawer.Navigator
      style={{flex: 1}}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} profile={profile} />
      )}
      drawerStyle={{
        backgroundColor: 'white',
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintColor: 'white',
        inactiveTintColor: '#000',
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: 'transparent',
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: 'center',
          alignContent: 'center',
          // alignItems: 'center',
          overflow: 'hidden',
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: 'normal',
        },
      }}
      initialRouteName={props.route}>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          drawerIcon: ({focused}) => (
            <Icon
              size={16}
              name="dashboard"
              family="MaterialIcons"
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="News"
        component={NewsListStack}
        options={{
          drawerIcon: ({focused}) => (
            <Icon
              size={16}
              name="newspaper"
              family="MaterialIcons"
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="SignIn"
        component={SignInStack}
        options={
          {
            // drawerIcon: ({focused}) => (
            //   <Icon
            //     size={16}
            //     name="newspaper"
            //     family="MaterialIcons"
            //     color={focused ? 'white' : materialTheme.COLORS.MUTED}
            //   />
            // ),
          }
        }
      />

      <Drawer.Screen
        name="SignUp"
        component={SignUpStack}
        options={
          {
            // drawerIcon: ({focused}) => (
            //   <Icon
            //     size={16}
            //     name="newspaper"
            //     family="MaterialIcons"
            //     color={focused ? 'white' : materialTheme.COLORS.MUTED}
            //   />
            // ),
          }
        }
      />

      <Drawer.Screen
        name="Family"
        component={MyFamilyStack}
        options={{
          drawerIcon: ({focused}) => (
            <Icon
              size={16}
              name="team"
              family="AntDesign"
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Sign Out"
        component={SignOutStack}
        options={{
          drawerIcon: ({focused}) => (
            <Icon
              size={16}
              name="team"
              family="AntDesign"
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

class Appmain extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <AppStack route={this.props.route} />
      </NavigationContainer>
    );
  }
}

export default Appmain;
