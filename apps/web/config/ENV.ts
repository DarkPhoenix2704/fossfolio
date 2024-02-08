export const ENV = {
    api_base: process.env.NEXT_PUBLIC_API_URL + '/api' || 'http://localhost:3001/api',
    web_base_url: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN || 'http://localhost:3000',
    openai_api_key: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    openai_api_url: 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions',
};
