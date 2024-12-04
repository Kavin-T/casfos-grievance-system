import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-green-200 tracking-wider uppercase">
                  Contact Us
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <p className="text-base text-green-300">
                      Central Academy for State Forest Service
                    </p>
                  </li>
                  <li>
                    <p className="text-base text-green-300">
                      Forest College Campus, Saibaba Colony, Coimbatore - 641003
                    </p>
                  </li>
                  <li>
                    <p className="text-base text-green-300">
                      Tamil Nadu, India
                    </p>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-green-200 tracking-wider uppercase">
                  Quick Links
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-green-300 hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-green-300 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-green-300 hover:text-white">
                      Courses
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-green-300 hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 xl:mt-0">
            <h3 className="text-sm font-semibold text-green-200 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-base text-green-300">
              Get the latest news and updates from CASFOS.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white focus:border-white focus:placeholder-gray-400"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full bg-green-500 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-green-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-green-700 pt-8">
          <p className="text-base text-green-400 xl:text-center">
            &copy; 2023 Central Academy for State Forest Service. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}