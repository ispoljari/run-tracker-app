export const obj = {
  a: 1,
  b: '2',
  c: 'I am imported',
  d: `I am a template string ${this.a}`,
  e: () => 'I am coming from inside an arrow function!',
  sumNumbers: (a,b,c) => {
    return a + b + c;
  }
};