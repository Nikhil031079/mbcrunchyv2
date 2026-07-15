/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as about_page from "../about_page.js";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as cart_extras from "../cart_extras.js";
import type * as categories from "../categories.js";
import type * as combos from "../combos.js";
import type * as content from "../content.js";
import type * as coupons from "../coupons.js";
import type * as customers from "../customers.js";
import type * as delivery_extras from "../delivery_extras.js";
import type * as http from "../http.js";
import type * as inventory from "../inventory.js";
import type * as media from "../media.js";
import type * as offers from "../offers.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as products_extras from "../products_extras.js";
import type * as reviews from "../reviews.js";
import type * as security from "../security.js";
import type * as settings from "../settings.js";
import type * as storage from "../storage.js";
import type * as test_crud from "../test_crud.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  about_page: typeof about_page;
  admin: typeof admin;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  cart_extras: typeof cart_extras;
  categories: typeof categories;
  combos: typeof combos;
  content: typeof content;
  coupons: typeof coupons;
  customers: typeof customers;
  delivery_extras: typeof delivery_extras;
  http: typeof http;
  inventory: typeof inventory;
  media: typeof media;
  offers: typeof offers;
  orders: typeof orders;
  products: typeof products;
  products_extras: typeof products_extras;
  reviews: typeof reviews;
  security: typeof security;
  settings: typeof settings;
  storage: typeof storage;
  test_crud: typeof test_crud;
  testimonials: typeof testimonials;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
