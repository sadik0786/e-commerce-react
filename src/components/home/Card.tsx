import Image from "next/image";

type CardProps = {
  imagePath: string;
  altName?: string;
  width?: number;
  height?: number;
  title?: string;
  subTitle?: string;
};

const Card = ({
  imagePath,
  altName = "logo",
  width = 80,
  height = 80,
  title,
  subTitle,
}: CardProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center 
            text-center bg-white p-4 py-12 rounded-2xl w-full md:w-[250px] max-w-[250px] m-auto shadow-md 
            transition-all duration-300 ease-in-out hover:bg-amber-50 hover:-translate-y-2 hover:shadow-xl"
    >
      <Image
        src={imagePath}
        alt={altName}
        width={width}
        height={height}
        className="m-auto mb-2"
      />
      <p className={`text-2xl font-bold text-black mt-2 mb-1`}>{title}</p>
      <p className={`text-1xl font-normal text-gray-500`}>{subTitle}</p>
    </div>
  );
};

export default Card;
