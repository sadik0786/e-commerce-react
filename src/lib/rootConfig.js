const rootConfig = {
  appWriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
  appWriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  appWriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
  appWriteUsersId: String(process.env.NEXT_PUBLIC_APPWRITE_USERS_ID),
  appWriteProductId: String(process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_ID),
  appWriteWishlistId: String(process.env.NEXT_PUBLIC_APPWRITE_WISHLIST_ID),
  appWriteCartId: String(process.env.NEXT_PUBLIC_APPWRITE_CART_ID),
  appWriteBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID),
  appWriteUserMessageId: String(
    process.env.NEXT_PUBLIC_APPWRITE_USERMESSAGE_ID,
  ),
  appWriteOrdersId: String(process.env.NEXT_PUBLIC_APPWRITE_ORDERS_ID),
};

export default rootConfig;