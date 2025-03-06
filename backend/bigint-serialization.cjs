BigInt.prototype.toJSON = function() {
    return { $bigint: this.toString() };
};

const replacer = (key, value) => 
    typeof value === 'bigint' ? { $bigint: value.toString() } : value;

const reviver = (key, value) => 
    value && typeof value === 'object' && '$bigint' in value 
        ? BigInt(value.$bigint) 
        : value;

module.exports = { replacer, reviver };  