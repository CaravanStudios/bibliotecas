import React, {Component} from "react";
import {WebView, StyleSheet} from "react-native";

export default class MyWeb extends Component {

    componentWillMount() {
        console.log("WebController componentWillMount", this.props.url);
    }

    render() {
        return (
            <WebView
                source={{uri: this.props.url, html: this.props.html}}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
                onNavigationStateChange={this.onNavigationStateChange}
            />
        );
    }

    onLoadStart() {
        console.log("onLoadStart", arguments);
    }

    onLoadEnd() {
        console.log("onLoadEnd", arguments);
    }

    onNavigationStateChange(navState) {
        console.log("onNavigationStateChange", navState);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    loadingInner: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#EEEE",
        borderColor: "#888E",
        borderWidth: 1,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    loadingText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
        paddingLeft: 6
    }
});
