import { DefaultSeoProps } from "next-seo";

const META_TITLE = "Wolf Hunters | TERNOA X WLF PROJECT";
const META_DESCRIPTION =
  "Delve into the exhilarating world of WOLF HUNTERS MINI-GAME, brought to you by the incredible WLF PROJECT, on the Ternoa Blockchain. Dive headfirst into this gripping adventure and stand a chance to seize a jaw-dropping $10k prize pool in Ternoa Coin ($CAPS) and Werewolf Token ($WLF) through a limited-time airdrop!";

const SEO: DefaultSeoProps = {
  defaultTitle: META_TITLE,
  description: META_DESCRIPTION,
  canonical: "https://wolf-hunters.vercel.app/",
  openGraph: {
    description: META_DESCRIPTION,
    type: "website",
    locale: "en_IE",
    siteName: META_TITLE,
    images: [
      {
        url: "https://wolf-hunters.vercel.app/assets/logo.png",
        width: 200,
        height: 200,
        alt: META_TITLE,
        type: "image/png",
      },
    ],
  }
};

export default SEO;
