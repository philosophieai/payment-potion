
import React, { useState } from "react";
import { toast } from "sonner";

interface CouponInputProps {
  onApply: (code: string) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({ onApply }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real implementation, validate the coupon code with your backend
      if (code.toLowerCase() === "discount50") {
        onApply(code);
        toast.success("Coupon applied successfully!");
      } else {
        toast.error("Invalid coupon code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter coupon code"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Applying..." : "Apply"}
      </button>
    </form>
  );
};

export default CouponInput;
