function buy(name, price) {
	var cookies = $('#numcookies').html();
	var p = parseInt(price);
	var c = parseInt(cookies);

	if (p > c) {
		$('#description' + name).html("Hmm, you don't have enough cookies!");
		return;
	}
  $('#description' + name).html("You have bought " + name + "!");
  $('#pet' + name).hide();
  $('#numcookies').html((c-p));
}