 
var PORT = process.env.port || 39999;
var express = require('express');

var app = express();
//Setup EJS
app.set('view engine', 'ejs');
//External resources style, image, script
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var config = require('./config.js');

var hdb    = require('@sap/hana-client');
var hdbext = require('@sap/hdbext');
/*
var client = hdb.createClient({
  host     : '3.220.81.75',
  port     : 30015,
  user     : 'SYSTEM',
  password : 'Password0'
});
*/
var client = hdb.createClient({
	serverNode: 'zeus.hana.prod.us-east-1.whitney.dbaas.ondemand.com:27190',
    UID: 'TENCAP_1_2A2SLCV1ES70KP3D9O1AERIGA_RT',
    PWD: 'Mw26lF4-R2vs2LU47huzv7Wyntzvuyzuval-g6HGkJEj3H0SvX6D_sPwEGKkQqkPWtL54YmUm.FN72H_-3aFdAl3JGQdXKLzrcHEY.FSj59XHIt9PuqqET0kAefaRzFD',	
    encrypt: true,  //Must be set to true when connecting to SAP HANA Cloud or HaaS.  
    sslValidateCertificate: true,  //Must be set to false when connecting
    ssltruststore: './trustTEN.pem',
	pooling: true
});


/* 	
** Routes Start Here
** First is the Home Page -- add Basic Auth later so order is king
*/
app.route('/')
	.get(function(req,res){
		res.render("home", {
		});
});
/* 	
** Data Routes / Web Services 
*/
/* 	
** Called to get service type e.g. Army, Air force, Navy, etc...
*/
app.route('/getServices')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var qSvcName = req.query.qSvcName; 
	
		if (client) {
			
			var sql = 'SELECT DISTINCT \"operator_service_type1\" AS \"ServiceType\"' + 
					  'FROM "TENCAP_1"."tencloud.tendata::BASES\"' +
					  'WHERE \"operator_service_type1\"  != \'\''
			
			//debug
			console.log(sql);
			//var graphOut = {nodes:{}, links:{}};
			var jStruct = {
				"serviceBranch": [],
				"baseData": [],
				"echelonData": [],

			}
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					jStruct.serviceBranch = rows;
				res.status(200).send(jStruct);
			  });
			});
		
		}	
		
});
/* 	
** Called to get service type e.g. Army, Air force, Navy, etc...
*/
app.route('/getBases')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var qSvcName = req.query.qSvcName; 
	
		if (client) {
			
			var sql = 'SELECT Distinct B."description" as \"Base\", A.\"id\" AS \"ID\"' +
					  'FROM "TENCAP_1"."tencloud.tendata::ORBAT" A, "TENCAP_1"."tencloud.tendata::BASES" B ' +
					  'WHERE A."id" = B."id" ' +
					  'AND B."description" != \'\' ' +
					  'AND B."operator_service_type1" = \'' + qSvcName + '\' ' + //--Variable
					  'ORDER BY B."description"';
			
			//debug
			console.log(sql);
			//var graphOut = {nodes:{}, links:{}};
			/*
			var jStruct = {
				"serviceBranch": [],
				"baseData": [],
				"echelonData": [],

			}
			*/
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					//jStruct.serviceBranch = rows;
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
/* 	
** Called to get service Order of Battle Data
*/
app.route('/getOrbatData')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
//getOrbatData?qBaseID='+qBaseID
		var qBaseID = req.query.qBaseID; 
	
		if (client) {
			
			var sql = 'SELECT B.\"title\" AS \"BASE\", A.\"id\", A.\"display_name\", A.\"echelon\", A.\"branch\", ' +
					  'A.\"unit_type\", A.\"unit_country\", A.\"domain\",A.\"domain_type\", A.\"status\", ' +
					  //Get Equipment
					  'A.\"equipment_id1\"||\',\'||A.\"equipment_id2\"||\',\'|| ' + 
					  'A.\"equipment_id3\"||\',\'||A.\"equipment_id4\"||\',\'|| ' +
					  'A.\"equipment_id5\"||\',\'||A.\"equipment_id6\"||\',\'|| ' +
					  'A.\"equipment_id7\"||\',\'||A.\"equipment_id8\" AS "equip_arr"' +
					  //End Get Equipment
					  'FROM "TENCAP_1"."tencloud.tendata::ORBAT" A, "TENCAP_1"."tencloud.tendata::BASES" B ' +
					  'WHERE A.\"id\" = B.\"id\" ' +
					  'AND A.\"id\" = \'' + qBaseID + '\'' + //--Variable
					  'ORDER BY B.\"title\"';
console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					//jStruct.serviceBranch = rows;
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});

/* 	
** Called to get service Order of Battle Data
*/
app.route('/getEquipData')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
//getOrbatData?qBaseID='+qBaseID
		var qEquipIDs = req.query.qEquipIDs; 
	
		if (client) {
			
			var sql = 'SELECT "parent","type1","type2","type3","role2" ' + 
					  'FROM "TENCAP_1"."tencloud.tendata::EQUIP" ' +
					  'WHERE "id" in (' + qEquipIDs + ')';
console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					//jStruct.serviceBranch = rows;
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});

