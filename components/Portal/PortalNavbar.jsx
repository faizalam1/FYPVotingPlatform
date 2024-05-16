'use client'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { signOut } from "next-auth/react"


const Navbar = () => {
  const [profileDropdown, setProfileDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  },[]);

  return (
    <nav
      className="bg-[#1F2937] text-white flex justify-between font-semibold font-sans w-full px-3 py-3">
      <Link href="/portal">
        <div className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
          SV Portal
        </div>
      </Link>
      <div className="flex space-x-7">
        <Link href="/portal/campaigns/create">
          <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
            Create Campaign
          </button>
        </Link>
        <Link href="/portal/campaigns">
          <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
            Manage Campaigns
          </button>
        </Link>
        <Link href="/portal/vote">
          <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700  px-3 py-2 hover:underline">
            Vote
          </button>
        </Link>
        <Link href="/portal/campaigns/results">
          <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
            Results
          </button>
        </Link>
        <button
          className="items-center rounded-full border-[2px] hover:bg-gray-700 px-3 py-2"
          onClick={() => setProfileDropdown(prev => !prev)}
        >
          <Image src="/assets/icons/profile.svg" alt="Profile" width={15} height={16} />
        </button>
      </div>
      {profileDropdown &&
        (
          <div className="absolute right-2 top-16 bg-white text-black border-[2px] rounded-[10px] p-2" ref={dropdownRef}>
            <button
            className="hover:bg-gray-200 px-3 py-2 hover:underline rounded-2xl"
            onClick={() => signOut()}
            >
              Logout
            </button>
          </div>
        )
      }
    </nav>
  )
}

export default Navbar