export const hoursAgo = (date: Date, hours: number): Date => {
	const d = new Date(date)
	d.setHours(d.getHours() - hours)
	return d
}
