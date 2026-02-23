const { app } = require('@azure/functions');
const fetch = require('node-fetch');

const apiEndpoint = "https://todo-app.delightfulpebble-ecad0b94.northeurope.azurecontainerapps.io/api/tasks";

app.http('function-paszkowski', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            // Récupération des tâches depuis ton API existante
            const response = await fetch(apiEndpoint);
            
            // Vérifier que la réponse est OK
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const tasks = await response.json();

            // Compter le nombre de tâches
            const taskCount = Array.isArray(tasks) ? tasks.length : 0;

            // Retourner le résultat en JSON
            return {
                status: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, // CORS
                body: { count: taskCount }
            };
        } catch (error) {
            context.log.error('Erreur lors de la récupération des tâches:', error);
            return {
                status: 500,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: { error: error.message }
            };
        }
    }
});
