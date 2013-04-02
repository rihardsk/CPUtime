var Process = function(name, length, startTime, priority, remainderContainer, runContainer){
	var r = this;
	this.Name = name;
	this.Length = length;
	this.RemaindingTime = length;
	this.StartTime = startTime;
	this.Priority = priority;
	this.RemainderContainer = remainderContainer;
	this.RunContainer = runContainer;
	var _remainder = {};
	var _runs = [];


	this.Initialize = function () {
		_remainder = $("<div class='bar " + this.Name + "' />").appendTo(this.RemainderContainer).get(0);
		$(_remainder).width(getRemainderWidth(this.Length));
	}

	var getRemainderWidth = function (time) {
		if (this.Name == "idle") {
			return 0;
		}
		return time;
	}

	var getRunWidth = function (time) {
		if (this.Name == "idle") {
			return 0;
		}
		return time;
	}

	this.Run = function (time) {
		this.RemaindingTime -= time;
		if (this.RemaindingTime < 0) {
			time += this.RemaindingTime;
			this.RemaindingTime = 0;
		}
		if (time <= 0) {
			return false;
		}

		$(_remainder).width(getRemainderWidth(this.RemaindingTime));

		var run = $("<div class='run " + this.Name + "' />").appendTo(this.RunContainer).get(0);
		$(run).width(getRunWidth(time));
		_runs.push({ element: run, time: time });

		if (this.RemaindingTime == 0) {
			return "done";
		}
		return true;
	}

	this.Continue = function (time) {
		this.RemaindingTime -= time;
		if (this.RemaindingTime < 0) {
			time += this.RemaindingTime;
			this.RemaindingTime = 0;
		}
		if (time <= 0) {
			return false;
		}

		$(_remainder).width(getRemainderWidth(this.RemaindingTime));

		var run = _runs[_runs.length - 1];
		run.time += time;
		$(run.element).width(getRunWidth(run.time));

		if (this.RemaindingTime == 0) {
			return "done";
		}
		return true;
	}
}

var SchedullerCommon = function () {
	this._processList = [];
	this._availableProcessList = [];
	this._incomingProcessList = [];
	this._finishedProcessList = [];
	var _remainderContainer;
	var _runContainer;
	var _timer = {};
	this._ticksPassed = 0;
	var _tickDuration = -1;
	var _idleProcess;
	var _lastProcessName = "";

	this.Initialize = function (processList) {
		_remainderContainer = $("#processList").get(0);
		_runContainer = $("#progressBar").get(0);

		// clean up
		$(_remainderContainer).empty();
		$(_runContainer).empty();
		this._ticksPassed = 0;
		this._processList = [];
		this._incomingProcessList = [];
		this._availableProcessList = [];

		this._processList = this.ParseProcessList(processList);
		this._processList.sort(function (a, b) { return a.StartTime - b.StartTime; });
		for (var i = 0; i < this._processList.length; i++) {
			this._incomingProcessList.push(this._processList[i]);
		}
		_idleProcess = new Process("idle", Infinity, 0, -1, _remainderContainer, _runContainer);
		_idleProcess.Initialize();
	};

	this.ParseProcessList = function (input) {
		var parsed = [];

		var lines = input.split("\n");
		for (var i = 0; i < lines.length; i++) {
			// rindiòas formâts - <ieraðanâs laiks> <nosaukums> <izpildes laiks> <prioritâte>
			var words = lines[i].split(" ");
			var process = new Process(words[1], words[2], words[0], words[3], _remainderContainer, _runContainer);
			process.Initialize();
			parsed.push(process);
		}

		return parsed;
	}

	this.Start = function (tickDuration) {
		if (tickDuration) {
			_tickDuration = tickDuration;
		}
		var r = this;
		_timer = setInterval(function () { tick.call(r);  }, tickDuration);
	}

	this.Pause = function () {
		clearInterval(_timer);
	}

	this.Stop = function () {
		clearInterval(_timer);
		this._ticksPassed = 0;
	}

	var tick = function () {
		for (var i = 0; i < this._incomingProcessList.length; i++) {
			var process = this._incomingProcessList[i];
			if (process.StartTime == this._ticksPassed) {
				this._incomingProcessList.splice(i, 1);
				i--; // nâkamajiem elementiem samazinâs indekss
				this._availableProcessList.push(process);
			}
		}

		var result = this.RunCpu();

		for (var i = 0; i < this._availableProcessList.length; i++) {
			var process = this._availableProcessList[i];
			if (process.RemaindingTime == 0) {
				this._availableProcessList.splice(i, 1);
				i--; // nâkamajiem elementiem samazinâs indekss
				this._finishedProcessList.push(process);
			}
		}
		//if ((!result || result == "done") && _incomingProcessList.length == 0) {
		if (this._availableProcessList.length == 0 && this._incomingProcessList.length == 0) { // ðâdi vienkârðâk
			this.Stop();
			return;
		}
		this._ticksPassed++;
	}

	// runs the CPU for 1 cycle, returns "done" if all processes are done executing in the result
	this.RunCpu = function () {
		// plânotâja kods nâks ðeit mantotajâs klasçs
	}

	this.RunProcess = function (index, time) {
		var process = this._availableProcessList[index];
		if (_lastProcessName == process.Name) {
			return process.Continue(time);
		}
		_lastProcessName = process.Name;
		return process.Run(time);
	}

	this.RunIdle = function (time) {
		if (_lastProcessName == "idle") {
			return _idleProcess.Continue(time);
		}
		_lastProcessName = "idle";
		return _idleProcess.Run(time);
	}
}
