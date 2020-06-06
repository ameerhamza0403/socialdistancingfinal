import React, { Component } from "react";
import Appmain from "./App";




class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false,
   
    };

    // firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  // onAuthStateChanged = user => {
  //   console.log(this.state.isAuthenticated)
  //   this.setState({ isAuthenticationReady: true });
  //   this.setState({ isAuthenticated: !!user });
  //   this.props.handleAuth(this.state.isAuthenticated)

  // };

  componentDidMount(){
    console.disableYellowBox = true;
  }

  render() {
    return (
        <Appmain  route={this.props.route}/>
    );
  }
}

export default Setup

  ;
