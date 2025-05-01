import Lottie from "lottie-react";
import animationData from "@/public/Home.json"; // Ensure this file path is correct

export default function AnimatedGraphic() {
    return (
        <div className="w-full h-full flex justify-center items-center opacity-80">
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="w-full h-full"
            />
        </div>
    );
}

