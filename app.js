/// <reference path="../typings/node/node.d.ts" />
var fs = require('fs');
function getVersion() {
    var content = fs.readFileSync('package.json', 'utf8');
    var pkg = JSON.parse(content);
    return pkg.version;
}
exports.getVersion = getVersion;
function selectRandom(possibilities) {
    var randomIndex = Math.floor(Math.random() * possibilities.length);
    var selection = possibilities[randomIndex];
    return selection;
}
function appendLetter(input, alphabet) {
    var character = selectRandom(alphabet.split(''));
    var output = input + character;
    return output;
}
function appendActual(input, actual) {
    var output = input + actual;
    return output;
}
function appendNumber(input, numbers) {
    var number = selectRandom(numbers.split(''));
    var output = input + number;
    return output;
}
function generateName(template, alphabet, numbers) {
    var generators = [];
    var output = '';
    for (var templateIndex = 0; templateIndex < template.length; templateIndex++) {
        var templateCharacter = template[templateIndex];
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
    for (var nameIndex = 0; nameIndex < count; nameIndex++) {
        var name_1 = generateName(template, alphabet, numbers);
        names.push(name_1);
        console.log(name_1);
    }
}
exports.generate = generate;
