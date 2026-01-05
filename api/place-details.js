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
        const { placeId } = req.query;
        
        if (!placeId) {
            return res.status(400).json({
                success: false,
                error: 'placeId parameter is required'
            });
        }

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            {
                params: {
                    place_id: placeId,
                    fields: 'name,formatted_address,rating,user_ratings_total,opening_hours,price_level,photos,geometry',
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        );

        if (response.data.status === 'OK') {
            res.status(200).json({
                success: true,
                data: response.data.result
            });
        } else {
            res.status(400).json({
                success: false,
                error: response.data.status
            });
        }
    } catch (error) {
        console.error('Error fetching place details:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch place details'
        });
    }
}