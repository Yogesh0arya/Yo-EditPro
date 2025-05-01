import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

function Navbar() {
  return (
    <header className="fixed w-full z-50 navbar-blur border-b border-gray-200 bg-white/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* <!-- Logo --> */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
            <span className="text-xl font-bold text-gray-900">Yo EditPro</span>
          </Link>

          {/* <!-- Desktop Navigation --> */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/#fasq"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/#blog"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* <!-- Login/Signup Buttons --> */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Log in
            </Link>
            <Link href="/videoEditor">
              <Button
                variant="outline"
                className="px-4 py-2 bg-indigo-600 text-white shadow-sm "
              >
                Start free trial
              </Button>
            </Link>
          </div>

          {/* <!-- Mobile menu button --> */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2 border-indigo-600"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4">
                <DropdownMenuItem>
                  <Link href="/#features">Features</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/#pricing">Pricing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/#testimonials">Testimonials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/#faq">FAQ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/#blog">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/videoEditor">Start free trial</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/">Login</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
