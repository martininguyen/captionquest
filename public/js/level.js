$(document).ready(function() {
	//$('#fileUpload').hide();
	var width = $('#imageWrapper').width();
	$('#imageWrapper').css('height', width);
});

/*$('.upload').click(function() {
	$('#fileUpload').trigger('click', function(event) {
		event.stopPropogation();
		event.preventDefault();
	});
}); */

function readURL(input) {
	console.log("hello");
	console.log(input.files);
	console.log(input.files[0]);
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('#imageWrapper').css('background-image', 'url("' + e.target.result + '")');
		}
		reader.readAsDataURL(input.files[0]);
		$('#imageWrapper').css('border', 'solid');
		/*$('.upload').html('<i class="fa fa-pencil-square-o"></i>');
		$('.upload').css('width', '10%');
		$('.upload').css('margin-top', '0px');
		$('.upload').css('margin-right', '0px');*/
	}
}
$('#fileUpload').change(function() {
	readURL(this);
});