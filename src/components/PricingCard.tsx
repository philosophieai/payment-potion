
import React from "react";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: number;
  discountedPrice?: number;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  discountedPrice,
  features,
  isPopular,
  onSelect,
}) => {
  return (
    <div
      className={`relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
        isPopular
          ? "bg-white/90 shadow-lg border border-primary/20"
          : "bg-white/80 border border-gray-200"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-white text-sm font-medium animate-fadeIn">
          Most Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <div className="flex items-center justify-center gap-2">
          {discountedPrice ? (
            <>
              <span className="text-3xl font-bold">${discountedPrice}</span>
              <span className="text-lg text-gray-400 line-through">${price}</span>
            </>
          ) : (
            <span className="text-3xl font-bold">${price}</span>
          )}
          <span className="text-gray-500">/month</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-xl transition-all duration-300 ${
          isPopular
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        Select Plan
      </button>
    </div>
  );
};

export default PricingCard;
