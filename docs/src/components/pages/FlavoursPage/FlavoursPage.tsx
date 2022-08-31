import { FC, PropsWithChildren } from 'react';
import flavours from '../../../utils/data/flavours';
import { Icon } from '../../basics';

interface Props {
  
}

const FlavoursPage: FC<PropsWithChildren<Props>> = (props) => {
  
  const frameworks = ['Show all', 'React', 'Vue', 'Vanilla JS']

  return (
    <div className="px-8 w-full">
      <div className="w-full">
        <h1 className="text-2xl font-medium mb-1">Flavours</h1>
        <h2 className="text-lg font-medium text-stone-500">Different configurations</h2>
      </div>
      <hr className="my-8" />
      
      <div className="flex mb-6 gap-3">
        { frameworks.map((framework) => (
          <button className="rounded-full px-3 py-1 border border-stone-300 flex items-center">
            <Icon name="code" className="mr-2" />
            { framework }
          </button>
        ))}
      </div>
      
      <ul className="grid grid-cols-3 gap-6">
        { flavours.map((flavour) => (
          <li className="border border-stone-200 p-6 rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-medium -mb-1">{ flavour.name }</h3>
              <h4 className="font-medium text-stone-600">for { flavour.framework }</h4>
            </div>
            <p className="text-stone-500 flex-1 mb-4">
              A combination of trained AI, open-source code and hardware makes that license plates can be detected and processed.
            </p>
            <a href="#" target="_blank" className="flex items-baseline" rel="noreferrer">
              <Icon name="arrow-right-down" className="translate-y-1 mr-1" />
              <span className="underline underline-offset-[3px]">Get configuration</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FlavoursPage;