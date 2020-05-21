import json
from prody import *
from pylab import *

def main():
    pdb, header = parsePDB('6acg', header=True)

    spike_contacts = pdb.select('chain A B C and within 4 of chain D')
    ace2_contacts = pdb.select('chain D and within 4 of chain A B C')

    # writePDB('spike_contacts.pdb', spike_contacts)
    # writePDB('ace2_contacts.pdb', ace2_contacts)

    spike = pdb.select('chain A B C')
    ace2  = pdb.select('chain D')

    interactions = findNeighbors(atoms=spike, radius=4, atoms2=ace2)

    spike_atoms = set()
    ace2_atoms = set()
    links = []

    interaction_residue_pairs = []
    for pair in interactions:
        a, b, distance = pair

        spike_atom = getAtomData(a)    
        ace2_atom  = getAtomData(b)

        spike_atoms.add(spike_atom)
        ace2_atoms.add(ace2_atom)

        links.append({
            "source": spike_atom["index"],
            "target": ace2_atom["index"]
        })
    
    nodes = list(spike_atoms) + list(ace2_atoms)

    with open('interactions.json', 'w') as file:
        json.dump(interaction_residue_pairs, file)

def getAtomData(atom):
    data = {}

    data["chain"]   = atom.getData('chain')
    data["resname"] = atom.getData('resname')
    data["resnum"]  = int(atom.getData('resnum'))
    data["element"] = atom.getData('element')
    data["index"]   = atom.getIndex()

    return data

if __name__ == "__main__":
    main()