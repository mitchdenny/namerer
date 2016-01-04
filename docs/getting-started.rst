Getting Started
===============
Getting started with Namerer is easy. You just need to make sure you have
the right prerequisites installed, and then pull down the NPM package.

Prerequisites
-------------
Namerer requires Node.js 4.0.0 or greater to be installed, but you may as
well just grab the latest version because that is what we build and test
against.

Installation
------------
Once you have Node.js installed and configured on your system, you just
need to pull down and install the ``namerer`` NPM package using the
following command.

``npm install -g namerer``

This will install the ``namerer`` package globally so that you can issue
commands anywhere in the shell. Alternatively you can install it locally
which is especially useful if you want to use it as a library for your
own project.

Hello World
-----------
Once you've installed Namerer, it is time for a simple hello world example
to make sure everything is working. The simplest command in Namerer is a
basic ``generate`` command, invoked as follows:

``namerer generate``

This will output a single string which should be eight characters long
comprised of characters from the alphabet, for example:

``ighhkccy``

Namerer is template driven so you can actually control what is output so
you could make it output only four random characters by issuing the
following command:

``namerer generate "????"``

You can learn more about how Namerer works in the :doc:`generating-names` section.