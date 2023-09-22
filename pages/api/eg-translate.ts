import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const apiUrl = `${process.env.NEXT_PUBLIC_EG_API}/api/translate_api`;
    const apiKey = '6fdb15a8-23e4-405c-a495-c23ca0d1871d';
    const requestData = req.body;

    const headers = {
      Accept: 'application/json',
      'earthguide-api-key': apiKey,
      'earthguide-client': 'pwa',
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers,
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error making API request:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while fetching data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
