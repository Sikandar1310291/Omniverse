import { motion } from 'framer-motion';
import { Search, Code2, BarChart3, Globe2, Shield, Zap } from 'lucide-react';

const capabilities = [
    {
        icon: <Search className="w-6 h-6" />,
        title: "Real-time Research",
        description: "Autonomous web browsing and information synthesis from millions of sources in seconds."
    },
    {
        icon: <Code2 className="w-6 h-6" />,
        title: "Autonomous Coding",
        description: "Writing, debugging, and deploying production-ready code across any stack."
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Data Intelligence",
        description: "Deep analysis of complex datasets with natural language insights and visualization."
    },
    {
        icon: <Globe2 className="w-6 h-6" />,
        title: "Global Reach",
        description: "Seamlessly integrates with thousands of tools and APIs to automate your entire workflow."
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Private & Secure",
        description: "Enterprise-grade security with local data processing options and full transparency."
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Lightning Speed",
        description: "Powered by the next generation of inference engines for near-instant execution."
    }
];

const Capabilities = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-black relative">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-accent text-sm font-medium tracking-widest uppercase mb-4 block"
                    >
                        Capabilities
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-serif text-white max-w-2xl"
                    >
                        One agent, limitless <br className="hidden md:block" /> possibilities
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {capabilities.map((cap, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                {cap.icon}
                            </div>
                            <h3 className="text-xl font-medium text-white mb-3">{cap.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {cap.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </section>
    );
};

export default Capabilities;
