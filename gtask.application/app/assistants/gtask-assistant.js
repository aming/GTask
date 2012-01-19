function GtaskAssistant() {
    this.DefaultTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    this.DefaultTaskListUrl = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks';
    this.authCodeCookie = new Mojo.Model.Cookie('authCodeObj');
};

GtaskAssistant.prototype.getAuthCode = function() {
    var currTime =  Math.round(new Date().getTime() / 1000);
    this.authCodeObj = this.authCodeCookie.get();
    if (!this.authCodeObj) {
        Mojo.Log.info("authCodeObj is undefined. Push oauth Scene");
        Mojo.Controller.stageController.pushScene('oauth');
    };
    if ((this.authCodeObj.expiresIn > currTime) &&
        (this.authCodeObj.accessToken))
        {
        Mojo.Log.info("Not expired "+this.authCodeObj.expiresIn - currTime+" authCode "+this.authCodeObj.accessToken+" found.");
        return this.authCodeObj.accessToken;
    };
    if (!this.authCodeObj.refreshToken) {
        authCodeResult = this.createAccessToken(this.authCodeObj.authCode);
    } else {
        authCodeResult = this.updateAccessToken(this.authCodeObj.refreshToken);
    };
    if (!authCodeResult) {
        return '';
    } else {
        if (authCodeResult.refresh_token) {
            this.authCodeObj.refreshToken = authCodeResult.refresh_token;
            Mojo.Log.info("Refresh Token "+this.authCodeObj.refreshToken+" found.");
        };
        this.authCodeObj.accessToken = authCodeResult.access_token;
        this.authCodeObj.expiresIn = currTime + authCodeResult.expires_in;
        Mojo.Log.info("new AuthCode "+this.authCodeObj.accessToken+" expire in "+this.authCodeObj.expiresIn);
        this.authCodeCookie.put(this.authCodeObj);
        return authCodeObj.accessToken;
    };
};

GtaskAssistant.prototype.createAccessToken = function(authCode) {
    formString = 'client_id=832925981394.apps.googleusercontent.com&client_secret=V5umlnnPvpcMMmlBabWozBWR&redirect_uri=urn:ietf:wg:oauth:2.0:oob&grant_type=authorization_code&code='+authCode;
    console.log("Get Auth Code:"+formString);
    var client = new XMLHttpRequest();
    client.open("POST", this.DefaultTokenUrl, false);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    client.send(formString);
    if (client.status == 200) {
        // return result == {"access_token","token_type","expires_in","refresh_token"}
        console.log("client response:"+client.responseText);
        jsonObj = eval('('+client.responseText+')');
        return jsonObj;
    } else {
        Mojo.Log.info("Failed:"+client.responseText);
        return null;
    }
};
GtaskAssistant.prototype.updateAccessToken = function(refreshToken) {
    formString = 'client_id=832925981394.apps.googleusercontent.com&client_secret=V5umlnnPvpcMMmlBabWozBWR&grant_type=refresh_token&refresh_token='+refreshToken;
    console.log("Get Access Token:"+formString);
    var client = new XMLHttpRequest();
    client.open("POST", this.DefaultTokenUrl, false);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    client.send(formString);
    if (client.status == 200) {
        // return result == {"access_token","token_type","expires_in"}
        console.log("Client response:"+client.responseText);
        jsonObj = eval('('+client.responseText+')');
        return jsonObj;
    } else {
        Mojo.Log.info("Failed:"+client.responseText);
        return null;
    }
};

GtaskAssistant.prototype.getTaskList = function ( successCB, failureCB){
    authCode = this.getAuthCode();
    console.log("Get Task List::authCode::"+authCode);
    if (authCode) {
        this.taskListRestclient = new RestClient(this.DefaultTaskListUrl, authCode);
        this.taskListRestclient.retrive(successCB, failureCB);
    } else {
        failureCB({status: "500"});
    };
};

GtaskAssistant.prototype.createTask = function (taskInJson, successCB, failureCB){
    authCode = this.getAuthCode();
    console.log("CreateTask:"+taskInJson.to_s);
    if (authCode) {
        this.taskListRestclient = new RestClient(this.DefaultTaskListUrl, authCode);
        this.taskListRestclient.create(taskInJson, successCB, failureCB);
    } else {
        failureCB({status: "500"});
    };
};

GtaskAssistant.prototype.deleteTask = function (taskId, successCB, failureCB){
    authCode = this.getAuthCode();
    console.log("Delete Task::"+taskId);
    if (authCode) {
        this.taskListRestclient = new RestClient(this.DefaultTaskListUrl, authCode);
        this.taskListRestclient.delete(taskId, successCB, failureCB);
    } else {
        failureCB({status: "500"});
    };
};

