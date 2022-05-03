import admin from 'firebase-admin';
import serviceAccount from '../../proyecto-final-bcf78-firebase-adminsdk-jhl9p-8075fc79ea.json';

class ContenedorFirebase {

    constructor(collection, isInitialized) {
        if (isInitialized) {
            this.admin = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://proyecto-final-bcf78.firebaseio.com"
            });
        }

        this.collection = collection;
        this.db = admin.firestore();
        this.query = this.db.collection(this.collection);
    }

    async save(objectToSave) {
        try {
            const doc = this.query.doc();
            await doc.create(objectToSave);
            return doc.id;
        }
        catch (error) {
            throw new Error(`Hubo un problema en save(): ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const doc = this.query.doc(`${id}`);
            const item = await doc.get();
            const response = item.data();
            if (response !== undefined)
                return { ...response, id: id };
            else
                return null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    async getAll() {
        try {
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;

            const response = docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            return response;
        }
        catch (error) {
            throw new Error(`Hubo un problema en getAll(): ${error.message}`)
        }
    }

    async deleteById(id) {
        try {
            const itemToEliminate = await this.getById(id);
            if (itemToEliminate !== null) {
                const doc = this.query.doc(`${id}`);
                await doc.delete();
                return id;
            }
            else
                return null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteAll() {
        try {
            const all = await this.getAll();
            for (let i = 0; i < all.length; i++) {
                this.deleteById(all[i].id);
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(`Hubo un problema en deleteAll(): ${error.message}`)
        }
    }

    async updateById(id, object) {
        try {
            const itemToUpdate = await this.getById(id);
            if (itemToUpdate !== null) {
                const doc = this.query.doc(`${id}`);
                await doc.update(object);
                return id;
            }
            else
                return null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default ContenedorFirebase;