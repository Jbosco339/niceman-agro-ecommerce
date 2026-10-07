import React from "react";
import { Link } from "react-router-dom";

const Workshops = () => {
  const workshops = [
    {
      title: "Modern Farming Practices",
      description:
        "Learn practical and improved farming techniques that can help farmers increase productivity and manage farm operations more effectively.",
    },
    {
      title: "Crop Protection Workshop",
      description:
        "Understand common crop pests and diseases and learn responsible approaches to crop protection and management.",
    },
    {
      title: "Agribusiness Workshop",
      description:
        "Develop useful knowledge about managing agricultural activities as a business, from planning to marketing.",
    },
    {
      title: "Farm Management Workshop",
      description:
        "Learn practical approaches to planning farm activities, managing resources, keeping records, and improving farm operations.",
    },
    {
      title: "Soil Management Workshop",
      description:
        "Gain practical knowledge about soil health, soil preparation, fertility management, and sustainable farming practices.",
    },
    {
      title: "Post-Harvest Management",
      description:
        "Learn techniques that can help reduce post-harvest losses and improve the handling, storage, and preservation of farm produce.",
    },
  ];

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
              Workshops
            </h1>

            <p className="mt-6 text-lg leading-8 text-green-50">
              Practical agricultural workshops designed to provide useful
              knowledge, skills, and insights for farmers and agricultural
              professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Practical Learning
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Learn, develop, and grow
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            Our workshops are designed to provide participants with practical
            agricultural knowledge that can be applied in real farming and
            agribusiness situations.
          </p>

          <p className="mt-5 leading-8 text-slate-600">
            Through interactive sessions, demonstrations, discussions, and
            practical guidance, participants can gain a better understanding
            of important agricultural practices and business opportunities.
          </p>
        </div>
      </section>

      {/* Workshop Areas */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Workshop Areas
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Explore our workshops
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workshops.map((workshop) => (
              <div
                key={workshop.title}
                className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-800">
                  +
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {workshop.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {workshop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Attend */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Who Can Attend?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Workshops for agricultural learners and professionals
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Our workshops can be useful for farmers, aspiring farmers,
              agricultural students, agribusiness owners, agricultural
              professionals, and anyone interested in developing practical
              agricultural knowledge.
            </p>
          </div>

          <div className="rounded-3xl bg-green-50 p-8 lg:p-10">
            <ul className="space-y-5">
              {[
                "Small and large-scale farmers",
                "Agricultural students",
                "Agribusiness owners",
                "Agricultural professionals",
                "New and aspiring farmers",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                    ✓
                  </span>

                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Interested in our workshops?
          </h2>

          <p className="mt-4 leading-7 text-green-50">
            Contact Niceman Agro & Farms to learn more about upcoming
            agricultural workshops and training opportunities.
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

export default Workshops;