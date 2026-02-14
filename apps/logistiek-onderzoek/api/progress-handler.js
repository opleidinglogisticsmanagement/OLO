/**
 * Progress API Handler - Voortgang opslaan en ophalen via Neon Postgres
 *
 * GET /api/progress?userId=xxx - Haal voortgang op
 * POST /api/progress - Sla voortgang op (body: { userId, goalId, progress?, status? })
 *
 * @requires @neondatabase/serverless
 * @requires POSTGRES_URL of DATABASE_URL (Vercel Postgres/Neon env)
 */

/**
 * Lees request body voor POST
 * @param {object} req - Node.js request
 * @returns {Promise<object>}
 */
function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => {
            try {
                const body = Buffer.concat(chunks).toString('utf8');
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

/**
 * Handler voor /api/progress
 * @param {object} req - Request
 * @param {object} res - Response
 */
async function progressHandler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('[Progress API] POSTGRES_URL or DATABASE_URL not set');
        res.status(500).json({ error: 'Database not configured' });
        return;
    }

    const { neon } = require('@neondatabase/serverless');
    const sql = neon(dbUrl);

    try {
        if (req.method === 'GET') {
            const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
            const userId = url.searchParams.get('userId');
            if (!userId) {
                res.status(400).json({ error: 'userId is required' });
                return;
            }

            const rows = await sql`SELECT goal_id, progress, status, completed_at, updated_at FROM progress WHERE user_id = ${userId}`;
            res.status(200).json(rows);
        } else if (req.method === 'POST') {
            const body = await readBody(req);
            const { userId, goalId, progress = 100, status = 'completed' } = body;

            if (!userId || !goalId) {
                res.status(400).json({ error: 'userId and goalId are required' });
                return;
            }
            const completedAt = status === 'completed' ? new Date() : null;

            await sql`
                INSERT INTO progress (user_id, goal_id, progress, status, completed_at, updated_at)
                VALUES (${userId}, ${goalId}, ${Number(progress)}, ${status}, ${completedAt}, NOW())
                ON CONFLICT (user_id, goal_id)
                DO UPDATE SET
                    progress = EXCLUDED.progress,
                    status = EXCLUDED.status,
                    completed_at = EXCLUDED.completed_at,
                    updated_at = NOW()
            `;

            res.status(200).json({ success: true });
        } else if (req.method === 'OPTIONS') {
            res.status(204).end();
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('[Progress API] Error:', error);
        res.status(500).json({
            error: 'Database error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = progressHandler;
