$(document).ready(function () {
	// kad DOM ielādēts, pievienojam event listeneri pogai
	var scheduler;
	$(":button").click(function () {
		if (!scheduler) {
			if (this.id == "runButtonFCFS") { scheduler = new fcfs();}
			else if (this.id == "runButtonRR") { scheduler = new rr();}
		}
		var text = $("#input").val();
		var speed = $("#speed").val();
		scheduler.Initialize(text);
		scheduler.Start(speed);
	});
});