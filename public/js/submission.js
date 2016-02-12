$(".cookieButton").click(function() {
	console.log(this);
	var id = this.id.replace("cookie", "");
	console.log(id);
	var original = $("#c" + id).html();
	console.log(original);
	$("#c" + id).html(++original);
});