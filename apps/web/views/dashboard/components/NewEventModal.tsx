import { useForm, SubmitHandler } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@app/ui/components/dialog';
import { Button } from '@app/components/ui/Button';
import { Input } from '@app/ui/components/input';
import { apiHandler } from '@app/config';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@app/ui/components/form';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@app/ui/components/select';

// TODO - DEFINE THE TYPE OF REFETCH
type IModal = {
    isOpen: boolean;
    onClose: () => void;
    refetch: any;
};

type Description = 'true' | 'false';

const Schema = yup.object().shape({
    name: yup.string().required().min(3),
    website: yup.string().url().required(),
    location: yup.string().required(),
    isPaidEvent: yup.string().required(),
    ticketPrice: yup
        .number()
        .min(0)
        .when('isPaidEvent', {
            is: (val: Description) => val === 'true',
            then: (schema) => schema.required('ticket price is a required field'),
            otherwise: (schema) => schema.notRequired(),
        }),
});

type ISchema = yup.InferType<typeof Schema>;

export const NewEventDialog = ({ isOpen, onClose, refetch }: IModal) => {
    const router = useRouter();

    const form = useForm<ISchema>({
        mode: 'onSubmit',
        resolver: yupResolver(Schema),
        defaultValues: {
            website: '',
            name: '',
            location: '',
            isPaidEvent: 'false',
            ticketPrice: 0,
        },
    });

    /* 
    generate a new event , doing this here to create unique slug to route into
    only after publishing the event public can access the event 
    */
    const onUserSubMit: SubmitHandler<ISchema> = async (val) => {
        // when user randomly enters some ticket price and go back to not a  money event
        //  we need to make sure that ticker price will stay 0
        if (val.isPaidEvent === 'false') {
            val.ticketPrice = 0;
        }

        const { id } = router.query;
        const payload = {
            ...val,
            organizationId: id,
        };
        try {
            await apiHandler.post('/events/create', payload);
            // create new event
            onClose();
        } catch {
            toast.error('Couldnt create event , please try again later');
        } finally {
            refetch();
        }
    };

    const isPaidEvent = form.watch('isPaidEvent') === 'true';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[400px] md:w-md-auto">
                <DialogHeader>
                    <DialogTitle className="mb-4 flex items-center">New Event</DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onUserSubMit)}>
                                <div className="flex flex-col gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="event name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="website link" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="location" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isPaidEvent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Is this a paid event?</FormLabel>

                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Paid Event" />
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
                                    />
                                    {isPaidEvent && (
                                        <FormField
                                            control={form.control}
                                            name="ticketPrice"
                                            render={({ field }) => (
                                                <FormItem className="items-center ">
                                                    <FormLabel>Ticket price (INR)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="100"
                                                            {...field}
                                                            type="number"
                                                            min={0}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col gap-3 mt-4">
                                    <Button
                                        type="submit"
                                        isLoading={form.formState.isSubmitting}
                                        variant="outline"
                                    >
                                        Create Event
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
