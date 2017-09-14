import React, {Alert, Linking} from "react-native";

import {LS} from "./Common";

export class MapMath {

    //This function takes in latitude and longitude of two location and returns the distance between them (as the crow flies in km)
    static distance(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = this.toRad(lat2 - lat1);
        var dLon = this.toRad(lon2 - lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Converts numeric degrees to radians
    static toRad(Value) {
        return Value * Math.PI / 180;
    }

    static metersToDelta(lat, lng, metersNorth, metersEast) {
        var r = 6378137;
        var dLat = metersNorth / r;
        var dLng = metersEast / (r * Math.cos(Math.PI * lat / 180));
    }

}

export default class Util {

    static openLink(url) {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log("openLink - Can't handle url: ", url);
                Alert.alert(LS("Can't Open App"), LS("Not supported: ") + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => {
            console.log("openLink - An error occurred: ", err);
            Alert.alert(LS("Can't Open App"), LS("An error occurred: ") + err);
        });
    }

    static eventTimeString(event) {
        let startDate = this.dateFromString(event.startsAt.date);
        let endDate = event.endsAt.date ? this.dateFromString(event.endsAt.date) : null;
        let startDay = startDate.toLocaleDateString();
        let endDay = endDate.toLocaleDateString();
        let s = startDay + " " + this.timeString(startDate); //" " + startDate.getHours() + ":" + ("00" + startDate.getMinutes()).slice(-2); //startDate.toLocaleTimeString();
        if (endDate) {
            s += " " + LS("to");
            if (startDay !== endDay) s += " " + endDay;
            s += " " + this.timeString(endDate); //endDate.getHours() + ":" + ("00" + endDate.getMinutes()).slice(-2); //endDate.toLocaleTimeString();
        }
        return s;
    }

    static timeString(date) {
        let h = date.getHours();
        let ampm = LS("AM");
        if (h > 12) {
            h -= 12;
            ampm = LS("PM");
        }
        return "" + h + ":" + ("00" + date.getMinutes()).slice(-2) + " " + ampm;
    }

    static dateFromString(dateStr) {
        let components = dateStr.split(/[\s\/:.-]+/);
        return new Date(components[0], components[1], components[2], components[3], components[4]);
    }

}
