Vue.component("product", {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `<div  class="product-root">
     <div class="product-img">
        <img :src="image" :alt="product" />
      </div>
      <div class="product-info">
        <h2>{{ title }}</h2>
        <p>{{ descr }}</p>

        <p v-if="onSale">on Sale</p>

        <p v-if="inventory>10">in Stock</p>
        <p v-else-if="inventory>0 && inventory<=10">Almost sold out!</p>
        <p v-else>out Stock</p>

        <p>User is premium: {{premium}}</p>
        <p>  Shipping: {{shipping}}</p>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
        <div class="filter">
          <div class="color-box">
            Colors
            <p
              v-for="(variant, index) in variants"
              :key="variant.variantId"
              :style="{backgroundColor: variant.variantColor}"
              @mouseover="updateProduct(index)"
            ></p>
          </div>
          <div>
            Sizes
            <p v-for="size in sizes">{{ size }}</p>
          </div>
        </div>
        <div>
          <button class="btn-add" v-on:click="addToCart" :disabled="!inStock">
            Add to cart
          </button>
          <button class="btn-add" v-on:click="removeFromCart" >Remove one</button>
        </div>
        <product-review @review-submitted="addReview"></product-review>
    
      <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
       </div>
       </div>
      </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: "Louis Vuitton",
            selectedVariant: 0,
            onSale: true,
            inventory: 2,
            details: ["80% cotton", "20% polyester", "gender-neutral"],
            sizes: ["S", "M", "L"],
            variants: [
                {
                    variantId: 0,
                    variantColor: "green",
                    image: "./images/green-sock.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 1,
                    variantColor: "blue",
                    image: "./images/blue-sock.jpg",
                    variantQuantity: 5
                }
            ],
            link: "https://www.vuemastery.com/courses/intro-to-vue-js/attribute-binding",
            descr: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam expedita dolores perferendis porro debitis ullam cum tempora alias mollitia at repellat, pariatur omnis, quidem ipsa? Dolor consectetur quisquam amet obcaecati?",
            reviews: [],
        }
    },
    methods: {
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addToCart() {
            this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit("remove-from-cart", this.variants[this.selectedVariant].variantId)
        },
        addReview(productReview){
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + " " + this.product
        },
        image() {
            return this.variants[this.selectedVariant].image
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return "2.99$"
        }
    }
})

Vue.component("product-review", {
    template: `
    <form @submit.prevent="onSubmit">
    <p>
      <label for="name">Name: </label>
      <input id="name" v-model="name" />
    </p>
    <p>
        <label for="review">Review: </label>
        <textarea id="review"  v-model="review" ></textarea>
    </p>
    <p>
        <label for="rating">Rating: </label>
        <select id="rating"  v-model.number="rating" >
          <option >5</option>
          <option >4</option>
          <option >3</option>
          <option >2</option>
          <option >1</option>
        </select>
    </p>
    <input type="submit" value="Submit"/>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null
        }
    },
    methods: {
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
            this.$emit("review-submitted", productReview)
            this.name = null,
            this.review = null,
            this.rating = null
        }
    }
})

var app = new Vue({
    el: "#app",
    data: {
        premium: false,
        cart: []
    },
    methods: {
        addToCart(id) {
            this.cart.push(id);
            console.log(this.cart)
        },
        removeFromCart(id) {
            const index = this.cart.indexOf(id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
            console.log(this.cart)

        },
    }
})
