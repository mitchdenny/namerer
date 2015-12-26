/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
var fs = require('fs');
var underscore = require('underscore');
var request = require('sync-request');
function getVersion() {
    var content = fs.readFileSync(__dirname + '/package.json', 'utf8');
    var pkg = JSON.parse(content);
    return pkg.version;
}
exports.getVersion = getVersion;
var GeneratorContext = (function () {
    function GeneratorContext(template, alphabet, numbers) {
        this.template = template;
        this.alphabet = alphabet;
        this.numbers = numbers;
    }
    GeneratorContext.prototype.selectRandom = function (possibilities) {
        var randomIndex = Math.floor(Math.random() * possibilities.length);
        var selection = possibilities[randomIndex];
        return selection;
    };
    GeneratorContext.prototype.synonym = function (word) {
        var url = "http://words.bighugelabs.com/api/2/845ce6475dd073474a31f951868035d7/" + word + "/json";
        var response = request('get', url);
        var lookup = JSON.parse(response.getBody());
        var mergedSynonyms = [];
        if (lookup.verb) {
            var verbSynonyms = lookup.verb.syn.filter(function (value) { return value.indexOf(' ') == -1; });
            mergedSynonyms = mergedSynonyms.concat(verbSynonyms);
        }
        if (lookup.noun) {
            var nounSynonyms = lookup.noun.syn.filter(function (value) { return value.indexOf(' ') == -1; });
            mergedSynonyms = mergedSynonyms.concat(nounSynonyms);
        }
        var output = this.selectRandom(mergedSynonyms);
        return output;
    };
    GeneratorContext.prototype.consonant = function () {
        var consonants = [
            'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n',
            'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
        ];
        var output = this.selectRandom(consonants);
        return output;
    };
    GeneratorContext.prototype.syllable = function (usePhoneticVowels) {
        var _this = this;
        if (usePhoneticVowels === void 0) { usePhoneticVowels = true; }
        var syllableTemplates = [
            function () { return ("" + _this.vowel() + _this.consonant()); },
            function () { return ("" + _this.consonant() + _this.vowel()); },
            function () { return ("" + _this.consonant() + _this.vowel() + _this.consonant()); }
        ];
        if (usePhoneticVowels) {
            syllableTemplates.push(function () { return ("" + _this.consonant() + _this.phoneticVowel()); });
        }
        var syllableTemplate = this.selectRandom(syllableTemplates);
        var output = syllableTemplate();
        return output;
    };
    GeneratorContext.prototype.vowel = function () {
        var vowels = [
            'a', 'e', 'i', 'o', 'u'
        ];
        var output = this.selectRandom(vowels);
        return output;
    };
    GeneratorContext.prototype.phoneticVowel = function () {
        // source: http://www.phonicsontheweb.com/vowel-combinations.php
        var phoneticVowels = [
            'a', 'ai', 'ay', 'au', 'aw', 'augh', 'wa', 'all', 'ald', 'alk', 'alm', 'alt',
            'e', 'ee', 'ea', 'eu', 'ei', 'ey', 'ew', 'eigh',
            'i', 'ie', 'ye', 'igh', 'ign', 'ind',
            'o', 'oo', 'oa', 'oe', 'oi', 'oy', 'old', 'olk', 'olt', 'oll', 'ost', 'ou', 'ow',
            'u', 'ue', 'ui'
        ];
        var output = this.selectRandom(phoneticVowels);
        return output;
    };
    GeneratorContext.prototype.alpha = function (length) {
        if (length === void 0) { length = 1; }
        var output = [];
        for (var outputIndex = 0; outputIndex < length; outputIndex++) {
            var character = this.selectRandom(this.alphabet);
            output[outputIndex] = character;
        }
        return output.join('');
    };
    GeneratorContext.prototype.numeric = function (length) {
        if (length === void 0) { length = 1; }
        var output = [];
        for (var outputIndex = 0; outputIndex < length; outputIndex++) {
            var number = this.selectRandom(this.numbers);
            output[outputIndex] = number;
        }
        return output.join('');
    };
    return GeneratorContext;
})();
function generateName(context) {
    var generator = underscore.template(context.template, {
        interpolate: /\[(.+?)\]/g
    });
    var output = generator(context);
    return output;
}
function processTemplate(template) {
    var processedTemplate = template.replace(/#/g, '[numeric()]');
    processedTemplate = processedTemplate.replace(/\?/g, '[alpha()]');
    return processedTemplate;
}
function generate(template, alphabet, numbers, count) {
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
    var names = [];
    var processedTemplate = processTemplate(template);
    var context = new GeneratorContext(processedTemplate, alphabet.split(''), numbers.split(''));
    for (var nameIndex = 0; nameIndex < count; nameIndex++) {
        var name_1 = generateName(context);
        names.push(name_1);
        console.log(name_1);
    }
}
exports.generate = generate;
function processCandidatesFromStdin(dnsSuffixes) {
    var data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (chunk) {
        data = data + chunk;
    });
    process.stdin.on('end', function () {
        var candidates = data.split('\n');
        for (var candidateIndex in candidates) {
            var candidate = candidates[candidateIndex];
            processCandidate(candidate, dnsSuffixes);
        }
    });
}
function processCandidate(candidate, dnsSuffixes) {
    console.log(candidate);
}
function filter(candidate, dnsSuffixes) {
    if (candidate == null) {
        processCandidatesFromStdin(dnsSuffixes);
    }
    else {
        processCandidate(candidate, dnsSuffixes);
    }
}
exports.filter = filter;
