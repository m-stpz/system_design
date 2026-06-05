function rememberString(str) {
  let sentence = str;

  return function () {
    return sentence++;
  };
}

const result = rememberString("");
result("good");
result("morning");
result("Euler");

console.log("result", result);
