$(document).ready(function () {
	// kad DOM ielādēts, pievienojam event listeneri pogai
	var scheduler;
	$(":button").click(function () {
		//if (!scheduler) {
			if (this.id == "runButtonFCFS") { scheduler = new fcfs();}
			else if (this.id == "runButtonSJF") { scheduler = new sjf();}
			else if (this.id == "runButtonSRTF") { scheduler = new srtf();}
			else if (this.id == "runButtonPrior") { scheduler = new Prior();}
			else if (this.id == "runButtonPriorN") { scheduler = new PriorN();}
			else if (this.id == "runButtonRR") { scheduler = new rr();}
		//}
		var text = $("#input").val();
		var speed = $("#speed").val();
		scheduler.Initialize(text);
		scheduler.Start(speed);
	});

	var mouseEnter = function () {
		var myClass = $(this).attr("class");
		var classes = myClass.split(" ");
		$("." + classes[1] + ":not(.bar)").addClass("highlight");
	};
	var mouseLeave = function () {
		var myClass = $(this).attr("class");
		var classes = myClass.split(" ");
		$("." + classes[1] + ":not(.bar)").removeClass("highlight");
	};

	$("#processList,#progressBar").on("mouseenter", ".border,.run", mouseEnter);
	$("#processList,#progressBar").on("mouseleave", ".border,.run", mouseLeave);
});