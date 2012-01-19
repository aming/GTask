function StageAssistant() {
    /* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the stage is first created */
    this.controller.pushScene("tasklist");
};

StageAssistant.prototype.handleCommand = function(event) {
    var currentScene = this.controller.activeScene();
    if(event.type == Mojo.Event.command) {
        switch(event.command) {
        case 'do-login':
            this.controller.swapScene("oauth");
            break;
        case 'do-logout':
            var authCodeCookie = new Mojo.Model.Cookie('authCodeObj');
            authCodeCookie.remove();
            break;
        }
    }
};
