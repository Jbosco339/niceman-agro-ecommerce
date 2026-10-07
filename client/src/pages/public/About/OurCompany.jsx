import React from "react";

const OurCompany = () => {
  return (
    <main className="bg-white text-slate-800">
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center bg-green-800">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-green-200">
              About Niceman Agro & Farms
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Our Company
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
              Building a sustainable agricultural business focused on quality,
              innovation, productivity, and creating value across the
              agricultural sector.
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700">
              Who We Are
            </p>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Growing opportunities through agriculture
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              <p>
                Niceman Agro and Farms is an agricultural business committed
                to contributing to the growth and development of the
                agricultural sector.
              </p>

              <p>
                We focus on agricultural production, farming activities,
                quality products, and sustainable practices that create value
                for our customers, partners, and communities.
              </p>

              <p>
                Our approach combines practical agricultural knowledge with
                modern ideas and responsible business practices to build a
                productive and sustainable agricultural enterprise.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-green-50 p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-green-900">
              What We Stand For
            </h3>

            <div className="mt-8 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900">
                  Quality
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We strive to maintain high standards across our agricultural
                  operations and products.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  Sustainability
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We promote responsible agricultural practices that support
                  long-term productivity.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  Innovation
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We embrace better methods, ideas, and technologies that
                  improve agricultural outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Our Focus
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Creating value through agriculture
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Agricultural Production",
                text: "Developing productive farming operations with a focus on quality and efficiency.",
              },
              {
                title: "Quality Products",
                text: "Providing agricultural products that meet the needs of our customers and markets.",
              },
              {
                title: "Sustainable Growth",
                text: "Building an agricultural business designed for long-term impact and growth.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900">
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
    </main>
  );
};

export default OurCompany;