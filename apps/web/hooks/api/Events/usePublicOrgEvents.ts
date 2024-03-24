import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiHandler } from '@app/config';
import type { OrgEvents } from '@app/types';

type IData = {
    data: {
        events: OrgEvents[];
        name: string;
    };
    ok: boolean;
    message: string;
};

const getEvent = async (id: string) => {
    const { data } = await apiHandler.get(`/org/events/public/${id}`);
    return data;
};

export const usePublicOrgEvents = () => {
    const router = useRouter();
    const [Id, setId] = useState('');
    const eventQueryKey = ['events', Id];

    useEffect(() => {
        if (router.isReady) {
            const { org } = router.query;
            setId(org as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    const events = useQuery<IData>({
        queryKey: eventQueryKey,
        queryFn: () => getEvent(Id),
        // query is disabled until the query param is available
        enabled: !!Id,
    });

    return events;
};
