import puppeteer from "puppeteer";
import fs from "fs";

const getKnown = () => {
  try {
    return JSON.parse(fs.readFileSync("./primes.json").toString());
  } catch (e) {
    return {};
  }
};

const known: Record<number, boolean> = getKnown();

const _isPrime = (num: number) => {
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

const isPrime = (num: number) => {
  const pre = known[num];
  if (pre === false || pre === true) {
    return pre;
  }
  const prime = _isPrime(num);
  known[num] = prime;
  return prime;
};

const getScore = async (page: puppeteer.Page) => {
  const el = await page.$("#end-score");
  const score = await el?.evaluate((e) => e.textContent);
  return score;
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://isthisprime.com/game/");
  await page.click("#start");

  try {
    while (!(await getScore(page))) {
      const numberEl = await page.$("#n");
      const number = parseInt(await numberEl!.evaluate((el) => el.textContent));
      const prime = isPrime(number);
      // console.log({ number, prime });
      if (prime) {
        await page.click("#yes");
      } else {
        await page.click("#no");
      }
    }
  } catch (e) {
    console.warn("Error answering!", e);
  }
  const score = await getScore(page);
  console.log("Score:", score);
  await page.screenshot({ path: "./score.png" });
  await browser.close();
  fs.writeFileSync("./primes.json", JSON.stringify(known));
  process.exit(0);
})();
