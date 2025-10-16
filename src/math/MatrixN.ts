export class MatrixN {
    public n: number;
    public element: Array<Array<number>>;
    public constructor(n: number) {
        this.n = n;
        this.element = new Array<Array<number>>(n);
        for (let i = 0; i < n; i++) {
            this.element[i] = new Array<number>(n);
        }
    }
}