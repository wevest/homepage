export const dateId = (minusDays = 0) => {
	const d = new Date();
	d.setDate(d.getDate()-minusDays);
	const date = d.getUTCDate();
	const month = d.getUTCMonth()+1;
	const year = d.getUTCFullYear();
	return `${date}-${month}-${year}`;
};

export const hourNow = () => {
	const d = new Date();
	return d.getHours();
};

export const daysOld = (id, days) => {
	const [d2,m2,y2] = id.split('-');

	const d = new Date();
	const ago = new Date(d.getTime() - (days * 24 * 60 * 60 * 1000));
	const then = new Date(y2, m2-1, d2, 0, 0, 0, 0);

	return then < ago;
};

export const utcToLocal = (id, hour = 0) => {
	const [d2,m2,y2] = id.split('-');

	const d = new Date();
	d.setUTCDate(d2);
	d.setUTCMonth(m2);
	d.setUTCFullYear(y2);
	d.setUTCHours(hour);
	const date = d.getDate();
	const month = d.getMonth();
	const year = d.getFullYear();
	return [`${date}-${month}-${year}`, d.getHours()];
};

export const timeDiffInSeconds = (time1,time2) => {
	let diff = time1.getTime() - time2.getTime();
	let seconds = Math.floor((diff) / (1000));
	return seconds;
};

export const subtractDate = (date1,diffDates) => {
	let newDate = date1 -diffDates*24*3600*1000; 
	return new Date(newDate);
}



// a and b are javascript Date objects
export const subtractDay = (a, b) => {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
  	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


export const getTimeStamp = (date1) => {
	if (! date1) {
		date1 = new Date();
	}
	let newDate = Math.round(date1.getTime()/1); 
	return newDate;
}

export const getNowTimestamp = () => {
	return new Date().getTime();
}