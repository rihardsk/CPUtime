var rr = function () {
	/// <summary>
	/// Laika plānotājs ar round robin algoritmu
	/// </summary>
	var timeQuantum=5;
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
		
		for (var i=0; i<timeQuantum; i++ ){
			var result = this.RunProcess(0,1);
			if (result == "done") break;
		}
		
		if (result != "done") {
			this._availableProcessList.push(this._availableProcessList[0]);
			this._availableProcessList.splice(0, 1);
		}
		
		if (result == "done" && processList.length == 0) {
			return "done";
		}

		return true;
	}
}

// mantojās no SchedullerCommon
fcfs.prototype = new SchedullerCommon();
