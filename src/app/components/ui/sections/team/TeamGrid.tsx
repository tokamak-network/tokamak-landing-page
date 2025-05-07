import * as React from "react";
import TeamMember from "./TeamMember";

import KevinImage from "@/assets/members/member=Kevin.png";
import ZenaImage from "@/assets/members/member=Zena.png";
import AleImage from "@/assets/members/member=Ale.png";
import JamieImage from "@/assets/members/member=Jamie.png";
import LucasImage from "@/assets/members/member=Lucas Jung.png";
import JadenImage from "@/assets/members/member=Jaden Kong.png";
import PraveenImage from "@/assets/members/member=Praveen Surendran.png";
import MonicaImage from "@/assets/members/member=Monica Kim.png";
import HarveyImage from "@/assets/members/member=Harvey Jo.png";
import SuhyeonImage from "@/assets/members/member=Suhyeon Lee.png";
import NamImage from "@/assets/members/member=Pham Tien Nam.png";
import JakeImage from "@/assets/members/member=Jake Jang.png";
import MuhammedImage from "@/assets/members/member=Muhammed Ali Bingol.png";
import TheoImage from "@/assets/members/member=Theo Lee.png";
import MehdiImage from "@/assets/members/member=Mehdi Beriane.png";
import IreneImage from "@/assets/members/member=Irene Bae.png";
import ShailendraImage from "@/assets/members/member=Singh Shailendra.png";
import GeorgeImage from "@/assets/members/member=Negru George.png";
import VictorImage from "@/assets/members/member=Victor Hazard.png";
import KaidenImage from "@/assets/members/member=Kaiden Araki.png";
import JamesImage from "@/assets/members/member=James Bello.png";
import JasonImage from "@/assets/members/member=Jason Hwang.png";
import AryanImage from "@/assets/members/member=Aryan Soni.png";
import KyleImage from "@/assets/members/member=Kyle.png";

const teamMembers = [
  {
    name: "Kevin Jeong",
    role: "CEO",
    imageUrl: KevinImage,
    isCEO: true,
  },
  {
    name: "Zena Park",
    role: "Blockchain Engineer",
    imageUrl: ZenaImage,
  },
  {
    name: "Jason Hwang",
    role: "Software Engineer",
    imageUrl: JasonImage,
  },
  {
    name: "Ale Son",
    role: "Software Engineer",
    imageUrl: AleImage,
  },
  {
    name: "Jamie Judd",
    role: "Core Researcher",
    imageUrl: JamieImage,
  },
  {
    name: "Lucas Jung",
    role: "Product Designer",
    imageUrl: LucasImage,
  },
  {
    name: "Jaden Kong",
    role: "Managing Director",
    imageUrl: JadenImage,
  },
  {
    name: "Praveen Surendran",
    role: "Researcher",
    imageUrl: PraveenImage,
  },
  {
    name: "Monica Kim",
    role: "UX/UI Designer",
    imageUrl: MonicaImage,
  },
  {
    name: "Harvey Jo",
    role: "Blockchain Engineer",
    imageUrl: HarveyImage,
  },
  {
    name: "Suhyeon Lee",
    role: "Researcher",
    imageUrl: SuhyeonImage,
  },
  {
    name: "Pham Tien Nam",
    role: "L2 Engineer",
    imageUrl: NamImage,
  },
  {
    name: "Jake Jang",
    role: "ZKP Researcher",
    imageUrl: JakeImage,
  },
  {
    name: "Muhammed Ali Bingol",
    role: "ZKP Researcher",
    imageUrl: MuhammedImage,
  },
  {
    name: "Theo Lee",
    role: "Blockchain Engineer",
    imageUrl: TheoImage,
  },
  {
    name: "Mehdi Beriane",
    role: "Blockchain Engineer",
    imageUrl: MehdiImage,
  },
  {
    name: "Irene Bae",
    role: "HR Manager",
    imageUrl: IreneImage,
  },
  {
    name: "Singh Shailendra",
    role: "Blockchain Engineer",
    imageUrl: ShailendraImage,
  },
  {
    name: "Negru George",
    role: "Blockchain Engineer",
    imageUrl: GeorgeImage,
  },
  {
    name: "Victor Hazard",
    role: "Software Engineer",
    imageUrl: VictorImage,
  },
  {
    name: "Kaiden Araki",
    role: "Blockchain Engineer",
    imageUrl: KaidenImage,
  },
  {
    name: "James Bello",
    role: "Software Engineer",
    imageUrl: JamesImage,
  },
  {
    name: "Aryan Soni",
    role: "Blockchain Engineer",
    imageUrl: AryanImage,
  },
  {
    name: "Kaibin Huang",
    role: "ZKP researcher",
    imageUrl: KyleImage,
  },
];

const TeamGrid: React.FC = () => {
  return (
    <div className="w-full h-full flex justify-center [@media(max-width:650px)]:px-[10px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-[1000px] gap-[25px] items-start">
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            name={member.name}
            role={member.role}
            imageUrl={member.imageUrl}
            isCEO={member.isCEO}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamGrid;
