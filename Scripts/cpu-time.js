$(document).ready(function () {
	// kad DOM ielādēts, pievienojam event listeneri pogai
	var scheduler;
	var isready;
	$(":button").click(function () {
		if(this.id != "add"){
		isready = true;
		$("input[type=text]").each(function(){
			if( $(this).val().length == 0 ) {
				alert("Nav aizpildīti visi parametru lauki!");
				isready = false;
				return false;
			}
		})
		if(isready){
		var kvants = $("#kvants").val();
		//if (!scheduler) {
			if (this.id == "runButtonFCFS") { scheduler = new fcfs();}
			else if (this.id == "runButtonSJF") { scheduler = new sjf();}
			else if (this.id == "runButtonSRTF") { scheduler = new srtf();}
			else if (this.id == "runButtonPrior") { scheduler = new Prior();}
			else if (this.id == "runButtonPriorN") { scheduler = new PriorN();}
			else if (this.id == "runButtonRR") { scheduler = new rr(kvants);}
		//}
		var count = $("#inputs div").length;
		var name = $("input[name='name\\[\\]']").map(function(){return $(this).val();}).get();
		var time = $("input[name='time\\[\\]']").map(function(){return $(this).val();}).get();
		var comein = $("input[name='come-in\\[\\]']").map(function(){return $(this).val();}).get();
		var priority = $("input[name='priority\\[\\]']").map(function(){return $(this).val();}).get();
		var speed = $("#speed").val();

		var text = "0 p1 2 2\n1 p2 3 1\n1 p3 1 2\n8 p4 5 3\n10 p6 2 2\n10 p5 1 1";

		scheduler.Initialize2(text);
		scheduler.Start(speed);
		}
		}
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