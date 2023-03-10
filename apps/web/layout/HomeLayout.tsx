import React from 'react';
import { Child } from '@app/types';
import { LottieAnim } from '@app/components/loader';
import { useAuth } from '@app/hooks';
import { Box } from '@chakra-ui/react';
import { MainNav } from './components/MainNav';

export const HomeLayout = ({ children }: Child) => {
    const { isUserLoading } = useAuth();

    if (isUserLoading) {
        return (
            <>
                <LottieAnim />
                <Box display="none">{children}</Box>
            </>
        );
    }

    return (
        <>
            <MainNav />
            {children}
        </>
    );
};
