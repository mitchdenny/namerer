Template Functions
==================
Template functions are the core of Namerer's string generation
capabilities. A template function is a special token delimited
by square brakets (for example ``[vowel()]``) which when processed
is replaced by a random string, the nature of which varies depending
on which function you used.

Namerer has a bunch of different template functions from basic
random character selection to syllable generation and synonym
discovery. The following sections explain each of the template
functions.

Usage of template functions is simple. The function, enclosed in its
square brackets is placed in the template string passed into the
``generate`` function. The following invocation is an example::

	$ namerer generate -c 5 "[syllable()]"
	jwa
	piv
	wigh
	wef
	un
	
The ``[syllable()]`` function takes an optional boolean argument
which specifies whether *phonetic vowels* can be used. Here is an
example of the same invocation with the first argument (``usePhoneticVowels``)
set to false. See how it affects the nature of the output::

	$ namerer generate -c 5 "[syllable(false)]"
	hu
	wiw
	ut
	on
	he
	
You can read up on the :ref:`syllable-template-function` in more detail
in the following sections. You can combine template functions in a
single template easily, for example::

	$ namerer generate -c 5 "[syllable(false)][syllable()] [synonym('store')]"
	qiug outlet
	rodkah storage
	yisil outlet
	esro depositary
	qawlug depositary
	
It's really through combining multiple template functions together and
adding in character sequences that you really want in the name that you
find the usefulness of the Namerer tool.

.. _alpha-template-function:

[alpha(count?)]
---------------
The ``[alpha(count?)]`` template function outputs a random character
constrained by the ``--alphabet`` option which can optionally be passed
into the ``generate`` function. The function supports an optional ``count``
parameter which allows you to specify how many random characters to output.
The following table maps example templates to possible outputs.

========== ==============
Template   Output
========== ==============
[alpha]    a
[alpha(1)] w
[alpha(5)] esome
========== ==============


.. _numeric-template-function:

[numeric(count?)]
-----------------

TODO: Add documentation.

.. _vowel-template-function:

[vowel(count?)]
---------------

TODO: Add documentation.

.. _phonetic-vowel-template-function:

[phoneticVowel()]
-----------------

TODO: Add documentation.

.. _consonant-template-function:

[consonant(count?)]
-------------------

TODO: Add documentation.

.. _syllable-template-function:

[syllable(usePhoneticVowels?)]
------------------------------

TODO: Add documentation.

.. _synonym-template-function:

[synonym(word)]
---------------

TODO: Add documentation.

