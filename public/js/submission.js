$(".cookieButton").click(function() {
	var cookieNumId = this.id.replace("cookie", "cNum");
	var id = this.id.replace("cookie", "");
	$.post("/cookies", {'cookieId': id }, function(err, data) {
		var currentCookies = parseInt($("#" + cookieNumId).text());
		currentCookies++;
		$("#" + cookieNumId).text(currentCookies);
	});
});