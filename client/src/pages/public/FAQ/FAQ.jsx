import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What agricultural products do you sell?",
    answer:
      "We provide agricultural inputs including fertilizers, seeds, herbicides, insecticides, fungicides, crop protection products, farm tools and equipment.",
  },
  {
    question: "Can I order products online?",
    answer:
      "Yes. You can browse our products, add items to your cart and proceed through checkout to place an order.",
  },
  {
    question: "Can I order without creating an account?",
    answer:
      "Yes. Guest checkout is available, so you can place an order without creating a customer account.",
  },
  {
    question: "Do you provide agricultural information?",
    answer:
      "Yes. Our agricultural knowledge section provides useful information about crops, farm management and agricultural products.",
  },
  {
    question: "How can I contact Niceman Agro & Farms?",
    answer:
      "You can contact us through our Contact Us page using the contact information provided or by sending us a message through the contact form.",
  },
  {
    question: "Do you deliver agricultural products?",
    answer:
      "Yes. Delivery options are available for eligible orders. Delivery availability, cost and estimated delivery time may depend on your location and the products ordered.",
  },
  {
    question: "How can I find a particular agricultural product?",
    answer:
      "You can browse our product categories or use the product search feature to find the agricultural product you need.",
  },
  {
    question: "Can I make bulk purchases?",
    answer:
      "Yes. Customers interested in bulk purchases can contact our team to discuss product availability, quantities and applicable pricing.",
  },
  {
    question: "Do you sell products for both small and large-scale farmers?",
    answer:
      "Yes. Our agricultural products and solutions are intended to support farmers and agricultural businesses of different sizes.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Available payment methods will be displayed during checkout. Payment options may vary depending on the customer's location and the available payment services.",
  },
  {
    question: "Can I return a product after purchase?",
    answer:
      "Our return policy depends on the type and condition of the product purchased. Please contact our support team for assistance with a return or product-related issue.",
  },
  {
    question: "How can I get agricultural advice?",
    answer:
      "You can explore our agricultural knowledge resources or contact our team for information relating to our products and agricultural solutions.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  return (
    <main className="bg-white text-slate-800">
      {/* Hero Section */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-200">
              Niceman Agro & Farms
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>

            <p className="mt-6 text-lg leading-8 text-green-50">
              Find answers to some of the most common questions about our
              products, services, ordering process, and agricultural solutions.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            FAQ
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Here are answers to some of the questions our customers commonly
            ask.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-green-50"
                >
                  <span className="text-base font-semibold text-slate-900 sm:text-lg">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl font-medium text-green-800 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-200 px-6 py-5">
                    <p className="leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Still have questions?
          </h2>

          <p className="mt-4 leading-7 text-green-50">
            If you cannot find the answer you are looking for, feel free to
            contact our team.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-green-800 transition hover:bg-green-50"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
};

export default FAQ;
