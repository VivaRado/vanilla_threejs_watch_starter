const P = "◢◣◤◥".split('');
let loader;

exports.spin = function() {
	let x = 0;
	loader = setInterval(() => {
		process.stdout.write(`\r${P[x++]}`);
		x %= P.length;
	}, 250);
};
exports.stop = function() {
	setTimeout(() => {
		clearInterval(loader);
		process.stdout.write('\r ');
	}, 5000);
};