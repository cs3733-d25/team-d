import { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import securityAnimation from "@/public/SecurityAni.json";

export default function AnimatedSecurity() {
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
                animationData={securityAnimation}
                loop={true}
                autoplay={false}
                lottieRef={animationRef}
                className="w-full h-full"
            />
        </div>
    );
}
