export const getPrettifiedErrorString = (s: string): string => {
	return s
		.replaceAll('(', '')
		.replaceAll(')', '')
		.replaceAll('=', ' ')
}
