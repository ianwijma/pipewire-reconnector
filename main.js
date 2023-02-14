import Reconnect from "./src/Reconnect.js";
import StateTracker from "./src/StateTracker.js";
import {createPwThread, getLinks, getNodes, getPorts} from "node-pipewire";
import Sleep from "./src/Sleep.js";

const reconnect = new Reconnect()
reconnect
    .setSource('spotify', 'output_FL', 'output_FR')
    .setTarget('csgo_linux64', 'input_FL', 'input_FR');

const nodeTracker = new StateTracker(
    () => getNodes(),
    (node) => reconnect.registerNode(node),
    (node) => reconnect.unregisterNode(node),
)
const portTracker = new StateTracker(
    () => getPorts(),
    (port) => reconnect.registerPort(port),
    (port) => reconnect.unregisterPort(port),
)

const linkTracker = new StateTracker(
    () => getLinks(),
    (item, loop) => console.log(`[${loop}] Link added: `, item),
    (item, loop) => console.log(`[${loop}] Link removed: `, item),
)

const portTracker2 = new StateTracker(
    () => getPorts(),
    (port) => {
        const mappedNodes = getNodes().reduce((map, node) => {
            map[node.id] = node;
            return map;
        }, {});
        console.log('================================');
        console.log(port, mappedNodes[port.node_id]);
        console.log('================================');
    },
    (port) => {
        const mappedNodes = getNodes().reduce((map, node) => {
            map[node.id] = node;
            return map;
        }, {});
        console.log('================================');
        console.log(port, mappedNodes[port.node_id]);
        console.log('================================');
    },
)

async function Main() {
    createPwThread();

    while (true) {
        /**
         * TODO: Stability
         * To get rid of the sleep and make the connection more stable we need to do the following:
         * - Only listen to port events
         * - When a port even is fired, check if the port belongs to a wanted node by firing getNodes.
         * - Then we can make sure that port belongs to the target or source node and register the port.
         *
         * POC: Uncommenting portTracker2 shows that the node is returned when calling getNodes after getPorts.
         */
        // portTracker2.track();

        /**
         * TODO: Key activated
         * We need to make the linking ideally key activated, this would be the flow:
         * - Wait for the source to exists.
         * - Wait for the target to exists.
         * - Wait for the key to be pressed.
         * - Link source to target.
         *
         * Note: We might need to use electron, electron sub packages or electron's source code how they implement it.
         *
         * POC:
         */

        /**
         * Working example, but with a sleep.
         */
        // linkTracker.track();

        nodeTracker.track();

        Sleep(100);

        portTracker.track();
    }
}

// Run!~
Main();
