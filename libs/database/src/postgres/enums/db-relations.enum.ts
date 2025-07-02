/* 
####### NOTE #######
This enum is used to centralize all database relationship keys.
For example, instead of using strings like 'user', 'products', or 'basket' directly in the code, 
you should use DB_RELATIONS.user, DB_RELATIONS.products, and DB_RELATIONS.basket respectively.
This ensures consistency and avoids hardcoding strings throughout the project.
*/
export enum DbRelationsEnum {
  user = 'user'
}
