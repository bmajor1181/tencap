/* global vis:true */
sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/m/List',
		'sap/m/Table',
		'sap/m/StandardListItem',
		'sap/ui/core/Fragment',		
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
	    'sap/ui/model/Filter',
	    'sap/ui/model/FilterOperator'        

	], 
	function(jQuery, MessageToast, Button, Dialog, List, Table, StandardListItem, Fragment,Controller, JSONModel, FilterOperator, Filter ) {
	"use strict";
    
	//var SpaceUICoinController = Controller.extend("sap.ui.layout.sample.BlockLayoutDefault.Block", {
	var FeatureUIController = Controller.extend("FeatureUI.FeatureUI", {

		onInit: function () {
			var parent = this;
			var map;
			this.map = map;
			var network;
			this.network = network;
			var hexagon;
			this.hexagon = hexagon;			
			var force;
			this.force = '';			
			var base;
			this.base = '';
			this.calledUrl = window.location.search;
			this.drawnItemsGbl = {};
			this.samSites = {};
			this.sigInt = {};
			this.messages = {};
			this.streets = {};
			this.savedStreetData = {};

			
			this.satMetadataItems = [];
			//Starting here:
			this.graphData = {
				"nodes": [    
				{
				  "id": "Force",
				  "label": "Force",
				  "title": "Force",
				  "group": "1"
				},
				{
				  "id": "Base1",
				  "label": "Base", 
				  "title": "Base",
				  "group": "1"
				},
				{
				  "id": "Base2",
				  "label": "Base",
				  "title": "Base",
				  "group": "1"
				},
				{
				  "id": "Base3",
				  "label": "Base",
				  "title": "Base",
				  "group": "1"
				},
				{
				  "id": "Unit1a",
				  "label": "Unit",
				  "title": "Unit",
				  "group": "1"
				},
				{
				  "id": "Unit1b",
				  "label": "Unit",
				  "title": "Unit",
				  "group": "1"
				},
				{
				  "id": "Unit2a",
				  "label": "Unit",
				  "title": "Unit",
				  "group": "1"
				},
				{
				  "id": "Unit2b",
				  "label": "Unit",
				  "title": "Unit",
				  "group": "1"
				},
				{
				  "id": "Unit3a",
				  "label": "Unit",
				  "title": "Unit",
				  "group": "1"
				},
				{
				  "id": "Unit3b",
				  "label": "Unit",
				  "title": "Unit",
				  "group": "1"
				}				
				],
				"edges": [
				{
				  "from": "Force",
				  "to": "Base1"
				},
				{
				  "from": "Base1",
				  "to": "Unit1a"
				},				{
				  "from": "Base1",
				  "to": "Unit1b"
				},				
				{
				  "from": "Force",
				  "to": "Base2"
				},
				{
				  "from": "Base2",
				  "to": "Unit2a"
				},				{
				  "from": "Base2",
				  "to": "Unit2b"
				},				
				{
				  "from": "Force",
				  "to": "Base3"
				},
				{
				  "from": "Base3",
				  "to": "Unit3a"
				},				{
				  "from": "Base3",
				  "to": "Unit3b"
				},		
				
				]
			};
			//D3 Section initial values
			var margin, width, height, svg, treemap, duration, i, root
			this.margin = margin;
			this.width = width;
			this.height = height;
			this.svg = svg;
			this.treemap = treemap;
			this.duration = duration;
			this.i = i;
			this.root = root;
			this.allData = allData;

			//D3 Search to Graph Force Directed 
			var currentData;
			this.currentData = currentData;
			var svgSTG;
			this.svgSTG = svgSTG;
			var widthSTG = 900;
			var heightSTG = 800;
			this.widthSTG = widthSTG;
			this.heightSTG = heightSTG;			
			var node;
			this.node = node;
			var link;
			var edgepath;
			this.edgepath = edgepath;
			var colors;
			var simulation;
			this.simulation = simulation;
			var cursor;
			var radius = 6;
			this.radius = radius;
			//var g;
			//this.g = g;
			var zoom_handler;				
			
			this.treeData = {
				"name": "All Forces",
				"children": [

					{"name": "Army",
						"children": [
						]},	
					{"name": "Air Force",
						"children": [
						]},	
					{"name": "Navy",
						"children": [
						]},	
					{"name": "Airborne Troops",
						"children": [
						]},	
					{"name": "Strategic Missile Forces",
						"children": [
						]}
						
				]
			};


			//END D3 Initial Values		

			/*
			var url = "/getServices?"
			var oModel = new JSONModel();
			oModel.loadData(url,null,false);
			this.getView().setModel(oModel);
//console.log(oModel);
			*/		
			
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(
			{
				"serviceBranch": [],
				"baseData": [],
				"echelonData": [],
				"equipData": [],
				"searchData": [],
				"docData": [],
				"equipPoly": [],
				"country": [],
				"group": [],
				"hexData":[]

			});
			var url = "/getServices?"
			//oModel.loadData(url,null,false);
			oModel.loadData(url, null, false, "GET", false, false, null);
			//oModel.setProperty("/serviceBranch", data);
			oModel.refresh();
//Try setting pieces
/*
			var data;
			url = "/getGroups?";
			data = oModel.loadData(url, null, false, "GET", false, false, null);
			oModel.setProperty("/groups/", data);
			oModel.refresh();

			url = "/getCountry?";
			data = oModel.loadData(url, null, false, "GET", false, false, null);
			oModel.setProperty("/country/", data);
			oModel.refresh();			
*/			
//END TRy setting pieces			
			this.getView().setModel(oModel);
//console.log(oModel);
			
		},
		//Run something after complete page load
		onAfterRendering: function (){

				var parent = this;
				setTimeout(function(){
					parent.showGraph();
					parent.draw(parent.graphData);
					parent.createMap();
					parent.setData(allData);
					parent.setRoot("#mytree");
					//Try Country List creation here
					parent.getCountryData();
					//parent.getGroupData();
					//parent.root.children.forEach(parent.collapseLevel);
					},1000);

				parent.calledUrl = parent.calledUrl.replace("?", ''); // remove the ?
//console.log(parent.calledUrl); //alerts					
				var qry = parent.calledUrl.split('=')[1];
				qry = unescape(qry);
				var searchField = parent.getView().byId("searchField");
				searchField.setValue(qry);
				var searchPkg = {query: "", refreshButtonPressed: false, clearButtonPressed: false, id: "__xmlview0--searchField"};
				searchPkg.query = searchField.getValue();
				searchField.fireSearch(searchPkg);

				
		},		
		showGraph: function(evt) {
			$("#mynetwork").css('display','block');
			$("#map").css('display','none');
			$("#mytree").css('display','none');
		},
		showMap: function(evt) {
			$("#map").css('display','block');
			$("#mynetwork").css('display','none');
			$("#mytree").css('display','none');
			this.map.invalidateSize()			
		},
		showTree: function(evt) {
			$("#mytree").css('display','block');
			$("#mynetwork").css('display','none');
			$("#map").css('display','none');
			//drawTagCloud(this.words);
		}, 			
		//Listen for Select change and grab correct data
		changedSelSvc: function(oEvent){
			parent = this;
			var oSelect = oEvent.getSource();
			var getSelectedItem = oSelect.getSelectedItem();
			//console.log(getSelectedItem);
			var getSelectedText = getSelectedItem ? getSelectedItem.getText() : null;
			//console.log("Selected Value : " + getSelectedText);
			var qSvcName = getSelectedText;
			parent.force = getSelectedText;
			
			//MessageToast.show('Dont Ever Change LOL');
			//console.log(map);
			//console.log(currPoly);
			if(qSvcName != '')
			{
				this.getBaseData(qSvcName);
			}

		},
		//Ajax call to seed Model with refreshed data
		getBaseData: function(qSvcName){
			var parent = this;
			var url = '/getBases?qSvcName='+qSvcName;
    		$.ajax({
				url: url,
    		    async: true,
    		    success: function(data) {
//console.log(data);
					//parent.drawGraph(data);
					var theData = parent.getView().getModel();
					theData.setProperty("/baseData", data);
					theData.refresh();

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});			
			
		},
		//Listen for Select change and grab correct data
		changedSelBase: function(oEvent){
			parent = this;
			var oSelect = oEvent.getSource();
			var getSelectedItem = oSelect.getSelectedItem();
			//console.log(getSelectedItem);
			var getSelectedText = getSelectedItem ? getSelectedItem.getText() : null;
			var getSelectedVal = oSelect.getSelectedKey();
			//console.log("Selected Value : " + getSelectedText);
			var qBaseName = getSelectedText;
			var qBaseID = getSelectedVal;
			parent.base = getSelectedText;
			//MessageToast.show('Dont Ever Change LOL');
			//console.log(map);
			//console.log(currPoly);
			if(qBaseID != '')
			{
				this.getOrbatData(qBaseID);
			}

		},
		//Ajax call to seed Model with refreshed data
		getOrbatData: function(qBaseID){
			var parent = this;
			var url = '/getOrbatData?qBaseID='+qBaseID;
    		$.ajax({
				url: url,
    		    async: true,
    		    success: function(data) {
					parent.displayDynamicGraph(data);
					var theData = parent.getView().getModel();
					//theData.setProperty("/baseData", data);
					//theData.refresh();

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});			
			
		},
		//Ajax call to seed Model with refreshed data
		getSearchData: function(oEvent){
			var parent = this;

			//var qSearch = this.getView().byId("buttonSearch").getValue();
			var qSearch = oEvent.getParameter("query");
			var url = '/getSearchData?qSearch='+qSearch;
    		$.ajax({
				url: url,
    		    async: true,
    		    success: function(data) {
					//parent.displayDynamicGraph(data);
					var theData = parent.getView().getModel();
					theData.setProperty("/searchData", data);
					//theData.refresh();

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});			
			
		},		
//Draw Graph data starts with initial set
		draw: function(data)
		{
			var parent = this;
			//Hieracrchial options
			var options = {
			  nodes:{
				borderWidth: 2,
				shape: "square",
				color: {
					border: '#000000',
					background: '#000000',
					border:  '#000000',
					highlight: {
						border: '#2B7CE9',
						background: '#D2E5FF'
					}
				}
			  },				
			  layout: {
				hierarchical: {
				  direction: "UD",
				  sortMethod: "directed",
				},
			  },
			  physics: {
				hierarchicalRepulsion: {
						centralGravity: 0,
						springLength: 50,
						nodeDistance: 200
				},
			  },
			};			
			
			var container = document.getElementById('mynetwork');
			
			parent.network = new vis.Network(container, data, options);
			
			
			//Click Experiment
					
			parent.network.on('click',function(params){
				//MessageToast.show(JSON.stringify(params,null,2));
				if(params.nodes.length == 0){
					return false;
				}
//console.log(JSON.stringify(params,null,2));
				
				var myNode = params.nodes[0];
				//console.log(JSON.stringify(myNode,null,2));
				var nodeId = params.nodes[0];
				var ids = this.body.nodes[nodeId].options.data;
			
				if(ids !== ',,,,,,,' && typeof ids !== 'undefined')
				{
	//console.log(ids);
					var idsSplit = ids.split(',');
					ids = idsSplit.join('\',\'');
					ids = '\'' + ids +'\'';

		//INSERT AJAX HERE
					var qEquipIDs = ids;
					var url = '/getEquipData?qEquipIDs='+qEquipIDs;
					$.ajax({
						url: url,
						async: true,
						success: function(data) {
							//console.log(data);
							//BUIDL TABLE WITH PROPS

							var equipArray = [];
							var counter = 0;
							var oTable = new sap.ui.table.Table({
								selectionMode : sap.ui.table.SelectionMode.Multi,
								selectionBehavior: sap.ui.table.SelectionBehavior.Row,
								rowSelectionChange: function(oEvent) {
									  var indices = oEvent.getParameter('rowIndices');
									  for (var i = 0; i < indices.length; i++) {
										var idx = indices[i];
										if (oTable.isIndexSelected(idx)) {
										  var cxt = oTable.getContextByIndex(idx);

										  var path = cxt.sPath;
										  var obj = oTable.getModel().getProperty(path);
										  console.log(obj);       
										}
									  }
								}
							});

							//parent type1 type2 type3 role2
							oTable.addColumn(new sap.ui.table.Column({
								label: new sap.ui.commons.Label({text: "Parent"}),
								template: new sap.ui.commons.TextView({text:"{parent}"}),
							}));
							oTable.addColumn(new sap.ui.table.Column({
								label: new sap.ui.commons.Label({text: "Type 1"}),
								template: new sap.ui.commons.TextView({text:"{type1}"}),
							}));
							oTable.addColumn(new sap.ui.table.Column({
								label: new sap.ui.commons.Label({text: "Type 2"}),
								template: new sap.ui.commons.TextView({text:"{type2}"}),
							}));
							oTable.addColumn(new sap.ui.table.Column({
								label: new sap.ui.commons.Label({text: "Type 3"}),
								template: new sap.ui.commons.TextView({text:"{type3}"}),
							}));
							oTable.addColumn(new sap.ui.table.Column({
								label: new sap.ui.commons.Label({text: "Role"}),
								template: new sap.ui.commons.TextView({text:"{role2}"}),
							}));							

							
							oTable.setModel(parent.getView().getModel());
							oTable.bindRows("/equipData");

							parent.getView().getModel().setProperty("/equipData", data);				
							equipArray.push (oTable);


							var equipVBox = new sap.m.VBox({items:[equipArray]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"
	
/*CREATE DIV CONTAINER with ID
					var htmlArray = [];
					var oHtml = new sap.ui.core.HTML("mytreePop");
					oHtml.setContent('<div id="mytreePop" class="mytree" ></div>');
					parent.setData(data);
					parent.setRoot("#mytreePop");
					
					htmlArray.push (oHtml);


					//var docVBox = new sap.m.VBox({items:[equipArray]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"
					var treeVBox = new sap.m.VBox({items:[htmlArray]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"	
//END CREATE DIV CONTAINER with ID
*/					
							//END BUILD TABLE WITH PROPS							

							//SUCESS OPEN DIALOG
							var dialog = new sap.m.Dialog({
							draggable: true,
							title: 'Equipment for this Installation',
							contentWidth: "500px",
							contentHeight: "450px",
							resizable: true,
							verticalScrolling: false,
								content: equipVBox,
									endButton: new sap.m.Button({ 
									text: "Ok",
									   press: function () {
											dialog.close();
											return false;
									   }
									}),
									
								  afterClose: function() {
									   dialog.destroy();
								  }    
						  }).addStyleClass("detailsContainer");
						 
							dialog.open(); 

						//SUCCES OPEN DIALOG END							

						},
						error: function (xhr, ajaxOptions, thrownError) {
							console.log(xhr.status);
							console.log(thrownError);
							//sap.ui.core.BusyIndicator.hide();
						},
						complete: function()  {
							//sap.ui.core.BusyIndicator.hide();
						}
					});		
		//END AJAX INSERT					
				}
				else {
					console.log('no data here');
				}
			
				/*
				  // selection Node Click
				  var nodeId = params.nodes[0];
				  if (nodeId) {
					// On click node
					var popup = "<div id=\"popContent\"><a href='#' onclick='this.parentNode.parentNode.style.display = \"none\"'><b>X</b></a><br/><u>Details:</u><br/><br/>"+this.body.nodes[nodeId].options.title + "<br/><br/></div>";
					// Get coordinates of node
					var { x: nodeX, y: nodeY } = network.canvasToDOM(
					   network.getPositions([nodeId])[nodeId]
					);

					// On Click popup setup

					document.getElementById("popup").innerHTML = popup + "<div class='close'></div>";
					document.getElementById("popup").style.display = "block";
					// On placement of the div
					document.getElementById("popup").style.position = "absolute";
					document.getElementById("popup").style.top = (nodeY +15) + "px";
					document.getElementById("popup").style.left = (nodeX +15) + "px";
					
				  }	
				  //console.log(document.getElementById("popup").style.display);
				*/
			});		
			//END EXPERIMENT
		
			
		},
//End Draw Graph
//Start Dynamic Graph
		displayDynamicGraph: function(data)
		{
//console.log(JSON.stringify(data, null, 2));
			parent = this;

			var graphData = {
					"nodes": [ 
						{
						  "id": "0",
						  "label": parent.force,
						  "title": parent.force,
						  "group": "1"
						}					
						],
						"edges": 
						[
						
						]
			};
			
			/*
			branch: "Air Force"
			display_name: "1st Training Regiment"
			domain: "Air"
			domain_type: "Fixed Wing [Air]"
			echelon: "Air Regiment"
			id: "Installation_62944"
			status: "Active"
			unit_country: "China"
			unit_type: "Training"				
			*/

			var counter = 1;
			var line;
			var dataObj;
			var theParent;
			var bNum = 1000;
			for(line in data){

				//console.log(data[line]["Installation Type"]); //data[line]["BASE"]
				dataObj = data[line][this.base];
				graphData.nodes.push({"id": bNum ,"label": this.base,"title":this.base,"group":"1"});
				graphData.edges.push({"from":bNum, "to": 0 });
				theParent = this.base;
				//counter +=1;
				
				dataObj = data[line]["Installation Type"];
				graphData.nodes.push({"id": counter ,"label": data[line]["branch"],"title":data[line]["branch"],"group":"1"});
				graphData.edges.push({"from":bNum, "to": counter });
				theParent = data[line]["branch"];
				counter +=1;
				dataObj = data[line]["display_name"];
				graphData.nodes.push({"id": counter ,"label": data[line]["display_name"],"title":data[line]["display_name"],"group":"1","data":data[line]["equip_arr"]});
				graphData.edges.push({"from":bNum, "to": counter});
				theParent = data[line]["display_name"];
				counter +=1;
				dataObj = data[line]["domain"];
				graphData.nodes.push({"id": counter ,"label": data[line]["domain"],"title":data[line]["domain"],"group":"1"});
				graphData.edges.push({"from":bNum, "to": counter});
				theParent = data[line]["domain"];
				counter +=1;
				dataObj = data[line]["domain_type"];
				graphData.nodes.push({"id": counter ,"label": data[line]["domain_type"],"title":data[line]["domain_type"],"group":"1"});
				graphData.edges.push({"from":bNum, "to": counter});
				theParent = data[line]["domain_type"];
				counter +=1;
				dataObj = data[line]["echelon"];
				graphData.nodes.push({"id": counter ,"label": data[line]["echelon"],"title":data[line]["echelon"],"group":"1"});
				graphData.edges.push({"from":bNum, "to": counter});
				theParent = data[line]["echelon"];
				counter +=1;
				dataObj = data[line]["status"];
				graphData.nodes.push({"id": counter ,"label": data[line]["status"],"title":data[line]["status"],"group":"1"});
				graphData.edges.push({"from":bNum, "to": counter});
				theParent = data[line]["status"];
				counter +=1;
				dataObj = data[line]["unit_country"];
				graphData.nodes.push({"id": counter ,"label": data[line]["unit_country"],"title":data[line]["unit_country"],"group":"1"});
				graphData.edges.push({"from":bNum, "to": counter});
				theParent = data[line]["unit_country"];
				counter +=1;
				dataObj = data[line]["unit_type"];
				graphData.nodes.push({"id": counter ,"label": data[line]["unit_type"],"title":data[line]["unit_type"],"group":"1"});
				graphData.edges.push({"from":bNum, "to": counter});
				theParent = data[line]["unit_type"];
				counter +=1;
				
				bNum += 1;
			}


			//old graphData call moved to 
//console.log(JSON.stringify(graphData));
			this.draw(graphData);

		},
//End Dynnamic Graph		
		//Pre-Filter to set possible values for main table filter
		onFilterListTable: function(oEvent){

			var sQuery = oEvent.getParameter("query");

			if(sQuery != 'undefined'){
				var oTable = this.getView().byId("idFeatureTable");
				var oBinding = oTable.getBinding("items");
				//Create a Filter object to hold combined filters 
				var aFilter = new sap.ui.model.Filter({				
					filters: [				
					new sap.ui.model.Filter("SNIPPET", sap.ui.model.FilterOperator.Contains, sQuery), 
					//new sap.ui.model.Filter("Metadata", sap.ui.model.FilterOperator.Contains, sQuery)
					],
					or: true 
					// set the OR or AND condition between the filters
					// true for AND, and false for OR
					// false by default
				});
				//Now Apply Filter
				oBinding.filter(aFilter);				
        	}

		
		},
		//Use this filter for suggest list
		onSuggest: function (event) {
			var sValue = event.getParameter("suggestValue");

			if (sValue) {				

				var aFilter = new sap.ui.model.Filter({

				filters: [
						new sap.ui.model.Filter("SNIPPET", sap.ui.model.FilterOperator.Contains, sValue),
						//new sap.ui.model.Filter("Metadata", sap.ui.model.FilterOperator.Contains, sValue)
				],
				or: true
				
				});

			}

			var oView = this.getView();
			this.oSF = oView.byId("searchField");
			this.oSF.getBinding("suggestionItems").filter(aFilter);
			this.oSF.suggest();
		},		
		//Utility - maybe use SYSUUID instead
		setRandomId: function(){
			//console.log('metaSel' + Math.floor(Math.random() * 1001));
			return 'metaSel' + Math.floor(Math.random() * 1001);
		},

		onSuggest: function (event) {
//console.log(event.getParameters);			
			var sValue = event.getParameter("suggestValue"),
				aFilters = [];
			if (typeof sValue !== 'undefined') {
				aFilters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("SNIPPET", sap.ui.model.FilterOperator.Contains, sValue)

					], false)
				];

//console.log(aFilters);
//console.log(sValue)
				var oView = this.getView();
				this.oSF = oView.byId("searchField");
				this.oSF.getBinding("suggestionItems").filter(aFilters);
				this.oSF.suggest();
			}
		},			
		
		createMap: function(){
			var parent = this;
			//this.map = new L.Map('map', { center: new L.LatLng(55.6537, 37.6376), zoom: 6 });
			this.map = new L.Map('map', { center: new L.LatLng(46.9458, 45.9901), zoom: 3 });
			var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),

			mapBox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/satellite-streets-v9',//'mapbox/streets-v11',		
				accessToken: 'pk.eyJ1IjoiYWFyanVsaWFuIiwiYSI6ImNrNGExamhpMjBiZHMzbW83YnMzNWZvYzQifQ.O1krsNsWSnr1W6VgC465zA'
			}),
			optopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
					attribution: '<a href="https://opentopomap.org">OpenTopoMap</a>'
			}),				
			//Aaron's : accessToken: 'pk.eyJ1IjoiYm1ham9yMTE4MSIsImEiOiJjamZ5NmhkZm8wZ2R6MndycWtldDJvd203In0.e-8Df_41EKzwJPxyu8El1w'
			
			//map = new L.Map('map', { center: new L.LatLng(10.4961357, -66.8865862), zoom: 15 }),

			drawnItems = L.featureGroup().addTo(this.map);
			parent.messages = L.featureGroup().addTo(this.map);
			parent.samSites = L.featureGroup().addTo(this.map);
			parent.sigInt = L.featureGroup().addTo(this.map);
			parent.streets = L.featureGroup();//.addTo(this.map);

			
			this.hexagon = L.layerGroup().addTo(this.map);
			
			L.control.layers({
				'osm': osm.addTo(this.map),
				'open topo': optopo.addTo(this.map),				
				'mapbox': mapBox.addTo(this.map)
				},				
				//"google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
				//	attribution: 'google'})
				//},
				//{ 'POI-Layer': poiItems }, { position: 'topleft', collapsed: false },//.addTo(this.map),
				{ 'Draw Layer': drawnItems,
				  'Message Layer': parent.messages,
				  'SAM Sites': parent.samSites,
				  'SigInt': parent.sigInt,
				  'Streets': parent.streets
				  
				}, { position: 'topleft', collapsed: false }).addTo(this.map);
			parent.drawnItemsGbl = drawnItems;
				
/*
			var baseLayers = {
				"Mapbox": mapbox,
				"OpenStreetMap": osm,
				"google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
					attribution: 'google'})	
				},				
			};

			var overlays = {
				"Marker": marker,
				"Roads": roadsLayer
			};

			L.control.layers(baseLayers, overlays).addTo(map);
*/			
			parent.drawnItemsGbl = drawnItems;
/*
			this.map.pm.addControls({
			  position: 'topleft',
			  drawCircle: true,
			  drawCircleMarker: false,
			  cutLayers: false
			});
*/
			this.map.pm.addControls({
				position: 'topleft',
				drawMarker: false,				
				drawPolyline: false,
				drawCircleMarker: false,
				drawCircle: false,
				drawRectangle: false,
				drawCircle: true,
				dragMode: false,
				cutPolygon: false
			});			
			
			parent.map.on('pm:create',(e) => {
				if(e.layer && e.layer instanceof L.Circle) {
					//e.layer.on('pm:markerdragstart', markerfncOn)
					//console.log('Circle Drawn');
					//console.log(e.layer);
					//console.log(e.layer.getRadius());
					//console.log(e.layer.getBounds().getCenter().lng);
					console.log(e.layer.getBounds().getCenter().lat);

				}
				if(e.layer && e.layer instanceof L.Rectangle) {
					//e.layer.on('pm:markerdragstart', markerfncOn)
					console.log('Box Drawn');
					//console.log(e.layer.getLatLngs());
					var bnds = e.layer.getBounds();
					var bboxStr = bnds.getNorth() + ',' +
								  bnds.getSouth() + ',' +
								  bnds.getEast() + ','  +
								  bnds.getWest()
					console.log(bboxStr);
					//console.log(e.layer);

				}
				if(e.layer && e.layer instanceof L.Polygon) {
					//e.layer.on('pm:markerdragstart', markerfncOn)
					//console.log('Polygon Drawn');
					//console.log(e.layer.getLatLngs());
					var polyStr = '';
					e.layer.getLatLngs()[0].forEach(function(ll){
						polyStr += ll.lng +' '+ll.lat+',';
					});
					polyStr += + e.layer.getLatLngs()[0][0].lng + ' ' + e.layer.getLatLngs()[0][0].lat
					//console.log(polyStr);
				/*
					var bnds = e.layer.getBounds();
					var polyStr = bnds.getNorth() + ',' +
								  bnds.getSouth() + ',' +
								  bnds.getEast() + ','  +
								  bnds.getWest()
				*/
					//console.log(polyStr);
					this.popUpEquipPoly(polyStr);
					//console.log(e.layer);

				}				
			});
			
		
			this.map.on('draw:deleted', function (e) {
				console.log('killed it!!!')
				//clearAndReset();
			})		
			//Run the code below on the Hide Show Div function (each time diplay is actually reset)
			//this.map.invalidateSize(true);
		},
