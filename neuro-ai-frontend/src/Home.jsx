import { useState } from "react";
import ChatUI from "../components/ChatUI";
import AccessibilityPanel from "../components/AccessibilityPanel";

export default function Home() {
  const [fontSize, setFontSize] = useState("text-base");
  const [dark, setDark] = useState(false);

  return (
    <div className={`${fontSize} ${dark ? "bg-black text-white" : "bg-gray-100"} min-h-screen`}>
      <div className="max-w-2xl mx-auto p-4">
        <AccessibilityPanel
          setFontSize={setFontSize}
          toggleDark={() => setDark(!dark)}
        />
        <ChatUI />
      </div>
    </div>
  );
}