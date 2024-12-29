export const registerFormControls = [
    {
      name: "userName",
      label: "User Name",
      placeholder: "Enter your user name",
      componentType: "input",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];

  export const loginFormControls = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];

  export const addProductFormElements = [
    {
      label: "Title",
      name: "title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componentType: "select",
      options: [
        { id: "men", label: "Men" },
        { id: "women", label: "Women" },
        { id: "kids", label: "Kids" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
      ],
    },
    {
    label: "Types",
    name: "types",
    componentType: "select",
    options: {
      men: [
        { id: "shirts", label: "Shirts" },
        { id: "polo", label: "Polo" },
        { id: "jackets", label: "Jackets" },
        { id: "suits", label: "Suits" },
        { id: "pants", label:"Pants"},
      ],
      women: [
        { id: "dresses", label: "Dresses" },
        { id: "blouses", label: "Blouses" },
        { id: "skirts", label: "Skirts" },
        { id: "coats", label: "Coats" },
        { id: "shirts", label: "Shirts" }
      ],
      kids: [
        { id: "tops", label: "Tops" },
        { id: "bottoms", label: "Bottoms" },
        { id: "outerwear", label: "Outerwear" },
        { id: "school-uniforms", label: "School Uniforms" },
      ],
      accessories: [
        { id: "bags", label: "Bags" },
        { id: "belts", label: "Belts" },
        { id: "hats", label: "Hats" },
        { id: "sunglasses", label: "Sunglasses" },
      ],
      footwear: [
        { id: "sneakers", label: "Sneakers" },
        { id: "boots", label: "Boots" },
        { id: "sandals", label: "Sandals" },
        { id: "dress-shoes", label: "Dress Shoes" },
      ],
    },
  },
    {
      label:"Size",
      name:"size",
      componentType:"select",
      options:[
        {id:"xxs",label:"XXS"},
        {id:"xs",label:"XS"},
        {id: "s",label:"S"},
        {id: "m",label:"M"},
        {id: "l",label:"L"},
        {id: "xl",label:"XL"},
        {id: "xxl", lael:"XXL"},
      ]
    },
    {
      label:"Colour",
      name:"colour",
      componentType:"select",
      options:[
        {id:"white",label:"White"},
        {id:"black",label:"Black"},
        {id: "red",label:"Red"},
        {id: "green",label:"Green"},
        {id: "orange",label:"orange"},
        {id: "blue",label:"Blue"},
        {id: "grey", lael:"Grey"},
      ]
    },
    {
      label: "Price",
      name: "price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price",
      name: "salePrice",
      componentType: "input",
      type: "number",
      placeholder: "Enter sale price (optional)",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componentType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
  ];

  export const shoppingViewHeaderMenuItems = [
    {
      id: "home",
      label: "Home",
      path: "/shop/home",
    },
    {
      id: "products",
      label: "Products",
      path: "/shop/listing",
    },
    {
      id: "men",
      label: "Men",
      path: "/shop/listing",
    },
    {
      id: "women",
      label: "Women",
      path: "/shop/listing",
    },
    {
      id: "kids",
      label: "Kids",
      path: "/shop/listing",
    },
    {
      id: "footwear",
      label: "Footwear",
      path: "/shop/listing",
    },
    {
      id: "accessories",
      label: "Accessories",
      path: "/shop/listing",
    },
    {
      id: "search",
      label: "Search",
      path: "/shop/search",
    },
  ];

  export const filterOptions = {
    category: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
    types: {
      men: [
        { id: "shirts", label: "Shirts" },
        { id: "polo", label: "Polo" },
        { id: "jackets", label: "Jackets" },
        { id: "suits", label: "Suits" },
        { id: "pants", label: "Pants" },
      ],
      women: [
        { id: "dresses", label: "Dresses" },
        { id: "blouses", label: "Blouses" },
        { id: "skirts", label: "Skirts" },
        { id: "coats", label: "Coats" },
      ],
      kids: [
        { id: "tops", label: "Tops" },
        { id: "bottoms", label: "Bottoms" },
        { id: "outerwear", label: "Outerwear" },
        { id: "school-uniforms", label: "School Uniforms" },
      ],
      accessories: [
        { id: "bags", label: "Bags" },
        { id: "belts", label: "Belts" },
        { id: "hats", label: "Hats" },
        { id: "sunglasses", label: "Sunglasses" },
      ],
      footwear: [
        { id: "sneakers", label: "Sneakers" },
        { id: "boots", label: "Boots" },
        { id: "sandals", label: "Sandals" },
        { id: "dress-shoes", label: "Dress Shoes" },
      ],
    },
    size: [
      { id: "xxs", label: "XXS" },
      { id: "xs", label: "XS" },
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
      { id: "xxl", label: "XXL" },
    ],
    colour: [
      { id: "white", label: "White" },
      { id: "black", label: "Black" },
      { id: "red", label: "Red" },
      { id: "green", label: "Green" },
      { id: "orange", label: "Orange" },
      { id: "blue", label: "Blue" },
      { id: "grey", label: "Grey" },
    ],
  };

  export const sortOptions = [
    { id: "latest", label: "Latest" },
    { id: "price-low-high", label: "Price: Low to High" },
    { id: "price-high-low", label: "Price: High to Low" },
    {
      id: "title-atoz",
      label: "Title: A to Z",
    },
    {
      id: "title-ztoa",
      label: "Title: Z to A",
    },
    {
      id: "newest",
      label: "Newest First",
    },
    {
      id: "oldest",
      label: "Oldest First",
    },
  ];

  export const categoryOptionsMap = {
    men: "Men",
    women: "Women",
    kids: "Kids",
    accessories: "Accessories",
    footwear: "Footwear",
  };
  
  export const brandOptionsMap = {
    nike: "Nike",
    adidas: "Adidas",
    puma: "Puma",
    levi: "Levi",
    zara: "Zara",
    "h&m": "H&M",
  };
  
  export const addressFormControls = [
    {
      label: "Address",
      name: "address",
      componentType: "input",
      type: "text",
      placeholder: "Enter your address",
    },
    {
      label: "City",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      label: "Pincode",
      name: "pincode",
      componentType: "input",
      type: "text",
      placeholder: "Enter your pincode",
    },
    {
      label: "Phone",
      name: "phone",
      componentType: "input",
      type: "text",
      placeholder: "Enter your phone number",
    },
    {
      label: "Notes",
      name: "notes",
      componentType: "textarea",
      placeholder: "Enter any additional notes",
    },
  ];