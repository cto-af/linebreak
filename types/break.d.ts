export class Break {
    /**
     * @param {number} position
     * @param {boolean} [required=false]
     * @param {string=} string
     */
    constructor(position: number, required?: boolean | undefined, string?: string | undefined);
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
    string: string | undefined;
}
