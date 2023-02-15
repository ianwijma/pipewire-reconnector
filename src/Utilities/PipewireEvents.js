import {
    getInputNodes,
    getInputNodesName,
    getLinks,
    getNodes,
    getOutputNodes,
    getOutputNodesName,
    getPorts
} from "node-pipewire";
import EventEmitter from 'eventemitter3';

export const LINK_ADDED = 'link:added';
export const LINK_REMOVED = 'link:removed';
export const PORT_ADDED = 'port:added';
export const PORT_REMOVED = 'port:removed';
export const NODE_ADDED = 'node:added';
export const NODE_REMOVED = 'node:removed';
export const OUTPUT_NODE_ADDED = 'output_node:added';
export const OUTPUT_NODE_REMOVED = 'output_node:removed';
export const INPUT_NODE_ADDED = 'input_node:added';
export const INPUT_NODE_REMOVED = 'input_node:removed';
export const OUTPUT_NODE_NAME_ADDED = 'output_node_name:added';
export const OUTPUT_NODE_NAME_REMOVED = 'output_node_name:removed';
export const INPUT_NODE_NAME_ADDED = 'input_node_name:added';
export const INPUT_NODE_NAME_REMOVED = 'input_node_name:removed';

class EventTracker {
    eventTarget = new EventEmitter();
    itemName = 'item';
    getItemsFn = () => {};
    addEventName;
    removeEventName;
    trackedItems = {};
    loopCounter = 0;


    constructor(eventTarget, getItemsFn, addEventName, removeEventName, itemName) {
        this.eventTarget = eventTarget;
        this.getItemsFn = getItemsFn;
        this.addEventName = addEventName;
        this.removeEventName = removeEventName;
        this.itemName = itemName;
    }

    _dispatchEvent(eventName, data = {}) {
        this.eventTarget.emit(eventName, { data });
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

        addedItems.forEach(item => this._dispatchEvent(
            this.addEventName,
            {
                [this.itemName]: item,
                loop: this.loopCounter
            }
        ));
        removedItems.forEach(item => this._dispatchEvent(
            this.removeEventName,
            {
                [this.itemName]: item,
                loop: this.loopCounter
            }
        ));

        if (addedItems.length || removedItems.length) {
            this.loopCounter++
        }

        this.trackedItems = newItems;
    }
}

const pipewireEventsAmount = 0;

export default class PipewireEvents extends EventEmitter {
    tracking = false;

    addEventListener(eventName, callback = () => {}) {
        this.on(eventName, ({ data }) => { callback(data) });
    }

    track() {
        this._setup();
        this._startTrack();
    }

    untrack() {
        this._stopTracking();
    }

    _setup() {
        this.linkTracker = new EventTracker(this, getLinks, LINK_ADDED, LINK_REMOVED, 'link');
        this.portTracker = new EventTracker(this, getPorts, PORT_ADDED, PORT_REMOVED, 'port');
        this.nodeTracker = new EventTracker(this, getNodes, NODE_ADDED, NODE_REMOVED, 'node');
        this.outputNodeTracker = new EventTracker(this, getOutputNodes, OUTPUT_NODE_ADDED, OUTPUT_NODE_REMOVED, 'node');
        this.inputNodeTracker = new EventTracker(this, getInputNodes, INPUT_NODE_ADDED, INPUT_NODE_REMOVED, 'node');
        this.outputNodeNameTracker = new EventTracker(this, getOutputNodesName, OUTPUT_NODE_NAME_ADDED, OUTPUT_NODE_NAME_REMOVED, 'node');
        this.inputNodeNameTracker = new EventTracker(this, getInputNodesName, INPUT_NODE_NAME_ADDED, INPUT_NODE_NAME_REMOVED, 'node');
    }

    async _startTrack() {
        this.tracking = true;
        while (this.tracking) {
            this.linkTracker.track();
            this.portTracker.track();
            this.nodeTracker.track();
            this.outputNodeTracker.track();
            this.inputNodeTracker.track();
            this.outputNodeNameTracker.track();
            this.inputNodeNameTracker.track();
        }
    }

    _stopTracking() {
        this.tracking = false;
    }

}
