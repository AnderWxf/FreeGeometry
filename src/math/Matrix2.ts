export class Matrix2 {
    public element = [
        1, 0,
        0, 1,
    ];
    public constructor(n11?: number, n12?: number, n21?: number, n22?: number) {
        if (n11 != undefined) this.element[0] = n11;
        if (n12 != undefined) this.element[1] = n12;
        if (n21 != undefined) this.element[2] = n21;
        if (n22 != undefined) this.element[3] = n22;
    }
    public set(n11: number, n12: number, n21: number, n22: number): Matrix2 {
        let e = this.element;
        e[0] = n11; e[1] = n12;
        e[2] = n21; e[3] = n22;
        return this;
    }
    public identity(): Matrix2 {
        this.set(
            1, 0,
            0, 1,
        );
        return this;
    }
}