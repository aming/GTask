function OauthAssistant() {
    this.authUrl='https://accounts.google.com/o/oauth2/auth';
    this.client_id='832925981394.apps.googleusercontent.com';
    this.scope='https://www.googleapis.com/auth/tasks';
    this.permissionUrl=this.authUrl+'?client_id='+this.client_id+'&scope='+this.scope+'&redirect_uri=urn:ietf:wg:oauth:2.0:oob'+'&response_type=code';
    this.requestTokenMethod='GET';
};

OauthAssistant.prototype.setup = function() {
    var attr = {
        url: this.permissionUrl,
        minFontSize:18,
        virtualpagewidth: this.controller.window.innerWidth,
        virtualpageheight: 32 
    };
    this.controller.setupWidget('browser', attr, {});
    this.browser = this.controller.get('browser');
    Mojo.Event.listen(this.browser, Mojo.Event.webViewTitleUrlChanged, this.titleChanged.bind(this));
};

OauthAssistant.prototype.titleChanged = function(event) {
    var callbackUrl=event.title;
    var responseVars=callbackUrl.split("=");
    code = responseVars[1];
    Mojo.Log.info("URL="+callbackUrl);
    Mojo.Log.info("Code="+code);
    if (code != undefined) {
        var cookie = new Mojo.Model.Cookie("authCodeObj");
        var authCodeObj = cookie.get();
        if (!authCodeObj) {
            authCodeObj = {
                authCode: code,
                refreshToken: '',
                accessToken: '',
                expiresIn: 0
            };
        }
        cookie.put(authCodeObj);
        //this.controller.stageController.pushScene("tasklist");
        //this.controller.stageController.popScene();
        this.controller.stageController.swapScene("tasklist");
    };
};


OauthAssistant.prototype.activate = function(event) {
};

OauthAssistant.prototype.deactivate = function(event) {
};

OauthAssistant.prototype.cleanup = function(event) {
    Mojo.Event.stopListening(browser,Mojo.Event.webViewTitleUrlChanged, this.titleChanged);
};

