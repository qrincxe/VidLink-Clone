import { findFlagUrlByNationality } from "country-flags-svg";
import NextImage from "next/image";

export function USFlag() {
  const englishFlagUrl = findFlagUrlByNationality("American");
  return (
    <>
      <NextImage
        src={englishFlagUrl}
        alt="English flag url"
        width={24}
        height={18}
      />
    </>
  );
}

export function IndianFlag() {
  const englishFlagUrl = findFlagUrlByNationality("Indian");
  return (
    <>
      <NextImage
        src={englishFlagUrl}
        alt="English flag url"
        width={20}
        height={24}
      />
    </>
  );
}

export function VietnameseFlag() {
  const englishFlagUrl = findFlagUrlByNationality("Vietnamese");
  return (
    <>
      <NextImage
        src={englishFlagUrl}
        alt="English flag url"
        width={24}
        height={18}
      />
    </>
  );
}

export function UKFlag() {
  const englishFlagUrl = countryFlags.findFlagUrlByNationality("British");
  return (
    <>
      <NextImage
        src={englishFlagUrl}
        alt="English flag url"
        width={24}
        height={18}
      />
    </>
  );
}
