Generating Names
================
As demonstrated in the :doc:`getting-started` section, generating a names
using Namerer is as simple as using the ``generate`` command, for example::

	$ namerer generate

You can control what Namerer generates by providing a template as an
argument to the ``generate`` command. For example::

	$ namerer generate "????"

This would generate a simple four character output string, for example::

	yjrq

By default Namerer generates a single name, but you can use the ``--count``
option to generate more, for example::

	$ namerer generate --count 5

This would generate something like the following output::

	fkeyshtt
	ytgebziv
	kvitnilx
	cvmmwvhz
	tfsinukm

You can find out more about the various name generation command-line options 
in the :ref:`generate-command-line-options` section. The real power of Namerer
however comes from the templates that you can provide.

Templates
---------
A template is a string that you pass into the Namerer ``generate`` command
which controls the shape of the name that is generated. Namerer provides a
shortcut syntax for simple alpha and numeric which you can read about in the
:doc:`basic-templates` section which expands into a JavaScript-powered
function syntax that you can read about in the :doc:`template-functions`
section.

.. toctree::

   basic-templates
   template-functions

.. _generate-command-line-options:

Command-line Options
--------------------
You can display the list of command-line options for the ``generate``
command by adding a ``--help`` option to the command, for example::

	$ namerer generate --help
	
	  Usage: generate [options] [template]

	  Options:

		-h, --help                 output usage information
		-a, --alphabet [alphabet]  Selection of letters to generate from.
		-n, --numbers [numbers]    Seletion of numbers to generate from.
		-c, --count [count]        Number of names to generate.

The ``--alphabet`` or ``-a`` option takes a list of characters and uses them to
constrain which characters can be used when replacing a ``?`` token or
``[alpha()]`` function in the template string. For example, take the
following command and its result::

	$ namerer generate --alphabet abc "????"
	acba
	
The ``--numeric`` or ``-n`` option works the same way, but instead controls what
digits can be injected when the ``#`` token or ``[numeric()]`` function
are used in the template string. For example you might want to append
some digits to a product name but avoid what some cultures might consider
to be unlucky numbers, for example::

	$ namerer generate --numbers 0235789 "cafe ###"
	cafe 203
	
Finally the ``--count`` or ``-c`` option takes a numeric value and controls
how many instances of a particular template you want to generate::

	$ namerer generate --count 5 "???###"
	vyo148
	xyx152
	sqp102
	apt577
	njz132
	
That can be very useful when you want to generate some sample data, or just
a selection of names to consider in one pass.
