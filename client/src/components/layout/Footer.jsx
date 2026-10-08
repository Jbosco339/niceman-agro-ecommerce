import { Link } from "react-router-dom";
import useWebsiteContent from "../../hooks/useWebsiteContent";

function Footer() {
  const { content } = useWebsiteContent();

  const footer = content?.footer || {};
  const contact = content?.contact || {};

  return (
    <footer className="bg-green-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {/* Company */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-green-800">
              🌱
            </div>

            <div className="leading-tight">
              <span className="block text-lg font-bold">Niceman Agro</span>

              <span className="block text-xs text-green-200">& Farms</span>
            </div>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-6 text-green-100/75">
            {footer.description ||
              "Quality agricultural inputs, practical farming knowledge and solutions for healthier crops and a greener future."}
          </p>

          <div className="mt-5 flex gap-3">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm transition hover:bg-white hover:text-green-900"
              aria-label="Facebook"
            >
              f
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm transition hover:bg-white hover:text-green-900"
              aria-label="Instagram"
            >
              ◎
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm transition hover:bg-white hover:text-green-900"
              aria-label="WhatsApp"
            >
              W
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-base font-bold">Shop</h3>

          <ul className="mt-5 space-y-3 text-sm text-green-100/75">
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

            <li>
              <Link to="/orders" className="transition hover:text-white">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Learn */}
        <div>
          <h3 className="text-base font-bold">Learn & Grow</h3>

          <ul className="mt-5 space-y-3 text-sm text-green-100/75">
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
        <div>
          <h3 className="text-base font-bold">Contact Us</h3>

          <div className="mt-5 space-y-4 text-sm text-green-100/75">
            <div>
              <p className="font-semibold text-white">Address</p>
              <p className="mt-1 leading-6">{contact.address || "Nigeria"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Phone</p>
              <p className="mt-1">{contact.phone || "+234 000 000 0000"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Email</p>
              <p className="mt-1">{contact.email || "info@nicemanagro.com"}</p>
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
