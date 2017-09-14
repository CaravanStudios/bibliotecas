import {LS} from "./Common"
import {App} from "./App"

export default class DataSource {

    static fetchData(path, params, callback, log) {
        var paramStr = "";
        for (var p in params) {
            paramStr += "&" + p + "=" + params[p]
        }

        console.log("fetchData start", path + "?" + paramStr);

        //var _response = null;
        return fetch("http://mapas.cultura.gov.br/api/" + path + "?" + paramStr)
            .then((response) => {
                //console.log("fetch response", path, response);
                if ((response.status >= 200) && (response.status < 300)) {
                    return response.json()
                        .then((data) => {
                            if (log) console.log("fetchData done", path, data);
                            if (callback) callback(data);
                        })
                } else {
                    var errorMsg;
                    if (response.statusText) errorMsg = response.statusText + " (" + response.status + ")";
                    else errorMsg = LS("Status Code ") + response.status;
                    console.log("fetchData status", path, errorMsg);
                    //response.text().then((text) => console.log(text));
                    this.showError(errorMsg, response);
                    if (callback) callback(null, errorMsg);
                }
            })
            .catch((error) => {
                console.log("fetchData catch", path, error);
                this.showError(error.message, response);
                if (callback) callback(null, error.message);
            });
    }

    static showError(errorMsg, response) {
        App.showServerError(errorMsg, response);
    }

    static requestTest() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) return;
            if (request.status === 200) {
                console.log("requestTest success!");
            } else {
                console.log("requestTest error", request);
            }
        };
        request.open("GET", "http://mapas.cultura.gov.br/api/agent/find/?&@select=id,name,location,type,singleUrl,subTitle,shortDescription,terms,project.name,project.singleUrl,num_sniic,endereco,classificacaoEtaria&@files=(avatar.avatarMedium):url&@limit=300&_geoLocation=GEONEAR(-46.6475415229797,-23.5413271705055,70)");
        request.send();
    }

    // Fields (for @select)
    // http://mapas.cultura.gov.br/api/space/describe
    // http://mapas.cultura.gov.br/api/event/describe

    // Queries
    // http://mapas.cultura.gov.br/api/space/find/?&@keyword=esp&@select=id,name,location&@order=name%20ASC
    // http://mapas.cultura.gov.br/api/agent/find/?&@select=id,name,location&@order=name%20ASC
    // http://mapas.cultura.gov.br/api/agent/find/?&@select=id,singleUrl,name,type,shortDescription,terms&@files=(avatar.avatarMedium):url&@page=1&@limit=10&@order=name%20ASC
    // http://mapas.cultura.gov.br/api/space/findOne/?&id=EQ(201781)&@select=id,singleUrl,name,subTitle,type,shortDescription,terms,project.name,project.singleUrl,num_sniic,endereco,acessibilidade&@files=(avatar.avatarSmall):url
    // http://mapas.cultura.gov.br/api/event/findByLocation/?@count=1&&@from=2016-08-25&@to=2016-09-25
    // http://mapas.cultura.gov.br/api/space/findByEvents/?&@from=2016-08-25&@to=2016-09-25&@select=id,name,location&@order=name%20ASC
    // http://mapas.cultura.gov.br/api/space/findOne/?&id=EQ(12202)&@select=id,singleUrl,name,subTitle,type,shortDescription,terms,project.name,project.singleUrl,num_sniic,endereco,endereco,acessibilidade&@files=(avatar.avatarSmall):url
    // http://mapas.cultura.gov.br/api/event/findBySpace/?&@from=2016-08-25&@to=2016-09-25&@select=id,singleUrl,name,subTitle,type,shortDescription,terms,project.name,project.singleUrl,num_sniic,endereco,classificacaoEtaria&@order=name%20ASC&spaceId=12202&@files=(avatar.avatarSmall):url
    // http://mapas.cultura.gov.br/api/agent/find/?&@select=id,name,location,type,singleUrl,subTitle,shortDescription,terms,project.name,project.singleUrl,num_sniic,endereco,classificacaoEtaria&@files=(avatar.avatarMedium):url&@limit=300
    // http://mapas.cultura.gov.br/api/space/find/?&type=IN(20)&@select=id,singleUrl,name,type,shortDescription,terms,endereco,acessibilidade&@files=(avatar.avatarMedium):url&@page=1&@limit=200&_geoLocation=GEONEAR(-46.6475415229797,-23.5413271705055,700)

    // Images
    // http://mapas.cultura.gov.br/assets/br/img/avatar--space.png
    // http://mapas.cultura.gov.br/assets/br/img/avatar--event.png
    // http://mapas.cultura.gov.br/assets/br/img/avatar--agent.png
    // http://mapas.cultura.gov.br/assets/br/img/avatar--project.png

}