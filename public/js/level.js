
$('.upload').click(function() {
	$('#fileUpload').trigger('click');
});

function readURL(input) {
	console.log("hello");
	console.log(input.files);
	console.log(input.files[0]);
	if (input.files && input.files[0]) {
		console.log("hi????");
		var reader = new FileReader();
		reader.onload = displaySuccess;

		function displaySuccess(e) {
			console.log(e.target.result);
			$('#imageWrapper').attr('body-background-image: url("' + e.target.result + '")');
		}
	}
}
$('#fileUpload').change(function() {
	readURL(this);
});