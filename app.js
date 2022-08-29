const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    cart: [],
    cartActive: false,
    alertMessage: 'Item adicionado',
    alertActive: false,
  },
  filters: {
    formattedPrice(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  computed: {
    totalCart() {
      let total = 0;
      if (this.cart.length) {
        this.cart.forEach(item => {
          total += item.price
        })
      }
      return total;
    }
  },
  methods: {
    fetchProducts() {
      fetch("./api/products.json")
        .then((r) => r.json())
        .then((r) => {
          this.products = r;
        });
    },
    fetchProduct(id) {
      fetch(`./api/products/${id}/data.json`)
        .then((r) => r.json())
        .then((r) => {
          this.product = r;
        });
    },
    addItem() {
      this.product.inventory--;
      const { id, name, price } = this.product;
      this.cart.push({ id, name, price });
      this.alert(`${name} adicionado ao carrinho.`)
    },
    removeItem(index) {
      this.cart.splice(index, 1);
    },
    compareInventory() {
      const items = this.cart.filter(({ id }) => id === this.product.id)
      this.product.inventory -= items.length;
    },
    openModal(id) {
      this.fetchProduct(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    closeModal({ target, currentTarget }) {
      if (target === currentTarget) this.product = false;
    },
    outsideCart({ target, currentTarget }) {
      if (target === currentTarget) this.cartActive = false;
    },
    checkLocalStorage() {
      if (window.localStorage.cart) {
        this.cart = JSON.parse(window.localStorage.cart)
      }
    },
    alert(message) {
      this.alertMessage = message;
      this.alertActive = true;

      setTimeout(() => {
        this.alertActive = false;
      }, 1500)
    },
    router() {
      const hash = document.location.hash;
      if (hash) this.fetchProduct(hash.replace("#", ""))
    }
  },
  watch: {
    product() {
      document.title = this.product.name || "Techno";
      const hash = this.product.id || "";
      history.pushState(null, null, `#${hash}`)
      if (this.product) {
        this.compareInventory()
      }
    },
    cart() {
      window.localStorage.cart = JSON.stringify(this.cart)
    }
  },
  created() {
    this.fetchProducts();
    this.router();
    this.checkLocalStorage();
  },
});
