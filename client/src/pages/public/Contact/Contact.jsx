
const Contact = () => {
  return (
    <main className="bg-white text-slate-800">
      {/* Hero */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-200">
              Niceman Agro & Farms
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>

            <p className="mt-6 text-lg leading-8 text-green-50">
              Have a question, enquiry, or business opportunity? We would love
              to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Contact Information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Get In Touch
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              We are here to help
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Whether you want to learn more about our agricultural products,
              discuss a partnership, make an enquiry, or simply get in touch
              with our team, feel free to contact us.
            </p>

            <div className="mt-10 space-y-7">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                  📍
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">Our Location</h3>
                  <p className="mt-1 text-slate-600">
                    Niceman Agro & Farms
                    <br />
                    145 Aka Obot Idim Road, Uyo Akwa Ibom State
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                  ☎
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">Phone</h3>
                  <a
                    href="tel:+234 812 797 1171"
                    className="mt-1 block text-slate-600 hover:text-green-700"
                  >
                    +234 812 797 1171
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                  ✉
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <a
                    href="mailto:info@nicemanagroandfarms.com"
                    className="mt-1 block text-slate-600 hover:text-green-700"
                  >
                    info@nicemanagroandfarms.com
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                  🕒
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">Business Hours</h3>
                  <p className="mt-1 text-slate-600">
                    Monday – Friday: 8:00 AM – 8:00 PM
                    <br />
                    Saturday: 9:00 AM – 7:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl bg-slate-50 p-8 shadow-sm lg:p-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Send Us a Message
            </h2>

            <p className="mt-2 text-slate-600">
              Fill out the form below and our team will get back to you.
            </p>

            <form className="mt-8 space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="What is your enquiry about?"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-800">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Let's grow together
          </h2>

          <p className="mt-4 leading-7 text-green-50">
            We welcome opportunities to connect with customers, partners,
            investors, and other stakeholders who share our vision for
            sustainable agriculture.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Contact;