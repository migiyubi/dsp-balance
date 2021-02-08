import { IconElement } from 'IconElement'

export class TargetAmountRowElement {
    constructor(itemName, onInput, defaultValue, domElement=document.createElement('tr')) {
        const cellName = document.createElement('td');
        domElement.appendChild(cellName);
        cellName.classList.add('item-name');
        {
            const wrapper = document.createElement('div');
            cellName.appendChild(wrapper);
            {
                const nameIcon = new IconElement(itemName).domElement;
                wrapper.appendChild(nameIcon);

                const nameMain = document.createElement('div');
                wrapper.appendChild(nameMain);
                nameMain.textContent = itemName;
            }
        }

        const cellAmount = document.createElement('td');
        cellAmount.classList.add('target-amount');
        domElement.appendChild(cellAmount);
        {
            const wrapper = document.createElement('div');
            cellAmount.appendChild(wrapper);
            {
                const amountInput = document.createElement('input');
                wrapper.appendChild(amountInput);
                amountInput.setAttribute('type', 'text');
                amountInput.value = defaultValue;
                amountInput.addEventListener('input', (e) => {
                    onInput(e);
                });

                const unit = document.createElement('div');
                wrapper.appendChild(unit);
                unit.textContent = '/m';
            }
        }

        this._domElement = domElement;
    }

    get domElement() { return this._domElement; }
}
