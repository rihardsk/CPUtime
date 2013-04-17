$(document).ready(function () {
	// kad DOM ielādēts, pievienojam event listeneri pogai
	var scheduler;
	$("#runButtonFCFS").click(function () {
		scheduler = new fcfs();
		var text = $("#input").val();
		var speed = $("#speed").val();
		scheduler.Initialize(text);
		scheduler.Start(speed);
	});
	$("#runButtonSJF").click(function () {
		scheduler = new sjf();
		var text = $("#input").val();
		var speed = $("#speed").val();
		scheduler.Initialize(text);
		scheduler.Start(speed);
	});
	$("#runButtonPrior").click(function () {
		scheduler = new Prior();
		var text = $("#input").val();
		var speed = $("#speed").val();
		scheduler.Initialize(text);
		scheduler.Start(speed);
	});
});