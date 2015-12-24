/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
import * as fs from 'fs';
import underscore = require('underscore');
var request = require('sync-request');

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
	
	public synonym(word: string): string {
		let url = `http://words.bighugelabs.com/api/2/845ce6475dd073474a31f951868035d7/${word}/json`;
		let response = request('get', url);
		let lookup = JSON.parse(response.getBody());
		
		let mergedSynonyms: string[] = [];

		if (lookup.verb) {
			let verbSynonyms: string[] = lookup.verb.syn.filter((value: string) => value.indexOf(' ') == -1);
			mergedSynonyms = mergedSynonyms.concat(verbSynonyms);
		}

		if (lookup.noun) {
			let nounSynonyms: string[] = lookup.noun.syn.filter((value: string) => value.indexOf(' ') == -1);
			mergedSynonyms = mergedSynonyms.concat(nounSynonyms);
		}

		let randomSynonym = this.selectRandom<string>(mergedSynonyms);
		return randomSynonym;
	}
	
	public syllable(): string {
		let vowels: string[] = [
			'ae', 'ei', 'ie', 'ay', 'ou'	
		];
		
		let randomVowel = this.selectRandom(vowels);
		return randomVowel;
	}
	
	public alpha(length: number = 1): string {
		let output: string[] = [];
		
		for (let outputIndex = 0; outputIndex < length; outputIndex++) {
			let character = this.selectRandom(this.alphabet);
			output[outputIndex] = character;			
		}
		
		return output.join('');
	}
	
	public numeric(length: number = 1): string {
		let output: string[] = [];
		
		for (let outputIndex = 0; outputIndex < length; outputIndex++) {
			let number = this.selectRandom(this.numbers);
			output[outputIndex] = number;			
		}
		
		return output.join('');
	}
}

function generateName(context: GeneratorContext): string {
	let generator = underscore.template(context.template, {
		interpolate: /\[(.+?)\]/g
	});
	
	let output = generator(context);
	return output;
}

function processTemplate(template: string): string {
	let processedTemplate = template.replace(/#/g, '[numeric()]');
	processedTemplate = processedTemplate.replace(/\?/g, '[alpha()]');
	
	return processedTemplate;
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
	
	let processedTemplate = processTemplate(template);
	
	let context = new GeneratorContext(
		processedTemplate,
		alphabet.split(''),
		numbers.split('')	
	);
	
	for (let nameIndex = 0; nameIndex < count; nameIndex++) {
		let name = generateName(context);
		names.push(name);
		console.log(name);
	}
}