//Search Section
/* 	
** Called on search to retrive data from descriptions 
*/
app.route('/getSearchData')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
//getOrbatData?qBaseID='+qBaseID
		var qSearch = req.query.qSearch; 
	
		if (client) {
//////////////////////////////////////WAS FROM SDE			
			var sql = 'SELECT \''+ qSearch + '\' AS QRY, TO_DECIMAL(SCORE(),3,2) AS SCORE, SNIPPETS("TEXT") AS SNIPPET, "ID" FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" ' +
					  'WHERE CONTAINS(\"TEXT\", \'' + qSearch + '\', FUZZY(0.8,\'similarCalculationMode=compare\'))  ' +               
					  'ORDER BY SCORE DESC  ' +
					  'limit 20 offset 0 ';


console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					//jStruct.serviceBranch = rows;
					rows.forEach(function(row) { row.SNIPPET = row.SNIPPET.replace('<b>','<strong>').replace('</b>','</strong>');console.log(row.SNIPPET);});
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
/* 	
** Called on search to retrive data from descriptions 
*/
app.route('/getDocumentData')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
//getOrbatData?qBaseID='+qBaseID
		var qSearch = req.query.qSearch; 
	
		if (client) {
////////////////////////WAS FROM SDE			
			var sql = 'SELECT A.TEXT, B.TA_TYPE || \'|\' ||B.TA_TOKEN \"ENTITY\" ' +  
					  'FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" A, "TENCAP_1"."$TA_tencloud.tendata::TENCAP_PS_INDEX" B ' +
					  'WHERE A."ID" = \'' + qSearch + '\' ' +
					  'AND A.ID = B.ID';
			
			//var sql = 'SELECT A.TWEET \"TWEET\", B.TA_TYPE || \'|\' ||B.TA_TOKEN \"ENTITY\" ' +
			//		  'FROM TWITTER_GRAPH.TWEETS A,\"TWITTER_GRAPH\".\"$TA_THETWEETINDEX_V2_VOC\" B ' +
			//		  'WHERE A.TID = \'' + qId + '\'' +
			//		  'AND A.TID = B.TID


console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					var currDoc = rows[0].TEXT;
					rows.forEach(function(n) { 
					 currDoc = highlightEntities(currDoc, n.ENTITY);
					});
console.log(currDoc);
					var rtn = [];
					var rtnDoc = {TEXT: currDoc}
					rtn.push(rtnDoc)
				//res.status(200).send(rows);
				res.status(200).send(rtn);
			  });
			});
		
		}	
		
});
/* 	
** Called on search to retrive data from descriptions 
** band bring back as GEOJSON
*/
////////////////USED By ESRI
app.route('/getSearchDataGeoJSON')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
//getOrbatData?qBaseID='+qBaseID
		var qSearch = req.query.qSearch; 
	
		if (client) {
			
			var sql = 'SELECT \'' + qSearch + '\' AS QRY, TO_DECIMAL(SCORE(),3,2) AS SCORE, SNIPPETS("TEXT") AS SNIPPET, "ID", GEOCOORD.ST_AsGEOJSON() AS "COORDS", "SOURCE" ' +
					  //'FROM "SDE"."ALL_TEXT" ' +
					  'FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" ' +
					  'WHERE CONTAINS("TEXT",\'' + qSearch + '\', FUZZY(0.6,\'similarCalculationMode=compare\')) ' +             
					  'ORDER BY SCORE DESC ' +
					  'limit 20 offset 0';


//console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					var allFeatures = {
										"type": "FeatureCollection",
										"features": []
									  };
					rows.forEach(function(row) { 
						var entry = {
								  "type": "Feature",
								  "geometry": {
									"type": "Point",
									"coordinates": [0, 0]
								  },
								  "properties": {
									"name": "",
									"description":'',
									"confidence": '',
									"surce": ''
								  }
						}
						entry.properties.name = qSearch;						
						row.SNIPPET = row.SNIPPET.replace('<b>','<strong>').replace('</b>','</strong>');console.log(row.SNIPPET);
						entry.properties.description  = row.SNIPPET;
						entry.properties.confidence  = row.SCORE;
						entry.properties.source  = row.SOURCE;						
						entry.geometry.coordinates[0] = JSON.parse(row.COORDS).coordinates[0];
						entry.geometry.coordinates[1] = JSON.parse(row.COORDS).coordinates[1];
						allFeatures.features.push(entry);
					});
					
				res.status(200).send(allFeatures);
			  });
			});
		
		}	
		
});
/* 	
** Called on search to retrive data from descriptions 
** band bring back as GEOJSON - 
*/
app.route('/getSearchDataWithinDistanceGeoJSON')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
//getOrbatData?qBaseID='+qBaseID
		var qSearch = req.query.qSearch;
		var qDist = req.query.qDist;
		var qPoint = req.query.qPoint;
	
		if (client) {
			
			var sql = 'SELECT \'' + qSearch + '\' AS QRY, TO_DECIMAL(SCORE(),3,2) AS SCORE, SNIPPETS("TEXT") AS SNIPPET, "ID", GEOCOORD.ST_AsGEOJSON() AS "COORDS", "SOURCE" ' +
					  //'FROM "SDE"."ALL_TEXT" ' +
					  'FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" ' +
					  'WHERE CONTAINS("TEXT",\'' + qSearch + '\', FUZZY(0.6,\'similarCalculationMode=compare\')) ' +             
					  'AND "GEOCOORD".ST_DISTANCE(New ST_POINT(\'POINT(' + qPoint + ')\', 4326),\'kilometer\') < ' + qDist +
					  ' ORDER BY SCORE DESC ' +
					  'limit 20 offset 0';


console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					var allFeatures = {
										"type": "FeatureCollection",
										"features": []
									  };

					rows.forEach(function(row) { 
						var entry = {
								  "type": "Feature",
								  "geometry": {
									"type": "Point",
									"coordinates": [0, 0]
								  },
								  "properties": {
									"name": "",
									"description":'',
									"confidence": '',
									"surce": ''
								  }
						}
						entry.properties.name = qSearch;						
						row.SNIPPET = row.SNIPPET.replace('<b>','<strong>').replace('</b>','</strong>');console.log(row.SNIPPET);
						entry.properties.description  = row.SNIPPET;
						entry.properties.confidence  = row.SCORE;
						entry.properties.source  = row.SOURCE;						
						entry.geometry.coordinates[0] = JSON.parse(row.COORDS).coordinates[0];
						entry.geometry.coordinates[1] = JSON.parse(row.COORDS).coordinates[1];
						allFeatures.features.push(entry);
					});
					
				res.status(200).send(allFeatures);
			  });
			});
		
		}	
		
});
//TREEVIEW results for all bases and 
/* 
**	
** Called on by D3 TreeView to show all Data 
**  
*/
app.route('/getTreeViewAllBasesOrbatsEquip')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
	
		if (client) {
			
			var sql = 'SELECT A."branch", B."title" AS "BASE", A."id", A."display_name", A."echelon", ' +
							'A."unit_type", A."unit_country", A."domain",A."domain_type", A."status", ' +
							'C."parent",C."type1",C."type2",C."type3",C."role2" ' +
							'FROM "TENCAP_1"."tencloud.tendata::ORBAT" A, "TENCAP_1"."tencloud.tendata::BASES" B,"TENCAP_1"."tencloud.tendata::EQUIP" C  ' +
							'WHERE A."id" = B."id" ' +
							'and ' +
							'(C."id" = A."equipment_id1" or C."id"= A."equipment_id2" ' + 
							'or C."id" = A."equipment_id3" or C."id"= A."equipment_id4"  ' +
							'or  C."id" = A."equipment_id5" or C."id"= A."equipment_id6" ' +
							'or  C."id" = A."equipment_id7" or C."id"= A."equipment_id8"  ) ' +
							'ORDER BY A."branch", B."title" ';


console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
/* 
**	
** Called on by to show all equipment Data within a polygon 
**  
*/
app.route('/getTreeViewAllGeoBasesOrbatsEquip')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');
		
		var qSearch = req.query.qSearch;
		//var qDist = req.query.qDist;
		var qPoly = req.query.qPoly;
	
		if (client) {
			
			var sql = 'SELECT A."branch", B."title" AS "BASE", B."GEOCOORD".ST_asWKT(), A."id", A."display_name", A."echelon", ' + 
						'A."unit_type", A."unit_country", A."domain",A."domain_type", A."status", ' +
						//'C."parent",C."type1",C."type2",C."type3",C."role2" ' +
						'C."parent",C."type1",C."type2",C."type3",\'IMG-Date-11-19-22\' AS "role2" ' +
						'FROM "TENCAP_1"."tencloud.tendata::ORBAT" A, "TENCAP_1"."tencloud.tendata::BASES" B,"TENCAP_1"."tencloud.tendata::EQUIP" C ' +
						'WHERE A."id" = B."id" ' +
						'AND ' +
						'(C."id" = A."equipment_id1" or C."id"= A."equipment_id2"  ' +
						'or C."id" = A."equipment_id3" or C."id"= A."equipment_id4"  ' +
						'or  C."id" = A."equipment_id5" or C."id"= A."equipment_id6" ' +
						'or  C."id" = A."equipment_id7" or C."id"= A."equipment_id8"  ) ' +
						'AND C."parent" LIKE \'' + qSearch +'\' ' +
						'AND B.GEOCOORD.ST_SRID(4326).ST_TRANSFORM(1000004326).ST_WITHIN(NEW ST_POLYGON(\'Polygon(('+ qPoly +'))\',4326).ST_TRANSFORM(1000004326)) = 1 ' +
						'ORDER BY A."branch", B."title"';


console.log(sql);					  
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  client.exec(sql, function (err, rows) {
				client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
/* 	
** Return List of all countries
*/
app.route('/getCountry')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		//var qGroup = req.query.qType; 
	
		if (client) {
			
			var sql =     'SELECT DISTINCT "COUNTRY" FROM "TENCAP_1"."tencloud.tendata::ACLED"'; 
			
			//debug
			console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
//SAM SITES
//SAM SITES ON THE MAP
/* 	
** Return line of documents headed to launch site
*/
app.route('/getTheSamSites')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		var qSearch = req.query.qSearch; 
	
		if (client) {
			
			var sql =   'SELECT '+ 
						'"TYPE","INSTALLATION_STATUS","CONFIDENCE","PRIMARY_EQUIPMENT_NAME", '+
						'"NUMBER_OF_ITEMS1","RANGE_IN_METERS1","EQUIPMENT_TYPE1","SITE_LAYOUT", '+
						'"SYSTEM_PERMANENCE","LONGITUDE1","LATITUDE1" '+
						'FROM "TENCAP_1"."tencloud.tendata::RUSSIAN_SAM_SITES"';
			
			//debug
console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
					var allFeatures = {
										"type": "FeatureCollection",
										"features": []
									  };

					rows.forEach(function(row) { 
						var popUpHTML = '<div class="samSite"><b> Type: </b>'+ row.TYPE +
										'<br/><b>Status: </b>'+ row.INSTALLATION_STATUS +
										'<br/><b>Conf.: </b>'+ row.CONFIDENCE +
										'<br/><b>Equip Name: </b>'+ row.PRIMARY_EQUIPMENT_NAME + 
										'<br/><b>Items: </b>'+ row.NUMBER_OF_ITEMS1 +
										'<br/><b>Range Mtrs: </b>'+ row.RANGE_IN_METERS1 +
										'<br/><b>Equip SubType: </b>'+ row.EQUIPMENT_TYPE1 +
										'<br/><b>Layout: </b>'+ row.SITE_LAYOUT +
										'<br/><b>Permamence: </b>'+ row.SYSTEM_PERMANENCE + '</div>'
						var entry = {
								  "type": "Feature",
								  "geometry": {
									"type": "Point",
									"coordinates": [0, 0]
								  },
								  "properties": {
									"Text": popUpHTML
								  }
						}


						entry.properties.Text  = popUpHTML;
						entry.geometry.coordinates[1] = row.LONGITUDE1;
						entry.geometry.coordinates[0] = row.LATITUDE1;
						allFeatures.features.push(entry);
					});
					
				res.status(200).send(allFeatures);				
			  });
			});
		
		}	
		
});
/* 	
** Return SigInt Hits for Ellipse
*/
app.route('/getTheSigIntEllipse')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		var qSearch = req.query.qSearch; 
	
		if (client) {
			
			var sql =   'SELECT SOI, SEMI_MAJOR, SEMI_MINOR, ORIENTATIO, NUM_BURSTS, LATITUDE, LONGITUDE ' +
						'FROM "TENCAP_1"."tencloud.tendata::HAWKEYE_SIGINT"';
			
			//debug
console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
					var allFeatures = {
										"type": "FeatureCollection",
										"features": []
									  };

					rows.forEach(function(row) { 
						/*REMOVE Burst calculation
							var hitPct; 
							//(Math.round((row.NUM_BURSTS/816)*100) < 1 ? 1 : (Math.round((row.NUM_BURSTS/816)*100)
							if (Math.round((row.NUM_BURSTS/816)*100) < 1)
							{
							  hitPct = 1;
							}else{
							  hitPct = Math.round((row.NUM_BURSTS/816)*100);
							}
						*/
						var popUpHTML = '<div class="sigInt"><b> SOI: </b>'+ row.SOI +
										'<br/><b>Semi Major: </b>'+ row.SEMI_MAJOR +
										'<br/><b>Semi Minor: </b>'+ row.SEMI_MINOR +
										'<br/><b>Orientation: </b>'+ row.ORIENTATIO + 
										'<br/><b># Burts: </b>'+ row.NUM_BURSTS +
										'<br/><b>Latitude: </b>'+ row.LATITUDE +
										'<br/><b>Longitude: </b>'+ row.LONGITUDE + '</div>';
						//var voteable = (age < 18) ? "Too young":"Old enough";
						
						var entry = {
								  "type": "Feature",
								  "geometry": {
									"type": "Point",
									"coordinates": [0, 0]
								  },
								  "properties": {
									"Text": popUpHTML,
									"SemiMajor": row.SEMI_MAJOR,
									"SemiMinor": row.SEMI_MINOR,
									"Orientation": row.ORIENTATIO
									
								  }
						};


						entry.properties.Text  = popUpHTML;
						entry.geometry.coordinates[1] = row.LONGITUDE;
						entry.geometry.coordinates[0] = row.LATITUDE;
						allFeatures.features.push(entry);
					});
					
				res.status(200).send(allFeatures);				
			  });
			});
		
		}	
		
});
/* 	
** Data Routes / Web Services 
*/
/* 	
** Called by Street Data drawing routine
*/

