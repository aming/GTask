/// RestClient Methods
//var rest_client;if (rest_client == null) rest_client = new RestClient();

function RestClient(url, authCode) {
    this.url = url;
    this.authCode = authCode;
};

RestClient.prototype.create = function (data, successCB, failureCB) {
    JSONstring = JSON.stringify(data);
    new Ajax.Request(this.url, {
            method : "post",
            contentType: 'application/json',
            postBody : JSONstring,
            evalJSON : 'force',
            requestHeaders : {'Authorization': 'OAuth '+ this.authCode},
            onSuccess : successCB,
            onFailure : failureCB
        });
};

RestClient.prototype.retrive = function (successCB, failureCB) {
    new Ajax.Request(this.url, {
            method : "get",
            evalJSON : 'force',
            requestHeaders : {'Authorization': 'OAuth '+ this.authCode},
            onSuccess : successCB,
            onFailure : failureCB
        });
};

RestClient.prototype.update = function (data, successCB, failureCB) {
};

RestClient.prototype.delete = function (id, successCB, failureCB) {
    var delUrl = this.url +'/'+id;
    try {
        var req = new XMLHttpRequest();
        req.open("DELETE", delUrl, true);   
        req.setRequestHeader('Authorization', 'OAuth ' + this.authCode);
        req.send();
        req.onreadystatechange = function () {
            if ((req.status == 200) || (req.status ==  204)) {
                successCB(req);
            } else {
                failureCB(req);
            }
        };
    }
    catch (e) {
        Mojo.Log.error('error:' + e);
        failureCB({'status': '500', 'responseText': e});
    }
};

