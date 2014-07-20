// Name: GameControllerModel
// Author: Josh Bass
// Description: This implementation of a backbone model handles polling 1 or more
// game controllers for the user and delivering information about the devices inputs
// in such a way that specific buttons or axes can be registered for by the user.
// All aspects of how the information is collected by this model are configurable such
// as the pollTime, clickTime and the axis/button maps that the model uses to sort the 
// information obtained by the device.
var GameControllerModel = Backbone.Model.extend({
	
	defaults: {
   		pollTime: 50,
   		clickTime: 500,
   		buttonMap: {
			0: "A",
			1: "B",
			2: "X", 
			3: "Y",
			4: "LB",
			5: "RB",
			6: "Select",
			7: "Start",
			8: "LS",
			9: "RS"
		},
		axisMap: {
			0: "LSY",
			1: "LSX",
			2: "RSY",
			3: "RSX",
			4: "LTRT",
			5: "DPX",
			6: "DPY"
		},

		axisMapWebkit: {
			0: "LSX",
			1: "LSY",
			2: "RSX",
			3: "RSY",
			4: "LTRT",
			5: "DPX",
			6: "DPY"
		}
  	},

	initialize: function(options){
		
		var self = this;
		
		if (!options){
			options = {};
		}
		if (options.pollTime){
			this.set("pollTime", options.pollTime);
		}
		if (options.clickTime){
			this.set("clickTime", options.clickTime);
		}
		if (options.axisMap){
			this.set("axisMap", options.axisMap);
		}
		if (options.buttonMap){
			this.set("buttonMap", options.buttonMap);
		}

		var webkitSupport = !!navigator.webkitGetGamepads || 
	   	!!navigator.webkitGamepads;
		var isFireFox = (navigator.userAgent.indexOf('Firefox/') != -1);
		self.gamepadSupportAvailable = (webkitSupport || isFireFox);
		if (webkitSupport && !options.axisMap){
			//do not overwrite the axis map if the user specified their own
			this.set("axisMap", this.get("axisMapWebkit"));
		}

		self.lastButtons = {};	

		if (self.gamepadSupportAvailable){
			self.startPollingDevice();
		}
	},
	
	
	startPollingDevice: function(){
		
		var self = this;
		
		if (self.gamepadSupportAvailable){
		
			self.controllerPollingId = window.setInterval(function(){
				
				if (navigator.getGamepads().length > 0){
				
					for (var padId = 0; padId < navigator.getGamepads().length; padId++){
						
						var gamepad = navigator.getGamepads()[padId];
						if (gamepad){
							for (var i = 0; i < gamepad.axes.length; i++){

								var axis = gamepad.axes[i];
								self.set(self.get("axisMap")[i], axis);
							}		    	
					        self.handleButtons(gamepad, padId);
				    	}
			    	}
			    
				}else{
					self.stopPolling();
					self.checkForReconnect();
				}
		        
			}, this.get("pollTime"));
		}
	},
	
	
	stopPolling: function(){
		
		var self = this;	
		if (self.controllerPollingId){
			
			window.clearInterval(self.controllerPollingId);
		}			
	},
	
	
	checkForReconnect: function(){
		
		var self = this;
		
		self.reconnectInterval = window.setInterval(function(){
			
			//a gamepad has been detected if we pass this check
			if (navigator.getGamepads().length > 0){
				self.startPollingDevice();
				window.clearInterval(self.reconnectInterval);
			}
		}, 5000);
	},
	
	handleButtons: function(gamepad, id){
		
		var self = this;
		for (var i = 0; i < gamepad.buttons.length; i++){

			self.buttonPressed(this.get("buttonMap")[i], i, gamepad.buttons[i].value, id);

			if (self.lastButtons[i] && self.lastButtons[i].value == 1 && 
				self.lastButtons[i].value != gamepad.buttons[i].value){
				
				//Before we send a click event we must determine if this button has
				//been held down longer than the specified click time.
				var currentTime = Date.now();
				if (self.lastButtons[i].initialClickTime && 
					currentTime - self.lastButtons[i].initialClickTime <= self.get("clickTime")){
					self.buttonClicked(this.get("buttonMap")[i], i, id);
				}
			}

			if (!self.lastButtons[i]){
				self.lastButtons[i] = {value: gamepad.buttons[i].value};
			}else{
				self.lastButtons[i].value = gamepad.buttons[i].value
			}

			//This logic is meant to be used to keep track of the exact time
			//when a specific controller button was first pushed
			if (self.lastButtons[i].value){ 
				if (!self.lastButtons[i].initialClickTime){
					self.lastButtons[i].initialClickTime = Date.now();
				}
			}else{
				self.lastButtons[i].initialClickTime = undefined;
			}
		}
	},
	
	buttonClicked: function(button, index, gamepadId){
		
		//one time event, dont store in model and want to notify regardles of whether state has changed...
		this.trigger("change:buttonClick", {button: button, buttonIndex: index, 
			gamepadId: gamepadId});
	},

	buttonPressed: function(button, index, isPressed, gamepadId){

		if (this.lastButtons[index] && isPressed != this.lastButtons[index].value){
			this.set("buttonPress", {button: button, butonIndex: index, gamepadId: 
				gamepadId, isPressed: (isPressed == 1 ? true : false)}); 
		}
	},
		
	destroy: function(){
		
		this.stopPolling();
	},
	
});

