var Process = function(name, length, remainderContainer, runContainer){
	var r = this;
	r.Name = name;
	r.Length = length;
	r.RemaindingTime = length;
	r.RemainderContainer = remainderContainer;
	r.RunContainer = runContainer;
	var Remainder = {};
	var Runs = [];


	var Initialize = function () {
		Remainder = $(r.RemainderContainer).Append("<div class='bar " + r.Name + "' />");
		$(Remainder).width = getRemainderWidth(r.Length);
	}

	var getRemainderWidth = function (time) {
		return time;
	}

	var getRunWidth = function (time) {
		return time;
	}

	r.Run = function (time) {
		r.RemaindingTime -= time;
		if (r.RemaindingTime < 0) {
			time += r.RemaindingTime;
			r.RemaindingTime = 0;
		}
		if (time <= 0) {
			return;
		}

		$(Remainder).width = getRemainderWidth(r.RemaindingTime);

		var run = $(r.RunContainer).Append("<div class='run " + r.Name + "' />");
		$(run).width = getRunWidth(time);
		Runs.push({ element: run, time: time });
	}

	r.Continue = function (time) {
		r.RemaindingTime -= time;
		if (r.RemaindingTime < 0) {
			time += r.RemaindingTime;
			r.RemaindingTime = 0;
		}
		if (time <= 0) {
			return;
		}

		$(Remainder).width = getRemainderWidth(r.RemaindingTime);

		var run = Runs[Runs.length - 1];
		run.time += time;
		$(run.element).width = getRunWidth(run.time);
	}


	Initialize();
}

var SchedullerCommon = function () {
	var r = this;
	var _processList = {};
	r.Run = function (speed) { };
	r.Initialize = function (processList) {
		_processList = processList;
	};
}