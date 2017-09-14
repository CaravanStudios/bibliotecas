import React from "react";
import {StyleSheet, Platform} from "react-native";
import {StackNavigator} from "react-navigation";

import {Theme} from "./Common";

import BrowseController from "./BrowseController";
import DetailsController from "./DetailsController";
import WebController from "./WebController";

const styles = StyleSheet.create({
    ...Platform.select({
        ios: {
            navBar: {
                backgroundColor: Theme.navBarColor,
                borderBottomColor: Theme.navBarBottomColor,
                borderBottomWidth: StyleSheet.hairlineWidth
            },
            navBarTitleText: {
                color: Theme.navBarTitleColor,
                fontSize: 16,
                fontWeight: "500",
                marginVertical: 9,
            },
            navBarLeftButton: {
                paddingLeft: 10,
                paddingRight: 20, // Makes touch area wider
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            },
            navBarRightButton: {
                paddingRight: 10,
                paddingLeft: 20 // Makes touch area wider
            },
            navBarButtonText: {
                color: Theme.navBarTextColor,
                fontSize: 16,
                marginVertical: 10
            },
            navImage: {
                width: 30,
                height: 30,
            },
        },
        android: {
            navBar: {
                backgroundColor: Theme.navBarColor,
                borderBottomColor: Theme.navBarBottomColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
            },
            titleContainer: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            },
            navBarTitleText: {
                color: Theme.navBarTitleColor,
                fontSize: 20,
                fontWeight: "500",
            },
            navBarLeftButton: {
                paddingLeft: 10,
                paddingRight: 20, // Makes touch area wider
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            },
            navBarRightButton: {
                paddingRight: 10,
                paddingLeft: 20, // Makes touch area wider
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            },
            navBarButtonText: {
                color: Theme.navBarTextColor,
                fontSize: 18,
            },
            navImage: {
                width: 30,
                height: 30,
            },
        }
    })
});

export const AppNavigator = StackNavigator({
    Home: {screen: BrowseController},
    details: {screen: DetailsController},
    web: {screen: WebController}
}, {
    navigationOptions: {
        headerStyle: styles.navBar,
        headerTintColor: Theme.navBarTitleColor,
    }
});