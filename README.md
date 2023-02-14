# pipewire-reconnector

While playing CSGO I was curious how easy it is to play music through my mic using pipewire. 
When opening qpwgraph to view my I saw that spotify had an output node, and in CSGO when pressing my mic it has an input node from my mic to CSGO.

The issue is that the link between spotify and CSGO would be possible. 
But because the CSGO input node disappears as soon you let lose of the mic, it become impossible to connect the spotify output node to the CSGO input node.

This repository contains a simple listener to the node and port creations and destruction. 
Where if the wanted source and target nodes exist it connects the 2.

The results from this research probably results into a simple UI that allows easier configuration of this.
