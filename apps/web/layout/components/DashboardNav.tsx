import { useRouter } from 'next/router';
import { FiArrowLeft, FiHome, FiUser, FiSettings, FiBarChart } from 'react-icons/fi';
import { FaWpforms } from 'react-icons/fa';
import { BsPeople } from 'react-icons/bs';

export const DashNav = () => {
    const router = useRouter();
    /*
   pk = event primary key
   id = org primary key
  */

    const { pk, id } = router.query;
    return (
        <div className="flex flex-col items-center pt-31 h-[100vh] p-9 justify-between bg-brand-pink-100 w-[240px] fixed top-0 left-0 bottom-0 overflow-auto">
            <div className="flex flex-col items-start justify-between mt-5 gap-1.5 h-[40vh]">
                <div
                    className="font-medium flex justify-center items-center gap-3 text-lg hover:cursor-pointer"
                    onClick={() => router.push(`/org/${id}/${pk}/event`)}
                >
                    <FiHome className="mr-2.1" />
                    Event
                </div>
                <div
                    className="font-medium flex text-lg hover:cursor-pointer  justify-center items-center gap-3"
                    onClick={() => router.push(`/org/${id}/${pk}/participants`)}
                >
                    <FiUser className="9px text-md" />
                    Participants
                </div>
                <div
                    className="font-medium flex text-lg hover:cursor-pointer  justify-center items-center gap-3"
                    onClick={() => router.push(`/org/${id}/${pk}/form`)}
                >
                    <FaWpforms className="9px text-md" />
                    Form
                </div>
                <div
                    className="font-medium flex text-lg hover:cursor-pointer  justify-center items-center gap-3"
                    onClick={() => router.push(`/org/${id}/${pk}/tasks`)}
                >
                    <BsPeople className="mr-2.1" />
                    Tasks
                </div>
                <div
                    className="font-medium flex text-lg hover:cursor-pointer  justify-center items-center gap-3"
                    onClick={() => router.push(`/org/${id}/${pk}/revenue`)}
                >
                    <FiBarChart className="9px text-md" />
                    Revenue
                </div>
                <div
                    className="font-medium flex text-lg hover:cursor-pointer  justify-center items-center gap-3"
                    onClick={() => router.push(`/org/${id}/${pk}/settings`)}
                >
                    <FiSettings className="mr-2.1" />
                    Settings
                </div>
            </div>
            <div
                className="font-medium flex text-lg hover:cursor-pointer  justify-center items-center gap-3"
                onClick={() => router.push(`/org/${id}`)}
            >
                <FiArrowLeft className="mr-2.1" />
                Go Back
            </div>
        </div>
    );
};
