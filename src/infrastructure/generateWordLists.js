// Script to generate word lists for each category
// Run with: node src/infrastructure/generateWordLists.js

const fs = require('fs');
const path = require('path');

const wordLists = {
  animals: [
    'cat', 'dog', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer', 'moose', 'elk',
    'bison', 'zebra', 'horse', 'cow', 'pig', 'sheep', 'goat', 'duck', 'goose', 'swan',
    'eagle', 'hawk', 'owl', 'crow', 'raven', 'robin', 'wren', 'finch', 'jay', 'lark',
    'dove', 'pigeon', 'parrot', 'toucan', 'puffin', 'heron', 'stork', 'crane', 'ibis', 'egret',
    'pelican', 'gull', 'tern', 'skua', 'auk', 'murre', 'grebe', 'loon', 'snake', 'lizard'
  ],
  sports: [
    'soccer', 'tennis', 'golf', 'hockey', 'rugby', 'cricket', 'boxing', 'judo', 'karate', 'fencing'
  ],
  science: [
    'atom', 'cell', 'gene', 'dna', 'rna', 'proton', 'neutron', 'electron', 'photon', 'quark'
  ],
  food: [
    'pizza', 'pasta', 'rice', 'bread', 'cheese', 'butter', 'milk', 'egg', 'meat', 'fish'
  ],
  geography: [
    'ocean', 'river', 'lake', 'mountain', 'valley', 'desert', 'forest', 'island', 'coast', 'plain'
  ],
  technology: [
    'computer', 'phone', 'tablet', 'laptop', 'server', 'router', 'modem', 'mouse', 'keyboard', 'monitor'
  ],
  music: [
    'guitar', 'piano', 'drums', 'violin', 'flute', 'trumpet', 'bass', 'cello', 'harp', 'organ'
  ],
  movies: [
    'action', 'comedy', 'drama', 'horror', 'thriller', 'romance', 'scifi', 'western', 'musical', 'fantasy'
  ]
};

// Write each category to a JSON file
Object.entries(wordLists).forEach(([category, words]) => {
  const filePath = path.join(__dirname, 'wordLists', `${category}.json`);
  fs.writeFileSync(filePath, JSON.stringify(words, null, 2));
  console.log(`Created ${category}.json with ${words.length} words`);
});
