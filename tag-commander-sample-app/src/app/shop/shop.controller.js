export default ['$scope', 'TagCommander', function shopController($scope, TagCommander) {

    TagCommander.setTcVars({
        env_template: "",
        env_work: "dev",
        env_language: "en",
        user_id: "125",
        user_logged: "true",
        user_age: "32",
        user_newcustomer: "false"
    });
    // note that the env_template was previously set in the setTcVars
    TagCommander.setUrlVars(['env_template', 'env_work']);

    this.cartItems = [
        {
            id: 0,
            name: "Day Subscription",
            price: 20,
            quantity: 1
        }
    ];
    this.pageItem = {
        id: 1,
        name: 'Month Subscription',
        price: 99
    };
    this.defaultStoreCurrency = '€';
    this.quantity = 1;
    this.isMsgDisplayed = false;

    this.language = "fr";
    $scope.default = {
        language: "en"
    };

    this.addToCart = () => {
        let index = this.cartItems.indexOf(this.pageItem);
        if (index === -1) {
            let item = this.pageItem;
            item['quantity'] = this.quantity;
            this.cartItems.push(this.pageItem);
        } else {
            this.cartItems[index].quantity += this.quantity;
        }
        TagCommander.captureEvent('cart_checkout', document.querySelector('#buy_button'), { buy: 'true' })
    };
    this.removeFromCart = (index) => {
        this.cartItems.splice(index, 1);
    };
    this.removeQuantityFromCartItem = (index) => {
        if (this.cartItems[index].quantity === 1) {
            this.removeFromCart(index);
        } else {
            this.cartItems[index].quantity -= 1;
        }
    };
    this.addQuantityFromCartItem = (index) => {
        this.cartItems[index].quantity += 1;
    };
    this.removeQuantity = () => {
        if (this.quantity > 1) {
            this.quantity--;
        }
    };
    this.addQuantity = () => {
        this.quantity++;
    };
    this.cartGrandTotal = () => {
        let grandTotal = 0;
        for (let i = 0; i < this.cartItems.length; i++) {
            grandTotal += this.cartItems[i].price * this.cartItems[i].quantity;
        }
        return grandTotal;
    };
    this.checkout = () => {
        this.quantity = 0;
        this.cartItems = [];
    };
    window.shop = this;
}];
