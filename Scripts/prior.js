var Prior = function () {
	/// <summary>
	/// Laika plānotājs ar prioritātes algoritmu (pārtraucošais)
	/// </summary>

	this.RunCpu = function () {

		var processList = this._availableProcessList; // ir pieejami visi bāzes klases memberi (this.asdf)
		
		if (processList.length <= 0) {
			this.RunIdle(1);
			return false;
		}

		// sakārto nepieciešamajā secībā
		this._availableProcessList.sort(function (a, b) { return a.Priority == b.Priority ? 
			a.StartTime - b.StartTime : a.Priority - b.Priority});
		
		var result = this.RunProcess(0,1);

		if ((result == "done" && processList.length == 0) || 
			(this._availableProcessList.length == 0 && this._incomingProcessList.length == 0)) {
			return "done";
		}

		return true;
	}
}

// mantojās no SchedullerCommon
Prior.prototype = new SchedullerCommon();
