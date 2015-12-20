export function generate() {
	let alphabet: string = 'abcdefghijklmnopqrstuvwxyz';
	let selectionIndex: number = Math.round(Math.random() * alphabet.length);
	let selected: string = alphabet[selectionIndex];
	console.log(selected);
}
