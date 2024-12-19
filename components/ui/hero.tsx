import Image from "next/image"
import { Input } from "./input"
import { Button } from "./button"
import { Send } from "lucide-react"
import { TypingParagraph } from "./typing_paragraph"
const Hero = () => {
    const segments = [
        { text: "Juander Bot ", className: "font-bold tracking-tight text-2xl lg:text-3xl" },
        { text: "is an AI chatbot that can answer questions related to the Citizen's Charter of PhilHealth, SSS, GSIS, BIR and DFA. Ask away!", className: "text-xl lg:text-2xl" }
      ];
  return (
    <div className="flex flex-col w-[50%] gap-">
        <div className="flex flex-col md:flex-row justify-center items-center">
            <Image src={"/images/JuanderBot Logo.png"} alt="JuanderBot Logo" width={200} height={200}/>
            <TypingParagraph 
                segments={segments} 
                speed={40} 
                className="mb-4" 
                as="h1"
            />
        </div>
        <div className=" bg-white p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            // value={message}
            // onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button 
          // onClick={handleSend}
          size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero