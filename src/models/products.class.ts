export class Product {
    id: string;
    title: string;
    type: string;
    price: number;
    amount: number;
    value: number;
    state: string;
    purchaseUser: string;

    constructor(obj?: any) {
        this.id = obj && obj.id ? obj.id : '';
        this.title = obj && obj.title ? obj.title : '';
        this.type = obj && obj.type ? obj.type : '';
        this.price = obj && obj.price ? obj.price : '';
        this.amount = obj && obj.amount ? obj.amount : '';
        this.value = obj && obj.value ? obj.value : '';
        this.state = obj && obj.state ? obj.state : '';
        this.purchaseUser = obj && obj.purchaseUser ? obj.purchaseUser : '';
    }
}
