module.exports = function CartModel(oldCart) {
    this.items = oldCart.items || {};
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
        }
        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        // Có code của product thì đổi storedItem.item.price
        this.totalQuantity++;
        this.totalPrice += storedItem.item.price;
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}