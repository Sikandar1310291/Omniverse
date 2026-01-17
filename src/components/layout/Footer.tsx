import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-20 px-6 md:px-12 bg-black text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-white font-serif mb-6 block">
                            Apexora
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            The world's first universal AI agent.
                            Built for autonomous execution and complex task completion.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/features" className="text-muted-foreground hover:text-white transition-colors text-sm">Features</Link></li>
                            <li><Link to="/pricing" className="text-muted-foreground hover:text-white transition-colors text-sm">Pricing</Link></li>
                            <li><Link to="/apikeys" className="text-muted-foreground hover:text-white transition-colors text-sm">API Keys</Link></li>
                            <li><a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Safety</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-muted-foreground hover:text-white transition-colors text-sm">About</Link></li>
                            <li><a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Blog</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Careers</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Contact</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Connect</h4>
                        <ul className="space-y-4">
                            {['Twitter', 'LinkedIn', 'YouTube', 'Discord'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
                    <p>© 2026 Apexora. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;
