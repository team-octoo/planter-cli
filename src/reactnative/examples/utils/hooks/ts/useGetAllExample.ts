import {useState} from 'react';
import {Example} from '../../../types/example';

function useGetAllExample() {
  const [allExample, setAllExample] = useState<Example[]>([]);

  //Add your GET API or state management call to fetch all Example

  return {allExample};
}

export default useGetAllExample;
