import DetectorCard from "./components/detector_card";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 container mx-auto items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Select a Cancer Detector</h1>
      <div className="flex flex-row flex-wrap gap-2">
        <DetectorCard/>
        <DetectorCard/>
        <DetectorCard/>
      </div>
    </div>
  );
}
