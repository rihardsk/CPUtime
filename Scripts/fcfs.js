var fcfs = function () {
	var executeIndex = 0;

	this.RunCpu = function (processList) {
		// te nāk first come first served loģika
		if (executeIndex >= processList.length) {
			this.RunIdle(1);
			return false;
		}

		var process = processList[executeIndex];

		var result = this.RunProcess(executeIndex,1);

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
