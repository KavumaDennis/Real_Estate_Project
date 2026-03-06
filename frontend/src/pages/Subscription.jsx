import { useState } from 'react';
import {
    HiCheck, HiLightningBolt, HiBadgeCheck, HiShieldCheck,
    HiCreditCard, HiCheckCircle, HiStar
} from 'react-icons/hi';

const Subscription = () => {
    const [plan, setPlan] = useState('agent_plus');

    const plans = [
        {
            id: 'agent_basic',
            name: 'Basic Agent',
            price: 'Free',
            description: 'Start listing your first properties',
            features: [
                'Up to 5 Active Listings',
                'Standard Search Results',
                'Basic Inquiry Management',
                'Email Support'
            ],
            color: 'gray'
        },
        {
            id: 'agent_plus',
            name: 'Agent Pro',
            price: '$29',
            description: 'Best for active real estate agents',
            features: [
                'Unlimited Listings',
                'Priority Search Placement',
                'Virtual Tour Uploads',
                'Advanced Analytics',
                'Lead Export (CSV/PDF)',
                'Priority Support'
            ],
            color: 'blue',
            popular: true
        },
        {
            id: 'agent_premium',
            name: 'Platinum Elite',
            price: '$99',
            description: 'For top-tier agents and agencies',
            features: [
                'Featured Agent Status',
                'Social Media Promotions',
                'Custom Agency Profile',
                'Dedicated Account Manager',
                'API Access for Integrations',
                'verified Badge'
            ],
            color: 'indigo'
        }
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="text-center w-full space-y-4 px-4">
                <div className="max-w-md mx-auto">
                    <h1 className="block text-xs text-center font-black text-black uppercase tracking-widest mb-2">Elevate Your Presence</h1>
                    <p className="px-4 py-3 border border-black/10 bg-orange-600 text-[10px] sm:text-xs text-center font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Choose your growth path. Reach more buyers today.</p>
                </div>

                <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center p-1 bg-gray-100 shadow-inner mt-4 w-full sm:w-auto overflow-hidden">
                    <button className="px-8 py-3 bg-white shadow-sm text-xs font-black uppercase tracking-widest text-gray-900 border border-black/10">Monthly Billing</button>
                    <button className="px-8 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition mt-1 sm:mt-0">Yearly (Save 20%)</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
                {plans.map((p) => (
                    <div
                        key={p.id}
                        className={`relative p-8 transition-all duration-500 overflow-hidden ${p.popular ? 'bg-orange-600 scale-100 lg:scale-105 z-10 shadow-2xl' : 'border border-black/10 bg-teal-700 hover:border-black/30'
                            }`}
                    >
                        {p.popular && (
                            <div className="absolute -left-12 top-4 -rotate-45 bg-blue-600 text-white px-12 py-1 font-black text-[9px] uppercase tracking-widest shadow-lg">
                                Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{p.name}</h3>
                            <p className="text-white/70 text-sm mt-2">{p.description}</p>
                        </div>

                        <div className="flex items-baseline mb-8">
                            <span className="text-4xl font-black text-white tracking-tighter">{p.price}</span>
                            {p.price !== 'Free' && <span className="text-white/40 font-black text-xs uppercase ml-2 tracking-widest">/ month</span>}
                        </div>

                        <div className="space-y-4 mb-10">
                            {p.features.map((feature, i) => (
                                <div key={i} className="flex items-start text-white/90 font-bold text-sm">
                                    <HiCheckCircle className={`h-5 w-5 mr-3 flex-shrink-0 ${p.popular ? 'text-blue-500' : 'text-amber-500'}`} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setPlan(p.id)}
                            className={`w-full px-6 py-4 text-xs font-black uppercase tracking-widest transition shadow-xl ${plan === p.id
                                ? 'bg-teal-900 text-white cursor-default border border-white/20'
                                : p.popular
                                    ? 'bg-white text-black hover:bg-blue-600 hover:text-white'
                                    : 'bg-amber-600 text-white hover:bg-blue-600'
                                }`}
                        >
                            {plan === p.id ? 'Current Plan' : 'Select Plan'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10">
                    <div className="max-w-xl space-y-4">
                        <div className="flex items-center space-x-2 text-blue-400">
                            <HiShieldCheck className="h-6 w-6" />
                            <span className="font-black text-xs uppercase tracking-widest">Enterprise Solution</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl text-start font-black uppercase tracking-tight">Large Agency?</h2>
                        <p className="text-gray-400 text-start text-sm sm:text-base leading-relaxed">Get a custom plan tailored to your team's size. Includes agency-wide branding, priority lead routing, and expert onboarding.</p>
                    </div>
                    <button className="w-full lg:w-auto px-10 py-4 bg-white text-xs font-black uppercase tracking-widest text-black hover:bg-blue-600 hover:text-white transition shadow-xl">
                        Contact Sales
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 flex items-center space-x-4 border border-black/5 bg-gray-50">
                    <HiCreditCard className="h-6 w-6 text-gray-400 shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secure Payments</p>
                </div>
                <div className="p-4 flex items-center space-x-4 border border-black/5 bg-gray-50">
                    <HiLightningBolt className="h-6 w-6 text-gray-400 shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Auto Renewal</p>
                </div>
                <div className="p-6 sm:p-10 lg:col-span-2 text-center sm:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manage billing in <span className="text-blue-600 cursor-pointer">Account Settings</span></p>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
