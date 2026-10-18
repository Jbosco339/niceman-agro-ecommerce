import { Link } from "react-router-dom";

const footerInfo = {
  description:
    "Quality agricultural inputs, practical farming knowledge and solutions for healthier crops and a greener future.",
  address: "145 Aka Obot Idim Road, Uyo Akwa Ibom State",
  phone: "+234 812 797 1171",
  whatsapp: "+234 812 797 1171",
  email: "support@nicemanagro.com",
  socials: {
    facebook: "#",
    x: "#",
    instagram: "#",
    youtube: "#",
  },
};

function Footer() {
  const { description, address, phone, whatsapp, email, socials } = footerInfo;

  return (
    <footer className="bg-green-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {/* Company */}
        <div className="order-4 md:order-1">
          <Link to="/" className="flex items-center">
            <img
              src="/images/NicemanAgroLogoWhite.png"
              alt="Niceman Agro & Farms"
              className="h-17 w-auto object-contain"
            />
          </Link>

          <p className="mt-3 md:mt-5 max-w-full sm:max-w-xs text-sm leading-6 text-green-100/75 wrap-break-word">
            {description}
          </p>

          <div className="mt-3 md:mt-5 flex gap-3">
            <a
              href={socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-150 hover:bg-[#1A4329]"
              aria-label="Facebook"
              title="Visit our Facebook"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.88h2.74l-.44 2.89h-2.3V21.88C18.34 21.12 22 17 22 12z" />
              </svg>
            </a>

            <a
              href={socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-150 hover:bg-[#1A4329]"
              aria-label="X (Twitter)"
              title="Visit our X profile"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M20.285 7.708a1 1 0 0 0-1.414-1.414L12 13.165 5.129 6.293A1 1 0 0 0 3.714 7.708L10.586 14.58 3.714 21.452a1 1 0 1 0 1.415 1.415L12 15.995l6.87 6.872a1 1 0 0 0 1.414-1.415L13.414 14.58l6.871-6.872z" />
              </svg>
            </a>

            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-150 hover:bg-[#1A4329]"
              aria-label="Instagram"
              title="Visit our Instagram"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 2.13a1.13 1.13 0 1 1 0 2.25a1.13 1.13 0 0 1 0-2.25ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Z" />
              </svg>
            </a>

            <a
              href={socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-150 hover:bg-[#1A4329]"
              aria-label="YouTube"
              title="Visit our YouTube channel"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M23.5 6.5c-.35-1.3-1.33-2.28-2.62-2.62C19.1 3.45 12 3.45 12 3.45s-7.1 0-8.88.43C1.83 4.22.85 5.2.5 6.5C.07 8.28.07 12 .07 12s0 3.72.43 5.5c.35 1.3 1.33 2.28 2.62 2.62C4.9 20.55 12 20.55 12 20.55s7.1 0 8.88-.43c1.29-.34 2.27-1.32 2.62-2.62C23.93 15.72 23.93 12 23.93 12s0-3.72-.43-5.5ZM9.75 15.5v-7l6.25 3.5-6.25 3.5Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className="order-1 md:order-2">
          <h3 className="text-base font-bold">Shop</h3>

          <ul className="mt-3 md:mt-5 space-y-3 text-sm text-green-100/75 wrap-break-word">
            <li>
              <Link to="/shop" className="transition hover:text-white">
                All Products
              </Link>
            </li>

            <li>
              <Link to="/categories" className="transition hover:text-white">
                Categories
              </Link>
            </li>

            <li>
              <Link to="/cart" className="transition hover:text-white">
                Shopping Cart
              </Link>
            </li>

            <li>
              <Link to="/checkout" className="transition hover:text-white">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        {/* Learn */}
        <div className="order-2 md:order-3">
          <h3 className="text-base font-bold">Learn & Grow</h3>

          <ul className="mt-3 md:mt-5 space-y-3 text-sm text-green-100/75 wrap-break-word">
            <li>
              <Link to="/blog" className="transition hover:text-white">
                Agricultural Blog
              </Link>
            </li>

            <li>
              <Link to="/faq" className="transition hover:text-white">
                Frequently Asked Questions
              </Link>
            </li>

            <li>
              <Link to="/about" className="transition hover:text-white">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/contact" className="transition hover:text-white">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/company" className="transition hover:text-white">
                Our Company
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="order-3 md:order-4">
          <h3 className="text-base font-bold">Contact Us</h3>

          <div className="mt-3 md:mt-5 space-y-3 md:space-y-4 text-sm text-green-100/75">
            <div>
              <p className="font-semibold text-white">Address</p>
              <p className="mt-1 leading-6 wrap-break-word">{address}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Phone</p>
              <p className="mt-1 wrap-break-word">{phone}</p>
              <p className="mt-1 wrap-break-word">{whatsapp}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Email</p>
              <p className="mt-1 wrap-break-word">{email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-green-100/60 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            © {new Date().getFullYear()} Niceman Agro & Farms. All rights
            reserved.
          </p>

          <div className="flex gap-5">
            <Link to="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>

            <Link to="/terms" className="transition hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
