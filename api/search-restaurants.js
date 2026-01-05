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
        const { location, radius = 1500, keyword = 'restaurant' } = req.query;
        
        if (!location) {
            return res.status(400).json({
                success: false,
                error: 'Location parameter is required'
            });
        }

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
            {
                params: {
                    location: location,
                    radius: radius,
                    type: 'restaurant',
                    keyword: keyword,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        );

        if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
            res.status(200).json({
                success: true,
                data: response.data.results,
                count: response.data.results.length
            });
        } else {
            res.status(400).json({
                success: false,
                error: response.data.status
            });
        }
    } catch (error) {
        console.error('Error searching restaurants:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to search restaurants'
        });
    }
}