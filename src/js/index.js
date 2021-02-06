import 'css/main.css'
import DATA from 'assets/data.json';
import VIZ from 'assets/viz.json';

class Util {
    static setIcon(domElement, itemName) {
        if (VIZ.offsets[itemName] === undefined) {
            console.warn(`item icon not found. : itemName=${itemName}`);
            return;
        }

        const offsetX = VIZ.offsets[itemName].x * VIZ.width;
        const offsetY = VIZ.offsets[itemName].y * VIZ.height;
        domElement.style.width = '16px';
        domElement.style.height = '16px';
        domElement.style.backgroundImage = 'url("assets/icon.png")';
        domElement.style.backgroundPosition = `${-offsetX}px ${-offsetY}px`
    }
}

class TableRenderer {
    constructor() {
        this._table = document.createElement('table');

        this._header = document.createElement('thead');
        this._table.appendChild(this._header);

        const row = document.createElement('tr');
        this._header.appendChild(row);

        const headerName = document.createElement('td');
        headerName.textContent = 'Name';
        row.appendChild(headerName);

        const headerAmount = document.createElement('td');
        headerAmount.textContent = 'Amount (/m)';
        row.appendChild(headerAmount);

        const headerFacilities = document.createElement('td');
        headerFacilities.textContent = 'Facilities';
        row.appendChild(headerFacilities);

        this._body = document.createElement('tbody');
        this._table.appendChild(this._body);
    }

    get domElement() { return this._table; }

    clearChildren(dom) {
        while (dom.children.length > 0) {
            dom.removeChild(dom.children[0]);
        }
    }

    update(data) {
        this.clearChildren(this._body);

        for (const name in data) {
            const row = document.createElement('tr');
            this._body.appendChild(row);

            const cellName = document.createElement('td');
            row.appendChild(cellName);
            cellName.classList.add('item-name');
            {
                const nameIcon = document.createElement('div');
                cellName.appendChild(nameIcon);
                Util.setIcon(nameIcon, name);

                const nameMain = document.createElement('div');
                cellName.appendChild(nameMain);
                nameMain.textContent = name;
            }

            const cellAmount = document.createElement('td');
            row.appendChild(cellAmount);
            cellAmount.classList.add('item-amount');
            cellAmount.textContent = data[name].amount.toFixed(1);

            const cellFacilities = document.createElement('td');
            row.appendChild(cellFacilities);
            cellFacilities.classList.add('item-facilities');
            if (data[name].facilities !== null) {
                cellFacilities.textContent = data[name].facilities.toFixed(3);
            }
        }
    }
}

class Item {
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

class App {
    constructor() {
        this._renderer = new TableRenderer();
        document.body.appendChild(this._renderer.domElement);

        const inputTargetAmount = document.querySelector('#target-amount');
        inputTargetAmount.addEventListener('input', (e) => {
            const f = parseFloat(e.target.value);

            if (isNaN(f)) {
                return;
            }

            this._curAmount = f;

            this.setTarget(this._targetItemName, f);
        });

        this._usedFacilityMap = {
            "assembler": "assembling-machine-mk3",
            "smelting-facility": "smelter",
            "chemical-facility": "chemical-plant",
            "refining-facility": "oil-refinery",
            "research-facility": "matrix-lab",
            "fractionation-facility": "fractionator",
            "particle-collider": "miniature-particle-collider"
        };

        this._overrideRecipeMap = {
            "refined-oil": "plasma-refining",
            "deuterium": "deuterium-fractionation",
            "antimatter": "mass-energy-storage"
        };

        this._order = {};
        for (const [index, name] of Object.keys(VIZ.offsets).entries()) {
            this._order[name] = index;
        }

        this._targetItemName = 'universe-matrix';
        this._targetItem = new Item(this._targetItemName, this._usedFacilityMap, this._overrideRecipeMap);
        Util.setIcon(document.querySelector('#target-icon'), this._targetItemName);
        document.querySelector('#target-name').textContent = this._targetItemName;

        const rareOreChooserContainer = document.querySelector('#rare-ore-chooser-container');
        for (const oreName in DATA.advanced_recipe) {
            const container = document.createElement('div');
            rareOreChooserContainer.appendChild(container);

            const checkbox = document.createElement('input');
            container.appendChild(checkbox);
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('value', oreName);
            checkbox.addEventListener('change', (e) => {
                const itemName = DATA.advanced_recipe[e.target.value].item;
                const recipeName = DATA.advanced_recipe[e.target.value].recipe;

                this._overrideRecipeMap[itemName] = e.target.checked ? recipeName : itemName;

                this._targetItem = new Item(this._targetItemName, this._usedFacilityMap, this._overrideRecipeMap);

                this.setTarget(this._targetItemName, this._curAmount);
            });

            const icon = document.createElement('div');
            container.appendChild(icon);
            Util.setIcon(icon, oreName);

            const label = document.createElement('label');
            container.appendChild(label);
            label.textContent = oreName;
        }

        const defaultAmount = 100;
        this._curAmount = defaultAmount;
        inputTargetAmount.value = this._curAmount.toString(10);
        this.setTarget(this._targetItemName, this._curAmount);
    }

    setTarget(name, amountPerMin) {
        this._targetItem.update(amountPerMin);
        const data = this._targetItem.getIngredients();

        const pairs = Object.entries(data);
        pairs.sort((e1, e2) => {
            const o1 = this._order[e1[0]];
            const o2 = this._order[e2[0]];

            return o1 < o2 ? -1 : o1 > o2 ? 1 : 0;
        });
        const sortedData = Object.fromEntries(pairs);

        this._renderer.update(sortedData);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
