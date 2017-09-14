import React, {Component} from "react";
import {StyleSheet, View} from "react-native";

import {LS} from "./Common"
import {AppNavigator} from "./AppNavigator"
import MenuController from "./MenuController"

var _app = null; // test, or use module.exports.App = this

export default class App extends Component {

    constructor(props) {
        super(props);
        module.exports.App = this;
        _app = this;
        this.state = {
            showMenu: false,
        };

    }

    static getApp() {
        return _app;
    }

    render() {
        return (
            <View style={styles.container}>

                <AppNavigator ref={nav => {
                    this.navigation = nav;
                }}/>

                {this.state.showMenu ? (
                    <View style={styles.menu}>
                        <MenuController
                            ref={(ref) => this.menu = ref}
                            app={this}/>
                    </View>) : null}

            </View>
        )
    }

    showMenu() {
        this.setState({showMenu: true});
    }

    hideMenu() {
        this.setState({showMenu: false});
    }

    showServerError(errorMsg, response) {
        Alert.alert(LS("Server Error"), errorMsg, [
            {text: LS("OK")},
            {
                text: LS("Info"),
                onPress: () => {
                    response.text().then((text) => {
                        //this.navController.navigator.push({id: "web", title: LS("Error Info"), html: text});
                        this.navigation.navigate("web", {title: LS("Error Info"), html: text});
                    });
                }
            }
        ]);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    menu: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});
