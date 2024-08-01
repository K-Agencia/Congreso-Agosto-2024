export const capitalizarPrimeraLetra = (str) => {
  return str.toLowerCase()
    .trim()
    .split(' ')
    .map(v => v[0].toUpperCase() + v.substr(1))
    .join(' ');
}