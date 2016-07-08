$(document)
	.ready(function() {
	//variables declareation
	var key = '&keyref=' + '781CF461BB6606ADEA01E0CAF8B35274746BD40916748CE0';
	var dataset = '2hr_nowcast'
	var baseurl = 'http://www.nea.gov.sg/api/WebAPI?dataset='
	var url = baseurl + dataset  + key;
	var api_data = {};

	//Weather Forecast Abbreviation Interpretation List
	var forecast_interpretation = {
		'BR' : 'Mist',
		'CL' : 'Cloudy',
		'DR' : 'Drizzle',
		'FA' : 'Fair (Day)',
		'FG' : 'Fog',
		'FN' : 'Fair (Night)',
		'FW' : 'Fair & Warm',
		'HG' : 'Heavy Thundery Showers with Gusty Winds',
		'HR' : 'Heavy Rain',
		'HS' : 'Heavy Showers',
		'HT' : 'Heavy Thundery Shower',
		'HZ' : 'Hazy',
		'LH' : 'Slightly Hazy',
		'LR' : 'Light Rain',
		'LS' : 'Light Showers',
		'OC' : 'Overcast',
		'PC' : 'Partly Cloudy(Day)',
		'PN' : 'Partly Cloudy(Night)',
		'PS' : 'Passing Showers',
		'RA' : 'Moderate Rain',
		'SH' : 'Showers',
		'SK' : 'Strong Winds, Showers',
		'SN' : 'Snow',
		'SR' : 'Strong Winds, Rain',
		'SS' : 'Snow Showers',
		'SU' : 'Sunny',
		'SW' : 'Strong Winds',
		'TL' : 'Thundery Showers',
		'WC' : 'Windy, Cloudy',
		'WD' : 'Windy',
		'WF' :'Windy, Fair',
		'WR' : 'Windy, Rain',
		'WS' : 'Windy, Showers',
	//end forecast_interpretation
	};

	// Changes XML to JSON
	function xmlToJson(xml) {
		
		// Create the return object
		var obj = {};

		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = xmlToJson(item);
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		return obj;
	//end xmlToJson
	};

	var WeatherApi = function (baseurl, key) {
		//class to access weather API
		//initialisation
		this.baseurl = baseurl;
		this.key = key;
		this.dataset = 'not set';
		this.data = {};

		// callback functionto setData
		function setData(data){
			this.data = xmlToJson(data);
			api_data = this.data;
		//end setDate
		};

		// populate page with api query result
		this.populate = function(dataset, city){
			var city_index = '', cities = [];
			var length = this.data['channel']['item']['weatherForecast']['area'].length;
			if (dataset ==='2hr_nowcast'){
				for (var i=0; i < length; i++){
					//get dataset response for city
					if (this.data['channel']['item']['weatherForecast']['area'][i]['@attributes']['name'] == city){city_index=i; break;}
				}
				var location = this.data['channel']['item']['weatherForecast']['area'][city_index]['@attributes']['name'];
				var forecast = this.data['channel']['item']['weatherForecast']['area'][city_index]['@attributes']['forecast'];
				$('#table_content').html('<tr><td>' + location +  '</td><td>' + forecast_interpretation[forecast] + '</td></tr>');
				//List All cites and Forcast 
				for(var i=0; i< length; i++){
					var location = this.data['channel']['item']['weatherForecast']['area'][i]['@attributes']['name'];
					var forecast = this.data['channel']['item']['weatherForecast']['area'][i]['@attributes']['forecast'];
					$('#table_content').append('<tr><td>' + location +  '</td><td>' + forecast_interpretation[forecast] + '</td></tr>')

				}
			}
			else if ( dataset === '24hrs_forecast')
			{

			}

			else {
				var location = 'NULL ' + dataset;
				var forecast = 'NULL ' + dataset;
				$('#table_content').html('<tr><td>' + location +  '</td><td>' + forecast_interpretation[forecast] + '</td></tr>');
			}
			// List all cities in drop down of id cities
			for(var i=0; i<length; i++){
				cities.push(this.data['channel']['item']['weatherForecast']['area'][i]['@attributes']['name']);
				$('#cities').append('<option value="'+ cities[i] + '">' + cities[i] + '</option>');
			}
		//end populate
		};

		//get data from api
		this.callApi = function(dataset, city, populate){
			var url = this.baseurl + dataset + this.key;
			//ajax call of api
			$.ajax({
				url:url,
				success:function(data){
					setData(data);
					populate(dataset,city);
				}
			});
		//end callApi

		};
	//end WeatherApi class
	};
	/////////#####TESTING API
	var weatherApi = new WeatherApi(baseurl, key);
	var w = weatherApi;
	w.callApi('2hr_nowcast', 'Changi', w.populate);

	function populate(dataset, city) {
		var city_index = '';
		
		if (dataset ==='2hr_nowcast'){
			var length = api_data['channel']['item']['weatherForecast']['area'].length;
			for (var i=0; i < length; i++){
				//get dataset response for city
				if (api_data['channel']['item']['weatherForecast']['area'][i]['@attributes']['name'] === city){city_index=i; break;}
			}
			var location = api_data['channel']['item']['weatherForecast']['area'][city_index]['@attributes']['name'];
			var forecast = api_data['channel']['item']['weatherForecast']['area'][city_index]['@attributes']['forecast'];
			$('#table_content').html('<tr><td>' + location +  '</td><td>' + forecast_interpretation[forecast] + '</td></tr>');
			 
		}
		else if ( dataset === '24hrs_forecast')
		{

		}

		else {
			var location = 'NULL ' + dataset;
			var forecast = 'NULL ' + dataset;
			$('#table_content').html('<tr><td>' + location +  '</td><td>' + forecast_interpretation[forecast] + '</td></tr>');
		}
	//end populate
	};

	////show results on page
	
	$('#cities').on('change', function (){
		populate(dataset, $('#cities').val());
		console.log(api_data);
	});
	
	$('#data_set').on('change', function (){
		w.callApi($('#data_set').val(), $('#cities').val(), populate);
		console.log(api_data)
	});
	//end show results on page

	////////#####end TESTING API

//end document
	});