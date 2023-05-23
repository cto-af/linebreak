export class LineBreaker {
    /**
     * @param {string} str
     */
    static "__#1@#codePoints"(str: string): Generator<number[], void, unknown>;
    /**
     * @param {string} str
     */
    static "__#1@#charClasses"(str: string): Generator<number[], void, unknown>;
    /**
     * @param {number} curClass
     * @param {number} nextClass
     * @returns {boolean?}
     */
    static "__#1@#getSimpleBreak"(curClass: number, nextClass: number): boolean | null;
    /**
     * @type {number?}
     */
    curClass: number | null;
    /**
     * @type {number?}
     */
    nextClass: number | null;
    /**
     * @type {boolean}
     */
    LB8a: boolean;
    /**
     * @type {boolean}
     */
    LB21a: boolean;
    /**
     * @type {number}
     */
    LB30a: number;
    /**
     * Get an iterator over the potential line breaks in a string.
     *
     * @param {string} str
     */
    breaks(str: string): Generator<Break, void, unknown>;
    #private;
}
declare class Break {
    /**
     * @param {number} position
     * @param {boolean} [required=false]
     */
    constructor(position: number, required?: boolean | undefined);
    /**
     * Offset into input string in JS characters (16bit code units).
     *
     * @type {number}
     */
    position: number;
    /**
     * Is this a required break?
     * @type {boolean}
     */
    required: boolean;
}
export {};
