import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className=" border-b-2 border-black 00 p-1 flex items-center w-full">
      <div className="">
        <Link href="/" className="text-black text-xl pl-2 font-medium">
          Leo💡
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-1">
        <div className="flex items-center justify-center h-12 gap-10  w-full">
          <div className="flex justify-center items-center space-x-4 ">
            <Link href="/">
              <p className="btn  ">Today's Habits 📅</p>
            </Link>
            <Link href={"/create"} className="btn">Create 🎨</Link>
            <Link href="/progress">
              <p className=" btn ">Progress 📈</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
