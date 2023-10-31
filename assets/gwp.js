class GWP {
    atcCallback = [];
    #propName = '_smgift';
    enable = window._theme.gwp.enable;    
    freeProducts = window._theme.gwp?.freeProducts || [];
    isCartOrCheckoutPage = document.querySelector('body.cart') ? true : false;

    constructor(){
        const PRE_ORDER_STEPS = ['contact_information', 'shipping_method', 'payment_method'];
        const checkoutStep = window.Shopify && Shopify.Checkout && Shopify.Checkout.step;
        if(checkoutStep && PRE_ORDER_STEPS.includes(checkoutStep)) this.isCartOrCheckoutPage = true;
        this.freeProducts = this.freeProducts.reverse();
        delete window._theme.gwp;
    }

    /** 
     * Check if offer is enable in the customize settings
    */
    isEnable(){
        if(!this.enable || this.freeProducts.length === 0) return false;
        return true;
    }

    /***
     * Check if gift product is already added to the cart
     */
    isGiftProductAdded(cart){
        if(!cart || cart.item_count === 0) return false;
        const giftProduct = cart.items.find(item => item.properties && item.properties[this.#propName]);
        const giftProductIndex = cart.items.findIndex(item => item.properties && item.properties[this.#propName]) + 1;
        
        return {
            giftProduct, 
            giftProductIndex
        };
    }

    /** 
     * check if the user can avail this offer
     * if cart total amount is greater than or equal to minimum required amount
    */
    validate(cart){
        if(!cart) throw Error('Invalid cart');
        let isEnable = this.isEnable();
        let status = false;
        if(cart.item_count === 0) return { status };

        const giftData = this.isGiftProductAdded(cart);
        let cart_total_price = cart.total_price;
        if(giftData.giftProduct) cart_total_price -= giftData?.giftProduct?.final_price;
        cart_total_price /= 100;

        const matchedProduct = this.freeProducts.find( ({ min_amt }) => cart_total_price >= min_amt);
        if(matchedProduct && matchedProduct.product_vid && cart_total_price >= matchedProduct.min_amt) status = true;
        if(!isEnable) status = false;

        return {
            status, 
            ...giftData,
            ...matchedProduct
        };
    }

    /**
     * Run validation on load
     * update cart
     */
    async runInitialValidation(){
        try {
            const data = await GWP.getCart();
            this.enable = data.gwp_enable;
            this.freeProducts = data.freeProducts || [];
            this.freeProducts.reverse();
            if(data.gwp_enable) this.run(data.cart, true);
        } catch(err){
            console.error(err);
        }
    }

    /**
     * this method will add/remove free product
     */
    async run(cart, runAsInitial, element){
        let isCartUpdated = false;
        try {
            if(!cart) {
                const data = await GWP.getCart();
                cart = data.cart;
            }
            
            const result = this.validate(cart);
            let newCart = cart;
            if(element) this.activeElement = element;

            if(result.status){
                if(result.giftProduct && result.giftProduct.variant_id !== result.product_vid){
                    newCart = await this.removeGiftProductFromCart(result.giftProductIndex);
                    isCartUpdated = true;
                    delete result.giftProduct;
                }
            }

            // GWP enable & gift product is not added yet
            if(result.status && !result.giftProduct){
                newCart = await this.addGiftProductToCart(result.product_vid);
                isCartUpdated = true;
            }
            
            // GWP disable & Cart has free gift product then remove
            if(!result.status && result.giftProduct){
                newCart = await this.removeGiftProductFromCart(result.giftProductIndex);
                isCartUpdated = true;
            }
            
            // Run Registered Callbacks
            if(this.atcCallback.length){
                this.atcCallback.forEach(fn => {
                    fn(newCart);
                });
            }
            
            // Run On Initial Load
            if(runAsInitial){
                if(!newCart.status && isCartUpdated){
                    if(this.isCartOrCheckoutPage) {
                        window.location.reload();
                    } else _theme.refreshCart(newCart);
                }
            }
    
            return {
                cart: newCart,
                isCartUpdated: isCartUpdated
            };
        } catch(err){
            console.error(err);
            return {
                cart: cart,
                isCartUpdated: isCartUpdated
            }
        }
    }

    /**
     * It accept callback function
     * Callback function will be registered
     * Callbacks method will invoke inside "run" method & after cart updated
     */
    static registerATCCallBack(fn){
        if(!fn || typeof fn !== 'function') throw Error('Cannot register callback, Argument type is Invalid');
        this.atcCallback.push(fn);
    }
    
    /**
     * @returns cart json
     */
    static getCart(){
        return fetch('/cart?view=offer').then(res => res.json()).then(cart => cart);
    }

    /**
     * 
     * @param {*} data 
     * @returns ajax request header with stringify body property
     */
    static getAjaxHeaders(data){
        return {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    }

    /**
     * Add free product to cart &
     * @returns updated cart object
     */
    async addGiftProductToCart(product_vid){
        if(!product_vid) throw Error('Invalid variant id');
        this.runLoader(true);
        try {
            const formData = {
                'items': [{ 'id': product_vid, 'quantity': 1,  "properties" : { [this.#propName]: 1 }}]
            };
            await fetch('/cart/add.js', GWP.getAjaxHeaders(formData));
            const updatedCart = await GWP.getCart();
            this.runLoader(false);
            return updatedCart.cart;
        } catch(err){
            this.runLoader(false);
            return err;
        }
    }

    /**
     * Remove free product from cart &
     * @returns updated cart object
     */
    async removeGiftProductFromCart(lineId){
        if(!lineId) throw Error('Invalid line id');

        const formData = { "line": lineId, "quantity": 0 };
        
        try {
            this.runLoader(true);
            const res = await fetch('/cart/change.js', GWP.getAjaxHeaders(formData))
            const cart = await res.json();
            this.runLoader(false);
            return cart;
        } catch(err){
            this.runLoader(false);
            return err;
        }
    }

    /**
     * Loader 
    */
    runLoader(show){
       if(show) {
           document.body.classList.add('cart-loading');
           if(!this.activeElement) return;
           this.activeElement.setAttribute('disabled', true);
       } else {
           document.body.classList.remove('cart-loading');
           if(!this.activeElement) return;
           this.activeElement.removeAttribute('disabled');
       }
    }
}

_theme.GWP = new GWP();
const PRE_ORDER_STEPS = ['contact_information', 'shipping_method', 'payment_method'];
const checkoutStep = window.Shopify && Shopify.Checkout && Shopify.Checkout.step;
if(checkoutStep && PRE_ORDER_STEPS.includes(checkoutStep)) {
    document.addEventListener('page:load', evt => {
        _theme.GWP.runInitialValidation();
    });
    document.addEventListener('page:change', evt => {
        _theme.GWP.runInitialValidation();
    });
}