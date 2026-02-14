/**
 * ProgressService - Voor voortgangstracking via Vercel Postgres
 *
 * Gebruikt anonieme UUID (UserIdManager) voor gebruikersidentificatie.
 * Geen login vereist.
 *
 * @requires UserIdManager
 * @requires POST /api/progress - voortgang opslaan
 * @requires GET /api/progress?userId=xxx - voortgang ophalen
 */
const ProgressService = {
    /**
     * Haal alle voortgang op voor de huidige gebruiker
     * @returns {Promise<Array>} Array van progress items
     */
    async getProgress() {
        const userId = window.UserIdManager?.getOrCreate?.() ?? this._getUserIdFallback();
        const res = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch progress: ${res.status}`);
        }
        return res.json();
    },

    /**
     * Sla voortgang op voor een leerdoel
     * @param {string} goalId - ID van het leerdoel (bijv. 'ld-w2-1')
     * @param {number} [progress=100] - Voortgang 0-100
     * @param {string} [status='completed'] - 'not_started' | 'in_progress' | 'completed'
     * @returns {Promise<Object>} Response
     */
    async saveProgress(goalId, progress = 100, status = 'completed') {
        const userId = window.UserIdManager?.getOrCreate?.() ?? this._getUserIdFallback();
        const res = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                goalId,
                progress,
                status
            })
        });
        if (!res.ok) {
            throw new Error(`Failed to save progress: ${res.status}`);
        }
        return res.json();
    },

    /**
     * Fallback als UserIdManager niet geladen is
     * @returns {string}
     * @private
     */
    _getUserIdFallback() {
        const key = 'olo-user-id';
        let id = localStorage.getItem(key);
        if (!id) {
            id =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                          const r = (Math.random() * 16) | 0;
                          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                      });
            localStorage.setItem(key, id);
        }
        return id;
    }
};

if (typeof window !== 'undefined') {
    window.ProgressService = ProgressService;
}
