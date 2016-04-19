[![npm version](https://badge.fury.io/js/namerer.svg)](https://badge.fury.io/js/namerer)
[![docs](https://readthedocs.org/projects/namerer/badge/?version=latest)](https://namerer.rtfd.org)
[![build](https://mitchdenny.visualstudio.com/DefaultCollection/_apis/public/build/definitions/df7963ae-08aa-428b-bc9d-4850a15b56af/27/badge)](https://mitchdenny.visualstudio.com/DefaultCollection/namerer/_build#definitionId=27&_a=completed)

# Namerer
Namerer is a simple tool to generate names and check them for availability.

## Getting Started
Namerer is distributed as an NPM package, so you just need to issue the following command:

```sh
$ npm install namerer -g
```

You might need to use ```sudo``` on Mac OSX or Linux, or run in an elevated prompt on Windows to install the tool globally, however it does work as a local installation as well.

Using Namerer is quite simple, once you've installed the package you can use it from the command-line to generate names:

```sh
$ namerer generate
lhcqalmf
```

You can also shape the output of the string by using template functions, for example:

```sh
$ namerer generate "[syllable(false)][syllable()]"
inkwa
```

I've put together [complete documentation for Namerer](http://namerer.rtfd.org) to answer all your questions, but if you've got any problems feel free to [raise an issue here on GitHub](https://github.com/mitchdenny/namerer/issues).

## Contributing
Contributions are always welcome. I would recommend that you fork the repository here in GitHub, and then create a branch for your changes, and when you are ready, submit a pull request for the branch into this repo. This makes it easier for me to accept the pull request and then do any work necessary to shape it for merging into the *master* branch.

Note that this project makes use of TypeScript so generally speaking all the source code will be found in ```*.ts``` files in the ```src/``` folder. The ```app.js``` file in the root of the repository is generated from the TypeScript compiler. Also note that project uses Gulp as the build tool which takes care of stamping the ```package.json``` file with the latest semantic version (pulled form Git tags).

If you are adding features, don't worry about tagging for a release, I'll take care of that when I merge it in to observe semantic versioning rules (unless I stuff up). Finally, generally speaking I'm OK taking dependencies on the latest versions of Node.js and TypeScript. Because of some of the things that I want to do with the tool it is highly likely that I'll start using the async/await features in TypeScript which almost certainly means picking up much of ES6 - so if you take a dependency on this project be prepared ;)

Random change4
