/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
import * as fs from 'fs';
import underscore = require('underscore');

export function getVersion() {
	let content = fs.readFileSync(__dirname + '/package.json', 'utf8');
	let pkg = JSON.parse(content);
	return pkg.version;
}

class GeneratorContext {
	constructor(template: string, alphabet: string[], numbers: string[]) {
		this.template = template;
		this.alphabet = alphabet;
		this.numbers = numbers;
	}
	
	public template: string;

	private alphabet: string[];
	private numbers: string[];
	
	private selectRandom<T>(possibilities: T[]): T {
		let randomIndex = Math.floor(Math.random() * possibilities.length);
		let selection = possibilities[randomIndex];
		return selection;
	}
	
	public actual(input: string): string {
		return input;
	}
	
	public alpha(): string {
		let character = this.selectRandom(this.alphabet);
		return character;
	}
	
	public numeric(): string {
		let number = this.selectRandom(this.numbers);
		return number;
	}
}

function generateName(context: GeneratorContext): string {
	let generator = underscore.template(context.template, {
		interpolate: /\[(.+?)\]/g
	});
	
	let output = generator(context);
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
	
	let context = new GeneratorContext(
		template,
		alphabet.split(''),
		numbers.split('')	
	);
	
	for (let nameIndex = 0; nameIndex < count; nameIndex++) {
		let name = generateName(context);
		names.push(name);
		console.log(name);
	}
}
