import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import { FocusProvider } from "@/context/FocusContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Tokamak Network",
  description: "Tailored Ethereum Solution",
  metadataBase: new URL("https://tokamak.network"),
  openGraph: {
    title: "Tokamak Network",
    description:
      "Tailored Ethereum Solution",
    url: "https://tokamak.network",
    siteName: "Tokamak Network",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tokamak Network",
    description:
      "Tailored Ethereum Solution",
    site: "@tokamak_network",
  },
  icons: {
    icon: [
      {
        url: "/tokamak_favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Tokamak Network",
      url: "https://tokamak.network",
      logo: "https://tokamak.network/tokamak_favicon.ico",
      description:
        "Ethereum-native Layer 2 platform enabling on-demand rollup deployment. Built on the OP Stack, Tokamak Network allows any application to launch its own optimized L2 chain.",
      sameAs: [
        "https://github.com/tokamak-network",
        "https://twitter.com/tokamak_network",
        "https://medium.com/tokamak-network",
        "https://discord.com/invite/J4chV2zuAK",
        "https://t.me/tokamak_network",
        "https://www.linkedin.com/company/tokamaknetwork/",
      ],
    },
    {
      "@type": "WebSite",
      name: "Tokamak Network",
      url: "https://tokamak.network",
    },
    {
      "@type": "SoftwareApplication",
      name: "Thanos L2",
      applicationCategory: "Blockchain",
      operatingSystem: "Ethereum",
      description:
        "OP Stack-based rollup infrastructure for deploying application-specific L2 chains with custom configuration and one-click deployment.",
      url: "https://rolluphub.tokamak.network/",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Tokamak Network?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tokamak Network is an Ethereum-native Layer 2 platform that enables on-demand rollup deployment. Built on the OP Stack, it allows any application to launch its own optimized L2 chain in minutes.",
          },
        },
        {
          "@type": "Question",
          name: "What is the TON token?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "TON is the native ERC-20 utility token of Tokamak Network on Ethereum mainnet (contract: 0x2be5e8c109e2197D077D13A82dAead6a9b3433C5). It powers seigniorage staking, DAO governance, and cross-chain bridging.",
          },
        },
        {
          "@type": "Question",
          name: "What is Thanos L2?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Thanos is Tokamak Network's flagship product for launching application-specific L2 chains. It provides custom chain configuration, one-click deployment via the Rollup Hub, and an open modular architecture with 1.2s block time.",
          },
        },
        {
          "@type": "Question",
          name: "How does TON staking work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tokamak Network uses seigniorage-based staking where TON holders stake tokens to earn block rewards and secure the network. Over 42M TON is currently staked across the ecosystem.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fuc6kbq.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="font-display antialiased bg-black text-[#c5c5ca]"
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: `window.history.scrollRestoration="manual";window.scrollTo(0,0);` }} />
        <FocusProvider>{children}</FocusProvider>
      </body>
    </html>
  );
}
