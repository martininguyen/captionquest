function buy(name, price) {
	console.log("Buy");
	var cookies = $('#numcookies').html();
	var p = parseInt(price);
	var c = parseInt(cookies);

	if (p > c) {
		$('#description' + name).html("Hmm, you don't have enough cookies!");
		console.log("YOU DON'T HAVE ENOUGH COOKIES!!! why doesn't this change?? question mark");
	} else {
		$.post("/shop", {"price": p, "name": name}, function(err, data) {
			$("#pet2" + name).html("Bought");
			$("#pet2" + name).prop('disabled', true);
			$("#pet2" + name).css("background-color", "#ccc");
			$("#pet" + name).html("Bought");
			$("#pet" + name).prop('disabled', true);
			$("#pet" + name).css("background-color", "#ccc");
			$("#description" + name).html("Yay, you bought " + name + "! Go home to play with your new pet!");
			$('#numcookies').html((c-p));
		});
	}
}