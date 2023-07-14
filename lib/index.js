/* eslint-disable new-cap */
import { BreakerState, eot, sot } from './state.js';
import { LineBreak, names as LineBreakClasses } from './LineBreak.js';
import { Break } from './break.js';
import { EastAsianWidth } from './EastAsianWidth.js';

export {
  Break,
  BreakerState,
  EastAsianWidth,
  LineBreak,
  LineBreakClasses,
  eot,
  sot,
};

const {
  AL, B2, BA, BB, BK, CB, CL, CM, CP, CR, EB, EM, EX, GL, H2, H3, HL,
  HY, ID, IN, IS, JL, JT, JV, LF, NU, OP, NL, NS, PO, PR, RI, SP, SY,
  QU, WJ, ZW, ZWJ,
} = LineBreakClasses;

// Possible results from a rule:

/**
 * This rule has no opinion.
 */
export const PASS = Symbol('PASS');

/**
 * This rule asserts that there must not be a break after the current
 * code point.
 */
export const NO_BREAK = Symbol('NO_BREAK');

/**
 * This rule asserts that there may be a break after the current code point.
 */
export const MAY_BREAK = Symbol('MAY_BREAK');

/**
 * This rule asserts that there must be a line break after the current code point.
 */
export const MUST_BREAK = Symbol('MUST_BREAK');

/**
 * A rule that impacts linebreaking.  Looking ahead and behind one code point
 * is fast, using `state.prev` and `state.next` respectively.  Looking ahead
 * more code points is possible with `*BreakerState.codePoints()`, but be
 * careful of causing ReDos vulnerabilities.
 *
 * @callback BreakRule
 * @param {import('./state.js').BreakerState} state
 * @returns {PASS|NO_BREAK|MAY_BREAK|MUST_BREAK}
 */

/**
 * LB2: Never break at the start of text.
 *
 * @type {BreakRule}
 */
