import Image from "next/image";
import { roboto } from "@/lib/fonts";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-amber-50 via-amber-80 to-orange-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1
            className={`${roboto.className} text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6`}
          >
            About <span className="text-red-500">5nance</span>
          </h1>
          <p className="max-w-1xl mx-auto text-xl text-gray-600">
            5nance is an AI-backed, SEBI-registered investment advisory platform
            based in Mumbai. Our financial advisory services adhere to long-term
            wealth creation for our customers.
          </p>
          <p className="max-w-1xl mx-auto text-xl text-gray-600">
            Our AI-Backed products analyze millions of data points, and market
            trends to help our customers make informed financial decisions. Our
            investment advisory services enable clients to harness the power of
            Artificial Intelligence technology to reap maximum returns on their
            investments.
          </p>
          <p className="max-w-1xl mx-auto text-xl text-gray-600">
            The core values of our investment advisory services have remained
            the same since we started our journey in 2010. We put our customers
            first, with a focus and commitment to helping them achieve their
            financial goals. Our robust AI-driven technology differentiates us
            from traditional financial advisory services.
          </p>
          <p className="max-w-1xl mx-auto text-xl text-gray-600">
            We are dedicated to building a smarter, faster, and more robust
            financial ecosystem. Generate and safeguard your wealth with our
            cutting-edge AI algorithms.
          </p>
        </div>
      </section>

      {/* Stats / Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <AboutCard
              title="Active Investors"
              description="Trust us to manage and grow their daily portfolios."
              value="10M+"
            />
            <AboutCard
              title="Assets Managed"
              description="Securely processed through our diverse financial infrastructure."
              value="$5B+"
            />
            <AboutCard
              title="AI Support"
              description="Our AI-powered bots are constantly working to find market edges."
              value="24/7"
            />
          </div>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className={`${roboto.className} text-3xl font-bold mb-4`}>
              Our Mission
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Our goal isn't just to provide a platform—it's to revolutionize
              the way you interact with your capital. By merging
              institutional-grade tooling with a seamless user experience, we
              democratize elite financial resources for everyone.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We leverage Appwrite to safely guard your data, Next.js for
              blazing fast transactions, and industry-leading algorithms to
              ensure you stay ahead in today's rapid market.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-app.png"
              alt="App Interface"
              width={400}
              height={600}
              className="rounded-xl shadow-2xl drop-shadow-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
const AboutCard = ({title, description, value}: {title: string, description: string, value: string}) => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
      <div className="text-4xl font-extrabold text-[#00ca9d] mb-2">{value}</div>
      <p className="text-lg font-medium text-gray-700">{title}</p>
      <p className="text-gray-500 mt-2 text-sm">
        {description}
      </p>
    </div>
  );
}
