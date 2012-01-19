var ListtaskCommandAssistant = function() {
};

ListtaskCommandAssistant.prototype.run = function(future) {
    console.log("***************Listtask "+ this.controller.args.name);
    var authCode = '1/fjNQz1TXnWMlLvZerhAo2SWZs3mFvLkKg02PZGUXhwM'
    var DefaultTaskListUrl = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks';
    var libraries = MojoLoader.require({ name: "foundations", version: "1.0" });
    var AjaxCall = libraries["foundations"].Comms.AjaxCall;
    var options = { "customRequest":"GET", "headers": [{'Authorization':'OAuth '+authCode}]};
    return AjaxCall.get(DefaultTaskListUrl, options);
    future.then(function(future2) {
            if (future2.result.status == 200) { // 200 = Success
                Mojo.Log.info('Ajax get success ' + JSON.stringify(future2.result));
                future2.result = {reply: "Listtask " + future2.result};
            }
            else {
                Mojo.Log.info('Ajax get fail');
                future2.result = {reply: "Listtask ERROR!!!!!"};
            }
        });
};
