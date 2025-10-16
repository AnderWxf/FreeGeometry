export class MatrixMN {
    public m: number;
    public n: number;
    public element: Array<Array<number>>;
    public constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        this.element = new Array<Array<number>>(m);
        for (let i = 0; i < m; i++) {
            this.element[i] = new Array<number>(n);
        }
    }
}