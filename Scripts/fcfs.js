var fcfs = function () {
	/// <summary>
	/// Laika plānotājs ar first come first served algoritmu
	/// </summary>
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

		var result = this.RunProcess(0,1);

		if (result == "done" && processList.length == 0) {
			return "done";
		}

		return true;
	}
}

// mantojās no SchedullerCommon
fcfs.prototype = new SchedullerCommon();