app.route('/getAllNodesStreet')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var polyStr = req.query.polyStr;
		var qCtyName = req.query.qCtyName; 
console.log('Made it In');	
		if (client) {
			
			var sql = '';
			if(qCtyName == 'Annandale VA')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"ANNANDALE_VA_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"ANNANDALE_VA_EDGES\"';
			}
			if(qCtyName == 'Baghdad Iraq')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"BAGHDAD_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"BAGHDAD_EDGES\"';
			}			
			if(qCtyName == 'Maiduguri Nigeria')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"MAIDUGURI_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"MAIDUGURI_EDGES\"';
			
			}
			if(qCtyName == 'BBOX')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM "TENCAP_1"."tencloud.tendata::BBOX_NODES"';
				sqlEdges =	  'SELECT GEOMETRY FROM "TENCAP_1"."tencloud.tendata::BBOX_EDGES"';
			
			}			
			//debug
console.log(sqlEdges);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sqlEdges, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
//
				var allFeatures = {
								  "type": "GeometryCollection",
								  "geometries": [
								  ]
								  };

				rows.forEach(function(row) { 
				//  "GEOMETRY": "LINESTRING (36.7952555 55.850799, 36.789885 55.8518127)"
					var initialString = row.GEOMETRY;
					var coords = initialString.substring(initialString.indexOf('\(')+1,initialString.substring(initialString.length-1));
					var coords = initialString.replace('LINESTRING (','').replace(')','');
					var coordZero =  coords.split(',')[0].trim();
					
					var coordZeroArray = [];
						coordZeroArray.push(parseFloat(coordZero.split(' ')[0]));
						coordZeroArray.push(parseFloat(coordZero.split(' ')[1]));
						
					var coordOne =  coords.split(',')[1].trim();
					var coordOneArray = [];
						coordOneArray.push(parseFloat(coordOne.split(' ')[0]));
						coordOneArray.push(parseFloat(coordOne.split(' ')[1]));
						
					var entry = {
					 "TYPE": "LineString",
					 "coordinates": [
					   coordZeroArray,
					   coordOneArray
					 ]
				   };


					//entry.properties.Text  = popUpHTML;
					//entry.geometry.coordinates[1] = row.LONGITUDE;
					//entry.geometry.coordinates[0] = row.LATITUDE;
					allFeatures.geometries.push(entry);
				});
				res.status(200).send(allFeatures);
