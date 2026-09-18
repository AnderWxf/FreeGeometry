// 让 tsc 把 i32/f64 当作 number 的别名
declare type i32 = number;
declare type i64 = number;
declare type f32 = number;
declare type f64 = number;
declare type u8 = number;
declare type u16 = number;
declare type u32 = number;

// 让 tsc 认识这些 AssemblyScript 内置函数
declare function unchecked<T>(value: T): T;
declare function idof<T>(): u32;

// // wasic 内置函数声明
// declare function malloc(size: i32): i32;
// declare function load<T>(offset: i32): T;
// declare function store<T>(offset: i32, value: T): void;