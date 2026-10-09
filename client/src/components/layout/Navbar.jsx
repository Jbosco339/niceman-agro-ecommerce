import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState({});
  const { cartItems, cartTotal } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const formattedCartTotal = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(cartTotal) || 0);

  const { favoritesCount } = useFavorites();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((current) => !current);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileSubmenu = (submenuId) => {
    setMobileSubmenuOpen((current) => ({
      ...current,
      [submenuId]: !current[submenuId],
    }));
  };

  return (
    <nav className="bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
          aria-label="Niceman Agro & Farms Home"
        >
          <img
            src="/images/NicemanAgroLogoGreen.png"
            alt="Niceman Agro & Farms"
            className="h-8 w-auto object-contain sm:h-10 lg:h-12"
          />
        </Link>
        {/* Desktop Navigation (visible on lg) */}
        <div className="hidden items-center gap-7 lg:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-green-800 transition-colors duration-200 hover:text-green-700"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-green-700"
          >
            Shop
          </Link>

          <div className="relative group">
            <Link
              to="/blog"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-green-700"
            >
              Resources
              <span className="text-xs">▼</span>
            </Link>

            {/* Resources Dropdown */}
            <div className="absolute left-0 top-full z-50 hidden w-48 pt-2 group-hover:block">
              <div className="rounded-md bg-[#1A4329] py-1 shadow-lg">
                <Link
                  to="/blog"
                  className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
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
                className="flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-green-700"
              >
                About Us
                <span className="text-xs">▼</span>
              </Link>

              {/* About Dropdown */}
              <div className="absolute left-0 top-full z-50 hidden w-64 pt-2 group-hover:block">
                <div className="rounded-md bg-[#1A4329] py-1 shadow-lg">
                  {/* Our Company */}
                  <Link
                    to="/about/company"
                    className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
                  >
                    Our Company
                  </Link>

                  {/* Governance Submenu */}
                  <div className="relative group/governance">
                    <div className="flex cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]">
                      <span>Governance</span>
                      <span className="text-sm">▶</span>
                    </div>

                    {/* Governance Submenu */}
                    <div className="absolute left-full top-0 hidden w-64 pl-2 group-hover/governance:block">
                      <div className="rounded-md bg-[#1A4329] py-1 shadow-lg">
                        <Link
                          to="/about/board-of-directors"
                          className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
                        >
                          Board of Directors
                        </Link>

                        <Link
                          to="/about/management-team"
                          className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
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
            className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-green-700"
          >
            Contact
          </Link>

          <div className="relative group">
            {/* Training */}
            <Link
              to="/training"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-green-700"
            >
              Training
              <span className="text-xs">▼</span>
            </Link>

            {/* Training Dropdown */}
            <div className="absolute left-0 top-full z-50 hidden w-64 pt-2 group-hover:block">
              <div className="rounded-md bg-[#1A4329] py-1 shadow-lg">
                {/* Farmer Training */}
                <Link
                  to="/training/farmer-training"
                  className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
                >
                  Farmer Training
                </Link>

                {/* Agricultural Courses + Submenu */}
                <div className="relative group/courses">
                  <div className="flex cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]">
                    <span>Agricultural Courses</span>
                    <span className="text-sm">▶</span>
                  </div>

                  {/* Agricultural Courses Submenu */}
                  <div className="absolute left-full top-0 hidden w-64 pl-2 group-hover/courses:block">
                    <div className="rounded-md bg-[#1A4329] py-1 shadow-lg">
                      <Link
                        to="/training/courses/online"
                        className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
                      >
                        Online Courses
                      </Link>

                      <Link
                        to="/training/courses/in-person"
                        className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
                      >
                        In-Person Training
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Workshops */}
                <Link
                  to="/training/workshops"
                  className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-150 hover:bg-[#123320]"
                >
                  Workshops
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 transition hover:border-green-600 hover:text-green-700"
            aria-label="Cart"
            title="Cart"
          >
            <span className="text-lg">🛒</span>

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* cart amount for mobile view */}

          {/* <span className="ml-1 text-sm font-semibold text-slate-700 truncate max-w-22.5">
            {formattedCartTotal}
          </span> */}

          <Link
            to="/login"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-green-700"
            aria-label="Login"
            title="Login"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
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

          <span className="ml-1 text-sm font-semibold text-slate-700">
            {formattedCartTotal}
          </span>

          {/* Favorites */}
          <Link
            to="/favorites"
            className="relative ml-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-green-700"
            aria-label="Favorites"
          >
            <span className="text-lg">❤</span>

            {favoritesCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>
          {/* Customer Account */}
          <Link
            to="/login"
            className="rounded-md bg-green-700 px-2.5 py-2 text-sm font-semibold text-white transition hover:bg-green-800 flex items-center justify-center"
            aria-label="Login"
            title="Login"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="relative flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-green-800 lg:hidden"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          <span className="sr-only">
            {mobileMenuOpen ? "Close menu" : "Open menu"}
          </span>

          {/* Hamburger (visible when closed) */}
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
              mobileMenuOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
            }`}
            aria-hidden
          >
            <span className="text-xl">☰</span>
          </span>

          {/* X (visible when open) */}
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
              mobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            aria-hidden
          >
            <span className="text-xl">✕</span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation Menu - Slides in from left */}
      <div
        className={
          "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 lg:hidden transition-transform duration-300 ease-out transform " +
          (mobileMenuOpen ? "translate-x-0 z-40" : "-translate-x-full z-40")
        }
        style={{ top: "64px" }}
      >
        <div className="overflow-y-auto h-full px-5 py-4 sm:px-8">
          <nav className="space-y-2">
            {/* Home */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-semibold text-green-800 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Home
            </Link>

            {/* Shop */}
            <Link
              to="/shop"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Shop
            </Link>

            {/* Categories */}
            <Link
              to="/categories"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Categories
            </Link>

            {/* Resources (parent with submenu) */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileSubmenu("resources")}
                className="flex w-full items-center justify-between rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                Resources
                <span
                  className={`text-xs transition-transform ${
                    mobileSubmenuOpen.resources ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* Resources Submenu */}
              {mobileSubmenuOpen.resources && (
                <div className="space-y-1 border-l-2 border-green-200 pl-4">
                  <Link
                    to="/blog"
                    onClick={closeMobileMenu}
                    className="block rounded px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                  >
                    Blog
                  </Link>
                </div>
              )}
            </div>

            {/* About Us (parent with submenu) */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileSubmenu("about")}
                className="flex w-full items-center justify-between rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                About Us
                <span
                  className={`text-xs transition-transform ${
                    mobileSubmenuOpen.about ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* About Submenu with smooth collapse */}
              <div
                className="overflow-hidden border-l-2 border-green-200 pl-4 transition-all duration-200"
                style={{
                  maxHeight: mobileSubmenuOpen.about ? "1000px" : "0px",
                }}
              >
                <div className="space-y-1 py-2">
                  <Link
                    to="/about/company"
                    onClick={closeMobileMenu}
                    className="block rounded px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                  >
                    Our Company
                  </Link>

                  {/* Governance (nested submenu) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleMobileSubmenu("governance")}
                      className="flex w-full items-center justify-between rounded px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                    >
                      Governance
                      <span
                        className={`text-[10px] transition-transform ${
                          mobileSubmenuOpen.governance ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                    </button>

                    {/* Governance Sub-submenu with smooth collapse */}
                    <div
                      className="overflow-hidden border-l-2 border-green-100 pl-4 transition-all duration-200"
                      style={{
                        maxHeight: mobileSubmenuOpen.governance
                          ? "600px"
                          : "0px",
                      }}
                    >
                      <div className="space-y-1 py-2">
                        <Link
                          to="/about/board-of-directors"
                          onClick={closeMobileMenu}
                          className="block rounded px-2 py-2 text-[11px] font-medium text-slate-500 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                        >
                          Board of Directors
                        </Link>

                        <Link
                          to="/about/management-team"
                          onClick={closeMobileMenu}
                          className="block rounded px-2 py-2 text-[11px] font-medium text-slate-500 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                        >
                          Management Team
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <Link
              to="/faq"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              FAQ
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Contact
            </Link>

            {/* Training (parent with submenu) */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileSubmenu("training")}
                className="flex w-full items-center justify-between rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                Training
                <span
                  className={`text-xs transition-transform ${
                    mobileSubmenuOpen.training ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* Training submenu with smooth collapse */}
              <div
                className="overflow-hidden border-l-2 border-green-200 pl-4 transition-all duration-200"
                style={{
                  maxHeight: mobileSubmenuOpen.training ? "1000px" : "0px",
                }}
              >
                <div className="space-y-1 py-2">
                  <Link
                    to="/training/farmer-training"
                    onClick={closeMobileMenu}
                    className="block rounded px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                  >
                    Farmer Training
                  </Link>

                  {/* Agricultural Courses (nested submenu) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleMobileSubmenu("courses")}
                      className="flex w-full items-center justify-between rounded px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                    >
                      Agricultural Courses
                      <span
                        className={`text-[10px] transition-transform ${
                          mobileSubmenuOpen.courses ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                    </button>

                    {/* Agricultural Courses Sub-submenu with smooth collapse */}
                    <div
                      className="overflow-hidden border-l-2 border-green-100 pl-4 transition-all duration-200"
                      style={{
                        maxHeight: mobileSubmenuOpen.courses ? "600px" : "0px",
                      }}
                    >
                      <div className="space-y-1 py-2">
                        <Link
                          to="/training/courses/online"
                          onClick={closeMobileMenu}
                          className="block rounded px-2 py-2 text-[11px] font-medium text-slate-500 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                        >
                          Online Courses
                        </Link>

                        <Link
                          to="/training/courses/in-person"
                          onClick={closeMobileMenu}
                          className="block rounded px-2 py-2 text-[11px] font-medium text-slate-500 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                        >
                          In-Person Training
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/training/workshops"
                    onClick={closeMobileMenu}
                    className="block rounded px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
                  >
                    Workshops
                  </Link>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-3 border-t border-slate-200 pt-3">
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                Cart
              </Link>

              <Link
                to="/favorites"
                onClick={closeMobileMenu}
                className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                Favorites
              </Link>

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={closeMobileMenu}
          style={{ top: "64px" }}
        />
      )}
    </nav>
  );
}

export default Navbar;
