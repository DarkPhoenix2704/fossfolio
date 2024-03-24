import { DashboardLayout } from '@app/layout';
import { useEventStats } from '@app/hooks/api/Events';
import { RiLoaderFill } from 'react-icons/ri';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const Revenue = () => {
    const { isLoading: isStatsLoading, data: statsData } = useEventStats();

    const stats = useMemo(() => {
        const records = statsData?.data.insights;
        if (!records) return [];

        return Object.entries(records).map((info) => ({
            name: 'Insights',
            date: info[0],
            sales: info[1],
        }));
    }, [statsData]);

    return (
        <div className="bg-gray-100 min-h-screen items-center justify-center">
            <div className="flex flex-wrap  p-6 sm:gap-4 justify-start">
                <div className="rounded-md h-32 w-56  bg-gradient-to-b from-purple-300 via-purple-100 to-white flex flex-col justify-center items-center shadow-md">
                    <h1 className=" text-2xl text-center font-bold mb-2">
                        {statsData?.data.totalRevenue} rs
                    </h1>
                    <p className="  text-brand-purple-700 font-bold   text-center">Total Revenue</p>
                </div>

                <div className="rounded-md h-32 w-56 bg-gradient-to-b from-purple-300 via-purple-100 to-white  bg-blue-100 flex flex-col justify-center items-center shadow-md">
                    <h1 className="text-2xl text-center font-bold mb-2">
                        {statsData?.data.totalTickets}
                    </h1>
                    <p className="text-brand-purple-700 font-bold  text-center ">
                        Tickets Generated
                    </p>
                </div>
            </div>
            <div className="flex justify-between gap-10 p-6  h-[calc(100vh-260px)] sm:flex-col lg:flex-row">
                <div className="bg-white shadow-md w-full">
                    <div className="flex flex-wrap justify-between p-6">
                        <h1 className="font-bold">Revenue</h1>
                        <p>Total revenue : {statsData?.data.totalRevenue}</p>
                    </div>
                    {isStatsLoading ? (
                        <div className="flex w-full h-full justify-center items-center">
                            <RiLoaderFill className="animate-spin h-8 w-8" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%" className="bg-white">
                            <LineChart width={300} height={100} data={stats}>
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                />
                                <XAxis dataKey="date" />
                                <YAxis />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

Revenue.Layout = DashboardLayout;
Revenue.RequireAuth = true;
export default Revenue;
