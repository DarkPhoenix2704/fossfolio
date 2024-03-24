import { EventCard, NoData, PreLoader } from '@app/components/events';
import { usePublicOrgEvents } from '@app/hooks/api/Events';
import { HomeLayout } from '@app/layout';
import { NextPageWithLayout } from 'next';

const Event: NextPageWithLayout = () => {
    const { data, isLoading } = usePublicOrgEvents();

    if (isLoading) {
        return <PreLoader count={12} />;
    }

    if (data?.data.events.length === 0) {
        return (
            <div className="p-6 flex flex-col items-center">
                <h1 className="text-center text-5xl">Find Events</h1>
                <div className="flex justify-center items-center h-[70vh]">
                    <NoData />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-center text-5xl">{data?.data.name.toUpperCase()}</h1>
            <div className="flex flex-wrap flex-col  justify-center items-center p-4  gap-10 lg:flex-row lg:items-center lg:justify-normal lg:w-[90%]">
                {data?.data.events.map((el) => (
                    <EventCard
                        name={el.name}
                        id={el.id}
                        location={el.location}
                        website={el.website}
                        lastDate={el.lastDate}
                        eventDate={el.eventDate}
                        coverImage={el.coverImage}
                        slug={el.slug}
                    />
                ))}
            </div>
        </div>
    );
};

Event.Layout = HomeLayout;
Event.RequireAuth = false;
export default Event;
