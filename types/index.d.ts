export function LB2(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB3(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB4(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB5(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB6(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LBspacesStop(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB7(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB8(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB8a(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB9(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB10(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB11(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB12(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB12a(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB13(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB14(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB15(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB16(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB17(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB18(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB19(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB20(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB21(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB21a(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB21b(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB22(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB23(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB23a(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB24(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB25(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB26(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB27(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB28(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB29(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB30(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB30a(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB30b(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function LB31(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function Example7_13(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export function Example7_25(state: import('./state.js').BreakerState): typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
export const PASS: unique symbol;
export const NO_BREAK: unique symbol;
export const MAY_BREAK: unique symbol;
export const MUST_BREAK: unique symbol;
/**
 * @type {BreakRule[]}
 */
export const rules: BreakRule[];
export class Rules {
    constructor(opts?: {});
    opts: {
        string: boolean;
        verbose: boolean;
        example7: boolean;
    };
    /**
     * Copy of rules, safe to tweak.
     *
     * @type {BreakRule[]}
     */
    rules: BreakRule[];
    /**
     * Remove the rules with names as indicated.
     *
     * @param  {...string} names
     * @returns {BreakRule[]} The deleted rules
     */
    removeRule(...names: string[]): BreakRule[];
    /**
     * Add rules after the one named `name`.
     *
     * @param {string} name The name of the rule before.
     * @param {...BreakRule} newRules
     * @returns {number} Index of start of the new rules
     */
    addRuleAfter(name: string, ...newRules: BreakRule[]): number;
    /**
     * Add rules before the one named `name`.
     *
     * @param {string} name The name of the rule before.
     * @param {...BreakRule} newRules
     * @returns {number} Index of start of the new rules
     */
    addRuleBefore(name: string, ...newRules: BreakRule[]): number;
    /**
     * Replace the rule named `name` with the given rules.
     *
     * @param {string} name The name of the rule before.
     * @param {...BreakRule} newRules
     * @returns {BreakRule[]} The replaced rules.
     */
    replaceRule(name: string, ...newRules: BreakRule[]): BreakRule[];
    /**
     * Enumerate all of the potential line breaks.
     *
     * @param {string} str
     */
    breaks(str: string): Generator<Break, void, unknown>;
    #private;
}
export type BreakRule = (state: import('./state.js').BreakerState) => typeof PASS | typeof NO_BREAK | typeof MAY_BREAK | typeof MUST_BREAK;
import { Break } from './break.js';
