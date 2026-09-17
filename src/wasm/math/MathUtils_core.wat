(module
  (memory (export "memory") 2)
  (global $__heap_ptr (mut i32) (i32.const 260))
  (global $__d4s (mut i32) (i32.const 0))
  ;; Bump allocator — advances __heap_ptr and returns the old value.
  (func $__malloc (param $size i32) (result i32)
    (local $ptr i32)
    (local.set $ptr (global.get $__heap_ptr))
    (global.set $__heap_ptr (i32.add (local.get $ptr) (local.get $size)))
    (local.get $ptr)
  )
  ;; Canonical ABI allocator — fresh allocation (ptr==0) delegates to $__malloc;
  ;; realloc requests (ptr!=0) return ptr unchanged (bump allocator has no free).
  (func $cabi_realloc (param $ptr i32) (param $old_size i32) (param $align i32) (param $new_size i32) (result i32)
    (select
      (call $__malloc (local.get $new_size))
      (local.get $ptr)
      (i32.eqz (local.get $ptr))
    )
  )
  (func $toPeriod (export "toPeriod") (param $u f64) (param $period f64) (param $tol1 f64) (result f64)
    (local $d1 f64)
    (local $b1 i32)
    (local $d2 f64)
    (local $b2 i32)
    (block $break_0
      (loop $loop_0
        (br_if $break_0 (i32.eqz (f64.lt (local.get $u) (f64.const 0))))
        (block $cont_0
          (local.set $u (f64.add (local.get $u) (local.get $period)))
        )
        (br $loop_0)
      )
    )
    (block $break_1
      (loop $loop_1
        (br_if $break_1 (i32.eqz (f64.ge (local.get $u) (local.get $period))))
        (block $cont_1
          (local.set $u (f64.sub (local.get $u) (local.get $period)))
        )
        (br $loop_1)
      )
    )
    (local.set $d1 (call $abs (local.get $u)))
    (local.set $b1 (f64.le (local.get $d1) (local.get $tol1)))
    (if (local.get $b1)
      (then
      (local.set $u (f64.const 0))
      )
    )
    (local.set $d2 (f64.sub (local.get $u) (local.get $period)))
    (local.set $d2 (call $abs (local.get $d2)))
    (local.set $b2 (f64.le (local.get $d2) (local.get $tol1)))
    (if (local.get $b2)
      (then
      (local.set $u (f64.const 0))
      )
    )
    (return (local.get $u))
  )

  (func $toRange (export "toRange") (param $u f64) (param $a f64) (param $b f64) (param $period f64) (result f64)
    (block $break_2
      (loop $loop_2
        (br_if $break_2 (i32.eqz (f64.lt (local.get $u) (local.get $a))))
        (block $cont_2
          (local.set $u (f64.add (local.get $u) (local.get $period)))
        )
        (br $loop_2)
      )
    )
    (block $break_3
      (loop $loop_3
        (br_if $break_3 (i32.eqz (f64.gt (local.get $u) (local.get $b))))
        (block $cont_3
          (local.set $u (f64.sub (local.get $u) (local.get $period)))
        )
        (br $loop_3)
      )
    )
    (return (local.get $u))
  )

  (func $abs (export "abs") (param $x f64) (result f64)
    (if (f64.ge (local.get $x) (f64.const 0))
      (then
      (return (local.get $x))
      )
    )
    (return (f64.neg (local.get $x)))
  )
)