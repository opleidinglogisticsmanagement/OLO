/**
 * UserIdManager - Beheert anonieme gebruikers-ID voor voortgangstracking
 *
 * Gebruikt UUID opgeslagen in localStorage. Geen login vereist.
 * Bij eerste bezoek wordt een UUID gegenereerd en opgeslagen.
 *
 * @see ProgressService.js - Gebruikt deze manager voor API-calls
 */
const UserIdManager = {
    STORAGE_KEY: 'olo-user-id',

    /**
     * Haal bestaande gebruikers-ID op of genereer nieuwe
     * @returns {string} UUID voor de gebruiker
     */
    getOrCreate() {
        let id = localStorage.getItem(this.STORAGE_KEY);
        if (!id) {
            id =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : this._fallbackUUID();
            localStorage.setItem(this.STORAGE_KEY, id);
        }
        return id;
    },

    /**
     * Fallback UUID-generatie voor oudere browsers
     * @returns {string} UUID v4 format
     * @private
     */
    _fallbackUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
};

// Export voor gebruik in andere modules
if (typeof window !== 'undefined') {
    window.UserIdManager = UserIdManager;
}
