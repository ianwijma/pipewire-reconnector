import {createPwThread, getLinks, getNodes, getPorts} from 'node-pipewire';
import StateTracker from "./src/StateTracker.js";

let running = true;

async function main() {
    createPwThread();

    const nodeTracker = new StateTracker(
        () => getNodes(),
        (node, loop) => delete node.ports && console.log(`[${loop}] Node added: `, node),
        (node, loop) => delete node.ports && console.log(`[${loop}] Node removed: `, node),
    )

    // const nodeTracker = new StateTracker(
    //     () => getNodes(),
    //     ({ id, name, node_direction }, loop) => console.log(`[${loop}] Node added: `, { id, name, node_direction }),
    //     ({ id, name, node_direction }, loop) => console.log(`[${loop}] Node removed: `, { id, name, node_direction }),
    // )

    const portTracker = new StateTracker(
        () => getPorts(),
        ({ id, name, direction, node_id }, loop) => console.log(`[${loop}] Port added: `, { id, name, direction, node_id }),
        ({ id, name, direction, node_id }, loop) => console.log(`[${loop}] Port removed: `, { id, name, direction, node_id }),
    )

    // const linkTracker = new StateTracker(
    //     () => getLinks(),
    //     (item, loop) => console.log(`[${loop}] Link added: `, item),
    //     (item, loop) => console.log(`[${loop}] Link removed: `, item),
    // )

    const linkTracker = new StateTracker(
        () => getLinks(),
        ({ id, input_node_id, input_port_id, output_node_id, output_port_id }, loop) => console.log(`[${loop}] Link added: `, { id, input_node_id, input_port_id, output_node_id, output_port_id }),
        ({ id, input_node_id, input_port_id, output_node_id, output_port_id }, loop) => console.log(`[${loop}] Link removed: `, { id, input_node_id, input_port_id, output_node_id, output_port_id }),
    )

    while (running) {
        nodeTracker.track();
        portTracker.track();
        linkTracker.track();
    }

}

main();
