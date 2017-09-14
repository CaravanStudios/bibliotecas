import React, {Component} from "react";
import {
    View,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    Alert,
    Platform
} from "react-native";

import {LS, Theme, FAIcon, DEBUG} from "./Common"
import {Browse} from "./BrowseController"

const kMenuWidth = 160;

export default class MenuController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fadeAnimate: new Animated.Value(0.0),
            slideAnimate: new Animated.Value(0.0)
        };
    }

    componentDidMount() {
        this.showMenu();
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback style={styles.backTouch} onPress={() => this.hideMenu()}>
                    <Animated.View style={[styles.background, {opacity: this.state.fadeAnimate}]}/>
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.menu, {left: this.state.slideAnimate}]}>
                    <MenuItemView icon="book" text={LS("Libraries")} onPress={() => this.showSpaces()}/>
                    <MenuItemView icon="calendar" text={LS("Events")} onPress={() => this.showEvents()}/>
                    <MenuItemView icon="info-circle" text={LS("About")} onPress={() => this.showTodo("About")}/>
                    <View style={styles.info}>
                        {DEBUG ? (<Text style={styles.menuText}>{LS("TEST MODE")}</Text>) : null}
                    </View>
                </Animated.View>
            </View>
        )
    }

    showMenu() {
        this.state.fadeAnimate.setValue(0.0);
        this.state.slideAnimate.setValue(-kMenuWidth);
        Animated.timing(this.state.fadeAnimate, {toValue: 1.0, duration: 300}).start();
        Animated.timing(this.state.slideAnimate, {toValue: 0.0, duration: 300}).start();
    }

    hideMenu() {
        Animated.timing(this.state.fadeAnimate, {toValue: 0.0, duration: 300}).start();
        Animated.timing(this.state.slideAnimate, {
            toValue: -kMenuWidth,
            duration: 300
        }).start(() => this.props.app.hideMenu());
    }

    showSpaces() {
        Browse.showSpaces();
        this.hideMenu();
    }

    showEvents() {
        Browse.showEvents();
        this.hideMenu();
    }

    showTodo(text) {
        Alert.alert("TODO", "Menu Item: " + text);
    }

}

const MenuItemView = (props) => (
    <TouchableOpacity style={styles.menuItem} onPress={props.onPress}>
        <Text style={styles.menuText}>
            <FAIcon name={props.icon} size={18} color={Theme.navBarTextColor}/> {props.text}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backTouch: {
        flex: 1
    },
    //navBarSpacer: {
    //    height: Navigator.NavigationBar.Styles.General.TotalNavHeight
    //},
    background: {
        flex: 1,
        backgroundColor: "#0006"
    },
    menu: {
        position: "absolute",
        //top: Navigator.NavigationBar.Styles.General.TotalNavHeight,
        top: Platform.OS !== 'ios' ? 56 : 64,
        bottom: 0,
        left: 0,
        width: kMenuWidth,
        backgroundColor: Theme.navBarColor,
        padding: 12
    },
    menuItem: {
        paddingBottom: 18,
        paddingLeft: 10
    },
    menuIcon: {
        width: 140
    },
    menuText: {
        color: Theme.navBarTextColor
    },
    info: {
        bottom: 0,
        paddingLeft: 10,
        flex: 1,
        justifyContent: "flex-end"
    }
});