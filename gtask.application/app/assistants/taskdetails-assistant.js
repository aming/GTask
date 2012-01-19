function TaskdetailsAssistant(item) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
    this.item = item;
    Mojo.Log.info("Display task details: "+this.item.title);
}

TaskdetailsAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
    this.titleTxt = this.controller.get("titleTxt") || '';
    this.noteTxt = this.controller.get("noteTxt") || '';
    this.taskdetails_datepickerDue = this.controller.get("taskdetails_datepickerDue");
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
    this.titleTxt.innerHTML = this.item.title;
    this.controller.setupWidget("titleTxt",
        {
            focusMode : Mojo.Widget.focusSelectMode,
            maxLength : 30,
            holdToEdit: true,
        },
        { value: this.item.title}
    );
    this.controller.setupWidget("noteTxt",
        {
            multiline: true,
            growWidth: true,
            limitResize: true,
        },
        {
            value: this.item.notes,
            disabled: true,
        }
    );
    if (this.item.due)
    {
        this.controller.setupWidget("taskdetails_datepickerDue",
            this.attributes = {
                label: 'Due',
            },
            this.model = {
                date: new Date(this.item.due),  
            }
        ); 
    };

    /* add event handlers to listen to events from widgets */
};

TaskdetailsAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

TaskdetailsAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

TaskdetailsAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};
