import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Niceman Agro & Farms Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-xl text-white">
            🌱
          </div>

          <div className="leading-tight">
            <span className="block text-base font-bold text-green-900">
              Niceman Agro
            </span>

            <span className="block text-xs font-medium text-green-700">
              & Farms
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-green-800 transition hover:text-green-600"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="text-sm font-medium text-slate-700 transition hover:text-green-700"
          >
            Shop
          </Link>

          <div className="relative group">
            <Link
              to="/resources"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-green-700"
            >
              Resources
              <span className="text-xs">▼</span>
            </Link>

            {/* Resources Dropdown */}
            <div className="absolute left-0 top-full z-50 hidden w-48 pt-3 group-hover:block">
              <div className="rounded-lg bg-[#659d7d] py-2 shadow-lg">
                <Link
                  to="/blog"
                  className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative group">
              <Link
                to="/about"
                className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-green-700"
              >
                About Us
                <span className="text-xs">▼</span>
              </Link>

              {/* About Dropdown */}
              <div className="absolute left-0 top-full z-50 hidden w-64 pt-3 group-hover:block">
                <div className="rounded-lg bg-[#659d7d] py-2 shadow-lg">
                  {/* Our Company */}
                  <Link
                    to="/about/company"
                    className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                  >
                    Our Company
                  </Link>

                  {/* Governance Submenu */}
                  <div className="relative group/governance">
                    <div className="flex cursor-pointer items-center justify-between px-6 py-4 text-lg font-medium text-white hover:bg-white/10">
                      <span>Governance</span>
                      <span className="text-sm">▶</span>
                    </div>

                    {/* Governance Submenu */}
                    <div className="absolute left-full top-0 hidden w-64 pl-2 group-hover/governance:block">
                      <div className="rounded-lg bg-[#659d7d] py-2 shadow-lg">
                        <Link
                          to="/about/board-of-directors"
                          className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                        >
                          Board of Directors
                        </Link>

                        <Link
                          to="/about/management-team"
                          className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                        >
                          Management Team
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/contact"
            className="text-sm font-medium text-slate-700 transition hover:text-green-700"
          >
            Contact
          </Link>

          <div className="relative group">
            {/* Training */}
            <Link
              to="/training"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-green-700"
            >
              Training
              <span className="text-xs">▼</span>
            </Link>

            {/* Training Dropdown */}
            <div className="absolute left-0 top-full z-50 hidden w-64 pt-3 group-hover:block">
              <div className="rounded-lg bg-[#659d7d] py-2 shadow-lg">
                {/* Farmer Training */}
                <Link
                  to="/training/farmer-training"
                  className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                >
                  Farmer Training
                </Link>

                {/* Agricultural Courses + Submenu */}
                <div className="relative group/courses">
                  <div className="flex cursor-pointer items-center justify-between px-6 py-4 text-lg font-medium text-white hover:bg-white/10">
                    <span>Agricultural Courses</span>
                    <span className="text-sm">▶</span>
                  </div>

                  {/* Agricultural Courses Submenu */}
                  <div className="absolute left-full top-0 hidden w-64 pl-2 group-hover/courses:block">
                    <div className="rounded-lg bg-[#659d7d] py-2 shadow-lg">
                      <Link
                        to="/training/courses/online"
                        className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                      >
                        Online Courses
                      </Link>

                      <Link
                        to="/training/courses/in-person"
                        className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                      >
                        In-Person Training
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Workshops */}
                <Link
                  to="/training/workshops"
                  className="block px-6 py-4 text-lg font-medium text-white hover:bg-white/10"
                >
                  Workshops
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Search */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-green-700"
            aria-label="Search"
          >
            <span className="text-lg">⌕</span>
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-green-700"
            aria-label="Shopping Cart"
          >
            <span className="text-lg">🛒</span>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Customer Account */}
          <Link
            to="/login"
            className="rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-green-800 lg:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-xl">☰</span>
        </button>
      </div>
      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-slate-100 bg-white px-5 py-4 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {[
              ["Home", "/"],
              ["Shop", "/shop"],
              ["Resources", "/blog"],
              ["About Us", "/about"],
              ["Training", "/training"],
              ["Contact", "/contact"],
              ["Cart", "/cart"],
              ["My Account", "/account/dashboard"],
            ].map(([label, to]) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-700"
              >
                {label}
                {label === "Cart" && cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
