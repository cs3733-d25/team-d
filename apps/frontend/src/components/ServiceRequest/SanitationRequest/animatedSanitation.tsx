import { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import sanitationAnimation from "@/public/SanitationAni.json";

export default function AnimatedSanitation() {
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
                animationData={sanitationAnimation}
                loop={true}
                autoplay={false}
                lottieRef={animationRef}
                className="w-full h-full"
            />
        </div>
    );
}
