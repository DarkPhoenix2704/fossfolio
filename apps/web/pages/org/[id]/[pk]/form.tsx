import { NextPageWithLayout } from 'next';
import { DashboardLayout } from '@app/layout';
import { Button } from '@app/components/ui/Button';
import { Input } from '@app/ui/components/input';
import { Separator } from '@app/ui/components/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/ui/components/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@app/ui/components/select';
import {
    Form as FormProvider,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@app/ui/components/form';
import { Checkbox } from '@app/ui/components/checkbox';
import { InputOption, IFormInput, SchemaPreview } from '@app/views/form';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiHandler } from '@app/config';
import { useRouter } from 'next/router';
import { useFormSchema, useEvent } from '@app/hooks/api/Events';
import { useMutation } from '@tanstack/react-query';
import { Iform } from '@app/types';
import { toast } from 'sonner';
import { RiLoaderFill } from 'react-icons/ri';
import { useToggle } from '@app/hooks';

const builderSchema = yup.object({
    label: yup.string().required('Label is required'),
    placeholder: yup.string(),
    required: yup.boolean().optional().default(false),
    type: yup.string().required('Question type is required') as yup.StringSchema<IFormInput>,
});

type FormValidator = yup.InferType<typeof builderSchema>;

const Form: NextPageWithLayout = () => {
    const router = useRouter();
    const { data, isLoading, refetch } = useFormSchema();
    const { data: eventInfo } = useEvent('event');
    const [isFormStatusChanging, toggleFormStatus] = useToggle(false);

    const { pk, id } = router.query;

    const form = useForm<FormValidator>({
        mode: 'onSubmit',
        resolver: yupResolver(builderSchema),
    });

    const publishForm = async (status: boolean) => {
        try {
            toggleFormStatus.on();
            await apiHandler.post(`/events/publish/form/${pk}`, {
                organizationId: id,
                shouldFormPublish: status,
            });

            if (status) {
                toast.success('form was published successfully');
            } else {
                toast.success('form was unpublished successfully');
            }
        } catch {
            toast.error('Couldnt complete the operation');
        } finally {
            toggleFormStatus.off();
        }
    };

    const updateSchema = async (schema: Iform) => {
        try {
            await apiHandler.post('/events/form', {
                organizationId: router.query?.id,
                data: schema,
                eventId: eventInfo?.data.id,
            });
        } catch {
            toast.error('Error adding new schema');
        }
    };

    const { isLoading: isSchemaUpdating, mutate } = useMutation(updateSchema, {
        onSuccess: () => {
            refetch();
        },
    });

    const handleUpdates: SubmitHandler<FormValidator> = async (data) => {
        mutate(data);
        form.reset();
    };

    const handleCancel = () => {
        form.reset();
    };

    return (
        <div className="pt-5 pr-3">
            {!eventInfo?.data.isFormPublished && (
                <Button
                    className="float-right"
                    onClick={() => publishForm(true)}
                    isLoading={isFormStatusChanging}
                >
                    Publish Form
                </Button>
            )}
            {eventInfo?.data.isFormPublished && (
                <Button
                    className="float-right"
                    onClick={() => publishForm(false)}
                    isLoading={isFormStatusChanging}
                >
                    Un Publish Form
                </Button>
            )}
            <div className="flex justify-center  h-screen  p-5 ">
                <div className="gap-20 flex justify-center">
                    <section>
                        <h3 className="text-3xl font-semibold mt-4">Form Builder</h3>
                        <p className="text-sm text-gray-400 mt-3">
                            Create Custom forms with various question types
                        </p>
                        <FormProvider {...form}>
                            <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdates)}>
                                <Card className="mt-10">
                                    <CardHeader>
                                        <CardTitle>Create a new question</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="label"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Question</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter your question"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2 mt-2">
                                            <FormField
                                                control={form.control}
                                                name="placeholder"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Placeholder (optional)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter Placeholder"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2 mt-2">
                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="type">
                                                            Question Type
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger id="type">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent position="popper">
                                                                {InputOption.map((el) => (
                                                                    <SelectItem
                                                                        key={el.value as string}
                                                                        value={el.value as string}
                                                                    >
                                                                        {el.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2 mt-3">
                                            <FormField
                                                control={form.control}
                                                name="required"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Required</FormLabel>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            type="reset"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" isLoading={isSchemaUpdating}>
                                            Add Question
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </FormProvider>
                    </section>
                    <Separator orientation="vertical" />
                    <section>
                        <h3 className="text-3xl font-semibold mt-4">Preview</h3>
                        <p className="text-sm text-gray-400 mt-3">
                            This is how your form will look like
                        </p>

                        {isLoading && (
                            <Card className="mt-10 w-[300px] flex justify-center items-center h-[600px]">
                                <RiLoaderFill className="animate-spin h-8 w-8" />
                            </Card>
                        )}

                        {data?.data && data.data.length > 0 && (
                            <SchemaPreview
                                data={data.data}
                                isPublic={false}
                                eventId={eventInfo?.data.id as string}
                            />
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

Form.Layout = DashboardLayout;
Form.RequireAuth = true;
export default Form;
