import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Heart, UserRound } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState({});
  const { cartItems, cartTotal } = useCart();
  const { favoritesCount } = useFavorites();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const formattedCartTotal = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(cartTotal) || 0);

  const toggleMobileMenu = () => {
    setMenuOpen((current) => !current);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
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
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/images/NicemanAgroLogoGreen.png"
            alt="Niceman Agro & Farms"
            className="h-17 w-auto object-contain"
          />
        </Link>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-2.5 lg:hidden">
          <Link
            to="/cart"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-green-700"
            aria-label="Shopping Cart"
          >
            <span className="text-lg">🛒</span>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/account/dashboard"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-green transition hover:bg-green-300"
            aria-label="My Account"
            title="My Account"
          >
            <UserRound size={23} />
          </Link>

          <button
            type="button"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-green-800 cursor-pointer"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>

            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                menuOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
              aria-hidden
            >
              <Menu className="h-5 w-5" />
            </span>

            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              aria-hidden
            >
              <X className="h-5 w-5" />
            </span>
          </button>
        </div>

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
                to="/"
                className="flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-green-700"
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
          {/* <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-green-700"
            aria-label="Search"
          >
            <span className="text-lg">⌕</span>
          </button> */}

          <Link
            to="/favorites"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-red-500"
            aria-label="Favorites"
            title="Favorites"
          >
            <Heart
              size={18}
              className={favoritesCount > 0 ? "fill-red-500 text-red-500" : ""}
            />

            {favoritesCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-green-600 hover:text-green-700"
            aria-label="Shopping Cart"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-green-600 hover:text-green-700">
              <span className="text-lg">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </span>

            <span className="text-sm font-semibold text-slate-700">
              {formattedCartTotal}
            </span>
          </Link>

          {/* Customer Account */}
          <Link
            to="/account/dashboard"
            className="inline-flex h-9 w-8 shrink-0 items-center justify-center rounded-md text-green transition hover:bg-green-300"
            aria-label="My Account"
            title="My Account"
          >
            <UserRound size={25} />
          </Link>
        </div>
      </div>

      <div
        className={
          "fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white transition-transform duration-300 ease-out lg:hidden " +
          (menuOpen ? "translate-x-0 z-40" : "-translate-x-full z-40")
        }
        style={{ top: "64px" }}
      >
        <div className="h-full overflow-y-auto px-5 py-4 sm:px-8">
          <nav className="space-y-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-semibold text-green-800 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/shop"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Shop
            </Link>

            {/* <Link
              to="/categories"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Categories
            </Link> */}

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

            <Link
              to="/faq"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              FAQ
            </Link>

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
            >
              Contact
            </Link>

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

            <div className="mt-3 border-t border-slate-200 pt-3">
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                Cart
                {cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>

              <Link
                to="/favorites"
                onClick={closeMobileMenu}
                className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                Favourite
                {favoritesCount > 0 ? ` (${favoritesCount})` : ""}
              </Link>

              <Link
                to="/account/dashboard"
                onClick={closeMobileMenu}
                className="block rounded px-2 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#1A4329] hover:text-white"
              >
                My Account
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={closeMobileMenu}
          style={{ top: "64px" }}
        />
      )}
    </nav>
  );
}

export default Navbar;
