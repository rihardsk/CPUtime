var fcfs = function () {
	this.RunCpu = function () {
		// te nāk first come first served loģika
		var processList = this._availableProcessList; // te ir pieejami visi bāzes klases member (this.asdf)
		if (processList.length <= 0) {
			this.RunIdle(1);
			return false;
		}

		var result = this.RunProcess(0,1);

		if (result == "done" && processList.length == 0) {
			return "done";
		}

		return true;
	}
}

// mantojās no SchedullerCommon
fcfs.prototype = new SchedullerCommon();