//
			  });
			});
		
		}	
		
});
/* 	
** Return List of all groups
*/
app.route('/getGroups')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		var qCountry = req.query.qCountry; 
	
		if (client) {
			
			var sql =     'SELECT DISTINCT "ACTOR_1" FROM "TENCAP_1"."tencloud.tendata::ACLED" WHERE "COUNTRY" = \'' + qCountry + '\''; 
			
			//debug
console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
//HEXAGON SERVICES
/* 	
** Return HEX Data for various groups
*/
app.route('/getEscapeData')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var polyStr = req.query.polyStr;
		var qGroup = req.query.qGroup; 
	
		if (client) {
			
/*
			var sql =     'SELECT  ' +
						  '		\'HEXID-\'|| ST_CLUSTERID() AS HEXID, ' +
						  '		ST_CLUSTERCELL().ST_ASGEOJSON() AS HEXCELL,  ' +
						  '		ST_CLUSTERCELL().ST_CENTROID().ST_ASGEOJSON() AS HEXCENTROID ' +
						  '	FROM (SELECT "GEOCOORD" AS PT FROM "TENCAP"."ACLED" where "ACTOR_1" = \'' + qGroup + '\') ' +
						  '	GROUP CLUSTER BY PT USING HEXAGON X CELLS 250 ';
*/
			var sql =	'SELECT \'HEXID-\'|| ST_CLUSTERID() AS HEXID, ST_CLUSTERCELL().ST_SRID(1000004326).ST_TRANSFORM(4326).ST_ASGEOJSON() AS HEXCELL, ' + 
						'ST_CLUSTERCELL().ST_CENTROID().ST_SRID(1000004326).ST_TRANSFORM(4326).ST_ASGEOJSON() AS HEXCENTROID ' + 
						'FROM (SELECT GEOCOORD.ST_SRID(4326).ST_TRANSFORM(1000004326) AS PT FROM "TENCAP_1"."tencloud.tendata::ACLED" where "ACTOR_1" = \'' + qGroup + '\')  ' +   
						'GROUP CLUSTER BY PT USING HEXAGON X CELLS 250'			  
			
			//debug
			console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
//GRAPH SECTION
/**
** Called by createGraph 
*/
app.route('/createGraph')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var uuid = req.query.uuid;
		var qSearch = req.query.qSearch;
		var hanaConfig = {
			serverNode: 'zeus.hana.prod.us-east-1.whitney.dbaas.ondemand.com:27190',
			UID: 'TENCAP_1_2A2SLCV1ES70KP3D9O1AERIGA_RT',
			PWD: 'Mw26lF4-R2vs2LU47huzv7Wyntzvuyzuval-g6HGkJEj3H0SvX6D_sPwEGKkQqkPWtL54YmUm.FN72H_-3aFdAl3JGQdXKLzrcHEY.FSj59XHIt9PuqqET0kAefaRzFD',	
			encrypt: true,  //Must be set to true when connecting to SAP HANA Cloud or HaaS.  
			sslValidateCertificate: true,  //Must be set to false when connecting
			ssltruststore: './trustTEN.pem',
			pooling: true
		};
		hdbext.createConnection(hanaConfig, function(error, client) { 
		  if (error) { 
			return console.error(error); 
		  } 
				
				//hdbext.loadProcedure(client, '', 'GET_GRAPH_DATA_TT', function(err, proc) { 
				hdbext.loadProcedure(client, 'TENCAP_1', "tencloud.tendata::GET_GRAPH_DATA_TT_LOCAL", function(err, proc) {
				if (err) { 
					  return console.error(err); 
				} 				
				  proc({ THEQRY: qSearch }, function(err, parameters, nodeRows, edgeRows) { 
					if (err) { 
					  return console.error(err); 
					} 

					//console.log('C:', parameters.THEQRY); 
					//console.log('Nodes:', nodeRows); 
					//console.log('Edges:', edgeRows);
					var result = [];
					result.push(nodeRows);
					result.push(edgeRows);
					res.status(200).send(result);
					client.end();
				  }); 
				}); 		
		});		

});
//MESSAGES ON THE MAP
/* 	
** Return clusters of document via the Search term
*/
app.route('/getMsgFootprints')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		var qSearch = req.query.qSearch; 
	
		if (client) {
			
			var sql =   'SELECT st_unionAggr("cluster").ST_ASGEOJSON() AS DATA from ( ' +
						'SELECT "cluster_id", st_unionAggr("GEOCOORD").ST_AlphaShape(0.55) as "cluster" ' +
						'from ( ' +
						'SELECT ' +
						'  ST_ClusterID() OVER (CLUSTER BY "GEOCOORD" USING DBSCAN EPS 0.05 MINPTS 6) AS "cluster_id", ' +
						'  "GEOCOORD" ' +
						'FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" ' +
						//--WHERE "GEOCOORD".ST_SRID(4326).ST_Distance(NEW ST_Point(37.365300, 55.452600).st_srid(4326),'kilometer') < 10000
						'ORDER BY 1 ' +
						') ' +
						'where "cluster_id" <> 0 ' +
						'group by "cluster_id")';
			
						/*
						'SELECT st_unionAggr("cluster").ST_SRID(1000004326).ST_TRANSFORM(4326).ST_asGEOJSON() AS DATA from ( ' +
						//var sql =   'SELECT st_unionAggr("cluster").ST_asGEOJSON() AS DATA from ( ' +
						'SELECT "cluster_id", st_unionAggr("GEOCOORD").ST_AlphaShape(0.055) as "cluster" ' +
						'from ( ' +
						'SELECT ' +
						'  ST_ClusterID() OVER (CLUSTER BY "GEOCOORD" USING DBSCAN EPS 0.001 MINPTS 2) AS "cluster_id", ' +
						'  "GEOCOORD" ' +
						'FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" ' +
						'WHERE "GEOCOORD" IS NOT NULL ' +
						'ORDER BY 1 ' +
						') ' +
						'where "cluster_id" <> 0 ' +
						'group by "cluster_id"); ';
						*/

			
			//debug
console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
				
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
//TEST a better solution - same as above.. but without KMEANS
/* 	
** Return clusters of document via the Search term
*/
app.route('/getMsgFootprintsSimple')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		var qSearch = req.query.qSearch; 
	
		if (client) {
			
			var sql =   'SELECT ST_UnionAggr( ' +
						'"GEOCOORD".ST_AlphaShape(0.055).ST_ConvexHull()).ST_SRID(1000004326).ST_TRANSFORM(4326).ST_asGEOJSON() AS DATA ' +
						'FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" ' + 
						'WHERE CONTAINS("TEXT", \'' + qSearch + '\', FUZZY(0.8,\'similarCalculationMode=compare\')) ' +
						//AND "SOURCE" LIKE \'DEMO_DATA_ACME%' ' +
						'AND "GEOCOORD" IS NOT NULL';
			
			//debug
console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
				
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});
//MESSAGES ON THE MAP
/* 	
** Return line of documents headed to launch site
*/
app.route('/getTheLineData')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		var qSearch = req.query.qSearch; 
	
		if (client) {
			
			var sql =   'SELECT ID,TEXT, GEOCOORD.ST_SRID(1000004326).ST_TRANSFORM(4326).ST_X() AS LON, GEOCOORD.ST_SRID(1000004326).ST_TRANSFORM(4326).ST_Y() AS LAT, SOURCE ' +
						'FROM "TENCAP_1"."tencloud.tendata::ALL_TEXT_MARS" ' +
						'WHERE CONTAINS("TEXT", \'"S-400"\', FUZZY(0.8,\'similarCalculationMode=compare\')) ' +
						'AND GEOCOORD is not null ' +
						'AND SOURCE = \'DEMO_DATA_ACME_NEWS\' ' +
						'ORDER BY GEOCOORD.ST_X() DESC';
			
			//debug
console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
					var allFeatures = {
										"type": "FeatureCollection",
										"features": []
									  };

					rows.forEach(function(row) { 
						var popUpHTML = row.TEXT;
							popUpHTML = popUpHTML.replace('From:','<b>From: </b>');
							popUpHTML = popUpHTML.replace('To:','<b>To: </b>');
							popUpHTML = popUpHTML.replace('Local HUMINT indicates:','<b>Local HUMINT Indicates: </b>');
							popUpHTML = popUpHTML.replace('Intel indicates:','<b>Intel indicates: </b>');
							
						var entry = {
								  "type": "Feature",
								  "geometry": {
									"type": "Point",
									"coordinates": [0, 0]
								  },
								  "properties": {
									"ID": "",
									"Text":'',
									"SOURCE": ''

								  }
						}
						//entry.properties.name = qSearch;						
						//row.SNIPPET = row.SNIPPET.replace('<b>','<strong>').replace('</b>','</strong>');console.log(row.SNIPPET);
						entry.properties.ID  = row.ID;
						entry.properties.Text  = popUpHTML;
						entry.properties.Source  = row.SOURCE;						
						entry.geometry.coordinates[0] = JSON.parse(row.LON);
						entry.geometry.coordinates[1] = JSON.parse(row.LAT);
						allFeatures.features.push(entry);
					});
					
				res.status(200).send(allFeatures);				
				//res.status(200).send(rows);
			  });
			});
		
		}	
		
});
/* 	
** Called by polygon drawing routine
*/
app.route('/getAllNodes')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var polyStr = req.query.polyStr;
		var qCtyName = req.query.qCtyName; 
	
		if (client) {
			
			var sql = '';
			if(qCtyName == 'Annandale VA')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"ANNANDALE_VA_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"ANNANDALE_VA_EDGES\"';
			}
			if(qCtyName == 'Baghdad Iraq')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"BAGHDAD_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"BAGHDAD_EDGES\"';
			}			
			if(qCtyName == 'Maiduguri Nigeria')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"MAIDUGURI_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"MAIDUGURI_EDGES\"';
			
			}
			if(qCtyName == 'BBOX')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"BBOX_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"BBOX_EDGES\"';
			
			}			
			//debug
			//console.log(sql);
			var graphOut = {nodes:{}, links:{}};
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sqlNodes, function (err, rows) {
				//client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					graphOut.nodes = rows;
					client.exec(sqlEdges, function (err, links) {
						client.end();
						if (err) {
						  return console.error('Execute error:', err);
						}
						graphOut.links = links;
						res.status(200).send(graphOut);
					});
				
				//res.status(200).send(graphOut);
			  });
			});
		
		}	
		
});

