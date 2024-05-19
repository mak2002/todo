"use client";
import React, { useState } from "react";
import Link from "next/link";
import Button from "../components/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="border-b-2 border-gray-900 p-4  flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-black text-2xl font-medium">
          Leo
        </Link>
      </div>

      {/* Hamburger menu button for mobile */}
      <button
        className="block sm:hidden text-3xl focus:outline-none text-gray-900"
        onClick={toggleMenu}
      >
        ☰
      </button>

      {/* Menu items */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row sm:justify-center sm:w-full items-center space-y-2 sm:space-y-0 sm:space-x-4`}
      >
        <Link href="/">
          <p className="btn btn-outline text-lg border-2 rounded-3xl border-black text-gray-900">Today 📅</p>
        </Link>
        <Link href="/challenges">
          <p className="btn btn-outline text-lg border-2  rounded-3xl border-black text-gray-900">Challenges 🎯</p>
        </Link>
        {/* <Link href="/create" className="btn btn-outline  rounded-3xl border-2 border-black text-lg text-gray-900">
          Create 🎨
        </Link> */}
        {/* <Link href="/progress">
          <p className="btn btn-outline text-lg border-2  rounded-3xl border-black text-gray-900">Progress 📈</p>
        </Link> */}
         <Link href="/browsechallenges">
          <p className="btn btn-outline text-lg border-2  rounded-3xl border-black text-gray-900">Browse Challenges 📈</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
