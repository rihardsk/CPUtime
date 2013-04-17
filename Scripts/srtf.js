var srtf = function () {
	/// <summary>
	/// Laika plānotājs ar shortest job first algoritmu (pārtraucošais remaining time first - shortest)
	/// </summary>

	this.RunCpu = function () {

		var processList = this._availableProcessList; // ir pieejami visi bāzes klases memberi (this.asdf)
		
		if (processList.length <= 0) {
			this.RunIdle(1);
			return false;
		}

		// sakārto nepieciešamajā secībā
		this._availableProcessList.sort(function (a, b) { return a.RemaindingTime == b.RemaindingTime ? 
			a.StartTime - b.StartTime : a.RemaindingTime - b.RemaindingTime});
		
		var result = this.RunProcess(0,1);

		if ((result == "done" && processList.length == 0) || 
			(this._availableProcessList.length == 0 && this._incomingProcessList.length == 0)) {
			return "done";
		}

		return true;
	}
}

// mantojās no SchedullerCommon
srtf.prototype = new SchedullerCommon();
