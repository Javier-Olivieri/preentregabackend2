import fs from 'fs';

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async save(object) {
        try {
            const stringFileContent = await fs.promises.readFile(this.ruta, 'utf-8');
            let contentToSave;
            let id;

            if (stringFileContent === '') {
                contentToSave = [{ ...object, id: 1 }];
                id = 1;
            }
            else {
                let fileContent = JSON.parse(stringFileContent);
                id = fileContent[fileContent.length - 1].id + 1;
                contentToSave = fileContent;
                contentToSave.push({ ...object, id: id });
            }
            await fs.promises.writeFile(this.ruta, JSON.stringify(contentToSave, null, 2));
            return id;

        } catch (e) {
            throw new Error(`Hubo un problema en save(): ${e.message}`);
        }
    }

    async getById(idParam) {
        const id = Number(idParam);
        try {
            const stringFileContent = await fs.promises.readFile(this.ruta, 'utf-8');
            if (stringFileContent === '') {
                return null;
            }
            else {
                let fileContent = JSON.parse(stringFileContent);
                const result = fileContent.filter(elem => elem.id === id);
                if (result.length === 0) {
                    return null;
                } else {
                    return result[0];
                }
            }

        } catch (e) {
            throw new Error(`Hubo un problema en getById(): ${e.message}`)
        }
    }

    async getAll() {
        try {
            const fileContent = await fs.promises.readFile(this.ruta, 'utf-8');
            if (fileContent === '') {
                return [];
            }
            return JSON.parse(fileContent);;
        } catch (e) {
            throw new Error(`Hubo un problema en getAll(): ${e.message}`);
        }
    }

    async deleteById(idParam) {
        const id = Number(idParam);
        const element = await this.getById(id);
        if (element === null) {
            return null;
        } else {
            const allElements = await this.getAll();

            if (allElements.length === 1)
                await this.deleteAll();
            else {
                const contentToSave = allElements.filter(elem => elem.id !== id);
                await fs.promises.writeFile(this.ruta, JSON.stringify(contentToSave, null, 2));
            }
            return id;
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.ruta, '');

        } catch (e) {
            throw new Error(`Hubo un problema en deleteAll(): ${e.message}`);
        }
    }

    async updateById(idParam, object) {
        const id = Number(idParam);
        const element = await this.getById(id);
        if (element === null) {
            return null;
        } else {
            const all = await this.getAll();
            const index = all.findIndex(elem => elem.id == id);
            all[index] = { ...object, id: id };
            await fs.promises.writeFile(this.ruta, JSON.stringify(all, null, 2));
            return id;
        }
    }
}

export default ContenedorArchivo;