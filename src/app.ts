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

class GeneratorResult {
	constructor(name: string) {
		this.name = name;
	}
	
	public name: string;
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

export function generate(template?: string, alphabet?: string, numbers?: string, count?: number): Promise<GeneratorResult[]> {
	let promise = new Promise<GeneratorResult[]>((resolve, reject) => {
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
	
		let processedTemplate = processTemplate(template);
	
		let context = new GeneratorContext(
			processedTemplate,
			alphabet.split(''),
			numbers.split('')
		);
	
		let results: GeneratorResult[] = [];
	
		for (let resultIndex = 0; resultIndex < count; resultIndex++) {
			let name = generateName(context);
			let result = new GeneratorResult(name);
			results.push(result);
		}
		
		resolve(results);
	});
		
	return promise;
}

async function getNamesFromStdIn(): Promise<string[]> {
	let promise = new Promise<string[]>((resolve, reject) => {
		let data: string = '';
	
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', function(chunk) {
			data = data + chunk;
		});
		
		process.stdin.on('end', async function() {
			let lines: string[] = data.split('\n');
			let names: string[] = [];
			
			for (let lineIndex in lines) {
				let line = lines[lineIndex];
	
				if (line != '') {
					names.push(line);
				}
			}
			
			resolve(names);
		});
	});
	
	return promise;
}

async function processNamesFromStdin(dnsSuffixes: string[]): Promise<FilterResult[]> {
	let names = await getNamesFromStdIn();
	let results: FilterResult[] = [];
	
	for (let nameIndex in names) {
		let name = names[nameIndex];
		
		if (name != '') {
			let context = new FilterContext(name, dnsSuffixes);
			let result = await processName(context);
			results.push(result);
		}
	}
	
	return results;
}

class FilterContext {
	constructor(name: string, dnsSuffixes: string[]) {
		this.name = name;
		this.dnsSuffixes = dnsSuffixes;
	}
	
	public name: string;
	public dnsSuffixes: string[];
}

class FilterResult {
	constructor(name: string) {
		this.name = name;
	}
	
	public name: string;
	public checks: Check[] = [];

	public get isAvailable(): boolean {
		let passedChecks = this.checks.filter((check) => check.isAvailable);
		
		if (passedChecks != null && passedChecks.length > 0) {
			return true;
		} else {
			return false;
		}
	}
}

class Check {
	constructor(check: string, name: string, isAvailable: boolean) {
		this.check = check;
		this.name = name;
		this.isAvailable = isAvailable;
	}
	
	private check: string;
	private name: string;
	public isAvailable: boolean;
}

async function checkDomainName(domainName: string): Promise<Check> {
	let promise = new Promise<Check>((resolve, reject) => {
		dns.resolveNs(domainName, function(err, addresses) {
			if (err) {
				let check = new Check('DomainName', domainName, true);
				resolve(check);
			} else {
				let check = new Check('DomainName', domainName, false);
				resolve(check);
			}
		});
	});
	
	return promise;
}

async function checkDomainNames(context: FilterContext): Promise<Check[]> {
	let checks: Check[] = [];
	
	for (let dnsSuffixIndex in context.dnsSuffixes) {
		let dnsSuffix = context.dnsSuffixes[dnsSuffixIndex];
		let domainName = `${context.name}.${dnsSuffix}`;
		let check = await checkDomainName(domainName);
		checks.push(check);
	}
	
	return checks;
}

async function processName(context: FilterContext): Promise<FilterResult> {
	let result: FilterResult = new FilterResult(context.name);
	
	let dnsChecks = await checkDomainNames(context);
	result.checks = result.checks.concat(dnsChecks);
	
	return result;
}

export async function filter(name: string, dnsSuffixes: string[]): Promise<FilterResult[]> {
	if (dnsSuffixes == null) {
		dnsSuffixes = ['com'];
	}
	
	if (name == null) {
		return await processNamesFromStdin(dnsSuffixes);
	} else {
		let context = new FilterContext(name, dnsSuffixes);
		let result = await processName(context);
		return [result];
	}
}