//TREEMAP Functions Start HERE
		setData: function(dataIn)
		{
			//console.log('setData Called');
			//console.log(dataIn)
			//console.log(this.dataIn)
			//var dataIn = this.dataIn;
		
			var lastBase = '';
			var container;
			var oldContainer;
			var baseAlready = false;
			for(var row in dataIn){

			 if(lastBase === dataIn[row]['BASE'])
			 {
				//console.log(lastBase + ' = ' +dataIn[row]['BASE'] )
				container = oldContainer;
				baseAlready = true;
				
			 }else{
				container = {"name": dataIn[row]['BASE'], children:[]};
				//console.log('No Match' + lastBase + ' = ' +dataIn[row]['BASE'] )
				//console.log(container);
				baseAlready = false;
			 }
			 
				if(dataIn[row]['branch'] === 'Army')
				{
						//container = {"name": dataIn[row]['BASE'], children:[]};
					if(baseAlready == false)
					{
						this.treeData.children[0].children.push(container);
							container.children.push({"name": dataIn[row]['unit_country'], children:[]});
							container.children.push({"name": dataIn[row]['unit_type'], children:[]});
							container.children.push({"name": dataIn[row]['echelon'], children:[]});
							container.children.push({"name": dataIn[row]['domain'], children:[]});
					}
							//var echelon = {"name": dataIn[row]['echelon'], children:[]};
							var equipStr = dataIn[row]['status'] + ', ' +
								  dataIn[row]['parent'] + ', ' +
								  dataIn[row]['type1'] + ', ' +
								  dataIn[row]['type2'] + ', ' +
								  dataIn[row]['type3'] + ', ' +
								  dataIn[row]['role2'];
							//echelon.children.push({"name": equipStr, children:[]});
							container.children[2].children.push({"name": equipStr, children:[]})

				}
				if(dataIn[row]['branch'] === 'Air Force')
				{
//TEST FIX
//console.log(dataIn[row]['BASE'] + '--' + dataIn[row]['parent']+ '\'')
if(dataIn[row]['BASE'] === 'Funkovo' && dataIn[row]['parent'] === 'S-400')
{
	console.log('In Change');
	dataIn[row]['parent'] = 'S-300';
}
//TEST FIX					
					//container = {"name": dataIn[row]['BASE'], children:[]};
					if(baseAlready == false)
					{		
						this.treeData.children[1].children.push(container)
							container.children.push({"name": dataIn[row]['unit_country'], children:[]});
							container.children.push({"name": dataIn[row]['unit_type'], children:[]});
							container.children.push({"name": dataIn[row]['echelon'], children:[]});
							container.children.push({"name": dataIn[row]['domain'], children:[]});
					}
						//var echelon = {"name": dataIn[row]['echelon'], children:[]};
						var equipStr = dataIn[row]['status'] + ', ' +
							  dataIn[row]['parent'] + ', ' +
							  dataIn[row]['type1'] + ', ' +
							  dataIn[row]['type2'] + ', ' +
							  dataIn[row]['type3'] + ', ' +
							  dataIn[row]['role'];
						//echelon.children.push({"name": equipStr, children:[]});
						container.children[2].children.push({"name": equipStr, children:[]})	
				}	
				if(dataIn[row]['branch'] === 'Navy')
				{
					//container = {"name": dataIn[row]['BASE'], children:[]};
					if(baseAlready == false)
					{
						this.treeData.children[2].children.push(container)
							container.children.push({"name": dataIn[row]['unit_country'], children:[]});
							container.children.push({"name": dataIn[row]['unit_type'], children:[]});
							container.children.push({"name": dataIn[row]['echelon'], children:[]});
							container.children.push({"name": dataIn[row]['domain'], children:[]});
					}
						//var echelon = {"name": dataIn[row]['echelon'], children:[]};
						var equipStr = dataIn[row]['status'] + ', ' +
							  dataIn[row]['parent'] + ', ' +
							  dataIn[row]['type1'] + ', ' +
							  dataIn[row]['type2'] + ', ' +
							  dataIn[row]['type3'] + ', ' +
							  dataIn[row]['role'];
						//echelon.children.push({"name": equipStr, children:[]});
						container.children[2].children.push({"name": equipStr, children:[]})
				}
				if(dataIn[row]['branch'] === 'Airborne Troops')
				{
					//container = {"name": dataIn[row]['BASE'], children:[]};
					if(baseAlready == false)
					{
						this.treeData.children[3].children.push(container)
							container.children.push({"name": dataIn[row]['unit_country'], children:[]});
							container.children.push({"name": dataIn[row]['unit_type'], children:[]});
							container.children.push({"name": dataIn[row]['echelon'], children:[]});
							container.children.push({"name": dataIn[row]['domain'], children:[]});
					}
						//var echelon = {"name": dataIn[row]['echelon'], children:[]};
						var equipStr = dataIn[row]['status'] + ', ' +
							  dataIn[row]['parent'] + ', ' +
							  dataIn[row]['type1'] + ', ' +
							  dataIn[row]['type2'] + ', ' +
							  dataIn[row]['type3'] + ', ' +
							  dataIn[row]['role'];
						//echelon.children.push({"name": equipStr, children:[]});
						container.children[2].children.push({"name": equipStr, children:[]})
				}
				if(dataIn[row]['branch'] === 'Strategic Missile Forces')
				{
					//container = {"name": dataIn[row]['BASE'], children:[]};
					if(baseAlready == false)
					{
						this.treeData.children[4].children.push(container)
							container.children.push({"name": dataIn[row]['unit_country'], children:[]});
							container.children.push({"name": dataIn[row]['unit_type'], children:[]});
							container.children.push({"name": dataIn[row]['echelon'], children:[]});
							container.children.push({"name": dataIn[row]['domain'], children:[]});
					}
						//var echelon = {"name": dataIn[row]['echelon'], children:[]};
						var equipStr = dataIn[row]['status'] + ', ' +
							  dataIn[row]['parent'] + ', ' +
							  dataIn[row]['type1'] + ', ' +
							  dataIn[row]['type2'] + ', ' +
							  dataIn[row]['type3'] + ', ' +
							  dataIn[row]['role'];
						//echelon.children.push({"name": equipStr, children:[]});
						container.children[2].children.push({"name": equipStr, children:[]})			
				}
				lastBase = dataIn[row]['BASE'];
				oldContainer = container;
			};			
			//this.setRoot();

		},
		setRoot: function(theTree)
		{		
			var parent = this;
			this.margin = {top: 20, right: 90, bottom: 30, left: 90};
			this.width = 1200 - this.margin.left - this.margin.right;
			this.height = 700 - this.margin.top - this.margin.bottom;

			// append the svg object to the body of the page
			// appends a 'group' element to 'svg'
			// moves the 'group' element to the top left margin
			//svg = d3.select("body").append("svg")
			//this.svg = d3v4.select("#mytree").append("svg")
			this.svg = d3v4.select(theTree).append("svg")
				.attr("width", this.width + this.margin.right + this.margin.left)
				.attr("height", this.height + this.margin.top + this.margin.bottom)
			  .append("g")
				.attr("transform", "translate("
					  + this.margin.left + "," + this.margin.top + ")");

			this.i = 0;
			this.duration = 750;
			//root;

			// declares a tree layout and assigns the size
			this.treemap = d3v4.tree().size([this.height, this.width]);
				this.root = d3v4.hierarchy(this.treeData, function(d) { return d.children; });
				this.root.x0 = this.height / 2;
				this.root.y0 = 0;

			// Collapse after the second level //BIG ISSUE HERE
			//Trying to move this to the 
			//this.root.children.forEach(this.collapse_d3);
///////////////BIG TEST (bring above function internal)

			function collapseLevel(d) {
				if (d.children && d.depth > 0) {
					d._children = d.children;
					d._children.forEach(collapseLevel);
					d.children = null;
				} else if (d.children){
					d.children.forEach(collapseLevel);
				}
			}
			this.root.children.forEach(collapseLevel);//iterate each node and collapse excluding node zero
			this.update(this.root);
		},
	
		update: function(source) {
		   var parent = this;
		  // Assigns the x and y position for the nodes
		  //var treeData = treemap(root);
		  this.treeData = this.treemap(this.root);

		  // Compute the new tree layout.
		  var nodes = this.treeData.descendants(),
			  links = this.treeData.descendants().slice(1);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d){ d.y = d.depth * 180});

		  // ****************** Nodes section ***************************

		  // Update the nodes...
		  var node = this.svg.selectAll('g.node')
			  .data(nodes, function(d) {return d.id || (d.id = ++this.i); });

		  // Enter any new modes at the parent's previous position.
		  var nodeEnter = node.enter().append('g')
			  .attr('class', 'node')
			  .attr("transform", function(d) {
				return "translate(" + source.y0 + "," + source.x0 + ")";
			})
			.on('click', click);

		  // Add Circle for the nodes
		  nodeEnter.append('circle')
			  .attr('class', 'node')
			  .attr('r', 1e-6)
			  .style("fill", function(d) {
				  return d._children ? "lightsteelblue" : "#fff";
			  });

		  // Add labels for the nodes
		  nodeEnter.append('text')
			  .attr("dy", ".35em")
			  .attr("x", function(d) {
				  return d.children || d._children ? -13 : 13;
			  })
			  .attr("text-anchor", function(d) {
				  return d.children || d._children ? "end" : "start";
			  })
			  .text(function(d) { return d.data.name; });

		  // UPDATE
		  var nodeUpdate = nodeEnter.merge(node);

		  // Transition to the proper position for the node
		  nodeUpdate.transition()
			.duration(this.duration)
			.attr("transform", function(d) { 
				return "translate(" + d.y + "," + d.x + ")";
			 });

		  // Update the node attributes and style
		  nodeUpdate.select('circle.node')
			//.attr('r', 10)
			.attr('r', 5)
			.style("fill", function(d) {
				return d._children ? "lightsteelblue" : "#fff";
			})
			.attr('cursor', 'pointer');


		  // Remove any exiting nodes
		  var nodeExit = node.exit().transition()
			  .duration(this.duration)
			  .attr("transform", function(d) {
				  return "translate(" + source.y + "," + source.x + ")";
			  })
			  .remove();

		  // On exit reduce the node circles size to 0
		  nodeExit.select('circle')
			.attr('r', 1e-6);

		  // On exit reduce the opacity of text labels
		  nodeExit.select('text')
			.style('fill-opacity', 1e-6);

		  // ****************** links section ***************************

		  // Update the links...
		  var link = this.svg.selectAll('path.link')
			  .data(links, function(d) { return d.id; });

		  // Enter any new links at the parent's previous position.
		  var linkEnter = link.enter().insert('path', "g")
			  .attr("class", "link")
			  .attr('d', function(d){
				var o = {x: source.x0, y: source.y0}
				return diagonal(o, o)
			  });

		  // UPDATE
		  var linkUpdate = linkEnter.merge(link);

		  // Transition back to the parent element position
		  linkUpdate.transition()
			  .duration(this.duration)
			  .attr('d', function(d){ return diagonal(d, d.parent) });

		  // Remove any exiting links
		  var linkExit = link.exit().transition()
			  .duration(this.duration)
			  .attr('d', function(d) {
				var o = {x: source.x, y: source.y}
				return diagonal(o, o)
			  })
			  .remove();

		  // Store the old positions for transition.
		  nodes.forEach(function(d){
			d.x0 = d.x;
			d.y0 = d.y;
		  });

		  // Creates a curved (diagonal) path from parent to the child nodes
		  function diagonal(s, d) {

			var path = `M ${s.y} ${s.x}
					C ${(s.y + d.y) / 2} ${s.x},
					  ${(s.y + d.y) / 2} ${d.x},
					  ${d.y} ${d.x}`

			return path
		  }

		  // Toggle children on click.
		  function click(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			  } else {
				d.children = d._children;
				d._children = null;
			  }
			parent.update(d);
		  }
		},
