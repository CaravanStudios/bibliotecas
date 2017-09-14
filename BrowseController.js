import React, {Component} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    StyleSheet,
    Animated,
    Alert,
    ActivityIndicator,
    Platform
} from "react-native";

import {LS, Theme, FAIcon, DEBUG} from "./Common"
import {MapMath} from "./Util"
import DataSource from "./DataSource"
import App from "./App"

import BrowseMapView from "./BrowseMapView"
import BrowseListView from "./BrowseListView"

const kUseCurrentLocation = DEBUG ? false : true;

const kMapMode = 0;
const kListMode = 1;

const kShowModeSpaces = 1;
const kShowModeEvents = 2;

export default class BrowseController extends Component {

    constructor(props) {
        super(props);
        module.exports.Browse = this;
        BrowseController.instance = this;
        this.state = {
            firstLoadDone: false, // Just use loading instead?
            loading: false,
            browseMode: kMapMode,
            listVisible: false,
            listAnimate: new Animated.Value(0.0),
            showMode: kShowModeSpaces,
            places: [],
            events: [],
            items: [],
            search: null
        };
        this.region = {
            latitude: -23.5413271705055,
            longitude: -46.6475415229797,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
        };
        this.search = null; // TEST
    }

    static navigationOptions = ({navigation, screenProps}) => {
        console.log("navigationOptions", navigation, screenProps);
        const params = navigation.state.params || {};
        const mode = params.mode || false;
        return {
            title: LS("Bibliotecas"),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => App.getApp().showMenu()}
                    style={Theme.styles.navBarLeftButton}>
                    <FAIcon name="bars" size={18} color={Theme.navBarTextColor}/>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        console.log(navigation);
                        let self = BrowseController.instance;
                        if (self.state.browseMode === kMapMode) {
                            navigation.setParams({rightButtonTitle: LS("Map")});
                            Animated.timing(self.state.listAnimate, {toValue: 1.0, duration: 300}).start();
                            self.setState({browseMode: kListMode, listVisible: true});
                        } else {
                            navigation.setParams({rightButtonTitle: LS("List")});
                            Animated.timing(self.state.listAnimate, {
                                toValue: 0.0,
                                duration: 300
                            }).start(() => self.setState({listVisible: false}));
                            self.setState({browseMode: kMapMode});
                        }
                    }}
                    style={Theme.styles.navBarRightButton}>
                    <Text style={Theme.styles.navBarButtonText}>
                        {params.rightButtonTitle}
                    </Text>
                </TouchableOpacity>
            ),
        };
    };

    componentWillMount() {
        console.log("BrowseController componentWillMount");
        this.props.navigation.setParams({rightButtonTitle: LS("List")});
    }

    componentDidMount() {
        console.log("BrowseController componentDidMount");

        if (kUseCurrentLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    var location = position.coords;
                    this.region = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    };
                    this.fetchItems();
                    if (this.browseMapView) this.browseMapView.setRegion(this.region);
                },
                (error) => alert(JSON.stringify(error)),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
            );
        } else {
            // For testing;
            this.fetchItems();
        }

        // Testing
        /*
        DataSource.fetchData("space/findByEvents", {
            "@from": "2016-1-1",
            "@to": "2017-12-31",
            //"@select": "id,name,location"
            //"@select": "id,location,name,public,shortDescription,longDescription,createTimestamp,status,_type,isVerified,updateTimestamp,eventOccurrences,parent,_children,owner,__metadata,__files,__agentRelations,__termRelations,__sealRelations,emailPublico,emailPrivado,telefonePublico,telefone1,telefone2,acessibilidade,acessibilidade_fisica,capacidade,endereco,En_CEP,En_Nome_Logradouro,En_Num,En_Complemento,En_Bairro,En_Municipio,En_Estado,horario,criterios,site,facebook,twitter,googleplus,geoEstado,geoMunicipio,num_sniic,cnpj,esfera,esfera_tipo,certificado"
            //"@select": "id,_type,name,shortDescription,longDescription,rules,createTimestamp,status,isVerified,updateTimestamp,occurrences,owner,project,__metadata,__files,__agentRelations,__termRelations,__sealRelations,subTitle,registrationInfo,classificacaoEtaria,telefonePublico,preco,traducaoLibras,descricaoSonora,site,facebook,twitter,googleplus,num_sniic"
            "@select": "id,name,shortDescription,longDescription,rules,createTimestamp,status,isVerified,updateTimestamp,occurrences,owner,project,subTitle,registrationInfo,classificacaoEtaria,telefonePublico,preco,traducaoLibras,descricaoSonora,site,facebook,twitter,googleplus,num_sniic"
            + "location,public,status,eventOccurrences,parent,owner,emailPublico,emailPrivado,telefonePublico,telefone1,telefone2,acessibilidade,acessibilidade_fisica,capacidade,endereco,En_CEP,En_Nome_Logradouro,En_Num,En_Complemento,En_Bairro,En_Municipio,En_Estado,horario,criterios,site,facebook,twitter,googleplus,geoEstado,geoMunicipio,num_sniic,cnpj,esfera,esfera_tipo,certificado"
        }, null, true);
        */
        /*
        DataSource.fetchData("event/find", {
            //"@from": "2017-1-1",
            //"@to": "2017-12-31",
            "@select": "id,_type,name,shortDescription,longDescription,rules,createTimestamp,status,isVerified,updateTimestamp,occurrences,owner,project,__metadata,__files,__agentRelations,__termRelations,__sealRelations,subTitle,registrationInfo,classificacaoEtaria,telefonePublico,preco,traducaoLibras,descricaoSonora,site,facebook,twitter,googleplus,num_sniic"
            + "id,name,shortDescription,longDescription,rules,createTimestamp,status,isVerified,updateTimestamp,occurrences,owner,project,subTitle,registrationInfo,classificacaoEtaria,telefonePublico,preco,traducaoLibras,descricaoSonora,site,facebook,twitter,googleplus,num_sniic"
            + "location,public,status,eventOccurrences,parent,owner,emailPublico,emailPrivado,telefonePublico,telefone1,telefone2,acessibilidade,acessibilidade_fisica,capacidade,endereco,En_CEP,En_Nome_Logradouro,En_Num,En_Complemento,En_Bairro,En_Municipio,En_Estado,horario,criterios,site,facebook,twitter,googleplus,geoEstado,geoMunicipio,num_sniic,cnpj,esfera,esfera_tipo,certificado",
            "@order": "name ASC",
            //'project': 'EQ(@Project:4)'
        }, null, true);
        */
        /*
        DataSource.fetchData("space/find", {
            "@keyword": "Castro",
            "@select": "id,name,location"
        }, null, true);
        */
        /*
        DataSource.fetchData("space/describe", null, function(data) {
            let s = "Space ";
            for (let item in data) s += item + ",";
            console.log(s);
        });
        */
        /*
        DataSource.fetchData("event/describe", null, function(data) {
            let s = "Event ";
            for (let item in data) s += item + ",";
            console.log(s);
        });
        */
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        //Keyboard.dismiss();
        //dismissKeyboard();
    }

    render() {
        //console.log("BrowseController render ", this.state.showMode == kShowModeEvents ? this.state.events : this.state.items);
        return (
            <View style={styles.container}>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <FAIcon style={styles.searchIcon} name="search" size={18}/>
                        <TextInput
                            style={styles.searchInput}
                            onSubmitEditing={(event) => this.onSearch(event)}
                            //value={this.state.search}
                            placeholder={LS("Search for libraries")}
                            underlineColorAndroid="rgba(0, 0, 0, 0)"
                        />
                    </View>
                </View>

                <BrowseMapView style={styles.map}
                               places={this.state.places}
                               navigation={this.props.navigation}
                               initialRegion={this.region}
                               firstLoadDone={this.state.firstLoadDone}
                               reload={this.reload.bind(this)}
                               ref={(ref) => this.browseMapView = ref}/>
                <Animated.View style={[styles.listContainer, {
                    opacity: this.state.listAnimate,
                    zIndex: this.state.listVisible ? 101 : -1
                }]}>
                    <BrowseListView style={styles.list}
                                    items={this.state.showMode == kShowModeEvents ? this.state.events : this.state.items}
                                    mode={this.state.showMode}
                                    navigation={this.props.navigation}
                    />
                </Animated.View>

                {this.state.loading ? (
                    <View style={styles.loading} pointerEvents="none">
                        <View style={styles.loadingInner}>
                            <ActivityIndicator size="small" color="#000"/>
                            <Text style={styles.loadingText}>{LS("Loading...")}</Text>
                        </View>
                    </View>) : null}

            </View>
        );
    }

    onSearch(event) {
        console.log("onSearch", event.nativeEvent.text);
        //this.setState({search: event.nativeEvent.text});
        this.search = event.nativeEvent.text;
        this.fetchItems();
    }

    showSpaces() {
        if (this.state.showMode === kShowModeSpaces) return;
        //this.props.navigation.setParams({title: LS("Libraries")});
        this.fetchSpaces();
    }

    showEvents() {
        if (this.state.showMode === kShowModeEvents) return;
        //this.props.navigation.setParams({title: LS("Events")});
        this.fetchEvents();
    }

    fetchItems() {
        if (this.state.showMode === kShowModeEvents) this.fetchEvents();
        else this.fetchSpaces();
    }

    fetchSpaces() {
        this.setState({loading: true, showMode: kShowModeSpaces});
        this.browseMapView.clearRegionChanged();

        var r = this.region; //this.state.location;
        var latDiff = r.latitudeDelta / 2;
        var lngDiff = r.longitudeDelta / 2;
        var params = {
            //"@select": "id,name,location,singleUrl,type,shortDescription,terms,endereco,acessibilidade,site",
            "@select": "id,name,location,type,endereco,acessibilidade",
            "@files": "(avatar.avatarMedium):url",
            "@page": 1,
            "@limit": 100,
            type: "IN(20)", // Public libraries
        };

        var search = this.search; //this.state.search;
        console.log("fetchSpaces search", this.state);
        if (search) {
            // HACK: Trying this out
            console.log("fetchSpaces search", search);
            params["@keyword"] = encodeURIComponent(search.replace(" ", "%"));
        } else {
            params["_geoLocation"] = "GEONEAR(" + r.longitude + "," + r.latitude + ","
                + (MapMath.distance(r.latitude - latDiff, r.longitude - lngDiff,
                    r.latitude + latDiff, r.longitude + lngDiff) * 1000) + ")"
        }

        DataSource.fetchData("space/find", params, (data, error) => {
            if (!error) {
                //console.log("Done", data);
                let len = data.length;
                let list = [], places = [], place, item;
                for (let i = 0; i < len; i++) {
                    item = data[i];
                    if (item.name.length) {
                        var l = item.location;
                        if (l && l.latitude && l.latitude) {
                            // Add info need by map (TODO: check if all this is need still)
                            item.id = String(item.id);
                            item.title = item.name; // Remove?
                            item.coordinate = {
                                latitude: parseFloat(l.latitude),
                                longitude: parseFloat(l.longitude)
                            };
                            places.push(item);
                        }
                        list.push(item);
                    }
                }
                console.log("list", list.length);
                this.setState({places: places, items: list, loading: false, firstLoadDone: true});
            } else {
                console.log("fetchSpaces", error);
                this.setState({loading: false, firstLoadDone: true});
                //Alert.alert("Server Error", error.message,
                //    [{text: 'OK', onPress: () => console.log('OK Pressed!')}]);
            }
        });
    }

