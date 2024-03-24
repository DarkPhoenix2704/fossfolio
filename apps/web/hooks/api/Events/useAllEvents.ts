import { apiHandler } from '@app/config';
import { useQuery } from '@tanstack/react-query';

type Events = {
    lastDate: Date;
    name: string;
    id: string;
    website: string;
    isPublished: boolean;
    description: JSON;
    isTeamEvent: boolean;
    maxTeamSize: number;
    minTeamSize: number;
    isCollegeEvent: boolean;
    createdAt: Date;
    updatedAt: Date;
    maxTicketCount: number;
    eventDate: Date;
    location: string;
    coverImage?: string;
    slug: string;
};

const getAllEvents = async () => {
    const { data } = await apiHandler.get('/events');
    return data;
};

export const useAllEvents = () => {
    const events = useQuery<Array<Events>>({ queryKey: ['all-events'], queryFn: getAllEvents });
    return events;
};
