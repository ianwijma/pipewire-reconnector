import PipewireEvents, {NODE_ADDED, NODE_REMOVED, PORT_ADDED} from "./src/Utilities/PipewireEvents.js";
import Reconnector from "./src/Utilities/Reconnector.js";
import {createPwThread} from "node-pipewire";

/**
 * TODO: Key activated
 * We need to make the linking ideally key activated, this would be the flow:
 * - Wait for the source to exists.
 * - Wait for the target to exists.
 * - Wait for the key to be pressed.
 * - Link source to target.
 *
 * Note: We might need to use electron, electron sub packages or electron's source code how they implement it.
 */

/**
 * TODO: Multi connection support
 * There can be multiple sources,
 * we might want to have a setting to allow multiple sources and targets with the same node and port name
 */

const pipewireEvents = new PipewireEvents();
const reconnector = new Reconnector('spotify', 'csgo_linux64');

createPwThread();

pipewireEvents.addEventListener(NODE_ADDED, ({ node }) => reconnector.registerNode(node));
pipewireEvents.addEventListener(NODE_REMOVED, ({ node }) => reconnector.unregisterNode(node));
pipewireEvents.track();
