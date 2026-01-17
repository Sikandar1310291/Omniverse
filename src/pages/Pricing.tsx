import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';
import { useState } from 'react';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: 'Starter',
            description: 'For individuals just starting with AI agents.',
            price: isAnnual ? '0' : '0',
            features: [
                'Access to standard models (GPT-3.5, Gemini Flash)',
                '5 autonomous agents',
                '1,000 runs per month',
                'Community support',
                'Basic templates'
            ],
            notIncluded: [
                'Pro models (GPT-4, Claude 3 Opus)',
                'Team collaboration',
                'API access'
            ]
        },
        {
            name: 'Pro',
            description: 'For power users and creators building complex workflows.',
            price: isAnnual ? '29' : '39',
            popular: true,
            features: [
                'Access to all Pro models',
                'Unlimited autonomous agents',
                '10,000 runs per month',
                'Priority email support',
                'Advanced templates & marketplace',
                'Early access to new features'
            ],
            notIncluded: [
                'SSO & Advanced Security',
                'Dedicated account manager'
            ]
        },
        {
            name: 'Enterprise',
            description: 'For teams and organizations requiring scale and control.',
            price: 'Custom',
            features: [
                'Unlimited everything',
                'Custom model fine-tuning',
                'SSO / SAML',
                'On-premise deployment option',
                '24/7 Dedicated support',
                'SLA guarantees',
                'Audit logs'
            ],
            notIncluded: []
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif text-white mb-6"
                    >
                        Simple, transparent pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/60 mb-10"
                    >
                        Start building for free. Scale as you grow.
                    </motion.p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-14 h-7 rounded-full bg-white/10 p-1 relative transition-colors hover:bg-white/20"
                        >
                            <motion.div
                                animate={{ x: isAnnual ? 28 : 0 }}
                                className="w-5 h-5 rounded-full bg-white shadow-lg"
                            />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-white/40'}`}>
                            Yearly <span className="text-emerald-400 text-xs ml-1 font-bold">SAVE 25%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                                relative p-8 rounded-3xl border flex flex-col
                                ${plan.popular
                                    ? 'bg-white/[0.03] border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]'
                                    : 'bg-black border-white/10'
                                }
                            `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-white/60 mb-6 min-h-[40px]">{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">
                                        {plan.price === 'Custom' ? '' : '$'}{plan.price}
                                    </span>
                                    {plan.price !== 'Custom' && (
                                        <span className="text-white/40">/mo</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500 mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-white/80">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3 opacity-40">
                                        <div className="p-1 rounded-full bg-white/5 text-white mt-0.5">
                                            <X className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-white">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`
                                w-full py-4 rounded-xl font-bold transition-all
                                ${plan.popular
                                    ? 'bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                }
                            `}>
                                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ or Trust Section */}
                <div className="mt-24 text-center">
                    <p className="text-white/40 text-sm mb-4">Trusted by innovative teams at</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale saturate-0">
                        {/* Simple placeholder text logos for now to avoid needing external assets */}
                        <span className="text-xl font-bold text-white">Acme Inc</span>
                        <span className="text-xl font-bold text-white">Globex</span>
                        <span className="text-xl font-bold text-white">Soylent Corp</span>
                        <span className="text-xl font-bold text-white">Initech</span>
                        <span className="text-xl font-bold text-white">Umbrella</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
