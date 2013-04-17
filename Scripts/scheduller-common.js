function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function padRgba(r, g, b, a) {
	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function RgbaToRgb(RGBA, bg) {
	var RGB = {};
	alpha = 1 - RGBA.a;
	RGB.r = Math.round((RGBA.a * (RGBA.r / 255) + (alpha * (bg.r / 255))) * 255);
	RGB.g = Math.round((RGBA.a * (RGBA.g / 255) + (alpha * (bg.g / 255))) * 255);
	RGB.b = Math.round((RGBA.a * (RGBA.b / 255) + (alpha * (bg.b / 255))) * 255);

	return RGB;
}

var Process = function (name, length, startTime, priority, remainderContainer, runContainer, color) {
	/// <summary>
	/// Procesa klase
	/// </summary>
	/// <param name="name"> Procesa nosaukums </param>
	/// <param name="length"> Procesa izpildes laiks </param>
	/// <param name="startTime"> Procesa ierašanās laiks </param>
	/// <param name="priority"> Procesa prioritāte </param>
	/// <param name="remainderContainer"> DOM elements, kur attēlot palikušā laika stabiņu </param>
	/// <param name="runContainer"> DOM elements, kur likt klāt izpildītā laika stabiņu </param>
	/// <param name="color"> Krāsa, kādā būs procesa stabiņi </param>
	this.Name = name;
	this.Length = length;
	this.RemaindingTime = length;
	this.StartTime = startTime;
	this.Priority = priority;
	this.RemainderContainer = remainderContainer;
	this.RunContainer = runContainer;
	this.Color = color;
	var _remainder = {};
	var _runs = [];
	var _border = {};

	this.Initialize = function () {
		/// <summary>
		/// Izveido palikušā laika stabiņu
		/// </summary>
		_border = $("<div class='border " + this.Name + "' />").appendTo(this.RemainderContainer).get(0);
		var rgb = hexToRgb(this.Color);
		rgb.a = 0.5;
		var white = hexToRgb("FFFFFF");
		var mixed = RgbaToRgb(rgb, white);

		_border.style.backgroundColor = rgbToHex(mixed.r, mixed.g, mixed.b);
		_remainder = $("<div class='bar " + this.Name + "' />").appendTo(_border).get(0);
		_remainder.style.backgroundColor = this.Color;
		

		$(_remainder).width(getRemainderWidth(this.Length));
		$(_border).width(getRemainderWidth(this.Length));
	}

	var getRemainderWidth = function (time) {
		/// <summary>
		/// Pārvērš izpildes laiku atlikušā laika stabiņa garumā
		/// </summary>
		/// <param name="time"> Izpildes laiks </param>
		/// <returns type="int"> Stabiņa garums pikseļos </returns>
		if (this.Name == "idle") {
			return 0;
		}
		return time*15;
	}

	var getRunWidth = function (time) {
		/// <summary>
		/// Pārvērš izpildes laiku izpildītā laika stabiņa garumā
		/// </summary>
		/// <param name="time"> Izpildes laiks </param>
		/// <returns type="int"> Stabiņa garums pikseļos </returns>
		if (this.Name == "idle") {
			return 0;
		}
		return time*15;
	}

	this.Run = function (time) {
		/// <summary>
		/// Darbina procesu, pievienojot jaunu izpildes stabiņu un samazinot atlikušā laika stabiņu
		/// </summary>
		/// <param name="time"> Izpildes laiks </param>
		/// <returns type="bool or 'idle'">
		/// "done" - process beidza darbu,
		/// true - process darbojās, bet nebeidza darbu,
		/// false - process nevarēja izpildīties
		/// </returns>
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
		run.style.backgroundColor = this.Color;
		_runs.push({ element: run, time: time });

		if (this.RemaindingTime == 0) {
			return "done";
		}
		return true;
	}

	this.Continue = function (time) {
		/// <summary>
		/// Darbina procesu, pagarinot iepriekšējo izpildes stabiņu un samazinot izpildes laika stabiņu
		/// </summary>
		/// <param name="time"> Izpildes laiks </param>
		/// <returns type="bool or 'idle'">
		/// "done" - process beidza darbu,
		/// true - process darbojās, bet nebeidza darbu,
		/// false - process nevarēja izpildīties
		/// </returns>
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
	/// <summary>
	/// Bāzes klase CPU laika plānotājam
	/// </summary>

	/// <var> Visu procesu saraksts </var>
	this._processList = [];
	/// <var> Pieejamo nepabeigto procesu saraksts </var>
	this._availableProcessList = [];
	/// <var> Vēl nepieejamo procesu saraksts </var>
	this._incomingProcessList = [];
	/// <var> Pabeigto procesu saraksts </var>
	this._finishedProcessList = [];
	var _remainderContainer;
	var _runContainer;
	var _timer = {};
	/// <var> Pagājušais laiks </var>
	this._ticksPassed = 0;
	var _tickDuration = -1;
	var _idleProcess;
	var _lastProcessName = "";
	var _lastProcessN = "";
	this._colors = [
		"#DD1E2F",
		"#EBB035",
		"#06A2CB",
		"#218559",
		"#D0C6B1",
		"#192823",
		"#FF8F00",
		"#5A8F29",
		"#3C7DC4",
		"#2B2B2B"
	];

	this.Initialize = function (processList) {
		/// <summary>
		/// Ielasa procesu sarakstu, sagatavo procesu sarakstus un reseto laiku
		/// </summary>
		/// <param name="processList">
		/// Teksts - procesu saraksts.
		/// Rindiņas formāts - [ierašanās laiks] [nosaukums] [izpildes laiks] [prioritāte]
		/// </param>
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
		_idleProcess = new Process("idle", Infinity, 0, -1, _remainderContainer, _runContainer, "#FFFFFF");
		_idleProcess.Initialize();
	};

	this.ParseProcessList = function (input) {
		/// <summary>
		/// Pārsē tekstu par procesu sarakstu
		/// </summary>
		/// <param name="input">
		/// Teksts - procesu saraksts.
		/// Rindiņas formāts - [ierašanās laiks] [nosaukums] [izpildes laiks] [prioritāte]
		/// </param>
		/// <returns type=""> Procesu saraksts </returns>
		var parsed = [];

		var lines = input.split("\n");
		for (var i = 0; i < lines.length; i++) {
			if (!lines[i]) {
				continue;
			}
			var words = lines[i].split(" ");
			var process = new Process(words[1], words[2], words[0], words[3], _remainderContainer, _runContainer, this._colors[i % this._colors.length]);
			process.Initialize();
			parsed.push(process);
		}

		return parsed;
	}

	this.Start = function (tickDuration) {
		/// <summary>
		/// Sāk vai turpina darbināt procesoru
		/// </summary>
		/// <param name="tickDuration"> Cik milisekundes attēlot vienu procesora ciklu (optional) </param>
		if (tickDuration) {
			_tickDuration = tickDuration;
		}
		var r = this;
		_timer = setInterval(function () { tick.call(r);  }, tickDuration);
	}

	this.Pause = function () {
		/// <summary>
		/// Pauzē procesora darbu
		/// </summary>
		clearInterval(_timer);
	}

	this.Stop = function () {
		/// <summary>
		/// Pārtrauc procesora darbu
		/// </summary>
		clearInterval(_timer);
		this._ticksPassed = 0;
	}

	var tick = function () {
		/// <summary>
		/// Darbības viena CPU 'cikla' laikā
		/// </summary>

		// pievieno visus brīvos procesus
		for (var i = 0; i < this._incomingProcessList.length; i++) {
			var process = this._incomingProcessList[i];
			if (process.StartTime == this._ticksPassed) {
				this._incomingProcessList.splice(i, 1);
				i--; // nākamajiem elementiem samazinās indekss
				this._availableProcessList.push(process);
			}
		}

		var result = this.RunCpu();
		
		if (this._availableProcessList.length > 0)
			this._lastProcessN = this._availableProcessList[0].Name
		else
			this._lastProcessN = "";
		
		// pārvieto visus pabeigušos procesus
		for (var i = 0; i < this._availableProcessList.length; i++) {
			var process = this._availableProcessList[i];
			if (process.RemaindingTime == 0) {
				this._availableProcessList.splice(i, 1);
				i--; // nākamajiem elementiem samazinās indekss
				this._finishedProcessList.push(process);
			}
		}
		//if ((!result || result == "done") && _incomingProcessList.length == 0) {
		if (this._availableProcessList.length == 0 && this._incomingProcessList.length == 0) { // šādi vienkāršāk
			this.Stop();
			return;
		}
		this._ticksPassed++;
	}

	this.RunCpu = function () {
		/// <summary>
		/// Plānotāja darbības viena cikla laikā
		/// </summary>
		/// <returns type="bool or 'done'">
		/// 'done' - visi procesi beiguši darbu,
		/// true - pēdējais process sekmīgi izpildījās, bet darbu nebeidza,
		/// false - nācās darbināt idle procesu
		/// </returns>

		// plānotāja kods nāks šeit mantotajās klasēs
	}

	this.RunProcess = function (index, time) {
		/// <summary>
		/// Atvieglo procesa darbināšanu. Automātiski turpina vai arī sāk no jauna
		/// </summary>
		/// <param name="index"> Procesa indekss iekš _availableProcessList </param>
		/// <param name="time"> Izpildes laiks </param>
		/// <returns type="bool or 'idle'">
		/// "done" - process beidza darbu,
		/// true - process darbojās, bet nebeidza darbu,
		/// false - process nevarēja izpildīties
		/// </returns>
		var process = this._availableProcessList[index];
		if (_lastProcessName == process.Name) {
			return process.Continue(time);
		}
		_lastProcessName = process.Name;
		return process.Run(time);
	}

	this.RunIdle = function (time) {
		/// <summary>
		/// Atvieglo idle procesa darbināšanu. Automātiski turpina vai arī sāk no jauna
		/// </summary>
		/// <param name="time"> Izpildes laiks </param>
		/// <returns type="bool"> Vienmēr true </returns>
		if (_lastProcessName == "idle") {
			return _idleProcess.Continue(time);
		}
		_lastProcessName = "idle";
		return _idleProcess.Run(time);
	}
}
