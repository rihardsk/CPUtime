﻿var sjf = function () {
	/// <summary>
	/// Laika plānotājs ar shortest job first algoritmu (nepārtraucošais)
	/// </summary>

	this.RunCpu = function () {

		var processList = this._availableProcessList; // ir pieejami visi bāzes klases memberi (this.asdf)
		
		if (processList.length <= 0) {
			this.RunIdle(1);
			return false;
		}

		// sakārto nepieciešamajā secībā
		this._availableProcessList.sort(function (a, b) { return a.Length == b.Length ? 
			a.StartTime - b.StartTime : a.Length - b.Length});
		
		var result = this.RunProcess(0,1);

		if ((result == "done" && processList.length == 0) || 
			(this._availableProcessList.length == 0 && this._incomingProcessList.length == 0)) {
			return "done";
		}

		return true;
	}
}

// mantojās no SchedullerCommon
sjf.prototype = new SchedullerCommon();
