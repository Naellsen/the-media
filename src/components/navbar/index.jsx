import InputSearch from './InputSearch';

const Navbar =  () => {

    return (
        <header className="relative w-full border-b border-[#2c3440] bg-[#14181c] font-sans text-[#9ab] select-none">
            <div className="mx-auto flex h-[72px] max-w-[1000px] items-center justify-between px-5">
                
                {/* Logo */}
                <div className="flex items-center">
                <a href="/" className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-white hover:text-white">
                    <span>The Media</span>
                </a>
                </div>
                <InputSearch />

                {/* Navigation Links */}
                <nav className="hidden items-center gap-5 text-[13px] font-bold tracking-widest uppercase md:flex">
                <a href="/films" className="transition-colors duration-150 hover:text-white">Films</a>
                <a href="/lists" className="transition-colors duration-150 hover:text-white">Lists</a>
                <a href="/members" className="transition-colors duration-150 hover:text-white">Members</a>
                <a href="/journal" className="transition-colors duration-150 hover:text-white">Journal</a>
                </nav>
            </div>
        </header>
    );
}

export default Navbar