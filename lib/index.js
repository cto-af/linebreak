import { CI_BRK, CP_BRK, DI_BRK, IN_BRK, PR_BRK, pairTable } from './pairs.js';
import { Classes, LineBreak } from './lineBreak.js';

const {
  AI, AL, BA, BK, CJ, CR, HL, HY, LF, NL, NS, RI, SA, SG, SP, WJ, XX, ZWJ,
} = Classes;

/**
 * LB1: Assign a line breaking class to each code point of the input. Resolve
 * AI, CB, CJ, SA, SG, and XX into other line breaking classes depending on
 * criteria outside the scope of this algorithm.
 *
 * @param {number} c
 * @returns {number}
 * @private
 */
function mapClass(c) {
  switch (c) {
    case AI:
      return AL;

    case SA:
    case SG:
    case XX:
      return AL;

    case CJ:
      return NS;

    default:
      return c;
  }
}

/**
 * @param {number} c
 * @returns {number}
 * @private
 */
function mapFirst(c) {
  switch (c) {
    case LF:
    case NL:
      return BK;

    case SP:
      return WJ;

    default:
      return c;
  }
}

class Break {
  /**
   * @param {number} position
   * @param {boolean} [required=false]
   */
  constructor(position, required = false) {
    /**
     * Offset into input string in JS characters (16bit code units).
     *
     * @type {number}
     */
    this.position = position;

    /**
     * Is this a required break?
     * @type {boolean}
     */
    this.required = required;
  }
}

export class LineBreaker {
  constructor() {
    /**
     * @type {number?}
     */
    this.curClass = null;
    /**
     * @type {number?}
     */
    this.nextClass = null;
    /**
     * @type {boolean}
     */
    this.LB8a = false;
    /**
     * @type {boolean}
     */
    this.LB21a = false;
    /**
     * @type {number}
     */
    this.LB30a = 0;
  }

  /**
   * @param {string} str
   */
  static* #codePoints(str) {
    for (const s of str) {
      yield [/** @type {number} */(s.codePointAt(0)), s.length];
    }
  }

  /**
   * @param {string} str
   */
  static* #charClasses(str) {
    let pos = 0;
    for (const [cp, len] of LineBreaker.#codePoints(str)) {
      yield [mapClass(LineBreak.get(cp)), pos];
      pos += len;
    }
  }

  /**
   * @param {number} nextClass
   * @returns {boolean?}
   */
  #getSimpleBreak(nextClass) {
    // Handle classes not handled by the pair table
    switch (nextClass) {
      case SP:
        return false;

      case BK:
      case LF:
      case NL:
        this.curClass = BK;
        return false;

      case CR:
        this.curClass = CR;
        return false;
      default:
        return null;
    }
  }

  /**
   * @param {number} lastClass
   * @returns {boolean}
   */
  #getPairTableBreak(lastClass) {
    // If not handled already, use the pair table
    let shouldBreak = false;

    switch (pairTable[
      /** @type {number} */(this.curClass)
    ][
      /** @type {number} */(this.nextClass)
    ]) {
      case DI_BRK: // Direct break
        shouldBreak = true;
        break;

      case IN_BRK: // Possible indirect break
        shouldBreak = lastClass === SP;
        break;

      case CI_BRK:
        shouldBreak = lastClass === SP;
        if (!shouldBreak) {
          shouldBreak = false;
          return shouldBreak;
        }
        break;

      case CP_BRK: // Prohibited for combining marks
        if (lastClass !== SP) {
          return shouldBreak;
        }
        break;

      case PR_BRK:
        break;
      default:
        throw new Error('Invalid state');
    }

    if (this.LB8a) {
      shouldBreak = false;
    }

    // Rule LB21a
    if (this.LB21a && (this.curClass === HY || this.curClass === BA)) {
      shouldBreak = false;
      this.LB21a = false;
    } else {
      this.LB21a = (this.curClass === HL);
    }

    // Rule LB30a
    if (this.curClass === RI) {
      this.LB30a++;
      if (this.LB30a === 2 && (this.nextClass === RI)) {
        shouldBreak = true;
        this.LB30a = 0;
      }
    } else {
      this.LB30a = 0;
    }

    this.curClass = this.nextClass;

    return shouldBreak;
  }

  /**
   * Get an iterator over the potential line breaks in a string.
   *
   * @param {string} str
   */
  * breaks(str) {
    let lastPos = -Infinity;
    for (const [cls, pos] of LineBreaker.#charClasses(str)) {
      // Get the first char if we're at the beginning of the string
      if (this.curClass == null) {
        this.curClass = mapFirst(cls);
        this.nextClass = cls;
        this.LB8a = (cls === ZWJ);
        this.LB30a = 0;

        // LB2: Never break at the start of text.
        continue;
      }

      const lastClass = /** @type {number} */(this.nextClass);
      this.nextClass = cls;
      lastPos = pos;

      // Explicit newline
      if (
        // LB4: Always break after hard line breaks.
        (this.curClass === BK)
        // LB5: Treat CR followed by LF, as well as CR, LF, and NL as hard line breaks.
          || ((this.curClass === CR) && (this.nextClass !== LF))
      ) {
        this.curClass = mapFirst(mapClass(this.nextClass));
        yield new Break(pos, true);
        continue;
      }

      let shouldBreak
        = this.#getSimpleBreak(this.nextClass);

      if (shouldBreak === null) {
        shouldBreak = this.#getPairTableBreak(lastClass);
      }

      // Rule LB8a
      this.LB8a = (this.nextClass === ZWJ);

      if (shouldBreak) {
        yield new Break(pos);
      }
    }

    if (lastPos < str.length) {
      // LB3: Always break at the end of text.
      yield new Break(str.length);
    }

    this.curClass = null;
    this.nextClass = null;
    this.LB8a = false;
    this.LB21a = false;
    this.LB30a = 0;
  }
}
