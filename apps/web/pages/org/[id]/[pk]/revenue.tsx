import React, { useState } from 'react';
import axios from 'axios';
import { DashboardLayout } from '@app/layout';

const Revenue = () => {
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeRequest = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
            const apiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions'; // Updated model name

            const prompt = 'Write a ReactJS component that';
            const response = await axios.post(
                apiUrl,
                {
                    prompt,
                    max_tokens: 150,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                },
            );

            setResponse(response.data.choices[0].text);
        } catch (error) {
            console.error('Error making OpenAI request', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Revenue</h1>

            <div className="flex flex-wrap gap-10 justify-center mt-5">
                <div className="rounded-md h-48 w-80 mx-2 bg-brand-green-100 flex flex-col justify-center items-center">
                    <h1 className="text-[30px] text-center font-bold">$546</h1>
                    <p className="text-[12px] font-bold text-center">Total Revenue</p>
                </div>

                <div className="rounded-md h-48 w-80 mx-2 bg-brand-yellow-100 flex flex-col justify-center items-center">
                    <h1 className="text-[30px] text-center font-bold">$546</h1>
                    <p className="text-[12px] font-bold text-center">Max Revenue Per Day</p>
                </div>

                <div className="rounded-md h-48 w-80 mx-2 bg-brand-blue-100 flex flex-col justify-center items-center">
                    <h1 className="text-[30px] text-center font-bold">$546</h1>
                    <p className="text-[12px] font-bold text-center">Average Ticket Price</p>
                </div>
            </div>

            <div className="rounded-md mt-10 h-80  mx-2 bg-brand-pink-100">
                <div className="flex justify-center items-center h-full">
                    <button onClick={makeRequest} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate React Component'}
                    </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {response && <p>{response}</p>}
            </div>
        </div>
    );
};

Revenue.Layout = DashboardLayout;
Revenue.RequireAuth = true;
export default Revenue;
