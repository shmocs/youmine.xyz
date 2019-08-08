
$(document).ready(function(){

	var domain = document.domain,
		domain_parts = domain.split('.'),
		domain_tld = domain_parts.splice(-2).join('.');

	$('[data-toggle="tooltip"]').tooltip();

	var theme_chk = $('.theme_switch > input');
	if (theme == 'style_night') {
		theme_chk.prop('checked', true);
	}

	theme_chk.on('change', function () {
		//console.log($(this).is(':checked'));

		$.cookie('theme', $(this).is(':checked') ? 'style_night':'style', { domain: '.' + domain_tld });

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
getMarketStats(3918); //SAFE
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
				|| data.symbol == 'BTH') && data.name != 'solo-bth' && data.name != 'solo-bgold' && data.name != 'solo-zen' && data.name != 'solo-zel' && data.name != 'solo-bze'

			) {
				coin = data.symbol.toLowerCase();
			} else {
				coin = data.name;
			}
			//console.log(coin);

			//exceptions
			if (coin == 'solo-bgold') coin = 'solo-btg';

			$('#poolFee-' + coin).text(data.poolFee);
			$('#statsBlocks-' + coin).text(data.poolStats.validBlocks);
			$('#statsMiners-' + coin).text(data.minerCount);
			$('#statsWorkers-' + coin).text(data.workerCount);
			$('#statsHashrate-' + coin).text(data.hashrateString);
			$('#statsLuckDays-' + coin).text(data.luckDays);

			setPoolHashRateStyle($('.'+coin+' .pool-stats .fa-tachometer-alt'), data.hashrate, data.poolStats.networkSols);

			if (data.timeToFindString) {
				$('#statsTimeToFind-' + coin).text(data.timeToFindString);
				$('#statsLastBlockFound-' + coin).text(data.lastBlockFoundString);

			} else {
				// coins that don't have yet these stats in api
				var luckType = 'hours';
				var luckValue = data.luckHours;

				if (luckValue < 0.5) {
					luckValue = parseFloat(luckValue * 60).toFixed(0);
					luckType = 'minutes';
				} else {
					luckValue = parseFloat(luckValue).toFixed(1);
					if (luckValue > 999) {
						luckValue = '∞';
					}
				}

				$('#statsLuckValue-' + coin).text(luckValue);
				$('#statsLuckType-' + coin).text(luckType);
			}

			$('#statsBlocks12h24h-' + coin).text(data.poolStats.last12hBlocks + '/' + data.poolStats.last24hBlocks);
			$('#statsNetworkDiffMin24h-' + coin).text(data.poolStats.networkMinDiff24h);
			$('#statsNetworkDiffMax24h-' + coin).text(data.poolStats.networkMaxDiff24h);

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

function setPoolHashRateStyle(tachometer, poolHash, networkHash) {
	var hashClass = 'text-danger'; // 0 Sols
	var poolHashPercentOfNetwork = parseFloat((poolHash * 100 / networkHash).toFixed(2)) || 0;

	if (poolHash > 0) {
		hashClass = 'text-warning';
		if (poolHashPercentOfNetwork >= 10) hashClass = 'text-info';
		if (poolHashPercentOfNetwork >= 50) hashClass = 'text-success';
	}

	tachometer.removeClass('text-danger').removeClass('text-warning').removeClass('text-info').removeClass('text-success').addClass(hashClass);
	tachometer.attr('data-original-title', poolHashPercentOfNetwork.toString() + '% of Network hashrate');
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
getStats('solo-btg');
getStats('zen');
getStats('solo-zen');
getStats('zcl');
getStats('bth');
getStats('solo-bth');
getStats('solo-zel');
getStats('solo-bze');
