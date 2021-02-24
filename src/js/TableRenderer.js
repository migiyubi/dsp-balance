import { IconElement } from 'IconElement';

export class TableRenderer {
    constructor() {
        this._group = document.createElement('div');
        this._group.setAttribute('id', 'amount-tables');

        this._tableBodies = [];
        this._curData = {};
        this._curTableNum = 0;

        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.onWindowResize();
    }

    get domElement() { return this._group; }

    onWindowResize() {
        let tableNum;
        const w = window.innerWidth;

        if (w < 900) {
            tableNum = 1;
        }
        else if (w < 1300) {
            tableNum = 2;
        }
        else {
            tableNum = 3;
        }

        if (this._curTableNum !== tableNum) {
            this._curTableNum = tableNum;
            this.setTableNum(tableNum);
        }
    }

    setTableNum(num) {
        this.clearChildren(this._group);
        this._tableBodies = [];

        for (let i = 0; i < num; i++) {
            const table = document.createElement('table');
            this._group.appendChild(table);

            const header = document.createElement('thead');
            table.appendChild(header);

            this.createHeader(header);

            const tbody = document.createElement('tbody');
            table.appendChild(tbody);

            this._tableBodies.push(tbody);
        }

        this.update(this._curData);
    }

    createHeader(parent) {
        const row = document.createElement('tr');
        parent.appendChild(row);

        const headerName = document.createElement('td');
        headerName.textContent = 'Name';
        row.appendChild(headerName);

        const headerAmount = document.createElement('td');
        headerAmount.textContent = 'Amount (/m)';
        row.appendChild(headerAmount);

        const headerFacilities = document.createElement('td');
        headerFacilities.textContent = 'Facilities';
        row.appendChild(headerFacilities);
    }

    clearChildren(dom) {
        while (dom.children.length > 0) {
            dom.removeChild(dom.children[0]);
        }
    }

    update(data, overrideIconMap={}) {
        this._curData = data;

        const dataLength = Object.keys(data).length;
        const subDataLength = Math.ceil(dataLength / this._tableBodies.length);

        for (const [index, tbody] of this._tableBodies.entries()) {
            const s = index * subDataLength;
            const e = Math.min((index+1) * subDataLength, dataLength);

            const subData = Object.fromEntries(Object.entries(data).slice(s, e));
            this.updateCore(tbody, subData, overrideIconMap);
        }
    }

    updateCore(tbody, data, overrideIconMap) {
        this.clearChildren(tbody);

        for (const name in data) {
            const row = document.createElement('tr');
            tbody.appendChild(row);

            const cellName = document.createElement('td');
            row.appendChild(cellName);
            cellName.classList.add('item-name');
            {
                const wrapper = document.createElement('div');
                cellName.appendChild(wrapper);
                {
                    const n = (overrideIconMap[name] !== undefined) ? overrideIconMap[name] : name;

                    const nameIcon = new IconElement(n).domElement;
                    wrapper.appendChild(nameIcon);

                    const nameMain = document.createElement('div');
                    wrapper.appendChild(nameMain);
                    nameMain.textContent = name;
                }
            }

            const cellAmount = document.createElement('td');
            row.appendChild(cellAmount);
            cellAmount.classList.add('item-amount');
            if (data[name].amount < 0.0) {
                cellAmount.classList.add('surplus');
            }
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
