import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'zen777';
let productModal = {};
let delProductModal = {};

const app = createApp ({
  data() {
    return {
      products: [],
      temp: {
        imagesUrl: [],
      },
      isNew: false,
    }
  },
  methods: {
    // 驗證API
    userCheck() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      axios
        .post(`${url}/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          windows.location = 'index.html';
        })
    },
    // 取得產品列表
    getProducts() {
      axios
      .get(`${url}/api/${api_path}/admin/products`)
      .then((res) => {
        this.products = res.data.products;
      })
      .catch((err) => {
        console.dir(err);
      })
    },
    // 判斷按鈕後開啟互動視窗
    openModal(status, product) {
      if (status === 'new'){
        this.temp = {
          imagesUrl: [],
        }
        this.isNew = true;
        productModal.show();
      }else if ( status === 'edit' ){
        this.temp = {...product};
        this.isNew = false;
        productModal.show();
      }else if ( status === 'del'){
        delProductModal.show();
        this.temp = {...product};
      }
    },
    // 更新產品
    updateProduct() {
      // 切換post跟put
      let link = `${url}/api/${api_path}/admin/product`;
      let method = 'post';
      if (!this.isNew) {
        link = `${url}/api/${api_path}/admin/product/${this.temp.id}`;
        method = 'put';
      }
      axios
        [method](link, { data: this.temp })
        .then((res) => {
          this.getProducts(); //重新取得產品列表
          productModal.hide(); //關閉互動視窗
        })
    },
    // 刪除產品
    delProduct() {
      axios
        .delete(`${url}/api/${api_path}/admin/product/${this.temp.id}`)
        .then((res) => {
          this.getProducts(); //重新取得產品列表
          delProductModal.hide(); //關閉互動視窗
        })
    }
  },
  mounted() {
    this.userCheck();
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
  }
})
app.mount('#app');