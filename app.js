const cart = document.querySelector('.cart');
const fruits = document.querySelector('.fruits');
const info = document.querySelector('.info');
const cartTotal = document.querySelector('#cart-total-value');

let cartData = [];

const updateCartTotal = () => {
   const total = cartData.reduce((acc, item) => {
      const price = parseFloat(item.price);
      return (acc += price && price * item.count);
   }, 0);

   cartTotal.innerHTML = `<h3>Total: ${total.toFixed(2)}$</h3>`;

   info.append(cartTotal);

   return total;
};

const getData = async () => {
   try {
      const res = await fetch('db.json');
      const data = await res.json();

      data.forEach((item) => {
         const fruitItem = document.createElement('div');
         fruitItem.classList.add('fruit__item');
         fruitItem.id = item.id;

         fruitItem.innerHTML = `
            <h3 class='fruit__name'>${item.name}</h3>
            <p class='fruit__price'>${item.price}$</p>
            <button data-id='add' class='fruit__add'>Add</button>
         `;

         fruits.append(fruitItem);
      });

      updateCartTotal();
   } catch (error) {
      console.error('Error', error);
   }
};

const renderCart = ({ id, name, price, count }) => {
   const cartItems = document.createElement('div');
   cartItems.classList.add('cart__item');
   cartItems.id = id;

   cartItems.innerHTML = `
               <h1 id=${id}>${name}</h1>
               <div>
                  <button class='cart__plus' data-id='plus'>+</button>
                  <span class='cart__count'>${count}</span>
                  <button data-id='minus'>-</button>
               </div>
               <strong class='cart__price'>${price}</strong>
               <button data-id='remove' class='cart__remove'>Remove</button>
            `;

   cart.append(cartItems);

   updateCartTotal();
};

cartData.forEach((cart) => renderCart(cart));

const addToCart = (event) => {
   if (event.target.dataset.id === 'add') {
      const parentNode = event.target.closest('.fruit__item');
      const id = Number(parentNode.id);
      const name = parentNode.querySelector('.fruit__name').textContent;
      const price = parentNode.querySelector('.fruit__price').textContent;

      const cartItems = {
         id,
         name,
         price,
         count: 1,
      };

      const findCartItems = cartData.find((item) => item.id === id);

      if (findCartItems) {
         cartData.map((cart) => {
            return cart.id === cartItems.id
               ? { ...cart, count: cart.count + 1 }
               : cart;
         });
      } else {
         cartData.push(cartItems);

         renderCart(cartItems);
      }
   }
};

const removeCart = (event) => {
   if (event.target.dataset.id === 'remove') {
      const parentNode = event.target.closest('.cart__item');
      const id = Number(parentNode.id);

      cartData = cartData.filter((cart) => cart.id !== id);
      parentNode.remove();

      updateCartTotal();
   }
};

const updatePriceCount = (event) => {
   if (event.target.dataset.id === 'plus') {
      const parentNode = event.target.closest('.cart__item');
      const id = Number(parentNode.id);

      let items = cartData.find((cart) => cart.id === id);

      const cartCount = parentNode.querySelector('.cart__count');
      cartCount.innerHTML = ++items.count;

      updateCartTotal();
   }

   if (event.target.dataset.id === 'minus') {
      const parentNode = event.target.closest('.cart__item');
      const id = Number(parentNode.id);

      let items = cartData.find((cart) => cart.id === id);

      const cartCount = parentNode.querySelector('.cart__count');

      cartCount.innerHTML =
         items.count === 1 ? (items.count = 1) : (items.count -= 1);

      updateCartTotal();
   }
};

getData();

fruits.addEventListener('click', addToCart);
cart.addEventListener('click', removeCart);
cart.addEventListener('click', updatePriceCount);
