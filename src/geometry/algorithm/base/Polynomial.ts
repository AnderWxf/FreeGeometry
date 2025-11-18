class Monomial {

    /**
     * The coefficient of monomial.
     *
     * @type {number}
     */
    public c: number;

    /**
     * The degree of variable.
     *
     * @type {Array<number>}
     */
    public xi: Array<number>;

    /**
     * The number of monomial.
     *
     * @type {number}
     */
    public get n(): number {
        return this.xi.length;
    }

    /**
     * the D(derivative) function return r-order partial derivative at xi.
     * @param {number} [i ∈ [0,n-1]] - the index of variable.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    di(i: number, r: number = 0): Monomial {
        debugger;
        return null;
    }

    /**
     * The degree of monomial.
     *
     * @type {number}
     */
    public get d(): number {
        let ret = 0;
        this.xi.forEach(d => {
            ret += d;
        });
        return ret;
    }
}