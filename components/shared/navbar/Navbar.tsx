import Link from "next/link";
import Image from "next/image";
import { Show, UserButton } from "@clerk/nextjs";
import ThemeSwitch from "./ThemeSwitch";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav
      className="flex-between background-light900_dark200 fixed z-50 w-full
     gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12"
    >
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="logo"
        />
        <p
          className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900
          max-sm:hidden"
        >
          Code<span className="text-primary-500">Queries</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <ThemeSwitch />
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </Show>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
