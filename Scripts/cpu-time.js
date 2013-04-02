$(document).ready(function () {
	var scheduler;
	$("#runButton").click(function () {
		if (!scheduler) {
			scheduler = new fcfs();
		}
		var text = $("#input").val();
		var speed = $("#speed").val();
		scheduler.Initialize(text);
		scheduler.Start(speed);
	});
});