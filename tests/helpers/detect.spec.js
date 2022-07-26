import { test } from '@japa/runner';
import { detect } from '../../bin/helpers/detect.mjs';

test('Config detect method non-forced', async ({expect}) => {
  const detected = await detect.config();
  expect(detected).toBeTruthy();
});

test('Config detect method forced', async ({expect}) => {
  const detected = await detect.config(true);
  expect(detected).toBeTruthy();
});