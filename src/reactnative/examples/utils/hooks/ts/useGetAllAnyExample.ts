import {useState} from 'react';

function useGetAllExample() {
  const [allExample, setAllExample] = useState<any[]>([]);

  //Add your GET API or state management call to fetch all Example

  return {allExample};
}

export default useGetAllExample;
