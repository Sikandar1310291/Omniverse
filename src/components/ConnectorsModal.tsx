import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Link as LinkIcon, Chrome, Mail, Calendar, HardDrive, Github, MessageSquare, FileText, Zap, CheckSquare, Layout, Workflow, List, Briefcase, CheckCircle, Database, Triangle, AlertOctagon, Smile, Users, MessageCircle, CreditCard, DollarSign, BarChart, Target, PieChart, Grid, Cpu, Cloud, Activity, Play, Video, Palette, Box, Globe, Mic, Search as SearchIcon, Check, Layers, Film, Music, Monitor } from 'lucide-react';
import { connectors } from '../data/connectors';

interface ConnectorsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Icon mapping helper
const getIcon = (iconName: string) => {
    const icons: any = {
        Chrome, Mail, Calendar, HardDrive, Github, MessageSquare, FileText, Zap, CheckSquare, Layout, Workflow, List, Briefcase, CheckCircle, Database, Triangle, AlertOctagon, Smile, Users, MessageCircle, CreditCard, DollarSign, BarChart, Target, PieChart, Grid, Cpu, Cloud, Activity, Play, Video, Palette, Box, Globe, Mic, Search: SearchIcon, Check, Layers, Film, Music, Monitor
    };
    const IconComponent = icons[iconName] || LinkIcon;
    return <IconComponent className="w-6 h-6" />;
};

const ConnectorsModal = ({ isOpen, onClose }: ConnectorsModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Apps' | 'Custom API' | 'Custom MCP'>('Apps');

    const filteredConnectors = connectors.filter(connector =>
        connector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connector.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-4xl h-[85vh] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-center relative">
                            <h2 className="text-lg font-semibold text-white">Connectors</h2>
                            <button
                                onClick={onClose}
                                className="absolute right-6 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search & Tabs */}
                        <div className="p-6 pb-2 space-y-6">
                            {/* Connect My Browser Banner */}
                            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center">
                                        <Chrome className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white">My Browser</h3>
                                        <p className="text-xs text-white/40">Let Omniverse access your personalized context.</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors">
                                    Connect
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-8 border-b border-white/5">
                                {['Apps', 'Custom API', 'Custom MCP'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search connectors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/10 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredConnectors.map((connector) => (
                                    <div
                                        key={connector.name}
                                        className="group p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all flex flex-col gap-3"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                                                {getIcon(connector.icon)}
                                            </div>
                                            {/* <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium text-white rounded-lg transition-all">
                                                Connect
                                            </button> */}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-white mb-1">{connector.name}</h3>
                                            <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                                                {connector.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConnectorsModal;
