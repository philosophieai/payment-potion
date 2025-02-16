
import React from "react";
import { Check, ArrowRight } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: number | null;
  discountedPrice?: number;
  features: string[];
  isPopular?: boolean;
  isEnterprise?: boolean;
  billingPeriod?: "month" | "year";
  ctaText?: string;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  discountedPrice,
  features,
  isPopular,
  isEnterprise,
  billingPeriod = "month",
  ctaText = "Select Plan",
  onSelect,
}) => {
  return (
    <div
      className={`relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
        isPopular
          ? "bg-white/90 shadow-lg border-2 border-primary"
          : isEnterprise
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white border border-gray-700"
          : "bg-white/80 border border-gray-200"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-white text-sm font-medium animate-fadeIn">
          Most Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className={`text-xl font-semibold mb-2 ${isEnterprise ? 'text-white' : ''}`}>{name}</h3>
        <div className="flex items-center justify-center gap-2">
          {isEnterprise ? (
            <span className="text-lg text-gray-300">Custom pricing</span>
          ) : (
            <>
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-bold">${discountedPrice}</span>
                  <span className="text-lg text-gray-400 line-through">${price}</span>
                </>
              ) : (
                <span className="text-3xl font-bold">${price || 0}</span>
              )}
              <span className={`text-sm ${isEnterprise ? 'text-gray-300' : 'text-gray-500'}`}>
                /{billingPeriod}
              </span>
            </>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`w-5 h-5 mt-0.5 ${isEnterprise ? 'text-primary-foreground' : 'text-primary'}`} />
            <span className={isEnterprise ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
          isPopular
            ? "bg-primary text-white hover:bg-primary/90"
            : isEnterprise
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {ctaText}
        {isEnterprise && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default PricingCard;
