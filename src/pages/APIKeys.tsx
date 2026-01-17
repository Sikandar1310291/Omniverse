import { motion, AnimatePresence } from 'framer-motion';
import { Key, Copy, Plus, Trash2, Eye, EyeOff, Terminal, Code, Shield, Check, X, Search } from 'lucide-react';
import { useState } from 'react';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
    expiration: string;
    scopes: string[];
}

const SCOPES = ['read:models', 'write:fine-tune', 'admin:billing', 'read:analytics'];
const EXPIRATIONS = [
    { label: 'Never', value: 'never' },
    { label: '30 Days', value: '30d' },
    { label: '60 Days', value: '60d' },
    { label: '1 Year', value: '1y' },
];

const APIKeys = () => {
    const [keys, setKeys] = useState<ApiKey[]>([
        {
            id: '1',
            name: "Development",
            key: "ak_live_4f9a...32e1",
            created: "Jan 12, 2026",
            lastUsed: "Just now",
            expiration: "Never",
            scopes: ['read:models', 'read:analytics']
        },
        {
            id: '2',
            name: "Production",
            key: "ak_live_9b2e...11c5",
            created: "Jan 05, 2026",
            lastUsed: "2 hours ago",
            expiration: "Never",
            scopes: ['read:models', 'write:fine-tune', 'read:analytics']
        }
    ]);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [newKeyName, setNewKeyName] = useState('');
    const [selectedExpiration, setSelectedExpiration] = useState(EXPIRATIONS[0]);
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['read:models']);
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);

    const generateKeyString = () => {
        const chars = 'abcdef0123456789';
        let key = 'ak_live_';
        for (let i = 0; i < 32; i++) {
            key += chars[Math.floor(Math.random() * chars.length)];
        }
        return key;
    };

    const handleCreateKey = () => {
        if (!newKeyName.trim()) return;

        const newKeyString = generateKeyString();
        const newKey: ApiKey = {
            id: Date.now().toString(),
            name: newKeyName,
            key: newKeyString, // In real app, only show full key once
            created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            lastUsed: 'Never',
            expiration: selectedExpiration.label,
            scopes: selectedScopes
        };

        setKeys([newKey, ...keys]);
        setGeneratedKey(newKeyString);
        // Don't close immediately, show the key first
    };

    const resetForm = () => {
        setNewKeyName('');
        setSelectedExpiration(EXPIRATIONS[0]);
        setSelectedScopes(['read:models']);
        setGeneratedKey(null);
        setIsCreating(false);
    };

    const deleteKey = (id: string) => {
        setKeys(keys.filter(k => k.id !== id));
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleScope = (scope: string) => {
        if (selectedScopes.includes(scope)) {
            setSelectedScopes(selectedScopes.filter(s => s !== scope));
        } else {
            setSelectedScopes([...selectedScopes, scope]);
        }
    };

    const filteredKeys = keys.filter(k =>
        k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.id.includes(searchTerm)
    );

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 bg-black min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[500px] bg-purple-900/10 blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300"
                        >
                            <Key className="w-3.5 h-3.5" />
                            <span>Developer Console</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-serif text-white tracking-tight"
                        >
                            API Keys
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-muted-foreground max-w-xl text-lg"
                        >
                            Manage programmatic access to the Apexora Neural Engine.
                        </motion.p>
                    </div>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Key
                    </motion.button>
                </div>

                {/* Operations Bar */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search keys..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-all"
                        />
                    </div>
                </div>

                {/* Keys List */}
                <div className="space-y-4 mb-20">
                    <AnimatePresence mode="popLayout">
                        {filteredKeys.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
                            >
                                <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
                                    <Key className="w-6 h-6 text-white/40" />
                                </div>
                                <h3 className="text-white font-medium mb-1">No API keys found</h3>
                                <p className="text-white/40 text-sm">Create a new key to start building with Apexora.</p>
                            </motion.div>
                        ) : (
                            filteredKeys.map((key, index) => (
                                <motion.div
                                    key={key.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all hover:bg-white/[0.02]"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        {/* Key Info */}
                                        <div className="space-y-3 min-w-[300px]">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                                        <Terminal className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-white text-lg">{key.name}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                                                            <span>Created {key.created}</span>
                                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                                            <span className={key.lastUsed === 'Never' ? '' : 'text-emerald-400'}>Last used {key.lastUsed}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {key.scopes.map(scope => (
                                                    <span key={scope} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/60 border border-white/5">
                                                        {scope}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Key Value Section */}
                                        <div className="flex-1 max-w-2xl">
                                            <div className="bg-black/40 border border-white/5 rounded-xl p-1 flex items-center gap-2">
                                                <code className="flex-1 px-3 py-2 text-sm font-mono text-white/70 tracking-wider overflow-hidden text-ellipsis">
                                                    {visibleKeyId === key.id ? key.key : (
                                                        <span className="flex items-center gap-1">
                                                            ak_live_<span className="text-white/20">••••••••••••••••••••••••</span>{key.key.slice(-4)}
                                                        </span>
                                                    )}
                                                </code>
                                                <div className="flex items-center gap-1 pr-1">
                                                    <button
                                                        onClick={() => setVisibleKeyId(visibleKeyId === key.id ? null : key.id)}
                                                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                        title={visibleKeyId === key.id ? "Hide key" : "Reveal key"}
                                                    >
                                                        {visibleKeyId === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => copyToClipboard(key.key, key.id)}
                                                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors relative"
                                                        title="Copy key"
                                                    >
                                                        {copiedId === key.id && (
                                                            <motion.span
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-black text-xs font-bold rounded shadow-lg whitespace-nowrap"
                                                            >
                                                                Copied!
                                                            </motion.span>
                                                        )}
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <div className="w-px h-4 bg-white/10 mx-1" />
                                                    <button
                                                        onClick={() => deleteKey(key.id)}
                                                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                        title="Revoke key"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Documentation Section */}
                <div className="border-t border-white/10 pt-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif text-white mb-2">Integration Guide</h2>
                            <p className="text-muted-foreground">Start making requests to the Apexora Neural Engine.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* cURL Example */}
                        <div className="rounded-2xl border border-white/10 bg-[#0F0F0F] overflow-hidden group hover:border-white/20 transition-all">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm font-medium text-white/80">cURL</span>
                                </div>
                            </div>
                            <div className="p-6 overflow-x-auto custom-scrollbar">
                                <pre className="font-mono text-sm leading-relaxed text-white/70">
                                    <span className="text-purple-400">curl</span> https://api.apexora.ai/v1/chat/completions \<br />
                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer $APEXORA_API_KEY"</span> \<br />
                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Content-Type: application/json"</span> \<br />
                                    &nbsp;&nbsp;-d <span className="text-emerald-400">'{'{'}</span><br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">"model"</span>: <span className="text-emerald-400">"apex-v2-turbo"</span>,<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">"messages"</span>: [<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">'{'{'} "role": "user", "content": "Hello world" {'}'}'</span><br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;]<br />
                                    &nbsp;&nbsp;<span className="text-emerald-400">{'}'}'</span>
                                </pre>
                            </div>
                        </div>

                        {/* Node.js Example */}
                        <div className="rounded-2xl border border-white/10 bg-[#0F0F0F] overflow-hidden group hover:border-white/20 transition-all">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <Code className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm font-medium text-white/80">Node.js</span>
                                </div>
                            </div>
                            <div className="p-6 overflow-x-auto custom-scrollbar">
                                <pre className="font-mono text-sm leading-relaxed text-white/70">
                                    <span className="text-purple-400">import</span> {'{ Apexora }'} <span className="text-purple-400">from</span> <span className="text-emerald-400">'@apexora/sdk'</span>;<br /><br />
                                    <span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> Apexora({'{'}<br />
                                    &nbsp;&nbsp;apiKey: process.env.APEXORA_API_KEY<br />
                                    {'}'});<br /><br />
                                    <span className="text-purple-400">const</span> chat = <span className="text-purple-400">await</span> client.chat.create({'{'}<br />
                                    &nbsp;&nbsp;model: <span className="text-emerald-400">'apex-v2-turbo'</span>,<br />
                                    &nbsp;&nbsp;messages: [ {'{'} role: <span className="text-emerald-400">'user'</span>, content: <span className="text-emerald-400">'Hi!'</span> {'}'} ]<br />
                                    {'}'});
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Key Modal Overlay */}
                <AnimatePresence>
                    {isCreating && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={resetForm}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                            >
                                {/* Modal Header */}
                                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-white">
                                        {generatedKey ? 'Save your secret key' : 'Create new API key'}
                                    </h3>
                                    <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {generatedKey ? (
                                    // Success State
                                    <div className="p-6 space-y-6">
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex gap-3">
                                            <Shield className="w-5 h-5 shrink-0" />
                                            <p>Please save this key now. For security reasons, we cannot show it to you again.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/60">API Key</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-sm text-white break-all">
                                                    {generatedKey}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(generatedKey, 'modal-key')}
                                                    className="px-4 py-2 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-2"
                                                >
                                                    {copiedId === 'modal-key' ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={resetForm}
                                            className="w-full py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    // Creation Form
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/60">Name</label>
                                            <input
                                                type="text"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                placeholder="e.g. Production Agent"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/20 focus:bg-white/10 transition-all font-medium"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/60">Expiration</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {EXPIRATIONS.map((exp) => (
                                                    <button
                                                        key={exp.value}
                                                        onClick={() => setSelectedExpiration(exp)}
                                                        className={`px-3 py-2 rounded-lg text-sm text-left transition-all border ${selectedExpiration.value === exp.value
                                                            ? 'bg-white text-black border-white'
                                                            : 'bg-white/5 text-white/60 border-transparent hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {exp.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-white/60">Scopes</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {SCOPES.map((scope) => (
                                                    <button
                                                        key={scope}
                                                        onClick={() => toggleScope(scope)}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/5 group text-left"
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedScopes.includes(scope)
                                                            ? 'bg-purple-500 border-purple-500'
                                                            : 'border-white/20 group-hover:border-white/40'
                                                            }`}>
                                                            {selectedScopes.includes(scope) && <Check className="w-3.5 h-3.5 text-white" />}
                                                        </div>
                                                        <span className="text-sm text-white/80 font-mono">{scope}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2 flex gap-3">
                                            <button
                                                onClick={resetForm}
                                                className="flex-1 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCreateKey}
                                                disabled={!newKeyName.trim()}
                                                className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                            >
                                                Create Key
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default APIKeys;
