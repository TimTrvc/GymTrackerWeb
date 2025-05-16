import HeroSection from '@/components/layout/HeroSection';
import AvatarGame from '@/components/features/avatar/AvatarGame';

const Avatar = () => {
    return (
        <>
            <div>
                <HeroSection 
                    title="RPG Avatar" 
                    subtitle="Level up your avatar by completing workouts and exercises"
                    size="medium"
                />
            </div>
            <div>
                <AvatarGame />
            </div>
        </>
    );
};

export default Avatar;