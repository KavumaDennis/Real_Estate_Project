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
            <div className="text-center w-full space-y-1">
                <h1 className="block text-xs text-start font-black text-black uppercase tracking-widest ">Elevate Your Presence</h1>
                <p className="px-6 py-3 w-fit border border-black/10 bg-orange-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Choose the plan that fits your growth. Upgrade to reach more buyers and close deals faster.</p>

                <div className="inline-flex items-center p-1 bg-gray-100 rounded-2xl mt-4">
                    <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-sm font-bold text-gray-900 border border-gray-100">Monthly</button>
                    <button className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Yearly (Save 20%)</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
                {plans.map((p) => (
                    <div
                        key={p.id}
                        className={`relative p-8 transition-all duration-500 ${p.popular ? ' bg-orange-600 scale-105 z-10' : 'border-gray-100 bg-teal-700 hover:border-gray-300'
                            }`}
                    >
                        {p.popular && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 font-black text-xs uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-5">
                            <h3 className="block text-xs text-start font-black text-black uppercase tracking-widest ">{p.name}</h3>
                            <p className="text-white text-start text-sm mt-2">{p.description}</p>
                        </div>

                        <div className="flex items-baseline mb-5">
                            <span className="block text-xl text-start font-black text-black uppercase tracking-widest ">{p.price}</span>
                            {p.price !== 'Free' && <span className="text-gray-400 font-bold ml-2">/month</span>}
                        </div>

                        <div className="space-y-4 mb-5">
                            {p.features.map((feature, i) => (
                                <div key={i} className="flex items-center text-white/80 font-medium text-sm">
                                    <HiCheckCircle className={`h-5 w-5 mr-3 flex-shrink-0 ${p.popular ? 'text-blue-500' : 'text-gray-300'}`} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setPlan(p.id)}
                            className={`px-6 py-3 border border-black/10 text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg ${plan === p.id
                                    ? 'bg-blue-600 text-black cursor-default'
                                    : p.popular
                                        ? 'bg-white text-black hover:bg-blue-700 active:scale-95'
                                        : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-900 active:scale-95'
                                }`}
                        >
                            {plan === p.id ? 'Current Plan' : 'Select Plan'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl space-y-4">
                        <div className="flex items-center space-x-2 text-blue-400">
                            <HiShieldCheck className="h-6 w-6" />
                            <span className="font-black text-sm uppercase tracking-widest">Enterprise Solution</span>
                        </div>
                        <h2 className="text-3xl text-start font-black">Running a large real estate agency?</h2>
                        <p className="text-gray-400 text-start ">Get a custom plan tailored to your team's size. Includes agency-wide branding, priority lead routing, and expert onboarding.</p>
                    </div>
                    <button className="px-6 py-3 border border-black/10 bg-white text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg">
                        Contact Sales
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 flex items-center space-x-4">
                    <HiCreditCard className="h-6 w-6 text-gray-400" />
                    <p className="text-sm font-bold text-gray-500">Secure Payments</p>
                </div>
                <div className="p-6 flex items-center space-x-4">
                    <HiLightningBolt className="h-6 w-6 text-gray-400" />
                    <p className="text-sm font-bold text-gray-500">Auto Upgrade</p>
                </div>
                <div className="p-10 lg:col-span-2 text-right">
                    <p className="text-xs text-gray-400">Manage your billing history in <span className="text-blue-600 font-bold underline cursor-pointer">Account Settings</span></p>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
