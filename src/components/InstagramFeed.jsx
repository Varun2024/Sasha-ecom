import { useEffect } from "react";

export default function InstagramFeed() {
  useEffect(() => {
    // Load Elfsight script only once
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="elfsight-app-806af116-4bfe-4dfd-926b-20d9c36df82c" data-elfsight-app-lazy></div>
  );
}
