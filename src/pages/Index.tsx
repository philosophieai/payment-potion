import React, { useState } from "react";
import PricingCard from "../components/PricingCard";
import CouponInput from "../components/CouponInput";
import { initiatePayment } from "../lib/stripe";
import { toast } from "sonner";
import { Check, MessageSquare, Lock } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    billingPeriod: "month",
    features: [
      "Up to 3 projects",
      "Basic analytics dashboard",
      "Community support",
      "1GB storage",
      "API access (100 calls/day)",
      "Basic integrations",
    ],
    ctaText: "Get Started Free",
  },
  {
    id: "pro",
    name: "Professional",
    price: 20,
    yearlyPrice: 200,
    billingPeriod: "month",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority email support",
      "10GB storage",
      "API access (10K calls/day)",
      "Advanced integrations",
      "Team collaboration",
      "Custom domains",
    ],
    isPopular: true,
    ctaText: "Start Pro Trial",
  },
  {
    id: "advanced",
    name: "Advanced",
    price: 100,
    yearlyPrice: 1000,
    billingPeriod: "month",
    features: [
      "Everything in Pro",
      "Enterprise analytics",
      "24/7 priority support",
      "100GB storage",
      "Unlimited API calls",
      "Custom integrations",
      "Advanced security",
      "SAML SSO",
      "Audit logs",
      "SLA guarantee",
    ],
    ctaText: "Start Advanced Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    features: [
      "Everything in Advanced",
      "Dedicated account manager",
      "Custom contract",
      "Unlimited storage",
      "On-premise deployment option",
      "Custom SLA",
      "24/7 phone support",
      "Training & onboarding",
      "Security assessment",
      "Custom features",
    ],
    isEnterprise: true,
    ctaText: "Contact Sales",
  },
];

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans[0] & { yearlyBilling?: boolean }) | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const handlePlanSelect = (plan: typeof plans[0]) => {
    if (plan.isEnterprise) {
      // In a real app, this would open a contact form or redirect to a sales page
      window.location.href = "mailto:sales@example.com?subject=Enterprise Plan Inquiry";
      return;
    }
    setSelectedPlan({ ...plan, yearlyBilling });
    toast.success(`${plan.name} plan selected`);
  };

  const handleCouponApply = (code: string) => {
    setCouponCode(code);
  };

  const calculateDiscountedPrice = (price: number) => {
    if (couponCode) {
      // Apply 20% discount for any coupon code (demo purposes)
      return price * 0.8;
    }
    return price;
  };

  const getPlanPrice = (plan: typeof plans[0]) => {
    if (plan.isEnterprise) return null;
    const basePrice = yearlyBilling ? (plan.yearlyPrice || plan.price * 12) : plan.price;
    return basePrice;
  };

  const handleCheckout = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    try {
      const result = await initiatePayment(selectedPlan.id, couponCode || undefined);
      if (result.success) {
        toast.success("Payment processed successfully");
      }
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-4">Choose Your Perfect Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Scale your business with our flexible pricing options. All plans include our
            core features with different levels of access and support.
          </p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-sm ${!yearlyBilling ? 'font-semibold text-[#1EAEDB]' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setYearlyBilling(!yearlyBilling)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                yearlyBilling ? 'bg-[#1EAEDB]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  yearlyBilling ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm ${yearlyBilling ? 'font-semibold text-[#1EAEDB]' : 'text-gray-600'}`}>
              Yearly
              <span className="ml-1 text-xs text-green-500 font-medium">
                (Save up to 17%)
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={getPlanPrice(plan)}
              discountedPrice={
                selectedPlan?.id === plan.id && !plan.isEnterprise
                  ? calculateDiscountedPrice(getPlanPrice(plan) || 0)
                  : undefined
              }
              features={plan.features}
              isPopular={plan.isPopular}
              isEnterprise={plan.isEnterprise}
              billingPeriod={yearlyBilling ? "year" : "month"}
              ctaText={plan.ctaText}
              onSelect={() => handlePlanSelect(plan)}
            />
          ))}
        </div>

        {selectedPlan && !selectedPlan.isEnterprise && (
          <div className="max-w-6xl mx-auto space-y-6 animate-slideUp">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="p-8 rounded-2xl bg-white/90 border border-gray-200 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">{selectedPlan.name} Plan</h4>
                      <div className="text-sm text-gray-600">
                        <p>Billed {yearlyBilling ? "yearly" : "monthly"}</p>
                        <p className="text-xs mt-0.5">Can cancel anytime</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold">
                        ${getPlanPrice(selectedPlan)}
                      </span>
                      <span className="text-sm text-gray-600">
                        /{yearlyBilling ? "year" : "month"}
                      </span>
                    </div>
                  </div>

                  {yearlyBilling && (
                    <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-lg">
                      <span className="text-sm font-medium">Annual discount</span>
                      <span className="font-medium">-17%</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Have a coupon code?</h4>
                    <CouponInput onApply={handleCouponApply} />
                  </div>

                  {couponCode && (
                    <div className="p-4 bg-[#1EAEDB]/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-[#1EAEDB] font-medium">Discount applied</span>
                        <span className="text-[#1EAEDB] font-medium">-20%</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold">
                          ${calculateDiscountedPrice(getPlanPrice(selectedPlan) || 0)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Prices shown in USD. Includes applicable taxes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="p-8 rounded-2xl bg-white/90 border border-gray-200 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Payment Details</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Secure payment</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1EAEDB] transition-colors"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1EAEDB] transition-colors"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1EAEDB] transition-colors"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1EAEDB] transition-colors"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-[#1EAEDB] text-white rounded-xl hover:bg-[#1EAEDB]/90 transition-all font-medium mt-6"
                  >
                    Pay ${calculateDiscountedPrice(getPlanPrice(selectedPlan) || 0)}
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span>Need help? Our support team is here 24/7</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
