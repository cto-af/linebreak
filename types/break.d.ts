export class Break {
    /**
     * @param {number} position
     * @param {boolean} [required=false]
     */
    constructor(position: number, required?: boolean | undefined);
    /**
     * If the `string` option is enabled, a slice of the original input.
     *
     * @type {string=}
     */
    string: string | undefined;
    /**
     * Offset into input string in JS characters (16bit code units).
     *
     * @type {number}
     */
    position: number;
    /**
     * Is this a required break?
     *
     * @type {boolean}
     */
    required: boolean;
}
