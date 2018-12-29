
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();

	var theme_chk = $('.theme_switch > input');
	if (theme == 'style_night') {
		theme_chk.prop('checked', true);
	}

	theme_chk.on('change', function () {
		//console.log($(this).is(':checked'));

		localStorage.setItem("theme", $(this).is(':checked') ? 'style_night':'style');

		setTimeout(function () {
			window.location.href = window.location.href;
		}, 500);
	});

});

$(document).click(function (event) {
	var clickover = $(event.target);
	var navbar = $(".navbar-collapse");
	var _opened = navbar.hasClass("show");
	if (_opened === true && !clickover.hasClass("navbar-toggle")) {
		navbar.collapse('hide');
	}
});

/*
validShares	5693
validBlocks	0
invalidShares	32
totalPaid	0
networkBlocks	304692
networkSols	76839
networkSolsString	76.84 KSol/s
networkDiff	592.1559346860262
networkConnections	30
networkVersion	/MagicBean:2.0.4-6/
networkProtocolVersion	170006
* */


function getMarketStats(ticker) {

	$.ajax({
		url: 'https://api.coinmarketcap.com/v2/ticker/'+ticker+'/?convert=BTC',
		dataType: 'json',
		success: function (cmc_json) {

			var usd = cmc_json.data.quotes.USD;
			var btc = cmc_json.data.quotes.BTC;
			var symbol = cmc_json.data.symbol;

			$('.'+symbol+'-statsMarketPriceUSD').text(usd.price.toFixed(2));
			$('.'+symbol+'-statsMarketPriceBTC').text(btc.price.toFixed(8));

			$('.'+symbol+'-btc1h').text(btc.percent_change_1h);
			$('.'+symbol+'-btc24h').text(btc.percent_change_24h);

			if (btc.percent_change_1h != 0)
			if (btc.percent_change_1h < 0) {
				$('.'+symbol+'-btc1hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-up').addClass('fa-arrow-down');
				$('.'+symbol+'-btc1hArrow').parent().removeClass('text-success').addClass('text-danger');
			} else {
				$('.'+symbol+'-btc1hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-down').addClass('fa-arrow-up');
			}


			if (btc.percent_change_24h != 0)
			if (btc.percent_change_24h < 0) {
				$('.'+symbol+'-btc24hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-up').addClass('fa-arrow-down');
				$('.'+symbol+'-btc24hArrow').parent().removeClass('text-success').addClass('text-danger');
			} else {
				$('.'+symbol+'-btc24hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-down').addClass('fa-arrow-up');
			}

			$('.'+symbol+'-statsMarketVolumeUSD').text(usd.volume_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			$('.'+symbol+'-statsMarketVolumeBTC').text(btc.volume_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

		}
	});
}
getMarketStats(2083); //BTG
getMarketStats(1698); //ZEN
getMarketStats(1447); //ZCL
getMarketStats(2912); //XSG
//getMarketStats(9999); //VDL
//getMarketStats(9999); //BZE
//getMarketStats(9999); //BZC
//getMarketStats(9999); //ZERC
getMarketStats(3029); //ZEL
//getMarketStats(9999); //SAFE
//getMarketStats(9999); //BTH


function getStats(coin) {

	pool = coin.toLowerCase();
	$('.loader-'+pool).addClass('fa-spin').show();

	$.ajax({
		url: 'https://'+pool+'.equihub.pro/api/stats',
		dataType: 'json',
		success: function(data) {

			if ((data.symbol == 'BZC'
				|| data.symbol == 'BTG'
				|| data.symbol == 'ZEN'
				|| data.symbol == 'ZCL'
				|| data.symbol == 'BTH') && data.name != 'solo-bth'

			) {
				coin = data.symbol.toLowerCase();
			} else {
				coin = data.name;
			}

			$('#poolFee-' + coin).text(data.poolFee);
			$('#statsBlocks-' + coin).text(data.poolStats.validBlocks);
			$('#statsMiners-' + coin).text(data.minerCount);
			$('#statsWorkers-' + coin).text(data.workerCount);
			$('#statsHashrate-' + coin).text(data.hashrateString);
			$('#statsLuckDays-' + coin).text(data.luckDays);


			var luckType = 'hours';
			var luckValue = data.luckHours;

			if (luckValue < 0.5) {
				luckValue = parseFloat(luckValue * 60).toFixed(0);
				luckType = 'minutes';
			} else {
				luckValue = parseFloat(luckValue).toFixed(1);
			}

			$('#statsLuckValue-' + coin).text(luckValue);
			$('#statsLuckType-' + coin).text(luckType);

			$('#statsNetworkSols-' + coin).text(data.poolStats.networkSolsString);
			$('#statsNetworkDiff-' + coin).text(parseFloat(data.poolStats.networkDiff).toFixed(2));
			$('#statsNetworkBlocks-' + coin).text(data.poolStats.networkBlocks);
			$('#statsNetworkConnections-' + coin).text(data.poolStats.networkConnections);
			$('#statsNetworkVersion-' + coin).text(data.poolStats.networkVersion);
			$('#statsNetworkProtocolVersion-' + coin).attr('data-original-title', data.poolStats.networkProtocolVersion);

			//console.log(data.symbol);
			//console.log(data.name);
			//console.log(coin);
			//console.log(pool);
			//console.log(data.poolStats);


			setTimeout(function (args) {
				$('.loader-'+coin).removeClass('fa-spin').hide()
			}, 500);

			$('.stats-progress-'+coin+' .progress-bar').addClass('progress-bar-animated').addClass('progress-bar-striped');

			setTimeout(function (args) {
				restartTimer(coin);
			}, 1000);
		},
		error: function() {
			//alert("Was unable to get info!");
		}
	});
}

function restartTimer(coin) {

	$('.stats-progress-'+coin+' .progress-bar').animate({width: "100%"}, 30000, function () {})
		.promise()
		.done(function(){
			$(this).removeClass('progress-bar-animated').removeClass('progress-bar-striped');
			$(this).css({width: "0"});
			getStats(coin);
		});
}

getStats('snowgem');
getStats('solo-xsg');
getStats('zelcash');
getStats('zeroclassic');
getStats('bzedge');
getStats('safecoin');
getStats('vidulum');
getStats('bzc');
getStats('btg');
getStats('zen');
getStats('zcl');
getStats('bth');
getStats('solo-bth');
