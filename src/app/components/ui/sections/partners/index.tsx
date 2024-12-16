import * as React from "react";
import { PartnerImage } from "./PartnerImage";
import { PartnerImageProps } from "./types";

const partnerImages: PartnerImageProps[] = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/012549db40ee74b152e8a4a7f2bb9616d1330ac8fecfab54a7e31e979b3a5188?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[134px]",
    aspectRatio: "aspect-[4.46]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/063e299a767113a4eb3f77a89bf32c00de7dd4d1611f4ec13d314788c27bbd59?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[134px]",
    aspectRatio: "aspect-[4.46]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/39c0e262f4a0da43cf00635aea6e61fea1acd945211e0598e31225a1fb7f55df?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[90px]",
    aspectRatio: "aspect-[3]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/f6fc72f19113296741aa05786635aac4c59747250f21778651f15ae1dd0c2bb7?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[134px]",
    aspectRatio: "aspect-[4.46]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/4cc54aca687d040f410a9b88d3a99ecb5dcd2bb2edff3e7f71a1b518a7628b67?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[134px]",
    aspectRatio: "aspect-[4.46]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/d253daa36a8150c586dec93a1354f8e618505e8327c4524a70b5b0787f544c03?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[89px]",
    aspectRatio: "aspect-[2.97]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/f516574da55d42828f042de231fe46741d17442058287f6f8f53f10947698e0b?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[117px]",
    aspectRatio: "aspect-[3.91]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7c812e7b067d8fd0a4f24d231cbc4ffa1a289f68b71ff4b71c47702f0d040c95?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[134px]",
    aspectRatio: "aspect-[4.46]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/c4be9f26b6fd90bcf483e54913c29b7be928d8aa3ce1699fa7606647df8e8aa6?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[87px]",
    aspectRatio: "aspect-[2.9]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9a5a8459bea44fccc6f9ea360eccefd5bc949f4a853036d15369d17e3e5aac86?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[134px]",
    aspectRatio: "aspect-[4.46]",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5f044c774fa5d8ac5a0487c98bbbba1961fc12c3650c79cfdb43ff690a2921b4?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    width: "w-[134px]",
    aspectRatio: "aspect-[4.46]",
  },
];

export const Partners: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-wrap gap-10 items-center">
      {partnerImages.map((image, index) => (
        <PartnerImage
          key={index}
          src={image.src}
          width={image.width}
          aspectRatio={image.aspectRatio}
        />
      ))}
    </div>
  );
};
