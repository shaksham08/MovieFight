//!Debounce Logic
const debounce = (func, delay) => {
  let stop;

  return (...args) => {
    if (stop) {
      clearTimeout(stop);
    }
    stop = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
