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
into the ``generate`` command. The function supports an optional ``count``
parameter which allows you to specify how many random alpha characters to
output. The following table maps example templates to possible outputs.

========== ==============
Template   Output
========== ==============
[alpha()]    a
[alpha(1)] w
[alpha(5)] esome
========== ==============

.. _numeric-template-function:

[numeric(count?)]
-----------------
The ``[numeric(count?)]`` template function is similar to the :ref:`alpha-template-function`
in that it generates a random character, but it is instead constained by the
``--numbers`` option which can optionally be passed into the ``generate``
command. This function also supports an optional ``count`` parameter which
allows you to specifiy how many random numeric characters to output. The
following table maps example templates to possible outputs.

============ ==============
Template     Output
============ ==============
[numeric()]    3
[numeric(1)] 9
[numeric(5)] 31337
============ ==============

.. _vowel-template-function:

[vowel(count?)]
---------------
The ``[alpha(count?)]`` template function is similar to the :ref:`alpha-template-function`
in that it generates a random character, however it will only generate a simple
vowel, such as ``a``, ``e``, ``i``, ``o``, or ``u``. This function also supports
an optional ``count`` parameter which allows you to specify how many vowels
to output. The following table maps templates to possible outputs.

========== ==============
Template     Output
========== ==============
[vowel()]  a
[vowel(1)] e
[vowel(5)] iouee
========== ==============

.. _phonetic-vowel-template-function:

[phoneticVowel()]
-----------------
The ``[phoneticVowel()]`` template function outputs a single string and takes
no arguments. It outputs a vowels similar to the :ref:`vowel-template-function`
template function, but also adds additional phonetic vowels. The following
table shows basic vowels and their related phonetic vowels that might also
be output when using the ``[phoneticVowel()]`` function.

=========== ========================================
Basic Vowel Phonetic Vowels
=========== ========================================
a           ai ay au aw augh wa all ald alk alm alt
e           ee ea eu ei ey ew eigh
i           ie ye igh ign ind
o           oo oa oe oi oy old olk olt oll ost ou ow
u           ue ui
=========== ========================================

.. _consonant-template-function:

[consonant(count?)]
-------------------
The ``[consonant(count?)]`` template function is similar to the :ref:`vowel-template-function`
in that it generates a random character, however it will only generate a consonant
such as ``b``, ``c``, ``d``, ``f``, ``g``, ``h``, ``j``,
``k``, ``l``, ``m``, ``n``, ``p``, ``q``, ``r``, ``s``,
``t``, ``v``, ``w``, ``x``, ``y``, or ``z``. This function
also supports an optional ``count`` parameter which allows you to specify
how many consonants to output. The following table maps templates to
possible outputs.

============== ==============
Template       Output
============== ==============
[consonant()]  z
[consonant(1)] b
[consonant(5)] phjkl
============== ==============

.. _syllable-template-function:

[syllable(usePhoneticVowels?)]
------------------------------
The ``[syllable(usePhoneticVowels?)]`` template function is very useful for
generating names which are easier to pronounce than random strings that
might be generated by the :ref:`alpha-template-function` template function
(for example). The ``[syllable(usePhoneticVowels)]`` function reuses the
logic from the :ref:`vowel-template-function`, :ref:`phonetic-vowel-template-function` and :ref:`consonant-template-function`
template functions. It randomly selects from the following four possible
equivalent templates.

1. ``[consonant()][vowel()]``
2. ``[consonant()][vowel()][consonant()]``
3. ``[vowel()][consonant()]``
4. ``[consonant()][phoneticVowel()]``

The fourth option is included by default, however, it can be disabled
when the ``usePhoneticVowels`` optional parameter is set to false. The following
is an example of its usage::

	$ namerer generate -c 5 "[syllable(false)][syllable()]"
	xucpa
	inkwa
	kucta
	etheigh
	varom

.. _synonym-template-function:

[synonym(word)]
---------------
The ``[synonym(word)]`` template function can be used to find words which
have a similar or related meaning to the value of the ``word`` parameter. The
``[synonym(word)]`` template function calls an external web service at
`Big Huge Labs <http://words.bighugelabs.com>`_. At this point in time the
``[synonym(word)]`` template function should be considered experimental and
may fail if it is used heavily across all Namerer users (because of API call
limitations). The following is an example of its usage::

	$ namerer generate -c 5 "[synonym('port')]###"
	turn351
	opening171
	side462
	porthole843
	turn118