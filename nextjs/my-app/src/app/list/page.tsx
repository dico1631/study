/* eslint-disable @next/next/no-img-element */
import Image from "next/image"
import IE from '/public/IE.png'

export default function List() {
  let products = ["tomatoes", 'pasta', 'coconut'];
  return(
    <div>
      <h4 className="title">상품목록</h4>
      {products.map((product, idx) => (
        <div className="food" key={product}>
          <h4>{product}</h4>
          {/* <Image src={IE} alt="IE 장례식" className="food-image"/> */}
          <img src={`/food_${idx}.png`} alt="IE 장례식" className="food-image"/>
        </div>
      ))}
    </div>
  );
}
