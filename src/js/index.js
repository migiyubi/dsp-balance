import 'css/main.css'
import DATA from 'assets/data.json';
import VIZ from 'assets/viz.json';

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
                const offsetX = VIZ.offsets[name].x * VIZ.width;
                const offsetY = VIZ.offsets[name].y * VIZ.height;
                nameIcon.style.width = '16px';
                nameIcon.style.height = '16px';
                nameIcon.style.backgroundImage = 'url("assets/icon.png")';
                nameIcon.style.backgroundPosition = `${-offsetX}px ${-offsetY}px`

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

        this._amount = 0.0;
        this._facilities = (this._recipe !== undefined) ? 0.0 : null;
    }

    update(amount) {
        this._amount = amount;

        const r = this._recipe;
        const n = this._name;

        if (r === undefined) {
            return;
        }

        const cycles = amount / r.outputs[n];
        const minutesPerCycle = r.time_sec / 60.0 / this._usedFacility.crafting_speed;

        this._facilities = cycles * minutesPerCycle;

        for (const [sourceName, source] of Object.entries(this._children)) {
            const sourceAmount = cycles * this._recipe.inputs[sourceName];
            source.update(sourceAmount);
        }
    }

    getIngredients(ret={}) {
        const n = this._name;

        if (ret[n] === undefined) {
            ret[n] = { amount: 0.0, facilities: 0.0 };
        }

        ret[n].amount += this._amount;

        if (this._facilities !== null) {
            ret[n].facilities += this._facilities;
        }
        else {
            ret[n].facilities = null;
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

            this.setTarget('universe-matrix', f);
        });

        this._usedFacilityMap = {
            "assembler": "assembling-machine-mk3",
            "smelting-facility": "smelter",
            "chemical-facility": "chemical-plant",
            "research-facility": "matrix-lab",
            "fractionation-facility": "fractionator",
            "particle-collider": "miniature-particle-collider"
        };

        this._overrideRecipeMap = {};

        this._order = {};
        for (const [index, name] of Object.keys(VIZ.offsets).entries()) {
            this._order[name] = index;
        }

        this._targetItem = new Item('universe-matrix', this._usedFacilityMap, this._overrideRecipeMap);

        const defaultAmount = 100;
        inputTargetAmount.value = defaultAmount.toString(10);
        this.setTarget('universe-matrix', defaultAmount);
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
