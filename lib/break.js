export class Break {
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
