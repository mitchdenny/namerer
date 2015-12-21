/// <reference path="../typings/node/node.d.ts" />
import * as fs from 'fs';

export function getVersion() {
	let content = fs.readFileSync('package.json', 'utf8');
	let pkg = JSON.parse(content);
	return pkg.version;
}

function selectRandom<T>(possibilities: T[]): T {
	let randomIndex = Math.floor(Math.random() * possibilities.length);
	let selection = possibilities[randomIndex];
	return selection;
}

function appendLetter(input: string, alphabet: string): string {
	let character = selectRandom(alphabet.split(''));	
	let output = input + character;
	return output;
}

function appendActual(input: string, actual: string): string {
	let output = input + actual;
	return output;
}

function appendNumber(input: string, numbers: string): string {
	let number = selectRandom(numbers.split(''));	
	let output = input + number;
	return output;
}

function generateName(template: string, alphabet: string, numbers: string): string {
	let generators: ((() => string) | string)[] = [];
	
	let output: string = '';
	
	for(let templateIndex = 0; templateIndex < template.length; templateIndex++) {
		let templateCharacter = template[templateIndex];

		switch (templateCharacter) {
			case '?':
				output = appendLetter(output, alphabet);
				break;
			case '#':
				output = appendNumber(output, numbers);
				break;
			default:
				output = appendActual(output, templateCharacter);
				break;
		}
	}
	
	return output;
}

export function generate(template?: string, alphabet?: string, numbers?: string, count?: number) {
	if (!template) {
		template = '????????';
	}
	
	if (!alphabet) {
		alphabet = 'abcdefghijklmnopqrstuvwxyz';
	}

	if (!numbers) {
		numbers = '0123456789';
	}
	
	if (!count) {
		count = 1;
	}
	
	let names: string[] = [];
	
	for (let nameIndex = 0; nameIndex < count; nameIndex++) {
		let name = generateName(template, alphabet, numbers);
		names.push(name);
		console.log(name);
	}
}