//TREEMAP Functions END HERE
//GEO Doc POPUP starts HERE

		rowSelect: function(oEvent) {
			//console.log(oEvent.getParameters());
			var oSelectedItem = oEvent.getParameter("listItem");
            var docId = oSelectedItem.getBindingContext().getProperty("ID");
			//console.log(docId);
			this.popUpDoc(docId)
		},
		
		popUpDoc: function(docId){
			var parent = this;
			if(typeof docId === 'undefined'){
				return false;
			}

			//INSERT AJAX HERE
			var qSearch = docId;
			var url = '/getDocumentData?qSearch='+docId;
			$.ajax({
				url: url,
				async: true,
				success: function(data) {
					//console.log(data);
					//BUIDL TABLE WITH PROPS

					var contentArray = [];
					var counter = 0;
					
					var oTable = new sap.m.Table({
					  columns:[
						new sap.m.Column({
						  header:[
							new sap.m.Text({text:"Contents"})
						  ]
						})
					  ]
					});
					
					oTable.bindAggregation("items",{
						path:"/docData",
						template:  new sap.m.ColumnListItem({
							  cells:[
								new sap.m.FormattedText({htmlText:"{TEXT}"})
							  ]
							})
					});

					
					oTable.setModel(parent.getView().getModel());
					parent.getView().getModel().setProperty("/docData", data);

//0: {TEXT			
//DIV Add					
					var docText = parent.getView().getModel().getProperty("/docData", data);
					console.log(docText);
					console.log(docText[0].TEXT)
					
					//class="hiddenDetailsContent"
					docText = '<div id="docContent" width="100%" height="100%">'+
							  docText[0].TEXT +
							  '</div>';
					var oHtml = new sap.ui.core.HTML("docContent");
					//oHtml.setContent('<div id="docContent" class="hiddenDetailsContent" width="100%" height="100%">The meeting is scheduled for<span class="highlight">27 August 2020</span>in the afternoon</div>');
					oHtml.setContent(docText);
//DIV Add	
					//contentArray.push (oTable);
				//TEXT
					contentArray.push (oHtml);
					
					var docVBox = new sap.m.VBox({items:[contentArray]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"							
					//END BUILD TABLE WITH PROPS							

					//SUCESS OPEN DIALOG
					var dialog = new sap.m.Dialog({
					draggable: true,
					title: 'Document Contents',
					contentWidth: "500px",
					contentHeight: "450px",
					resizable: true,
					verticalScrolling: false,
						content: docVBox,
							endButton: new sap.m.Button({ 
							text: "Ok",
							   press: function () {
									dialog.close();
									return false;
							   }
							}),
							
						  afterClose: function() {
							   dialog.destroy();
						  }    
				  }).addStyleClass("detailsContainer");
				 
					dialog.open(); 

				//SUCCES OPEN DIALOG END							

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			})	

		},
//Equip from map poly
		popUpEquipPoly: function(qPoly){
//console.log('In popup Equip Now')
//console.log(qPoly);			
			//MessageToast.show(JSON.stringify(params,null,2));
			var parent = this;
			if(typeof qPoly === 'undefined'){
				return false;
			}
			//console.log(JSON.stringify(params,null,2));

			//INSERT AJAX HERE
			var qSearch = '%';
			//var qPoy = docId;
			var url = '/getTreeViewAllGeoBasesOrbatsEquip?qSearch=%&qPoly='+qPoly;
			$.ajax({
				url: url,
				async: true,
				success: function(data) {
console.log(data);
					//BUIDL TABLE WITH PROPS

					var equipArray = [];
					var counter = 0;
					var oTable = new sap.ui.table.Table({
						selectionMode : sap.ui.table.SelectionMode.Single,
						selectionBehavior: sap.ui.table.SelectionBehavior.Row,
							rowSelectionChange: function(oEvent) {
							  var indices = oEvent.getParameter('rowIndices');
							  for (var i = 0; i < indices.length; i++) {
								var idx = indices[i];
								if (oTable.isIndexSelected(idx)) {
								  var cxt = oTable.getContextByIndex(idx);

								  var path = cxt.sPath;
								  var obj = oTable.getModel().getProperty(path);
								  //console.log(obj);       
								}
							  }
						}
					});
/*
					//parent type1 type2 type3 role2
					oTable.addColumn(new sap.ui.table.Column({
						label: new sap.ui.commons.Label({text: "Parent"}),
						template: new sap.ui.commons.TextView({text:"{parent}"}),
					}));
					oTable.addColumn(new sap.ui.table.Column({
						label: new sap.ui.commons.Label({text: "Type 1"}),
						template: new sap.ui.commons.TextView({text:"{type1}"}),
					}));
					oTable.addColumn(new sap.ui.table.Column({
						label: new sap.ui.commons.Label({text: "Type 2"}),
						template: new sap.ui.commons.TextView({text:"{type2}"}),
					}));
					oTable.addColumn(new sap.ui.table.Column({
						label: new sap.ui.commons.Label({text: "Type 3"}),
						template: new sap.ui.commons.TextView({text:"{type3}"}),
					}));
					oTable.addColumn(new sap.ui.table.Column({
						label: new sap.ui.commons.Label({text: "Role"}),
						template: new sap.ui.commons.TextView({text:"{role2}"}),
					}));

					
					oTable.setModel(parent.getView().getModel());
					oTable.bindRows("/equipPoly");

					parent.getView().getModel().setProperty("/equipPoly", data);				
					equipArray.push (oTable);
*/
//CREATE DIV CONTAINER with ID
					var oHtml = new sap.ui.core.HTML("mytreePop");
					oHtml.setContent('<div id="mytreePop" class="mytree" ></div>');
					
					equipArray.push (oHtml);
//END CREATE DIV CONTAINER with ID

					//var docVBox = new sap.m.VBox({items:[equipArray]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"
					var docVBox = new sap.m.VBox({items:[oHtml]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"
					//END BUILD TABLE WITH PROPS							

					//SUCESS OPEN DIALOG
					var dialog = new sap.m.Dialog({
					afterOpen: function(oEvent){
						//MessageToast.show('Works Hooray!');
						parent.treeData = {
							"name": "All Forces",
							"children": [

								{"name": "Army",
									"children": [
									]},	
								{"name": "Air Force",
									"children": [
									]},	
								{"name": "Navy",
									"children": [
									]},	
								{"name": "Airborne Troops",
									"children": [
									]},	
								{"name": "Strategic Missile Forces",
									"children": [
									]}
									
							]
						};						
						parent.setData(data);
						parent.setRoot("#mytreePop");						
					},
					beforeClose: function(oEvent){
						//MessageToast.show('Works Hooray!');
						parent.treeData = {
							"name": "All Forces",
							"children": [

								{"name": "Army",
									"children": [
									]},	
								{"name": "Air Force",
									"children": [
									]},	
								{"name": "Navy",
									"children": [
									]},	
								{"name": "Airborne Troops",
									"children": [
									]},	
								{"name": "Strategic Missile Forces",
									"children": [
									]}
									
							]
						};
						$("#mytree").empty();						
						parent.setData(allData);
						parent.setRoot("#mytree");						
					},
					
					draggable: true,
					title: 'Equipment in this Polygon',
					contentWidth: "1200px",
					contentHeight: "800px",
					resizable: true,
					verticalScrolling: false,
						content: docVBox,
							endButton: new sap.m.Button({ 
							text: "Ok",
							   press: function () {
									dialog.close();
									return false;
							   }
							}),
							
						  afterClose: function() {
							   dialog.destroy();
						  }    
				  }).addStyleClass("detailsContainer");
				 
					dialog.open(); 

				//SUCCES OPEN DIALOG END							

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			})	
			//}
		},
//HEX CODE functions
		getCountryData: function(qSvcName){
			var parent = this;
			var url = '/getCountry';
    		$.ajax({
				url: url,
    		    async: true,
    		    success: function(data) {
//console.log('COUNTRY');
//console.log(data);
					//parent.drawGraph(data);
					var theData = parent.getView().getModel();
					theData.setProperty("/countryData", data);
					theData.refresh();
					//Sub Call
								url = '/getTheSamSites';
					    		$.ajax({
										url: url,
										async: true,
										success: function(data) {
											parent.plotSamSite (data);
//console.log('SAM Sites');
//console.log(data);
											//url = '/getTheSigInt';
											url = '/getTheSigIntEllipse';
											$.ajax({
													url: url,
													async: true,
													success: function(data) {
														//parent.plotSigInt(data);
														parent.plotSigIntEllipse(data);
														
														//Last One call Street Data
														
														//parent.getTheStreetData('BBOX')
//console.log('SigInt');
//console.log(data);
//

														var url = '/getAllNodesStreet?qCtyName=BBOX';
														$.ajax({
															url: url,
															async: true,
															success: function(data) {
											//console.log(data);
																parent.savedStreetData = data;
																parent.drawStreetGraph(data);

															},
															error: function (xhr, ajaxOptions, thrownError) {
																console.log(xhr.status);
																console.log(thrownError);
																//sap.ui.core.BusyIndicator.hide();
															},
															complete: function()  {
																//sap.ui.core.BusyIndicator.hide();
															}
														});	
//


													},
													error: function (xhr, ajaxOptions, thrownError) {
														console.log(xhr.status);
														console.log(thrownError);
														//sap.ui.core.BusyIndicator.hide();
													},
													complete: function()  {
														//sap.ui.core.BusyIndicator.hide();
													}
												});	

										},
										error: function (xhr, ajaxOptions, thrownError) {
											console.log(xhr.status);
											console.log(thrownError);
											//sap.ui.core.BusyIndicator.hide();
										},
										complete: function()  {
											//sap.ui.core.BusyIndicator.hide();
										}
									});	

//End
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});			
			
		},
//GET Groups for list box
		changedSelCountry: function(oEvent){
			var parent = this;
			var oSelect = oEvent.getSource();
			var getSelectedItem = oSelect.getSelectedItem();
			//console.log(getSelectedItem);
			var getSelectedText = getSelectedItem ? getSelectedItem.getText() : null;
			//console.log("Selected Value : " + getSelectedText);
			var qCountry = getSelectedText;			
			var url = '/getGroups?qCountry='+qCountry;
    		$.ajax({
				url: url,
    		    async: true,
    		    success: function(data) {
//console.log(data);
					//parent.drawGraph(data);
					var theData = parent.getView().getModel();
					theData.setProperty("/groupData", data);
					theData.refresh();

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});			
			
		},		
		//Listen for Select change and grab correct data
		changedSelGroup: function(oEvent){
			var oSelect = oEvent.getSource();
			var getSelectedItem = oSelect.getSelectedItem();
			//console.log(getSelectedItem);
			var getSelectedText = getSelectedItem ? getSelectedItem.getText() : null;
			//console.log("Selected Value : " + getSelectedText);
			var qGroup = getSelectedText;
			parent = this;
			
			MessageToast.show('Dont Ever Change LOL');
			//console.log(map);
			//console.log(currPoly);
			//if(currPoly != '')
			//{
				//this.getTheData(currPoly,qType);
console.log(qGroup);
				this.getTheHexData(qGroup)
			//}

		},
		//Ajax call to seed Model with refreshed data
		getTheHexData: function(oEvent){
			var oSelect = oEvent.getSource();
			var getSelectedItem = oSelect.getSelectedItem();
			//console.log(getSelectedItem);
			var getSelectedText = getSelectedItem ? getSelectedItem.getText() : null;
			//console.log("Selected Value : " + getSelectedText);
			var qGroup = getSelectedText;			
console.log(qGroup);			
			var parent = this;
			var url = '/getEscapeData?qGroup='+qGroup;
    		$.ajax({
				url: url,
    		    async: true,
    		    success: function(data) {
console.log(data);
					var theData = parent.getView().getModel();
					theData.setProperty("/hexData", data);
					theData.refresh();
					parent.showTheHexData(data);
					//parent.getTheEventData(qGroup)
					//showTheData(data);

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});			
			
		},
		//Ajax call to seed Model with refreshed data
		getTheEventData: function(qGroup){
			var parent = this;
			var url = '/getEventDataCountry?qGroup='+qGroup;
    		$.ajax({
				url: url,
    		    async: true,
    		    success: function(data) {
console.log(data);
					var theData = parent.getView().getModel();
					theData.setProperty("/searchData", data);
					theData.refresh();
					parent.oModelTable.refresh();
					//parent.getView().getModel(oModelTable).refresh();

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});			
			
		},		
		showTheHexData: function(data){
			var parent = this;
			this.hexagon.clearLayers();
			var theLat;
			var theLng
			data.forEach(function(obj) { 
					// create a red polygon from an array of LatLng points
					var initialArr = JSON.parse(obj.HEXCELL).coordinates[0];
					var finalArr = [];
					initialArr.forEach(function(innerObj){
						finalArr.push(innerObj.reverse())
					});
				
					var latlngs = finalArr;
console.log(JSON.stringify(latlngs, null, 2))					
					theLat = latlngs[0][0];
					theLng = latlngs[0][1];
//.HEXCENTROID.Point);
					
					var polygon = L.polygon(latlngs, {color: 'red'}).addTo(parent.map);					
					// zoom the map to the polygon
					//map.fitBounds(polygon.getBounds());
			});
			this.showMap();			
			parent.map.flyTo([theLat, theLng], 8)

		},
//////SEARCH TO Graph
		popUpSearchToGraph: function(){
			var parent = this;
console.log('In popup Equip Now')
//console.log(qPoly);			
			//MessageToast.show(JSON.stringify(params,null,2));
			var searchField = parent.getView().byId("searchField");
			var searchVal = searchField.getValue();			
			
			var parent = this;
			if(typeof searchVal === 'undefined'){
				return false;
			}
			//console.log(JSON.stringify(params,null,2));

			//INSERT AJAX HERE
			var qSearch = searchVal;

			var url = '/createGraph?qSearch='+qSearch;
			$.ajax({
				url: url,
				async: true,
				success: function(data) {
console.log(data);
					var divArray = [];
//CREATE DIV CONTAINER with ID
					var oHtml = new sap.ui.core.HTML("SearchToGraph");
					//oHtml.setContent('<div id="SearchToGraph" class="SearchToGraph" >HELLO WORLD</div>');
					oHtml.setContent('<div id="SearchToGraphC" width="1000px" height="2000px"><svg id="SearchToGraph" height="1000px" width="2000px"></svg></div>');
					//oHtml.setContent('<div id="SearchToGraphC" width="100%" height="100%"><svg id="SearchToGraph" width="100%" height="100%"></svg></div>');
					
					divArray.push (oHtml);
//END CREATE DIV CONTAINER with ID

					//var docVBox = new sap.m.VBox({items:[equipArray]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"
					var docVBox = new sap.m.VBox({items:[divArray]}).addStyleClass("hiddenDetailsContent"); //,alignItems:"Center"
					//END BUILD TABLE WITH PROPS							

					//SUCESS OPEN DIALOG
					var dialog = new sap.m.Dialog({
					afterOpen: function(oEvent){
						//MessageToast.show('Works Hooray!');
console.log(JSON.stringify(data, null,2));
						parent.displayQueryGraphData(data[0],data[1]); //vertexData,edgeData
					
					},
					beforeClose: function(oEvent){

						//$("#SearchToGraph").empty();						
						//parent.setData(allData);
						//parent.setRoot("#mytree");						
					},
					
					draggable: true,
					title: 'How the Search Results Intersect',
					contentWidth: "1200px",
					contentHeight: "800px",
					resizable: true,
					verticalScrolling: true,
						content: docVBox,
							endButton: new sap.m.Button({ 
							text: "Ok",
							   press: function () {
									dialog.close();
									return false;
							   }
							}),
							
						  afterClose: function() {
							  $( "#SearchToGraphC" ).remove();
							   dialog.destroy();
						  }    
				  }).addStyleClass("detailsContainer");
				 
					dialog.open(); 

				//SUCCES OPEN DIALOG END							

				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			})	
			//}
		},
		initD3STG: function()
		{

			//D3 setup
			//var width = 810; 
			//var height = 510;
			parent.colors = d3v4.scaleOrdinal(d3v4.schemeCategory10);
			//parent.svgSTG = d3v4.select("#fdSVG"),  //SearchToGraph
			parent.svgSTG = d3v4.select("#SearchToGraph"),
			parent.widthSTG + parent.svgSTG.attr("width"), // = 810,
			parent.heightSTG + parent.svgSTG.attr("height"), // = 510		
			parent.node,
			parent.link;
			parent.svgSTG.append('defs').append('marker')
				.attrs({'id':'arrowhead',
					'viewBox':'-0 -5 10 10',
					'refX':13,
					'refY':0,
					'orient':'auto',
					'markerWidth':13,
					'markerHeight':13,
					'xoverflow':'visible'})
				.append('svg:path')
				.attr('d', 'M 0,-5 L 10 ,0 L 0,5')
				.attr('fill', '#999')
				.style('stroke','none');

			//parent.cursor = parent.svgSTG.append("circle")
			//.attr("r", 30)
			//.attr("transform", "translate(-100,-100)")
			//.attr("class", "cursor");	
			
			parent.svgSTG.on("click", function(d) {
				 var coords = d3v4.mouse(this);
				 console.log('clicked');			
			})
			parent.svgSTG.on("mousemove", parent.mousemove);
			parent.simulation = d3v4.forceSimulation()
						.force("link", d3v4.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
						.force("charge", d3v4.forceManyBody())
						.force("center", d3v4.forceCenter(parent.widthSTG / 2, parent.heightSTG / 2))
						.force('collide',d3v4.forceCollide().radius(30).iterations(2));			
			
//LAST WORKING	
/*
						.force("link", d3v4.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
						.force("charge", d3v4.forceManyBody())
						.force("center", d3v4.forceCenter(parent.widthSTG / 2, parent.heightSTG / 2));
*/
//END LAST WORKING						
//END TEST						
						//.force("link", d3v4.forceLink().id(function (d) {return d.id;}).distance(200).strength(1)) //was 200 below
						//.force("forceX", d3v4.forceX().strength(.1).x(parent.widthSTG * .5))
						//.force("forceY", d3v4.forceY().strength(.1).y(parent.heightSTG * .5))
						//.force("center", d3v4.forceCenter().x(parent.widthSTG * .5).y(parent.heightSTG * .5))
						//.force("charge", d3v4.forceManyBody().strength(-15));
			
			//Previous working
			/*
				.force("link", d3v4.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
				.force("charge", d3v4.forceManyBody())
				.force("center", d3v4.forceCenter(parent.widthSTG / 2, parent.heightSTG / 2));
			*/
	//TRY ZOOM
			//zoom_handler = d3.zoom()
			//	.on("zoom", zoom_actions);

			//zoom_handler(svg);
	//END TRY ZOOM
		},

		updateD3STG: function(links, nodes) {
			var parent = this;
			//var width = window.innerWidth, height = window.innerHeight, sizeDivisor = 100, nodePadding = 2.5;
			var numbers = /^[0-9]+$/;

			parent.link = parent.svgSTG.selectAll(".link")
				.data(links)
				.enter()
				.append("line")
				.attr("class", "linkSTG")
				.attr('marker-end','url(#arrowhead)')

			parent.link.append("title")
				.text(function (d) {return d.type;});

			parent.edgepaths = parent.svgSTG.selectAll(".edgepath")
				.data(links)
				.enter()
				.append('path')
				.attrs({
					'class': 'edgepath',
					'fill-opacity': 9, //0
					'stroke-opacity': 9, //0
					'id': function (d, i) {return 'edgepath' + i}
				})
				.style("pointer-events", "none");

			parent.edgelabels = parent.svgSTG.selectAll(".edgelabel")
				.data(links)
				.enter()
				.append('text')
				.style("pointer-events", "none")
				.attrs({
					'class': 'edgelabel',
					'id': function (d, i) {return 'edgelabel' + i},
					'font-size': 10,
					'fill': '#aaa'
				});			

			parent.edgelabels.append('textPath')
				.attr('xlink:href', function (d, i) {return '#edgepath' + i})
				.style("text-anchor", "middle")
				.style("pointer-events", "none")
				.attr("startOffset", "50%")
				.text(function (d) {return d.type});

			parent.node = parent.svgSTG.selectAll(".node")
				.data(nodes)
				.enter()
				.append("g")
				.attr("class", "node")
				.on("dblclick", console.log('Doube Clicked')) //contextmenu -- dblclick
				.call(d3v4.drag()
						.on("start", parent.dragstarted)
						.on("drag", parent.dragged)
						//.on("dragEnd",dragEnd)
				);			

			parent.node.append("rect")
				.attr("height", 17)
				.attr("width", 15)			
				.style("fill", "#fff")
				
	//TEST ICONS HERE
			parent.node.append('svg:foreignObject')
				.attr('color','black')
				.attr('height', '17px')
				.attr('width', '20px')
				//.html('<i class="fa fa-sitemap"></i>');
				//.html('<i class="fas fa-address-card"></i>');
				.html(function (d) {
console.log(d.id);
									//if(d.id.match(numbers)){
									if(d.id.indexOf('_N')>0){
										if(d.id == '100000000001_N')
										{
console.log('Hit on 100000000001_N');
											return '<i class="far fa-question-circle" style="font-size: 18px;"></i>';
										} else {
											//return '<i class="fab fa-twitter-square" style="font-size: 18px;"></i>';
											return '<i class="fas fa-file-word" style="font-size: 18px;"></i>';

										}
									}else {
//console.log('HIT THE ta_type BLOCK');
//console.log(ta_type[d.name.split(':')[0]]);
//console.log(d.name);
										return ta_type[d.name.split(':')[0]];									
									}})

	//END TEST ICONS HERE

			parent.node.append("title")
				.text(function (d) {return d.name;});

			parent.node.append("text")
				.attr("dy", -3)
				//.text(function (d) {return d.label;});

			parent.simulation
			//.force("link", d3v4.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
			.force("link", d3v4.forceLink().id(function (d) {return d.id;}).distance(200))
			.force("center", d3v4.forceCenter().x(parent.widthSTG * .5).y(parent.heightSTG * .5))
			.force("charge", d3v4.forceManyBody().strength()) //-15
				.nodes(nodes)
				.on("tick", parent.ticked);


			parent.simulation.force("link")
				.links(links);
	//console.log(simulation);
		},

		ticked: function() {
	//console.log('Radius: '+parent.radius);
	//console.log('heightSTG: '+parent.heightSTG);
	//console.log('widthSTG: '+parent.widthSTG);
	

			parent.link
				.attr("x1", function (d) {return d.source.x;})
				.attr("y1", function (d) {return d.source.y;})
				.attr("x2", function (d) {return d.target.x;})
				.attr("y2", function (d) {return d.target.y;});

	   
			parent.node
				.attr("cx", function(d) { return d.x = Math.max(parent.radius, Math.min(parent.widthSTG - parent.radius, d.x)); })
				.attr("cy", function(d) { return d.y = Math.max(parent.radius, Math.min(parent.heightSTG - parent.radius, d.y)); })
				.attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

			parent.edgepaths.attr('d', function (d) {
				return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
			});


		},

		dragstarted: function dragstarted(d) {
			if (!d3v4.event.active) parent.simulation.alphaTarget(0.3).restart()
			d.fx = d.x;
			d.fy = d.y;
		},

		dragged: function(d) {
			d.fx = d3v4.event.x;
			d.fy = d3v4.event.y;
		},
	//Show D3 Graph
		displayQueryGraphData: function(vertexData,edgeData)
		{
			parent = this;
			var data = {nodes:[],links:[]}
			
			//Test for numbers regex
			var numbers = /^[0-9]+$/;
			for(var line in vertexData){
				//Gather D3 Data
					var temp = {name:'', label:'', id:''};
					temp.name = vertexData[line]["DATA"];
					//Try for better names
					var baseStr = vertexData[line]["DATA"];
					var truncLbl = baseStr.substring(0,20);
					temp.label = truncLbl;
					
					temp.id = vertexData[line]["NODE_ID"];
					data.nodes.push(temp);
			}
			for(line in edgeData){
				//Gather D3 Data 
				var temp = {source:'', target:'', type:''};
				temp.source = edgeData[line]["START"];
				temp.target = edgeData[line]["END"];
				temp.type = edgeData[line]["CONF"];
				data.links.push(temp);
			}				
			//document.getElementById("mySVG").innerHTML = ""; 
			$( "#SearchToGraph" ).empty();
			
			parent.initD3STG();

			parent.currentData = data;
	console.log(data);
			parent.updateD3STG(data.links,data.nodes);

		},
//MAP MESSAGE SECTION
		getMsgFootprints: function () 
		{
/* From Maritime			
			console.log('killed it!!!')
			clearAndReset();	
			var params = {'qType':''};
			$.getJSON(baseUrl+'/getUnknownShipFootprints', params, function(data){

				displayUnkShipShapes(data);
			})
*/
			//MessageToast.show(JSON.stringify(params,null,2));
			var parent = this;
			parent.showMap();
			var searchField = parent.getView().byId("searchField");
			var qSearch = searchField.getValue();			
			

			if(typeof qSearch === 'undefined'){
				return false;
			}
			//var url = '/getUnknownShipFootprints?qDist='+qDist;
			var url = '/getMsgFootprints?qSearch='+qSearch;
			$.ajax({
				url: url,
				async: true,
				success: function(data) {
	//console.log(data);
					//var theData = parent.getView().getModel();
					//theData.setProperty("/searchData", data);
					//theData.refresh();
					//parent.oModelTable.refresh();
console.log('Success Getting Msg Footprints');
					parent.displayMsgShapes(data);


				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});	


		},
		//function displayUnkShipShapes(data)
		displayMsgShapes: function(data)
		{
console.log(data);			
			var parent = this;
			parent.showMap();

			var geoJ = data[0].DAT
			//var rtnData = JSON.parse(data[0].DATA);
			var rtnData = JSON.parse(data[0].DATA);
			var sites = parent.messages;
			sites.clearLayers();
//console.log(JSON.stringify(rtnData))
			//var ele;
			//rtnData.geometries.forEach(function(ele){
			//	if(ele.type !== 'Multipolygon')
			//	{
			//		delete ele;
			//	}
			//})
			//var myObject = rtnData.geometries
			for(var prop in rtnData.geometries) {
				if(rtnData.geometries.hasOwnProperty(prop)) {
					if(rtnData.geometries[prop].type !== 'MultiPolygon') {
						delete rtnData.geometries[prop];
console.log('Deleted Something');
					}
				}
			}			

console.log(JSON.stringify(rtnData));
			var myGJson = new L.GeoJSON(rtnData, {
			  style: function(feature) {
				  return {color: "blue"}
			  }
			})
			//parent.drawnItemsGbl.addLayer(myGJson);
			sites.addLayer(myGJson);

/*
			var allMyShapes = [];
			data.forEach(function(n) 
			{ 
				var shapeData = JSON.parse(n.DATA);
				switch (shapeData.type) {
				  case 'Polygon':
console.log				  
					var a = shapeData.coordinates[0];
					var b = [];
					a.forEach(function(nr) { var newArr = nr.reverse(); b.push(newArr)});
					var polygon = L.polygon(b, {color: '#581845'});
					//polygon.addTo(theMap);
					allMyShapes.push(polygon);
					break;
				  case 'LineString':
					console.log('Found LineString');
					console.log(shapeData.coordinates);
					var a = shapeData.coordinates;
					var b = [];
					a.forEach(function(nr) { var newArr = nr.reverse(); b.push(newArr)});				
					var polyline = new L.Polyline(b, {
					color: 'blue',
					weight: 9,
					opacity: 0.5,
					smoothFactor: 1});
					//polyline.addTo(theMap);
					//allMyShapes.push(polyline);
					break; 				
				  case 'Point':
					console.log('Found Point');
					console.log(shapeData.coordinates);
					var a = shapeData.coordinates;
					var circCenter = a.reverse();				
					var circle = new L.circle(circCenter, 50, {
					color: 'green',
					weight: 9,
					opacity: 0.5,
					smoothFactor: 1});
					//circle.addTo(theMap);
					//allMyShapes.push(circle);
					break; 
				  default:
					console.log('Found Other');
					console.log(shapeData.type);
				}			
				
			});
			for(let layer of allMyShapes) {
				parent.drawnItemsGbl.addLayer(layer); 
			}
*/

			

			//parent.map.flyTo([theLat, theLon], 10)

		},
	//Plot SAM Site and SIGINT data 
	//LINE DATA
	///getTheLineData'
	
		getTheLineData: function() 
		{
			//MessageToast.show(JSON.stringify(params,null,2));
			var parent = this;
			parent.showMap();
			var searchField = parent.getView().byId("searchField");
			var qSearch = searchField.getValue();			
			

			if(typeof qSearch === 'undefined'){
				return false;
			}
			//var url = '/getUnknownShipFootprints?qDist='+qDist;
			var url = '/getTheLineData?qSearch='+qSearch;
			$.ajax({
				url: url,
				async: true,
				success: function(data) {
					parent.displayLineData(data);
					//parent.displayLineDataTest(data);


				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
					//sap.ui.core.BusyIndicator.hide();
				},
				complete: function()  {
					//sap.ui.core.BusyIndicator.hide();
				}
			});	


		},
/*
		displayLineDataOLD: function(data)
		{
			
			var parent = this;
			parent.drawnItemsGbl.clearLayers();
			var myGJson = new L.GeoJSON(data, {
			  style: function(feature) {
				  return {color: "blue"}
			  }
			})
			parent.drawnItemsGbl.addLayer(myGJson);

		//!!!!!!!!!!!!!!!!ANIMATION LEAVE ALONE ;-)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			data.features.forEach(function(feature,index,collection) {
			  setTimeout(function(){
				console.log('Again!');
				parent.map.flyTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 14);
				console.log(index * 1000);
				//self.insertDesignJsonObject(obj, index);
			  }, index * 1000); //index * 1000
			});

			
			

		},
*/
		displayLineData: function(data)
		{
			
			var parent = this;
			var sites = parent.messages;
			/*
			parent.drawnItemsGbl.clearLayers();
			var myGJson = new L.GeoJSON(data, {
			  style: function(feature) {
				  return {color: "blue"}
			  }
			})
			parent.messages.addLayer(myGJson);
			*/
			var lineContainer = [];
			var cntr = 1;
			var theLat;
			var theLon;
			data.features.forEach(function(feature) {
				var set = [];
				set.push(feature.geometry.coordinates[1]);
				set.push(feature.geometry.coordinates[0]);
				lineContainer.push(set);
				if(cntr < 2)
				{
					theLat = feature.geometry.coordinates[0];
					theLon = feature.geometry.coordinates[1];
					cntr += 1;
				}
				
			});
			parent.map.flyTo([theLon, theLat], 10);
			//var line = L.polyline([[40.68510, -73.94136], [40.68576, -73.94149], [40.68649, -73.94165]]);
			var line = L.polyline(lineContainer);
			
			//parent.map.addLayer(line);
			sites.addLayer(line);

			var animatedMarker = L.animatedMarker(line.getLatLngs());
			//parent.map.addLayer(animatedMarker);
			sites.addLayer(animatedMarker);

			var parent = this;
			//var sites = parent.messages;
			var myGJson = new L.geoJson(data, {

				onEachFeature: function(feature, sites) {
						var popupContent = feature.properties.Text;
						sites.bindPopup(popupContent);
				},
				
				pointToLayer: function(feature, sites) {
					return L.circleMarker(sites, {
					radius:10,
					opacity: .5,
					color: "#000",
					fillColor:  'white',
					fillOpacity: 0.8
					});
				}


			}); 
			sites.addLayer(myGJson);


		},		
		plotSamSite: function(data)
		{
			var parent = this;
			var theGroup = parent.samSites;
			var samIcon = L.icon({
				iconUrl: 'img/buddyicon04.png',
				iconSize: [15, 15]
			});
			//parent.samSites.clearLayers();

				var sites = parent.samSites;
				var myGJson = new L.geoJson(data, {

					onEachFeature: function(feature, sites) {
							var popupContent = feature.properties.Text;
							sites.bindPopup(popupContent);
					},
					
					pointToLayer: function(feature, sites) {
						return L.circleMarker(sites, {
						radius:6,
						opacity: .5,
						color: "#000",
						fillColor:  'red',
						fillOpacity: 0.8
						});
					}


				}); 
				sites.addLayer(myGJson);			
		},
		plotSigInt: function(data)
		{
			var parent = this;
			var theGroup = parent.samSites;
			var samIcon = L.icon({
				iconUrl: 'img/buddyicon04.png',
				iconSize: [15, 15]
			});
			//parent.sigInt.clearLayers();

				var sites = parent.sigInt;
				var myGJson = new L.geoJson(data, {

					onEachFeature: function(feature, sites) {
							var popupContent = feature.properties.Text;
							sites.bindPopup(popupContent);
					},
					
					pointToLayer: function(feature, sites) {
						return L.circleMarker(sites, {
						radius:feature.properties.Hits,
						opacity: 0.3,
						color: "#000",
						fillColor:  'blue',
						fillOpacity: 0.2
						});
					}


				}); 
				sites.addLayer(myGJson);			
		},
		plotSigIntEllipse: function(data)
		{
			var parent = this;
			var theGroup = parent.samSites;
			var samIcon = L.icon({
				iconUrl: 'img/buddyicon04.png',
				iconSize: [15, 15]
			});
			var sites = parent.sigInt;
			//parent.sigInt.clearLayers();
			/*
				var sites = parent.sigInt;
				var myGJson = new L.geoJson(data, {

					onEachFeature: function(feature, sites) {
							var popupContent = feature.properties.Text;
							sites.bindPopup(popupContent);
					},
					
					pointToLayer: function(feature, sites) {
						return L.circleMarker(sites, {
						radius:feature.properties.Hits,
						opacity: 0.3,
						color: "#000",
						fillColor:  'blue',
						fillOpacity: 0.2
						});
					}


				}); 
				sites.addLayer(myGJson);
			*/
			data.features.forEach(function(hit){
			  var ellipse = L.ellipse([hit.geometry.coordinates[1], hit.geometry.coordinates[0]], [parseFloat(hit.properties.SemiMajor), parseFloat(hit.properties.SemiMinor)], parseFloat(hit.properties.Orientation), {
				opacity: 0.7,
				color: "#000",
				fillColor:  'navy',
				fillOpacity: 0.7
			  }).bindPopup(hit.properties.Text); //.addTo(parent.map);
			  parent.sigInt.addLayer(ellipse);
			});
			
		},		
		drawStreetGraph: function(){
			var parent = this;
			var sites = parent.streets;
			var theLat;
			var theLon;
/*SAFE
			var data = parent.savedStreetData;
//console.log(JSON.stringify(data.geometries.coordinates[0],2,null));			
			data.geometries.forEach(function(geo){
				var latlngs = Array();
					latlngs.push(geo.coordinates[1].reverse());
					latlngs.push(geo.coordinates[0].reverse());
					theLat = geo.coordinates[1][0];
					theLon = geo.coordinates[0][1];
				var polyline = L.polyline(latlngs, {color: 'red'}).addTo(parent.map);
				//console.log('-----------------');
			});
			parent.map.flyTo([theLat, theLon], 10)
//SAFE*/
//TEST
			var data = parent.savedStreetData;
//console.log(JSON.stringify(data.geometries.coordinates[0],2,null));			
			var latLongs = []; 
			data.geometries.forEach(function(geo){
				var latlng = Array();
					latlng.push(geo.coordinates[1].reverse());
					latlng.push(geo.coordinates[0].reverse());
					latLongs.push(latlng);
					theLat = geo.coordinates[1][0];
					theLon = geo.coordinates[0][1];
					
				//var polyline = L.polyline(latlngs, {color: 'red'}).addTo(parent.map);
				//console.log('-----------------');
			});
			 // Creating poly line options
			 var multiPolyLineOptions = {color:'red'};
			 
			 // Creating multi poly-lines
			 var polyline = L.polyline(latLongs, multiPolyLineOptions);
			 
			 // Adding multi poly-line to map
			//polyline.addTo(parent.map);
			parent.streets.addLayer(polyline);
			parent.map.flyTo([theLat, theLon], 10)



			
			
//TEST
			//BRING BACK
			
				//var geoJ = data[0].DAT
				//var rtnData = JSON.parse(data[0].DATA);
				
	//console.log(JSON.stringify(rtnData))
				//var ele;
				//rtnData.geometries.forEach(function(ele){
				//	if(ele.type !== 'Multipolygon')
				//	{
				//		delete ele;
				//	}
				//})
				//var myObject = rtnData.geometries
				/*
				for(var prop in rtnData.geometries) {
					if(rtnData.geometries.hasOwnProperty(prop)) {
						if(rtnData.geometries[prop].type !== 'MultiPolygon') {
							delete rtnData.geometries[prop];
						}
					}
				}			
				*/
/*HERE IT WAS
				var myGJson = new L.GeoJSON(data, {
				  style: function(feature) {
					  return {color: "blue"}
				  }
				})



				
				parent.drawnItemsGbl.addLayer(myGJson);
				//parent.map.flyTo([theLat, theLon], 10)
*/				
			}		

//END MAP MESSAGE SECTION		
//
//END        
	});

	return FeatureUIController;

});