import {StyleSheet, Platform} from "react-native";

const colors = {
    navBarColor: "#2E86AB",         //"#eee",
    navBarBottomColor: "#17255A",   //"#ddd",
    navBarTitleColor: "#FFF",       //"#373E4D",
    navBarTextColor: "#F8F8F8",      //"#373E4D", //"#5890FF",
};

const styles = StyleSheet.create({
    ...Platform.select({
        ios: {
            navBar: {
                backgroundColor: colors.navBarColor,
                borderBottomColor: colors.navBarBottomColor,
                borderBottomWidth: StyleSheet.hairlineWidth
            },
            navBarTitleText: {
                color: colors.navBarTitleColor,
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
                color: colors.navBarTextColor,
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
                backgroundColor: colors.navBarColor,
                borderBottomColor: colors.navBarBottomColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
            },
            titleContainer: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            },
            navBarTitleText: {
                color: colors.navBarTitleColor,
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
                color: colors.navBarTextColor,
                fontSize: 18,
            },
            navImage: {
                width: 30,
                height: 30,
            },
        }
    })
});

module.exports.Theme = {
    navBarColor: "#2E86AB",         //"#eee",
    navBarBottomColor: "#17255A",   //"#ddd",
    navBarTitleColor: "#FFF",       //"#373E4D",
    navBarTextColor: "#F8F8F8",      //"#373E4D", //"#5890FF",
    colors: colors,
    styles: styles
};