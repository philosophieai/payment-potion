
import React, { useState } from "react";
import PricingCard from "../components/PricingCard";
import CouponInput from "../components/CouponInput";
import { initiatePayment } from "../lib/stripe";
import { toast } from "sonner";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    features: [
      "Up to 5 projects",
      "Basic analytics",
      "24/7 support",
      "1GB storage",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "10GB storage",
      "Custom domain",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 149,
    features: [
      "Everything in Pro",
      "Enterprise analytics",
      "Dedicated support",
      "Unlimited storage",
      "SLA guarantee",
      "Custom integration",
    ],
  },
];

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const handlePlanSelect = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    toast.success(`${plan.name} plan selected`);
  };

  const handleCouponApply = (code: string) => {
    setCouponCode(code);
  };

  const calculateDiscountedPrice = (price: number) => {
    if (couponCode?.toLowerCase() === "discount50") {
      return price * 0.5;
    }
    return price;
  };

  const handleCheckout = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    try {
      const result = await initiatePayment(selectedPlan.id, couponCode || undefined);
      if (result.success) {
        toast.success("Redirecting to payment...");
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include our core
            features with different levels of access and priority support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              discountedPrice={
                selectedPlan?.id === plan.id
                  ? calculateDiscountedPrice(plan.price)
                  : undefined
              }
              features={plan.features}
              isPopular={plan.isPopular}
              onSelect={() => handlePlanSelect(plan)}
            />
          ))}
        </div>

        {selectedPlan && (
          <div className="max-w-md mx-auto space-y-6 animate-slideUp">
            <div className="p-6 rounded-2xl bg-white/90 border border-gray-200 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Selected Plan</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-gray-600">Price</span>
                <div>
                  {couponCode ? (
                    <div className="text-right">
                      <span className="text-gray-400 line-through">
                        ${selectedPlan.price}
                      </span>
                      <span className="ml-2 font-medium">
                        ${calculateDiscountedPrice(selectedPlan.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium">${selectedPlan.price}</span>
                  )}
                </div>
              </div>
              
              <CouponInput onApply={handleCouponApply} />
              
              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
