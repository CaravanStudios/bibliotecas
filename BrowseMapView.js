import React, {Component} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Platform} from "react-native";
import MapView from "react-native-maps";

import {LS, FAIcon} from "./Common"

export default class BrowseMapView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            places: [],
            regionChanged: false
        };
        this.region = null;
    }

    static defaultProps = {
        /*
        initialRegion: { // Brazil
            longitudeDelta: 12.047738249632417,
            latitude: -21.84178562199199,
            longitude: -47.907225035402554,
            latitudeDelta: 17.92033406464704
        }
        */
    };

    componentDidMount() {
        //console.log("componentDidMount", this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true; // TODO: Optimize?
    }

    render() {
        //console.log("props", this.props);
        return (
            <View style={{flex: 1}}>
                <MapView
                    style={{flex: 1}}
                    //onRegionChange={(region)=>this.onRegionChange(region)}
                    onRegionChangeComplete={(region) => this.onRegionChange(region)}
                    initialRegion={this.props.initialRegion}
                    showsUserLocation={true}
                    //showsMyLocationButton={false}
                    ref={(ref) => this.mapView = ref}
                >
                    {this.props.places.map(marker => (
                        
                        <MapView.Marker key={marker.placeId}
                                        coordinate={marker.coordinate}
                                        image={marker.markerImage}
                                        anchor={{x: 0, y: 1}}
                                        centerOffset={{x: -60, y: 60}}
                                        pinColor={this.pinColors[marker.type.Id]}
                                        onCalloutPress={() => this.onCalloutPress(marker)}
                                        title={marker.pinTitle}
                                        description={marker.description}
                        >
                        
                        </MapView.Marker>
                    ))}
                </MapView>

                {Platform.OS === "ios" ? (
                    <TouchableOpacity style={styles.currentLocationButton} onPress={() => this.showCurrentLocation()}>
                        <FAIcon name="location-arrow" size={30} color="black"/>
                    </TouchableOpacity>) : null}

                <View style={[styles.reloadOuter, {zIndex: this.state.regionChanged ? 99 : -1}]}>
                    <TouchableOpacity style={styles.reloadInner} onPress={() => this.reload()}>
                        <Text style={styles.reloadText}>{LS("Redo Search In This Area")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onCalloutPress(marker) {
        console.log("onCalloutPress", marker);
        this.props.navigation.navigate("details", {info: marker});
    }

    onRegionChange(region) {
        var r = this.region;
        console.log("onRegionChange", region, r);
        if (r && !this.state.regionChanged && this.props.firstLoadDone && !this.props.loading) {
            if ((r.latitude !== region.latitude) || (r.longitude !== r.longitude) ||
                (r.latitudeDelta !== region.latitudeDelta) || (r.longitudeDelta !== region.longitudeDelta)) {
                console.log("Region changed!");
                this.setState({regionChanged: true});
            }
        }
        this.region = region;
    }

    clearRegionChanged() {
        this.setState({regionChanged: false});
    }

    setRegion(region) {
        this.region = region;
        this.mapView.animateToRegion(region);
    }

    reload() {
        this.props.reload(this.region);
        //this.setState({regionChanged: false});
    }

    showCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                //var l = JSON.stringify(position);
                console.log("showCurrentLocation", position);
                var location = position.coords;
                this.mapView.animateToRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                });
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    pinColors = ["black", "blue", "red", "green", "orange", "purple"];

}

const styles = StyleSheet.create({
    reloadOuter: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    reloadInner: {
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
    reloadText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
    currentLocationButton: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 10,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        backgroundColor: "#0000"
    },
});
