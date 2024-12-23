import Image from "next/image";
import GithubIcon from "@/assets/icons/common/github.svg";
import DocIcon from "@/assets/icons/common/doc.svg";
import { LINKS } from "@/app/constants/links";

const baseButtonStyle = "h-[40px] rounded-[20px] text-[14px]";

export default function Start() {
  return (
    <div className="w-full flex justify-center">
      <div
        className="w-[1200px] h-[445px] bg-white flex justify-center px-[130px] py-[75px]
      "
        style={{
          clipPath:
            "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
        }}
      >
        <section className="w-[1020px]h-[295px] flex flex-col">
          <header className="flex flex-col items-center mb-[45px]">
            <h1 className="mb-[60px] text-[30px]">
              Getting Started with Tokamak Network
            </h1>
            <h1 className="mb-[21px] text-[24px]">
              Developer-centric community
            </h1>
            <h2 className="text-center text-[15px]">
              A community where developers are empowered and incentivized to
              create innovative products using our core protocol, contributing
              to Tokamak Network’s self-sustainability and community growth. For
              example, this means providing an environment where developers can
              easily deploy and operate custom application-specific L2s that
              match their requirements
            </h2>
          </header>
          <nav className="flex justify-center gap-[18px]">
            <a
              href={LINKS.ONBOARDING} // 온보딩 페이지 URL
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseButtonStyle} w-[147px] bg-black text-white text-center leading-[38px]`}
            >
              Onboarding
            </a>
            <a
              href={LINKS.GRANT} // 그랜트 페이지 URL
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseButtonStyle} w-[100px] bg-black text-white text-center leading-[38px]`}
            >
              Grant
            </a>
            <a
              href={LINKS.GITHUB} // GitHub URL
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseButtonStyle} w-[134px] bg-white text-black border border-[#1C1C1C] flex items-center justify-center gap-[9px]`}
            >
              <Image src={GithubIcon} alt={"GithubIcon"} />
              Github
            </a>
            <a
              href={LINKS.DOCS} // 문서 페이지 URL
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseButtonStyle} w-[167px] bg-white text-black border border-[#1C1C1C] flex items-center justify-center gap-[9px]`}
            >
              <Image src={DocIcon} alt={"DocIcon"} />
              Documents
            </a>
          </nav>
        </section>
      </div>
    </div>
  );
}
