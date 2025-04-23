import { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import mapAnimation from "@/public/mapAni.json";

export default function AnimatedMap() {
    const animationRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.setSpeed(0.5); // Adjust speed here
        }
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center opacity-80">
            <Lottie
                animationData={mapAnimation}
                loop={true}
                autoplay={true}
                lottieRef={animationRef}
                className="w-full h-full"
            />
        </div>
    );
}
