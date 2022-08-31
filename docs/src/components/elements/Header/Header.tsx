import classNames from 'classnames';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import { useEffectOnce } from '../../../state/hooks/useEffectOnce/useEffectOnce';
import { Icon } from '../../basics';

interface Props {};

const GlobalSearch = () => {
    const searchFieldContainer = useRef<HTMLDivElement>(null)
    const [ searchActive, setSearchActive ] = useState(false);
    
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
            
        const clickedOutside = !searchFieldContainer.current?.contains(target);
        setSearchActive(clickedOutside ? false : true);
    }
    
    useEffectOnce(() => {
        window.addEventListener('click', handleClickOutside);
        
        return () => window.removeEventListener('click', handleClickOutside);
    })
    
    return (<>
        <div
            ref={ searchFieldContainer }
            onClick={() => setSearchActive(true)}
            className={ classNames(
                'relative bg-white p-4 mt-2 border-t border-x border-stone-200',
                searchActive ? 'border-opacity-100 shadow-smooth rounded-t-xl' : 'border-opacity-0'
            )}
        >
            <div 
                className="flex items-center gap-2 relative"
            >
                <Icon name="search" size="1rem" className="text-stone-400" />
                <input 
                    name="query" 
                    placeholder={`Search ${ window.location.host }`} 
                    autoComplete="off"
                    className="placeholder:text-stone-400 w-full outline-none focus:outline-none focus-within:outline-none" 
                />
                {/* <span ></span> */}
            </div>
            <div 
                className={classNames(
                    'absolute inset-x-0 border-x border-b border-stone-200 rounded-b-xl bg-white mx-[-1.5px]',
                    searchActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
            >
                <div className="px-4 mt-4">
                    <hr />
                </div>
                <div className="p-4">
                    <span className="text-stone-400">Results will appear, start by searching</span>
                </div>
            </div>
        </div>
    </>)
}

const Header: FC<Props> = () => {
    return (
        <header className="bg-white border-b border-stone-200 ">
            <div className="container mx-auto grid grid-cols-12 ">
                <div className="col-span-3 py-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm text-stone-500">@team-octoo</h2>
                        <span className="text-sm text-stone-500">/</span>
                        <h1 className="font-semibold tracking-wide text-lg">Planter</h1>
                    </div>
                </div>
                <div className="col-span-9">
                    <GlobalSearch />
                </div>
            </div>
        </header>
    )
}

export default Header;