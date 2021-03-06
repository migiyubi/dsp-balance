import VIZ from 'assets/viz.json';

export class IconElement {
    constructor(itemName, domElement=document.createElement('div')) {
        if (VIZ.offsets[itemName] === undefined) {
            console.warn(`item icon not found. : itemName=${itemName}`);
        }
        else {
            const offsetX = VIZ.offsets[itemName].x * VIZ.width;
            const offsetY = VIZ.offsets[itemName].y * VIZ.height;
            domElement.style.backgroundImage = 'url("assets/icon.png")';
            domElement.style.backgroundPosition = `${-offsetX}px ${-offsetY}px`
        }

        domElement.style.width = '16px';
        domElement.style.height = '16px';

        this._domElement = domElement;
    }

    get domElement() { return this._domElement; }
}
