$(document).ready(function () {
	// kad DOM ielādēts, pievienojam event listeneri pogai
	var scheduler;
	var ready=true;
	$(":button").click(function () {
		if(this.id != "add"){
		if (! $("input[type=text]").each(function(){
			if( $(this).val().length == 0 ) {
				alert("Nav aizpildīti visi parametru lauki!");
				ready = false;
				return false;
			}
		})) 
		if(ready){
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
		scheduler.Initialize(count, name, time, comein, priority);
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