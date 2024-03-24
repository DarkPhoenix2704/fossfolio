import { DashboardLayout } from '@app/layout';
import { ComingSoon, Teams } from '@app/views/dashboard';

const tasks = () => {
    return (
        <div className="flex justify-center items-center h-screen ">
            <ComingSoon />
        </div>
    );
};

tasks.Layout = DashboardLayout;
tasks.RequireAuth = true;
export default tasks;
