import {getPorts, linkNodesNameToId, linkPorts, waitForNewNode} from "node-pipewire";

const SOURCE_DIRECTION = 'Output';
const TARGET_DIRECTION = 'Input';

export default class Reconnector {
    sourceNodeName;
    sourceNode = null;
    targetNodeName;
    targetNode = null;
    isConnected = false;

    constructor(sourceNodeName, targetNodeName) {
        this.sourceNodeName = sourceNodeName;
        this.targetNodeName = targetNodeName;
    }

    registerNode(node) {
        const { id, name, node_direction } = node;
        if ( this.sourceNodeName === name && SOURCE_DIRECTION.toLowerCase() === node_direction.toLowerCase() ) {
            this.sourceNode = node;
        }
        if ( this.targetNodeName === name && TARGET_DIRECTION.toLowerCase() === node_direction.toLowerCase() ) {
            this.targetNode = node;
        }

        this.checkConnection();
    }

    unregisterNode(node) {
        const { name, node_direction } = node;
        if ( this.sourceNodeName === name && SOURCE_DIRECTION.toLowerCase() === node_direction.toLowerCase() ) {
            this.sourceNode = null;
        }
        if ( this.targetNodeName === name && TARGET_DIRECTION.toLowerCase() === node_direction.toLowerCase() ) {
            this.targetNode = null;
        }

        this.checkConnection();
    }

    _getPortId(node, portName) {
        const allPorts = getPorts();
        console.log('allPorts');
        return allPorts.reduce((current, port) => {
            if (port.node_id === node.id && port.name.toLowerCase() === portName.toLowerCase()) current = port.id;
            return current;
        }, null);
    }

    async checkConnection() {
        if ( this.sourceNode && this.targetNode ) {
            if (!this.isConnected) {
                this.isConnected = true;

                const sourceLeftPort = this._getPortId(this.sourceNode, 'output_FL');
                const sourceRightPort = this._getPortId(this.sourceNode, 'output_FR');

                const targetLeftPort = this._getPortId(this.targetNode, 'input_FL');
                const targetRightPort = this._getPortId(this.targetNode, 'input_FR');

                // Does not seem to work at all.
                linkPorts(sourceLeftPort, targetLeftPort);
                linkPorts(sourceRightPort, targetRightPort);

                // Works half of the time.
                linkNodesNameToId(this.sourceNode.name, this.targetNode.id);

                console.log('Connected');
            }
        } else if (this.isConnected) {
            this.isConnected = false;
            console.log('Disconnected');
        } else {
            console.log('Still disconnected')
        }
    }
}
