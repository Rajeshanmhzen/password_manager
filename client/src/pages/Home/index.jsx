import { Button } from "@/components/ui/button";
import { Component } from "@/components/etheral-shadow";
import { Link } from "react-router-dom";
import ThemeSwitcher from "@/components/theme-switcher";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
  return (
    <>
      <Component
        color="rgba(128, 128, 128, 1)"
        animation={isMobile ? undefined : { scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
        className="!fixed w-100 h-screen"
      />
      <ThemeSwitcher showAccount={true} />
      <div className="max-w-container mx-auto px-4 flex flex-col gap-12 pt-16 sm:gap-24 min-h-screen justify-center">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <div className="flex flex-col items-start gap-6 sm:gap-8 text-center">
            <h1 className="animate-appear tracking-tight from-foreground to-foreground dark:to-muted-foreground inline-block max-w-[840px] bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-transparent drop-shadow-2xl sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
              Protect your passwords simply and securely.
            </h1>
            <p className="text-md mx-auto animate-appear dark:text-muted-foreground text-neutral-700 max-w-[840px] font-medium opacity-0 animation-delay-100 lg:text-xl">
              Modern open-source application that allows you to manage and protect
              all your passwords in one place.
            </p>
            <div className="animate-appear mx-auto flex justify-center gap-4 opacity-0 animation-delay-300">
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button>
                  {isLoggedIn ? "Go to App" : "Sign In"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
