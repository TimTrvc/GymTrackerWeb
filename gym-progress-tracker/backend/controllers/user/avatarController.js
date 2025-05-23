/**
 * Avatar Controller
 * Handles all avatar-related backend operations including fetching, updating, and progressing the user's avatar
 */

// Get user avatar
const getUserAvatar = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id; // From auth middleware

    try {
        // Check if avatar exists for the user
        const avatarCheck = await pool.query(
            'SELECT * FROM avatar WHERE user_id = $1',
            [userId]
        );

        // If no avatar exists, create a new one with default values
        if (avatarCheck.rows.length === 0) {
            const newAvatar = await pool.query(
                `INSERT INTO avatar 
                (user_id, level, experience, hp, mp, attack, defense, agility, boss_level) 
                VALUES ($1, 1, 0, 10, 10, 10, 10, 10, 0) 
                RETURNING *`,
                [userId]
            );

            return res.status(201).json(newAvatar.rows[0]);
        }

        // Return existing avatar
        res.status(200).json(avatarCheck.rows[0]);
    } catch (err) {
        console.error('Error fetching user avatar:', err);
        res.status(500).json({ error: 'Server error while fetching avatar' });
    }
};

// Update avatar stats
const updateAvatarStats = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const { hp, mp, attack, defense, agility } = req.body;

    try {
        // Check if avatar exists and user has skill points to spend
        const avatarCheck = await pool.query(
            'SELECT * FROM avatar WHERE user_id = $1',
            [userId]
        );

        if (avatarCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Avatar not found' });
        }

        // Update the avatar stats
        const updatedAvatar = await pool.query(
            `UPDATE avatar 
            SET hp = $1, mp = $2, attack = $3, defense = $4, agility = $5, updated_at = NOW() 
            WHERE user_id = $6 
            RETURNING *`,
            [hp, mp, attack, defense, agility, userId]
        );

        res.status(200).json({
            message: 'Avatar stats updated successfully',
            avatar: updatedAvatar.rows[0]
        });
    } catch (err) {
        console.error('Error updating avatar stats:', err);
        res.status(500).json({ error: 'Server error while updating avatar stats' });
    }
};

// Add experience to avatar
const addExperience = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const { experiencePoints } = req.body;
    
    // Accept 0 as a valid value, only reject if undefined, null, or not a number
    if (experiencePoints === undefined || experiencePoints === null || isNaN(experiencePoints)) {
        return res.status(400).json({ error: 'Valid experience points are required' });
    }

    try {
        // Get current avatar state
        const avatarCheck = await pool.query(
            'SELECT * FROM avatar WHERE user_id = $1',
            [userId]
        );

        // If no avatar exists, create a new one
        if (avatarCheck.rows.length === 0) {
            const newAvatar = await pool.query(
                `INSERT INTO avatar 
                (user_id, level, experience, hp, mp, attack, defense, agility, boss_level) 
                VALUES ($1, 1, $2, 10, 10, 10, 10, 10, 0) 
                RETURNING *`,
                [userId, experiencePoints]
            );

            return res.status(201).json({
                message: 'Avatar created and experience added',
                avatar: newAvatar.rows[0],
                leveledUp: false
            });
        }

        // Calculate new experience and check for level up
        let currentAvatar = avatarCheck.rows[0];
        let newExperience = currentAvatar.experience + parseInt(experiencePoints);
        let newLevel = currentAvatar.level;
        let leveledUp = false;

        // Level up if experience reaches 100
        if (newExperience >= 100) {
            newLevel = currentAvatar.level + 1;
            newExperience -= 100;
            leveledUp = true;
        }

        // Update avatar with new experience and level
        const updatedAvatar = await pool.query(
            `UPDATE avatar 
            SET experience = $1, level = $2, updated_at = NOW() 
            WHERE user_id = $3 
            RETURNING *`,
            [newExperience, newLevel, userId]
        );

        res.status(200).json({
            message: 'Experience added successfully',
            avatar: updatedAvatar.rows[0],
            leveledUp
        });
    } catch (err) {
        console.error('Error adding experience to avatar:', err);
        res.status(500).json({ error: 'Server error while adding experience' });
    }
};

// Update boss level
const updateBossLevel = async (req, res) => {
    const pool = req.app.get('db');
    const userId = req.users.id;
    const { bossLevel } = req.body;

    if (isNaN(bossLevel) || bossLevel < 0) {
        return res.status(400).json({ error: 'Valid boss level is required' });
    }

    try {
        // Check if avatar exists
        const avatarCheck = await pool.query(
            'SELECT * FROM avatar WHERE user_id = $1',
            [userId]
        );

        if (avatarCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Avatar not found' });
        }

        // Update the avatar boss level
        const updatedAvatar = await pool.query(
            `UPDATE avatar 
            SET boss_level = $1, updated_at = NOW() 
            WHERE user_id = $2 
            RETURNING *`,
            [bossLevel, userId]
        );

        res.status(200).json({
            message: 'Boss level updated successfully',
            avatar: updatedAvatar.rows[0]
        });
    } catch (err) {
        console.error('Error updating boss level:', err);
        res.status(500).json({ error: 'Server error while updating boss level' });
    }
};

module.exports = {
    getUserAvatar,
    updateAvatarStats,
    addExperience,
    updateBossLevel
};
