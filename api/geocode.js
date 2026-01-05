import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { address } = req.query;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                error: 'Address parameter is required'
            });
        }

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
                params: {
                    address: address,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        );

        if (response.data.status === 'OK') {
            res.status(200).json({
                success: true,
                data: response.data.results[0]
            });
        } else {
            res.status(400).json({
                success: false,
                error: response.data.status
            });
        }
    } catch (error) {
        console.error('Error geocoding:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to geocode address'
        });
    }
}