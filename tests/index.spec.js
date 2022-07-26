import { test } from '@japa/runner'

function sum(a, b) {
  return new Promise((resolve) => {
    resolve(a+b);
  });
}

test('adds 1 + 2 to equal 3', async ({expect}) => {
  const som = await sum(2,1);
  expect(som).toEqual(3);
});