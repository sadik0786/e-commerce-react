import rootConfig from "../lib/rootConfig";
import { Client, ID, Databases, Storage, Query } from "appwrite";

// create a class
export class ConfigService {
  client = new Client();
  databases;
  storage;
  // create a constructor
  constructor() {
    this.client
      .setEndpoint(rootConfig.appWriteUrl)
      .setProject(rootConfig.appWriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }
  // create add product method
  async addProduct({ title, price, productImage, description, slug, status, stock, category }) {
    try {
        return await this.databases.createDocument(
            rootConfig.appWriteDatabaseId,
            rootConfig.appWriteProductId,
            ID.unique(),
            {
                title,
                price,
                productImage,
                description,
                slug,
                status,
                stock,
                category,
            }
        )
    } catch (error) {
      console.log("Appwrite service :: addProduct :: error", error);
      throw error;
    }
  }
  // create get products method
  async getProducts() {
    try {
      return await this.databases.listDocuments(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteProductId
      );
    } catch (error) {
      console.log("Appwrite service :: getProducts :: error", error);
      throw error;
    }
  }
  // create update product method
  async updateProduct({ id, title, price, productImage, description, slug, status, stock, category }) {
    try {
      return await this.databases.updateDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteProductId,
        id,
        {
          title,
          price,
          productImage,
          description,
          slug,
          status,
          stock,
          category,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateProduct :: error", error);
      throw error;
    }
  }
  // create delete product method
  async deleteProduct({ id }) {
    try {
      return await this.databases.deleteDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteProductId,
        id
      );
    } catch (error) {
      console.log("Appwrite service :: deleteProduct :: error", error);
      throw error;
    }
  }
  // create get product method
  async getProduct({ id }) {
    try {
      return await this.databases.getDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteProductId,
        id
      );
    } catch (error) {
      console.log("Appwrite service :: getProduct :: error", error);
      throw error;
    }
  }
  // create add to wishlist method
  async addToWishlist({ productId, userId }) {
    try {
      return await this.databases.createDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteWishlistId,
        ID.unique(),
        {
          productId,
          userId,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: addToWishlist :: error", error);
      throw error;
    }
  }
  // create get wishlist method
  async getWishlist({ userId }) {
    try {
      return await this.databases.listDocuments(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteWishlistId,
        [Query.equal("userId", userId)]
      );
    } catch (error) {
      console.log("Appwrite service :: getWishlist :: error", error);
      throw error;
    }
  }
  // create remove from wishlist method
  async removeFromWishlist({ id }) {
    try {
      return await this.databases.deleteDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteWishlistId,
        id
      );
    } catch (error) {
      console.log("Appwrite service :: removeFromWishlist :: error", error);
      throw error;
    }
  }
  // create add to cart method
  async addToCart({ productId, userId, quantity }) {
    try {
      return await this.databases.createDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteCartId,
        ID.unique(),
        {
          productId,
          userId,
          quantity,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: addToCart :: error", error);
      throw error;
    }
  }
  // create get cart method
  async getCart({ userId }) {
    try {
      return await this.databases.listDocuments(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteCartId,
        [Query.equal("userId", userId)]
      );
    } catch (error) {
      console.log("Appwrite service :: getCart :: error", error);
      throw error;
    }
  }
  // create remove from cart method
  async removeFromCart({ id }) {
    try {
      return await this.databases.deleteDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteCartId,
        id
      );
    } catch (error) {
      console.log("Appwrite service :: removeFromCart :: error", error);
      throw error;
    }
  }
  // create update cart method
  async updateCart({ id, quantity }) {
    try {
      return await this.databases.updateDocument(
        rootConfig.appWriteDatabaseId,
        rootConfig.appWriteCartId,
        id,
        {
          quantity,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateCart :: error", error);
      throw error;
    }
  }
}


// create a instance of configservice
const configService = new ConfigService();

// export the configservice
export default configService;
