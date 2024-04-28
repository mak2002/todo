import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-purple-600 p-1 flex items-center w-full">
      <div className="">
        <Link href="/" className="text-white">
          MyBestVersion 💪
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex items-center justify-center h-12 gap-10 w-full">
          <div className="flex justify-center items-center space-x-4">
            <Link href="/todayshabits">
              <p className="text-white">Today's Habits</p>
            </Link>
            <Link href="/progress">
              <p className="text-white">Progress</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
