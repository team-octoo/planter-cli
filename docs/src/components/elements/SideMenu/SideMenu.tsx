import { FC } from 'react';
import { MenuSection as Section } from '../../../types/navigation/sections';
import Aside from './Aside/Aside';
import MenuSection from './MenuSection/MenuSection';
interface Props {}

const SideMenu: FC<Props> = (props) => {
  const sections: Section[] = [
    {
      label: 'Getting started',
      icon: 'speed',
      uri: 'getting-started',
      sections: [
        { label: 'Installation', uri: 'installation' },
        { label: 'Quick start', uri: 'quick-start', sections: [
          { label: 'React', uri: 'react', sections: [
            { label: 'Basic', uri: 'test'}
          ]},
          { label: 'Vue', uri: 'vue' },
          { label: 'Other frameworks', uri: 'other' },
        ]},
      ]
    },
    {
      label: 'Flavours',
      icon: 'folders',
      uri: 'flavours',
      sections: [
        { label: 'Default flavours', uri: 'default' },
        { label: 'Custom flavours', uri: 'custom' },
      ]
    },
  ]
  
  return (
    <Aside className="h-full w-1/5 border-r border-stone-200">
      <div className="py-6 pr-6">
        <ul>
          { sections.map((section, index) => (
            <li 
              key={ index }
              className="mb-2 last:mb-0"
            >
              <MenuSection { ...section } />
            </li>
          ))}
        </ul>
      </div>
    </Aside>
  );
}

export default SideMenu;