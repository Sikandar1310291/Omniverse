import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Menu } from 'lucide-react';

const Header = () => {
    const navItems = [
        { name: 'About', path: '/about' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Features', path: '/features' },
        { name: 'API Keys', path: '/apikeys' }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 backdrop-blur-sm bg-black/50 border-b border-white/[0.03]">
            <div className="flex items-center gap-10">
                <Link to="/" className="text-xl font-bold tracking-tighter text-white font-serif flex items-center gap-2">
                    <img src="/images/omniverse-logo.png" alt="Omniverse" className="w-8 h-8 object-contain mix-blend-screen" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">OMNIVERSE</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" className="hidden md:inline-flex text-white hover:bg-white/5">
                    Sign In
                </Button>
                <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-xl px-5 py-2 font-semibold">
                    Get Started
                </Button>
                <button className="md:hidden text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;
