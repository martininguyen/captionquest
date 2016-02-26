
function play(obj) {
	var original = obj.src;
	if (original.indexOf("1") != -1) {
		obj.src = original.replace("1", "2");
	} else if (original.indexOf("2") != -1) {
		obj.src = original.replace("2", "3");
	} else {
		obj.src = original.replace("3", "1");
	}
}

var i = 1; // page the tutorial is on

function tutorial() {
	switch(i) {
		case 1:
			$(".modal-body").html("The purpose of this game is to enhance your creativity by doing fun caption challenges.");
			$("#cont").html("Continue");
			$("#quit").html("Quit");
			i++;
			break;
		case 2:
			$(".modal-body").html("Take a look at the bottom navigation bar. Right now, you're in your home <i class='fa fa-home'></i>");
			i++;
			break;
		case 3:
			$(".modal-body").html("The <i class='fa fa-tree'></i> represents the 'field'. This is where you go to access all of the levels.");
			i++;
			break;
		case 4:
			$(".modal-body").html("Every level you complete, you will earn 'cookies', which is the in game currency. Spend your cookies in the store <i class='fa fa-shopping-cart'></i> to buy cute pets.");
			i++;
			break;
		case 5:
			$(".modal-body").html("After you buy some pets, you can place them in your home by clicking on the 'Add Pet' button on your home page.");
			i++;
			break;
		case 6:
			$(".modal-body").html("You can also play with your pets by clicking on them! They're very playful!");
			i++;
			break;
		case 7:
			i++;
			$(".modal-body").html("Well, that's all for now. Revisit the tutorial at any time by clicking on 'Tutorial' or reading a shorter version on the help page <i class='fa fa-question'></i>");
			$("#cont").hide();
			$("#quit").html("OK!");
			break;
		default:
			$(".modal-body").html("Would you like to go through the tutorial?");
			$("#cont").show();
			$("#cont").html("Yes");
			$("#quit").html("No");
			i = 1;
	}
}