export function LB02(state) {
  /// sot ×
  if ((state.cur.cls === sot) && (state.next.cls !== eot)) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB3 Always break at the end of text.
 *
 * @type {BreakRule}
 */
export function LB03(state) {
  if ((state.next.cls === eot)
      && ((state.cur.len === 0) || (state.cur.len !== state.prevChunk))) {
    return MUST_BREAK;
  }
  return PASS;
}

/**
 * LB4: Always break after hard line breaks.
 *
 * @type {BreakRule}
 */
export function LB04(state) {
  // BK !
  if (state.cur.cls === BK) {
    return MUST_BREAK;
  }
  return PASS;
}

/**
 * LB5: Treat CR followed by LF, as well as CR, LF, and NL as hard line
 * breaks.
 *
 * @type {BreakRule}
 */
export function LB05(state) {
  switch (state.cur.cls) {
    case CR:
      if (state.next.cls === LF) {
        return NO_BREAK; // CR × LF
      }
      return MUST_BREAK; // CR !

    case LF: // LF !
    case NL: // NL !
      return MUST_BREAK;
    default:
  }
  return PASS;
}

/**
 * LB6: Do not break before hard line breaks.
 *
 * @type {BreakRule}
 */
export function LB06(state) {
  // × ( BK | CR | LF | NL )
  switch (state.next.cls) {
    case BK:
    case CR:
    case LF:
    case NL:
      return NO_BREAK;
    default:
  }
  return PASS;
}

/**
 * The end of a run of spaces, for rules that have "Do not break within
 * ...even with intervening spaces", such as LB15.
 *
 * @type {BreakRule}
 */
export function LBspacesStop(state) {
  if (state.cur.cls !== RI) {
    state.RI = 0;
  }
  if (state.spaces) {
    if (state.next.cls !== SP) {
      state.spaces = false;
    }
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB7: Do not break before spaces or zero width space.
 *
 * @type {BreakRule}
 */
export function LB07(state) {
  // × ZW
  if (state.next.cls === ZW) {
    return NO_BREAK;
  }

  // × SP
  if (state.next.cls === SP) {
    switch (state.cur.cls) {
      case ZW: // See LB8
      case OP: // See LB14
      case QU: // See LB15
      case CL: // See LB16
      case CP: // See LB16
      case B2: // See LB17
        break;
      default:
        return NO_BREAK;
    }
  }
  return PASS;
}

/**
 * LB8: Break before any character following a zero-width space, even if one or
 * more spaces intervene.
 *
 * @type {BreakRule}
 */
export function LB08(state) {
  // LB8 is special, because it breaks after the run of spaces, unlike
  // the .spaces cases, which NO_BREAK after the rub of spaces.

  // ZW SP* ÷
  if (state.LB8) {
    // Assume state.next.cls !== SP, because LB7
    state.LB8 = false;
    return MAY_BREAK;
  } else if (state.cur.cls === ZW) {
    if (state.next.cls === SP) {
      state.LB8 = true;
      return NO_BREAK;
    }
    return MAY_BREAK;
  }
  return PASS;
}

/**
 * LB8a: Do not break after a zero width joiner.
 *
 * @type {BreakRule}
 */
export function LB08a(state) {
  // ZWJ ×
  if (state.cur.cls === ZWJ) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB9: Do not break a combining character sequence; treat it as if it has the
 * line breaking class of the base character in all of the following rules.
 * Treat ZWJ as if it were CM.
 *
 * @type {BreakRule}
 */
export function LB09(state) {
  // Treat X (CM | ZWJ)* as if it were X.
  // where X is any line break class except BK, CR, LF, NL, SP, or ZW.
  if ((state.next.cls === CM) || (state.next.cls === ZWJ)) {
    switch (state.cur.cls) {
      case SP:
      case ZW:
      case BK: // This and the following probably aren't possible because LB6
      case CR:
      case LF:
      case NL:
        break;
      default:
        state.next.cls = state.cur.cls;
        //
        // // @ts-ignore
        // if (this.opts.verbose) {
        //   console.log(state.cur.len, state, 'LB9');
        // }
        return NO_BREAK;
    }
  }
  return PASS;
}

/**
 * LB10: Treat any remaining combining mark or ZWJ as AL.
 *
 * @type {BreakRule}
 */
export function LB10(state) {
  if (state.cur.cls === CM) {
    state.cur.cls = AL;

    //
    // // @ts-ignore
    // if (this.opts.verbose) {
    //   console.log(state.cur.len, state, 'LB10');
    // }
  }
  if (state.next.cls === CM) {
    state.next.cls = AL;

    //
    // // @ts-ignore
    // if (this.opts.verbose) {
    //   console.log(state.cur.len, state, 'LB10');
    // }
  }
  return PASS;
}

/**
 * LB11: Do not break before or after Word joiner and related characters.
 *
 * @type {BreakRule}
 */
export function LB11(state) {
  if (
    (state.next.cls === WJ) // × WJ
    || (state.cur.cls === WJ) // WJ ×
  ) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB12: Do not break after NBSP and related characters.
 *
 * @type {BreakRule}
 */
export function LB12(state) {
  // GL ×
  if (state.cur.cls === GL) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB12a: Do not break before NBSP and related characters, except after spaces
 * and hyphens.
 *
 * @type {BreakRule}
 */
export function LB12a(state) {
  // [^SP BA HY] × GL
  if (state.next.cls === GL) {
    switch (state.cur.cls) {
      case SP:
      case BA:
      case HY:
        return PASS;
      default:
        return NO_BREAK;
    }
  }
  return PASS;
}

/**
 * LB13: Do not break before ‘]’ or ‘!’ or ‘;’ or ‘/’, even after spaces.
 *
 * @type {BreakRule}
 */
export function LB13(state) {
  // × CL (e.g.)
  switch (state.next.cls) {
    case CL:
    case CP:
    case EX:
    case IS:
    case SY:
      return NO_BREAK;
    default:
  }
  return PASS;
}

/**
 * LB14: Do not break after ‘[’, even after spaces.
 *
 * @type {BreakRule}
 */
export function LB14(state) {
  // OP SP* ×
  if (state.cur.cls === OP) {
    if (state.next.cls === SP) {
      state.spaces = true;
    }
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB15: Do not break within ‘”[’, even with intervening spaces.
 *
 * @type {BreakRule}
 */
export function LB15(state) {
  // QU SP* × OP
  if (state.cur.cls === QU) {
    if (state.classAfterSpaces(state.cur.len) === OP) {
      state.spaces = true;
      return NO_BREAK;
    }
    if (state.next.cls === SP) {
      return NO_BREAK; // LB7
    }
  }
  return PASS;
}

/**
 * LB16: Do not break between closing punctuation and a nonstarter (lb=NS),
 * even with intervening spaces.
 *
 * @type {BreakRule}
 */
export function LB16(state) {
  // (CL | CP) SP* × NS
  if ((state.cur.cls === CL) || (state.cur.cls === CP)) {
    if (state.classAfterSpaces(state.cur.len) === NS) {
      if (state.next.cls === SP) {
        state.spaces = true;
      }
      return NO_BREAK;
    }
    if (state.next.cls === SP) {
      return NO_BREAK; // LB7
    }
  }
  return PASS;
}

/**
 * LB17: Do not break within ‘——’, even with intervening spaces.
 *
 * @type {BreakRule}
 */
export function LB17(state) {
  // B2 SP* × B2
  if (state.cur.cls === B2) {
    if (state.classAfterSpaces(state.cur.len) === B2) {
      if (state.next.cls !== SP) {
        return NO_BREAK; // LB7
      }

      state.spaces = true;
      return NO_BREAK;
    } else if (state.next.cls === SP) {
      return NO_BREAK; // LB7
    }
  }
  return PASS;
}

/**
 * LB18: Break after spaces.
 *
 * @type {BreakRule}
 */
export function LB18(state) {
  // SP ÷
  if (state.cur.cls === SP) {
    return MAY_BREAK;
  }
  return PASS;
}

/**
 * LB19: Do not break before or after quotation marks, such as ‘ ” ’.
 *
 * @type {BreakRule}
 */
export function LB19(state) {
  // × QU
  // QU ×
  if ((state.cur.cls === QU) || (state.next.cls === QU)) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB20: Break before and after unresolved CB.
 *
 * @type {BreakRule}
 */
export function LB20(state) {
  // ÷ CB
  // CB ÷
  if ((state.cur.cls === CB) || (state.next.cls === CB)) {
    return MAY_BREAK;
  }
  return PASS;
}

/**
 * LB21: Do not break before hyphen-minus, other hyphens, fixed-width spaces,
 * small kana, and other non-starters, or after acute accents.
 *
 * @type {BreakRule}
 */
export function LB21(state) {
  // BB ×
  if (state.cur.cls === BB) {
    return NO_BREAK;
  }

  // × (BA | HY | NS)
  switch (state.next.cls) {
    case BA:
    case HY:
    case NS:
      return NO_BREAK;
    default:
  }
  return PASS;
}

/**
 * LB21a: Don't break after Hebrew + Hyphen.
 *
 * @type {BreakRule}
 */
export function LB21a(state) {
  // HL (HY | BA) ×
  if ((state.prev.cls === HL)
      && ((state.cur.cls === HY) || (state.cur.cls === BA))) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB21b: Don’t break between Solidus and Hebrew letters.
 *
 * @type {BreakRule}
 */
export function LB21b(state) {
  // SY × HL
  if ((state.cur.cls === SY) && (state.next.cls === HL)) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB22: Do not break before ellipses.
 *
 * @type {BreakRule}
 */
export function LB22(state) {
  // × IN
  if (state.next.cls === IN) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB23: Do not break between digits and letters.
 *
 * @type {BreakRule}
 */
export function LB23(state) {
  switch (state.cur.cls) {
    case AL:
    case HL:
      // (AL | HL) × NU
      if (state.next.cls === NU) {
        return NO_BREAK;
      }
      break;
    case NU:
      // NU × (AL | HL)
      if ((state.next.cls === AL) || (state.next.cls === HL)) {
        return NO_BREAK;
      }
      break;
    default:
  }
  return PASS;
}

/**
 * LB23a: Do not break between numeric prefixes and ideographs, or between
 * ideographs and numeric postfixes.
 *
 * @type {BreakRule}
 */
export function LB23a(state) {
  // PR × (ID | EB | EM)
  if ((state.cur.cls === PR)
    && [ID, EB, EM].includes(state.next.cls)) {
    return NO_BREAK;
  }
  // (ID | EB | EM) × PO
  if ((state.next.cls === PO)
    && [ID, EB, EM].includes(state.cur.cls)) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB24: Do not break between numeric prefix/postfix and letters, or between
 * letters and prefix/postfix.
 *
 * @type {BreakRule}
 */
export function LB24(state) {
  // (PR | PO) × (AL | HL)
  if (((state.cur.cls === PR) || (state.cur.cls === PO))
      && ((state.next.cls === AL) || (state.next.cls === HL))) {
    return NO_BREAK;
  }
  // (AL | HL) × (PR | PO)
  if (((state.cur.cls === AL) || (state.cur.cls === HL))
      && ((state.next.cls === PR) || (state.next.cls === PO))) {
    return NO_BREAK;
  }

  // Yeah, we're not doing this:
  // ( PR | PO) ? ( OP | HY ) ? NU (NU | SY | IS) * (CL | CP) ? ( PR | PO) ?
  return PASS;
}

/**
 * LB25: Do not break between the following pairs of classes relevant to numbers
 *
 * @type {BreakRule}
 */
export function LB25(state) {
  switch (state.cur.cls) {
    case NU:
      // NU × PO
      // NU × PR
      // NU × NU
      if ((state.next.cls === PO)
        || (state.next.cls === PR)
        || (state.next.cls === NU)) {
        return NO_BREAK;
      }
      break;
    case CL:
    case CP:
      // CL × PO
      // CL × PR
      // CP × PO
      // CP × PR
      if ((state.next.cls === PO) || (state.next.cls === PR)) {
        return NO_BREAK;
      }
      break;
    case PO:
    case PR:
      // PO × OP
      // PO × NU
      // PR × OP
      // PR × NU
      if ((state.next.cls === OP) || (state.next.cls === NU)) {
        return NO_BREAK;
      }
      break;
    case HY:
    case IS:
    case SY:
      // HY × NU
      // IS × NU
      // SY × NU
      if (state.next.cls === NU) {
        return NO_BREAK;
      }
      break;
    default:
  }

  return PASS;
}

/**
 * LB26: Do not break a Korean syllable.
 *
 * @type {BreakRule}
 */
export function LB26(state) {
  switch (state.cur.cls) {
    case JL:
      // JL × (JL | JV | H2 | H3)
      if ([JL, JV, H2, H3].includes(state.next.cls)) {
        return NO_BREAK;
      }
      break;
    case JV:
    case H2:
      // (JV | H2) × (JV | JT)
      if ([JV, JT].includes(state.next.cls)) {
        return NO_BREAK;
      }
      break;
    case JT:
    case H3:
      // (JT | H3) × JT
      if (state.next.cls === JT) {
        return NO_BREAK;
      }
      break;
    default:
  }
  return PASS;
}

/**
 * LB27: Treat a Korean Syllable Block the same as ID.
 *
 * @type {BreakRule}
 */
export function LB27(state) {
  switch (state.cur.cls) {
    case JL:
    case JV:
    case JT:
    case H2:
    case H3:
      // (JL | JV | JT | H2 | H3) × PO
      if (state.next.cls === PO) {
        return NO_BREAK;
      }
      break;
    case PR:
      // PR × (JL | JV | JT | H2 | H3)
      if ([JL, JV, JT, H2, H3].includes(state.next.cls)) {
        return NO_BREAK;
      }
      break;
    default:
  }
  return PASS;
}

/**
 * LB28 Do not break between alphabetics (“at”).
 *
 * @type {BreakRule}
 */
export function LB28(state) {
  // (AL | HL) × (AL | HL)
  if (((state.cur.cls === AL) || (state.cur.cls === HL))
    && ((state.next.cls === AL) || (state.next.cls === HL))) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB29: Do not break between numeric punctuation and alphabetics (“e.g.”).
 *
 * @type {BreakRule}
 */
export function LB29(state) {
  // IS × (AL | HL)
  if ((state.cur.cls === IS)
    && ((state.next.cls === AL) || (state.next.cls === HL))) {
    return NO_BREAK;
  }
  return PASS;
}

/**
 * LB30: Do not break between letters, numbers, or ordinary symbols and
 * opening or closing parentheses.
 *
 * @type {BreakRule}
 */
export function LB30(state) {
  switch (state.cur.cls) {
    case AL:
    case HL:
    case NU:
      // (AL | HL | NU) × [OP-[\p{ea=F}\p{ea=W}\p{ea=H}]]
      if ((state.next.cls === OP) && !EastAsianWidth.get(state.next.cp)) {
        return NO_BREAK;
      }
      break;
    case CP:
      // [CP-[\p{ea=F}\p{ea=W}\p{ea=H}]] × (AL | HL | NU)
      if (!EastAsianWidth.get(state.cur.cp)
          && [AL, HL, NU].includes(state.next.cls)) {
        return NO_BREAK;
      }
      break;
    default:
  }

  return PASS;
}

/**
 * LB30a: Break between two regional indicator symbols if and only if there
 * are an even number of regional indicators preceding the position of the
 * break.
 *
 * @type {BreakRule}
 */
export function LB30a(state) {
  if (state.cur.cls === RI) {
    if (state.next.cls === RI) {
      if (++state.RI % 2 !== 0) {
        return NO_BREAK;
      }
    }
  } else {
    state.RI = 0;
  }
  return PASS;
}

/**
 * LB30b: Do not break between an emoji base (or potential emoji) and an emoji
 * modifier.
 *
 * @type {BreakRule}
 */
export function LB30b(state) {
  // EB × EM
  if ((state.cur.cls === EB) && (state.next.cls === EM)) {
    return NO_BREAK;
  }

  // [\p{Extended_Pictographic}&\p{Cn}] × EM
  // I *think* this was supposed to be:
  // [\p{Extended_Pictographic}&&\p{Cn}] × EM
  //
  // The Extended_Pictographic property is used to customize segmentation (as
  // described in [UAX29] and [UAX14]) so that possible future emoji ZWJ
  // sequences will not break grapheme clusters, words, or lines. Unassigned
  // codepoints with Line_Break=ID in some blocks are also assigned the
  // Extended_Pictographic property. Those blocks are intended for future
  // allocation of emoji characters.
  if ((state.next.cls === EM)
    && (/^\p{ExtPict}$/u.test(state.cur.char))
    && (/^\p{gc=Cn}$/u.test(state.cur.char))) {
    return NO_BREAK;
  }

  return PASS;
}

/**
 * LB31: Break everywhere else.
 *
 * @type {BreakRule}
 */
export function LB31() {
  return MAY_BREAK;
}

/**
 * When the tailored rule from exanple 7 is used, LB13 needs to be tailored
 * so that numbers pass through to rule 25.
 *
 * @type {BreakRule}
 */
export function Example7_13(state) {
  const notNU = state.cur.cls !== NU;
  if (notNU && ((state.next.cls === CL) || (state.next.cls === CP))) {
    // [^NU] × CL
    // [^NU] × CP
    return NO_BREAK;
  }
  if (state.next.cls === EX) {
    // × EX
    return NO_BREAK;
  }
  if (notNU && ((state.next.cls === IS) || (state.next.cls === SY))) {
    // [^NU] × IS
    // [^NU] × SY
    return NO_BREAK;
  }
  return PASS;
}

/**
 * Regex-Number: Do not break numbers.  Approach.  Find the end of a matching
 * run, then no-break everything as we go past it.
 *
 * This regex:
 * ( PR | PO) ? ( OP | HY ) ? NU (NU | SY | IS) * ( CL | CP ) ? ( PR | PO) ?
 *
 * @type {BreakRule}
 */
export function Example7_25(state) {
  if (state.ex7pos != null) {
    if (state.cur.len >= state.ex7pos) {
      state.ex7pos = null;
      // Keep going in this function, the cur char might start a new sequence.
    } else {
      return NO_BREAK;
    }
  }

  switch (state.cur.cls) {
    case PR: // "$"
    case PO: { // "%"
      // (PR | PO) × ( OP | HY )? NU
      if (state.next.cls === NU) {
        return NO_BREAK;
      }
      const cpAhead2 = state.str.codePointAt(state.next.len);
      const lbAhead2 = cpAhead2 ? LineBreak.get(cpAhead2) : undefined;
      if ((lbAhead2 === NU)
          && ((state.next.cls === OP) || (state.next.cls === HY))) {
        // "(" or "-"
        // Can't get here with HY because LB21.
        return NO_BREAK;
      }
      break;
    }
    case HY: // "-"
    case OP: // "(" Note: Can't get here with OP because LB14
      // ( OP | HY ) × NU
      if (state.next.cls === NU) {
        return NO_BREAK;
      }
      break;
    case NU: {
      // Have to process these in reverse order, because shorter matches
      // could also match longer regexes. Only take one pass.  Consider whether
      // there is a ReDoS here.  Some caching in BreakerState might help.

      // NU × (NU | SY | IS)
      // NU (NU | SY | IS)* × (NU | SY | IS | CL | CP )
      // NU (NU | SY | IS)* (CL | CP)? × [2] (PO | PR)

      // This is equivalent:
      // NU [0] (NU | SY | IS)* [1] (CL | CP)? [2] (PO | PR)?

      let nuStart = true;
      let lastNuSyIs = null;
      let firstClCp = null;

      CODEPOINTS:
      for (const { len, cls } of state.codePoints(state.cur.len)) {
        if (nuStart) {
          switch (cls) {
            case NU:
            case SY:
            case IS:
              lastNuSyIs = len;
              break;
            case CL:
            case CP:
              firstClCp = len;
              nuStart = false;
              break;
            case PO:
            case PR:
              state.ex7pos = len;
              return NO_BREAK;
            default:
              break CODEPOINTS;
          }
        } else {
          switch (cls) {
            case PO:
            case PR:
              state.ex7pos = len;
              return NO_BREAK;
            default:
              break CODEPOINTS;
          }
        }
      }
      // Got to the end of the string.  Did we find anything?
      if (firstClCp != null) {
        state.ex7pos = firstClCp;
        return NO_BREAK;
      }
      if (lastNuSyIs != null) {
        state.ex7pos = lastNuSyIs;
        return NO_BREAK;
      }
      break;
    }
    default:
  }
  return PASS;
}

/**
 * @type {BreakRule[]}
 * @private
 */
const rules = [
  // LB1, handled in *BreakerState.codePoints(), so that look-aheads are
  // resolved.
  LB02,
  LB03,
  LB04,
  LB05,
  LB06,
  LBspacesStop, // Must be before LB7.
  LB07,
  LB08,
  LB08a,
  LB09,
  LB10,
  LB11,
  LB12,
  LB12a,
  LB13,
  LB14,
  LB15,
  LB16,
  LB17,
  LB18,
  LB19,
  LB20,
  LB21a, // Must be before LB21
  LB21,
  LB21b,
  LB22,
  LB23,
  LB23a,
  LB24,
  LB25,
  LB26,
  LB27,
  LB28,
  LB29,
  LB30,
  LB30a,
  LB30b,
  LB31,
];

/**
 * Options for how rules are applied.
 *
 * @typedef {object} RulesOptions
 * @prop {boolean} [string=false] Extract strings from input, rather than just
 *   returning char offsets.
 * @prop {boolean} [example7=false] Use the extra rules for numbers from
 *   Example 7.  Set to `true` for running the conformance tests.
 * @prop {boolean} [verbose=false] Turn on some verbose logging that is
 *   useful for debug.
 */

export class Rules {
  #opts;

  /**
   *
   * @param {RulesOptions} opts
   */
  constructor(opts = {}) {
    /**
     * @type {Required<RulesOptions>}
     */
    this.#opts = {
      string: false,
      example7: false,
      verbose: false,
      ...opts,
    };

    /**
     * Copy of rules, safe to tweak.
     *
     * @type {BreakRule[]}
     */
    this.rules = [...rules];

    if (this.#opts.example7) {
      this.replaceRule('LB13', Example7_13);
      this.replaceRule('LB25', Example7_25);
    }

    if (this.#opts.verbose) {
      this.rules.unshift(state => {
        console.log(state.cur.len, state);
        return PASS;
      });
    }
  }

  /**
   * Remove the rules with names as indicated.
   *
   * @param  {...string} names
   * @returns {BreakRule[]} The deleted rules
   */
  removeRule(...names) {
    /**
     * @type {BreakRule[]}
     */
    const ret = [];
    this.rules = this.rules.filter(r => {
      if (names.includes(r.name)) {
        ret.push(r);
        return false;
      }
      return true;
    });
    return ret;
  }

  /**
   * Add rules after the one named `name`.
   *
   * @param {string} name The name of the rule before.
   * @param {...BreakRule} newRules
   * @returns {number} Index of start of the new rules
   */
  addRuleAfter(name, ...newRules) {
    const i = this.rules.findIndex(r => r.name === name);
    if (i === -1) {
      throw new Error(`Rule not found: "${name}"`);
    }
    this.rules.splice(i + 1, 0, ...newRules);
    return i + 1;
  }

  /**
   * Add rules before the one named `name`.
   *
   * @param {string} name The name of the rule before.
   * @param {...BreakRule} newRules
   * @returns {number} Index of start of the new rules
   */
  addRuleBefore(name, ...newRules) {
    const i = this.rules.findIndex(r => r.name === name);
    if (i === -1) {
      throw new Error(`Rule not found: "${name}"`);
    }
    this.rules.splice(i, 0, ...newRules);
    return i;
  }

  /**
   * Replace the rule named `name` with the given rules.
   *
   * @param {string} name The name of the rule before.
   * @param {...BreakRule} newRules
   * @returns {BreakRule[]} The replaced rules.
   */
  replaceRule(name, ...newRules) {
    const i = this.rules.findIndex(r => r.name === name);
    if (i === -1) {
      throw new Error(`Rule not found: "${name}"`);
    }
    return this.rules.splice(i, 1, ...newRules);
  }

  /**
   *
   * @param {BreakerState} state
   * @returns {Break?}
   */
  #execRules(state) {
    for (const rule of this.rules) {
      const res = rule.call(this, state);
      switch (res) {
        case PASS:
          break;
        case NO_BREAK:

          if (this.#opts.verbose) {
            console.log(`  ${rule.name}: NO_BREAK`);
          }
          return null;
        case MAY_BREAK:

          if (this.#opts.verbose) {
            console.log(`  ${rule.name}: MAY_BREAK`);
          }
          return new Break(state.cur.len);
        case MUST_BREAK:

          if (this.#opts.verbose) {
            console.log(`  ${rule.name}: MUST_BREAK`);
          }
          return new Break(state.cur.len, true);
        default:
          throw new Error(`Invalid state: "${res}"`);
      }
    }
    return null;
  }

  /**
   * @param {BreakerState} state
   */
  * #exec(state) {
    const res = this.#execRules(state);
    if (res) {
      if (this.#opts.string) {
        res.string = state.str.slice(state.prevChunk, state.cur.len);
      }
      if (state.props) {
        res.props = state.props;
        state.props = undefined;
      }
      yield res;
      state.prevChunk = state.cur.len;
    }
  }

  /**
   * Enumerate all of the potential line breaks.
   *
   * @param {string} str
   */
  * breaks(str) {
    const state = new BreakerState(str);

    for (const step of state.codePoints(0)) {
      state.push(step);
      yield* this.#exec(state);
    }
    state.pushEnd();
    yield* this.#exec(state);
  }
}
