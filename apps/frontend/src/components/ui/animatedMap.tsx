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

    const handleHover = () => {
        animationRef.current?.play();
    }

    const handleNoHover = () => {
        animationRef.current?.stop();
    }

    return (
        <div className="w-full h-full flex justify-center items-center opacity-80"
            onMouseEnter={handleHover}
            onMouseLeave={handleNoHover}>
            <Lottie
                animationData={mapAnimation}
                loop={true}
                autoplay={false}
                lottieRef={animationRef}
                className="w-full h-full"
            />
        </div>
    );
}
