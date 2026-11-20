import Image from "next/image";
import { BrandBridge, type BridgeBrand } from "./motion-brew/brand-bridge";
import styles from "./TechnologyBridge.module.css";

type TechnologyBrand = {
  id: string;
  name: string;
  icon: string;
};

export function TechnologyBridge({
  technologies,
  logoDirectory = "https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos",
}: {
  technologies: readonly TechnologyBrand[];
  logoDirectory?: string;
}) {
  const brands: BridgeBrand[] = technologies.map(({ id, name, icon }) => ({
    id,
    name,
    colors: ["#b9562d", "#de9d73"],
    logo: <Image className={styles.logo} src={`${logoDirectory}/${icon}.svg`} alt="" width={27} height={25} unoptimized />,
  }));

  return (
    <BrandBridge
      brands={brands}
      defaultConnected={["nextjs", "tailwindcss"]}
      autoplay={false}
      hub={<Image className={styles.hub} src="/sparklab-icon-clear.svg" alt="SparkLab" width={44} height={44} unoptimized />}
      title={null}
      description="Tap or select a technology to connect or disconnect it."
      particles={18}
      speed={0.65}
      className="border border-[#e9ded1] bg-[#fffaf3] shadow-[0_2px_4px_#58352508,0_22px_58px_-34px_#58352566]"
    />
  );
}
