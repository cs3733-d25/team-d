import Lottie from "lottie-react";
import serviceAnimation from "@/public/serviceAnimation.json";

export default function AnimatedService() {
    return (
        <div className="w-full h-full flex justify-center items-center opacity-80">
            <Lottie
                animationData={serviceAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full"
            />
        </div>
    );
}
