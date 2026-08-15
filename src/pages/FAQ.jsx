import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { id: "orders", q: "How do I place an order?", a: "Browse the shop, add items to your cart, and proceed to checkout. You'll enter your shipping details and pay securely with Paystack." },
  { id: "payment", q: "What payment methods do you accept?", a: "We accept card and bank payments through Paystack, covering most major Nigerian banks and card networks." },
  { id: "shipping", q: "How long does delivery take?", a: "Standard delivery takes 2-5 business days. Express delivery, selected at checkout, typically arrives within 1-2 business days." },
  { id: "returns", q: "Can I return an item?", a: "Yes, items can be returned within 14 days of delivery if unused and in original packaging. Contact support to start a return." },
  { id: "tracking", q: "How can I track my order?", a: "Log in to your dashboard and open My Orders. Each order shows a live status from placed through delivered." },
  { id: "coupons", q: "How do I apply a coupon?", a: "Enter your coupon code at checkout, in the payment step, before completing your order. The discount is verified and applied automatically." },
];

export default function FAQ() {
  const [openId, setOpenId] = useState("orders");

  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-10 text-center">Frequently Asked Questions</h1>

      <div className="flex flex-col">
        {faqs.map((faq) => (
          <div key={faq.id} id={faq.id} className="border-b border-line">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <span className="text-sm font-medium">{faq.q}</span>
              <ChevronDown size={16} className={`transition-transform ${openId === faq.id ? "rotate-180" : ""}`} />
            </button>
            {openId === faq.id && <p className="text-sm text-ink-soft/70 pb-5 leading-relaxed">{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
