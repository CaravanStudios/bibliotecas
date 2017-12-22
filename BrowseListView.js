import React, {Component} from "react";
import {ListView, View, Text, Image, StyleSheet, TouchableOpacity} from "react-native";
import {Theme} from "./Common"
import Util from "./Util"

export default class BrowseListView extends Component {

    _dataSource = null;

    constructor(props) {
        super(props);
        this._dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this._dataSource.cloneWithRows(props.items),
            mode: props.mode
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dataSource: this._dataSource.cloneWithRows(newProps.items),
            mode: newProps.mode
        });
    }

    render() {
        console.log("BrowseListView render");
        return (
            <ListView
                style={styles.list}
                dataSource={this.state.dataSource}
                renderRow={(this.state.mode === 1 ? this.renderLocationRow : this.renderEventRow).bind(this)}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator}/>}
                enableEmptySections={true}
            />
        );
    }

    renderLocationRow(props, sectionId, rowId) {
        console.log('props = ', props);
        //console.log("renderLocationRow", sectionId, rowId, props);
        //var avatar = props["@files:avatar.avatarMedium"];
        //var icon = avatar ? {uri: avatar.url} : require("./assets/avatar--space.png");
        var icon = props.imageUrl ? props.imageUrl : require("./assets/avatar--space.png");
        return (
            <TouchableOpacity onPress={() => {
                console.log("rowPress", props);
                this.props.navigation.navigate("details", {info: props});
            }}>
                <View key={rowId} style={styles.row}>
                    <Image style={styles.rowImage} source={icon}/>
                    <View style={styles.rowInfo}>
                        <Text style={styles.rowTitle}>{props.name}</Text>
                        <Text style={styles.rowText}>{props.address}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderEventRow(props, sectionId, rowId) {
        
        //console.log("renderEventRow", sectionId, rowId, props);
        //var avatar = props["@files:avatar.avatarMedium"];
        //var avatar = (props.event.avatar) ? props.event.avatar.avatarMedium : null;
        //var icon = avatar ? {uri: avatar.url} : require("./assets/avatar--event.png");
        var icon = props.imageUrl ? props.imageUrl : require("./assets/avatar--event.png");
        //console.log(new Date(props.startsAt.date).toLocaleString(), "to", new Date(props.endsAt.date).toLocaleString());
        return (
            <TouchableOpacity onPress={() => {  
                console.log("rowPress", props);
                this.props.navigation.navigate("details", {info: props.place});
            }}>
                <View key={rowId} style={styles.row}>
                    <Image style={styles.rowImage} source={icon}/>
                    <View style={styles.rowInfo}>
                        <Text style={styles.rowPlace}>{props.place.name}</Text>
                        <Text style={styles.rowTitle}>{props.name}</Text>
                        <Text style={styles.rowTime}>{props.ruleDescription}</Text>
                        <Text style={styles.rowText}>{props.shortDescription}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
        
    }
}

const styles = StyleSheet.create({
    list: {},
    row: {
        padding: 8,
        flex: 1,
        flexDirection: "row",
    },
    rowImage: {
        width: 72,
        height: 72,
        backgroundColor: "#ccc"
    },
    rowInfo: {
        flex: 1,
        paddingLeft: 8
    },
    rowTitle: {
        color: "#111",
        fontSize: 16,
        fontWeight: "500"
    },
    rowPlace: {
        color: Theme.navBarColor,
        fontSize: 14,
        fontWeight: "500"
    },
    rowTime: {
        color: "#444",
        fontSize: 14,
        fontWeight: "500"
    },
    rowText: {
        color: "#666",
        fontSize: 13
    },
    seperator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E'
    }
});
