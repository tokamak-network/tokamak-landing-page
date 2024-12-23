import Image from "next/image";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";

export default function Footer() {
  return (
    <footer
      className="w-full py-[60px] bg-white flex   justify-center px-[25px] [@media(max-width:1000px)]:px-[15px]"
      style={{
        clipPath:
          "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 100% 100%, 0 100%, 0 100%, 0 40px)",
      }}
    >
      <div className="flex justify-between items-center w-full max-w-[1220px] [@media(max-width:1000px)]:flex-col-reverse gap-y-[30px]">
        {/* Logo Section */}
        <div className="flex [@media(min-width:1001px)]:flex-col justify-between [@media(max-width:1000px)]:items-center w-full  h-full [@media(max-width:800px)]:justify-center">
          <figure className="flex items-center gap-2 [@media(max-width:800px)]:hidden">
            <Image
              loading="lazy"
              src={TokamakLogo}
              alt="Tokamak Network Logo"
            />
            <Image loading="lazy" src={TokamakLogoText} alt="Tokamak Network" />
          </figure>
          {/* Copyright */}
          <div className="mt-8 [@media(max-width:1000px)]:mt-0 text-[11px] text-gray-500 [@media(max-width:800px)]:text-[#1c1c1c] font-bold">
            © 2025 Tokamak Network{" "}
            <span className="[@media(max-width:800px)]:hidden">
              | All Rights Reserved.
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex text-right [@media(max-width:800px)]:hidden">
          {/* Developer Column */}
          <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
            <h3 className="font-medium mb-4">Developer</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#">Github</a>
              </li>
              <li>
                <a href="#">Documents</a>
              </li>
              <li>
                <a href="#">Grant</a>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
            <h3 className="font-medium mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#">Rollup Hub</a>
              </li>
              <li>
                <a href="#">Staking</a>
              </li>
              <li>
                <a href="#">DAO</a>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
            <h3 className="font-medium mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#">Team</a>
              </li>
              <li>
                <a href="#">Onboarding</a>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
            <h3 className="font-medium mb-4">Social</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#">Medium</a>
              </li>
              <li>
                <a href="#">X (Twitter)</a>
              </li>
              <li>
                <a href="#">Discord</a>
              </li>
              <li>
                <a href="#">Telegram (EN)</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
