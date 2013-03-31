var fcfs = function () {
	var r = this;
	var executeIndex = 0;

	r.RunCpu = function (processList) {
		// te nāk first come first served loģika
		if (executeIndex >= processList.length) {
			r.RunIdle(1);
			return false;
		}

		var process = processList[executeIndex];

		var result = r.RunProcess(executeIndex);

		if (result == "done") {
			executeIndex++;
		}

		if (executeIndex >= processList.length) {
			return "done";
		}

		return true;
	}
}

// mantojās no SchedullerCommon
fcfs.prototype = new SchedullerCommon();
