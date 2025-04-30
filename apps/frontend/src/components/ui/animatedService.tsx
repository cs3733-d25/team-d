import Lottie, {LottieRefCurrentProps} from "lottie-react";
import serviceAnimation from "@/public/serviceAni.json";
import {useEffect, useRef} from "react";

export default function AnimatedService() {
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
                animationData={serviceAnimation}
                loop={true}
                autoplay={false}
                lottieRef={animationRef}
                className="w-full h-full"
            />
        </div>
    );
}
