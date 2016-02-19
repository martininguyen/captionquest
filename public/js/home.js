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