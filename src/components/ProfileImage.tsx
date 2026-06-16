import { useState } from "react";
import { Layout } from "lucide-react";
import { useData } from "../DataContext";

export const ProfileImage = ({ className, fallbackSize = "w-10 h-10" }: { className?: string; fallbackSize?: string }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { settings } = useData();
  
  if (!settings.profileImage || error) {
    return (
      <div className="flex flex-col items-center gap-4 text-neon-cyan/40">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-neon-cyan/30 flex items-center justify-center animate-pulse">
          <Layout className={fallbackSize} />
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">
          {error ? "Image Not Found" : "Waiting for Image..."}
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`${className} bg-card-bg animate-pulse flex items-center justify-center`}>
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img 
        src={settings.profileImage} 
        alt="Developer Profile" 
        loading="lazy"
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
      />
    </>
  );
};