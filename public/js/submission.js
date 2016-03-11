$(".cookieButton").click(function() {
	console.log(this.id);
	var id = this.id.replace("cookie", "");
	$.post("/cookies", {'cookieId': id }, function(err, data) {
		var cookieNumId = this.id.replace("cookie", "cNum");
		var currentCookies = parseInt($("#" + cookieNumId).text());
		currentCookies++;
		$("#" + cookieNumId).text(currentCookies);
		//data.local.cookies += 1;
	});
	/*var cookieNumId = this.id.replace("cookie", "cNum");
	var id = this.id.replace("cookie", "");
	Gallery.findOne({'_id': id}, 'local.cookies local.user', function(err, image) {
		if (err) {
			console.log(err);
		}
		image.local.cookies += 1;
		$("#" + cookieNumId).text(image.local.cookies);

		User.findOne({'local.email': image.local.user}, 'cookies', function(err, person) {
			person.local.cookies += 1;
		});
	});*/
});