/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for N milliseconds.
 *
 * @param {function} func Function to be invoked after debouncing
 * @param {integer}  wait Time to wait before triggering the callback function
 * @param {boolean}  immediate trigger on leading edge if true, on the trailing edge otherwise
 */
export default function debounce(func, wait, immediate) {
  let timeout;
  return function outer(...args) {
    const context = this;
    function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
