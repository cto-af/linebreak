import { CI_BRK, CP_BRK, DI_BRK, IN_BRK, PR_BRK, pairTable } from './pairs.js';
import { Classes, LineBreak } from './lineBreak.js';

const {
  AI, AL, BA, BK, CJ, CR, HL, HY, LF, NL, NS, RI, SA, SG, SP, WJ, XX, ZWJ,
} = Classes;

// See: https://www.unicode.org/reports/tr14/#BreakingRules

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
   * @param {string=} string
   */
  constructor(position, required = false, string = undefined) {
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

    if (string != null) {
      this.string = string;
    }
  }
}

class BreakerState {
  /**
   * @type {number?}
   */
  curClass = null;

  /**
   * @type {number?}
   */
  nextClass = null;

  /**
   * @type {boolean}
   */
  LB8a = false;

  /**
   * @type {boolean}
   */
  LB21a = false;

  /**
   * @type {number}
   */
  LB30a = 0;

  /**
   * @returns {number?}
   */
  pair() {
    if ((this.curClass == null) || (this.nextClass == null)) {
      return null;
    }
    return pairTable[this.curClass][this.nextClass];
  }
}

export class LineBreaker {
  constructor(opts = {}) {
    this.opts = {
      string: false,
      ...opts,
    };
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
   * @param {BreakerState} state
   * @returns {boolean?}
   */
  static #getSimpleBreak(state) {
    // Handle classes not handled by the pair table
    switch (state.nextClass) {
      case SP:
        return false;

      case BK:
      case LF:
      case NL:
        state.curClass = BK;
        return false;

      case CR:
        state.curClass = CR;
        return false;
      default:
        return null;
    }
  }

  /**
   * @param {BreakerState} state
   * @param {number} lastClass
   * @returns {boolean}
   */
  static #getPairTableBreak(state, lastClass) {
    // If not handled already, use the pair table
    let shouldBreak = false;

    switch (state.pair()) {
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

    if (state.LB8a) {
      shouldBreak = false;
    }

    // Rule LB21a
    if (state.LB21a && (state.curClass === HY || state.curClass === BA)) {
      shouldBreak = false;
      state.LB21a = false;
    } else {
      state.LB21a = (state.curClass === HL);
    }

    // Rule LB30a
    if (state.curClass === RI) {
      state.LB30a++;
      if (state.LB30a === 2 && (state.nextClass === RI)) {
        shouldBreak = true;
        state.LB30a = 0;
      }
    } else {
      state.LB30a = 0;
    }

    state.curClass = state.nextClass;

    return shouldBreak;
  }

  /**
   * Get an iterator over the potential line breaks in a string.
   *
   * @param {string} str
   */
  * breaks(str) {
    let lastPos = -Infinity;
    const state = new BreakerState();
    for (const [cls, pos] of LineBreaker.#charClasses(str)) {
      // Get the first char if we're at the beginning of the string
      if (state.curClass == null) {
        state.curClass = mapFirst(cls);
        state.nextClass = cls;
        state.LB8a = (cls === ZWJ);
        state.LB30a = 0;

        // LB2: Never break at the start of text.
        continue;
      }

      const lastClass = /** @type {number} */(state.nextClass);
      state.nextClass = cls;

      // Explicit newline
      if (
        // LB4: Always break after hard line breaks.
        (state.curClass === BK)
        // LB5: Treat CR followed by LF, as well as CR, LF, and NL as hard line breaks.
          || ((state.curClass === CR) && (state.nextClass !== LF))
      ) {
        state.curClass = mapFirst(mapClass(state.nextClass));
        const chunk = this.opts.string ? str.slice(lastPos, pos) : undefined;
        lastPos = pos;
        yield new Break(pos, true, chunk);
        continue;
      }

      let shouldBreak = LineBreaker.#getSimpleBreak(state);

      if (shouldBreak === null) {
        shouldBreak = LineBreaker.#getPairTableBreak(state, lastClass);
      }

      // LB8a: Do not break after a zero width joiner.
      state.LB8a = (state.nextClass === ZWJ);

      if (shouldBreak) {
        const chunk = this.opts.string ? str.slice(lastPos, pos) : undefined;
        lastPos = pos;
        yield new Break(pos, true, chunk);
      }
    }

    if (lastPos < str.length) {
      // LB3: Always break at the end of text.
      const chunk = this.opts.string ? str.slice(lastPos) : undefined;
      yield new Break(str.length, false, chunk);
    }
  }
}
