var rr = function () {
	/// <summary>
	/// Laika plānotājs ar round robin algoritmu
	/// </summary>
	var timeQuantum = 5;
	var usedTime = 0;
	this.RunCpu = function () {
		/// <summary>
		/// Plānotāja darbības viena cikla laikā
		/// </summary>
		/// <returns type="bool or 'done'">
		/// 'done' - visi procesi beiguši darbu,
		/// true - pēdējais process sekmīgi izpildījās, bet darbu nebeidza,
		/// false - nācās darbināt idle procesu
		/// </returns>

		// te nāk first come first served loģika
		var processList = this._availableProcessList; // ir pieejami visi bāzes klases memberi (this.asdf)
		if (processList.length <= 0) {
			this.RunIdle(1);
			return false;
		}
		
		if (usedTime > 4) {
			this._availableProcessList.push(this._availableProcessList[0]);
			this._availableProcessList.splice(0, 1);
			usedTime = 0;
		}
		
		var result = this.RunProcess(0,1);
		usedTime++;
		if (result == "done") usedTime = 0;
		
		if (result == "done" && processList.length == 0) {
			return "done";
		}
		
		return true;
	}
}

// mantojās no SchedullerCommon
rr.prototype = new SchedullerCommon();
