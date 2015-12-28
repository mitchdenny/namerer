# Namerer
Namerer is a simple tool to generate names and check them for availability.

## Installation
Namerer is distributed as an NPM package, so you just need to issue the following command:

```sh
npm install namerer -g
```

You might need to use ```sudo``` on Mac OSX or Linux, or run in an elevated prompt on Windows to install the tool globally, however it does work as a local installation as well.

## Generating Names
Namerer has two basic uses, the first is generic random names guided by a template that you specify. The second is filtering those names to weed out ones that aren't available as a domain name, twitter handle etc (under active development). This section describes the basic usage for generating names.

### Basic Templates
Using Namerer is quite simple, once you've installed the package you can use it from the command-line to generate names:

```sh
namerer generate

Output:
lhcqalmf
```

By default, Namerer will generate an eight character name with a random set of characters in the A-Z alphabet. You can change which alphabet is being used by using the ```--alphabet``` switch.

```sh
namerer generate --alphabet abc

Output:
bbabcbcc
```

This is just a default template, most users will have some idea of what they want to generate, but want to randomly splice in other characters to make it unique or come up with some other ideas. For this you can provide a template string.

```sh
namerer genereate "cafe###"

Output:
cafe176
```

Using the ```#``` symbol in the template will inject a random number. Alternatively you can inject a random character (constrainted by the alphabet you specify - or the default A-Z):

```sh
namerer generate "???###"

Output:
yhj561
```

## Template Functions
The ```?``` and ```#``` characters in a template are just shorthand for functions that you can use in a template, so the previous example could also be written as:

```sh
namerer generate "[alpha()][alpha()][alpha()][numeric()][numeric()][numeric()]"

Output:
irw109
```

Namerer exposes a bunch of useful functions to help create more useful (and pronouncable names). Here is the current list that is supported:

- ```[alpha()]```; selects a random character (constrained by the ```--alphabet``` option).
- ```[numeric()]```; selects a random numeric (constrained by the ```--numbers``` option).
- ```[vowel()]```; selects a vowel from *a*, *e*, *i*, *o* or *u*.
- ```[phoneticVowel()]```; selects a vowel sound, for example *ou*.
- ```[consonant()]```; selects a consonant from the entire alphabet.
- ```[syllable()]```; generates (usually) a pronouncable single syllable.
- ```[synonym('word')]```; finds a synonym to match the provided word.

One of the most common functions you'll use is ```[syllable()]``` because it generally produces something that you can pronounce. For example, if we take our earlier cafe naming example, you might do something like this:

```sh
namerer generate "cafe [syllable()][syllable()]"

Output:
cafe wamza
```

The ```[syllable()]``` function generates a combination of characters with an optional leading and trailing consontant, and a vowel. By random selection, Namerer will sometimes use a phonetic vowel, but you can disable this behaviour by using the usePhoneticVowels parameter in the template:

```sh
namerer generate "cafe [syllable(usePhoneticVowels = false)][syllable(usePhoneticVowels = false)]"

Output:
cafe apvu
```

You can combine the tempalate functions to produce some interesting results, for example here we use the ```[synonym()]``` function with the ```[syllable()]``` function to also replace the word *cafe*.

```sh
namerer generate "[synonym('cafe')] [syllable()][syllable()]"

Output:
restaraunt nikoh
```

Finally, you can also get the tool to generate a bunch of names at a time using the ```--count``` switch. Here is an example:

```sh
namerer generate --count 5 "[synonym('cafe')] [syllable()][syllable()]"

Output:
restaurant puwcui
coffeehouse najseq
coffeehouse heehic
coffeehouse liqca
restaurant wigfa
```

Turns out that there aren't that many synonyms for *cafe* ;)

## Filtering Names
Filtering names is the other function that Namerer (will) support. Right now it works something like this:

```sh
namerer generate "[syllable()][syllable()]" | namerer filter

Output:
+puwcui
+najseq
+heehic
-liqca
-wigfa
```

The current implementation is extremely limited and just checks whether the ```.com``` domain is available (by checking for an NX record). When the ```+``` symbol prefixes the name, it means the ```.com``` domain is available, the opposite for a ```-```. Eventually it will support an arbitrary set of DNS suffixes a selection of common online services such as Twitter etc.

## Advanced Usage
Whilst namerer is primarily designed as a CLI tool, it can also be used as an API in your own programs, however the API can and will change. But in general it should work something like this:

```javascript
var namerer = require('namerer');
var names = namerer.generate("[syllable()][syllable()]");
```

## Contributing
Contributions are always welcome. I would recommend that you fork the repository here in GitHub, and then create a branch for your changes, and when you are ready, submit a pull request for the branch into this repo. This makes it easier for me to accept the pull request and then do any work necessary to shape it for merging into the *master* branch. Note that this project makes use of TypeScript so generally speaking all the source code will be found in ```*.ts``` files in the ```src/``` folder. The ```app.js``` file in the root of the repository is generated from the TypeScript compiler. Also note that project uses Gulp as the build tool which takes care of stamping the ```package.json``` file with the latest semantic version (pulled form Git tags). If you are adding features, don't worry about tagging for a release, I'll take care of that when I merge it in to observe semantic versioning rules (unless I stuff up). Finally, generally speaking I'm OK taking dependencies on the latest versions of Node.js and TypeScript. Because of some of the things that I want to do with the tool it is highly likely that I'll start using the async/await features in TypeScript which almost certainly means picking up much of ES6 - so if you take a dependency on this project be prepared ;)