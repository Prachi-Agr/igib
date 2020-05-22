import json

with open('interactions.json', 'r') as file:
    data = json.load(file)

spike_residues = set()
ace2_residues  = set()

for node in data["nodes"]:
    if node["chain"] == 'C':
        spike_residues.add(node["resnum"])
    elif node['chain'] == 'D':
        ace2_residues.add(node['resnum'])
print(len(spike_residues), len(ace2_residues))

spike_residues = ['C' + str(residue) for residue in sorted(list(spike_residues))]
ace2_residues  = ['D' + str(residue) for residue in sorted(list(ace2_residues))]
residues = spike_residues + ace2_residues
print(len(spike_residues), len(ace2_residues), len(residues))

links = {}

for residue1 in residues:
    links[residue1] = {}
    for residue2 in residues:
        links[residue1][residue2] = 0

for link in data["links"]:
    residue1, residue2 = 0, 0
    for node in data["nodes"]:
        if node['id'] == link['source']:
            residue1 = node['chain'] + str(node['resnum'])
            if residue2 != 0:
                break
        elif node['id'] == link['target']:
            residue2 = node['chain'] + str(node['resnum'])
            if residue1 != 0: 
                break
    links[residue1][residue2] += 1
    links[residue2][residue1] += 1

# print('[')
# for residue1 in links.keys():
#     print('[', end="")
#     for residue2 in links[residue1].keys():
#         print(links[residue1][residue2], end=", ")
#     print("],")
# print(']')