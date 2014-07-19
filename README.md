HTML5GameControllerModel
========================

Thin wrapper around the html5 gamepad API using backbone to make things alittle easier.



In order to use this library all one needs to is include the javascript and construct "new GameControllerModel()" the object
wherever you want.  Currently its just built around an XBOX360 controller though its technically configurable if you know the button mappings and want to pass them into the model.  I plan to do something like create a list of presets and perheps try to auto detect the controller type if the operator chooses to do so.

Dependancies include backbonejs, underscorejs, and jquery.
