import React, { useState } from "react";
import axios from "../axios/axios";
import { isAxiosError } from "axios";
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
  const [success, setSuccess] = useState<string>("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1️⃣ Create Razorpay order (backend)
      const { data } = await axios.post<RazorpayOrderResponse>(
        "/payments/create-order",
        { enrollmentId }
      );

      const { orderId, amount, currency, keyId } = data;

      // 2️⃣ Load Razorpay checkout script
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

          // 3️⃣ Razorpay success callback
          handler: async (response: RazorpayHandlerResponse) => {
            try {
              // 4️⃣ VERIFY PAYMENT (CRITICAL STEP)
              await axios.post("/payments/verify", {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });

              setSuccess("✅ Payment verified successfully!");
            } catch (verifyErr) {
              if (isAxiosError(verifyErr)) {
                const axiosError = verifyErr as AxiosError<{ message: string }>;

                setError(
                  axiosError.response?.data?.message ||
                    "Payment verification failed on server."
                );
              } else {
                setError(
                  "Payment received but verification failed. Contact support."
                );
              }
            }
          },

          prefill: {
            name: "",
            email: "",
          },

          theme: {
            color: "#2563EB",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        setError("Failed to load Razorpay script.");
      };
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || "Payment failed");
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
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
    </div>
  );
};

export default PaymentButton;
