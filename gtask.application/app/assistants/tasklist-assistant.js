function TasklistAssistant() {
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
}

TasklistAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
    this.listItems = [];
    this.debugContainer = this.controller.get("debugOutput");
    this.tasklist = this.controller.get("tasklist");
    this.logOutputNum = 0;

    /* use Mojo.View.render to render view templates and add them to the scene, if needed */

    /* setup widgets here */
    var loginMenuAttr = {omitDefaultItems: true};
    var loginMenuModel = {
        visible: true,
        items: [
            {label: "Login...", command: 'do-login'},
            {label: "Logout...", command: 'do-logout'},
            Mojo.Menu.editItem,
            Mojo.Menu.prefsItem,
            Mojo.Menu.helpItem
        ]
    };
    this.controller.setupWidget(Mojo.Menu.appMenu, loginMenuAttr, loginMenuModel);

    this.buttonModel = {
        "label" : "Refresh",
        "buttonClass" : "",
        "disabled" : false
    };
    this.controller.setupWidget("MyButton", {}, this.buttonModel);

    this.listAttributes = {
        itemTemplate: "tasklist/mainRowTemplate",  
        listTemplate: "tasklist/mainListTemplate",  
        addItemLabel: "Add New Task...",
        swipeToDelete: true,  
        renderLimit: 40,  
        reorderable: false
    };
    this.listModel = {items: this.listItems};

    this.controller.setupWidget("tasklist", this.listAttributes, this.listModel);  

    /* add event handlers to listen to events from widgets */
    Mojo.Event.listen(this.controller.get("MyButton"), Mojo.Event.tap, this.handleButtonPress.bind(this));
    Mojo.Event.listen(this.tasklist, Mojo.Event.listTap, this.handleListItemDisplay.bind(this));
    Mojo.Event.listen(this.tasklist, Mojo.Event.listDelete, this.handleListItemDel.bind(this));
    Mojo.Event.listen(this.tasklist, Mojo.Event.listAdd, this.handleListItemAdd.bind(this));

    //this.gtask.getTaskList(this.getTaskListSuccess.bind(this), this.taskListFail.bind(this));
};

TasklistAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
    this.gtask = new GtaskAssistant();
    this.gtask.getTaskList(this.getTaskListSuccess.bind(this), this.taskListFail.bind(this));
}

TasklistAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

TasklistAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
    Mojo.Event.stopListening(this.tasklist, Mojo.Event.listTap, this.handleListItemDisplay);
    Mojo.Event.stopListening(this.tasklist, Mojo.Event.listAdd, this.handleListItemAdd);
    Mojo.Event.stopListening(this.tasklist, Mojo.Event.listDelete, this.handleListItemDel);
    Mojo.Event.stopListening(this.controller.get("MyButton"), Mojo.Event.tap, this.handleButtonPress);
};

TasklistAssistant.prototype.getTaskListSuccess = function(successData){
    this.logInfo("Success TaskList");
    var json = successData.responseText.evalJSON();
    var items = json.items;
    this.listItems.clear();
    items.each(function(item) {
            console.log("Add new task"+item.title);
            this.listItems.push(item);
        }.bind(this));
    this.controller.modelChanged(this.listModel);
};

TasklistAssistant.prototype.createTaskListSuccess = function(successData){
    this.logInfo("Success TaskList");
    var json = successData.responseText.evalJSON();
    this.listItems.push( json );
    this.controller.modelChanged(this.listModel);
};

TasklistAssistant.prototype.deleteTaskListSuccess = function(successData){
    this.logInfo("Success Delete TaskList"+ successData);
    //this.controller.modelChanged(this.listModel);
};

TasklistAssistant.prototype.taskListFail = function(data){
    this.logInfo("Fail TaskList::" + data.status +"--" + data.responseText);
};

TasklistAssistant.prototype.serviceSuccess = function(successData){
    this.logInfo("Success Data: " + successData.reply);
};

TasklistAssistant.prototype.serviceFailure = function(failData){
    this.logInfo("Fail Data: " + JSON.stringify(failData));
};

TasklistAssistant.prototype.handleListItemDisplay = function(event) {
    Mojo.Controller.stageController.pushScene("taskdetails", event.item);
    //Mojo.Controller.stageController.pushScene("taskdetails");
};

TasklistAssistant.prototype.handleListItemDel = function(event) {
    Mojo.Log.info("TODO: Item is deleted"+ event.item.id);
    this.gtask.deleteTask(event.item.id, this.deleteTaskListSuccess.bind(this), this.taskListFail.bind(this));
};

TasklistAssistant.prototype.handleListItemAdd = function(event) {
    Mojo.Controller.stageController.pushScene("addtask");
};

TasklistAssistant.prototype.handleButtonPress = function(event) {
    //this.controller.serviceRequest("palm://info.xming.gtask.service", {
    //        method: "listtask",
    //        parameters: {"name": "task"},
    //        onSuccess:this.serviceSuccess.bind(this),
    //        onFailure:this.serviceFailure.bind(this)
    //    });
    this.gtask.getTaskList(this.getTaskListSuccess.bind(this), this.taskListFail.bind(this));
};

TasklistAssistant.prototype.logInfo = function(logText) {
    console.log(logText);
    //this.debugContainer.innerHTML = (this.logOutputNum++) + ": " + logText + "<br\>" + this.debugContainer.innerHTML;      
};

