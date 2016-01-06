Filtering Names
===============
The Namerer ``filter`` command is a useful utility to take a name (or
multiple names via stdin) and then check whether it is available. The
current implementation of the ``filter`` command supports checking
for DNS domain names with one more more suffixes. Refer to the :ref:`filter-command-line-options`
section.

The ``filter`` command works by taking an input string (or multple) and
then performing a number of availability checks. If the name passes all
of the availability checks it is output to stdout. Here is an example of
checking a single name::

	$ namerer filter "somerandomname"
	somerandomname
	
The above invocation worked because the ``somerandomname.com`` domain
was available. In contrast, the following invocation would return nothing::

	$ namerer filter "microsoft"
	
The Namerer ``filter`` command is designed to be used in conjunction with
the ``generate`` command to quickly zero in on names that have a good
chance of being usable. Here is an example of how you might use them
to come up with a name with two syllables and check that the ``.com`` and ``.io``
suffixes are available::

	$ namerer generate -c 10 "[syllable(false)][syllable()]" | namerer filter -d com,io
	zetjim
	amza
	vogoy
	viij
	ufmall
	halev
	ozyun
	nopoll
	
In this case only 8 names made it through the filter meaning that 2 of the 10
generated names had either a ``.com`` or ``.io`` suffix.	

.. _filter-command-line-options:

Command-line Options
--------------------
You can display the list of command-line options for the ``filter``
command by adding a ``--help`` option to the command, for example::

	$ namerer filter --help
	
	Usage: filter [options] [name]

	Options:

		-h, --help                  output usage information
		-d, --dnssuffixes [suffix]  

The ``--dnssuffixes`` or ``-d`` option takes a comma-seperated list of DNS
suffixes, for example::

	$ namerer filter --dnssuffixes com,com.au "somerandomname"
	somerandomname

If the ``--dnssuffixes`` option is excluded then the current behaviour
is that a ``.com`` suffix will be assumed. In the future when future checks
are performed for other services it may be that a bare ``--dnssuffixes``
option will apply ``.com`` and other sensible defaults and its absence
will skip the DNS check altogether.