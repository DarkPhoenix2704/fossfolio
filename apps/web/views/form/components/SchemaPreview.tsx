import { Button } from '@app/components/ui/Button';
import { apiHandler } from '@app/config';
import { useUserRegistartionStatus } from '@app/hooks/api/Events';
import { Iform } from '@app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@app/ui/components/card';
import { Checkbox } from '@app/ui/components/checkbox';
import { Input } from '@app/ui/components/input';
import { Label } from '@app/ui/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@app/ui/components/select';
import { Textarea } from '@app/ui/components/textarea';
import { toast } from 'sonner';

type Prop = {
    data: Iform[];
    isPublic: boolean;
    closeModal?: () => void;
    eventId: string;
};

export const SchemaPreview = ({ data, closeModal, isPublic = false, eventId }: Prop) => {
    const { refetch: refetchStatus } = useUserRegistartionStatus();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!isPublic) return;
        e.preventDefault();

        // key of the form will be the each fields primary key
        // this is done so that we can make the field editable from admin side form builder
        const formData: { [name: string]: string } = {};
        for (let i = 0; i < e.currentTarget.elements.length; i++) {
            const element = e.currentTarget.elements[i] as HTMLInputElement;
            if (element.name) {
                formData[element.name] = element.value;
            }
        }
        try {
            const { data } = await apiHandler.post(`/events/form/${eventId}`, formData);
            if (data.url) {
                // shoudl use stripe js library to pass session id
                window.location.href = data.url;
            }
            toast.success('Form submitted successfully');
            refetchStatus();
            if (closeModal) {
                closeModal();
            }
        } catch {
            toast.error('Error submiting form');
        }
    };

    return (
        <Card className="mt-10 w-[300px]">
            <CardHeader>
                <CardTitle>Please fill The form</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    {data.map((el) => (
                        <div key={el.id}>
                            <Label>{el.label}</Label>
                            <div className="mt-3 mb-2">
                                {el.type === 'SingleLineText' && (
                                    <Input
                                        placeholder={el.placeholder}
                                        required={el.required}
                                        name={el.id}
                                    />
                                )}
                                {el.type === 'Checkbox' && (
                                    <Checkbox
                                        placeholder={el.placeholder}
                                        required={el.required}
                                        name={el.id}
                                    />
                                )}
                                {el.type === 'Email' && (
                                    <Input
                                        placeholder={el.placeholder}
                                        type="email"
                                        required={el.required}
                                        name={el.id}
                                    />
                                )}
                                {el.type === 'SingleSelect' && (
                                    <Select required={el.required} name={el.id}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={el.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {el.type === 'LongText' && (
                                    <Textarea
                                        placeholder={el.placeholder}
                                        required={el.required}
                                        name={el.id}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <Button type="submit" className="mt-5 w-full">
                        submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
