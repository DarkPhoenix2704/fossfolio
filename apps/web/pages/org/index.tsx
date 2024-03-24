import { NextPageWithLayout } from 'next';
import { GoOrganization } from 'react-icons/go';
import { HomeLayout } from '@app/layout';
import { Button } from '@app/components/ui/Button';
import { Separator } from '@app/ui/components/separator';
import { OrgCard, NewOrgDialog } from '@app/views/org';
import { useAuth, useToggle } from '@app/hooks';
import { useOrgs } from '@app/hooks/api/org';
import { OrgLoader } from '@app/components/preloaders';

const Index: NextPageWithLayout = () => {
    const [isOpen, setOpen] = useToggle(false);
    const { data, isLoading } = useOrgs();
    const { user } = useAuth();
    return (
        <div className="p-[20px]">
            <Separator className="mb-5" />
            <NewOrgDialog isOpen={isOpen} onClose={setOpen.off} />
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold md:text-[40px]">
                    {user?.displayName.split(' ')[0]}&apos;s organisations
                </h4>
                <Button onClick={setOpen.on}>New Organisation</Button>
            </div>
            <div className="flex flex-wrap mt-10 gap-5">
                {isLoading ? (
                    <div className="flex flex-col flex-wrap gap-5 md:flex-row">
                        <OrgLoader />
                    </div>
                ) : (
                    <>
                        <div
                            className="w-[300px] h-[150px] border-2 flex justify-center items-center border-dotted flex-col hover:cursor-pointer"
                            onClick={setOpen.on}
                        >
                            <GoOrganization className="border-black border-2 rounded-full text-3xl p-1" />
                            Create a new organisation
                        </div>
                        {data?.data.map((el) => (
                            <OrgCard
                                key={el.organization.id}
                                role={el.role}
                                name={el.organization.name}
                                id={el.organization.id}
                                events={el.organization._count.events}
                                members={el.organization._count.members}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

Index.Layout = HomeLayout;
Index.RequireAuth = true;

export default Index;
