/* eslint-disable @typescript-eslint/no-explicit-any */
// // types/product.ts
// export interface Product {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     _id: string; 
//   imgList: any;
//   img: string;
//   category: string;
//   title: string;
//   description: string;
//   features: string[];
//   images?: string[]; 
// }

export interface Product {
  _id: string;
  img: string;
  title: string;
  description: string;
  features: string[];
  ar?: any[];
  en?: any[];
}
