// Copyright (c) 2023 Ellora.
// Use of this source code is governed by MIT
// license that can be found in the LICENSE file.

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const CHRONO_INTERVAL = SECONDS*0.35;
const POMOS = [25, 5, 25, 15];


// TODO(ellora): move from "set interval" to animation frame.
export default function Chrono() {
	this.pomoIndex = -1;
	this.onUpdate = null;
	this.nextPomo(false);

	// NOTE(ellora): yes, I know, this should be "private"...
	setInterval(this.updateTime.bind(this), CHRONO_INTERVAL);
}


Chrono.prototype.nextPomo = function(shouldDebit=true) {
	this.shouldDebit = shouldDebit;
	this.relaxDebit = 0;
	this.playing = false;
	this.pomoIndex = (this.pomoIndex + 1) % POMOS.length;
	this.epochTarget = this.target();
	this.epoch = this.epochTarget;
	this.lastUpdate = 0;
}


// NOTE(ellora): the interval is not precise, so we need to keep track of
// the time based on the last time we updated the chrono.
Chrono.prototype.updateTime = function() {
	this?.onUpdate(this);

	const now = Date.now();
	const delta = now - (this.lastUpdate === 0 ? now : this.lastUpdate);
	this.lastUpdate = now;

	if (!this.playing) {
		// if we're not playing, we need to update the relaxDebit
		if (this.shouldDebit)
			this.relaxDebit += delta;

		return;
	}

	this.epoch -= delta;

	// when the epoch is over, we need to update the next pomo
	if (this.epoch <= -this.relaxDebit)
		this.nextPomo();
}


Chrono.prototype.target = function() {
	return POMOS[this.pomoIndex] * MINUTES;
}


Chrono.prototype.percent = function() {
	return Math.min(1, (this.epoch+this.relaxDebit) / this.target());
}


Chrono.prototype.toggle = function() {
	return this.playing ^= true;
}


Chrono.prototype.isOnRelaxDebt = function() {
	return this.epochTarget - this.epoch < this.relaxDebit;
}


Chrono.prototype.fmtEpoch = function() {
	const epoch = this.epoch + this.relaxDebit;

	let minutes = Math.floor(epoch / MINUTES);
	let seconds = Math.floor((epoch % MINUTES) / SECONDS);

	minutes = minutes.toString().padStart(2, "0");
	seconds = seconds.toString().padStart(2, "0");

	return `${minutes}:${seconds}`;
}

