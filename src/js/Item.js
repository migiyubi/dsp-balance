import DATA from 'assets/data.json';

export class Item {
    constructor(name, usedFacilityMap, overrideRecipeMap) {
        const recipeName = (overrideRecipeMap[name] !== undefined) ? overrideRecipeMap[name] : name;
        this._recipe = DATA.recipe[recipeName];
        this._name = name;
        this._usedFacility = (this._recipe !== undefined) ? DATA.facility[usedFacilityMap[this._recipe.facility]] : null;

        this._children = {};
        if (this._recipe !== undefined) {
            for (const sourceName in this._recipe.inputs) {
                this._children[sourceName] = new Item(sourceName, usedFacilityMap, overrideRecipeMap);
            }
        }

        this._ingredients = {};
    }

    get name() { return this._name; }

    update(amount) {
        const r = this._recipe;
        const n = this._name;

        this._ingredients[n] = { amount: amount, facilities: null };

        if (r === undefined) {
            return;
        }

        const cycles = amount / r.outputs[n];
        const minutesPerCycle = r.time_sec / 60.0 / this._usedFacility.crafting_speed;

        this._ingredients[n].facilities = cycles * minutesPerCycle;

        // if the recipe has byproducts, accumulate them as minus productivity.
        for (const [byproductName, byproductAmount] of Object.entries(r.outputs)) {
            if (byproductName === n) {
                continue;
            }

            this._ingredients[byproductName] = { amount: -1.0 * cycles * byproductAmount, facilities: null };
        }

        for (const [sourceName, source] of Object.entries(this._children)) {
            const sourceAmount = cycles * r.inputs[sourceName];
            source.update(sourceAmount);
        }
    }

    getIngredients(ret={}) {
        const n = this._name;

        for (const [name, data] of Object.entries(this._ingredients)) {
            if (ret[name] === undefined) {
                ret[name] = { amount: 0.0, facilities: null };
            }

            if (data.facilities !== null && ret[name].facilities === null) {
                ret[name].facilities = 0.0;
            }

            ret[name].amount += data.amount;

            if (data.facilities !== null) {
                ret[name].facilities += data.facilities;
            }
        }

        for (const source of Object.values(this._children)) {
            source.getIngredients(ret);
        }

        return ret;
    }
}
