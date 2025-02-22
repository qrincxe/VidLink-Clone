import { findFlagUrlByNationality } from "country-flags-svg";
import NextImage from "next/image";

const width = 24;
const height = 18;

export function USFlag() {
  const usFlagURL = findFlagUrlByNationality("American");
  return (
    <>
      <NextImage
        src={usFlagURL}
        alt="English flag url"
        width={width}
        height={height}
      />
    </>
  );
}

export function IndianFlag() {
  const indianFlagURL = findFlagUrlByNationality("Indian");
  return (
    <>
      <NextImage
        src={indianFlagURL}
        alt="English flag url"
        width={width}
        height={height}
      />
    </>
  );
}

export function VietnameseFlag() {
  const vietnameseFlagURL = findFlagUrlByNationality("Vietnamese");
  return (
    <>
      <NextImage
        src={vietnameseFlagURL}
        alt="Vietnamese flag url"
        width={width}
        height={height}
      />
    </>
  );
}

export function UKFlag() {
  const UKFlagUrl = countryFlags.findFlagUrlByNationality("British");
  return (
    <>
      <NextImage src={UKFlagUrl} alt="UK flag" width={width} height={height} />
    </>
  );
}
