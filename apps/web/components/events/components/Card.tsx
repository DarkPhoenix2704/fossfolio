import { BiLink, BiLocationPlus } from 'react-icons/bi';
import { BsCalendarDate } from 'react-icons/bs';
import { Button } from '@app/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/ui/components/card';
import { OrgEvents } from '@app/types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import Image from 'next/image';

type DescriptionExcluded = Omit<
    OrgEvents,
    'description' | 'createdAt' | 'isPublished' | 'updatedAt' | 'isFormPublished' | 'form'
>;

interface Prop extends DescriptionExcluded {
    description?: string;
    isOrg?: boolean;
}

export function EventCard({
    name,
    description,
    website,
    location,
    lastDate,
    isOrg = false,
    slug,
    coverImage,
}: Prop): JSX.Element {
    const router = useRouter();

    const goToEventInfo = () => {
        router.push(`/events/${slug}`);
    };
    return (
        <Card className="w-[330px] md:w-[400px] mt-6 hover:cursor-pointer hover:outline-double hover:outline-primary">
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <div className="flex items-center  rounded-md bg-secondary text-secondary-foreground ">
                    <Button variant="secondary" className=" shadow-none">
                        <BiLink className="mr-2 h-4 " />
                        {website}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground flex-wrap gap-3 w-full">
                    {coverImage && (
                        <Image src={coverImage} width={500} height={300} alt="event banner" />
                    )}
                    <div className="flex items-center">
                        <BiLocationPlus className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                        {location}
                    </div>

                    {lastDate && (
                        <div className="flex items-center">
                            <BsCalendarDate className="mr-1 h-3 w-3" />
                            Last date: {format(new Date(lastDate), 'dd/MM/yyyy')}
                        </div>
                    )}
                </div>
                {!isOrg ? (
                    <Button
                        variant="outline"
                        className="bg-[#F9F5FF] mt-4 px-5 py-2 rounded-sm text-primary border-1 hover:bg-[#F9F5FF]  border-[1.4px] hover:border-primary"
                        onClick={goToEventInfo}
                    >
                        Apply
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="bg-[#F9F5FF] mt-4 px-5 py-2 rounded-sm text-primary border-1 hover:bg-[#F9F5FF]  border-[1.4px] hover:border-primary"
                    >
                        More Info
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
