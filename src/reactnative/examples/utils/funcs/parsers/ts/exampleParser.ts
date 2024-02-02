import {Example, APIExample} from '../../../../types/example.d';

export const parseExample = (apiExample: APIExample): Example => {
  return {
    ...apiExample,
  };
};

export const parseAPIExample = (example: Example): APIExample => {
  return {
    ...example,
  };
};
