// this script can be copy/pasted inside the browser console to run in-band

const known = {};

const _isPrime = (num) => {
  if (num === 1 || num % 2 === 0) {
    return false;
  }
  if (num % 3 === 0 || num % 5 === 0) {
    return num === 3 || num === 5;
  }
  const sqrt = Math.sqrt(num);
  for (let i = 3; i <= sqrt; i += 2) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
};

const isPrime = (num) => {
  const pre = known[num];
  if (pre === false || pre === true) {
    return pre;
  }
  const prime = _isPrime(num);
  known[num] = prime;
  return prime;
};

const getScore = () => {
  return document.getElementById("end-score").innerText;
};

const run = () => {
  // removing the setTimeout and running in a tight-loop crashes the browser
  // but if I do that then "stop" the tab after a minute, I can get my highest score.
  // the setTimeout effectively gives the eventloop an opportunity to render the page
  // but this slows down execution and my score drops a lot
  setTimeout(() => {
    const number = parseInt(document.getElementById("n").innerText);
    const prime = isPrime(number);
    // console.log({ number, prime });
    if (prime) {
      document.getElementById("yes").click();
    } else {
      document.getElementById("no").click();
    }
    if (!getScore() && document.getElementById("n").innerText) {
      run();
    }
  }, 0);
};

document.getElementById("start").click();
run();
