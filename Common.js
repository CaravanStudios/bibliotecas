const DEBUG = true;

import React, {NativeModules, Platform} from "react-native";

import {Strings} from "./lang/pt-br"
import {Theme} from "./Theme"
import FAIcon from "react-native-vector-icons/FontAwesome";

module.exports.DEBUG = DEBUG;
module.exports.Theme = Theme;
module.exports.FAIcon = FAIcon;

function getLocale() {
    var locale = DEBUG ? "en-us" : "pt-br";
    /*
    if (Platform.OS === "ios") {
        locale = NativeModules.SettingsManager.settings.AppleLocale || "";
    } else {
        locale = NativeModules.I18nManager.localeIdentifier || "";
    }
    */
    console.log("getLocale", locale);
    return locale;
}

var _locale = getLocale();

// TODO: Get device locale and auto choose language
module.exports.LS = function(text) {
    if (!_locale.startsWith("pt")) {
        return text;
    } else {
        var s = Strings[text];
        return s && s.length ? s : text;
    }
};


/*
import {Platform, NativeModules} from "react-native";

let langRegionLocale = "en_US";

// If we have an Android phone
if (Platform.OS === "android") {
    langRegionLocale = NativeModules.I18nManager.localeIdentifier || "";
} else if (Platform.OS === "ios") {
    langRegionLocale = NativeModules.SettingsManager.settings.AppleLocale || "";
}

// "en_US" -> "en", "es_CL" -> "es", etc
let languageLocale = langRegionLocale.substring(0, 2); // get first two characters
*/