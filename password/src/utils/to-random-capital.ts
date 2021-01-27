const toRandomCapital = (password: string): string => {
  const length = password.length;
  const array = [...password];
  const nCapitalLetters = Math.floor(Math.random() * length);

  for (let i = 0; i < nCapitalLetters; i++) {
    let randomIndex = Math.floor(Math.random() * length);
    if (!Number.isInteger(password[randomIndex])) {
      array[randomIndex] = array[randomIndex].toUpperCase();
    }
  }
  return array.join("");
};

export default toRandomCapital;
