/**
 * http://usejsdoc.org/
 */
mystr = (17).toString(2);
pad = '0000000000000000';
bin=(pad + mystr).slice(-pad.length);
console.log(bin);

var bitdroite=0
console.log(bin.substr(16-1,1)); //dernier bit