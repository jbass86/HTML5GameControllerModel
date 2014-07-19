
var gamepadModel = new GameControllerModel();

gamepadModel.on("change:LSX", function(model, value){

	console.log("LS x axis changed");
	console.log(value);

}, this);

gamepadModel.on("change:LSY", function(model, value){

	console.log("LS y axis changed");
	console.log(value);

}, this);

gamepadModel.on("change:RSX", function(model, value){

	console.log("RS x axis changed");
	console.log(value);

}, this);

gamepadModel.on("change:RSY", function(model, value){

	console.log("RS y axis changed");
	console.log(value);

}, this);

gamepadModel.on("change:LT", function(model, value){

	console.log("LT axis changed");
	console.log(value);

}, this);

gamepadModel.on("change:DPX", function(model, value){

	console.log("DPX axis changed");
	console.log(value);

}, this);

gamepadModel.on("change:DPY", function(model, value){

	console.log("DPY axis changed");
	console.log(value);

}, this);




gamepadModel.on("change:buttonClick", function(value){

	console.log("A button was clicked");
	console.log(value.button);
}, this);

gamepadModel.on("change:buttonPress", function(model, value){

	console.log(value);
	console.log(value.button + " button was " + (value.isPressed ? "Pressed" : "Released"));
}, this);