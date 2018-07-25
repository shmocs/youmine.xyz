
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

$.ajax({
	url: "https://snowgem.youmine.xyz/api/stats",
	dataType: 'json',
	success: function(data) {

		pool = 'XSG';
		$('#statsBlocks' + pool).text(data.pools.snowgem.validBlocks);
		$('#statsMiners' + pool).text(data.pools.snowgem.minerCount);
		$('#statsWorkers' + pool).text(data.pools.snowgem.workerCount);
		$('#statsHashrate' + pool).text(data.pools.snowgem.hashrateString);
		//$('#statsHashrateAvg' + pool).text(getReadableHashRateString(calculateAverageHashrate(data.pools.snowgem)));
		$('#statsLuckDays' + pool).text(data.pools.snowgem.luckDays);
		$('#statsValidBlocks' + pool).text(data.pools.snowgem.poolStats.validBlocks);
		$('#statsTotalPaid' + pool).text((parseFloat(data.pools.snowgem.poolStats.totalPaid)).toFixed(8));
		$('#statsNetworkBlocks' + pool).text(data.pools.snowgem.poolStats.networkBlocks);
		$('#statsNetworkDiff' + pool).text(parseFloat(data.pools.snowgem.poolStats.networkDiff).toFixed(2));
		$('#statsNetworkSols' + pool).text(data.pools.snowgem.poolStats.networkSolsString);
		$('#statsNetworkConnections' + pool).text(data.pools.snowgem.poolStats.networkConnections);
		$('#statsNetworkVersion' + pool).text(data.pools.snowgem.poolStats.networkVersion);


		//console.log(data.pools.snowgem.poolStats)
	},
	error: function() {
		//alert("Was unable to get info!");
	}
});