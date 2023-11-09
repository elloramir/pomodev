import Chrono from "./chrono.js";


window.onload = () => {
	const chron = new Chrono();
	chron.onUpdate = updateChrono;
	updateChrono(chron);
	listenControlEvents(chron);
};


function listenControlEvents(chron) {
	const $play = document.querySelector(".chrono-control-play");
	const $next = document.querySelector(".chrono-control-next");

	// toggle playing state manually
	$play.onclick = () => {
		chron.toggle();
		updatePlayButton(chron);
	};
}


function updatePlayButton(chron) {
	const $play = document.querySelector(".chrono-control-play");
	const icon = chron.playing ? "pause" : "play";

	$play.querySelector("i").className = "fa fa-" + icon;
}


function updateChrono(chron) {
	const $chronoTimer = document.querySelector(".chrono-timer");
	const $chronoTask = document.querySelector(".chrono-active-task");
	const $chronoArc = document.querySelector(".chrono-arc");
	const $chronoTip = document.querySelector(".chrono-tip");

	$chronoTimer.textContent = chron.fmtEpoch();
	$chronoTask.textContent = chron.activeTask;

	// propagate actual state
	updatePlayButton(chron);

	// calculate arc path
	{
		// subtract by a tiny number to looks filled
		const percent = chron.percent() * 100 - 0.01;
		const x = 50 + Math.sin(percent / 100 * 2 * Math.PI) * 40;
		const y = 50 - Math.cos(percent / 100 * 2 * Math.PI) * 40;

		$chronoTip.setAttribute("cx", x);
		$chronoTip.setAttribute("cy", y);
		$chronoArc.setAttribute("d", `
			M 50, 10
			A 40, 40, 0, ${percent > 50 ? "1" : "0"}, 1, ${x}, ${y}
		`);
	}

	// index colors
	$chronoArc.classList.remove("chrono-arc-relax");
	$chronoTip.classList.remove("chrono-tip-relax");

	if (chron.pomoIndex%2==1) {
		$chronoArc.classList.add("chrono-arc-relax");
		$chronoTip.classList.add("chrono-tip-relax");
	}
}

