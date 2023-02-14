import {linkNodesNameToId, linkPorts, unlinkNodesNameToId, unlinkPorts} from "node-pipewire";

const SOURCE_DIRECTION = 'Output';
const TARGET_DIRECTION = 'Input';

export default class Reconnect {
    sourceNodeName = '';
    sourceNodeId = null;
    sourceNodeIdPrev = null;
    sourceLeftPortName  = '';
    sourceLeftPortId = null;
    sourceLeftPortIdPrev = null;
    sourceRightPortName  = '';
    sourceRightPortId = null;
    sourceRightPortIdPrev = null;

    targetNodeName  = '';
    targetNodeId = null;
    targetNodeIdPrev = null;
    targetLeftPortName  = '';
    targetLeftPortId = null;
    targetLeftPortIdPrev = null;
    targetRightPortName  = '';
    targetRightPortId = null;
    targetRightPortIdPrev = null;

    connected = false;

    setSource(nodeName, leftPortName, rightPortName) {
        this.sourceNodeName = nodeName;
        this.sourceLeftPortName = leftPortName;
        this.sourceRightPortName = rightPortName;
        return this;
    }

    setTarget(nodeName, leftPortName, rightPortName) {
        this.targetNodeName = nodeName;
        this.targetLeftPortName = leftPortName;
        this.targetRightPortName = rightPortName;
        return this;
    }

    isSourceKnown() {
        return this.sourceNodeId && this.sourceLeftPortId && this.sourceRightPortId;
    }

    isPreviousSourceKnown() {
        return this.sourceNodeId && this.sourceLeftPortId && this.sourceRightPortId;
    }

    isTargetKnown() {
        return this.targetNodeId && this.targetLeftPortId && this.targetRightPortId;
    }

    isPreviousTargetKnown() {
        return this.targetNodeId && this.targetLeftPortId && this.targetRightPortId;
    }

    registerNode({ id, name, node_direction }) {
        if ( this.targetNodeName === name && TARGET_DIRECTION === node_direction ) {
            this.targetNodeId = id;
            this.targetNodeIdPrev = id;
        }
        if ( this.sourceNodeName === name && SOURCE_DIRECTION === node_direction ) {
            this.sourceNodeId = id;
            this.sourceNodeIdPrev = id;
        }

        this.checkReconnection();
    }

    unregisterNode({ name, node_direction }) {
        if ( this.targetNodeName === name && TARGET_DIRECTION === node_direction ) {
            this.targetNodeId = null;
        }
        if ( this.sourceNodeName === name && SOURCE_DIRECTION === node_direction ) {
            this.sourceNodeId = null;
        }

        this.checkReconnection();
    }

    registerPort({ id, name, direction, node_id }) {
        if ( this.targetLeftPortName === name && TARGET_DIRECTION === direction && this.targetNodeId === node_id ) {
            this.targetLeftPortId = id;
            this.targetLeftPortIdPrev = id;
        }
        if ( this.targetRightPortName === name && TARGET_DIRECTION === direction && this.targetNodeId === node_id ) {
            this.targetRightPortId = id;
            this.targetRightPortIdPrev = id;
        }
        if ( this.sourceLeftPortName === name && SOURCE_DIRECTION === direction && this.sourceNodeId === node_id ) {
            this.sourceLeftPortId = id;
            this.sourceLeftPortIdPrev = id;
        }
        if ( this.sourceRightPortName === name && SOURCE_DIRECTION === direction && this.sourceNodeId === node_id ) {
            this.sourceRightPortId = id;
            this.sourceRightPortIdPrev = id;
        }

        this.checkReconnection();
    }

    unregisterPort({ name, direction, node_id }) {
        if ( this.targetLeftPortName === name && TARGET_DIRECTION === direction && this.targetNodeId === node_id ) {
            this.targetLeftPortId = null;
        }
        if ( this.targetRightPortName === name && TARGET_DIRECTION === direction && this.targetNodeId === node_id ) {
            this.targetRightPortId = null;
        }
        if ( this.sourceLeftPortName === name && SOURCE_DIRECTION === direction && this.sourceNodeId === node_id ) {
            this.sourceLeftPortId = null;
        }
        if ( this.sourceRightPortName === name && SOURCE_DIRECTION === direction && this.sourceNodeId === node_id ) {
            this.sourceRightPortId = null;
        }

        this.checkReconnection();
    }

    checkReconnection() {
        if (this.isSourceKnown() && this.isTargetKnown()) {
            if (!this.connected) {
                this.connected = true;
                console.log('Reconnected');
                linkNodesNameToId(this.sourceNodeName, this.targetNodeId);
            }
        } else if (this.connected) {
            console.log('Disconnected');
            this.connected = false;
        }
    }

}
