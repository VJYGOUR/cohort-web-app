import React, { useState } from "react";
import axios from "../axios/axios"; // your configured instance
import { isAxiosError } from "axios"; // <- correct import
import type { AxiosError } from "axios";

interface PaymentButtonProps {
  enrollmentId: string;
}

interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ enrollmentId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post<RazorpayOrderResponse>(
        "/payments/create-order",
        { enrollmentId }
      );

      const { orderId, amount, currency, keyId } = data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options: RazorpayOptions = {
          key: keyId,
          amount,
          currency,
          name: "MERN Cohort App",
          description: "Cohort Payment",
          order_id: orderId,
          handler: (response: RazorpayHandlerResponse) => {
            alert("Payment successful! Verification will happen next.");
            console.log("Payment response:", response);
          },
          prefill: { name: "", email: "" },
          theme: { color: "#2563EB" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        setError("Failed to load Razorpay script. Try again.");
      };
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`mt-2 px-4 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Loading..." : "Pay Now"}
      </button>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PaymentButton;
