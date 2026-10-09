import { Link } from "react-router-dom";
import useWebsiteContent from "../../hooks/useWebsiteContent";

function Footer() {
  const { content } = useWebsiteContent();

  const footer = content?.footer || {};
  const contact = content?.contact || {};
  const socials = footer?.socials || {};
  const facebookUrl = socials.facebook || footer.facebook || null;
  const twitterUrl = socials.x || socials.twitter || footer.twitter || null;
  const instagramUrl = socials.instagram || footer.instagram || null;

  return (
    <footer className="bg-green-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {/* Company */}
        <div>
          <Link to="/" className="flex items-center">
            <img
              src="/images/NicemanAgroLogoWhite.png"
              alt="Niceman Agro & Farms"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-6 text-green-100/75">
            {footer.description ||
              "Quality agricultural inputs, practical farming knowledge and solutions for healthier crops and a greener future."}
          </p>

          <div className="mt-5 flex gap-3">
            <a
              href={facebookUrl || "#"}
              target={facebookUrl ? "_blank" : undefined}
              rel={facebookUrl ? "noopener noreferrer" : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-150 hover:bg-[#1A4329]"
              aria-label={
                facebookUrl ? "Facebook" : "Facebook (placeholder - update URL)"
              }
              data-placeholder={
                !facebookUrl ? "MISSING_FACEBOOK_URL" : undefined
              }
              title={
                facebookUrl
                  ? "Visit our Facebook"
                  : "Update footer.socials.facebook with URL"
              }
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
              href={twitterUrl || "#"}
              target={twitterUrl ? "_blank" : undefined}
              rel={twitterUrl ? "noopener noreferrer" : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-150 hover:bg-[#1A4329]"
              aria-label={
                twitterUrl ? "X (Twitter)" : "X (placeholder - update URL)"
              }
              data-placeholder={!twitterUrl ? "MISSING_X_URL" : undefined}
              title={
                twitterUrl
                  ? "Visit our X profile"
                  : "Update footer.socials.x with URL"
              }
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
              href={instagramUrl || "#"}
              target={instagramUrl ? "_blank" : undefined}
              rel={instagramUrl ? "noopener noreferrer" : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-150 hover:bg-[#1A4329]"
              aria-label={
                instagramUrl
                  ? "Instagram"
                  : "Instagram (placeholder - update URL)"
              }
              data-placeholder={
                !instagramUrl ? "MISSING_INSTAGRAM_URL" : undefined
              }
              title={
                instagramUrl
                  ? "Visit our Instagram"
                  : "Update footer.socials.instagram with URL"
              }
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 0010.5 13 4.5 4.5 0 0012 16.5 4.5 4.5 0 0015.5 13 4.5 4.5 0 0012 8.5zM17.5 6a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
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

            {/* <li>
              <Link to="/orders" className="transition hover:text-white">
                Track Order
              </Link>
            </li> */}
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
