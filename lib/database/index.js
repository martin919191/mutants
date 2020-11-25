// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

class Database {

    constructor() {
        this.datastore = new Datastore();
    }


    async quickstart() {
        // The kind for the new entity
        const kind = 'Task';

        // The name/ID for the new entity
        const name = 'sampletask1';

        // The Cloud Datastore key for the new entity
        const taskKey = this.datastore.key([kind, name]);

        // Prepares the new entity
        const task = {
            key: taskKey,
            data: {
                description: 'Buy milk',
            },
        };

        // Saves the entity
        await this.datastore.save(task);
        console.log(`Saved ${task.key.name}: ${task.data.description}`);
    }


}

module.exports = Database;