import React from "react";
import { Link } from "react-router-dom";

const InPersonTraining = () => {
  return (
    <main className="bg-white text-slate-800">
      {/* Hero */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-200">
            Niceman Agro & Farms
          </p>

          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            In-Person Training
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
            Practical agricultural training designed to give participants
            hands-on knowledge and experience.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Practical Experience
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Learn through practical training
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            Our in-person training programs provide participants with
            opportunities to gain practical agricultural knowledge through
            guided instruction, demonstrations, and hands-on activities.
          </p>
        </div>

        {/* Training Features */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Practical Sessions",
              text: "Gain practical knowledge through demonstrations and guided activities.",
            },
            {
              title: "Expert Guidance",
              text: "Learn from instructors with practical agricultural experience.",
            },
            {
              title: "Field Knowledge",
              text: "Understand how agricultural principles can be applied in real situations.",
            },
            {
              title: "Interactive Learning",
              text: "Ask questions, participate in discussions, and learn with others.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-slate-50 p-7"
            >
              <h3 className="text-xl font-bold text-green-800">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Training Areas */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Training Areas
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Crop Production",
              "Farm Management",
              "Crop Protection",
              "Soil Management",
              "Agribusiness",
              "Post-Harvest Management",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white px-6 py-5 font-semibold text-slate-800 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Interested in practical training?
          </h2>

          <p className="mt-4 leading-7 text-green-50">
            Contact our team to find out more about our in-person agricultural
            training opportunities.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-green-800 hover:bg-green-50"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
};

export default InPersonTraining;