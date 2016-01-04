Basic Templates
===============
The Namerer ``generate`` function uses templates to control its
output. Templates are strings interspersed with placeholders which
when processed are replaced with values which correspond to the kind
of placeholders used. For example the basic template ``???###`` could be
transformed into ``abc123``.

The ``?`` and ``#`` placeholders are really just shorthand for a more
function-based syntax. Prior to processing a template into a string
the ``?`` and ``#`` characters are first converted into equivalent
function-based syntax. For example, the ``???###`` template would be
expanded into the following::

	[alpha()][alpha()][alpha()][numeric()][numeric()[numeric()]
	
We'll explore :doc:`template-functions` a little later, but for now know
that ``?`` is the same as ``[alpha()]`` and ``#`` is the same as
``[numeric()]``. At this point in time ``?`` and ``#`` are the only
two shorthand characters.