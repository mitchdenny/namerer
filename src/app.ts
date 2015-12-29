/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
"use strict";

import * as fs from 'fs';
import * as util from 'util';
import * as dns from 'dns';
var underscore = require('underscore');
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

		let output = this.selectRandom<string>(mergedSynonyms);
		return output;
	}

	public consonant(): string {
		let consonants: string[] = [
			'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n',
			'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
		];

		let output = this.selectRandom(consonants);
		return output;
	}

	public syllable(usePhoneticVowels: boolean): string {
		if (usePhoneticVowels === undefined) {
			usePhoneticVowels = true;
		}
		
		let syllableTemplates = [
			() => `${this.vowel() }${this.consonant() }`,
			() => `${this.consonant() }${this.vowel() }`,
			() => `${this.consonant() }${this.vowel() }${this.consonant() }`
		];
		
		if (usePhoneticVowels) {
			syllableTemplates.push(
				() => `${this.consonant() }${this.phoneticVowel() }`
			);
		}

		let syllableTemplate = this.selectRandom(syllableTemplates);

		let output = syllableTemplate();
		return output;
	}

	public vowel(): string {
		let vowels: string[] = [
			'a', 'e', 'i', 'o', 'u'
		];

		let output = this.selectRandom(vowels);
		return output;
	}

	public phoneticVowel(): string {
		// source: http://www.phonicsontheweb.com/vowel-combinations.php
		let phoneticVowels: string[] = [
			'a', 'ai', 'ay', 'au', 'aw', 'augh', 'wa', 'all', 'ald', 'alk', 'alm', 'alt',
			'e', 'ee', 'ea', 'eu', 'ei', 'ey', 'ew', 'eigh',
			'i', 'ie', 'ye', 'igh', 'ign', 'ind',
			'o', 'oo', 'oa', 'oe', 'oi', 'oy', 'old', 'olk', 'olt', 'oll', 'ost', 'ou', 'ow',
			'u', 'ue', 'ui'
		];

		let output = this.selectRandom(phoneticVowels);
		return output;
	}

	public alpha(length: number): string {
		if (length === undefined) {
			length = 1;
		}
		
		let output: string[] = [];
		
		for (let outputIndex = 0; outputIndex < length; outputIndex++) {
			let character = this.selectRandom(this.alphabet);
			output[outputIndex] = character;
		}

		return output.join('');
	}

	public numeric(length: number): string {
		if (length === undefined) {
			length = 1;
		}
		
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

export function generate(template?: string, alphabet?: string, numbers?: string, count?: number): Promise<string[]> {
	let promise = new Promise<string[]>((resolve, reject) => {
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
		}
		
		resolve(names);
	});
		
	return promise;
}

async function processCandidatesFromStdin(dnsSuffixes: string[]) {
	let data: string = '';

	process.stdin.setEncoding('utf8');
	process.stdin.on('data', function(chunk) {
		data = data + chunk;
	});
	process.stdin.on('end', async function() {
		let candidates: string[] = data.split('\n');

		for (let candidateIndex in candidates) {
			let candidate = candidates[candidateIndex];

			if (candidate != '') {
			    let context = new FilterContext(candidate);
				await processCandidate(context);
			}
		}
	});
}

class FilterContext {
	constructor(name: string) {
		this.name = name;
	}
	
	public name: string;
	public results: FilterResult[] = [];
}

class FilterResult {
	constructor(check: string, name: string, isAvailable: boolean) {
		this.check = check;
		this.name = name;
		this.isAvailable = isAvailable;
	}
	
	private check: string;
	private name: string;
	private isAvailable: boolean;
}

async function checkDomainName(context: FilterContext): Promise<any> {
	let promise = new Promise<any>((resolve, reject) => {
		let domainName = `${context.name}.com`;
		
		dns.resolveNs(domainName, function(err, addresses) {
			if (err) {
				let result = new FilterResult('DomainName', domainName, true);
				context.results.push(result);
				resolve();
			} else {
				let result = new FilterResult('DomainName', domainName, false);
				context.results.push(result);
				resolve();
			}
		});	
	});
	
	return promise;
}

async function processCandidate(context: FilterContext): Promise<any> {
	await checkDomainName(context);
	console.log(context);
}

export async function filter(candidate: string, dnsSuffixes: string[]): Promise<FilterContext> {
	if (candidate == null) {
		processCandidatesFromStdin(dnsSuffixes);
	} else {
		let context = new FilterContext(candidate);
		return await processCandidate(context);
	}
}
