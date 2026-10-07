import React from "react";
import { Link } from "react-router-dom";

const FarmerTraining = () => {
  return (
    <main className="bg-white text-slate-800">
      {/* Hero */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-200">
            Niceman Agro & Farms
          </p>

          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Farmer Training
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
            Practical agricultural training designed to help farmers improve
            productivity, adopt better farming practices, and manage their
            farms more effectively.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Empowering Farmers
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Building stronger and more productive farms
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            Our farmer training programs provide practical knowledge that can
            help farmers make informed decisions throughout the farming
            process.
          </p>

          <p className="mt-5 leading-8 text-slate-600">
            From crop selection and soil preparation to crop protection,
            harvesting, and farm management, our training focuses on useful
            agricultural practices that farmers can apply in their daily
            operations.
          </p>
        </div>
      </section>

      {/* Training Areas */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Areas of Training
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Crop Production",
                text: "Learn practical approaches to crop production and farm planning.",
              },
              {
                title: "Crop Protection",
                text: "Understand responsible approaches to protecting crops from pests and diseases.",
              },
              {
                title: "Farm Management",
                text: "Develop better skills for managing farm activities, resources, and operations.",
              },
              {
                title: "Soil Management",
                text: "Learn the importance of healthy soil and effective soil management practices.",
              },
              {
                title: "Harvest Management",
                text: "Understand practices that can help improve harvesting and post-harvest handling.",
              },
              {
                title: "Agribusiness",
                text: "Gain useful knowledge about managing agricultural activities as a business.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-7 shadow-sm"
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
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Interested in farmer training?
          </h2>

          <p className="mt-4 leading-7 text-green-50">
            Contact our team to learn more about available agricultural
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

export default FarmerTraining;