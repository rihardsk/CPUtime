$(document).ready(function () {
	$("#runButton").click(function () {
		var scheduler = new fcfs();
		var text = $("#input").val();
		var speed = $("#speed").val();
		scheduler.Initialize(text);
		scheduler.Start(speed);
	});
});