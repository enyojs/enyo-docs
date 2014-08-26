### Links

> We support a subset of the JSDoc3 standard link syntax. The reason we do not support all of the syntax is that it makes assumptions about output formatting but we keep that logic separate from the pragma. The other variants are superfluous to achieving the desired output.

##### Link to a symbol

- {@link symbol}
- [caption]{@link symbol}

##### Link to href (webpage)

- {@linkplain http://full.path}
- {@linkplain relative/path/to/internal}
- [caption]{@linkplain http://full.path}
- [caption]{@linkplain relative/path/to/internal}

##### Glossary term

- {@glossary term}
- [caption]{@glossary term}