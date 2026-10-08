import InputSearch from './InputSearch';

const Navbar =  () => {

    return (
        <header className="relative w-full border-b border-[#2c3440] bg-secondary-100 font-sans text-[#9ab] select-none">
            <div className="mx-auto flex h-18 max-w-300 items-center justify-between px-5">
                
                <div className="flex items-center">
                <a href="/" className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-accent hover:text-secondary-50">
                    <span>The Media</span>
                </a>
                </div>
                
                <InputSearch />

                <nav className="hidden items-center gap-5 text-[13px] font-bold tracking-widest uppercase md:flex">
                <a href="/films" className="transition-colors duration-150 hover:text-white">Films
                </a>
                <a href="/lists" className="transition-colors duration-150 hover:text-white">Lists
                </a>
                <a href="/members" className="transition-colors duration-150 hover:text-white">Members
                </a>
                <a href="/journal" className="transition-colors duration-150 hover:text-white">Journal
                </a>
                </nav>
            </div>
        </header>
    );
}

export default Navbar