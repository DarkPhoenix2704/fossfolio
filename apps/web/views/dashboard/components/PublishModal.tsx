import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@app/ui/components/dialog';
import { useToggle } from '@app/hooks';
import { toast } from 'sonner';
import { Input } from '@app/ui/components/input';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@app/components/ui/Button';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@app/ui/components/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@app/ui/components/form';
import { apiHandler } from '@app/config';
import { Popover, PopoverTrigger } from '@app/ui/components/popover';
import { cn } from '@app/ui/lib/utils';
import { PopoverContent } from '@radix-ui/react-popover';
import { Calendar } from '@app/ui/components/calendar';
import { format, isBefore } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type IModal = {
    isOpen: boolean;
    onClose: () => void;
};
type Description = 'true' | 'false';

export const EventSchema = yup.object().shape({
    file: yup.mixed(),
    maxTicketCount: yup.number().required('Ticket count is a required field').min(1),
    lastDate: yup.date().required(),
    eventDate: yup.date().required(),
    team: yup.string().required().default('false'),
    minTeamSize: yup.number().when('team', {
        is: (val: Description) => val === 'true',
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
    }),
    maxTeamSize: yup.number().when('team', {
        is: (val: Description) => val === 'true',
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export type IProfile = yup.InferType<typeof EventSchema>;

export const PublishModal = ({ isOpen, onClose }: IModal) => {
    const [isUpdating, setUpdating] = useToggle(false);
    const [cover, selectCover] = useState<string | undefined>('');
    const router = useRouter();
    const { id, pk } = router.query;

    const form = useForm<IProfile>({
        defaultValues: {
            maxTicketCount: 1,
            team: 'false',
        },
        resolver: yupResolver(EventSchema),
    });

    const convert2base64 = (file: File) => {
        const reader = new FileReader();

        reader.onloadend = () => [selectCover(reader.result?.toString())];

        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const image = form.watch('file') as File;
        if (typeof image === 'object') {
            convert2base64(image);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('file')]);

    const isTeamEvent = form.watch('team') === 'true';

    const handleUpdates: SubmitHandler<IProfile> = async (payload) => {
        try {
            setUpdating.on();
            // if event date is before end date
            const isEventDateWrong = isBefore(payload.eventDate, payload.lastDate);
            if (isEventDateWrong) {
                toast.message('Date mismatch', {
                    description: 'Registration end date should not be after event date',
                });
                return;
            } else if (
                isBefore(payload.eventDate, new Date()) ||
                isBefore(payload.lastDate, new Date())
            ) {
                toast.message('Date mismatch', {
                    description: 'Registration end date or event date should be after todays date',
                });
                return;
            }
            const formData = new FormData();
            formData.append('file', payload.file);

            const dataWithOutImage = await apiHandler.patch(`/events/edit`, {
                ...payload,
                organizationId: id,
                eventSlug: pk,
                maxTicketCount: Number(payload.maxTicketCount),
                isPublished: true,
                maxTeamSize: Number(payload.maxTeamSize),
                minTeamSize: Number(payload.minTeamSize),
                file: null,
            });

            const uploadImageOnly = await apiHandler.patch(
                `/events/edit/cover?org=${id}&event=${pk}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            const calls = [uploadImageOnly, dataWithOutImage];
            await Promise.all(calls);

            toast.success('Event was published successfully');
        } catch {
            toast.error('Error updating the event');
        } finally {
            setUpdating.off();
            selectCover('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[325px] md:w-auto ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdates)}>
                        <DialogHeader>
                            <DialogTitle className="mb-4">Event Info</DialogTitle>
                            <DialogDescription>
                                Complete this information before publishing the event
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="maxTicketCount"
                                render={({ field }) => (
                                    <FormItem className="items-center ">
                                        <FormLabel>Maximum Ticket Count</FormLabel>
                                        <FormControl>
                                            <Input placeholder="100" {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <FormItem className="items-center ">
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                                                type="file"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) => {
                                                    field.onChange(
                                                        e.target.files ? e.target.files[0] : null,
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* @ts-ignore */}
                            {cover?.length > 0 && (
                                <Image
                                    src={cover as string}
                                    width={200}
                                    height={100}
                                    alt="cover image"
                                />
                            )}
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
                                                            !field.value && 'text-muted-foreground',
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
                                                            !field.value && 'text-muted-foreground',
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
                            {/* <FormField
                                control={form.control}
                                name="team"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Is this is team event?</FormLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Team Event" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Yes</SelectItem>
                                                <SelectItem value="false">No</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            {/* {isTeamEvent && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="minTeamSize"
                                        render={({ field }) => (
                                            <FormItem className="items-center ">
                                                <FormLabel>Minimum Team Size</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="0"
                                                        {...field}
                                                        type="number"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxTeamSize"
                                        render={({ field }) => (
                                            <FormItem className="items-center ">
                                                <FormLabel>Maximum Team Size</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="0"
                                                        {...field}
                                                        type="number"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )} */}
                        </div>

                        <DialogFooter>
                            <Button type="submit" isLoading={isUpdating}>
                                Publish event
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
