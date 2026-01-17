import { motion } from 'framer-motion';
import { Sparkles, Users, Globe, Zap, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';

const About = () => {
    const stats = [
        { label: 'Autonomous Workflows', value: '10M+' },
        { label: 'Active Users', value: '50k+' },
        { label: 'Countries', value: '120+' },
        { label: 'Uptime', value: '99.9%' },
    ];

    const team = [
        {
            name: 'Sarah Chen',
            role: 'Founder & CEO',
            bio: 'Ex-DeepMind researcher passionate about AGI accessibility.'
        },
        {
            name: 'David Miller',
            role: 'CTO',
            bio: 'Distributed systems expert. Previously Principal Engineer at Google.'
        },
        {
            name: 'Emily Zhang',
            role: 'Head of Product',
            bio: 'Design-driven product leader focused on intuitive AI interfaces.'
        },
        {
            name: 'James Wilson',
            role: 'Lead AI Engineer',
            bio: 'PhD in Computer Vision. Building the next gen of multimodal models.'
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            {/* Hero Section */}
            <div className="relative px-6 border-b border-white/5 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Our Mission</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight"
                    >
                        Pioneering the Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Autonomous Agents</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        We believe in a future where AI empowers humanity to achieve more by handling the complexity of modern work. Apexora is building the infrastructure for this new era.
                    </motion.p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">{stat.value}</div>
                                <div className="text-sm text-white/40 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Built on First Principles</h2>
                        <p className="text-white/60 max-w-2xl mx-auto">Our core values guide every decision we make.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="w-6 h-6" />,
                                title: "Speed is a Feature",
                                desc: "We optimize for milliseconds because we know that speed unlocks creativity."
                            },
                            {
                                icon: <Users className="w-6 h-6" />,
                                title: "Human Centric",
                                desc: "AI should amplify human potential, not replace it. We build tools that empower."
                            },
                            {
                                icon: <Globe className="w-6 h-6" />,
                                title: "Global Scale",
                                desc: "Built on a distributed edge network to serve users instantaneously, worldwide."
                            }
                        ].map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                            >
                                <div className="p-3 rounded-xl bg-white/5 w-fit mb-6 text-white group-hover:scale-110 transition-transform">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-white/60 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-24 px-6 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Meet the Builders</h2>
                            <p className="text-white/60 max-w-xl">A world-class team of researchers, engineers, and designers working to solve the hardest problems in AI.</p>
                        </div>
                        <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors border-b border-white pb-1">
                            Join the team <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5"
                            >

                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <div className="text-lg font-bold text-white mb-1">{member.name}</div>
                                    <div className="text-sm font-medium text-purple-400 mb-2">{member.role}</div>
                                    <p className="text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity delay-100 line-clamp-2">
                                        {member.bio}
                                    </p>
                                    <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                                        <Github className="w-4 h-4 text-white/60 hover:text-white cursor-pointer" />
                                        <Twitter className="w-4 h-4 text-white/60 hover:text-white cursor-pointer" />
                                        <Linkedin className="w-4 h-4 text-white/60 hover:text-white cursor-pointer" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
