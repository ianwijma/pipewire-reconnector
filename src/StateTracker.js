export default class StateTracker {
    getItemsFn;
    addedItemFn;
    removedItemFn;
    trackedItems = {};
    loopCounter = 0;

    constructor(
        getItemsFn = () => {},
        addedItemFn = (item, loop) => {},
        removedItemFn = (item, loop) => {}
    ) {
        this.getItemsFn = getItemsFn;
        this.addedItemFn = addedItemFn;
        this.removedItemFn = removedItemFn;
    }

    track() {
        const addedItems = [];
        const removedItems = [];

        const items = this.getItemsFn();
        const newItems = items.reduce((map, item) => {
            map[item.id] = item;
            return map;
        }, {});

        Object.values(this.trackedItems).forEach((existingItem) => {
            if (!(existingItem.id in newItems)) {
                removedItems.push(existingItem);
            }
        });

        Object.values(newItems).forEach((newItem) => {
            if (!(newItem.id in this.trackedItems)) {
                addedItems.push(newItem);
            }
        });

        addedItems.forEach(item => this.addedItemFn(item, this.loopCounter));
        removedItems.forEach(item => this.removedItemFn(item, this.loopCounter));

        if (addedItems.length || removedItems.length) {
            this.loopCounter++
        }

        this.trackedItems = newItems;
    }
}
