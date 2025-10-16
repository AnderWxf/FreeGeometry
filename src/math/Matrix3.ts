export class Matrix3 {
    public element = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];
    public constructor(
        n11?: number, n12?: number, n13?: number,
        n21?: number, n22?: number, n23?: number,
        n31?: number, n32?: number, n33?: number
    ) {
        if (n11 != undefined) this.element[0] = n11;
        if (n12 != undefined) this.element[1] = n12;
        if (n13 != undefined) this.element[2] = n13;

        if (n21 != undefined) this.element[3] = n21;
        if (n22 != undefined) this.element[4] = n22;
        if (n23 != undefined) this.element[5] = n23;

        if (n31 != undefined) this.element[6] = n31;
        if (n32 != undefined) this.element[7] = n32;
        if (n33 != undefined) this.element[8] = n33;
    }
    public set(
        n11: number, n12: number, n13: number,
        n21: number, n22: number, n23: number,
        n31: number, n32: number, n33: number
    ): Matrix3 {
        let e = this.element;
        e[0] = n11; e[1] = n12; e[2] = n13;

        e[3] = n21; e[4] = n22; e[5] = n23;

        e[6] = n31; e[7] = n32; e[8] = n33;

        return this;
    }
    public identity(): Matrix3 {
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        );
        return this;
    }
}