import { motion } from 'framer-motion';
import {
    Plus,
    LayoutDashboard,
    Bot,
    Key,
    Sparkles,
    MessageSquare,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Search,
    LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'App Builder', icon: Bot, path: '/agent', pro: true },
        { name: 'API Keys', icon: Key, path: '/apikeys' },
        { name: 'Features', icon: Sparkles, path: '/features' },
        { name: 'Messages', icon: MessageSquare, path: '/chat', count: 3 },
    ];

    const bottomItems = [
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Help', icon: HelpCircle, path: '/help' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            className={cn(
                "fixed left-0 top-0 h-screen z-[60] flex flex-col pt-6 pb-6 border-r border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300",
                isCollapsed ? "px-3" : "px-4"
            )}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white backdrop-blur-lg z-10"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo */}
            <div className={cn("flex items-center gap-3 px-2 mb-10 overflow-hidden", isCollapsed && "justify-center px-0")}>
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                    <img src="/images/omniverse-logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-serif font-bold tracking-tighter text-white"
                    >
                        OMNIVERSE
                    </motion.span>
                )}
            </div>

            {/* Search (Only when not collapsed) */}
            {!isCollapsed && (
                <div className="px-2 mb-6">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>
            )}

            {/* New Chat Button */}
            <div className="px-2 mb-8">
                <button className={cn(
                    "w-full flex items-center bg-white text-black font-bold rounded-xl transition-all hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
                    isCollapsed ? "p-3 justify-center" : "gap-3 px-4 py-3"
                )}>
                    <Plus className="w-5 h-5" />
                    {!isCollapsed && <span>New Session</span>}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/40 hover:text-white hover:bg-white/5",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-400" : "group-hover:text-cyan-400")} />
                            {!isCollapsed && (
                                <div className="flex-1 flex items-center justify-between">
                                    <span>{item.name}</span>
                                    {item.pro && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">PRO</span>
                                    )}
                                    {item.count && (
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto pt-6 border-t border-white/5 px-2 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={cn(
                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <item.icon className="w-5 h-5 group-hover:text-purple-400" />
                        {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                ))}

                {/* Profile Section */}
                <div className={cn(
                    "mt-4 p-2 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5",
                    isCollapsed ? "flex justify-center" : "flex items-center gap-3"
                )}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        JD
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">John Doe</p>
                            <p className="text-[10px] text-white/40 truncate">Professional Plan</p>
                        </div>
                    )}
                    {!isCollapsed && (
                        <button className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <LogOut size={14} />
                        </button>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
