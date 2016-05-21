$(document)
	.ready(function() {

	var key = '781CF461BB6606ADEA01E0CAF8B35274746BD40916748CE0';
	var dataset = '2hr_nowcast'

	var url = 'http://www.nea.gov.sg/api/WebAPI?dataset=' + dataset + '&keyref=' + key;


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

	};
	////////////


	///Weather Forecast Abbreviation Interpretation List
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
	}

	$.ajax({
	  url: url,
	  type: 'GET',
	  success: function(data){
	  		var result = xmlToJson(data);
		

			///////////After Call	
			$('#show').html(result['channel']['description']['#text']);
			$('#title').html(result['channel']['item']['title']['#text']);
			$('#time').html(result['channel']['item']['validTime']['#text']);
			$('#source').html(result['channel']['source']['#text']);
			var length = result['channel']['item']['weatherForecast']['area'].length;
			for(var i=0; i<length; i++){
				//$('#loc').append(result['channel']['item']['weatherForecast']['area'][i]['@attributes']['name'] + '<br/>');
				//$('#fc').append(result['channel']['item']['weatherForecast']['area'][i]['@attributes']['forecast']+ '<br/>');
				var location = result['channel']['item']['weatherForecast']['area'][i]['@attributes']['name'];
				var forecast = result['channel']['item']['weatherForecast']['area'][i]['@attributes']['forecast'];
				$('tbody').append('<tr><td>' + location +  '</td><td>' + forecast_interpretation[forecast] + '</td></tr>')

			}
		}

	});








	///////////
	console.log(result)	

});

