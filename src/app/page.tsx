import {BrokerCarousel, Card,Carousel} from "@/components/home/index";
import { roboto } from "@/lib/fonts";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Carousel />
      <div
        className={
          "bg-linear-to-b from-gray-50 via-gray-80 to-gray-50 py-10"
        }
      >
        <p
          className={`${roboto.className} text-3xl font-bold text-black-500 text-center mb-6`}
        >
          Generate & safeguard wealth with smart algorithms
        </p>
        <div
          className={`flex justify-between align-middle max-w-6xl m-auto py-4`}
        >
          <Card
            imagePath="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-topprod-stocks.svg"
            title={"Stock"}
            subTitle={"All rounder"}
          />
          <Card
            imagePath="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-topprod-mf.svg"
            title={"Mutual Funds"}
            subTitle={"Algrow"}
          />
          <Card
            imagePath="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-topprod-tax-soln.svg"
            title={"tax-max"}
            subTitle={"Tax solutions"}
            width={60}
          />
          <Card
            imagePath="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-topprod-insurance.svg"
            title={"Insurance"}
            subTitle={"Insurance Advisory"}
            width={60}
          />
        </div>
      </div>
      {/* achive goal */}
      <div
        className={
          "bg-[#00ca9d] pt-10 pl-15 my-15 h-105 max-w-6xl m-auto rounded-2xl relative"
        }
      >
        <p
          className={`${roboto.className} text-5xl font-bold text-white text-left mb-4`}
        >
          Achieve your goals faster
        </p>
        <p
          className={`${roboto.className} text-3xl font-bold text-white text-left mb-4`}
        >
          with AI-powered investing
        </p>
        <p
          className={`${roboto.className} text-2xl  text-white text-left mb-4 italic`}
        >
          Get the next-level performance driven app.
        </p>
        <div className="flex justify-start space-x-5 mt-5">
          <Image
            src="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-googleplay.svg"
            alt="logo"
            width={160}
            height={80}
            className="cursor-pointer"
            // style={{ width: "auto", height: "auto" }}
          />
          <Image
            src="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-appstore.svg"
            alt="logo"
            width={160}
            height={80}
            className="cursor-pointer"
            // style={{ width: "auto", height: "auto" }}
          />
          {/*  */}
        </div>
        <Image
          src="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-app.png"
          alt="logo"
          width={400}
          height={100}
          className="absolute -bottom-2.5 right-15"
          // style={{ width: "auto", height: "auto" }}
        />
      </div>
      {/* brokers */}
      <div
        className={
          "bg-linear-to-b from-amber-50 via-amber-80 to-orange-50 py-10"
        }
      >
        <p
          className={`${roboto.className} text-3xl font-bold text-black-500 text-center mb-6`}
        >
          Our Supported Brokers
        </p>
        <div
          className={`flex justify-between align-middle max-w-6xl m-auto py-4`}
        >
          <BrokerCarousel />
        </div>
      </div>
    </>
  );
}
