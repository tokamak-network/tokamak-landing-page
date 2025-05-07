import Image from "next/image";
import GithubIcon from "@/assets/icons/common/github.svg";
import GithubIconHover from "@/assets/icons/common/github-black.svg";
import DocIcon from "@/assets/icons/common/doc.svg";
import DocIconHover from "@/assets/icons/common/doc-white.svg";
import { LINKS } from "@/app/constants/links";

const baseButtonStyle = "h-[40px] rounded-[20px] text-[14px]";

export default function Start() {
  return (
    <div className="w-full flex justify-center px-5 md:px-0 text-black">
      <div
        className="w-full max-w-[1200px] min-h-[445px] bg-white flex justify-center px-[15px] sm:px-[60px] md:px-[90px] py-[75px]"
        style={{
          clipPath:
            "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
        }}
      >
        <section className="w-full max-w-[1020px] flex flex-col">
          <header className="flex flex-col items-center mb-[45px]">
            <h1 className="mb-[60px] text-[30px] text-center">
              <span className="block [@media(min-width:820px)]:inline [@media(max-width:820px)]:leading-[33px] font-[100]">
                Getting Started with
              </span>{" "}
              <span className="font-[400]">Tokamak Network</span>
            </h1>
            <h1 className="mb-[21px] text-[24px] text-center font-[400]">
              Developer-centric community
            </h1>
            <h2 className="text-center text-[15px] leading-relaxed w-full max-w-[1020px] font-[300]">
              A community where developers are empowered and incentivized to
              create innovative products using our core protocol, contributing
              to Tokamak Network&apos;s self-sustainability and community
              growth. For example, this means providing an environment where
              developers can easily deploy and operate custom
              application-specific L2s that match their requirements.
            </h2>
          </header>
          <nav className="flex flex-wrap justify-center gap-[18px]">
            <div className="flex gap-x-[18px] [@media(max-width:780px)]:flex-row [@media(max-width:780px)]:w-full [@media(max-width:420px)]:justify-center [@media(max-width:780px)]:gap-[18px]">
              <a
                href={LINKS.ONBOARDING}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonStyle} w-[147px] bg-black text-white text-center leading-[38px] [@media(max-width:780px)]:w-full hover:bg-tokamak-blue font-[500]
               `}
              >
                Onboarding
              </a>
              <a
                href={LINKS.GRANT}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonStyle} w-[100px] bg-black text-white text-center leading-[38px] [@media(max-width:780px)]:w-full hover:bg-tokamak-blue font-[500]
               `}
              >
                Grant
              </a>
            </div>
            <a
              href={LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseButtonStyle} w-[134px] bg-white text-black border border-[#1C1C1C] flex items-center justify-center gap-[9px]
              [@media(max-width:780px)]:w-full hover:bg-tokamak-black hover:text-white
              group relative font-[500]`}
            >
              <div className="relative">
                <Image
                  src={GithubIcon}
                  alt="GithubIcon"
                  className="group-hover:opacity-0 transition-all duration-200"
                />
                <Image
                  src={GithubIconHover}
                  alt="GithubIcon"
                  className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                />
              </div>
              Github
            </a>
            <a
              href={LINKS.DOCS}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseButtonStyle} w-[167px] bg-white text-black border border-[#1C1C1C] flex items-center justify-center gap-[9px]
              [@media(max-width:780px)]:w-full hover:bg-tokamak-black hover:text-white
              group relative font-[500]`}
            >
              <div className="relative">
                <Image
                  src={DocIcon}
                  alt="DocIcon"
                  className="group-hover:opacity-0 transition-all duration-200"
                />
                <Image
                  src={DocIconHover}
                  alt="DocIcon"
                  className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                />
              </div>
              Documents
            </a>
          </nav>
        </section>
      </div>
    </div>
  );
}
