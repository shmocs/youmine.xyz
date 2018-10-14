
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();

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

			$('#statsMarket'+symbol+'PriceUSD').text(usd.price.toFixed(2));
			$('#statsMarket'+symbol+'PriceBTC').text(btc.price.toFixed(8));

			$('#'+symbol+'btc1h').text(btc.percent_change_1h);
			$('#'+symbol+'btc24h').text(btc.percent_change_24h);

			if (btc.percent_change_1h != 0)
			if (btc.percent_change_1h < 0) {
				$('#'+symbol+'btc1hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-up').addClass('fa-arrow-down');
				$('#'+symbol+'btc1hArrow').parent().removeClass('text-success').addClass('text-danger');
			} else {
				$('#'+symbol+'btc1hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-down').addClass('fa-arrow-up');
			}


			if (btc.percent_change_24h != 0)
			if (btc.percent_change_24h < 0) {
				$('#'+symbol+'btc24hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-up').addClass('fa-arrow-down');
				$('#'+symbol+'btc24hArrow').parent().removeClass('text-success').addClass('text-danger');
			} else {
				$('#'+symbol+'btc24hArrow').removeClass('fa-arrow-right').removeClass('fa-arrow-down').addClass('fa-arrow-up');
			}

			$('#statsMarket'+symbol+'VolumeUSD').text(usd.volume_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			$('#statsMarket'+symbol+'VolumeBTC').text(btc.volume_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

		}
	});
}
getMarketStats(2912); //XSG
getMarketStats(3029); //ZEL


function getStats(coin) {

	$('.loader'+coin).addClass('fa-spin').show();

	if (coin == 'XSG') {
		pool = 'snowgem';
	} else if (coin == 'ZEL') {
		pool = 'zelcash';
	} else {
		pool = coin.toLowerCase();
	}

	$.ajax({
		url: 'https://'+pool+'.youmine.xyz/api/stats',
		dataType: 'json',
		success: function(data) {

			$('#statsBlocks' + data.symbol).text(data.poolStats.validBlocks);
			$('#statsMiners' + data.symbol).text(data.minerCount);
			$('#statsWorkers' + data.symbol).text(data.workerCount);
			$('#statsHashrate' + data.symbol).text(data.hashrateString);
			$('#statsLuckDays' + data.symbol).text(data.luckDays);
			$('#statsLuckHours' + data.symbol).text(parseFloat(data.luckHours).toFixed(1));

			if (data.name == 'snowgem' || data.name == 'zelcash') {
				$('#statsNetworkSols' + data.symbol).text(data.poolStats.networkSolsString);
			} else {
				$('#statsNetworkHash' + data.symbol).text(data.poolStats.networkHashString);
			}

			$('#statsNetworkDiff' + data.symbol).text(parseFloat(data.poolStats.networkDiff).toFixed(2));
			$('#statsNetworkBlocks' + data.symbol).text(data.poolStats.networkBlocks);
			$('#statsNetworkConnections' + data.symbol).text(data.poolStats.networkConnections);
			$('#statsNetworkVersion' + data.symbol).text(data.poolStats.networkVersion);
			$('#statsNetworkProtocolVersion' + data.symbol).attr('data-original-title', data.poolStats.networkProtocolVersion);

			//console.log(data.symbol);
			//console.log(data.poolStats);

			setTimeout(function (args) {
				$('.loader'+data.symbol).removeClass('fa-spin').hide()
			}, 500);

			$('.stats-progress-'+data.symbol+' .progress-bar').addClass('progress-bar-animated').addClass('progress-bar-striped');

			setTimeout(function (args) {
				restartTimer(data.symbol);
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

getStats('XSG');
getStats('ZEL');
