import classNames from 'classnames';
import { FC, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuSection } from '../../../../types/navigation/sections';
import ExspansionPane from '../../ExspansionPane/ExspansionPane';

interface Props {
    sections: MenuSection[]
    level: number;
    baseUri?: string;
};

const SubSection: FC<Props> = ({ sections, level, baseUri }) => {
    const [ open, setOpen ] = useState(false);
    
    const toggleCollapse = () => setOpen(s => !s);
        
    return (
        <ul className="text-stone-500">
            { sections.map((section) => {
                const hasSections = !!section.sections;
                const uri = baseUri + '/' + section.uri;
                
                return (
                    <>
                        <li 
                            className={classNames(
                                'ml-0 pl-5 py-2 border-l border-stone-300 ',
                                level === 1 ? '' : ''
                            )}
                        >
                            { hasSections ? 
                                <button onClick={ toggleCollapse }>{ section.label }</button> : 
                                <Link to={ uri }>{ section.label }</Link>
                            }
                            { section.sections && (
                                <ExspansionPane active={ open }>
                                    <div className="mt-2">
                                        <SubSection 
                                            level={ level + 1 }
                                            sections={ section.sections } 
                                            baseUri={ uri }
                                        />
                                    </div>
                                </ExspansionPane>
                            )}
                        </li>
                    </>
                )
            })}
        </ul>
    )
}

export default SubSection;