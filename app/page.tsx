import ChatInterface from "@/components/ui/chat_interface";
import Hero from "@/components/ui/hero";
import { NavBar } from "@/components/ui/navbar";

export default function Home() {
  return (<>
    <NavBar/>
    {/* <ChatInterface/> */}
    <div className="w-full h-[calc(100vh-1rem)] flex items-center justify-center">
    <Hero/>
    </div>
  </>)
}
