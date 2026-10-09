import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useReviews from "../../hooks/useReviews";

const emptyForm = {
  customer: "",
  rating: 5,
  review: "",
};

export default function WriteReview() {
  const { addReview } = useReviews();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const remainingChars = 400 - form.review.length;

  const reviewHint = useMemo(() => {
    if (form.review.trim().length === 0)
      return "Tell us about your overall experience with shopping, service, and delivery.";
    if (form.review.trim().length < 20)
      return "Add a little more detail so other customers understand your experience.";
    if (form.review.trim().length > 350)
      return "Your review is a bit long. Consider shortening it to keep it clear and helpful.";
    return "Looks good for a helpful customer review.";
  }, [form.review]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const customerName = form.customer.trim();
    const reviewText = form.review.trim();

    if (!customerName) {
      setError("Please enter your name before submitting your review.");
      return;
    }

    if (!reviewText) {
      setError("Please share your feedback in the review box.");
      return;
    }

    if (reviewText.length < 20) {
      setError(
        "Please write at least 20 characters so the review is helpful and clear.",
      );
      return;
    }

    if (reviewText.length > 400) {
      setError("Please keep your review under 400 characters.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    addReview({
      type: "general",
      customer: customerName,
      rating: Number(form.rating),
      review: reviewText,
      status: "Pending",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    setSuccess(
      "Thank you! Your review has been submitted and is awaiting approval before it appears publicly.",
    );
    setForm(emptyForm);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-green-950">
            Share Your Experience
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            We value your feedback about shopping with Niceman Agro & Farms, our
            service, and your delivery experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="customer"
              className="block text-sm font-medium text-gray-700"
            >
              Your name
            </label>
            <input
              id="customer"
              name="customer"
              type="text"
              value={form.customer}
              onChange={handleChange}
              placeholder="Enter your display name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your rating
            </label>
            <div className="mt-2 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, rating: star }))
                  }
                  className={`text-2xl transition ${
                    star <= form.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  aria-label={`Rate ${star} out of 5`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700"
            >
              Your feedback
            </label>
            <textarea
              id="review"
              name="review"
              rows={6}
              maxLength={400}
              value={form.review}
              onChange={handleChange}
              placeholder="Tell us about your overall experience with our products, ordering process, customer service, and delivery."
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
            />
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-500">
              <span>{reviewHint}</span>
              <span>{remainingChars} chars left</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Return Home
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-500"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