/* 	
** Return HEX Data for various countries
*/
app.route('/getEscapeDataCountry')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var polyStr = req.query.polyStr;
		var qGroup = req.query.qGroup; 
	
		if (client) {
			
			var sql =     'SELECT  ' +
						  '		\'HEXID-\'|| ST_CLUSTERID() AS HEXID, ' +
								'ST_CLUSTERCELL().ST_SRID( 4326).ST_TRANSFORM(1000004326).ST_SRID(1000004326).ST_TRANSFORM(4326).ST_ASGEOJSON() AS HEXCELL, ' +
								'ST_CLUSTERCELL().ST_SRID( 4326).ST_TRANSFORM(1000004326).ST_CENTROID().ST_SRID(1000004326).ST_TRANSFORM(4326).ST_ASGEOJSON() AS HEXCENTROID ' +   
						  '	FROM (SELECT "geolocation" AS PT FROM "TENCAP"."ACLED" where "country" = \'' + qGroup + '\') ' +
						  '	GROUP CLUSTER BY PT USING HEXAGON X CELLS 250 ';
			
			//debug
			console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
				res.status(200).send(rows);
			  });
			});
		
		}	
		
});

//SigInt Hits
//SigInt Hits ON THE MAP
/* 	
** Return SigInt Hits 
*/
app.route('/getTheSigInt')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		//var polyStr = req.query.polyStr;
		var qSearch = req.query.qSearch; 
	
		if (client) {
			
			var sql =   'SELECT SOI, SEMI_MAJOR, SEMI_MINOR, ORIENTATIO, NUM_BURSTS, LATITUDE, LONGITUDE ' +
						'FROM "TENCAP"."HAWKEYE_SIGINT"';
			
			//debug
console.log(sql);

			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sql, function (err, rows) {
				client.end();
				if (err) {
				  return console.error('Execute error:', err);
				}
					var allFeatures = {
										"type": "FeatureCollection",
										"features": []
									  };

					rows.forEach(function(row) { 
						var hitPct; 
						//(Math.round((row.NUM_BURSTS/816)*100) < 1 ? 1 : (Math.round((row.NUM_BURSTS/816)*100)
						if (Math.round((row.NUM_BURSTS/816)*100) < 1)
						{
						  hitPct = 1;
						}else{
						  hitPct = Math.round((row.NUM_BURSTS/816)*100);
						}
						
						var popUpHTML = '<div class="sigInt"><b> SOI: </b>'+ row.SOI +
										'<br/><b>Semi Major: </b>'+ row.SEMI_MAJOR +
										'<br/><b>Semi Minor: </b>'+ row.SEMI_MINOR +
										'<br/><b>Orientation: </b>'+ row.ORIENTATIO + 
										'<br/><b># Burts: </b>'+ row.NUM_BURSTS +
										'<br/><b>Latitude: </b>'+ row.LATITUDE +
										'<br/><b>Longitude: </b>'+ row.LONGITUDE + '</div>';
						//var voteable = (age < 18) ? "Too young":"Old enough";
						
						var entry = {
								  "type": "Feature",
								  "geometry": {
									"type": "Point",
									"coordinates": [0, 0]
								  },
								  "properties": {
									"Text": popUpHTML,
									"Hits": hitPct
								  }
						};


						entry.properties.Text  = popUpHTML;
						entry.geometry.coordinates[1] = row.LONGITUDE;
						entry.geometry.coordinates[0] = row.LATITUDE;
						allFeatures.features.push(entry);
					});
					
				res.status(200).send(allFeatures);				
			  });
			});
		
		}	
		
});


