import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageSquare, Layout, Presentation as PresentationIcon, ChevronDown, Paperclip, Mic, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import ConnectorsModal from '../ConnectorsModal';
import { supabase } from '../../lib/supabase';

const models = {
    chat: [
        { name: 'GPT-5.2', pro: true },
        { name: 'Grok 4', pro: true },
        { name: 'Claude Sonnet 4.5', pro: true },
        { name: 'Blackbox E2E Encrypted', pro: false },
        { name: 'Gemini 3 Pro', pro: true },
        { name: 'Grok Code Fast 1', pro: true },
        { name: 'Claude Opus 4.5', pro: true },
        { name: 'MiniMax M2.1', pro: false },
    ],
    image: [
        { name: 'Nano Banana', pro: true },
        { name: 'Nano Banana Pro', pro: true },
        { name: 'Flux 1.1 Pro', pro: true },
        { name: 'Stable Diffusion', pro: true },
        { name: 'Flux Schnell', pro: true },
        { name: 'Hyper Flux 8-Step', pro: true },
        { name: 'Sdxl Lightning 4Step', pro: true },
    ],
    video: [
        { name: 'Veo 2', pro: true },
        { name: 'Veo 3', pro: true },
        { name: 'Veo 3 Fast', pro: true },
        { name: 'Veo 3.1', pro: true },
        { name: 'Veo 3.1 Fast', pro: true },
        { name: 'Sora 2 Text-to-Video', pro: true },
        { name: 'Sora 2 Text-to-Video Pro', pro: true },
    ]
};

// Add type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

const Hero = () => {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'chat' | 'image' | 'video'>('chat');
    const [selectedModel, setSelectedModel] = useState(models.chat[0].name); // Default to GPT-5.2
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsModelSelectorOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('File selected:', file.name);
            // Here you would typically handle the file upload logic
            setInputValue(prev => prev + ` [Attachment: ${file.name}] `);
        }
    };

    const toggleListening = () => {
        // ... (existing code remains same)
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            console.log('Sending message to Omniverse...', userMessage.content);
            const { data, error } = await supabase.functions.invoke('chat-proxy', {
                body: {
                    messages: [userMessage],
                    model: selectedCategory === 'chat' ? selectedModel : undefined
                },
            });

            if (error) {
                console.error('Edge Function Error:', error);
                throw error;
            }

            console.log('Omniverse Response:', data);
            const content = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
            const aiMessage = { role: 'assistant' as const, content };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err: any) {
            console.error('Chat error:', err);
            setSpeechError('Failed to get response from Omniverse.');
            setTimeout(() => setSpeechError(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { icon: <Layout className="w-4 h-4" />, label: 'App Builder' },
        { icon: <PresentationIcon className="w-4 h-4" />, label: 'Presentation' },
        { icon: <MessageSquare className="w-4 h-4" />, label: 'Chat' },
    ];

    const navigate = useNavigate();
    // Simulation of user status
    const isProUser = true; // Toggle this to test access control

    const handleActionClick = (label: string) => {
        if (label === 'App Builder') {
            if (isProUser) {
                navigate('/agent');
            } else {
                alert('App Builder is available for Pro users only.');
            }
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-6 bg-background">
            {/* dynamic Background Ambience */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.03, 0.05, 0.03]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-white rounded-full blur-[160px] pointer-events-none"
                />
            </div>

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-12 relative z-10">
                {/* Branding Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground"
                >
                    <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span className="tracking-wide">OMNIVERSE 1.0</span>
                </motion.div>

                {/* Central Identity */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-5xl md:text-7xl font-sans font-bold text-white tracking-widest flex flex-col md:flex-row items-center justify-center gap-8 uppercase">
                        <motion.img
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            transition={{ type: "spring", duration: 1.5 }}
                            src="/images/omniverse-logo.png"
                            alt="Omniverse"
                            className="w-32 h-32 md:w-40 md:h-40 object-contain mix-blend-screen"
                        />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            OMNIVERSE
                        </span>
                    </h1>
                </motion.div>

                {/* Main Interaction Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full relative group mt-8"
                >
                    <div className={`
                        relative flex flex-col gap-2 p-3 rounded-[2.5rem] bg-white/[0.03] border transition-all duration-500
                        ${isFocused ? 'border-white/20 bg-white/[0.05] ring-4 ring-white/5' : 'border-white/10 hover:border-white/20'}
                    `}>
                        <div className="flex items-center gap-3 pr-2">
                            <button
                                onClick={() => setIsConnectorsOpen(true)}
                                className="p-2 text-white/40 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                                title="Add connectors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-white/40 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                                title="Attach file"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                placeholder={isListening ? "Listening..." : "Message Omniverse"}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 outline-none text-lg py-2"
                                disabled={isLoading}
                            />

                            <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm text-white/60 transition-all font-medium"
                                >
                                    {selectedModel}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isModelSelectorOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isModelSelectorOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-4 w-72 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                        >
                                            <div className="flex p-1 bg-white/5 rounded-xl mb-2">
                                                {(['chat', 'image', 'video'] as const).map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            setSelectedCategory(cat);
                                                            setSelectedModel(models[cat][0].name);
                                                        }}
                                                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${selectedCategory === cat ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                                                {models[selectedCategory].map((model) => (
                                                    <button
                                                        key={model.name}
                                                        onClick={() => {
                                                            setSelectedModel(model.name);
                                                            setIsModelSelectorOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm transition-all ${selectedModel === model.name ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                                    >
                                                        <span className="truncate">{model.name}</span>
                                                        {model.pro && (
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent uppercase tracking-wider">Pro</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-white/5 p-2 bg-gradient-to-b from-transparent to-white/[0.02]">
                                                <div className="mb-3 px-1">
                                                    <p className="text-xs text-white/60 font-medium mb-0.5">Unlock premium models</p>
                                                    <p className="text-[10px] text-white/30">Get access to GPT-5, Sora 2, and more</p>
                                                </div>
                                                <button
                                                    onClick={() => navigate('/pricing')}
                                                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all uppercase tracking-wider relative overflow-hidden group/btn"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        Upgrade to Pro
                                                        <Sparkles className="w-3 h-3 transition-transform group-hover/btn:rotate-12" />
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {speechError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {speechError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={toggleListening}
                                    className={`p-2 transition-all rounded-full ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Mic className="w-5 h-5" />
                                </button>

                                <AnimatePresence>
                                    {(inputValue || isLoading) && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={() => handleSubmit()}
                                            disabled={isLoading}
                                            className="p-2 rounded-xl bg-white text-black hover:bg-white/90 transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Conversation History */}
                {messages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-3xl space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar px-4"
                    >
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] p-4 rounded-2xl backdrop-blur-md ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white'
                                        : 'bg-white/5 border border-white/10 text-white/90'
                                    }`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <p className="m-0">{msg.content}</p>
                                            </div>
                                        </div>
                                    )}
                                    {msg.role === 'user' && (
                                        <p className="m-0">{msg.content}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </motion.div>
                )}

                {/* Quick Action Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => handleActionClick(action.label)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-muted-foreground hover:text-white group"
                        >
                            <span className="transition-transform group-hover:-translate-y-0.5">{action.icon}</span>
                            {action.label}
                        </button>
                    ))}
                </motion.div>

                {/* Bottom Status Badge removed */}
            </div>

            {/* Subtle decorative grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-20 pointer-events-none" />

            <ConnectorsModal isOpen={isConnectorsOpen} onClose={() => setIsConnectorsOpen(false)} />
        </section>
    );
};


export default Hero;
