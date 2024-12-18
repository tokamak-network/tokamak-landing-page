import Image from "next/image";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";

export default function Footer() {
  return (
    <footer
      className="w-full py-[60px] bg-white flex justify-center"
      style={{
        clipPath:
          "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 100% 100%, 0 100%, 0 100%, 0 40px)",
      }}
    >
      <div className="flex justify-between items-center w-[1220px]">
        {/* Logo Section */}
        <div>
          <figure className="flex items-center gap-2">
            <Image
              loading="lazy"
              src={TokamakLogo}
              alt="Tokamak Network Logo"
            />
            <Image loading="lazy" src={TokamakLogoText} alt="Tokamak Network" />
          </figure>
          {/* Copyright */}
          <div className="mt-8 text-sm text-gray-500">
            © 2024 Tokamak Network | All Rights Reserved.
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-x-16">
          {/* Developer Column */}
          <div>
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
          <div>
            <h3 className="font-medium mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#">Bridge Hub</a>
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
          <div>
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
          <div>
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
