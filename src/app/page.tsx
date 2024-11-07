import dynamic from "next/dynamic";

const DynamicMapWithNoSSR = dynamic(() => import("./map"), { ssr: false });

export default function Home() {
  return (
    <div className="container mx-auto items-center h-[100dvh] flex">
      <DynamicMapWithNoSSR />
    </div>
  );
}
