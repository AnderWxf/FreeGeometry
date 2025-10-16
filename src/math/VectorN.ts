export class VectorN {
    public n: number;
    public element: Array<number>;
    public constructor(n: number) {
        this.n = n;
        this.element = new Array<number>(n);
    }
}