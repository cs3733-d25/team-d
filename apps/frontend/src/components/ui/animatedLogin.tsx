import { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import loginAnimation from "@/public/loginAni.json";

export default function AnimatedLogin() {
    const animationRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.setSpeed(0.3); // Adjust speed here
        }
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center opacity-80">
            <Lottie
                animationData={loginAnimation}
                loop={true}
                autoplay={true}
                lottieRef={animationRef}
                className="w-full h-full"
            />
        </div>
    );
}

