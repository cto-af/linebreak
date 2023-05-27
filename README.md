# @cto.af/linebreak

An implementation of the Unicode Line Breaking Algorithm
[UAX #14](https://www.unicode.org/reports/tr14/).  This implementation was
originally started as a refresh of the
[linebreak](https://github.com/foliojs/linebreak) package, and still shares
a small amount of test driver code with that project.  The rest has been
rewritten to support a fully rules-based approach that implements UAX #14 from
Unicode version 15.0.  From that document:

> Line breaking, also known as word wrapping, is the process of breaking a
> section of text into lines such that it will fit in the available width of a
> page, window or other display area. The Unicode Line Breaking Algorithm
> performs part of this process. Given an input text, it produces a set of
> positions called "break opportunities" that are appropriate points to begin
> a new line. The selection of actual line break positions from the set of
> break opportunities is not covered by the Unicode Line Breaking Algorithm,
> but is in the domain of higher level software with knowledge of the
> available width and the display size of the text.

## Installation

```sh
npm install @cto.af/linebreak
```

## API

Create and use a new Rules object:

```js
import {Rules} from '@cto.af/linebreak'
const r = new Rules({string: true});
for (const brk of r.breaks('my input string')) {
  console.log(brk.string); // "my ", "input ", "string"
  console.log(brk.pos); // 3, 9, 15
  console.log(brk.required); // false, false, true
}
```

The `string` option in the constructor will chop the input up for you into
strings, rather than your having to do the slicing yourself.  You may only
need the positions of the breaks, which is why this isn't done by default.
The iterated `Break` objects also have a `required` field.

You can tailor the rules that will be applied:

```js
import {Rules, PASS} from '@cto.af/linebreak'
const r = new Rules();
r.replaceRule('LB25', (state) => PASS); // Do something more interesting that this!
```

There are a few other convenience function available for modifying rules.  A
few of the rules have interactions with one another due to idiosyncrasies of
the specification text.  Comments have been left at these points in the
source.  If you are going to replace or remove an existing rule, please make
sure to account for those interactions.

In order for the conformance tests to pass, you can use the expanded number
definition from UAX #14, [Example 7](https://www.unicode.org/reports/tr14/#Example7):

```js
const r = new Rules({example7: true});
```

## API Documentation

Full API documentation is [available](http://cto-af.github.io/linebreak/).

## Conformance to UAX #14

This package intends to be fully conformant with UAX #14.  It currently passes
**ALL** of the
[tests](https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/LineBreakTest.txt)
published by Unicode, when the `example7` option is enabled in the costructor.

Other tailoring is possible by adding and removing rules.

## License

MIT

---
[![Tests](https://github.com/cto-af/linebreak/actions/workflows/node.js.yml/badge.svg)](https://github.com/cto-af/linebreak/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/cto-af/linebreak/branch/main/graph/badge.svg?token=OyXDzCGY0Q)](https://codecov.io/gh/cto-af/linebreak)
