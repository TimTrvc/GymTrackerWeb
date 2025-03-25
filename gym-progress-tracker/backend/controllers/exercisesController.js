const getAllExercises = async (req, res) => {
    const pool = req.app.get('db');

    try {
        const result = await pool.query('SELECT * FROM exercises');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fehler beim Abrufen der Übungen:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Übungen' });
    }
};

const getExerciseById = async (req, res) => {
    const pool = req.app.get('db');
    const { exercise_id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM exercises WHERE exercise_id = $1', [exercise_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Übung nicht gefunden' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Fehler beim Abrufen der Übung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Abrufen der Übung' });
    }
};

const addExercise = async (req, res) => {
    const pool = req.app.get('db');
    const {
      category_id,
      name,
      description,
      instructions,
      difficulty_level,
      primary_muscle_group,
      secondary_muscle_groups,
      equipment_needed,
      is_compound,
      video_url,
      image_url,
      is_public
    } = req.body;
    const created_by = req.user?.id || null; // Optional: Auth middleware
  
    try {
      const result = await pool.query(
        `INSERT INTO exercises (category_id, name, description, instructions, difficulty_level, 
         primary_muscle_group, secondary_muscle_groups, equipment_needed, is_compound, video_url, 
         image_url, created_by, is_public) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
         RETURNING exercise_id, name`,
        [
          category_id,
          name,
          description,
          instructions,
          difficulty_level,
          primary_muscle_group,
          secondary_muscle_groups,
          equipment_needed,
          is_compound,
          video_url,
          image_url,
          created_by,
          is_public
        ]
      );
  
      res.status(201).json({
        message: 'Übung erfolgreich hinzugefügt',
        exercise: result.rows[0]
      });
    } catch (err) {
      console.error('Fehler beim Hinzufügen der Übung:', err);
      res.status(500).json({ error: 'Serverseiten-Fehler beim Hinzufügen der Übung' });
    }
  };

const updateExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { exercise_id } = req.params;
    const {
        category_id,
        name,
        description,
        instructions,
        difficulty_level,
        primary_muscle_group,
        secondary_muscle_groups,
        equipment_needed,
        is_compound,
        video_url,
        image_url,
        is_public
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE exercises 
             SET category_id = $1, name = $2, description = $3, instructions = $4, difficulty_level = $5, 
                 primary_muscle_group = $6, secondary_muscle_groups = $7, equipment_needed = $8, 
                 is_compound = $9, video_url = $10, image_url = $11, is_public = $12 
             WHERE exercise_id = $13 
             RETURNING exercise_id, name`,
            [
                category_id,
                name,
                description,
                instructions,
                difficulty_level,
                primary_muscle_group,
                secondary_muscle_groups,
                equipment_needed,
                is_compound,
                video_url,
                image_url,
                is_public,
                exercise_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Übung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Übung erfolgreich aktualisiert',
            exercise: result.rows[0]
        });
    } catch (err) {
        console.error('Fehler beim Aktualisieren der Übung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Aktualisieren der Übung' });
    }
};

const deleteExercise = async (req, res) => {
    const pool = req.app.get('db');
    const { exercise_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM exercises 
             WHERE exercise_id = $1 
             RETURNING exercise_id`,
            [exercise_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Übung nicht gefunden' });
        }

        res.status(200).json({
            message: 'Übung erfolgreich gelöscht',
            exercise_id: result.rows[0].exercise_id
        });
    } catch (err) {
        console.error('Fehler beim Löschen der Übung:', err);
        res.status(500).json({ error: 'Serverseiten-Fehler beim Löschen der Übung' });
    }
};

module.exports = { getAllExercises, getExerciseById, addExercise, updateExercise, deleteExercise };