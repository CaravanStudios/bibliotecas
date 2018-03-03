import React, {Component} from "react";
import {
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet
} from "react-native";
import MapView from "react-native-maps";
import {Theme} from "./Common"

import {LS, FAIcon} from "./Common"
import Util from "./Util"
import DataSource from "./DataSource"
 
export default class DetailsController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            details: {}
        }
    }

    static navigationOptions = {
        title: LS("Details")
    };

    componentWillMount() {
        let info = this.props.navigation.state.params.info;
        console.log("DetailsController componentWillMount", info);

        DataSource.fetchData("space/findOne", {
            "id": "EQ(" + info.placeId + ")",
            "@select": "id,name,location,singleUrl,type,shortDescription,longDescription,terms,endereco,acessibilidade,site,eventOccurrences.*, eventOccurrences.event.*"
        }, (data) => {
            this.setState({loading: false, details: data});
            console.log('data = ', data);
        }, true); 

        /* Test
        DataSource.fetchData("event/find", {
            "id": "EQ(" + 181 + ")",
            "@select": "id,name,location,singleUrl,type,shortDescription,longDescription,terms,endereco,acessibilidade,site,events,eventOccurrences"
            //"@files": "",
        }, (data) => this.setState({loading: false, details: data}), true);
        */
    }

    componentDidMount() {
        console.log("DetailsController componentDidMount");
    }

    render() {
        console.log("DetailsController render");
        var info = this.props.navigation.state.params.info;
        var details = this.state.details;
        //var avatar = info["@files:avatar.avatarMedium"];
        var icon = info.imageUrl ? info.imageUrl : require("./assets/avatar--space.png");
        var desc = details.longDescription ? details.longDescription : details.shortDescription;
        if (!info.coordinate) {
            info.coordinate = {
                latitude: parseFloat(info.location.latitude),
                longitude: parseFloat(info.location.longitude)
            };
        }
        var initialRegion = {
            latitude: info.coordinate.latitude,
            longitude: info.coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

        console.log('info = ', info);
        console.log('details = ', details);

        return (
            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <Image style={styles.headerImage} source={icon}/>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerText}>{info.name}</Text>
                        <Text>{info.type ? info.type.name : ""}</Text>
                    </View>
                </View>

                {info.coordinate || info.address ? (
                    <TouchableOpacity style={styles.location} onPress={() => this.showMap(info)}>
                        {info.coordinate ? (
                            <MapView style={styles.map} initialRegion={initialRegion} pointerEvents="none">
                                <MapView.Marker key={info.placeId}
                                                coordinate={info.coordinate}
                                                pinColor={Theme.red}
                                >
                                </MapView.Marker>
                            </MapView>
                        ) : null}
                        {info.address ? (
                            <Text style={styles.address}>
                                <FAIcon name="map-marker" size={18}/> {info.address}
                            </Text>
                        ) : null}
                    </TouchableOpacity>
                ) : null}
                {desc && desc.length ? (
                    <View style={styles.row}>
                        <Text style={styles.desc}>{desc.trim()}</Text>
                    </View>
                ) : null}
                {details.site && details.site.length > 0 ? (
                    <TouchableOpacity style={styles.rowCenter} onPress={() => this.showWebsite(details.site)}>
                        <Text style={styles.rowLinkText}>
                            <FAIcon name="globe" size={18}/> {LS("View Web Page")}
                        </Text>
                    </TouchableOpacity>
                ) : null}

                {details.eventOccurrences && details.eventOccurrences.length ? (
                    <View style={styles.row}>
                        <Text style={styles.events}><FAIcon name="calendar" size={18}/> {LS("Events")}</Text>
                        {details.eventOccurrences.map(this.renderEvent, this)}
                    </View>
                ) : null}

                {this.state.loading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator size="small" color="#000"/>
                    </View>
                ) : null}

            </ScrollView>
        )
    }

    renderEvent(item, index) {
        console.log('renderEvent', item);
        if (item.event) {
            var renderEventTitle = item.event.name;
            var renderEventTime = item.rule.description;
            var renderEventDescription = item.event.shortDescription;
            return (
                <View key={index} style={styles.event}>
                    <Text style={styles.eventTitle}>{renderEventTitle}</Text>
                    <Text style={styles.eventTime}>{renderEventTime}</Text>
                    <Text style={styles.eventDesc}>{renderEventDescription}</Text>
                </View>
            )
        }
       
    }

    showMap(info) {
        /*
        Alert.alert(
            LS("View Map"),
            LS("Would you like to view this location in the maps app?"),
            [
                {text: LS("Cancel"), onPress: () => console.log('Cancel Pressed!')},
                {
                    text: LS("OK"), onPress: () => {
                    console.log('OK Pressed!');
                    let url = "http://maps.apple.com/?";
                    if (info.coordinate) url += "ll=" + info.coordinate.latitude + "," + info.coordinate.longitude
                    if (info.endereco) url += "&address=" + encodeURIComponent(info.ex);
                    Util.openLink(url);
                    //Util.openLink("geo:" + info.coordinate.latitude + "," + info.coordinate.longitude);
                }
                },
            ]
        )
        */
        let url;
        if (Platform.OS === 'ios') {
            url = "http://maps.apple.com/?q=" + info.name;
            if (info.coordinate) url += "&ll=" + info.coordinate.latitude + "," + info.coordinate.longitude;
            else if (info.address) url += "&address=" + encodeURIComponent(info.address);
        } else {
            // geo:latitude,longitude?q=query
            // geo:0,0?q=my+street+address
            // geo:0,0?q=latitude,longitude(label)
            url = "geo:";
            if (info.address) url += "0,0?q=" + encodeURIComponent(info.address);
            else url += "0.0?q=" + info.coordinate.latitude + "," + info.coordinate.longitude;
            url += "(" + encodeURIComponent(info.name) + ")";
        }
        console.log("showMap", url);
        Util.openLink(url);
    }

    showWebsite(url) {
        //this.props.navigator.push({id: "web", title: LS("Web Page"), url: url});
        Util.openLink(url);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#fff"
    },

    header: {
        flexDirection: "row",
        paddingBottom: 8,
        marginBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#888"
    },
    headerImage: {
        width: 72,
        height: 72
    },
    headerInfo: {
        flex: 1,
        paddingLeft: 8
    },
    headerText: {
        //flex: 1,
        //paddingLeft: 8,
        fontSize: 18,
        fontWeight: "600",
        color: Theme.blue
    },

    row: {
        paddingBottom: 11,
        marginBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#888",
        minHeight: 40,
    },
    rowCenter: {
        paddingBottom: 11,
        marginBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#888",
        minHeight: 40,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    rowLinkText: {
        color: '#5890FF',
        fontSize: 16,
        fontWeight: "600"
    },

    location: {
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#888",
        backgroundColor: "#fff"
    },
    map: {
        height: 160,
        backgroundColor: "#ccc"
    },
    address: {
        paddingTop: 8
    },
    desc: {},

    events: {
        fontSize: 18,
        fontWeight: "600"
    },
    event: {
        paddingTop: 8
    },
    eventTitle: {
        fontWeight: "600"
    },
    eventTime: {
        fontStyle: "italic"
    },
    eventDesc: {
        paddingTop: 4
    },

    loadingRow: {
        paddingTop: 16,
        paddingBottom: 16,
        justifyContent: "center",
        alignItems: "center"
    },
});