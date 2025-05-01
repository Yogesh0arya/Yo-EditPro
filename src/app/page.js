"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Footer from "@/components/Footer";
import Features from "@/data/Features";
import { useState } from "react";
import Image from "next/image";

function HomePage() {
  const [moreFeatures, setMoreFeatures] = useState({
    value: 6,
    open: false,
  });

  return (
    <main>
      {/* <!-- Hero Section --> */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Professional Video Editing{" "}
                <span className="text-transparent bg-clip-text hero-gradient">
                  Made Simple
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Create stunning videos in minutes, not hours. Our online-based
                platform gives you professional editing tools without the
                learning curve. '
              </p>
              <div className="mt-8 flex space-x-4">
                <Link href="/videoEditor" className="inline-flex">
                  <Button className="px-6 py-6">Get started for free</Button>
                </Link>
                <Link href="/videoEditor" className="inline-flex">
                  <Button variant="outline" className="px-6 py-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Watch demo
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-14 w-18 rounded-full ring-2 ring-white"
                    src="/person1.jpg"
                    alt="User avatar"
                  />
                  <img
                    className="inline-block h-14 w-18 rounded-full ring-2 ring-white"
                    src="/person2.jpg"
                    alt="User avatar"
                  />
                  <img
                    className="inline-block h-14 w-18 rounded-full ring-2 ring-white"
                    src="/person3.jpg"
                    alt="User avatar"
                  />
                  <img
                    className="inline-block h-14 w-18 rounded-full ring-2 ring-white"
                    src="/person1.jpg"
                    alt="User avatar"
                  />
                </div>
                <p className="ml-4 text-sm text-gray-700">
                  <span className="font-medium text-indigo-600">4,000+</span>{" "}
                  creators trust{" "}
                  <span className="flex flex-nowrap">Yo EditPro</span>
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  width={500}
                  height={500}
                  className="w-full"
                  src="/person1.jpg"
                  alt="Video editing interface"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="flex items-center space-x-4 text-white">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <div className="flex-1">
                      <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-1/3 rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">1:23 / 3:45</span>
                  </div>
                </div>
              </div>
              {/* <!-- Decorative elements --> */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full opacity-70 blur-2xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-100 rounded-full opacity-70 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Features Section --> */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Powerful editing made easy
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              All the tools you need to create professional videos without the
              complicated software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Features.slice(0, moreFeatures.value).map((feature, i) => (
              <Card
                key={i}
                className="cursor-pointer transition-all duration-150 hover:shadow-md hover:bg-blue-50"
              >
                <CardHeader>
                  <CardTitle>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {feature.path}
                      </svg>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.desc}
                    </h3>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.content}</p>
                </CardContent>
                {!feature.isPresent && (
                  <CardFooter>
                    <p>Comming soon...</p>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
          {!moreFeatures.open ? (
            <p
              className="cursor-pointer mt-4 flex gap-2 items-center justify-center mx-auto w-fit"
              onClick={() => setMoreFeatures({ value: 100, open: true })}
            >
              View More
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M19 9L14 14.1599C13.7429 14.4323 13.4329 14.6493 13.089 14.7976C12.7451 14.9459 12.3745 15.0225 12 15.0225C11.6255 15.0225 11.2549 14.9459 10.9109 14.7976C10.567 14.6493 10.2571 14.4323 10 14.1599L5 9"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </p>
          ) : (
            <p
              className="cursor-pointer mt-4 flex gap-2 items-center justify-center mx-auto w-fit"
              onClick={() => setMoreFeatures({ value: 6, open: false })}
            >
              View less
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M5 15L10 9.84985C10.2563 9.57616 10.566 9.35814 10.9101 9.20898C11.2541 9.05983 11.625 8.98291 12 8.98291C12.375 8.98291 12.7459 9.05983 13.0899 9.20898C13.434 9.35814 13.7437 9.57616 14 9.84985L19 15"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </p>
          )}
        </div>
      </section>

      {/* <!-- Pricing Section --> */}
      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that fits your needs. Paid plans include a 14-day
              free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* <!-- Basic Plan --> */}
            <Card className="hover:shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Basic</h3>
                <CardDescription>
                  <p className="mt-2 text-sm text-gray-600">
                    Perfect for beginners and casual creators
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">$0</span>
                    <span className="ml-1 text-gray-600">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      720p video exports
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      Access all features
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">Basic templates</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">Standard support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  className="w-full shadow-sm hover:shadow-md cursor-pointer"
                  variant="outline"
                >
                  Start free
                </Button>
                {/* </Link> */}
              </CardFooter>
            </Card>

            {/* <!-- Pro Plan --> */}
            <Card className=" relative transform scale-105 overflow-hidden shadow-md hover:shadow-lg">
              <div className="absolute top-0 inset-x-0 h-2 bg-indigo-600"></div>

              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle>
                  <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                </CardTitle>
                <CardDescription>
                  <p className="mt-2 text-sm text-gray-600">
                    For serious content creators
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      $19
                    </span>
                    <span className="ml-1 text-gray-600">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      1080p video exports
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      50GB cloud storage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      Premium templates
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      Team collaboration
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full shadow-sm text-white bg-indigo-600"
                >
                  Start free trial
                </Button>
              </CardFooter>
            </Card>

            {/* <!-- Business Plan --> */}
            <Card className="hover:shadow-md">
              <CardHeader>
                <CardTitle>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Business
                  </h3>
                </CardTitle>
                <CardDescription>
                  <p className="mt-2 text-sm text-gray-600">
                    For professional teams and studios
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      $49
                    </span>
                    <span className="ml-1 text-gray-600">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">4K video exports</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      Unlimited storage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      All templates & effects
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      24/7 dedicated support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">
                      Advanced analytics
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full hover:shadow-md">
                  Start free trial
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* <!-- Testimonials Section --> */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Loved by creators worldwide
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Here is what our users have to say about their experience with
              EditPro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* <!-- Testimonial 1 --> */}
            <Card className="bg-gray-50 rounded-xl">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="text-yellow-400 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </CardTitle>
                <CardDescription>
                  <p className="text-gray-700 mb-4 text-base">
                    &quot;Yo EditPro has completely transformed my workflow.
                    What used to take me hours now takes minutes. This online
                    editing platform is nothing short of revolutionary.&quot;
                  </p>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center mt-auto">
                <Image
                  width={500}
                  height={500}
                  className="h-10 w-10 rounded-full"
                  src="/person2.jpg"
                  alt="User avatar"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Sarah Johnson
                  </h3>
                  <p className="text-sm text-gray-500">YouTube Creator</p>
                </div>
              </CardFooter>
            </Card>

            {/* <!-- Testimonial 2 --> */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(4)].map((_, i) => (
                      <svg
                        key={i}
                        className="text-yellow-400 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg
                      className="text-yellow-400 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </CardTitle>
                <CardDescription>
                  <p className="text-gray-700 mb-4 text-base">
                    &quot;As someone with no formal editing training, Yo EditPro
                    has been a game-changer. The intuitive interface and smart
                    templates help me create professional-quality videos in no
                    time.&quot;
                  </p>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center mt-auto">
                <Image
                  width={500}
                  height={500}
                  className="h-10 w-10 rounded-full"
                  src="/person3.jpg"
                  alt="User avatar"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Michael Chen
                  </h3>
                  <p className="text-sm text-gray-500">Content Creator</p>
                </div>
              </CardFooter>
            </Card>

            {/* <!-- Testimonial 3 --> */}
            <Card className="bg-gray-50 rounded-xl">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="text-yellow-400 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </CardTitle>
                <CardDescription>
                  <p className="text-gray-700 mb-4 text-base">
                    &quot;Our marketing team has increased video output by 300%
                    since switching to Yo EditPro. All the features are
                    particularly impressive.&quot;
                  </p>
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex items-center mt-auto">
                <Image
                  width={500}
                  height={500}
                  className="h-10 w-10 rounded-full"
                  src="/person1.jpg"
                  alt="User avatar"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Emily Rodriguez
                  </h3>
                  <p className="text-sm text-gray-500">Marketing Director</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default HomePage;
