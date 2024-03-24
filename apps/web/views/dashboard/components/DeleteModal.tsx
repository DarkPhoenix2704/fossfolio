import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { apiHandler } from '@app/config';
import { Button } from '@app/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@app/ui/components/dialog';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { IData } from '@app/hooks/api/org/useParticipants';

type IModal = {
    isOpen: boolean;
    eventId: string;
    onClose: () => void;
    userId: string;
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<IData, unknown>>;
};

export const DeleteModal = ({ isOpen, onClose, userId, refetch, eventId }: IModal) => {
    const router = useRouter();

    const handleDeleteClick = async () => {
        try {
            // todo route is diffrent
            const { data } = await apiHandler.delete('/events/participants/delete', {
                data: { organizationId: router.query?.id, eventId: eventId, userId },
            });
            if (!data.ok) {
                throw new Error();
            }
            refetch();
            toast.success('user was removed');
        } catch {
            toast.error('could not remove the user');
        } finally {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!w-[425px] md:w-auto ">
                <DialogHeader>
                    Remove User
                    <DialogDescription className="mt-3">
                        <p>Are you sure You want to remove the user?</p>
                        <div className="flex justify-end space-x-2 mt-5">
                            <Button
                                className="text-[black] bg-[#F9F5FF]  border-1.5  hover:bg-btn hover:border-primary"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="text-[white] bg-[red]  border-[1.4px] hover:bg-red-500 "
                                onClick={handleDeleteClick}
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
