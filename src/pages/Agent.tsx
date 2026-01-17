import {
    ArrowLeft, Folder, FileCode, FileJson, FileType, Play, Globe,
    ChevronDown, RefreshCw, Box,
    Mic, Paperclip, Send, Code, AlertCircle,
    Layout as LayoutIcon, Smartphone, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Mock File System
const initialFiles = [
    {
        name: 'src', type: 'folder', isOpen: true, children: [
            { name: 'App.tsx', type: 'file', content: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">\n      <h1 className="text-4xl font-bold mb-4">Hello Omniverse</h1>\n      <button className="px-6 py-2 bg-blue-600 rounded-lg">Get Started</button>\n    </div>\n  );\n}` },
            { name: 'index.css', type: 'file', content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` },
            { name: 'utils.ts', type: 'file', content: `export const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');` },
        ]
    },
    {
        name: 'public', type: 'folder', isOpen: false, children: [
            { name: 'index.html', type: 'file', content: `<!DOCTYPE html>\n<html lang="en">\n  <body>\n    <div id="root"></div>\n  </body>\n</html>` },
        ]
    },
    { name: 'package.json', type: 'file', content: `{\n  "name": "omniverse-app",\n  "version": "1.0.0"\n}` },
];

const models = [
    { name: 'GPT-5.2', pro: true },
    { name: 'Claude Sonnet 4.5', pro: true },
    { name: 'Gemini 3 Pro', pro: true }
];

const mobileDevices = [
    { name: 'iPhone 15 Pro', width: '393px', height: '852px', radius: '40px', notch: true },
    { name: 'iPhone 15 Pro Max', width: '430px', height: '932px', radius: '44px', notch: true },
    { name: 'Pixel 8 Pro', width: '412px', height: '892px', radius: '24px', notch: false }, // Punch hole could be simulated but keeping simple
    { name: 'Galaxy S24 Ultra', width: '412px', height: '890px', radius: '4px', notch: false },
    { name: 'iPad Mini', width: '744px', height: '1133px', radius: '24px', notch: false }
];

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

const Agent = () => {
    // Project Type Selection State
    const [projectType, setProjectType] = useState<'website' | 'mobile' | null>(null);
    const [selectedDevice, setSelectedDevice] = useState(mobileDevices[0]);

    const [files, setFiles] = useState(initialFiles);
    const [activeFile, setActiveFile] = useState<any>(initialFiles[0].children![0]);
    const [rightTab, setRightTab] = useState<'preview' | 'code'>('code');
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your Omniverse App Builder. I can build full-stack apps, debug code, and deploy projects instantly." }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Model Selection
    const [selectedModel, setSelectedModel] = useState(models[0].name);
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Speech & File Upload
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
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

    const toggleFolder = (folderName: string) => {
        setFiles(files.map((f: any) => f.name === folderName ? { ...f, isOpen: !f.isOpen } : f));
    };

    const handleDeploy = () => {
        setIsDeploying(true);
        setTimeout(() => {
            setIsDeploying(false);
            setDeploymentUrl('https://omniverse-app.web.app/demo');
            setRightTab('preview');
        }, 2500);
    };

    const handleDownload = async () => {
        const zip = new JSZip();

        const addFilesToZip = (folder: any, currentPath: any) => {
            folder.forEach((item: any) => {
                if (item.type === 'file') {
                    currentPath.file(item.name, item.content);
                } else if (item.type === 'folder' && item.children) {
                    const newFolder = currentPath.folder(item.name);
                    addFilesToZip(item.children, newFolder);
                }
            });
        };

        addFilesToZip(files, zip);

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "project-alpha.zip");
    };

    const getLineNumbers = (content: string) => {
        return content.split('\n').map((_, i) => i + 1).join('\n');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setChatInput(prev => prev + ` [Attachment: ${file.name}] `);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechError('Browser does not support speech recognition.');
            setTimeout(() => setSpeechError(null), 3000);
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
            if (transcript) setChatInput(transcript);
        };
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setSpeechError(`Error: ${event.error}`);
            setIsListening(false);
            setTimeout(() => setSpeechError(null), 3000);
        };
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
        setSpeechError(null);
    };

    const handleSend = async () => {
        if (!chatInput.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: chatInput };
        setMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsLoading(true);

        try {
            console.log('Agent sending message...', userMessage);
            const { data, error } = await supabase.functions.invoke('chat-proxy', {
                body: {
                    messages: [...messages, userMessage],
                    model: selectedModel
                },
            });

            if (error) {
                console.error('Agent Edge Function Error:', error);
                throw error;
            }

            console.log('Agent Response:', data);
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.choices?.[0]?.message?.content || "I couldn't process that request."
            };
            setMessages(prev => [...prev, assistantMessage]);

            // Extract and update code files from AI response
            const codeBlocks = extractCodeBlocks(assistantMessage.content);
            if (codeBlocks.length > 0) {
                updateFilesFromCodeBlocks(codeBlocks);
            }

        } catch (err: any) {
            console.error('Agent chat error:', err);
            setSpeechError('Failed to communicate with the model.');
        } finally {
            setIsLoading(false);
        }
    };

    // Extract markdown code blocks from AI response
    const extractCodeBlocks = (content: string): Array<{ language: string, code: string, filename?: string }> => {
        const blocks: Array<{ language: string, code: string, filename?: string }> = [];

        // Match ```language\ncode\n``` patterns
        const codeBlockRegex = /```(\w+)?(?:\s+(.+?))?\n([\s\S]*?)```/g;
        let match;

        while ((match = codeBlockRegex.exec(content)) !== null) {
            blocks.push({
                language: match[1] || 'plaintext',
                filename: match[2]?.trim(),
                code: match[3]
            });
        }

        return blocks;
    };

    // Update files based on extracted code blocks
    const updateFilesFromCodeBlocks = (codeBlocks: Array<{ language: string, code: string, filename?: string }>) => {
        const updateNestedFiles = (items: any[], updates: Map<string, string>): any[] => {
            return items.map(item => {
                if (item.type === 'file') {
                    const newContent = updates.get(item.name);
                    if (newContent !== undefined) {
                        return { ...item, content: newContent };
                    }
                }
                if (item.type === 'folder' && item.children) {
                    return { ...item, children: updateNestedFiles(item.children, updates) };
                }
                return item;
            });
        };

        const fileUpdates = new Map<string, string>();

        // Map language extensions to filenames
        const languageToExtension: Record<string, string> = {
            'typescript': '.tsx',
            'tsx': '.tsx',
            'javascript': '.jsx',
            'jsx': '.jsx',
            'ts': '.ts',
            'js': '.js',
            'css': '.css',
            'html': '.html',
            'json': '.json'
        };

        codeBlocks.forEach(block => {
            let targetFilename = block.filename;

            // If no filename specified, try to infer from language
            if (!targetFilename) {
                const ext = languageToExtension[block.language.toLowerCase()] || '.txt';

                // Smart defaults based on content
                if (block.code.includes('export default function App')) {
                    targetFilename = 'App.tsx';
                } else if (block.code.includes('@tailwind')) {
                    targetFilename = 'index.css';
                } else if (block.code.includes('package.json') || block.language === 'json') {
                    targetFilename = 'package.json';
                } else {
                    targetFilename = `generated${ext}`;
                }
            }

            fileUpdates.set(targetFilename, block.code);
        });

        if (fileUpdates.size > 0) {
            setFiles(prev => updateNestedFiles(prev, fileUpdates));

            // Update active file if it was modified
            const activeFileName = activeFile?.name;

            if (activeFileName && fileUpdates.has(activeFileName)) {
                setActiveFile({ ...activeFile, content: fileUpdates.get(activeFileName) || activeFile.content });
            } else {
                // Auto-open the first updated file
                const firstUpdatedName = Array.from(fileUpdates.keys())[0];
                const allFiles: any[] = files.flatMap((f: any) =>
                    f.type === 'folder' && f.children ? f.children : [f]
                );
                const firstUpdatedFile = allFiles.find((f: any) => f.name === firstUpdatedName);
                if (firstUpdatedFile) {
                    setActiveFile({ ...firstUpdatedFile, content: fileUpdates.get(firstUpdatedName) || '' });
                }
            }
        }
    };

    // --- SELECTION SCREEN ---
    if (!projectType) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10 text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">What do you want to build?</h1>
                    <p className="text-gray-400 text-lg">Choose your platform to initialize the workspace.</p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-6 z-10 w-full max-w-4xl">
                    {/* Website Card */}
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setProjectType('website')}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 group transition-all hover:border-cyan-500/50"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-colors">
                            <LayoutIcon className="w-10 h-10 text-cyan-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Modern Website</h3>
                            <p className="text-gray-400 text-sm">Responsive web applications with React, Tailwind, and cutting-edge UI.</p>
                        </div>
                    </motion.button>

                    {/* Mobile App Card */}
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setProjectType('mobile')}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 group transition-all hover:border-purple-500/50"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-600/30 transition-colors">
                            <Smartphone className="w-10 h-10 text-purple-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Mobile Application</h3>
                            <p className="text-gray-400 text-sm">Native-feel mobile apps for iOS and Android.</p>
                        </div>
                    </motion.button>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-6 left-6 z-20"
                >
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // --- MAIN AGENT WORKSPACE ---
    return (
        <div className="h-screen bg-[#0E0E0E] text-[#E0E0E0] flex font-sans overflow-hidden">

            {/* LEFT PANEL: AGENT & CHAT (400px fixed) */}
            <div className="w-[400px] flex flex-col border-r border-[#2A2A2A] bg-[#111111]">
                {/* Header */}
                <div className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div onClick={() => setProjectType(null)} className="cursor-pointer p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors text-gray-400 hover:text-white" title="Change Project Type">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        {/* Model Selector */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-sm text-gray-300 transition-all font-medium"
                            >
                                {selectedModel}
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isModelSelectorOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isModelSelectorOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute top-full left-0 mt-2 w-56 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-xl overflow-hidden z-20 p-1"
                                    >
                                        {models.map(model => (
                                            <button
                                                key={model.name}
                                                onClick={() => {
                                                    setSelectedModel(model.name);
                                                    setIsModelSelectorOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${selectedModel === model.name ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-400 hover:bg-[#252525] hover:text-white'}`}
                                            >
                                                {model.name}
                                                {model.pro && <span className="text-[9px] uppercase font-bold bg-[#2A2A2A] text-gray-500 px-1 py-0.5 rounded">PRO</span>}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                            <div className={cn(
                                "w-10 h-10 shrink-0 flex items-center justify-center rounded-full overflow-hidden",
                                msg.role === 'user' ? "bg-[#2A2A2A] border border-[#333]" : ""
                            )}>
                                {msg.role === 'assistant' ? (
                                    <img src="/images/omniverse-logo.png" alt="Omniverse" className="w-8 h-8 object-contain mix-blend-screen" />
                                ) : (
                                    <span className="text-xs font-bold text-gray-300">U</span>
                                )}
                            </div>
                            <div className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2 border text-sm text-gray-200",
                                msg.role === 'assistant'
                                    ? "bg-transparent border-transparent"
                                    : "bg-[#1A1A1A] border-[#2A2A2A] rounded-tr-sm"
                            )}>
                                <div className="prose prose-invert prose-sm">
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading/Thinking Indicator */}
                    {isLoading && (
                        <div className="pl-12 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                                Analyzing request...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-[#2A2A2A] bg-[#111111]">
                    <div className="relative">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Describe what to build..."
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none h-14 custom-scrollbar"
                            disabled={isLoading}
                        />
                        <div className="absolute right-2 bottom-2 flex gap-1">
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-[#2A2A2A] rounded-lg text-gray-400 transition-colors" title="Attach File">
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    {/* Error Message */}
                    <AnimatePresence>
                        {speechError && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-2 text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" /> {speechError}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="mt-2 flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-[10px] text-gray-500 font-mono">BUILDER READY</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500" onClick={toggleListening}>
                            <Mic className={`w-3 h-3 cursor-pointer ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-white'}`} />
                            <span>{isListening ? 'Listening...' : 'Voice Active'}</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* RIGHT PANEL: WORKSPACE (Tabs: Preview, Code) */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0E0E0E]">
                {/* Workspace Header Tabs */}
                <div className="h-10 bg-[#111111] border-b border-[#2A2A2A] flex items-center justify-between px-2">
                    <div className="flex items-center">
                        <button
                            onClick={() => setRightTab('preview')}
                            className={`px-4 py-2 text-xs font-medium border-t-2 transition-colors flex items-center gap-2 ${rightTab === 'preview' ? 'border-purple-500 bg-[#0E0E0E] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Webview
                        </button>
                        <button
                            onClick={() => setRightTab('code')}
                            className={`px-4 py-2 text-xs font-medium border-t-2 transition-colors flex items-center gap-2 ${rightTab === 'code' ? 'border-cyan-500 bg-[#0E0E0E] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            <Code className="w-3.5 h-3.5" />
                            Code Editor
                        </button>
                    </div>
                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-md transition-colors mr-2"
                        title="Download Source Code"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Download</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 relative overflow-hidden">
                    {rightTab === 'preview' ? (
                        /* BROWSER PREVIEW */
                        <div className="absolute inset-0 flex flex-col bg-white">
                            {/* Address Bar */}
                            <div className="h-9 bg-[#F1F1F1] border-b border-[#E0E0E0] flex items-center px-2 gap-2">
                                {/* If mobile project, show mobile device selector */}
                                {projectType === 'mobile' && (
                                    <div className="mr-2 flex items-center gap-2">
                                        <select
                                            value={selectedDevice.name}
                                            onChange={(e) => setSelectedDevice(mobileDevices.find(d => d.name === e.target.value) || mobileDevices[0])}
                                            className="bg-white border border-[#E0E0E0] rounded-md px-2 py-0.5 text-[10px] text-gray-600 font-medium focus:outline-none focus:border-purple-500"
                                        >
                                            {mobileDevices.map(device => (
                                                <option key={device.name} value={device.name}>{device.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="flex gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                                </div>
                                <div className="flex-1 ml-2">
                                    <div className="bg-white border border-[#E0E0E0] rounded-sm px-2 py-0.5 text-[10px] text-gray-500 flex items-center justify-between">
                                        <span>{deploymentUrl || 'localhost:3000'}</span>
                                        <RefreshCw className={`w-3 h-3 ${isDeploying ? 'animate-spin' : ''} cursor-pointer hover:text-black`} onClick={handleDeploy} />
                                    </div>
                                </div>
                            </div>
                            {/* Iframe / Placeholder */}
                            <div className="flex-1 bg-white relative flex justify-center bg-gray-100 overflow-y-auto">
                                {deploymentUrl ? (
                                    <iframe
                                        srcDoc={`<html><body style="margin:0;font-family:sans-serif;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;height:100vh;"><div style="text-align:center;"><h1>Welcome to ${projectType === 'mobile' ? 'Mobile App' : 'Project'} Alpha</h1><p>Running on App Builder</p><button style="margin-top:20px;padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;">Interactive Element</button></div></body></html>`}
                                        style={{
                                            width: projectType === 'mobile' ? selectedDevice.width : '100%',
                                            height: projectType === 'mobile' ? selectedDevice.height : '100%',
                                            borderRadius: projectType === 'mobile' ? selectedDevice.radius : '0',
                                            border: projectType === 'mobile' ? '12px solid #1a1a1a' : 'none',
                                            boxShadow: projectType === 'mobile' ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
                                        }}
                                        className={`bg-white transition-all duration-300 shrink-0 ${projectType === 'mobile' ? 'my-8' : ''}`}
                                        title="Preview"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#09090b]">
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                                            <Box className="w-16 h-16 text-cyan-500 relative z-10" />
                                        </div>
                                        <h2 className="text-white font-medium mb-1">Preview will be available soon</h2>
                                        <p className="text-gray-500 text-sm mb-6">Waiting for build to complete...</p>
                                        <button
                                            onClick={handleDeploy}
                                            className="px-5 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            Start Application
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* CODE EDITOR + FILES */
                        <div className="flex h-full">
                            {/* File Tree (Sidebar inside Code Tab) */}
                            <div className="w-56 bg-[#111111] border-r border-[#2A2A2A] flex flex-col">
                                <div className="p-2 border-b border-[#2A2A2A] flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 pl-2">EXPLORER</span>
                                </div>
                                <div className="flex-1 overflow-y-auto py-2">
                                    {files.map((item) => (
                                        <div key={item.name} className="px-2">
                                            {item.type === 'folder' ? (
                                                <>
                                                    <div
                                                        onClick={() => toggleFolder(item.name)}
                                                        className="flex items-center gap-1.5 py-1 px-2 hover:bg-[#2A2A2A] rounded cursor-pointer text-sm text-gray-300"
                                                    >
                                                        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${item.isOpen ? '' : '-rotate-90'}`} />
                                                        <Folder className="w-3.5 h-3.5 text-blue-500" />
                                                        {item.name}
                                                    </div>
                                                    {item.isOpen && (
                                                        <div className="ml-3 border-l border-[#2A2A2A] pl-1">
                                                            {item.children?.map(child => (
                                                                <div
                                                                    key={child.name}
                                                                    onClick={() => setActiveFile(child)}
                                                                    className={`flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer text-sm mb-0.5 ${activeFile.name === child.name ? 'bg-[#2A2A2A] text-white' : 'hover:bg-[#2A2A2A] text-gray-400'}`}
                                                                >
                                                                    {child.name.endsWith('css') ? <FileType className="w-3.5 h-3.5 text-sky-400" /> : <FileCode className="w-3.5 h-3.5 text-yellow-500" />}
                                                                    {child.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div
                                                    onClick={() => setActiveFile(item)}
                                                    className={`flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer text-sm ${activeFile.name === item.name ? 'bg-[#2A2A2A] text-white' : 'hover:bg-[#2A2A2A] text-gray-300'}`}
                                                >
                                                    <FileJson className="w-3.5 h-3.5 text-green-400" />
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Code Area */}
                            <div className="flex-1 flex flex-col bg-[#0F0F0F]">
                                <div className="flex items-center h-9 bg-[#111111] border-b border-[#2A2A2A] px-2 gap-2">
                                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <FileCode className="w-3.5 h-3.5 text-yellow-500" />
                                        {activeFile.name}
                                    </span>
                                </div>
                                <div className="flex-1 flex overflow-hidden">
                                    <div className="w-10 bg-[#111111] border-r border-[#2A2A2A] text-right pr-2 pt-4 text-xs font-mono text-gray-600 select-none leading-6">
                                        {getLineNumbers(activeFile.content)}
                                    </div>
                                    <div className="flex-1 p-4 font-mono text-sm leading-6 text-gray-300 whitespace-pre overflow-auto custom-scrollbar">
                                        {activeFile.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Agent;