/* 	
** Data Routes / Web Services 
*/
/* 	
** Called by polygon drawing routine
*/
/*
app.route('/getAllNodesStreet')
	.get(function(req,res){
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Headers', 'accept,origin,authorization,content-type');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Origin', '*');

		var polyStr = req.query.polyStr;
		var qCtyName = req.query.qCtyName; 
	
		if (client) {
			
			var sql = '';
			if(qCtyName == 'Annandale VA')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"ANNANDALE_VA_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"ANNANDALE_VA_EDGES\"';
			}
			if(qCtyName == 'Baghdad Iraq')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"BAGHDAD_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"BAGHDAD_EDGES\"';
			}			
			if(qCtyName == 'Maiduguri Nigeria')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"PYTHON_STREET_GRAPH\".\"MAIDUGURI_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"PYTHON_STREET_GRAPH\".\"MAIDUGURI_EDGES\"';
			
			}
			if(qCtyName == 'BBOX')
			{
				sqlNodes = 	  'SELECT OSMID, Y, X FROM \"TENCAP\".\"BBOX_NODES\"';
				sqlEdges =	  'SELECT U \"FROM\",V \"TO\" FROM \"TENCAP\".\"BBOX_EDGES\"';
			
			}			
			//debug
			//console.log(sql);
			var graphOut = {nodes:{}, links:{}};
			client.connect(function (err) {
			  if (err) {
				return console.error('Connect error', err);
			  }
			  //client.exec('select * from DUMMY', function (err, rows) {
			  client.exec(sqlNodes, function (err, rows) {
				//client.end();
					if (err) {
					  return console.error('Execute error:', err);
					}
					graphOut.nodes = rows;
					client.exec(sqlEdges, function (err, links) {
						client.end();
						if (err) {
						  return console.error('Execute error:', err);
						}
						graphOut.links = links;
						res.status(200).send(graphOut);
					});
				
				//res.status(200).send(graphOut);
			  });
			});
		
		}	

});
*/

//END ESSAGES ON THE MAP
//Highlight function
function highlightEntities(doc, entity){
	if(entity.length !== 0){
	   //$('.searchable').each(function(){
	   var search_value = entity.split('|')[1];
	   var search_regexp = new RegExp(search_value, "g");
	   doc = doc.replace(search_regexp,"<span class='highlight' title=\"" + entity.split('|')[0] + "\">" + search_value + "</span>");
	 //});
	 
	}
//console.log(doc);
	return doc;
	
}	

//JSON Helper function
function getValueByKey(key, data) {
    var i, len = data.length;
    
    for (i = 0; i < len; i++) {
        if (data[i] && data[i]['SENTIMENT']==key) {
            return data[i]['COUNT'];
        }
    }
    
    return -1;
}

/* 	
** Start Express Server on specified port 
*/
var server = app.listen(PORT, function(){
	
});
