import { DashboardLayout } from '@app/layout';
import { Calendar } from '@app/ui/components/calendar';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@app/ui/components/form';
import { Input } from '@app/ui/components/input';
import { cn } from '@app/ui/lib/utils';
import { IProfile } from '@app/views/dashboard';
import { Popover, PopoverTrigger, PopoverContent } from '@app/ui/components/popover';
import { format } from 'date-fns';
import { Button } from '@app/components/ui/Button';
import { useForm } from 'react-hook-form';
import { useEvent } from '@app/hooks/api/Events';
import { RiLoaderFill } from 'react-icons/ri';
import Image from 'next/image';
import { Card, CardContent } from '@app/ui/components/card';
import { apiHandler } from '@app/config';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const Settings = () => {
    const { data, isLoading } = useEvent('event');
    const router = useRouter();
    const { id } = router.query;

    const deleteEvent = async () => {
        try {
            await apiHandler.delete(`/events/delete/${data?.data.id}`, {
                data: { organizationId: id },
            });
            toast.success('Event was deleted successfully');
            router.push('/org');
        } catch (e: any) {
            const error = e as AxiosError<{
                message: string;
            }>;
            if (error.response?.data && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error deleting event');
            }
        }
    };

    const form = useForm<IProfile>({
        defaultValues: {
            eventDate: data?.data.eventDate,
            lastDate: data?.data.lastDate,
            maxTicketCount: data?.data.maxTicketCount,
        },
    });

    const handleUpdates = () => {};

    if (!data?.data.isPublished) {
        return (
            <div className="flex flex-col justify-center w-full ml-10 h-screen items-center">
                <div className="h-[70vh]">
                    <h2 className="text-3xl mt-8 mb-5 font-medium h-full flex justify-center items-center">
                        Please publish the Event to access the settings
                    </h2>
                </div>
                <Card className="border-2 border-red-400 max-w-2xl mt-5 flex w-full">
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p>Deleting the Events will delete its all data</p>
                            <Button className="!bg-red-600" onClick={deleteEvent}>
                                Delete Event
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center w-full ml-10">
            <h2 className="self-start  text-3xl mt-8 mb-5 font-medium">
                Event Information & Settings
            </h2>
            {isLoading ? (
                <div className="h-[90vh]  flex items-center justify-center">
                    <RiLoaderFill className="animate-spin h-8 w-8" />
                </div>
            ) : (
                <div className="w-[450px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdates)}>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="maxTicketCount"
                                    render={({ field }) => (
                                        <FormItem className="items-center ">
                                            <FormLabel>Total Tickets left</FormLabel>
                                            <FormControl>
                                                <Input
                                                    min={1}
                                                    placeholder="0"
                                                    {...field}
                                                    type="number"
                                                    defaultValue={data?.data.maxTicketCount}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastDate"
                                    render={({ field }) => (
                                        <FormItem className="items-start flex flex-col">
                                            <FormLabel>Registration end date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                'w-full  text-start font-normal text-black',
                                                                !field.value &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'PPP')
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white shadow-md">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="eventDate"
                                    render={({ field }) => (
                                        <FormItem className="items-start flex flex-col">
                                            <FormLabel>Event Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                'w-full  text-start font-normal text-black',
                                                                !field.value &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'PPP')
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white shadow-md">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {data?.data.coverImage && (
                                    <>
                                        <h4 className="text-lg">Cover Image</h4>
                                        <Image
                                            src={data.data.coverImage}
                                            width={400}
                                            height={400}
                                            alt="cover image"
                                        />
                                    </>
                                )}
                            </div>
                        </form>
                    </Form>
                    <Card className="border-2 border-[red] max-w-2xl">
                        <CardContent className="pt-6 ">
                            <div className="space-y-2">
                                <p>Deleting the Events will delete its all data</p>
                                <Button
                                    className="!bg-[red] !hover:bg-[#ff0000c2]"
                                    onClick={deleteEvent}
                                >
                                    Delete Event
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

Settings.Layout = DashboardLayout;
Settings.RequireAuth = true;
export default Settings;
