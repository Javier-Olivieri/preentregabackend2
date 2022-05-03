class ContenedorMemoria {

    constructor() {
        this.items = [];
        this.cuentaGlobal = 0;
    }

    save(item) {
        try {
            this.cuentaGlobal++;
            const productToSave = { ...item, id: this.cuentaGlobal }
            this.items.push(productToSave);
            return productToSave.id;
        }
        catch (error) {
            throw new Error(`Hubo un problema en save(): ${error.message}`);
        }
    }

    getById(id) {
        try {
            const idToFind = parseInt(id);
            const result = this.items.filter(prod => prod.id === idToFind);
            if (result.length === 0) {
                return null;
            } else {
                return result[0];
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    getAll() {
        try {
            return this.items;
        }
        catch (error) {
            throw new Error(`Hubo un problema en getAll(): ${error.message}`)
        }
    }

    deleteById(id) {
        try {
            const element = this.getById(id);
            if (element === null) {
                return null;
            } else {
                const pos = this.items.map(prod => prod.id).indexOf(element.id);
                this.items.splice(pos, 1);
                return element.id;
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    updateById(id, productForUpdate) {
        try {
            const element = this.getById(id);
            if (element === null) {
                return null;
            } else {
                const pos = this.items.map(prod => prod.id).indexOf(element.id);
                this.items[pos] = { ...productForUpdate, id: element.id };
                return this.items[pos].id;
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    deleteAll() {
        try {
            this.items = [];
        }
        catch (error) {
            console.log(error);
            throw new Error(`Hubo un problema en deleteAll(): ${error.message}`)
        }
    }
}

export default ContenedorMemoria;