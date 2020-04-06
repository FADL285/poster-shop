const LOAD_NUM = 4;
let watcher;

new Vue({
	el: "#app",
	data: {
		total: 0,
		products: [],
		cart: [],
		search: "cat",
		lastSearch: "",
		loading: false,
		results: [],
	},
	methods: {
		addToCart: function (product) {
			this.total += product.price;
			var found = false;
			for (var i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === product.id) {
					this.cart[i].qty++;
					found = true;
				}
			}
			if (!found) {
				this.cart.push({
					id: product.id,
					title: product.title,
					price: product.price,
					qty: 1,
				});
			}
		},
		inc: function (item) {
			item.qty++;
			this.total += item.price;
		},
		dec: function (item) {
			item.qty--;
			this.total -= item.price;
			if (item.qty <= 0) {
				var i = this.cart.indexOf(item);
				this.cart.splice(i, 1);
			}
		},
		onSubmit: function () {
			this.results = [];
			this.products = [];
			this.loading = true;
			var path = "/search?q=" + this.search.toLowerCase();
			this.$http.get(path).then(
				function (response) {
					// get body data
					setTimeout(
						function () {
							this.results = response.body;
							this.lastSearch = this.search;
							this.appendResults();
							this.loading = false;
						}.bind(this),
						800
					);
				},
				function (error) {
					// error callback
					console.log(error);
				}
			);
		},
		appendResults: function () {
			if (this.products.length < this.results.length) {
				const newItems = this.results.slice(
					this.products.length,
					LOAD_NUM + this.products.length
				);
				this.products = this.products.concat(newItems);
			}
		},
	},
	filters: {
		currency: function (price) {
			return "$".concat(price.toFixed(2));
		},
	},
	created: function () {
		this.onSubmit();
	},
	updated: function () {
		let sensor = document.querySelector("#product-list-bottom");
		watcher = scrollMonitor.create(sensor);
		watcher.enterViewport(this.appendResults);
	},
	beforeUpdate: function () {
		if (watcher) {
			watcher.destroy();
			watcher = null;
		}
	},
});
