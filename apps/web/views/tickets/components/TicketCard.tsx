import { useToggle } from '@app/hooks/useToggle';
import { TicketModal } from '@app/views/tickets';
import { Button } from '@app/components/ui/Button';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import type { Data, Info } from '@app/hooks/api/user/useTickets';
import { useState } from 'react';

interface Prop extends Pick<Data, 'data'> {
    type: 'Upcoming' | 'Archived';
}

export const TicketCard = ({ data, type }: Prop) => {
    const [isOpen, triggerModal] = useToggle(false);
    const [info, setInfo] = useState<Info>();

    const handleOpen = (i: Info) => {
        setInfo(i);
        triggerModal.on();
    };

    if (!data || !data.length) {
        return (
            <div className="flex justify-center items-center h-[650px] flex-col gap-5">
                {type === 'Upcoming' && <h1 className="text-xl font-light">No Upcoming Events</h1>}
                {type === 'Archived' && <h1 className="text-xl font-light">No Archived Events</h1>}
                <Link href="/events">
                    <Button variant="outline">Buy tickets</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between mt-10 p-14 flex-wrap gap-2">
                <TicketModal isOpen={isOpen} onClose={triggerModal.off} data={info} />
                {data.map((el) => (
                    <div
                        onClick={() => handleOpen(el)}
                        key={el.id}
                        className="border-2 border-gray-300 py-5 px-8 rounded-xl hover:cursor-pointer"
                    >
                        <h1>{el.name}</h1>
                        <h2>Date: {format(new Date(el.eventDate), 'dd/MM/yyyy')}</h2>
                        <h2>Venue : {el.location}</h2>
                        <Image
                            src={el.coverImage}
                            width={400}
                            height={400}
                            alt="cover image"
                            className="mt-4"
                        />
                    </div>
                ))}
            </div>
        </>
    );
};
