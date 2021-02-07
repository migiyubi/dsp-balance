import 'css/main.css'
import DATA from 'assets/data.json';
import VIZ from 'assets/viz.json';

import { TableRenderer } from 'TableRenderer'
import { Item } from 'Item'
import { IconElement } from 'IconElement'

class App {
    constructor() {
        this._renderer = new TableRenderer();
        document.querySelector('#table-container').appendChild(this._renderer.domElement);

        const inputTargetAmount = document.querySelector('#target-amount');
        inputTargetAmount.setAttribute('type', 'text');
        inputTargetAmount.addEventListener('input', (e) => {
            const f = parseFloat(e.target.value);

            if (isNaN(f)) {
                return;
            }

            this._curAmount = f;

            this.setTarget(f);
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
        new IconElement(this._targetItemName, document.querySelector('#target-icon'));
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

                this.setTarget(this._curAmount);
            });

            const icon = new IconElement(oreName);
            container.appendChild(icon);

            const label = document.createElement('label');
            container.appendChild(label);
            label.textContent = oreName;
        }

        const defaultAmount = 100;
        this._curAmount = defaultAmount;
        inputTargetAmount.value = this._curAmount.toString(10);
        this.setTarget(this._curAmount);
    }

    setTarget(amountPerMin) {
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
