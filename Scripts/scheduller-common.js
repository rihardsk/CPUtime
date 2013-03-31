var Process = function(name, length, startTime, priority, remainderContainer, runContainer){
	var r = this;
	r.Name = name;
	r.Length = length;
	r.RemaindingTime = length;
	r.StartTime = startTime;
	r.Priority = priority;
	r.RemainderContainer = remainderContainer;
	r.RunContainer = runContainer;
	var _remainder = {};
	var _runs = [];


	r.Initialize = function () {
		_remainder = $(r.RemainderContainer).Append("<div class='bar " + r.Name + "' />");
		$(_remainder).width(getRemainderWidth(r.Length));
	}

	var getRemainderWidth = function (time) {
		if (r.Name == "idle") {
			return 0;
		}
		return time;
	}

	var getRunWidth = function (time) {
		if (r.Name == "idle") {
			return 0;
		}
		return time;
	}

	r.Run = function (time) {
		r.RemaindingTime -= time;
		if (r.RemaindingTime < 0) {
			time += r.RemaindingTime;
			r.RemaindingTime = 0;
		}
		if (time <= 0) {
			return false;
		}

		$(_remainder).width(getRemainderWidth(r.RemaindingTime));

		var run = $(r.RunContainer).Append("<div class='run " + r.Name + "' />");
		$(run).width(getRunWidth(time));
		_runs.push({ element: run, time: time });

		if (r.RemaindingTime < 0) {
			return "done";
		}
		return true;
	}

	r.Continue = function (time) {
		r.RemaindingTime -= time;
		if (r.RemaindingTime < 0) {
			time += r.RemaindingTime;
			r.RemaindingTime = 0;
		}
		if (time <= 0) {
			return false;
		}

		$(_remainder).width(getRemainderWidth(r.RemaindingTime));

		var run = _runs[_runs.length - 1];
		run.time += time;
		$(run.element).width(getRunWidth(run.time));

		if (r.RemaindingTime < 0) {
			return "done";
		}
		return true;
	}
}

var SchedullerCommon = function () {
	var r = this;
	var _processList = [];
	var _availableProcessList = [];
	var _incomingProcessList = [];
	var _remainderContainer = $("#processList").get(0);
	var _runContainer = $("#progressBar").get(0);
	var _timer = {};
	var _ticksPassed = 0;
	var _tickDuration = -1;
	var _idleProcess = new Process("idle", Infinity, 0, -1, _remainderContainer, _runContainer);
	var _lastProcessIndex = -1; // number or "idle"

	r.Initialize = function (processList) {
		$(_remainderContainer).empty();
		$(_runContainer).empty();

		_processList = r.ParseProcessList(processList);
		_processList.sort(function (a, b) { return a.StartTime - b.StartTime; });
		for (var i = 0; i < _processList.length; i++) {
			_incomingProcessList.push(_processList[i]);
		}
	};

	r.ParseProcessList = function (input) {
		var parsed = [];

		var lines = input.split("\n");
		for (var i = 0; i < lines.length; i++) {
			// rindiòas formâts - <ieraðanâs laiks> <nosaukums> <izpildes laiks> <prioritâte>
			var words = lines[i].split(" ");
			var process = new Process(words[1], words[2], words[0], words[3], _remainderContainer, _runContainer);
			process.Initialize();
			parsed.push();
		}

		return parsed;
	}

	r.Start = function (tickDuration) {
		if (tickDuration) {
			_tickDuration = tickDuration;
		}
		_timer = setInterval(tick, tickDuration);
	}

	r.Pause = function () {
		clearInterval(_timer);
	}

	r.Stop = function () {
		clearInterval(_timer);
		_ticksPassed = 0;
	}

	var tick = function () {
		for (var i = 0; i < _incomingProcessList.length; i++) {
			if (_incomingProcessList[i].StartTime == _ticksPassed) {
				var process = _incomingProcessList.pop();
				i--; // nâkamajiem elementiem samazinâs indekss
				_availableProcessList.push(process);
			}
		}
		if (!r.RunCpu(_availableProcessList) && _incomingProcessList.length == 0) {
			r.Stop();
		}
		_ticksPassed++;
	}

	// runs the CPU for 1 cycle, returns "done" if all processes are done executing in the result
	r.RunCpu = function (processList) {
		// plânotâja kods nâks ðeit mantotajâs klasçs
	}

	r.RunProcess = function (index, time) {
		if (_lastProcessIndex == index) {
			return _availableProcessList[index].Continue(time);
		}
		_lastProcessIndex = index;
		return _availableProcessList[index].Run(time);
	}

	r.RunIdle = function (time) {
		if (_lastProcessIndex == "idle") {
			return _idleProcess.Continue(time);
		}
		_lastProcessIndex = "idle";
		return _idleProcess.Run(time);
	}
}
