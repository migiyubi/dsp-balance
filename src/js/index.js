import 'css/main.css';
import DATA from 'assets/data.json';
import VIZ from 'assets/viz.json';

import { TableRenderer } from 'TableRenderer';
import { Item } from 'Item';
import { TargetAmountRowElement } from 'TargetAmountRowElement';
import { IconElement } from 'IconElement';

class App {
    constructor() {
        this._renderer = new TableRenderer();
        document.querySelector('#table-container').appendChild(this._renderer.domElement);

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

        this._overrideIconMap = {};

        this._order = {};
        for (const [index, name] of Object.keys(VIZ.offsets).entries()) {
            this._order[name] = index;
        }

        const defaultData = [
            { name: 'universe-matrix', amount: 100.0 },
            { name: 'small-carrier-rocket', amount: 0.0 },
            { name: 'solar-sail', amount: 0.0 },
            { name: 'antimatter-fuel-rod', amount: 0.0 }
        ];
        this._targetItems = [];

        const targetAmountTable = document.querySelector('#target-amount-table');
        for (const d of defaultData) {
            const target = {
                item: new Item(d.name, this._usedFacilityMap, this._overrideRecipeMap),
                amount: d.amount
            };
            this._targetItems.push(target);

            const row = new TargetAmountRowElement(d.name, (e) => {
                let f = parseFloat(e.target.value);

                if (isNaN(f)) {
                    f = 0.0;
                }

                target.amount = f;

                this.update();
            }, d.amount);
            targetAmountTable.appendChild(row.domElement);
        }

        const rareOreChooserContainer = document.querySelector('#rare-ore-chooser-container');
        for (const oreName in DATA.advanced_recipe) {
            const container = document.createElement('div');
            rareOreChooserContainer.appendChild(container);

            const checkbox = document.createElement('input');
            container.appendChild(checkbox);
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('value', oreName);
            checkbox.addEventListener('change', (e) => {
                for (const {item, recipe} of DATA.advanced_recipe[e.target.value]) {
                    this._overrideRecipeMap[item] = e.target.checked ? recipe : item;
                    this._overrideIconMap[item] = e.target.checked ? recipe : item;
                }

                for (const target of this._targetItems) {
                    target.item = new Item(target.item.name, this._usedFacilityMap, this._overrideRecipeMap);
                }

                this.update();
            });

            const icon = new IconElement(oreName).domElement;
            container.appendChild(icon);

            const label = document.createElement('label');
            container.appendChild(label);
            label.textContent = oreName;
        }

        this.update();
    }

    update() {
        const data = {};
        for (const target of this._targetItems) {
            target.item.update(target.amount);
            const subData = target.item.getIngredients();

            for (const [k, v] of Object.entries(subData)) {
                if (data[k] === undefined) {
                    data[k] = v;
                }
                else {
                    data[k].amount += v.amount;

                    if ((data[k].facilities !== null) && (v.facilities !== null)) {
                        data[k].facilities += v.facilities;
                    }
                }
            }
        }

        const siftedData = {};
        for (const [k, v] of Object.entries(data)) {
            // show only significant values.
            if (v.amount !== 0.0) {
                siftedData[k] = v;
            }
        }

        const pairs = Object.entries(siftedData);
        pairs.sort((e1, e2) => {
            const o1 = this._order[e1[0]];
            const o2 = this._order[e2[0]];

            return o1 < o2 ? -1 : o1 > o2 ? 1 : 0;
        });
        const sortedData = Object.fromEntries(pairs);

        this._renderer.update(sortedData, this._overrideIconMap);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
