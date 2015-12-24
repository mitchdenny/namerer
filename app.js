/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
var fs = require('fs');
var underscore = require('underscore');
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
    GeneratorContext.prototype.actual = function (input) {
        return input;
    };
    GeneratorContext.prototype.alpha = function () {
        var character = this.selectRandom(this.alphabet);
        return character;
    };
    GeneratorContext.prototype.numeric = function () {
        var number = this.selectRandom(this.numbers);
        return number;
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
    var context = new GeneratorContext(template, alphabet.split(''), numbers.split(''));
    for (var nameIndex = 0; nameIndex < count; nameIndex++) {
        var name_1 = generateName(context);
        names.push(name_1);
        console.log(name_1);
    }
}
exports.generate = generate;