// TODO: Combine with fetchLocations()
    fetchEvents() {
        this.setState({loading: true, showMode: kShowModeEvents});
        this.browseMapView.clearRegionChanged();

        var r = this.region; //this.state.location;
        var latDiff = r.latitudeDelta / 2;
        var lngDiff = r.longitudeDelta / 2;
        var params = {
            //"@select": "id,name,location,singleUrl,type,shortDescription,terms,endereco,acessibilidade,site",
            "@select": "id,name,location,type,endereco,acessibilidade,eventOccurrences",
            //"@select": "id,name,shortDescription,longDescription,rules,createTimestamp,status,isVerified,updateTimestamp,occurrences,owner,project,subTitle,registrationInfo,classificacaoEtaria,telefonePublico,preco,traducaoLibras,descricaoSonora,site,facebook,twitter,googleplus,num_sniic"
            //+ "location,public,status,eventOccurrences,parent,owner,emailPublico,emailPrivado,telefonePublico,telefone1,telefone2,acessibilidade,acessibilidade_fisica,capacidade,endereco,En_CEP,En_Nome_Logradouro,En_Num,En_Complemento,En_Bairro,En_Municipio,En_Estado,horario,criterios,site,facebook,twitter,googleplus,geoEstado,geoMunicipio,num_sniic,cnpj,esfera,esfera_tipo,certificado",
            //"@files": "(avatar.avatarMedium):url",
            "@page": 1,
            "@limit": 100,
            //type: "IN(20)", // Public libraries
            //_geoLocation: "GEONEAR(" + r.longitude + "," + r.latitude + ","
            //+ (MapMath.distance(r.latitude - latDiff, r.longitude - lngDiff,
            //    r.latitude + latDiff, r.longitude + lngDiff) * 1000) + ")",
            // Event Dates
            "@from": "2016-1-1",
            "@to": "2017-12-31"
        };

        var search = this.search; //this.state.search;
        console.log("fetchEvents search", this.state);
        if (search) params["@keyword"] = search;

        DataSource.fetchData("space/findByEvents", params, (data, error) => {
            if (!error) {
                console.log("Done", data);
                let len = data.length;
                let list = [], places = [], place, item;
                let events = [];
                for (let i = 0; i < len; i++) {
                    item = data[i];
                    if (item.name.length) {
                        var l = item.location;
                        //console.log(item.name, l);
                        if (l && l.latitude && l.latitude) {
                            // Add info need by map (TODO: check if all this is need still)
                            item.id = String(item.id);
                            item.title = item.name; // Remove?
                            item.coordinate = {
                                latitude: parseFloat(l.latitude),
                                longitude: parseFloat(l.longitude)
                            };
                            places.push(item);
                        }
                        list.push(item);
                    }
                    //console.log("EO", item.eventOccurrences);
                    //if (item.eventOccurrences) {
                    for (let e = 0; e < item.eventOccurrences.length; e++) {
                        events.push(item.eventOccurrences[e]);
                    }
                    //}
                }
                console.log("----------");
                //console.log("Events", events);
                //console.log("list", list);
                //console.log("Places", places);
                console.log("----------");
                this.setState({places: places, events: events, items: list, loading: false, firstLoadDone: true});
            } else {
                console.log("fetchEvents", error);
                this.setState({loading: false, firstLoadDone: true});
                //Alert.alert("Server Error", error.message,
                //    [{text: 'OK', onPress: () => console.log('OK Pressed!')}]);
            }
        });
    }

    reload(region) {
        //console.log("reload", this);
        this.region = region;
        this.fetchItems();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        //flex: 1
    },
    listContainer: {
        position: "absolute",
        top: 44,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white"
    },
    map: {
        flex: 1,
    },
    list: {
        flex: 1
    },

    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 100,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 199
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
    },

    searchContainer: {
        height: 44,
        backgroundColor: Theme.navBarColor,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 7,
        paddingBottom: 7
    },
    searchBar: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 8,
        paddingLeft: 8,
        flexDirection: "row"
    },
    searchIcon: {
        color: "black",
        paddingTop: 5
    },
    ...Platform.select({
        android: {
            searchInput: {
                flex: 1,
                paddingLeft: 8,
                paddingRight: 8,
                bottom: -2
            }
        },
        ios: {
            searchInput: {
                flex: 1,
                paddingLeft: 8,
                paddingRight: 8,
            }
        }
    }),
});
