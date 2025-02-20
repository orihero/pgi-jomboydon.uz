import React from 'react';

export default function Products() {
  const products = [
    {
      id: '01',
      title: 'Maslo podsolnechnoye',
      titleUz: "Kungaboqar yog'i",
      image: '/images/products/oil.jpg'
    },
    {
      id: '02',
      title: 'Shrot podsolnechnyy',
      titleUz: 'Kungaboqar shroti',
      image: '/images/products/sunflower-meal.jpg'
    },
    {
      id: '03',
      title: 'Shelukha podsolnechnaya',
      titleUz: "Kungaboqar po'chog'i",
      image: '/images/products/sunflower-husk.jpg'
    },
    {
      id: '04',
      title: 'Kontsentrat podsolnechnyy',
      titleUz: 'Kungaboqar konsentrati',
      image: '/images/products/sunflower-concentrate.jpg'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Mahsulotlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={product.image} 
                alt={product.titleUz}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.titleUz}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 