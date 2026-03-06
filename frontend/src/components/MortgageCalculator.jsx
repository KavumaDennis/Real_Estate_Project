import { useState, useEffect } from 'react';
import { HiCalculator, HiOutlineInformationCircle } from 'react-icons/hi';

const MortgageCalculator = ({ price }) => {
    const [loanAmount, setLoanAmount] = useState(price * 0.8);
    const [interestRate, setInterestRate] = useState(4.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [downPayment, setDownPayment] = useState(price * 0.2);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        calculatePayment();
    }, [loanAmount, interestRate, loanTerm]);

    const calculatePayment = () => {
        const principal = loanAmount;
        const calculatedInterest = interestRate / 100 / 12;
        const calculatedPayments = loanTerm * 12;

        const x = Math.pow(1 + calculatedInterest, calculatedPayments);
        const monthly = (principal * x * calculatedInterest) / (x - 1);

        if (isFinite(monthly)) {
            setMonthlyPayment(monthly.toFixed(2));
        }
    };

    const handleDownPaymentChange = (value) => {
        setDownPayment(value);
        setLoanAmount(price - value);
    };

    return (
        <div className="bg-gray-900 py-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

            <div className="relative z-10">
                <div className="flex flex-col items-start space-x-4 mb-5">
                    <h2 className="block text-xs text-start font-black text-white uppercase tracking-widest mb-1">Mortgage Calculator</h2>
                    <p className="px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">Estimate your monthly home loan payments.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-xs text-start font-black text-amber-600 uppercase tracking-widest">Down Payment</label>
                                <span className="block text-xs text-start font-black text-white uppercase tracking-widest">${Number(downPayment).toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={price}
                                value={downPayment}
                                onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-700"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs text-start font-black text-amber-600 uppercase tracking-widest mb-2">Interest Rate (%)</label>
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-start font-black text-amber-600 uppercase tracking-widest mb-2">Loan Term (Years)</label>
                                <select
                                    value={loanTerm}
                                    onChange={(e) => setLoanTerm(e.target.value)}
                                    className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70"
                                >
                                    <option value="10">10 Years</option>
                                    <option value="15">15 Years</option>
                                    <option value="20">20 Years</option>
                                    <option value="30">30 Years</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-600/10 border border-blue-600/20 flex items-start space-x-4">
                            <HiOutlineInformationCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
                            <p className="text-sm text-gray-400 text-start leading-relaxed">
                                This is an estimate. Actual rates and payments may vary based on your credit score, local taxes, and insurance.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md  p-5 flex flex-col items-end justify-center border border-white/10">
                        <div className="w-full flex justify-between items-center mb-5">
                            <p className="block text-xs text-start font-black text-white uppercase tracking-widest">Monthly Payment</p>
                            <h3 className="block text-lg text-start font-black text-orange-500 uppercase tracking-widest">
                                <span className="font-sans">$</span>{Number(monthlyPayment).toLocaleString()}
                            </h3>
                        </div>
                        <div className="w-full h-px bg-white/10 mb-8"></div>
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-teal-700 font-medium">Principal & Interest</span>
                                <span className="block text-xs text-start font-black text-white uppercase tracking-widest">${Number(monthlyPayment).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-teal-700 font-medium">Estimated Taxes & Insurance</span>
                                <span className="block text-xs text-start font-black text-white uppercase tracking-widest">$0.00</span>
                            </div>
                        </div>
                        <button className="mt-10 w-fit px-6 py-3 border border-black/10 bg-amber-600 text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg">
                            Get Pre-Approved
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MortgageCalculator;
