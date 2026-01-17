import { motion } from 'framer-motion';

const useCases = [
    {
        title: "Product Strategy",
        example: "Analyze the current CRM market and propose a differentiated feature set for a niche audience.",
        tag: "Research"
    },
    {
        title: "Code Refactoring",
        example: "Convert this legacy PHP monolith into a modern serverless architecture while maintaining 100% test coverage.",
        tag: "Inference"
    },
    {
        title: "Market Intelligence",
        example: "Monitor 50 competitors and alert me when they change their pricing or launch new features.",
        tag: "Automation"
    },
    {
        title: "Workflow Optimization",
        example: "Connect my Slack, Jira, and GitHub to automatically summarize daily standup progress.",
        tag: "Integration"
    }
];

const UseCases = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-black border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-accent text-sm font-medium tracking-widest uppercase mb-4 block"
                        >
                            Applications
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-serif text-white"
                        >
                            Built for the <br /> complex
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-sm text-lg"
                    >
                        Apexora handles the heavy lifting, allowing you to focus on the bigger picture
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-black p-10 flex flex-col justify-between hover:bg-white/[0.02] transition-colors duration-500 group"
                        >
                            <div className="space-y-4">
                                <span className="text-xs font-mono text-accent/80 border border-accent/20 px-2 py-0.5 rounded-full">
                                    {useCase.tag}
                                </span>
                                <h3 className="text-2xl font-serif text-white">{useCase.title}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed italic">
                                    "{useCase.example}"
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-sm text-white/40 group-hover:text-white transition-colors">
                                <span>Try this task</span>
                                <div className="h-px flex-1 bg-white/10 group-hover:bg-accent/40 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
