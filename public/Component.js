sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("FeatureUI.Component", {

		metadata : {
			rootView : "FeatureUI.FeatureUI",
			dependencies : {
				libs : [
					"sap.m",
					"sap.ui.layout"				
				]
			},
			config : {
				sample : {
					files : [
						"FeatureUI.view.xml",
						"FeatureUI.controller.js",
						"FeatureUI.index.html"
					]
				}
			}
		}
	});

	return Component;

});