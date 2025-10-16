export class Matrix4 {
    public element = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
    public constructor(
        n11?: number, n12?: number, n13?: number, n14?: number,
        n21?: number, n22?: number, n23?: number, n24?: number,
        n31?: number, n32?: number, n33?: number, n34?: number,
        n41?: number, n42?: number, n43?: number, n44?: number,
    ) {
        if (n11 != undefined) this.element[0] = n11;
        if (n12 != undefined) this.element[1] = n12;
        if (n13 != undefined) this.element[2] = n13;
        if (n14 != undefined) this.element[3] = n14;

        if (n21 != undefined) this.element[4] = n21;
        if (n22 != undefined) this.element[5] = n22;
        if (n23 != undefined) this.element[6] = n23;
        if (n24 != undefined) this.element[7] = n24;

        if (n31 != undefined) this.element[8] = n31;
        if (n32 != undefined) this.element[9] = n32;
        if (n33 != undefined) this.element[10] = n33;
        if (n34 != undefined) this.element[11] = n34;

        if (n41 != undefined) this.element[12] = n41;
        if (n42 != undefined) this.element[13] = n42;
        if (n43 != undefined) this.element[14] = n43;
        if (n44 != undefined) this.element[15] = n44;
    }
    public set(
        n11: number, n12: number, n13: number, n14: number,
        n21: number, n22: number, n23: number, n24: number,
        n31: number, n32: number, n33: number, n34: number,
        n41: number, n42: number, n43: number, n44: number,
    ): Matrix4 {
        let e = this.element;
        e[0] = n11; e[1] = n12; e[2] = n13; e[3] = n14;

        e[4] = n21; e[5] = n22; e[6] = n23; e[7] = n24;

        e[8] = n31; e[9] = n32; e[10] = n33; e[11] = n34;

        e[12] = n31; e[14] = n32; e[14] = n33; e[15] = n44;

        return this;
    }
    public identity(): Matrix4 {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
        return this;
    }
}