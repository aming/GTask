function AddtaskAssistant() {
    this.gtask = new GtaskAssistant();
};

AddtaskAssistant.prototype.txtTaskNameModel = { value : "" };
AddtaskAssistant.prototype.txtTaskNoteModel = { value : "" };
AddtaskAssistant.prototype.datepickDueModel = { date : new Date() };

AddtaskAssistant.prototype.setup = function() {
    this.controller.setupWidget("addtask_txtTaskTitle",
        {
            hintText: 'Enter the Title',
            focusMode : Mojo.Widget.focusSelectMode,
            maxLength : 30,
        },
        this.txtTaskNameModel
    );
    this.controller.setupWidget("addtask_txtTaskNote",
        {
            hintText: 'Enter the Notes',
            multiline: true,
            growWidth: true,
            limitResize: true,
        },
        this.txtTaskNoteModel
    );
    /*
    this.controller.setupWidget("addTask_datepickerDue",
        this.attributes = {
            label: 'Due',
        },
        this.datepickDueModel
    );
    */
    this.controller.setupWidget("addtask_btnAdd",
        {},
        {label : "Add", buttonClass : "affirmative"}
    );
    Mojo.Event.listen(this.controller.get("addtask_btnAdd"), Mojo.Event.tap,
        this.addTask.bind(this)
    );
};

AddtaskAssistant.prototype.addTask = function() {
    if(this.txtTaskNameModel.value.strip() != "") {
        var JSONObject = {
            title: this.txtTaskNameModel.value, 
            notes: this.txtTaskNoteModel.value,
        };
        if (this.datepickDueModel.date)
        {
            var date = this.datepickDueModel.date;
            //JSONObject.due = date.getFullYear()+'-'date.getMonth()+1+'-'+date.getDate()+"T00:00:00.000Z";
        };
        this.gtask.createTask(JSONObject, this.createTaskListSuccess.bind(this), this.taskListFail.bind(this));
        Mojo.Controller.stageController.popScene();
    } else {
        Mojo.log.info("I'm sorry but you must enter a name for this Task.");
    }
};

AddtaskAssistant.prototype.createTaskListSuccess = function(successData){
    this.logInfo("Success TaskList");
};

AddtaskAssistant.prototype.taskListFail = function(data){
    Mojo.log.info("Fail TaskList::" + data.status +"--" + data.responseText);
};
