import Lottie from "lottie-react";
import loginAnimation from "@/public/loginAnimation.json";

export default function AnimatedLogin() {
    return (
        <div className="w-full h-full flex justify-center items-center opacity-80">
            <Lottie
                loginData={loginAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full"
            />
        </div>
    );
}
