import { motion } from 'framer-motion';
import { Cpu, Globe, Lock, Code, Zap, Layers, GitBranch, MessageSquare, Terminal } from 'lucide-react';

const Features = () => {
    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            {/* Hero */}
            <div className="px-6 py-20 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Apexora Engine V2</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-8">
                        The Operating System for <br />
                        <span className="text-white/40">Autonomous Agents</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Everything you need to build, deploy, and scale AI agents.
                        From state-of-the-art models to secure execution environments.
                    </p>
                </motion.div>
            </div>

            {/* Feature Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Feature 1: Large Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-10 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                <Cpu className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Multi-Model Orchestration</h3>
                            <p className="text-white/60 text-lg max-w-md">
                                Don't limit yourself to one provider. Apexora intelligently routes requests to the best model for the task—whether it's GPT-4 for reasoning, Claude for coding, or Gemini for context.
                            </p>
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 group-hover:opacity-50 transition-opacity">
                            <div className="absolute inset-0 bg-gradient-to-l from-purple-500/20 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Feature 2: Small Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl bg-black border border-white/10 p-8 hover:bg-white/[0.02] transition-colors"
                    >
                        <Lock className="w-8 h-8 text-white mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
                        <p className="text-white/60 text-sm">SOC2 Type II certified. Your data is encrypted at rest and in transit.</p>
                    </motion.div>

                    {/* Feature 3: Small Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl bg-black border border-white/10 p-8 hover:bg-white/[0.02] transition-colors"
                    >
                        <Globe className="w-8 h-8 text-white mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Global Edge Network</h3>
                        <p className="text-white/60 text-sm">Deploy agents to 35+ regions worldwide for &lt;50ms latency.</p>
                    </motion.div>

                    {/* Feature 4: Wide Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-3 rounded-3xl bg-white/[0.02] border border-white/10 p-10 flex flex-col md:flex-row items-center gap-10"
                    >
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-4">Complete Developer Toolkit</h3>
                            <ul className="space-y-4">
                                {[
                                    { icon: <Terminal className="w-4 h-4" />, text: "CLI for instant deployments" },
                                    { icon: <Code className="w-4 h-4" />, text: "TypeScript & Python SDKs" },
                                    { icon: <GitBranch className="w-4 h-4" />, text: "Preview environments on every PR" },
                                    { icon: <Layers className="w-4 h-4" />, text: "Built-in vector database" }
                                ].map((item) => (
                                    <li key={item.text} className="flex items-center gap-3 text-white/70">
                                        <div className="p-1.5 rounded-lg bg-white/5 text-white">{item.icon}</div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full bg-[#0F0F0F] rounded-xl border border-white/10 p-6 font-mono text-xs">
                            <div className="flex gap-1.5 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                            <div className="space-y-2 text-white/50">
                                <p><span className="text-purple-400">import</span> {'{ Agent }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@apexora/sdk'</span>;</p>
                                <p>&nbsp;</p>
                                <p><span className="text-purple-400">const</span> agent = <span className="text-purple-400">new</span> Agent({'{'}</p>
                                <p className="pl-4">name: <span className="text-green-400">'DataAnalyst'</span>,</p>
                                <p className="pl-4">model: <span className="text-green-400">'gpt-4-turbo'</span>,</p>
                                <p className="pl-4">tools: [webSearch, codeInterpreter]</p>
                                <p>{'}'});</p>
                                <p>&nbsp;</p>
                                <p><span className="text-gray-500">// Deploy instantly</span></p>
                                <p><span className="text-blue-400">await</span> agent.deploy();</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Features;
