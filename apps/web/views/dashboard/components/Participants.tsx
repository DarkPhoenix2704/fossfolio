import { useToggle } from '@app/hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@app/ui/components/table';
import { DeleteModal } from './DeleteModal';
import { AiOutlineDelete } from 'react-icons/ai';
import { User } from '@app/types';
import { Avatar, AvatarFallback, AvatarImage } from '@app/ui/components/avatar';
import { IoIosMore } from 'react-icons/io';
import { FormDrawer } from './FormDrawer';
import { useState } from 'react';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { IData } from '@app/hooks/api/org/useParticipants';
import { ref } from 'yup';

interface Data {
    data: User[];
    doesEventHaveForm: boolean;
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<IData, unknown>>;
    id: string;
}

export const Participants = ({ data, doesEventHaveForm = false, refetch, id }: Data) => {
    const [isModapOpen, toggleModal] = useToggle(false);
    const [isDrawerOpen, toggleDrawer] = useToggle(false);

    const [userToBeDeleted, setDeleteId] = useState('');
    const [userMoreInfoId, setUserMoreInfo] = useState('');
    return (
        <Table className="border-1/4 border-brand-purple-200 rounded-full">
            <DeleteModal
                isOpen={isModapOpen}
                onClose={toggleModal.off}
                userId={userToBeDeleted}
                refetch={refetch}
                eventId={id}
            />
            <FormDrawer open={isDrawerOpen} onClose={toggleDrawer.off} userId={userMoreInfoId} />
            <TableHeader className="bg-[#F9FAFB] rounded-lg">
                <TableRow style={{ background: 'white', height: '67px' }}>
                    <TableCell className="font-medium">Participants</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Student / Pro</TableHead>
                    <TableHead>Email address</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((el) => (
                    <TableRow>
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={el.photoURL} />
                                <AvatarFallback>photo</AvatarFallback>
                            </Avatar>
                        </TableCell>

                        <TableCell className="font-medium">
                            <h5>{el.displayName}</h5>
                        </TableCell>
                        <TableCell>{el.isStudent ? 'Student' : 'Professional'}</TableCell>
                        <TableCell>{el.email}</TableCell>
                        {doesEventHaveForm && (
                            <TableCell
                                className="text-right"
                                onClick={() => {
                                    setUserMoreInfo(el.uid);
                                    toggleDrawer.on();
                                }}
                            >
                                <IoIosMore className="hover:text-red-500 cursor-pointer text-lg" />
                            </TableCell>
                        )}
                        <TableCell
                            className="text-right"
                            onClick={() => {
                                setDeleteId(el.uid);
                                toggleModal.on();
                            }}
                        >
                            <AiOutlineDelete className="hover:text-red-500 cursor-pointer text-lg" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
