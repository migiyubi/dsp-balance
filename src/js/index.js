import 'css/main.css'
import DATA from 'assets/data.json';
import VIZ from 'assets/viz.json';

class TableRenderer {
    constructor(root=document.body) {
        this._table = document.createElement('table');
        root.appendChild(this._table);

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
            if (data[name].facilities !== undefined) {
                cellFacilities.textContent = data[name].facilities.toFixed(3);
            }
        }
    }
}

class Core {
    constructor() {
        this._usedFacilityMap = {
            "assembler": "assembling-machine-mk3",
            "smelting-facility": "smelter",
            "chemical-facility": "chemical-plant",
            "research-facility": "matrix-lab",
            "fractionation-facility": "fractionator",
            "particle-collider": "miniature-particle-collider"
        };

        this._order = {};
        for (const [index, name] of Object.keys(VIZ.offsets).entries()) {
            this._order[name] = index;
        }
    }

    calc(root, amountPerMinute=1, ret={}) {
        // calculate amount.
        const acc = (outputName, outputAmount) => {
            if (ret[outputName] === undefined) {
                ret[outputName] = { amount: 0.0 };
            }

            ret[outputName].amount += outputAmount;

            const r = DATA.recipe[outputName];

            if (r === undefined) {
                return;
            }

            const cycles = outputAmount / r.outputs[outputName];

            for (const inputName in r.inputs) {
                const inputAmount = cycles * r.inputs[inputName];
                acc(inputName, inputAmount);
            }
        };

        acc(root, amountPerMinute);

        // calculate number of facilities.
        for (const name in ret) {
            const r = DATA.recipe[name];

            if (r === undefined) {
                continue;
            }

            const usedFacility = this._usedFacilityMap[r.facility];
            const craftingSpeed = DATA.facility[usedFacility].crafting_speed;
            const cyclesPerFacility = craftingSpeed * 60.0 / r.time_sec;
            const amountPerFacility = cyclesPerFacility * r.outputs[name];
            const facilities = ret[name].amount / amountPerFacility;

            ret[name].facilities = facilities;
        }

        // sort.
        const pairs = Object.entries(ret);
        pairs.sort((e1, e2) => {
            const o1 = this._order[e1[0]];
            const o2 = this._order[e2[0]];

            return o1 < o2 ? -1 : o1 > o2 ? 1 : 0;
        });
        ret = Object.fromEntries(pairs);

        return ret;
    }
}

class App {
    constructor() {
        this._core = new Core();
        this._renderer = new TableRenderer();

        const balance = this._core.calc('universe-matrix');
        this._renderer.update(balance);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
