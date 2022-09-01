import {
  RecoilRoot,
  atom,
  useRecoilState,
  selector,
  useRecoilValue,
} from "recoil";

const inventory = {
  a: { name: "Tea", price: 12 },
  b: { name: "Coffee", price: 18 },
  c: { name: "Pepsi", price: 9 },
};

const destinations = {
  US: 30,
  CA: 40,
  CO: 50,
};

const cartState = atom({
  key: "cartState",
  default: {},
});

const shippingState = atom({
  key: "shippingState",
  default: "US",
});

export default function App() {
  return (
    <RecoilRoot>
      <AvailableItems />
      <Cart />
    </RecoilRoot>
  );
}

function AvailableItems() {
  const [cart, setCart] = useRecoilState(cartState);

  return (
    <div>
      <h2>Available Items</h2>
      <ul>
        {Object.entries(inventory).map(([id, { name, price }]) => (
          <li key={id}>
            {name} @ ${price.toFixed(2)}
            <button
              onClick={() => {
                setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
              }}
            >
              Add
            </button>
            {cart[id] && (
              <button
                onClick={() => {
                  const copy = { ...cart };
                  if (copy[id] === 1) {
                    delete copy[id];
                    setCart(copy);
                  } else {
                    setCart({ ...cart, [id]: copy[id] - 1 });
                  }
                }}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cart() {
  return (
    <div>
      <h2>Cart</h2>
      <CartItems />
      <Shipping />
      <Totals />
    </div>
  );
}

function CartItems() {
  const cart = useRecoilValue(cartState);

  if (Object.keys(cart).length === 0) {
    return <p>No Items</p>;
  }

  return (
    <ul>
      {Object.entries(cart).map(([id, quantity]) => (
        <li key={id}>
          {inventory[id].name} * {quantity}
        </li>
      ))}
    </ul>
  );
}

function Shipping() {
  const [shipping, setShipping] = useRecoilState(shippingState);
  return (
    <div>
      <h2>Shipping</h2>
      {Object.entries(destinations).map(([country, price]) => (
        <button
          onClick={() => {
            setShipping(country);
          }}
        >
          {country} @ {price} {country === shipping ? <span> ❤</span> : ""}
        </button>
      ))}
    </div>
  );
}

const totalState = selector({
  key: "totalState",
  get: ({ get }) => {
    const cart = get(cartState);
    const shipping = get(shippingState);
    const subtotal = Object.entries(cart).reduce(
      (acc, [id, quantity]) => acc + inventory[id].price * quantity,
      0
    );
    const shippingTotal = destinations[shipping]

    return {
      subtotal , 
      shipping : shippingTotal , 
      total : subtotal + shippingTotal
    }

  }

  
});

function Totals() {
  const totals = useRecoilValue(totalState)

  return (
    <div>
      <h2>Totals </h2>

      <p>Subtotal : ${totals.subtotal.toFixed(2)}</p>

      <p>Shipping : ${totals.shipping.toFixed(2)}</p>

      <p>Total : ${totals.total.toFixed(2)}</p>


    </div>
  )
}
