import HeroSection from '@/components/layout/HeroSection';
import GymAvatar from "@/components/features/avatar/GymAvatar.jsx";

const Avatar = () => {
    return (
        <>
            <div>
                <HeroSection title="Avatar" subtitle="Dein Avatar"/>
            </div>
            <div>
                <GymAvatar userId={1} />
            </div>
        </>
    );
};

export default Avatar;