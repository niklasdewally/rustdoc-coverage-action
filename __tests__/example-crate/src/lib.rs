//! Example module

/// Returns 42
///
/// # Examples
/// ```
/// use rustdoc_coverage_action_example::foo;
/// assert_eq!(foo(), 42);
/// ```
/// ```
/// assert!(true);
/// ```
pub fn foo() -> i32 {
    42
}

pub fn bar() -> i32 {
    21
}

fn baz() -> i32 {
    0
}
