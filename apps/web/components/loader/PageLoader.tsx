import Lottie from 'react-lottie';
import Anim from '@app/public/loader.json';
import { Center } from '@chakra-ui/react';

export const LottieAnim = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: Anim,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <Center h="100vh">
            <Lottie options={defaultOptions} height={400} width={400} />
        </Center>
    );
};
