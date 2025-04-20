import Lottie from "lottie-react";
import mapAnimation from "@/public/mapAnimation.json";

export default function AnimatedMap() {
    return (
        <div className="w-full h-full flex justify-center items-center opacity-80">
            <Lottie
                animationData={mapAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full"
            />
        </div>
    );
}
