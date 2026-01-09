
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model DigitalProduct
 * 
 */
export type DigitalProduct = $Result.DefaultSelection<Prisma.$DigitalProductPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AccountOfficer
 * 
 */
export type AccountOfficer = $Result.DefaultSelection<Prisma.$AccountOfficerPayload>
/**
 * Model SosData
 * 
 */
export type SosData = $Result.DefaultSelection<Prisma.$SosDataPayload>
/**
 * Model HsiData
 * 
 */
export type HsiData = $Result.DefaultSelection<Prisma.$HsiDataPayload>
/**
 * Model SpmkMom
 * 
 */
export type SpmkMom = $Result.DefaultSelection<Prisma.$SpmkMomPayload>
/**
 * Model DocumentData
 * 
 */
export type DocumentData = $Result.DefaultSelection<Prisma.$DocumentDataPayload>
/**
 * Model OrderProduct
 * 
 */
export type OrderProduct = $Result.DefaultSelection<Prisma.$OrderProductPayload>
/**
 * Model Target
 * 
 */
export type Target = $Result.DefaultSelection<Prisma.$TargetPayload>
/**
 * Model CustomTarget
 * 
 */
export type CustomTarget = $Result.DefaultSelection<Prisma.$CustomTargetPayload>
/**
 * Model UserTableConfiguration
 * 
 */
export type UserTableConfiguration = $Result.DefaultSelection<Prisma.$UserTableConfigurationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more DigitalProducts
 * const digitalProducts = await prisma.digitalProduct.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more DigitalProducts
   * const digitalProducts = await prisma.digitalProduct.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.digitalProduct`: Exposes CRUD operations for the **DigitalProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DigitalProducts
    * const digitalProducts = await prisma.digitalProduct.findMany()
    * ```
    */
  get digitalProduct(): Prisma.DigitalProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accountOfficer`: Exposes CRUD operations for the **AccountOfficer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccountOfficers
    * const accountOfficers = await prisma.accountOfficer.findMany()
    * ```
    */
  get accountOfficer(): Prisma.AccountOfficerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sosData`: Exposes CRUD operations for the **SosData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SosData
    * const sosData = await prisma.sosData.findMany()
    * ```
    */
  get sosData(): Prisma.SosDataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hsiData`: Exposes CRUD operations for the **HsiData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HsiData
    * const hsiData = await prisma.hsiData.findMany()
    * ```
    */
  get hsiData(): Prisma.HsiDataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.spmkMom`: Exposes CRUD operations for the **SpmkMom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpmkMoms
    * const spmkMoms = await prisma.spmkMom.findMany()
    * ```
    */
  get spmkMom(): Prisma.SpmkMomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.documentData`: Exposes CRUD operations for the **DocumentData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DocumentData
    * const documentData = await prisma.documentData.findMany()
    * ```
    */
  get documentData(): Prisma.DocumentDataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderProduct`: Exposes CRUD operations for the **OrderProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderProducts
    * const orderProducts = await prisma.orderProduct.findMany()
    * ```
    */
  get orderProduct(): Prisma.OrderProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.target`: Exposes CRUD operations for the **Target** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Targets
    * const targets = await prisma.target.findMany()
    * ```
    */
  get target(): Prisma.TargetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customTarget`: Exposes CRUD operations for the **CustomTarget** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomTargets
    * const customTargets = await prisma.customTarget.findMany()
    * ```
    */
  get customTarget(): Prisma.CustomTargetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userTableConfiguration`: Exposes CRUD operations for the **UserTableConfiguration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserTableConfigurations
    * const userTableConfigurations = await prisma.userTableConfiguration.findMany()
    * ```
    */
  get userTableConfiguration(): Prisma.UserTableConfigurationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    DigitalProduct: 'DigitalProduct',
    User: 'User',
    AccountOfficer: 'AccountOfficer',
    SosData: 'SosData',
    HsiData: 'HsiData',
    SpmkMom: 'SpmkMom',
    DocumentData: 'DocumentData',
    OrderProduct: 'OrderProduct',
    Target: 'Target',
    CustomTarget: 'CustomTarget',
    UserTableConfiguration: 'UserTableConfiguration'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "digitalProduct" | "user" | "accountOfficer" | "sosData" | "hsiData" | "spmkMom" | "documentData" | "orderProduct" | "target" | "customTarget" | "userTableConfiguration"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      DigitalProduct: {
        payload: Prisma.$DigitalProductPayload<ExtArgs>
        fields: Prisma.DigitalProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DigitalProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DigitalProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>
          }
          findFirst: {
            args: Prisma.DigitalProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DigitalProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>
          }
          findMany: {
            args: Prisma.DigitalProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>[]
          }
          create: {
            args: Prisma.DigitalProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>
          }
          createMany: {
            args: Prisma.DigitalProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DigitalProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>[]
          }
          delete: {
            args: Prisma.DigitalProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>
          }
          update: {
            args: Prisma.DigitalProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>
          }
          deleteMany: {
            args: Prisma.DigitalProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DigitalProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DigitalProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>[]
          }
          upsert: {
            args: Prisma.DigitalProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalProductPayload>
          }
          aggregate: {
            args: Prisma.DigitalProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDigitalProduct>
          }
          groupBy: {
            args: Prisma.DigitalProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<DigitalProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.DigitalProductCountArgs<ExtArgs>
            result: $Utils.Optional<DigitalProductCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AccountOfficer: {
        payload: Prisma.$AccountOfficerPayload<ExtArgs>
        fields: Prisma.AccountOfficerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountOfficerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountOfficerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>
          }
          findFirst: {
            args: Prisma.AccountOfficerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountOfficerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>
          }
          findMany: {
            args: Prisma.AccountOfficerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>[]
          }
          create: {
            args: Prisma.AccountOfficerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>
          }
          createMany: {
            args: Prisma.AccountOfficerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountOfficerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>[]
          }
          delete: {
            args: Prisma.AccountOfficerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>
          }
          update: {
            args: Prisma.AccountOfficerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>
          }
          deleteMany: {
            args: Prisma.AccountOfficerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountOfficerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountOfficerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>[]
          }
          upsert: {
            args: Prisma.AccountOfficerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountOfficerPayload>
          }
          aggregate: {
            args: Prisma.AccountOfficerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccountOfficer>
          }
          groupBy: {
            args: Prisma.AccountOfficerGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountOfficerGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountOfficerCountArgs<ExtArgs>
            result: $Utils.Optional<AccountOfficerCountAggregateOutputType> | number
          }
        }
      }
      SosData: {
        payload: Prisma.$SosDataPayload<ExtArgs>
        fields: Prisma.SosDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SosDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SosDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>
          }
          findFirst: {
            args: Prisma.SosDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SosDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>
          }
          findMany: {
            args: Prisma.SosDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>[]
          }
          create: {
            args: Prisma.SosDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>
          }
          createMany: {
            args: Prisma.SosDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SosDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>[]
          }
          delete: {
            args: Prisma.SosDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>
          }
          update: {
            args: Prisma.SosDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>
          }
          deleteMany: {
            args: Prisma.SosDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SosDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SosDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>[]
          }
          upsert: {
            args: Prisma.SosDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SosDataPayload>
          }
          aggregate: {
            args: Prisma.SosDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSosData>
          }
          groupBy: {
            args: Prisma.SosDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<SosDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.SosDataCountArgs<ExtArgs>
            result: $Utils.Optional<SosDataCountAggregateOutputType> | number
          }
        }
      }
      HsiData: {
        payload: Prisma.$HsiDataPayload<ExtArgs>
        fields: Prisma.HsiDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HsiDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HsiDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>
          }
          findFirst: {
            args: Prisma.HsiDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HsiDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>
          }
          findMany: {
            args: Prisma.HsiDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>[]
          }
          create: {
            args: Prisma.HsiDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>
          }
          createMany: {
            args: Prisma.HsiDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HsiDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>[]
          }
          delete: {
            args: Prisma.HsiDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>
          }
          update: {
            args: Prisma.HsiDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>
          }
          deleteMany: {
            args: Prisma.HsiDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HsiDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HsiDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>[]
          }
          upsert: {
            args: Prisma.HsiDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HsiDataPayload>
          }
          aggregate: {
            args: Prisma.HsiDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHsiData>
          }
          groupBy: {
            args: Prisma.HsiDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<HsiDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.HsiDataCountArgs<ExtArgs>
            result: $Utils.Optional<HsiDataCountAggregateOutputType> | number
          }
        }
      }
      SpmkMom: {
        payload: Prisma.$SpmkMomPayload<ExtArgs>
        fields: Prisma.SpmkMomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpmkMomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpmkMomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>
          }
          findFirst: {
            args: Prisma.SpmkMomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpmkMomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>
          }
          findMany: {
            args: Prisma.SpmkMomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>[]
          }
          create: {
            args: Prisma.SpmkMomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>
          }
          createMany: {
            args: Prisma.SpmkMomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpmkMomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>[]
          }
          delete: {
            args: Prisma.SpmkMomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>
          }
          update: {
            args: Prisma.SpmkMomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>
          }
          deleteMany: {
            args: Prisma.SpmkMomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpmkMomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpmkMomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>[]
          }
          upsert: {
            args: Prisma.SpmkMomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpmkMomPayload>
          }
          aggregate: {
            args: Prisma.SpmkMomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpmkMom>
          }
          groupBy: {
            args: Prisma.SpmkMomGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpmkMomGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpmkMomCountArgs<ExtArgs>
            result: $Utils.Optional<SpmkMomCountAggregateOutputType> | number
          }
        }
      }
      DocumentData: {
        payload: Prisma.$DocumentDataPayload<ExtArgs>
        fields: Prisma.DocumentDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>
          }
          findFirst: {
            args: Prisma.DocumentDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>
          }
          findMany: {
            args: Prisma.DocumentDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>[]
          }
          create: {
            args: Prisma.DocumentDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>
          }
          createMany: {
            args: Prisma.DocumentDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>[]
          }
          delete: {
            args: Prisma.DocumentDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>
          }
          update: {
            args: Prisma.DocumentDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>[]
          }
          upsert: {
            args: Prisma.DocumentDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentDataPayload>
          }
          aggregate: {
            args: Prisma.DocumentDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocumentData>
          }
          groupBy: {
            args: Prisma.DocumentDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentDataCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentDataCountAggregateOutputType> | number
          }
        }
      }
      OrderProduct: {
        payload: Prisma.$OrderProductPayload<ExtArgs>
        fields: Prisma.OrderProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>
          }
          findFirst: {
            args: Prisma.OrderProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>
          }
          findMany: {
            args: Prisma.OrderProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>[]
          }
          create: {
            args: Prisma.OrderProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>
          }
          createMany: {
            args: Prisma.OrderProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>[]
          }
          delete: {
            args: Prisma.OrderProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>
          }
          update: {
            args: Prisma.OrderProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>
          }
          deleteMany: {
            args: Prisma.OrderProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>[]
          }
          upsert: {
            args: Prisma.OrderProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderProductPayload>
          }
          aggregate: {
            args: Prisma.OrderProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderProduct>
          }
          groupBy: {
            args: Prisma.OrderProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderProductCountArgs<ExtArgs>
            result: $Utils.Optional<OrderProductCountAggregateOutputType> | number
          }
        }
      }
      Target: {
        payload: Prisma.$TargetPayload<ExtArgs>
        fields: Prisma.TargetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TargetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TargetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>
          }
          findFirst: {
            args: Prisma.TargetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TargetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>
          }
          findMany: {
            args: Prisma.TargetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>[]
          }
          create: {
            args: Prisma.TargetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>
          }
          createMany: {
            args: Prisma.TargetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TargetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>[]
          }
          delete: {
            args: Prisma.TargetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>
          }
          update: {
            args: Prisma.TargetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>
          }
          deleteMany: {
            args: Prisma.TargetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TargetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TargetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>[]
          }
          upsert: {
            args: Prisma.TargetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TargetPayload>
          }
          aggregate: {
            args: Prisma.TargetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTarget>
          }
          groupBy: {
            args: Prisma.TargetGroupByArgs<ExtArgs>
            result: $Utils.Optional<TargetGroupByOutputType>[]
          }
          count: {
            args: Prisma.TargetCountArgs<ExtArgs>
            result: $Utils.Optional<TargetCountAggregateOutputType> | number
          }
        }
      }
      CustomTarget: {
        payload: Prisma.$CustomTargetPayload<ExtArgs>
        fields: Prisma.CustomTargetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomTargetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomTargetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>
          }
          findFirst: {
            args: Prisma.CustomTargetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomTargetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>
          }
          findMany: {
            args: Prisma.CustomTargetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>[]
          }
          create: {
            args: Prisma.CustomTargetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>
          }
          createMany: {
            args: Prisma.CustomTargetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomTargetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>[]
          }
          delete: {
            args: Prisma.CustomTargetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>
          }
          update: {
            args: Prisma.CustomTargetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>
          }
          deleteMany: {
            args: Prisma.CustomTargetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomTargetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomTargetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>[]
          }
          upsert: {
            args: Prisma.CustomTargetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomTargetPayload>
          }
          aggregate: {
            args: Prisma.CustomTargetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomTarget>
          }
          groupBy: {
            args: Prisma.CustomTargetGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomTargetGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomTargetCountArgs<ExtArgs>
            result: $Utils.Optional<CustomTargetCountAggregateOutputType> | number
          }
        }
      }
      UserTableConfiguration: {
        payload: Prisma.$UserTableConfigurationPayload<ExtArgs>
        fields: Prisma.UserTableConfigurationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserTableConfigurationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserTableConfigurationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>
          }
          findFirst: {
            args: Prisma.UserTableConfigurationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserTableConfigurationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>
          }
          findMany: {
            args: Prisma.UserTableConfigurationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>[]
          }
          create: {
            args: Prisma.UserTableConfigurationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>
          }
          createMany: {
            args: Prisma.UserTableConfigurationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserTableConfigurationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>[]
          }
          delete: {
            args: Prisma.UserTableConfigurationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>
          }
          update: {
            args: Prisma.UserTableConfigurationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>
          }
          deleteMany: {
            args: Prisma.UserTableConfigurationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserTableConfigurationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserTableConfigurationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>[]
          }
          upsert: {
            args: Prisma.UserTableConfigurationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTableConfigurationPayload>
          }
          aggregate: {
            args: Prisma.UserTableConfigurationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserTableConfiguration>
          }
          groupBy: {
            args: Prisma.UserTableConfigurationGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserTableConfigurationGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserTableConfigurationCountArgs<ExtArgs>
            result: $Utils.Optional<UserTableConfigurationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    digitalProduct?: DigitalProductOmit
    user?: UserOmit
    accountOfficer?: AccountOfficerOmit
    sosData?: SosDataOmit
    hsiData?: HsiDataOmit
    spmkMom?: SpmkMomOmit
    documentData?: DocumentDataOmit
    orderProduct?: OrderProductOmit
    target?: TargetOmit
    customTarget?: CustomTargetOmit
    userTableConfiguration?: UserTableConfigurationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    customTargets: number
    userTableConfigurations: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customTargets?: boolean | UserCountOutputTypeCountCustomTargetsArgs
    userTableConfigurations?: boolean | UserCountOutputTypeCountUserTableConfigurationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCustomTargetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomTargetWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserTableConfigurationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserTableConfigurationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model DigitalProduct
   */

  export type AggregateDigitalProduct = {
    _count: DigitalProductCountAggregateOutputType | null
    _avg: DigitalProductAvgAggregateOutputType | null
    _sum: DigitalProductSumAggregateOutputType | null
    _min: DigitalProductMinAggregateOutputType | null
    _max: DigitalProductMaxAggregateOutputType | null
  }

  export type DigitalProductAvgAggregateOutputType = {
    id: number | null
    revenue: Decimal | null
    amount: Decimal | null
  }

  export type DigitalProductSumAggregateOutputType = {
    id: bigint | null
    revenue: Decimal | null
    amount: Decimal | null
  }

  export type DigitalProductMinAggregateOutputType = {
    id: bigint | null
    orderNumber: string | null
    productName: string | null
    customerName: string | null
    poName: string | null
    witel: string | null
    branch: string | null
    revenue: Decimal | null
    amount: Decimal | null
    status: string | null
    milestone: string | null
    segment: string | null
    category: string | null
    subType: string | null
    orderDate: Date | null
    batchId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DigitalProductMaxAggregateOutputType = {
    id: bigint | null
    orderNumber: string | null
    productName: string | null
    customerName: string | null
    poName: string | null
    witel: string | null
    branch: string | null
    revenue: Decimal | null
    amount: Decimal | null
    status: string | null
    milestone: string | null
    segment: string | null
    category: string | null
    subType: string | null
    orderDate: Date | null
    batchId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DigitalProductCountAggregateOutputType = {
    id: number
    orderNumber: number
    productName: number
    customerName: number
    poName: number
    witel: number
    branch: number
    revenue: number
    amount: number
    status: number
    milestone: number
    segment: number
    category: number
    subType: number
    orderDate: number
    batchId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DigitalProductAvgAggregateInputType = {
    id?: true
    revenue?: true
    amount?: true
  }

  export type DigitalProductSumAggregateInputType = {
    id?: true
    revenue?: true
    amount?: true
  }

  export type DigitalProductMinAggregateInputType = {
    id?: true
    orderNumber?: true
    productName?: true
    customerName?: true
    poName?: true
    witel?: true
    branch?: true
    revenue?: true
    amount?: true
    status?: true
    milestone?: true
    segment?: true
    category?: true
    subType?: true
    orderDate?: true
    batchId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DigitalProductMaxAggregateInputType = {
    id?: true
    orderNumber?: true
    productName?: true
    customerName?: true
    poName?: true
    witel?: true
    branch?: true
    revenue?: true
    amount?: true
    status?: true
    milestone?: true
    segment?: true
    category?: true
    subType?: true
    orderDate?: true
    batchId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DigitalProductCountAggregateInputType = {
    id?: true
    orderNumber?: true
    productName?: true
    customerName?: true
    poName?: true
    witel?: true
    branch?: true
    revenue?: true
    amount?: true
    status?: true
    milestone?: true
    segment?: true
    category?: true
    subType?: true
    orderDate?: true
    batchId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DigitalProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DigitalProduct to aggregate.
     */
    where?: DigitalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalProducts to fetch.
     */
    orderBy?: DigitalProductOrderByWithRelationInput | DigitalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DigitalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DigitalProducts
    **/
    _count?: true | DigitalProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DigitalProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DigitalProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DigitalProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DigitalProductMaxAggregateInputType
  }

  export type GetDigitalProductAggregateType<T extends DigitalProductAggregateArgs> = {
        [P in keyof T & keyof AggregateDigitalProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDigitalProduct[P]>
      : GetScalarType<T[P], AggregateDigitalProduct[P]>
  }




  export type DigitalProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DigitalProductWhereInput
    orderBy?: DigitalProductOrderByWithAggregationInput | DigitalProductOrderByWithAggregationInput[]
    by: DigitalProductScalarFieldEnum[] | DigitalProductScalarFieldEnum
    having?: DigitalProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DigitalProductCountAggregateInputType | true
    _avg?: DigitalProductAvgAggregateInputType
    _sum?: DigitalProductSumAggregateInputType
    _min?: DigitalProductMinAggregateInputType
    _max?: DigitalProductMaxAggregateInputType
  }

  export type DigitalProductGroupByOutputType = {
    id: bigint
    orderNumber: string | null
    productName: string | null
    customerName: string | null
    poName: string | null
    witel: string | null
    branch: string | null
    revenue: Decimal
    amount: Decimal
    status: string | null
    milestone: string | null
    segment: string | null
    category: string | null
    subType: string | null
    orderDate: Date | null
    batchId: string | null
    createdAt: Date
    updatedAt: Date
    _count: DigitalProductCountAggregateOutputType | null
    _avg: DigitalProductAvgAggregateOutputType | null
    _sum: DigitalProductSumAggregateOutputType | null
    _min: DigitalProductMinAggregateOutputType | null
    _max: DigitalProductMaxAggregateOutputType | null
  }

  type GetDigitalProductGroupByPayload<T extends DigitalProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DigitalProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DigitalProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DigitalProductGroupByOutputType[P]>
            : GetScalarType<T[P], DigitalProductGroupByOutputType[P]>
        }
      >
    >


  export type DigitalProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    productName?: boolean
    customerName?: boolean
    poName?: boolean
    witel?: boolean
    branch?: boolean
    revenue?: boolean
    amount?: boolean
    status?: boolean
    milestone?: boolean
    segment?: boolean
    category?: boolean
    subType?: boolean
    orderDate?: boolean
    batchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["digitalProduct"]>

  export type DigitalProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    productName?: boolean
    customerName?: boolean
    poName?: boolean
    witel?: boolean
    branch?: boolean
    revenue?: boolean
    amount?: boolean
    status?: boolean
    milestone?: boolean
    segment?: boolean
    category?: boolean
    subType?: boolean
    orderDate?: boolean
    batchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["digitalProduct"]>

  export type DigitalProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    productName?: boolean
    customerName?: boolean
    poName?: boolean
    witel?: boolean
    branch?: boolean
    revenue?: boolean
    amount?: boolean
    status?: boolean
    milestone?: boolean
    segment?: boolean
    category?: boolean
    subType?: boolean
    orderDate?: boolean
    batchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["digitalProduct"]>

  export type DigitalProductSelectScalar = {
    id?: boolean
    orderNumber?: boolean
    productName?: boolean
    customerName?: boolean
    poName?: boolean
    witel?: boolean
    branch?: boolean
    revenue?: boolean
    amount?: boolean
    status?: boolean
    milestone?: boolean
    segment?: boolean
    category?: boolean
    subType?: boolean
    orderDate?: boolean
    batchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DigitalProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderNumber" | "productName" | "customerName" | "poName" | "witel" | "branch" | "revenue" | "amount" | "status" | "milestone" | "segment" | "category" | "subType" | "orderDate" | "batchId" | "createdAt" | "updatedAt", ExtArgs["result"]["digitalProduct"]>

  export type $DigitalProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DigitalProduct"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      orderNumber: string | null
      productName: string | null
      customerName: string | null
      poName: string | null
      witel: string | null
      branch: string | null
      revenue: Prisma.Decimal
      amount: Prisma.Decimal
      status: string | null
      milestone: string | null
      segment: string | null
      category: string | null
      subType: string | null
      orderDate: Date | null
      batchId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["digitalProduct"]>
    composites: {}
  }

  type DigitalProductGetPayload<S extends boolean | null | undefined | DigitalProductDefaultArgs> = $Result.GetResult<Prisma.$DigitalProductPayload, S>

  type DigitalProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DigitalProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DigitalProductCountAggregateInputType | true
    }

  export interface DigitalProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DigitalProduct'], meta: { name: 'DigitalProduct' } }
    /**
     * Find zero or one DigitalProduct that matches the filter.
     * @param {DigitalProductFindUniqueArgs} args - Arguments to find a DigitalProduct
     * @example
     * // Get one DigitalProduct
     * const digitalProduct = await prisma.digitalProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DigitalProductFindUniqueArgs>(args: SelectSubset<T, DigitalProductFindUniqueArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DigitalProduct that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DigitalProductFindUniqueOrThrowArgs} args - Arguments to find a DigitalProduct
     * @example
     * // Get one DigitalProduct
     * const digitalProduct = await prisma.digitalProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DigitalProductFindUniqueOrThrowArgs>(args: SelectSubset<T, DigitalProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DigitalProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalProductFindFirstArgs} args - Arguments to find a DigitalProduct
     * @example
     * // Get one DigitalProduct
     * const digitalProduct = await prisma.digitalProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DigitalProductFindFirstArgs>(args?: SelectSubset<T, DigitalProductFindFirstArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DigitalProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalProductFindFirstOrThrowArgs} args - Arguments to find a DigitalProduct
     * @example
     * // Get one DigitalProduct
     * const digitalProduct = await prisma.digitalProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DigitalProductFindFirstOrThrowArgs>(args?: SelectSubset<T, DigitalProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DigitalProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DigitalProducts
     * const digitalProducts = await prisma.digitalProduct.findMany()
     * 
     * // Get first 10 DigitalProducts
     * const digitalProducts = await prisma.digitalProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const digitalProductWithIdOnly = await prisma.digitalProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DigitalProductFindManyArgs>(args?: SelectSubset<T, DigitalProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DigitalProduct.
     * @param {DigitalProductCreateArgs} args - Arguments to create a DigitalProduct.
     * @example
     * // Create one DigitalProduct
     * const DigitalProduct = await prisma.digitalProduct.create({
     *   data: {
     *     // ... data to create a DigitalProduct
     *   }
     * })
     * 
     */
    create<T extends DigitalProductCreateArgs>(args: SelectSubset<T, DigitalProductCreateArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DigitalProducts.
     * @param {DigitalProductCreateManyArgs} args - Arguments to create many DigitalProducts.
     * @example
     * // Create many DigitalProducts
     * const digitalProduct = await prisma.digitalProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DigitalProductCreateManyArgs>(args?: SelectSubset<T, DigitalProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DigitalProducts and returns the data saved in the database.
     * @param {DigitalProductCreateManyAndReturnArgs} args - Arguments to create many DigitalProducts.
     * @example
     * // Create many DigitalProducts
     * const digitalProduct = await prisma.digitalProduct.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DigitalProducts and only return the `id`
     * const digitalProductWithIdOnly = await prisma.digitalProduct.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DigitalProductCreateManyAndReturnArgs>(args?: SelectSubset<T, DigitalProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DigitalProduct.
     * @param {DigitalProductDeleteArgs} args - Arguments to delete one DigitalProduct.
     * @example
     * // Delete one DigitalProduct
     * const DigitalProduct = await prisma.digitalProduct.delete({
     *   where: {
     *     // ... filter to delete one DigitalProduct
     *   }
     * })
     * 
     */
    delete<T extends DigitalProductDeleteArgs>(args: SelectSubset<T, DigitalProductDeleteArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DigitalProduct.
     * @param {DigitalProductUpdateArgs} args - Arguments to update one DigitalProduct.
     * @example
     * // Update one DigitalProduct
     * const digitalProduct = await prisma.digitalProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DigitalProductUpdateArgs>(args: SelectSubset<T, DigitalProductUpdateArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DigitalProducts.
     * @param {DigitalProductDeleteManyArgs} args - Arguments to filter DigitalProducts to delete.
     * @example
     * // Delete a few DigitalProducts
     * const { count } = await prisma.digitalProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DigitalProductDeleteManyArgs>(args?: SelectSubset<T, DigitalProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DigitalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DigitalProducts
     * const digitalProduct = await prisma.digitalProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DigitalProductUpdateManyArgs>(args: SelectSubset<T, DigitalProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DigitalProducts and returns the data updated in the database.
     * @param {DigitalProductUpdateManyAndReturnArgs} args - Arguments to update many DigitalProducts.
     * @example
     * // Update many DigitalProducts
     * const digitalProduct = await prisma.digitalProduct.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DigitalProducts and only return the `id`
     * const digitalProductWithIdOnly = await prisma.digitalProduct.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DigitalProductUpdateManyAndReturnArgs>(args: SelectSubset<T, DigitalProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DigitalProduct.
     * @param {DigitalProductUpsertArgs} args - Arguments to update or create a DigitalProduct.
     * @example
     * // Update or create a DigitalProduct
     * const digitalProduct = await prisma.digitalProduct.upsert({
     *   create: {
     *     // ... data to create a DigitalProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DigitalProduct we want to update
     *   }
     * })
     */
    upsert<T extends DigitalProductUpsertArgs>(args: SelectSubset<T, DigitalProductUpsertArgs<ExtArgs>>): Prisma__DigitalProductClient<$Result.GetResult<Prisma.$DigitalProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DigitalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalProductCountArgs} args - Arguments to filter DigitalProducts to count.
     * @example
     * // Count the number of DigitalProducts
     * const count = await prisma.digitalProduct.count({
     *   where: {
     *     // ... the filter for the DigitalProducts we want to count
     *   }
     * })
    **/
    count<T extends DigitalProductCountArgs>(
      args?: Subset<T, DigitalProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DigitalProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DigitalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DigitalProductAggregateArgs>(args: Subset<T, DigitalProductAggregateArgs>): Prisma.PrismaPromise<GetDigitalProductAggregateType<T>>

    /**
     * Group by DigitalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DigitalProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DigitalProductGroupByArgs['orderBy'] }
        : { orderBy?: DigitalProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DigitalProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDigitalProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DigitalProduct model
   */
  readonly fields: DigitalProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DigitalProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DigitalProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DigitalProduct model
   */
  interface DigitalProductFieldRefs {
    readonly id: FieldRef<"DigitalProduct", 'BigInt'>
    readonly orderNumber: FieldRef<"DigitalProduct", 'String'>
    readonly productName: FieldRef<"DigitalProduct", 'String'>
    readonly customerName: FieldRef<"DigitalProduct", 'String'>
    readonly poName: FieldRef<"DigitalProduct", 'String'>
    readonly witel: FieldRef<"DigitalProduct", 'String'>
    readonly branch: FieldRef<"DigitalProduct", 'String'>
    readonly revenue: FieldRef<"DigitalProduct", 'Decimal'>
    readonly amount: FieldRef<"DigitalProduct", 'Decimal'>
    readonly status: FieldRef<"DigitalProduct", 'String'>
    readonly milestone: FieldRef<"DigitalProduct", 'String'>
    readonly segment: FieldRef<"DigitalProduct", 'String'>
    readonly category: FieldRef<"DigitalProduct", 'String'>
    readonly subType: FieldRef<"DigitalProduct", 'String'>
    readonly orderDate: FieldRef<"DigitalProduct", 'DateTime'>
    readonly batchId: FieldRef<"DigitalProduct", 'String'>
    readonly createdAt: FieldRef<"DigitalProduct", 'DateTime'>
    readonly updatedAt: FieldRef<"DigitalProduct", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DigitalProduct findUnique
   */
  export type DigitalProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * Filter, which DigitalProduct to fetch.
     */
    where: DigitalProductWhereUniqueInput
  }

  /**
   * DigitalProduct findUniqueOrThrow
   */
  export type DigitalProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * Filter, which DigitalProduct to fetch.
     */
    where: DigitalProductWhereUniqueInput
  }

  /**
   * DigitalProduct findFirst
   */
  export type DigitalProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * Filter, which DigitalProduct to fetch.
     */
    where?: DigitalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalProducts to fetch.
     */
    orderBy?: DigitalProductOrderByWithRelationInput | DigitalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DigitalProducts.
     */
    cursor?: DigitalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DigitalProducts.
     */
    distinct?: DigitalProductScalarFieldEnum | DigitalProductScalarFieldEnum[]
  }

  /**
   * DigitalProduct findFirstOrThrow
   */
  export type DigitalProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * Filter, which DigitalProduct to fetch.
     */
    where?: DigitalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalProducts to fetch.
     */
    orderBy?: DigitalProductOrderByWithRelationInput | DigitalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DigitalProducts.
     */
    cursor?: DigitalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DigitalProducts.
     */
    distinct?: DigitalProductScalarFieldEnum | DigitalProductScalarFieldEnum[]
  }

  /**
   * DigitalProduct findMany
   */
  export type DigitalProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * Filter, which DigitalProducts to fetch.
     */
    where?: DigitalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalProducts to fetch.
     */
    orderBy?: DigitalProductOrderByWithRelationInput | DigitalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DigitalProducts.
     */
    cursor?: DigitalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalProducts.
     */
    skip?: number
    distinct?: DigitalProductScalarFieldEnum | DigitalProductScalarFieldEnum[]
  }

  /**
   * DigitalProduct create
   */
  export type DigitalProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * The data needed to create a DigitalProduct.
     */
    data: XOR<DigitalProductCreateInput, DigitalProductUncheckedCreateInput>
  }

  /**
   * DigitalProduct createMany
   */
  export type DigitalProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DigitalProducts.
     */
    data: DigitalProductCreateManyInput | DigitalProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DigitalProduct createManyAndReturn
   */
  export type DigitalProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * The data used to create many DigitalProducts.
     */
    data: DigitalProductCreateManyInput | DigitalProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DigitalProduct update
   */
  export type DigitalProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * The data needed to update a DigitalProduct.
     */
    data: XOR<DigitalProductUpdateInput, DigitalProductUncheckedUpdateInput>
    /**
     * Choose, which DigitalProduct to update.
     */
    where: DigitalProductWhereUniqueInput
  }

  /**
   * DigitalProduct updateMany
   */
  export type DigitalProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DigitalProducts.
     */
    data: XOR<DigitalProductUpdateManyMutationInput, DigitalProductUncheckedUpdateManyInput>
    /**
     * Filter which DigitalProducts to update
     */
    where?: DigitalProductWhereInput
    /**
     * Limit how many DigitalProducts to update.
     */
    limit?: number
  }

  /**
   * DigitalProduct updateManyAndReturn
   */
  export type DigitalProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * The data used to update DigitalProducts.
     */
    data: XOR<DigitalProductUpdateManyMutationInput, DigitalProductUncheckedUpdateManyInput>
    /**
     * Filter which DigitalProducts to update
     */
    where?: DigitalProductWhereInput
    /**
     * Limit how many DigitalProducts to update.
     */
    limit?: number
  }

  /**
   * DigitalProduct upsert
   */
  export type DigitalProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * The filter to search for the DigitalProduct to update in case it exists.
     */
    where: DigitalProductWhereUniqueInput
    /**
     * In case the DigitalProduct found by the `where` argument doesn't exist, create a new DigitalProduct with this data.
     */
    create: XOR<DigitalProductCreateInput, DigitalProductUncheckedCreateInput>
    /**
     * In case the DigitalProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DigitalProductUpdateInput, DigitalProductUncheckedUpdateInput>
  }

  /**
   * DigitalProduct delete
   */
  export type DigitalProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
    /**
     * Filter which DigitalProduct to delete.
     */
    where: DigitalProductWhereUniqueInput
  }

  /**
   * DigitalProduct deleteMany
   */
  export type DigitalProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DigitalProducts to delete
     */
    where?: DigitalProductWhereInput
    /**
     * Limit how many DigitalProducts to delete.
     */
    limit?: number
  }

  /**
   * DigitalProduct without action
   */
  export type DigitalProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalProduct
     */
    select?: DigitalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalProduct
     */
    omit?: DigitalProductOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: bigint | null
  }

  export type UserMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    currentRoleAs: string | null
    emailVerifiedAt: Date | null
    rememberToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    currentRoleAs: string | null
    emailVerifiedAt: Date | null
    rememberToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    currentRoleAs: number
    emailVerifiedAt: number
    rememberToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    currentRoleAs?: true
    emailVerifiedAt?: true
    rememberToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    currentRoleAs?: true
    emailVerifiedAt?: true
    rememberToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    currentRoleAs?: true
    emailVerifiedAt?: true
    rememberToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: bigint
    name: string
    email: string
    password: string
    role: string
    currentRoleAs: string | null
    emailVerifiedAt: Date | null
    rememberToken: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    currentRoleAs?: boolean
    emailVerifiedAt?: boolean
    rememberToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customTargets?: boolean | User$customTargetsArgs<ExtArgs>
    userTableConfigurations?: boolean | User$userTableConfigurationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    currentRoleAs?: boolean
    emailVerifiedAt?: boolean
    rememberToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    currentRoleAs?: boolean
    emailVerifiedAt?: boolean
    rememberToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    currentRoleAs?: boolean
    emailVerifiedAt?: boolean
    rememberToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "currentRoleAs" | "emailVerifiedAt" | "rememberToken" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customTargets?: boolean | User$customTargetsArgs<ExtArgs>
    userTableConfigurations?: boolean | User$userTableConfigurationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      customTargets: Prisma.$CustomTargetPayload<ExtArgs>[]
      userTableConfigurations: Prisma.$UserTableConfigurationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      email: string
      password: string
      role: string
      currentRoleAs: string | null
      emailVerifiedAt: Date | null
      rememberToken: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customTargets<T extends User$customTargetsArgs<ExtArgs> = {}>(args?: Subset<T, User$customTargetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userTableConfigurations<T extends User$userTableConfigurationsArgs<ExtArgs> = {}>(args?: Subset<T, User$userTableConfigurationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'BigInt'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly currentRoleAs: FieldRef<"User", 'String'>
    readonly emailVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly rememberToken: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.customTargets
   */
  export type User$customTargetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    where?: CustomTargetWhereInput
    orderBy?: CustomTargetOrderByWithRelationInput | CustomTargetOrderByWithRelationInput[]
    cursor?: CustomTargetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomTargetScalarFieldEnum | CustomTargetScalarFieldEnum[]
  }

  /**
   * User.userTableConfigurations
   */
  export type User$userTableConfigurationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    where?: UserTableConfigurationWhereInput
    orderBy?: UserTableConfigurationOrderByWithRelationInput | UserTableConfigurationOrderByWithRelationInput[]
    cursor?: UserTableConfigurationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserTableConfigurationScalarFieldEnum | UserTableConfigurationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AccountOfficer
   */

  export type AggregateAccountOfficer = {
    _count: AccountOfficerCountAggregateOutputType | null
    _avg: AccountOfficerAvgAggregateOutputType | null
    _sum: AccountOfficerSumAggregateOutputType | null
    _min: AccountOfficerMinAggregateOutputType | null
    _max: AccountOfficerMaxAggregateOutputType | null
  }

  export type AccountOfficerAvgAggregateOutputType = {
    id: number | null
  }

  export type AccountOfficerSumAggregateOutputType = {
    id: bigint | null
  }

  export type AccountOfficerMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    displayWitel: string | null
    filterWitelLama: string | null
    specialFilterColumn: string | null
    specialFilterValue: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountOfficerMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    displayWitel: string | null
    filterWitelLama: string | null
    specialFilterColumn: string | null
    specialFilterValue: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountOfficerCountAggregateOutputType = {
    id: number
    name: number
    displayWitel: number
    filterWitelLama: number
    specialFilterColumn: number
    specialFilterValue: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountOfficerAvgAggregateInputType = {
    id?: true
  }

  export type AccountOfficerSumAggregateInputType = {
    id?: true
  }

  export type AccountOfficerMinAggregateInputType = {
    id?: true
    name?: true
    displayWitel?: true
    filterWitelLama?: true
    specialFilterColumn?: true
    specialFilterValue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountOfficerMaxAggregateInputType = {
    id?: true
    name?: true
    displayWitel?: true
    filterWitelLama?: true
    specialFilterColumn?: true
    specialFilterValue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountOfficerCountAggregateInputType = {
    id?: true
    name?: true
    displayWitel?: true
    filterWitelLama?: true
    specialFilterColumn?: true
    specialFilterValue?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountOfficerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountOfficer to aggregate.
     */
    where?: AccountOfficerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountOfficers to fetch.
     */
    orderBy?: AccountOfficerOrderByWithRelationInput | AccountOfficerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountOfficerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountOfficers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountOfficers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccountOfficers
    **/
    _count?: true | AccountOfficerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountOfficerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountOfficerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountOfficerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountOfficerMaxAggregateInputType
  }

  export type GetAccountOfficerAggregateType<T extends AccountOfficerAggregateArgs> = {
        [P in keyof T & keyof AggregateAccountOfficer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountOfficer[P]>
      : GetScalarType<T[P], AggregateAccountOfficer[P]>
  }




  export type AccountOfficerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountOfficerWhereInput
    orderBy?: AccountOfficerOrderByWithAggregationInput | AccountOfficerOrderByWithAggregationInput[]
    by: AccountOfficerScalarFieldEnum[] | AccountOfficerScalarFieldEnum
    having?: AccountOfficerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountOfficerCountAggregateInputType | true
    _avg?: AccountOfficerAvgAggregateInputType
    _sum?: AccountOfficerSumAggregateInputType
    _min?: AccountOfficerMinAggregateInputType
    _max?: AccountOfficerMaxAggregateInputType
  }

  export type AccountOfficerGroupByOutputType = {
    id: bigint
    name: string
    displayWitel: string
    filterWitelLama: string
    specialFilterColumn: string | null
    specialFilterValue: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountOfficerCountAggregateOutputType | null
    _avg: AccountOfficerAvgAggregateOutputType | null
    _sum: AccountOfficerSumAggregateOutputType | null
    _min: AccountOfficerMinAggregateOutputType | null
    _max: AccountOfficerMaxAggregateOutputType | null
  }

  type GetAccountOfficerGroupByPayload<T extends AccountOfficerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountOfficerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountOfficerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountOfficerGroupByOutputType[P]>
            : GetScalarType<T[P], AccountOfficerGroupByOutputType[P]>
        }
      >
    >


  export type AccountOfficerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayWitel?: boolean
    filterWitelLama?: boolean
    specialFilterColumn?: boolean
    specialFilterValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["accountOfficer"]>

  export type AccountOfficerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayWitel?: boolean
    filterWitelLama?: boolean
    specialFilterColumn?: boolean
    specialFilterValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["accountOfficer"]>

  export type AccountOfficerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayWitel?: boolean
    filterWitelLama?: boolean
    specialFilterColumn?: boolean
    specialFilterValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["accountOfficer"]>

  export type AccountOfficerSelectScalar = {
    id?: boolean
    name?: boolean
    displayWitel?: boolean
    filterWitelLama?: boolean
    specialFilterColumn?: boolean
    specialFilterValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOfficerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "displayWitel" | "filterWitelLama" | "specialFilterColumn" | "specialFilterValue" | "createdAt" | "updatedAt", ExtArgs["result"]["accountOfficer"]>

  export type $AccountOfficerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccountOfficer"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      displayWitel: string
      filterWitelLama: string
      specialFilterColumn: string | null
      specialFilterValue: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["accountOfficer"]>
    composites: {}
  }

  type AccountOfficerGetPayload<S extends boolean | null | undefined | AccountOfficerDefaultArgs> = $Result.GetResult<Prisma.$AccountOfficerPayload, S>

  type AccountOfficerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountOfficerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountOfficerCountAggregateInputType | true
    }

  export interface AccountOfficerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccountOfficer'], meta: { name: 'AccountOfficer' } }
    /**
     * Find zero or one AccountOfficer that matches the filter.
     * @param {AccountOfficerFindUniqueArgs} args - Arguments to find a AccountOfficer
     * @example
     * // Get one AccountOfficer
     * const accountOfficer = await prisma.accountOfficer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountOfficerFindUniqueArgs>(args: SelectSubset<T, AccountOfficerFindUniqueArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccountOfficer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountOfficerFindUniqueOrThrowArgs} args - Arguments to find a AccountOfficer
     * @example
     * // Get one AccountOfficer
     * const accountOfficer = await prisma.accountOfficer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountOfficerFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountOfficerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccountOfficer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountOfficerFindFirstArgs} args - Arguments to find a AccountOfficer
     * @example
     * // Get one AccountOfficer
     * const accountOfficer = await prisma.accountOfficer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountOfficerFindFirstArgs>(args?: SelectSubset<T, AccountOfficerFindFirstArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccountOfficer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountOfficerFindFirstOrThrowArgs} args - Arguments to find a AccountOfficer
     * @example
     * // Get one AccountOfficer
     * const accountOfficer = await prisma.accountOfficer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountOfficerFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountOfficerFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccountOfficers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountOfficerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountOfficers
     * const accountOfficers = await prisma.accountOfficer.findMany()
     * 
     * // Get first 10 AccountOfficers
     * const accountOfficers = await prisma.accountOfficer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountOfficerWithIdOnly = await prisma.accountOfficer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountOfficerFindManyArgs>(args?: SelectSubset<T, AccountOfficerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AccountOfficer.
     * @param {AccountOfficerCreateArgs} args - Arguments to create a AccountOfficer.
     * @example
     * // Create one AccountOfficer
     * const AccountOfficer = await prisma.accountOfficer.create({
     *   data: {
     *     // ... data to create a AccountOfficer
     *   }
     * })
     * 
     */
    create<T extends AccountOfficerCreateArgs>(args: SelectSubset<T, AccountOfficerCreateArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccountOfficers.
     * @param {AccountOfficerCreateManyArgs} args - Arguments to create many AccountOfficers.
     * @example
     * // Create many AccountOfficers
     * const accountOfficer = await prisma.accountOfficer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountOfficerCreateManyArgs>(args?: SelectSubset<T, AccountOfficerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccountOfficers and returns the data saved in the database.
     * @param {AccountOfficerCreateManyAndReturnArgs} args - Arguments to create many AccountOfficers.
     * @example
     * // Create many AccountOfficers
     * const accountOfficer = await prisma.accountOfficer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccountOfficers and only return the `id`
     * const accountOfficerWithIdOnly = await prisma.accountOfficer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountOfficerCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountOfficerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AccountOfficer.
     * @param {AccountOfficerDeleteArgs} args - Arguments to delete one AccountOfficer.
     * @example
     * // Delete one AccountOfficer
     * const AccountOfficer = await prisma.accountOfficer.delete({
     *   where: {
     *     // ... filter to delete one AccountOfficer
     *   }
     * })
     * 
     */
    delete<T extends AccountOfficerDeleteArgs>(args: SelectSubset<T, AccountOfficerDeleteArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccountOfficer.
     * @param {AccountOfficerUpdateArgs} args - Arguments to update one AccountOfficer.
     * @example
     * // Update one AccountOfficer
     * const accountOfficer = await prisma.accountOfficer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountOfficerUpdateArgs>(args: SelectSubset<T, AccountOfficerUpdateArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccountOfficers.
     * @param {AccountOfficerDeleteManyArgs} args - Arguments to filter AccountOfficers to delete.
     * @example
     * // Delete a few AccountOfficers
     * const { count } = await prisma.accountOfficer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountOfficerDeleteManyArgs>(args?: SelectSubset<T, AccountOfficerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccountOfficers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountOfficerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountOfficers
     * const accountOfficer = await prisma.accountOfficer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountOfficerUpdateManyArgs>(args: SelectSubset<T, AccountOfficerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccountOfficers and returns the data updated in the database.
     * @param {AccountOfficerUpdateManyAndReturnArgs} args - Arguments to update many AccountOfficers.
     * @example
     * // Update many AccountOfficers
     * const accountOfficer = await prisma.accountOfficer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AccountOfficers and only return the `id`
     * const accountOfficerWithIdOnly = await prisma.accountOfficer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountOfficerUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountOfficerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AccountOfficer.
     * @param {AccountOfficerUpsertArgs} args - Arguments to update or create a AccountOfficer.
     * @example
     * // Update or create a AccountOfficer
     * const accountOfficer = await prisma.accountOfficer.upsert({
     *   create: {
     *     // ... data to create a AccountOfficer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountOfficer we want to update
     *   }
     * })
     */
    upsert<T extends AccountOfficerUpsertArgs>(args: SelectSubset<T, AccountOfficerUpsertArgs<ExtArgs>>): Prisma__AccountOfficerClient<$Result.GetResult<Prisma.$AccountOfficerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AccountOfficers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountOfficerCountArgs} args - Arguments to filter AccountOfficers to count.
     * @example
     * // Count the number of AccountOfficers
     * const count = await prisma.accountOfficer.count({
     *   where: {
     *     // ... the filter for the AccountOfficers we want to count
     *   }
     * })
    **/
    count<T extends AccountOfficerCountArgs>(
      args?: Subset<T, AccountOfficerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountOfficerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccountOfficer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountOfficerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountOfficerAggregateArgs>(args: Subset<T, AccountOfficerAggregateArgs>): Prisma.PrismaPromise<GetAccountOfficerAggregateType<T>>

    /**
     * Group by AccountOfficer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountOfficerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountOfficerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountOfficerGroupByArgs['orderBy'] }
        : { orderBy?: AccountOfficerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountOfficerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountOfficerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccountOfficer model
   */
  readonly fields: AccountOfficerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountOfficer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountOfficerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccountOfficer model
   */
  interface AccountOfficerFieldRefs {
    readonly id: FieldRef<"AccountOfficer", 'BigInt'>
    readonly name: FieldRef<"AccountOfficer", 'String'>
    readonly displayWitel: FieldRef<"AccountOfficer", 'String'>
    readonly filterWitelLama: FieldRef<"AccountOfficer", 'String'>
    readonly specialFilterColumn: FieldRef<"AccountOfficer", 'String'>
    readonly specialFilterValue: FieldRef<"AccountOfficer", 'String'>
    readonly createdAt: FieldRef<"AccountOfficer", 'DateTime'>
    readonly updatedAt: FieldRef<"AccountOfficer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AccountOfficer findUnique
   */
  export type AccountOfficerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * Filter, which AccountOfficer to fetch.
     */
    where: AccountOfficerWhereUniqueInput
  }

  /**
   * AccountOfficer findUniqueOrThrow
   */
  export type AccountOfficerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * Filter, which AccountOfficer to fetch.
     */
    where: AccountOfficerWhereUniqueInput
  }

  /**
   * AccountOfficer findFirst
   */
  export type AccountOfficerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * Filter, which AccountOfficer to fetch.
     */
    where?: AccountOfficerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountOfficers to fetch.
     */
    orderBy?: AccountOfficerOrderByWithRelationInput | AccountOfficerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountOfficers.
     */
    cursor?: AccountOfficerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountOfficers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountOfficers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountOfficers.
     */
    distinct?: AccountOfficerScalarFieldEnum | AccountOfficerScalarFieldEnum[]
  }

  /**
   * AccountOfficer findFirstOrThrow
   */
  export type AccountOfficerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * Filter, which AccountOfficer to fetch.
     */
    where?: AccountOfficerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountOfficers to fetch.
     */
    orderBy?: AccountOfficerOrderByWithRelationInput | AccountOfficerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountOfficers.
     */
    cursor?: AccountOfficerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountOfficers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountOfficers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountOfficers.
     */
    distinct?: AccountOfficerScalarFieldEnum | AccountOfficerScalarFieldEnum[]
  }

  /**
   * AccountOfficer findMany
   */
  export type AccountOfficerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * Filter, which AccountOfficers to fetch.
     */
    where?: AccountOfficerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountOfficers to fetch.
     */
    orderBy?: AccountOfficerOrderByWithRelationInput | AccountOfficerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccountOfficers.
     */
    cursor?: AccountOfficerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountOfficers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountOfficers.
     */
    skip?: number
    distinct?: AccountOfficerScalarFieldEnum | AccountOfficerScalarFieldEnum[]
  }

  /**
   * AccountOfficer create
   */
  export type AccountOfficerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * The data needed to create a AccountOfficer.
     */
    data: XOR<AccountOfficerCreateInput, AccountOfficerUncheckedCreateInput>
  }

  /**
   * AccountOfficer createMany
   */
  export type AccountOfficerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccountOfficers.
     */
    data: AccountOfficerCreateManyInput | AccountOfficerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccountOfficer createManyAndReturn
   */
  export type AccountOfficerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * The data used to create many AccountOfficers.
     */
    data: AccountOfficerCreateManyInput | AccountOfficerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccountOfficer update
   */
  export type AccountOfficerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * The data needed to update a AccountOfficer.
     */
    data: XOR<AccountOfficerUpdateInput, AccountOfficerUncheckedUpdateInput>
    /**
     * Choose, which AccountOfficer to update.
     */
    where: AccountOfficerWhereUniqueInput
  }

  /**
   * AccountOfficer updateMany
   */
  export type AccountOfficerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccountOfficers.
     */
    data: XOR<AccountOfficerUpdateManyMutationInput, AccountOfficerUncheckedUpdateManyInput>
    /**
     * Filter which AccountOfficers to update
     */
    where?: AccountOfficerWhereInput
    /**
     * Limit how many AccountOfficers to update.
     */
    limit?: number
  }

  /**
   * AccountOfficer updateManyAndReturn
   */
  export type AccountOfficerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * The data used to update AccountOfficers.
     */
    data: XOR<AccountOfficerUpdateManyMutationInput, AccountOfficerUncheckedUpdateManyInput>
    /**
     * Filter which AccountOfficers to update
     */
    where?: AccountOfficerWhereInput
    /**
     * Limit how many AccountOfficers to update.
     */
    limit?: number
  }

  /**
   * AccountOfficer upsert
   */
  export type AccountOfficerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * The filter to search for the AccountOfficer to update in case it exists.
     */
    where: AccountOfficerWhereUniqueInput
    /**
     * In case the AccountOfficer found by the `where` argument doesn't exist, create a new AccountOfficer with this data.
     */
    create: XOR<AccountOfficerCreateInput, AccountOfficerUncheckedCreateInput>
    /**
     * In case the AccountOfficer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountOfficerUpdateInput, AccountOfficerUncheckedUpdateInput>
  }

  /**
   * AccountOfficer delete
   */
  export type AccountOfficerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
    /**
     * Filter which AccountOfficer to delete.
     */
    where: AccountOfficerWhereUniqueInput
  }

  /**
   * AccountOfficer deleteMany
   */
  export type AccountOfficerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountOfficers to delete
     */
    where?: AccountOfficerWhereInput
    /**
     * Limit how many AccountOfficers to delete.
     */
    limit?: number
  }

  /**
   * AccountOfficer without action
   */
  export type AccountOfficerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountOfficer
     */
    select?: AccountOfficerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountOfficer
     */
    omit?: AccountOfficerOmit<ExtArgs> | null
  }


  /**
   * Model SosData
   */

  export type AggregateSosData = {
    _count: SosDataCountAggregateOutputType | null
    _avg: SosDataAvgAggregateOutputType | null
    _sum: SosDataSumAggregateOutputType | null
    _min: SosDataMinAggregateOutputType | null
    _max: SosDataMaxAggregateOutputType | null
  }

  export type SosDataAvgAggregateOutputType = {
    id: number | null
    biayaPasang: Decimal | null
    hrgBulanan: Decimal | null
    revenue: Decimal | null
    lamaKontrakHari: number | null
    umurOrder: number | null
  }

  export type SosDataSumAggregateOutputType = {
    id: bigint | null
    biayaPasang: Decimal | null
    hrgBulanan: Decimal | null
    revenue: Decimal | null
    lamaKontrakHari: number | null
    umurOrder: number | null
  }

  export type SosDataMinAggregateOutputType = {
    id: bigint | null
    nipnas: string | null
    standardName: string | null
    orderId: string | null
    orderSubtype: string | null
    orderDescription: string | null
    segmen: string | null
    subSegmen: string | null
    custCity: string | null
    custWitel: string | null
    servCity: string | null
    serviceWitel: string | null
    billWitel: string | null
    liProductName: string | null
    liBilldate: Date | null
    liMilestone: string | null
    kategori: string | null
    liStatus: string | null
    liStatusDate: Date | null
    isTermin: string | null
    biayaPasang: Decimal | null
    hrgBulanan: Decimal | null
    revenue: Decimal | null
    orderCreatedDate: Date | null
    agreeType: string | null
    agreeStartDate: Date | null
    agreeEndDate: Date | null
    lamaKontrakHari: number | null
    amortisasi: string | null
    actionCd: string | null
    kategoriUmur: string | null
    umurOrder: number | null
    billCity: string | null
    poName: string | null
    tipeOrder: string | null
    segmenBaru: string | null
    scalling1: string | null
    scalling2: string | null
    tipeGrup: string | null
    witelBaru: string | null
    kategoriBaru: string | null
    createdAt: Date | null
    updatedAt: Date | null
    batchId: string | null
  }

  export type SosDataMaxAggregateOutputType = {
    id: bigint | null
    nipnas: string | null
    standardName: string | null
    orderId: string | null
    orderSubtype: string | null
    orderDescription: string | null
    segmen: string | null
    subSegmen: string | null
    custCity: string | null
    custWitel: string | null
    servCity: string | null
    serviceWitel: string | null
    billWitel: string | null
    liProductName: string | null
    liBilldate: Date | null
    liMilestone: string | null
    kategori: string | null
    liStatus: string | null
    liStatusDate: Date | null
    isTermin: string | null
    biayaPasang: Decimal | null
    hrgBulanan: Decimal | null
    revenue: Decimal | null
    orderCreatedDate: Date | null
    agreeType: string | null
    agreeStartDate: Date | null
    agreeEndDate: Date | null
    lamaKontrakHari: number | null
    amortisasi: string | null
    actionCd: string | null
    kategoriUmur: string | null
    umurOrder: number | null
    billCity: string | null
    poName: string | null
    tipeOrder: string | null
    segmenBaru: string | null
    scalling1: string | null
    scalling2: string | null
    tipeGrup: string | null
    witelBaru: string | null
    kategoriBaru: string | null
    createdAt: Date | null
    updatedAt: Date | null
    batchId: string | null
  }

  export type SosDataCountAggregateOutputType = {
    id: number
    nipnas: number
    standardName: number
    orderId: number
    orderSubtype: number
    orderDescription: number
    segmen: number
    subSegmen: number
    custCity: number
    custWitel: number
    servCity: number
    serviceWitel: number
    billWitel: number
    liProductName: number
    liBilldate: number
    liMilestone: number
    kategori: number
    liStatus: number
    liStatusDate: number
    isTermin: number
    biayaPasang: number
    hrgBulanan: number
    revenue: number
    orderCreatedDate: number
    agreeType: number
    agreeStartDate: number
    agreeEndDate: number
    lamaKontrakHari: number
    amortisasi: number
    actionCd: number
    kategoriUmur: number
    umurOrder: number
    billCity: number
    poName: number
    tipeOrder: number
    segmenBaru: number
    scalling1: number
    scalling2: number
    tipeGrup: number
    witelBaru: number
    kategoriBaru: number
    createdAt: number
    updatedAt: number
    batchId: number
    _all: number
  }


  export type SosDataAvgAggregateInputType = {
    id?: true
    biayaPasang?: true
    hrgBulanan?: true
    revenue?: true
    lamaKontrakHari?: true
    umurOrder?: true
  }

  export type SosDataSumAggregateInputType = {
    id?: true
    biayaPasang?: true
    hrgBulanan?: true
    revenue?: true
    lamaKontrakHari?: true
    umurOrder?: true
  }

  export type SosDataMinAggregateInputType = {
    id?: true
    nipnas?: true
    standardName?: true
    orderId?: true
    orderSubtype?: true
    orderDescription?: true
    segmen?: true
    subSegmen?: true
    custCity?: true
    custWitel?: true
    servCity?: true
    serviceWitel?: true
    billWitel?: true
    liProductName?: true
    liBilldate?: true
    liMilestone?: true
    kategori?: true
    liStatus?: true
    liStatusDate?: true
    isTermin?: true
    biayaPasang?: true
    hrgBulanan?: true
    revenue?: true
    orderCreatedDate?: true
    agreeType?: true
    agreeStartDate?: true
    agreeEndDate?: true
    lamaKontrakHari?: true
    amortisasi?: true
    actionCd?: true
    kategoriUmur?: true
    umurOrder?: true
    billCity?: true
    poName?: true
    tipeOrder?: true
    segmenBaru?: true
    scalling1?: true
    scalling2?: true
    tipeGrup?: true
    witelBaru?: true
    kategoriBaru?: true
    createdAt?: true
    updatedAt?: true
    batchId?: true
  }

  export type SosDataMaxAggregateInputType = {
    id?: true
    nipnas?: true
    standardName?: true
    orderId?: true
    orderSubtype?: true
    orderDescription?: true
    segmen?: true
    subSegmen?: true
    custCity?: true
    custWitel?: true
    servCity?: true
    serviceWitel?: true
    billWitel?: true
    liProductName?: true
    liBilldate?: true
    liMilestone?: true
    kategori?: true
    liStatus?: true
    liStatusDate?: true
    isTermin?: true
    biayaPasang?: true
    hrgBulanan?: true
    revenue?: true
    orderCreatedDate?: true
    agreeType?: true
    agreeStartDate?: true
    agreeEndDate?: true
    lamaKontrakHari?: true
    amortisasi?: true
    actionCd?: true
    kategoriUmur?: true
    umurOrder?: true
    billCity?: true
    poName?: true
    tipeOrder?: true
    segmenBaru?: true
    scalling1?: true
    scalling2?: true
    tipeGrup?: true
    witelBaru?: true
    kategoriBaru?: true
    createdAt?: true
    updatedAt?: true
    batchId?: true
  }

  export type SosDataCountAggregateInputType = {
    id?: true
    nipnas?: true
    standardName?: true
    orderId?: true
    orderSubtype?: true
    orderDescription?: true
    segmen?: true
    subSegmen?: true
    custCity?: true
    custWitel?: true
    servCity?: true
    serviceWitel?: true
    billWitel?: true
    liProductName?: true
    liBilldate?: true
    liMilestone?: true
    kategori?: true
    liStatus?: true
    liStatusDate?: true
    isTermin?: true
    biayaPasang?: true
    hrgBulanan?: true
    revenue?: true
    orderCreatedDate?: true
    agreeType?: true
    agreeStartDate?: true
    agreeEndDate?: true
    lamaKontrakHari?: true
    amortisasi?: true
    actionCd?: true
    kategoriUmur?: true
    umurOrder?: true
    billCity?: true
    poName?: true
    tipeOrder?: true
    segmenBaru?: true
    scalling1?: true
    scalling2?: true
    tipeGrup?: true
    witelBaru?: true
    kategoriBaru?: true
    createdAt?: true
    updatedAt?: true
    batchId?: true
    _all?: true
  }

  export type SosDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SosData to aggregate.
     */
    where?: SosDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SosData to fetch.
     */
    orderBy?: SosDataOrderByWithRelationInput | SosDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SosDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SosData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SosData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SosData
    **/
    _count?: true | SosDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SosDataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SosDataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SosDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SosDataMaxAggregateInputType
  }

  export type GetSosDataAggregateType<T extends SosDataAggregateArgs> = {
        [P in keyof T & keyof AggregateSosData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSosData[P]>
      : GetScalarType<T[P], AggregateSosData[P]>
  }




  export type SosDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SosDataWhereInput
    orderBy?: SosDataOrderByWithAggregationInput | SosDataOrderByWithAggregationInput[]
    by: SosDataScalarFieldEnum[] | SosDataScalarFieldEnum
    having?: SosDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SosDataCountAggregateInputType | true
    _avg?: SosDataAvgAggregateInputType
    _sum?: SosDataSumAggregateInputType
    _min?: SosDataMinAggregateInputType
    _max?: SosDataMaxAggregateInputType
  }

  export type SosDataGroupByOutputType = {
    id: bigint
    nipnas: string | null
    standardName: string | null
    orderId: string
    orderSubtype: string | null
    orderDescription: string | null
    segmen: string | null
    subSegmen: string | null
    custCity: string | null
    custWitel: string | null
    servCity: string | null
    serviceWitel: string | null
    billWitel: string | null
    liProductName: string | null
    liBilldate: Date | null
    liMilestone: string | null
    kategori: string | null
    liStatus: string | null
    liStatusDate: Date | null
    isTermin: string | null
    biayaPasang: Decimal
    hrgBulanan: Decimal
    revenue: Decimal
    orderCreatedDate: Date | null
    agreeType: string | null
    agreeStartDate: Date | null
    agreeEndDate: Date | null
    lamaKontrakHari: number
    amortisasi: string | null
    actionCd: string | null
    kategoriUmur: string | null
    umurOrder: number
    billCity: string | null
    poName: string | null
    tipeOrder: string | null
    segmenBaru: string | null
    scalling1: string | null
    scalling2: string | null
    tipeGrup: string | null
    witelBaru: string | null
    kategoriBaru: string | null
    createdAt: Date
    updatedAt: Date
    batchId: string | null
    _count: SosDataCountAggregateOutputType | null
    _avg: SosDataAvgAggregateOutputType | null
    _sum: SosDataSumAggregateOutputType | null
    _min: SosDataMinAggregateOutputType | null
    _max: SosDataMaxAggregateOutputType | null
  }

  type GetSosDataGroupByPayload<T extends SosDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SosDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SosDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SosDataGroupByOutputType[P]>
            : GetScalarType<T[P], SosDataGroupByOutputType[P]>
        }
      >
    >


  export type SosDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nipnas?: boolean
    standardName?: boolean
    orderId?: boolean
    orderSubtype?: boolean
    orderDescription?: boolean
    segmen?: boolean
    subSegmen?: boolean
    custCity?: boolean
    custWitel?: boolean
    servCity?: boolean
    serviceWitel?: boolean
    billWitel?: boolean
    liProductName?: boolean
    liBilldate?: boolean
    liMilestone?: boolean
    kategori?: boolean
    liStatus?: boolean
    liStatusDate?: boolean
    isTermin?: boolean
    biayaPasang?: boolean
    hrgBulanan?: boolean
    revenue?: boolean
    orderCreatedDate?: boolean
    agreeType?: boolean
    agreeStartDate?: boolean
    agreeEndDate?: boolean
    lamaKontrakHari?: boolean
    amortisasi?: boolean
    actionCd?: boolean
    kategoriUmur?: boolean
    umurOrder?: boolean
    billCity?: boolean
    poName?: boolean
    tipeOrder?: boolean
    segmenBaru?: boolean
    scalling1?: boolean
    scalling2?: boolean
    tipeGrup?: boolean
    witelBaru?: boolean
    kategoriBaru?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }, ExtArgs["result"]["sosData"]>

  export type SosDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nipnas?: boolean
    standardName?: boolean
    orderId?: boolean
    orderSubtype?: boolean
    orderDescription?: boolean
    segmen?: boolean
    subSegmen?: boolean
    custCity?: boolean
    custWitel?: boolean
    servCity?: boolean
    serviceWitel?: boolean
    billWitel?: boolean
    liProductName?: boolean
    liBilldate?: boolean
    liMilestone?: boolean
    kategori?: boolean
    liStatus?: boolean
    liStatusDate?: boolean
    isTermin?: boolean
    biayaPasang?: boolean
    hrgBulanan?: boolean
    revenue?: boolean
    orderCreatedDate?: boolean
    agreeType?: boolean
    agreeStartDate?: boolean
    agreeEndDate?: boolean
    lamaKontrakHari?: boolean
    amortisasi?: boolean
    actionCd?: boolean
    kategoriUmur?: boolean
    umurOrder?: boolean
    billCity?: boolean
    poName?: boolean
    tipeOrder?: boolean
    segmenBaru?: boolean
    scalling1?: boolean
    scalling2?: boolean
    tipeGrup?: boolean
    witelBaru?: boolean
    kategoriBaru?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }, ExtArgs["result"]["sosData"]>

  export type SosDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nipnas?: boolean
    standardName?: boolean
    orderId?: boolean
    orderSubtype?: boolean
    orderDescription?: boolean
    segmen?: boolean
    subSegmen?: boolean
    custCity?: boolean
    custWitel?: boolean
    servCity?: boolean
    serviceWitel?: boolean
    billWitel?: boolean
    liProductName?: boolean
    liBilldate?: boolean
    liMilestone?: boolean
    kategori?: boolean
    liStatus?: boolean
    liStatusDate?: boolean
    isTermin?: boolean
    biayaPasang?: boolean
    hrgBulanan?: boolean
    revenue?: boolean
    orderCreatedDate?: boolean
    agreeType?: boolean
    agreeStartDate?: boolean
    agreeEndDate?: boolean
    lamaKontrakHari?: boolean
    amortisasi?: boolean
    actionCd?: boolean
    kategoriUmur?: boolean
    umurOrder?: boolean
    billCity?: boolean
    poName?: boolean
    tipeOrder?: boolean
    segmenBaru?: boolean
    scalling1?: boolean
    scalling2?: boolean
    tipeGrup?: boolean
    witelBaru?: boolean
    kategoriBaru?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }, ExtArgs["result"]["sosData"]>

  export type SosDataSelectScalar = {
    id?: boolean
    nipnas?: boolean
    standardName?: boolean
    orderId?: boolean
    orderSubtype?: boolean
    orderDescription?: boolean
    segmen?: boolean
    subSegmen?: boolean
    custCity?: boolean
    custWitel?: boolean
    servCity?: boolean
    serviceWitel?: boolean
    billWitel?: boolean
    liProductName?: boolean
    liBilldate?: boolean
    liMilestone?: boolean
    kategori?: boolean
    liStatus?: boolean
    liStatusDate?: boolean
    isTermin?: boolean
    biayaPasang?: boolean
    hrgBulanan?: boolean
    revenue?: boolean
    orderCreatedDate?: boolean
    agreeType?: boolean
    agreeStartDate?: boolean
    agreeEndDate?: boolean
    lamaKontrakHari?: boolean
    amortisasi?: boolean
    actionCd?: boolean
    kategoriUmur?: boolean
    umurOrder?: boolean
    billCity?: boolean
    poName?: boolean
    tipeOrder?: boolean
    segmenBaru?: boolean
    scalling1?: boolean
    scalling2?: boolean
    tipeGrup?: boolean
    witelBaru?: boolean
    kategoriBaru?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }

  export type SosDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nipnas" | "standardName" | "orderId" | "orderSubtype" | "orderDescription" | "segmen" | "subSegmen" | "custCity" | "custWitel" | "servCity" | "serviceWitel" | "billWitel" | "liProductName" | "liBilldate" | "liMilestone" | "kategori" | "liStatus" | "liStatusDate" | "isTermin" | "biayaPasang" | "hrgBulanan" | "revenue" | "orderCreatedDate" | "agreeType" | "agreeStartDate" | "agreeEndDate" | "lamaKontrakHari" | "amortisasi" | "actionCd" | "kategoriUmur" | "umurOrder" | "billCity" | "poName" | "tipeOrder" | "segmenBaru" | "scalling1" | "scalling2" | "tipeGrup" | "witelBaru" | "kategoriBaru" | "createdAt" | "updatedAt" | "batchId", ExtArgs["result"]["sosData"]>

  export type $SosDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SosData"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      nipnas: string | null
      standardName: string | null
      orderId: string
      orderSubtype: string | null
      orderDescription: string | null
      segmen: string | null
      subSegmen: string | null
      custCity: string | null
      custWitel: string | null
      servCity: string | null
      serviceWitel: string | null
      billWitel: string | null
      liProductName: string | null
      liBilldate: Date | null
      liMilestone: string | null
      kategori: string | null
      liStatus: string | null
      liStatusDate: Date | null
      isTermin: string | null
      biayaPasang: Prisma.Decimal
      hrgBulanan: Prisma.Decimal
      revenue: Prisma.Decimal
      orderCreatedDate: Date | null
      agreeType: string | null
      agreeStartDate: Date | null
      agreeEndDate: Date | null
      lamaKontrakHari: number
      amortisasi: string | null
      actionCd: string | null
      kategoriUmur: string | null
      umurOrder: number
      billCity: string | null
      poName: string | null
      tipeOrder: string | null
      segmenBaru: string | null
      scalling1: string | null
      scalling2: string | null
      tipeGrup: string | null
      witelBaru: string | null
      kategoriBaru: string | null
      createdAt: Date
      updatedAt: Date
      batchId: string | null
    }, ExtArgs["result"]["sosData"]>
    composites: {}
  }

  type SosDataGetPayload<S extends boolean | null | undefined | SosDataDefaultArgs> = $Result.GetResult<Prisma.$SosDataPayload, S>

  type SosDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SosDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SosDataCountAggregateInputType | true
    }

  export interface SosDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SosData'], meta: { name: 'SosData' } }
    /**
     * Find zero or one SosData that matches the filter.
     * @param {SosDataFindUniqueArgs} args - Arguments to find a SosData
     * @example
     * // Get one SosData
     * const sosData = await prisma.sosData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SosDataFindUniqueArgs>(args: SelectSubset<T, SosDataFindUniqueArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SosData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SosDataFindUniqueOrThrowArgs} args - Arguments to find a SosData
     * @example
     * // Get one SosData
     * const sosData = await prisma.sosData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SosDataFindUniqueOrThrowArgs>(args: SelectSubset<T, SosDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SosData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SosDataFindFirstArgs} args - Arguments to find a SosData
     * @example
     * // Get one SosData
     * const sosData = await prisma.sosData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SosDataFindFirstArgs>(args?: SelectSubset<T, SosDataFindFirstArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SosData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SosDataFindFirstOrThrowArgs} args - Arguments to find a SosData
     * @example
     * // Get one SosData
     * const sosData = await prisma.sosData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SosDataFindFirstOrThrowArgs>(args?: SelectSubset<T, SosDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SosData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SosDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SosData
     * const sosData = await prisma.sosData.findMany()
     * 
     * // Get first 10 SosData
     * const sosData = await prisma.sosData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sosDataWithIdOnly = await prisma.sosData.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SosDataFindManyArgs>(args?: SelectSubset<T, SosDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SosData.
     * @param {SosDataCreateArgs} args - Arguments to create a SosData.
     * @example
     * // Create one SosData
     * const SosData = await prisma.sosData.create({
     *   data: {
     *     // ... data to create a SosData
     *   }
     * })
     * 
     */
    create<T extends SosDataCreateArgs>(args: SelectSubset<T, SosDataCreateArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SosData.
     * @param {SosDataCreateManyArgs} args - Arguments to create many SosData.
     * @example
     * // Create many SosData
     * const sosData = await prisma.sosData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SosDataCreateManyArgs>(args?: SelectSubset<T, SosDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SosData and returns the data saved in the database.
     * @param {SosDataCreateManyAndReturnArgs} args - Arguments to create many SosData.
     * @example
     * // Create many SosData
     * const sosData = await prisma.sosData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SosData and only return the `id`
     * const sosDataWithIdOnly = await prisma.sosData.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SosDataCreateManyAndReturnArgs>(args?: SelectSubset<T, SosDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SosData.
     * @param {SosDataDeleteArgs} args - Arguments to delete one SosData.
     * @example
     * // Delete one SosData
     * const SosData = await prisma.sosData.delete({
     *   where: {
     *     // ... filter to delete one SosData
     *   }
     * })
     * 
     */
    delete<T extends SosDataDeleteArgs>(args: SelectSubset<T, SosDataDeleteArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SosData.
     * @param {SosDataUpdateArgs} args - Arguments to update one SosData.
     * @example
     * // Update one SosData
     * const sosData = await prisma.sosData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SosDataUpdateArgs>(args: SelectSubset<T, SosDataUpdateArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SosData.
     * @param {SosDataDeleteManyArgs} args - Arguments to filter SosData to delete.
     * @example
     * // Delete a few SosData
     * const { count } = await prisma.sosData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SosDataDeleteManyArgs>(args?: SelectSubset<T, SosDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SosData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SosDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SosData
     * const sosData = await prisma.sosData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SosDataUpdateManyArgs>(args: SelectSubset<T, SosDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SosData and returns the data updated in the database.
     * @param {SosDataUpdateManyAndReturnArgs} args - Arguments to update many SosData.
     * @example
     * // Update many SosData
     * const sosData = await prisma.sosData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SosData and only return the `id`
     * const sosDataWithIdOnly = await prisma.sosData.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SosDataUpdateManyAndReturnArgs>(args: SelectSubset<T, SosDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SosData.
     * @param {SosDataUpsertArgs} args - Arguments to update or create a SosData.
     * @example
     * // Update or create a SosData
     * const sosData = await prisma.sosData.upsert({
     *   create: {
     *     // ... data to create a SosData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SosData we want to update
     *   }
     * })
     */
    upsert<T extends SosDataUpsertArgs>(args: SelectSubset<T, SosDataUpsertArgs<ExtArgs>>): Prisma__SosDataClient<$Result.GetResult<Prisma.$SosDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SosData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SosDataCountArgs} args - Arguments to filter SosData to count.
     * @example
     * // Count the number of SosData
     * const count = await prisma.sosData.count({
     *   where: {
     *     // ... the filter for the SosData we want to count
     *   }
     * })
    **/
    count<T extends SosDataCountArgs>(
      args?: Subset<T, SosDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SosDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SosData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SosDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SosDataAggregateArgs>(args: Subset<T, SosDataAggregateArgs>): Prisma.PrismaPromise<GetSosDataAggregateType<T>>

    /**
     * Group by SosData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SosDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SosDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SosDataGroupByArgs['orderBy'] }
        : { orderBy?: SosDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SosDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSosDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SosData model
   */
  readonly fields: SosDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SosData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SosDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SosData model
   */
  interface SosDataFieldRefs {
    readonly id: FieldRef<"SosData", 'BigInt'>
    readonly nipnas: FieldRef<"SosData", 'String'>
    readonly standardName: FieldRef<"SosData", 'String'>
    readonly orderId: FieldRef<"SosData", 'String'>
    readonly orderSubtype: FieldRef<"SosData", 'String'>
    readonly orderDescription: FieldRef<"SosData", 'String'>
    readonly segmen: FieldRef<"SosData", 'String'>
    readonly subSegmen: FieldRef<"SosData", 'String'>
    readonly custCity: FieldRef<"SosData", 'String'>
    readonly custWitel: FieldRef<"SosData", 'String'>
    readonly servCity: FieldRef<"SosData", 'String'>
    readonly serviceWitel: FieldRef<"SosData", 'String'>
    readonly billWitel: FieldRef<"SosData", 'String'>
    readonly liProductName: FieldRef<"SosData", 'String'>
    readonly liBilldate: FieldRef<"SosData", 'DateTime'>
    readonly liMilestone: FieldRef<"SosData", 'String'>
    readonly kategori: FieldRef<"SosData", 'String'>
    readonly liStatus: FieldRef<"SosData", 'String'>
    readonly liStatusDate: FieldRef<"SosData", 'DateTime'>
    readonly isTermin: FieldRef<"SosData", 'String'>
    readonly biayaPasang: FieldRef<"SosData", 'Decimal'>
    readonly hrgBulanan: FieldRef<"SosData", 'Decimal'>
    readonly revenue: FieldRef<"SosData", 'Decimal'>
    readonly orderCreatedDate: FieldRef<"SosData", 'DateTime'>
    readonly agreeType: FieldRef<"SosData", 'String'>
    readonly agreeStartDate: FieldRef<"SosData", 'DateTime'>
    readonly agreeEndDate: FieldRef<"SosData", 'DateTime'>
    readonly lamaKontrakHari: FieldRef<"SosData", 'Int'>
    readonly amortisasi: FieldRef<"SosData", 'String'>
    readonly actionCd: FieldRef<"SosData", 'String'>
    readonly kategoriUmur: FieldRef<"SosData", 'String'>
    readonly umurOrder: FieldRef<"SosData", 'Int'>
    readonly billCity: FieldRef<"SosData", 'String'>
    readonly poName: FieldRef<"SosData", 'String'>
    readonly tipeOrder: FieldRef<"SosData", 'String'>
    readonly segmenBaru: FieldRef<"SosData", 'String'>
    readonly scalling1: FieldRef<"SosData", 'String'>
    readonly scalling2: FieldRef<"SosData", 'String'>
    readonly tipeGrup: FieldRef<"SosData", 'String'>
    readonly witelBaru: FieldRef<"SosData", 'String'>
    readonly kategoriBaru: FieldRef<"SosData", 'String'>
    readonly createdAt: FieldRef<"SosData", 'DateTime'>
    readonly updatedAt: FieldRef<"SosData", 'DateTime'>
    readonly batchId: FieldRef<"SosData", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SosData findUnique
   */
  export type SosDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * Filter, which SosData to fetch.
     */
    where: SosDataWhereUniqueInput
  }

  /**
   * SosData findUniqueOrThrow
   */
  export type SosDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * Filter, which SosData to fetch.
     */
    where: SosDataWhereUniqueInput
  }

  /**
   * SosData findFirst
   */
  export type SosDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * Filter, which SosData to fetch.
     */
    where?: SosDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SosData to fetch.
     */
    orderBy?: SosDataOrderByWithRelationInput | SosDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SosData.
     */
    cursor?: SosDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SosData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SosData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SosData.
     */
    distinct?: SosDataScalarFieldEnum | SosDataScalarFieldEnum[]
  }

  /**
   * SosData findFirstOrThrow
   */
  export type SosDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * Filter, which SosData to fetch.
     */
    where?: SosDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SosData to fetch.
     */
    orderBy?: SosDataOrderByWithRelationInput | SosDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SosData.
     */
    cursor?: SosDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SosData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SosData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SosData.
     */
    distinct?: SosDataScalarFieldEnum | SosDataScalarFieldEnum[]
  }

  /**
   * SosData findMany
   */
  export type SosDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * Filter, which SosData to fetch.
     */
    where?: SosDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SosData to fetch.
     */
    orderBy?: SosDataOrderByWithRelationInput | SosDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SosData.
     */
    cursor?: SosDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SosData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SosData.
     */
    skip?: number
    distinct?: SosDataScalarFieldEnum | SosDataScalarFieldEnum[]
  }

  /**
   * SosData create
   */
  export type SosDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * The data needed to create a SosData.
     */
    data: XOR<SosDataCreateInput, SosDataUncheckedCreateInput>
  }

  /**
   * SosData createMany
   */
  export type SosDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SosData.
     */
    data: SosDataCreateManyInput | SosDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SosData createManyAndReturn
   */
  export type SosDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * The data used to create many SosData.
     */
    data: SosDataCreateManyInput | SosDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SosData update
   */
  export type SosDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * The data needed to update a SosData.
     */
    data: XOR<SosDataUpdateInput, SosDataUncheckedUpdateInput>
    /**
     * Choose, which SosData to update.
     */
    where: SosDataWhereUniqueInput
  }

  /**
   * SosData updateMany
   */
  export type SosDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SosData.
     */
    data: XOR<SosDataUpdateManyMutationInput, SosDataUncheckedUpdateManyInput>
    /**
     * Filter which SosData to update
     */
    where?: SosDataWhereInput
    /**
     * Limit how many SosData to update.
     */
    limit?: number
  }

  /**
   * SosData updateManyAndReturn
   */
  export type SosDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * The data used to update SosData.
     */
    data: XOR<SosDataUpdateManyMutationInput, SosDataUncheckedUpdateManyInput>
    /**
     * Filter which SosData to update
     */
    where?: SosDataWhereInput
    /**
     * Limit how many SosData to update.
     */
    limit?: number
  }

  /**
   * SosData upsert
   */
  export type SosDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * The filter to search for the SosData to update in case it exists.
     */
    where: SosDataWhereUniqueInput
    /**
     * In case the SosData found by the `where` argument doesn't exist, create a new SosData with this data.
     */
    create: XOR<SosDataCreateInput, SosDataUncheckedCreateInput>
    /**
     * In case the SosData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SosDataUpdateInput, SosDataUncheckedUpdateInput>
  }

  /**
   * SosData delete
   */
  export type SosDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
    /**
     * Filter which SosData to delete.
     */
    where: SosDataWhereUniqueInput
  }

  /**
   * SosData deleteMany
   */
  export type SosDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SosData to delete
     */
    where?: SosDataWhereInput
    /**
     * Limit how many SosData to delete.
     */
    limit?: number
  }

  /**
   * SosData without action
   */
  export type SosDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SosData
     */
    select?: SosDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SosData
     */
    omit?: SosDataOmit<ExtArgs> | null
  }


  /**
   * Model HsiData
   */

  export type AggregateHsiData = {
    _count: HsiDataCountAggregateOutputType | null
    _avg: HsiDataAvgAggregateOutputType | null
    _sum: HsiDataSumAggregateOutputType | null
    _min: HsiDataMinAggregateOutputType | null
    _max: HsiDataMaxAggregateOutputType | null
  }

  export type HsiDataAvgAggregateOutputType = {
    id: number | null
  }

  export type HsiDataSumAggregateOutputType = {
    id: bigint | null
  }

  export type HsiDataMinAggregateOutputType = {
    id: bigint | null
    nomor: string | null
    orderId: string | null
    regional: string | null
    witel: string | null
    regionalOld: string | null
    witelOld: string | null
    datel: string | null
    sto: string | null
    unit: string | null
    jenisPsb: string | null
    typeTrans: string | null
    typeLayanan: string | null
    statusResume: string | null
    provider: string | null
    orderDate: Date | null
    lastUpdatedDate: Date | null
    ncli: string | null
    pots: string | null
    speedy: string | null
    customerName: string | null
    locId: string | null
    wonum: string | null
    flagDeposit: string | null
    contactHp: string | null
    insAddress: string | null
    gpsLongitude: string | null
    gpsLatitude: string | null
    kcontact: string | null
    channel: string | null
    statusInet: string | null
    statusOnu: string | null
    upload: string | null
    download: string | null
    lastProgram: string | null
    statusVoice: string | null
    clid: string | null
    lastStart: string | null
    tindakLanjut: string | null
    isiComment: string | null
    userIdTl: string | null
    tglComment: Date | null
    tanggalManja: Date | null
    kelompokKendala: string | null
    kelompokStatus: string | null
    hero: string | null
    addon: string | null
    tglPs: Date | null
    statusMessage: string | null
    packageName: string | null
    groupPaket: string | null
    reasonCancel: string | null
    keteranganCancel: string | null
    tglManja: Date | null
    detailManja: string | null
    suberrorcode: string | null
    engineermemo: string | null
    tahun: string | null
    bulan: string | null
    tanggal: string | null
    ps1: string | null
    cek: string | null
    hasil: string | null
    telda: string | null
    dataProses: string | null
    noOrderRevoke: string | null
    datasPsRevoke: string | null
    untukPsPi: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HsiDataMaxAggregateOutputType = {
    id: bigint | null
    nomor: string | null
    orderId: string | null
    regional: string | null
    witel: string | null
    regionalOld: string | null
    witelOld: string | null
    datel: string | null
    sto: string | null
    unit: string | null
    jenisPsb: string | null
    typeTrans: string | null
    typeLayanan: string | null
    statusResume: string | null
    provider: string | null
    orderDate: Date | null
    lastUpdatedDate: Date | null
    ncli: string | null
    pots: string | null
    speedy: string | null
    customerName: string | null
    locId: string | null
    wonum: string | null
    flagDeposit: string | null
    contactHp: string | null
    insAddress: string | null
    gpsLongitude: string | null
    gpsLatitude: string | null
    kcontact: string | null
    channel: string | null
    statusInet: string | null
    statusOnu: string | null
    upload: string | null
    download: string | null
    lastProgram: string | null
    statusVoice: string | null
    clid: string | null
    lastStart: string | null
    tindakLanjut: string | null
    isiComment: string | null
    userIdTl: string | null
    tglComment: Date | null
    tanggalManja: Date | null
    kelompokKendala: string | null
    kelompokStatus: string | null
    hero: string | null
    addon: string | null
    tglPs: Date | null
    statusMessage: string | null
    packageName: string | null
    groupPaket: string | null
    reasonCancel: string | null
    keteranganCancel: string | null
    tglManja: Date | null
    detailManja: string | null
    suberrorcode: string | null
    engineermemo: string | null
    tahun: string | null
    bulan: string | null
    tanggal: string | null
    ps1: string | null
    cek: string | null
    hasil: string | null
    telda: string | null
    dataProses: string | null
    noOrderRevoke: string | null
    datasPsRevoke: string | null
    untukPsPi: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HsiDataCountAggregateOutputType = {
    id: number
    nomor: number
    orderId: number
    regional: number
    witel: number
    regionalOld: number
    witelOld: number
    datel: number
    sto: number
    unit: number
    jenisPsb: number
    typeTrans: number
    typeLayanan: number
    statusResume: number
    provider: number
    orderDate: number
    lastUpdatedDate: number
    ncli: number
    pots: number
    speedy: number
    customerName: number
    locId: number
    wonum: number
    flagDeposit: number
    contactHp: number
    insAddress: number
    gpsLongitude: number
    gpsLatitude: number
    kcontact: number
    channel: number
    statusInet: number
    statusOnu: number
    upload: number
    download: number
    lastProgram: number
    statusVoice: number
    clid: number
    lastStart: number
    tindakLanjut: number
    isiComment: number
    userIdTl: number
    tglComment: number
    tanggalManja: number
    kelompokKendala: number
    kelompokStatus: number
    hero: number
    addon: number
    tglPs: number
    statusMessage: number
    packageName: number
    groupPaket: number
    reasonCancel: number
    keteranganCancel: number
    tglManja: number
    detailManja: number
    suberrorcode: number
    engineermemo: number
    tahun: number
    bulan: number
    tanggal: number
    ps1: number
    cek: number
    hasil: number
    telda: number
    dataProses: number
    noOrderRevoke: number
    datasPsRevoke: number
    untukPsPi: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HsiDataAvgAggregateInputType = {
    id?: true
  }

  export type HsiDataSumAggregateInputType = {
    id?: true
  }

  export type HsiDataMinAggregateInputType = {
    id?: true
    nomor?: true
    orderId?: true
    regional?: true
    witel?: true
    regionalOld?: true
    witelOld?: true
    datel?: true
    sto?: true
    unit?: true
    jenisPsb?: true
    typeTrans?: true
    typeLayanan?: true
    statusResume?: true
    provider?: true
    orderDate?: true
    lastUpdatedDate?: true
    ncli?: true
    pots?: true
    speedy?: true
    customerName?: true
    locId?: true
    wonum?: true
    flagDeposit?: true
    contactHp?: true
    insAddress?: true
    gpsLongitude?: true
    gpsLatitude?: true
    kcontact?: true
    channel?: true
    statusInet?: true
    statusOnu?: true
    upload?: true
    download?: true
    lastProgram?: true
    statusVoice?: true
    clid?: true
    lastStart?: true
    tindakLanjut?: true
    isiComment?: true
    userIdTl?: true
    tglComment?: true
    tanggalManja?: true
    kelompokKendala?: true
    kelompokStatus?: true
    hero?: true
    addon?: true
    tglPs?: true
    statusMessage?: true
    packageName?: true
    groupPaket?: true
    reasonCancel?: true
    keteranganCancel?: true
    tglManja?: true
    detailManja?: true
    suberrorcode?: true
    engineermemo?: true
    tahun?: true
    bulan?: true
    tanggal?: true
    ps1?: true
    cek?: true
    hasil?: true
    telda?: true
    dataProses?: true
    noOrderRevoke?: true
    datasPsRevoke?: true
    untukPsPi?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HsiDataMaxAggregateInputType = {
    id?: true
    nomor?: true
    orderId?: true
    regional?: true
    witel?: true
    regionalOld?: true
    witelOld?: true
    datel?: true
    sto?: true
    unit?: true
    jenisPsb?: true
    typeTrans?: true
    typeLayanan?: true
    statusResume?: true
    provider?: true
    orderDate?: true
    lastUpdatedDate?: true
    ncli?: true
    pots?: true
    speedy?: true
    customerName?: true
    locId?: true
    wonum?: true
    flagDeposit?: true
    contactHp?: true
    insAddress?: true
    gpsLongitude?: true
    gpsLatitude?: true
    kcontact?: true
    channel?: true
    statusInet?: true
    statusOnu?: true
    upload?: true
    download?: true
    lastProgram?: true
    statusVoice?: true
    clid?: true
    lastStart?: true
    tindakLanjut?: true
    isiComment?: true
    userIdTl?: true
    tglComment?: true
    tanggalManja?: true
    kelompokKendala?: true
    kelompokStatus?: true
    hero?: true
    addon?: true
    tglPs?: true
    statusMessage?: true
    packageName?: true
    groupPaket?: true
    reasonCancel?: true
    keteranganCancel?: true
    tglManja?: true
    detailManja?: true
    suberrorcode?: true
    engineermemo?: true
    tahun?: true
    bulan?: true
    tanggal?: true
    ps1?: true
    cek?: true
    hasil?: true
    telda?: true
    dataProses?: true
    noOrderRevoke?: true
    datasPsRevoke?: true
    untukPsPi?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HsiDataCountAggregateInputType = {
    id?: true
    nomor?: true
    orderId?: true
    regional?: true
    witel?: true
    regionalOld?: true
    witelOld?: true
    datel?: true
    sto?: true
    unit?: true
    jenisPsb?: true
    typeTrans?: true
    typeLayanan?: true
    statusResume?: true
    provider?: true
    orderDate?: true
    lastUpdatedDate?: true
    ncli?: true
    pots?: true
    speedy?: true
    customerName?: true
    locId?: true
    wonum?: true
    flagDeposit?: true
    contactHp?: true
    insAddress?: true
    gpsLongitude?: true
    gpsLatitude?: true
    kcontact?: true
    channel?: true
    statusInet?: true
    statusOnu?: true
    upload?: true
    download?: true
    lastProgram?: true
    statusVoice?: true
    clid?: true
    lastStart?: true
    tindakLanjut?: true
    isiComment?: true
    userIdTl?: true
    tglComment?: true
    tanggalManja?: true
    kelompokKendala?: true
    kelompokStatus?: true
    hero?: true
    addon?: true
    tglPs?: true
    statusMessage?: true
    packageName?: true
    groupPaket?: true
    reasonCancel?: true
    keteranganCancel?: true
    tglManja?: true
    detailManja?: true
    suberrorcode?: true
    engineermemo?: true
    tahun?: true
    bulan?: true
    tanggal?: true
    ps1?: true
    cek?: true
    hasil?: true
    telda?: true
    dataProses?: true
    noOrderRevoke?: true
    datasPsRevoke?: true
    untukPsPi?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HsiDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HsiData to aggregate.
     */
    where?: HsiDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HsiData to fetch.
     */
    orderBy?: HsiDataOrderByWithRelationInput | HsiDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HsiDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HsiData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HsiData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HsiData
    **/
    _count?: true | HsiDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HsiDataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HsiDataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HsiDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HsiDataMaxAggregateInputType
  }

  export type GetHsiDataAggregateType<T extends HsiDataAggregateArgs> = {
        [P in keyof T & keyof AggregateHsiData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHsiData[P]>
      : GetScalarType<T[P], AggregateHsiData[P]>
  }




  export type HsiDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HsiDataWhereInput
    orderBy?: HsiDataOrderByWithAggregationInput | HsiDataOrderByWithAggregationInput[]
    by: HsiDataScalarFieldEnum[] | HsiDataScalarFieldEnum
    having?: HsiDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HsiDataCountAggregateInputType | true
    _avg?: HsiDataAvgAggregateInputType
    _sum?: HsiDataSumAggregateInputType
    _min?: HsiDataMinAggregateInputType
    _max?: HsiDataMaxAggregateInputType
  }

  export type HsiDataGroupByOutputType = {
    id: bigint
    nomor: string | null
    orderId: string | null
    regional: string | null
    witel: string | null
    regionalOld: string | null
    witelOld: string | null
    datel: string | null
    sto: string | null
    unit: string | null
    jenisPsb: string | null
    typeTrans: string | null
    typeLayanan: string | null
    statusResume: string | null
    provider: string | null
    orderDate: Date | null
    lastUpdatedDate: Date | null
    ncli: string | null
    pots: string | null
    speedy: string | null
    customerName: string | null
    locId: string | null
    wonum: string | null
    flagDeposit: string | null
    contactHp: string | null
    insAddress: string | null
    gpsLongitude: string | null
    gpsLatitude: string | null
    kcontact: string | null
    channel: string | null
    statusInet: string | null
    statusOnu: string | null
    upload: string | null
    download: string | null
    lastProgram: string | null
    statusVoice: string | null
    clid: string | null
    lastStart: string | null
    tindakLanjut: string | null
    isiComment: string | null
    userIdTl: string | null
    tglComment: Date | null
    tanggalManja: Date | null
    kelompokKendala: string | null
    kelompokStatus: string | null
    hero: string | null
    addon: string | null
    tglPs: Date | null
    statusMessage: string | null
    packageName: string | null
    groupPaket: string | null
    reasonCancel: string | null
    keteranganCancel: string | null
    tglManja: Date | null
    detailManja: string | null
    suberrorcode: string | null
    engineermemo: string | null
    tahun: string | null
    bulan: string | null
    tanggal: string | null
    ps1: string | null
    cek: string | null
    hasil: string | null
    telda: string | null
    dataProses: string | null
    noOrderRevoke: string | null
    datasPsRevoke: string | null
    untukPsPi: string | null
    createdAt: Date
    updatedAt: Date
    _count: HsiDataCountAggregateOutputType | null
    _avg: HsiDataAvgAggregateOutputType | null
    _sum: HsiDataSumAggregateOutputType | null
    _min: HsiDataMinAggregateOutputType | null
    _max: HsiDataMaxAggregateOutputType | null
  }

  type GetHsiDataGroupByPayload<T extends HsiDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HsiDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HsiDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HsiDataGroupByOutputType[P]>
            : GetScalarType<T[P], HsiDataGroupByOutputType[P]>
        }
      >
    >


  export type HsiDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor?: boolean
    orderId?: boolean
    regional?: boolean
    witel?: boolean
    regionalOld?: boolean
    witelOld?: boolean
    datel?: boolean
    sto?: boolean
    unit?: boolean
    jenisPsb?: boolean
    typeTrans?: boolean
    typeLayanan?: boolean
    statusResume?: boolean
    provider?: boolean
    orderDate?: boolean
    lastUpdatedDate?: boolean
    ncli?: boolean
    pots?: boolean
    speedy?: boolean
    customerName?: boolean
    locId?: boolean
    wonum?: boolean
    flagDeposit?: boolean
    contactHp?: boolean
    insAddress?: boolean
    gpsLongitude?: boolean
    gpsLatitude?: boolean
    kcontact?: boolean
    channel?: boolean
    statusInet?: boolean
    statusOnu?: boolean
    upload?: boolean
    download?: boolean
    lastProgram?: boolean
    statusVoice?: boolean
    clid?: boolean
    lastStart?: boolean
    tindakLanjut?: boolean
    isiComment?: boolean
    userIdTl?: boolean
    tglComment?: boolean
    tanggalManja?: boolean
    kelompokKendala?: boolean
    kelompokStatus?: boolean
    hero?: boolean
    addon?: boolean
    tglPs?: boolean
    statusMessage?: boolean
    packageName?: boolean
    groupPaket?: boolean
    reasonCancel?: boolean
    keteranganCancel?: boolean
    tglManja?: boolean
    detailManja?: boolean
    suberrorcode?: boolean
    engineermemo?: boolean
    tahun?: boolean
    bulan?: boolean
    tanggal?: boolean
    ps1?: boolean
    cek?: boolean
    hasil?: boolean
    telda?: boolean
    dataProses?: boolean
    noOrderRevoke?: boolean
    datasPsRevoke?: boolean
    untukPsPi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hsiData"]>

  export type HsiDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor?: boolean
    orderId?: boolean
    regional?: boolean
    witel?: boolean
    regionalOld?: boolean
    witelOld?: boolean
    datel?: boolean
    sto?: boolean
    unit?: boolean
    jenisPsb?: boolean
    typeTrans?: boolean
    typeLayanan?: boolean
    statusResume?: boolean
    provider?: boolean
    orderDate?: boolean
    lastUpdatedDate?: boolean
    ncli?: boolean
    pots?: boolean
    speedy?: boolean
    customerName?: boolean
    locId?: boolean
    wonum?: boolean
    flagDeposit?: boolean
    contactHp?: boolean
    insAddress?: boolean
    gpsLongitude?: boolean
    gpsLatitude?: boolean
    kcontact?: boolean
    channel?: boolean
    statusInet?: boolean
    statusOnu?: boolean
    upload?: boolean
    download?: boolean
    lastProgram?: boolean
    statusVoice?: boolean
    clid?: boolean
    lastStart?: boolean
    tindakLanjut?: boolean
    isiComment?: boolean
    userIdTl?: boolean
    tglComment?: boolean
    tanggalManja?: boolean
    kelompokKendala?: boolean
    kelompokStatus?: boolean
    hero?: boolean
    addon?: boolean
    tglPs?: boolean
    statusMessage?: boolean
    packageName?: boolean
    groupPaket?: boolean
    reasonCancel?: boolean
    keteranganCancel?: boolean
    tglManja?: boolean
    detailManja?: boolean
    suberrorcode?: boolean
    engineermemo?: boolean
    tahun?: boolean
    bulan?: boolean
    tanggal?: boolean
    ps1?: boolean
    cek?: boolean
    hasil?: boolean
    telda?: boolean
    dataProses?: boolean
    noOrderRevoke?: boolean
    datasPsRevoke?: boolean
    untukPsPi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hsiData"]>

  export type HsiDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor?: boolean
    orderId?: boolean
    regional?: boolean
    witel?: boolean
    regionalOld?: boolean
    witelOld?: boolean
    datel?: boolean
    sto?: boolean
    unit?: boolean
    jenisPsb?: boolean
    typeTrans?: boolean
    typeLayanan?: boolean
    statusResume?: boolean
    provider?: boolean
    orderDate?: boolean
    lastUpdatedDate?: boolean
    ncli?: boolean
    pots?: boolean
    speedy?: boolean
    customerName?: boolean
    locId?: boolean
    wonum?: boolean
    flagDeposit?: boolean
    contactHp?: boolean
    insAddress?: boolean
    gpsLongitude?: boolean
    gpsLatitude?: boolean
    kcontact?: boolean
    channel?: boolean
    statusInet?: boolean
    statusOnu?: boolean
    upload?: boolean
    download?: boolean
    lastProgram?: boolean
    statusVoice?: boolean
    clid?: boolean
    lastStart?: boolean
    tindakLanjut?: boolean
    isiComment?: boolean
    userIdTl?: boolean
    tglComment?: boolean
    tanggalManja?: boolean
    kelompokKendala?: boolean
    kelompokStatus?: boolean
    hero?: boolean
    addon?: boolean
    tglPs?: boolean
    statusMessage?: boolean
    packageName?: boolean
    groupPaket?: boolean
    reasonCancel?: boolean
    keteranganCancel?: boolean
    tglManja?: boolean
    detailManja?: boolean
    suberrorcode?: boolean
    engineermemo?: boolean
    tahun?: boolean
    bulan?: boolean
    tanggal?: boolean
    ps1?: boolean
    cek?: boolean
    hasil?: boolean
    telda?: boolean
    dataProses?: boolean
    noOrderRevoke?: boolean
    datasPsRevoke?: boolean
    untukPsPi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hsiData"]>

  export type HsiDataSelectScalar = {
    id?: boolean
    nomor?: boolean
    orderId?: boolean
    regional?: boolean
    witel?: boolean
    regionalOld?: boolean
    witelOld?: boolean
    datel?: boolean
    sto?: boolean
    unit?: boolean
    jenisPsb?: boolean
    typeTrans?: boolean
    typeLayanan?: boolean
    statusResume?: boolean
    provider?: boolean
    orderDate?: boolean
    lastUpdatedDate?: boolean
    ncli?: boolean
    pots?: boolean
    speedy?: boolean
    customerName?: boolean
    locId?: boolean
    wonum?: boolean
    flagDeposit?: boolean
    contactHp?: boolean
    insAddress?: boolean
    gpsLongitude?: boolean
    gpsLatitude?: boolean
    kcontact?: boolean
    channel?: boolean
    statusInet?: boolean
    statusOnu?: boolean
    upload?: boolean
    download?: boolean
    lastProgram?: boolean
    statusVoice?: boolean
    clid?: boolean
    lastStart?: boolean
    tindakLanjut?: boolean
    isiComment?: boolean
    userIdTl?: boolean
    tglComment?: boolean
    tanggalManja?: boolean
    kelompokKendala?: boolean
    kelompokStatus?: boolean
    hero?: boolean
    addon?: boolean
    tglPs?: boolean
    statusMessage?: boolean
    packageName?: boolean
    groupPaket?: boolean
    reasonCancel?: boolean
    keteranganCancel?: boolean
    tglManja?: boolean
    detailManja?: boolean
    suberrorcode?: boolean
    engineermemo?: boolean
    tahun?: boolean
    bulan?: boolean
    tanggal?: boolean
    ps1?: boolean
    cek?: boolean
    hasil?: boolean
    telda?: boolean
    dataProses?: boolean
    noOrderRevoke?: boolean
    datasPsRevoke?: boolean
    untukPsPi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HsiDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nomor" | "orderId" | "regional" | "witel" | "regionalOld" | "witelOld" | "datel" | "sto" | "unit" | "jenisPsb" | "typeTrans" | "typeLayanan" | "statusResume" | "provider" | "orderDate" | "lastUpdatedDate" | "ncli" | "pots" | "speedy" | "customerName" | "locId" | "wonum" | "flagDeposit" | "contactHp" | "insAddress" | "gpsLongitude" | "gpsLatitude" | "kcontact" | "channel" | "statusInet" | "statusOnu" | "upload" | "download" | "lastProgram" | "statusVoice" | "clid" | "lastStart" | "tindakLanjut" | "isiComment" | "userIdTl" | "tglComment" | "tanggalManja" | "kelompokKendala" | "kelompokStatus" | "hero" | "addon" | "tglPs" | "statusMessage" | "packageName" | "groupPaket" | "reasonCancel" | "keteranganCancel" | "tglManja" | "detailManja" | "suberrorcode" | "engineermemo" | "tahun" | "bulan" | "tanggal" | "ps1" | "cek" | "hasil" | "telda" | "dataProses" | "noOrderRevoke" | "datasPsRevoke" | "untukPsPi" | "createdAt" | "updatedAt", ExtArgs["result"]["hsiData"]>

  export type $HsiDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HsiData"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      nomor: string | null
      orderId: string | null
      regional: string | null
      witel: string | null
      regionalOld: string | null
      witelOld: string | null
      datel: string | null
      sto: string | null
      unit: string | null
      jenisPsb: string | null
      typeTrans: string | null
      typeLayanan: string | null
      statusResume: string | null
      provider: string | null
      orderDate: Date | null
      lastUpdatedDate: Date | null
      ncli: string | null
      pots: string | null
      speedy: string | null
      customerName: string | null
      locId: string | null
      wonum: string | null
      flagDeposit: string | null
      contactHp: string | null
      insAddress: string | null
      gpsLongitude: string | null
      gpsLatitude: string | null
      kcontact: string | null
      channel: string | null
      statusInet: string | null
      statusOnu: string | null
      upload: string | null
      download: string | null
      lastProgram: string | null
      statusVoice: string | null
      clid: string | null
      lastStart: string | null
      tindakLanjut: string | null
      isiComment: string | null
      userIdTl: string | null
      tglComment: Date | null
      tanggalManja: Date | null
      kelompokKendala: string | null
      kelompokStatus: string | null
      hero: string | null
      addon: string | null
      tglPs: Date | null
      statusMessage: string | null
      packageName: string | null
      groupPaket: string | null
      reasonCancel: string | null
      keteranganCancel: string | null
      tglManja: Date | null
      detailManja: string | null
      suberrorcode: string | null
      engineermemo: string | null
      tahun: string | null
      bulan: string | null
      tanggal: string | null
      ps1: string | null
      cek: string | null
      hasil: string | null
      telda: string | null
      dataProses: string | null
      noOrderRevoke: string | null
      datasPsRevoke: string | null
      untukPsPi: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hsiData"]>
    composites: {}
  }

  type HsiDataGetPayload<S extends boolean | null | undefined | HsiDataDefaultArgs> = $Result.GetResult<Prisma.$HsiDataPayload, S>

  type HsiDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HsiDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HsiDataCountAggregateInputType | true
    }

  export interface HsiDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HsiData'], meta: { name: 'HsiData' } }
    /**
     * Find zero or one HsiData that matches the filter.
     * @param {HsiDataFindUniqueArgs} args - Arguments to find a HsiData
     * @example
     * // Get one HsiData
     * const hsiData = await prisma.hsiData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HsiDataFindUniqueArgs>(args: SelectSubset<T, HsiDataFindUniqueArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HsiData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HsiDataFindUniqueOrThrowArgs} args - Arguments to find a HsiData
     * @example
     * // Get one HsiData
     * const hsiData = await prisma.hsiData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HsiDataFindUniqueOrThrowArgs>(args: SelectSubset<T, HsiDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HsiData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HsiDataFindFirstArgs} args - Arguments to find a HsiData
     * @example
     * // Get one HsiData
     * const hsiData = await prisma.hsiData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HsiDataFindFirstArgs>(args?: SelectSubset<T, HsiDataFindFirstArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HsiData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HsiDataFindFirstOrThrowArgs} args - Arguments to find a HsiData
     * @example
     * // Get one HsiData
     * const hsiData = await prisma.hsiData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HsiDataFindFirstOrThrowArgs>(args?: SelectSubset<T, HsiDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HsiData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HsiDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HsiData
     * const hsiData = await prisma.hsiData.findMany()
     * 
     * // Get first 10 HsiData
     * const hsiData = await prisma.hsiData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hsiDataWithIdOnly = await prisma.hsiData.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HsiDataFindManyArgs>(args?: SelectSubset<T, HsiDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HsiData.
     * @param {HsiDataCreateArgs} args - Arguments to create a HsiData.
     * @example
     * // Create one HsiData
     * const HsiData = await prisma.hsiData.create({
     *   data: {
     *     // ... data to create a HsiData
     *   }
     * })
     * 
     */
    create<T extends HsiDataCreateArgs>(args: SelectSubset<T, HsiDataCreateArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HsiData.
     * @param {HsiDataCreateManyArgs} args - Arguments to create many HsiData.
     * @example
     * // Create many HsiData
     * const hsiData = await prisma.hsiData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HsiDataCreateManyArgs>(args?: SelectSubset<T, HsiDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HsiData and returns the data saved in the database.
     * @param {HsiDataCreateManyAndReturnArgs} args - Arguments to create many HsiData.
     * @example
     * // Create many HsiData
     * const hsiData = await prisma.hsiData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HsiData and only return the `id`
     * const hsiDataWithIdOnly = await prisma.hsiData.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HsiDataCreateManyAndReturnArgs>(args?: SelectSubset<T, HsiDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HsiData.
     * @param {HsiDataDeleteArgs} args - Arguments to delete one HsiData.
     * @example
     * // Delete one HsiData
     * const HsiData = await prisma.hsiData.delete({
     *   where: {
     *     // ... filter to delete one HsiData
     *   }
     * })
     * 
     */
    delete<T extends HsiDataDeleteArgs>(args: SelectSubset<T, HsiDataDeleteArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HsiData.
     * @param {HsiDataUpdateArgs} args - Arguments to update one HsiData.
     * @example
     * // Update one HsiData
     * const hsiData = await prisma.hsiData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HsiDataUpdateArgs>(args: SelectSubset<T, HsiDataUpdateArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HsiData.
     * @param {HsiDataDeleteManyArgs} args - Arguments to filter HsiData to delete.
     * @example
     * // Delete a few HsiData
     * const { count } = await prisma.hsiData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HsiDataDeleteManyArgs>(args?: SelectSubset<T, HsiDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HsiData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HsiDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HsiData
     * const hsiData = await prisma.hsiData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HsiDataUpdateManyArgs>(args: SelectSubset<T, HsiDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HsiData and returns the data updated in the database.
     * @param {HsiDataUpdateManyAndReturnArgs} args - Arguments to update many HsiData.
     * @example
     * // Update many HsiData
     * const hsiData = await prisma.hsiData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HsiData and only return the `id`
     * const hsiDataWithIdOnly = await prisma.hsiData.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HsiDataUpdateManyAndReturnArgs>(args: SelectSubset<T, HsiDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HsiData.
     * @param {HsiDataUpsertArgs} args - Arguments to update or create a HsiData.
     * @example
     * // Update or create a HsiData
     * const hsiData = await prisma.hsiData.upsert({
     *   create: {
     *     // ... data to create a HsiData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HsiData we want to update
     *   }
     * })
     */
    upsert<T extends HsiDataUpsertArgs>(args: SelectSubset<T, HsiDataUpsertArgs<ExtArgs>>): Prisma__HsiDataClient<$Result.GetResult<Prisma.$HsiDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HsiData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HsiDataCountArgs} args - Arguments to filter HsiData to count.
     * @example
     * // Count the number of HsiData
     * const count = await prisma.hsiData.count({
     *   where: {
     *     // ... the filter for the HsiData we want to count
     *   }
     * })
    **/
    count<T extends HsiDataCountArgs>(
      args?: Subset<T, HsiDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HsiDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HsiData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HsiDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HsiDataAggregateArgs>(args: Subset<T, HsiDataAggregateArgs>): Prisma.PrismaPromise<GetHsiDataAggregateType<T>>

    /**
     * Group by HsiData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HsiDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HsiDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HsiDataGroupByArgs['orderBy'] }
        : { orderBy?: HsiDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HsiDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHsiDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HsiData model
   */
  readonly fields: HsiDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HsiData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HsiDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HsiData model
   */
  interface HsiDataFieldRefs {
    readonly id: FieldRef<"HsiData", 'BigInt'>
    readonly nomor: FieldRef<"HsiData", 'String'>
    readonly orderId: FieldRef<"HsiData", 'String'>
    readonly regional: FieldRef<"HsiData", 'String'>
    readonly witel: FieldRef<"HsiData", 'String'>
    readonly regionalOld: FieldRef<"HsiData", 'String'>
    readonly witelOld: FieldRef<"HsiData", 'String'>
    readonly datel: FieldRef<"HsiData", 'String'>
    readonly sto: FieldRef<"HsiData", 'String'>
    readonly unit: FieldRef<"HsiData", 'String'>
    readonly jenisPsb: FieldRef<"HsiData", 'String'>
    readonly typeTrans: FieldRef<"HsiData", 'String'>
    readonly typeLayanan: FieldRef<"HsiData", 'String'>
    readonly statusResume: FieldRef<"HsiData", 'String'>
    readonly provider: FieldRef<"HsiData", 'String'>
    readonly orderDate: FieldRef<"HsiData", 'DateTime'>
    readonly lastUpdatedDate: FieldRef<"HsiData", 'DateTime'>
    readonly ncli: FieldRef<"HsiData", 'String'>
    readonly pots: FieldRef<"HsiData", 'String'>
    readonly speedy: FieldRef<"HsiData", 'String'>
    readonly customerName: FieldRef<"HsiData", 'String'>
    readonly locId: FieldRef<"HsiData", 'String'>
    readonly wonum: FieldRef<"HsiData", 'String'>
    readonly flagDeposit: FieldRef<"HsiData", 'String'>
    readonly contactHp: FieldRef<"HsiData", 'String'>
    readonly insAddress: FieldRef<"HsiData", 'String'>
    readonly gpsLongitude: FieldRef<"HsiData", 'String'>
    readonly gpsLatitude: FieldRef<"HsiData", 'String'>
    readonly kcontact: FieldRef<"HsiData", 'String'>
    readonly channel: FieldRef<"HsiData", 'String'>
    readonly statusInet: FieldRef<"HsiData", 'String'>
    readonly statusOnu: FieldRef<"HsiData", 'String'>
    readonly upload: FieldRef<"HsiData", 'String'>
    readonly download: FieldRef<"HsiData", 'String'>
    readonly lastProgram: FieldRef<"HsiData", 'String'>
    readonly statusVoice: FieldRef<"HsiData", 'String'>
    readonly clid: FieldRef<"HsiData", 'String'>
    readonly lastStart: FieldRef<"HsiData", 'String'>
    readonly tindakLanjut: FieldRef<"HsiData", 'String'>
    readonly isiComment: FieldRef<"HsiData", 'String'>
    readonly userIdTl: FieldRef<"HsiData", 'String'>
    readonly tglComment: FieldRef<"HsiData", 'DateTime'>
    readonly tanggalManja: FieldRef<"HsiData", 'DateTime'>
    readonly kelompokKendala: FieldRef<"HsiData", 'String'>
    readonly kelompokStatus: FieldRef<"HsiData", 'String'>
    readonly hero: FieldRef<"HsiData", 'String'>
    readonly addon: FieldRef<"HsiData", 'String'>
    readonly tglPs: FieldRef<"HsiData", 'DateTime'>
    readonly statusMessage: FieldRef<"HsiData", 'String'>
    readonly packageName: FieldRef<"HsiData", 'String'>
    readonly groupPaket: FieldRef<"HsiData", 'String'>
    readonly reasonCancel: FieldRef<"HsiData", 'String'>
    readonly keteranganCancel: FieldRef<"HsiData", 'String'>
    readonly tglManja: FieldRef<"HsiData", 'DateTime'>
    readonly detailManja: FieldRef<"HsiData", 'String'>
    readonly suberrorcode: FieldRef<"HsiData", 'String'>
    readonly engineermemo: FieldRef<"HsiData", 'String'>
    readonly tahun: FieldRef<"HsiData", 'String'>
    readonly bulan: FieldRef<"HsiData", 'String'>
    readonly tanggal: FieldRef<"HsiData", 'String'>
    readonly ps1: FieldRef<"HsiData", 'String'>
    readonly cek: FieldRef<"HsiData", 'String'>
    readonly hasil: FieldRef<"HsiData", 'String'>
    readonly telda: FieldRef<"HsiData", 'String'>
    readonly dataProses: FieldRef<"HsiData", 'String'>
    readonly noOrderRevoke: FieldRef<"HsiData", 'String'>
    readonly datasPsRevoke: FieldRef<"HsiData", 'String'>
    readonly untukPsPi: FieldRef<"HsiData", 'String'>
    readonly createdAt: FieldRef<"HsiData", 'DateTime'>
    readonly updatedAt: FieldRef<"HsiData", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HsiData findUnique
   */
  export type HsiDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * Filter, which HsiData to fetch.
     */
    where: HsiDataWhereUniqueInput
  }

  /**
   * HsiData findUniqueOrThrow
   */
  export type HsiDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * Filter, which HsiData to fetch.
     */
    where: HsiDataWhereUniqueInput
  }

  /**
   * HsiData findFirst
   */
  export type HsiDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * Filter, which HsiData to fetch.
     */
    where?: HsiDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HsiData to fetch.
     */
    orderBy?: HsiDataOrderByWithRelationInput | HsiDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HsiData.
     */
    cursor?: HsiDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HsiData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HsiData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HsiData.
     */
    distinct?: HsiDataScalarFieldEnum | HsiDataScalarFieldEnum[]
  }

  /**
   * HsiData findFirstOrThrow
   */
  export type HsiDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * Filter, which HsiData to fetch.
     */
    where?: HsiDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HsiData to fetch.
     */
    orderBy?: HsiDataOrderByWithRelationInput | HsiDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HsiData.
     */
    cursor?: HsiDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HsiData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HsiData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HsiData.
     */
    distinct?: HsiDataScalarFieldEnum | HsiDataScalarFieldEnum[]
  }

  /**
   * HsiData findMany
   */
  export type HsiDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * Filter, which HsiData to fetch.
     */
    where?: HsiDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HsiData to fetch.
     */
    orderBy?: HsiDataOrderByWithRelationInput | HsiDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HsiData.
     */
    cursor?: HsiDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HsiData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HsiData.
     */
    skip?: number
    distinct?: HsiDataScalarFieldEnum | HsiDataScalarFieldEnum[]
  }

  /**
   * HsiData create
   */
  export type HsiDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * The data needed to create a HsiData.
     */
    data: XOR<HsiDataCreateInput, HsiDataUncheckedCreateInput>
  }

  /**
   * HsiData createMany
   */
  export type HsiDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HsiData.
     */
    data: HsiDataCreateManyInput | HsiDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HsiData createManyAndReturn
   */
  export type HsiDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * The data used to create many HsiData.
     */
    data: HsiDataCreateManyInput | HsiDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HsiData update
   */
  export type HsiDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * The data needed to update a HsiData.
     */
    data: XOR<HsiDataUpdateInput, HsiDataUncheckedUpdateInput>
    /**
     * Choose, which HsiData to update.
     */
    where: HsiDataWhereUniqueInput
  }

  /**
   * HsiData updateMany
   */
  export type HsiDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HsiData.
     */
    data: XOR<HsiDataUpdateManyMutationInput, HsiDataUncheckedUpdateManyInput>
    /**
     * Filter which HsiData to update
     */
    where?: HsiDataWhereInput
    /**
     * Limit how many HsiData to update.
     */
    limit?: number
  }

  /**
   * HsiData updateManyAndReturn
   */
  export type HsiDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * The data used to update HsiData.
     */
    data: XOR<HsiDataUpdateManyMutationInput, HsiDataUncheckedUpdateManyInput>
    /**
     * Filter which HsiData to update
     */
    where?: HsiDataWhereInput
    /**
     * Limit how many HsiData to update.
     */
    limit?: number
  }

  /**
   * HsiData upsert
   */
  export type HsiDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * The filter to search for the HsiData to update in case it exists.
     */
    where: HsiDataWhereUniqueInput
    /**
     * In case the HsiData found by the `where` argument doesn't exist, create a new HsiData with this data.
     */
    create: XOR<HsiDataCreateInput, HsiDataUncheckedCreateInput>
    /**
     * In case the HsiData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HsiDataUpdateInput, HsiDataUncheckedUpdateInput>
  }

  /**
   * HsiData delete
   */
  export type HsiDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
    /**
     * Filter which HsiData to delete.
     */
    where: HsiDataWhereUniqueInput
  }

  /**
   * HsiData deleteMany
   */
  export type HsiDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HsiData to delete
     */
    where?: HsiDataWhereInput
    /**
     * Limit how many HsiData to delete.
     */
    limit?: number
  }

  /**
   * HsiData without action
   */
  export type HsiDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HsiData
     */
    select?: HsiDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HsiData
     */
    omit?: HsiDataOmit<ExtArgs> | null
  }


  /**
   * Model SpmkMom
   */

  export type AggregateSpmkMom = {
    _count: SpmkMomCountAggregateOutputType | null
    _avg: SpmkMomAvgAggregateOutputType | null
    _sum: SpmkMomSumAggregateOutputType | null
    _min: SpmkMomMinAggregateOutputType | null
    _max: SpmkMomMaxAggregateOutputType | null
  }

  export type SpmkMomAvgAggregateOutputType = {
    id: number | null
    tahun: number | null
    revenuePlan: Decimal | null
    usia: number | null
    rab: Decimal | null
  }

  export type SpmkMomSumAggregateOutputType = {
    id: bigint | null
    tahun: number | null
    revenuePlan: Decimal | null
    usia: number | null
    rab: Decimal | null
  }

  export type SpmkMomMinAggregateOutputType = {
    id: bigint | null
    bulan: string | null
    tahun: number | null
    region: string | null
    witelLama: string | null
    witelBaru: string | null
    idIHld: string | null
    noNdeSpmk: string | null
    uraianKegiatan: string | null
    segmen: string | null
    poName: string | null
    tanggalGolive: Date | null
    konfirmasiPo: string | null
    tanggalCb: Date | null
    jenisKegiatan: string | null
    revenuePlan: Decimal | null
    statusProyek: string | null
    goLive: string | null
    keteranganToc: string | null
    perihalNdeSpmk: string | null
    mom: string | null
    baDrop: string | null
    populasiNonDrop: string | null
    tanggalMom: Date | null
    usia: number | null
    rab: Decimal | null
    totalPort: string | null
    templateDurasi: string | null
    toc: string | null
    umurPekerjaan: string | null
    kategoriUmurPekerjaan: string | null
    statusTompsLastActivity: string | null
    statusTompsNew: string | null
    statusIHld: string | null
    namaOdpGoLive: string | null
    bak: string | null
    keteranganPelimpahan: string | null
    mitraLokal: string | null
    createdAt: Date | null
    updatedAt: Date | null
    batchId: string | null
  }

  export type SpmkMomMaxAggregateOutputType = {
    id: bigint | null
    bulan: string | null
    tahun: number | null
    region: string | null
    witelLama: string | null
    witelBaru: string | null
    idIHld: string | null
    noNdeSpmk: string | null
    uraianKegiatan: string | null
    segmen: string | null
    poName: string | null
    tanggalGolive: Date | null
    konfirmasiPo: string | null
    tanggalCb: Date | null
    jenisKegiatan: string | null
    revenuePlan: Decimal | null
    statusProyek: string | null
    goLive: string | null
    keteranganToc: string | null
    perihalNdeSpmk: string | null
    mom: string | null
    baDrop: string | null
    populasiNonDrop: string | null
    tanggalMom: Date | null
    usia: number | null
    rab: Decimal | null
    totalPort: string | null
    templateDurasi: string | null
    toc: string | null
    umurPekerjaan: string | null
    kategoriUmurPekerjaan: string | null
    statusTompsLastActivity: string | null
    statusTompsNew: string | null
    statusIHld: string | null
    namaOdpGoLive: string | null
    bak: string | null
    keteranganPelimpahan: string | null
    mitraLokal: string | null
    createdAt: Date | null
    updatedAt: Date | null
    batchId: string | null
  }

  export type SpmkMomCountAggregateOutputType = {
    id: number
    bulan: number
    tahun: number
    region: number
    witelLama: number
    witelBaru: number
    idIHld: number
    noNdeSpmk: number
    uraianKegiatan: number
    segmen: number
    poName: number
    tanggalGolive: number
    konfirmasiPo: number
    tanggalCb: number
    jenisKegiatan: number
    revenuePlan: number
    statusProyek: number
    goLive: number
    keteranganToc: number
    perihalNdeSpmk: number
    mom: number
    baDrop: number
    populasiNonDrop: number
    tanggalMom: number
    usia: number
    rab: number
    totalPort: number
    templateDurasi: number
    toc: number
    umurPekerjaan: number
    kategoriUmurPekerjaan: number
    statusTompsLastActivity: number
    statusTompsNew: number
    statusIHld: number
    namaOdpGoLive: number
    bak: number
    keteranganPelimpahan: number
    mitraLokal: number
    createdAt: number
    updatedAt: number
    batchId: number
    _all: number
  }


  export type SpmkMomAvgAggregateInputType = {
    id?: true
    tahun?: true
    revenuePlan?: true
    usia?: true
    rab?: true
  }

  export type SpmkMomSumAggregateInputType = {
    id?: true
    tahun?: true
    revenuePlan?: true
    usia?: true
    rab?: true
  }

  export type SpmkMomMinAggregateInputType = {
    id?: true
    bulan?: true
    tahun?: true
    region?: true
    witelLama?: true
    witelBaru?: true
    idIHld?: true
    noNdeSpmk?: true
    uraianKegiatan?: true
    segmen?: true
    poName?: true
    tanggalGolive?: true
    konfirmasiPo?: true
    tanggalCb?: true
    jenisKegiatan?: true
    revenuePlan?: true
    statusProyek?: true
    goLive?: true
    keteranganToc?: true
    perihalNdeSpmk?: true
    mom?: true
    baDrop?: true
    populasiNonDrop?: true
    tanggalMom?: true
    usia?: true
    rab?: true
    totalPort?: true
    templateDurasi?: true
    toc?: true
    umurPekerjaan?: true
    kategoriUmurPekerjaan?: true
    statusTompsLastActivity?: true
    statusTompsNew?: true
    statusIHld?: true
    namaOdpGoLive?: true
    bak?: true
    keteranganPelimpahan?: true
    mitraLokal?: true
    createdAt?: true
    updatedAt?: true
    batchId?: true
  }

  export type SpmkMomMaxAggregateInputType = {
    id?: true
    bulan?: true
    tahun?: true
    region?: true
    witelLama?: true
    witelBaru?: true
    idIHld?: true
    noNdeSpmk?: true
    uraianKegiatan?: true
    segmen?: true
    poName?: true
    tanggalGolive?: true
    konfirmasiPo?: true
    tanggalCb?: true
    jenisKegiatan?: true
    revenuePlan?: true
    statusProyek?: true
    goLive?: true
    keteranganToc?: true
    perihalNdeSpmk?: true
    mom?: true
    baDrop?: true
    populasiNonDrop?: true
    tanggalMom?: true
    usia?: true
    rab?: true
    totalPort?: true
    templateDurasi?: true
    toc?: true
    umurPekerjaan?: true
    kategoriUmurPekerjaan?: true
    statusTompsLastActivity?: true
    statusTompsNew?: true
    statusIHld?: true
    namaOdpGoLive?: true
    bak?: true
    keteranganPelimpahan?: true
    mitraLokal?: true
    createdAt?: true
    updatedAt?: true
    batchId?: true
  }

  export type SpmkMomCountAggregateInputType = {
    id?: true
    bulan?: true
    tahun?: true
    region?: true
    witelLama?: true
    witelBaru?: true
    idIHld?: true
    noNdeSpmk?: true
    uraianKegiatan?: true
    segmen?: true
    poName?: true
    tanggalGolive?: true
    konfirmasiPo?: true
    tanggalCb?: true
    jenisKegiatan?: true
    revenuePlan?: true
    statusProyek?: true
    goLive?: true
    keteranganToc?: true
    perihalNdeSpmk?: true
    mom?: true
    baDrop?: true
    populasiNonDrop?: true
    tanggalMom?: true
    usia?: true
    rab?: true
    totalPort?: true
    templateDurasi?: true
    toc?: true
    umurPekerjaan?: true
    kategoriUmurPekerjaan?: true
    statusTompsLastActivity?: true
    statusTompsNew?: true
    statusIHld?: true
    namaOdpGoLive?: true
    bak?: true
    keteranganPelimpahan?: true
    mitraLokal?: true
    createdAt?: true
    updatedAt?: true
    batchId?: true
    _all?: true
  }

  export type SpmkMomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpmkMom to aggregate.
     */
    where?: SpmkMomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpmkMoms to fetch.
     */
    orderBy?: SpmkMomOrderByWithRelationInput | SpmkMomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpmkMomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpmkMoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpmkMoms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpmkMoms
    **/
    _count?: true | SpmkMomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpmkMomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpmkMomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpmkMomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpmkMomMaxAggregateInputType
  }

  export type GetSpmkMomAggregateType<T extends SpmkMomAggregateArgs> = {
        [P in keyof T & keyof AggregateSpmkMom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpmkMom[P]>
      : GetScalarType<T[P], AggregateSpmkMom[P]>
  }




  export type SpmkMomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpmkMomWhereInput
    orderBy?: SpmkMomOrderByWithAggregationInput | SpmkMomOrderByWithAggregationInput[]
    by: SpmkMomScalarFieldEnum[] | SpmkMomScalarFieldEnum
    having?: SpmkMomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpmkMomCountAggregateInputType | true
    _avg?: SpmkMomAvgAggregateInputType
    _sum?: SpmkMomSumAggregateInputType
    _min?: SpmkMomMinAggregateInputType
    _max?: SpmkMomMaxAggregateInputType
  }

  export type SpmkMomGroupByOutputType = {
    id: bigint
    bulan: string | null
    tahun: number | null
    region: string | null
    witelLama: string | null
    witelBaru: string | null
    idIHld: string | null
    noNdeSpmk: string | null
    uraianKegiatan: string | null
    segmen: string | null
    poName: string | null
    tanggalGolive: Date | null
    konfirmasiPo: string | null
    tanggalCb: Date | null
    jenisKegiatan: string | null
    revenuePlan: Decimal | null
    statusProyek: string | null
    goLive: string
    keteranganToc: string | null
    perihalNdeSpmk: string | null
    mom: string | null
    baDrop: string | null
    populasiNonDrop: string
    tanggalMom: Date | null
    usia: number | null
    rab: Decimal | null
    totalPort: string | null
    templateDurasi: string | null
    toc: string | null
    umurPekerjaan: string | null
    kategoriUmurPekerjaan: string | null
    statusTompsLastActivity: string | null
    statusTompsNew: string | null
    statusIHld: string | null
    namaOdpGoLive: string | null
    bak: string | null
    keteranganPelimpahan: string | null
    mitraLokal: string | null
    createdAt: Date
    updatedAt: Date
    batchId: string | null
    _count: SpmkMomCountAggregateOutputType | null
    _avg: SpmkMomAvgAggregateOutputType | null
    _sum: SpmkMomSumAggregateOutputType | null
    _min: SpmkMomMinAggregateOutputType | null
    _max: SpmkMomMaxAggregateOutputType | null
  }

  type GetSpmkMomGroupByPayload<T extends SpmkMomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpmkMomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpmkMomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpmkMomGroupByOutputType[P]>
            : GetScalarType<T[P], SpmkMomGroupByOutputType[P]>
        }
      >
    >


  export type SpmkMomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bulan?: boolean
    tahun?: boolean
    region?: boolean
    witelLama?: boolean
    witelBaru?: boolean
    idIHld?: boolean
    noNdeSpmk?: boolean
    uraianKegiatan?: boolean
    segmen?: boolean
    poName?: boolean
    tanggalGolive?: boolean
    konfirmasiPo?: boolean
    tanggalCb?: boolean
    jenisKegiatan?: boolean
    revenuePlan?: boolean
    statusProyek?: boolean
    goLive?: boolean
    keteranganToc?: boolean
    perihalNdeSpmk?: boolean
    mom?: boolean
    baDrop?: boolean
    populasiNonDrop?: boolean
    tanggalMom?: boolean
    usia?: boolean
    rab?: boolean
    totalPort?: boolean
    templateDurasi?: boolean
    toc?: boolean
    umurPekerjaan?: boolean
    kategoriUmurPekerjaan?: boolean
    statusTompsLastActivity?: boolean
    statusTompsNew?: boolean
    statusIHld?: boolean
    namaOdpGoLive?: boolean
    bak?: boolean
    keteranganPelimpahan?: boolean
    mitraLokal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }, ExtArgs["result"]["spmkMom"]>

  export type SpmkMomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bulan?: boolean
    tahun?: boolean
    region?: boolean
    witelLama?: boolean
    witelBaru?: boolean
    idIHld?: boolean
    noNdeSpmk?: boolean
    uraianKegiatan?: boolean
    segmen?: boolean
    poName?: boolean
    tanggalGolive?: boolean
    konfirmasiPo?: boolean
    tanggalCb?: boolean
    jenisKegiatan?: boolean
    revenuePlan?: boolean
    statusProyek?: boolean
    goLive?: boolean
    keteranganToc?: boolean
    perihalNdeSpmk?: boolean
    mom?: boolean
    baDrop?: boolean
    populasiNonDrop?: boolean
    tanggalMom?: boolean
    usia?: boolean
    rab?: boolean
    totalPort?: boolean
    templateDurasi?: boolean
    toc?: boolean
    umurPekerjaan?: boolean
    kategoriUmurPekerjaan?: boolean
    statusTompsLastActivity?: boolean
    statusTompsNew?: boolean
    statusIHld?: boolean
    namaOdpGoLive?: boolean
    bak?: boolean
    keteranganPelimpahan?: boolean
    mitraLokal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }, ExtArgs["result"]["spmkMom"]>

  export type SpmkMomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bulan?: boolean
    tahun?: boolean
    region?: boolean
    witelLama?: boolean
    witelBaru?: boolean
    idIHld?: boolean
    noNdeSpmk?: boolean
    uraianKegiatan?: boolean
    segmen?: boolean
    poName?: boolean
    tanggalGolive?: boolean
    konfirmasiPo?: boolean
    tanggalCb?: boolean
    jenisKegiatan?: boolean
    revenuePlan?: boolean
    statusProyek?: boolean
    goLive?: boolean
    keteranganToc?: boolean
    perihalNdeSpmk?: boolean
    mom?: boolean
    baDrop?: boolean
    populasiNonDrop?: boolean
    tanggalMom?: boolean
    usia?: boolean
    rab?: boolean
    totalPort?: boolean
    templateDurasi?: boolean
    toc?: boolean
    umurPekerjaan?: boolean
    kategoriUmurPekerjaan?: boolean
    statusTompsLastActivity?: boolean
    statusTompsNew?: boolean
    statusIHld?: boolean
    namaOdpGoLive?: boolean
    bak?: boolean
    keteranganPelimpahan?: boolean
    mitraLokal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }, ExtArgs["result"]["spmkMom"]>

  export type SpmkMomSelectScalar = {
    id?: boolean
    bulan?: boolean
    tahun?: boolean
    region?: boolean
    witelLama?: boolean
    witelBaru?: boolean
    idIHld?: boolean
    noNdeSpmk?: boolean
    uraianKegiatan?: boolean
    segmen?: boolean
    poName?: boolean
    tanggalGolive?: boolean
    konfirmasiPo?: boolean
    tanggalCb?: boolean
    jenisKegiatan?: boolean
    revenuePlan?: boolean
    statusProyek?: boolean
    goLive?: boolean
    keteranganToc?: boolean
    perihalNdeSpmk?: boolean
    mom?: boolean
    baDrop?: boolean
    populasiNonDrop?: boolean
    tanggalMom?: boolean
    usia?: boolean
    rab?: boolean
    totalPort?: boolean
    templateDurasi?: boolean
    toc?: boolean
    umurPekerjaan?: boolean
    kategoriUmurPekerjaan?: boolean
    statusTompsLastActivity?: boolean
    statusTompsNew?: boolean
    statusIHld?: boolean
    namaOdpGoLive?: boolean
    bak?: boolean
    keteranganPelimpahan?: boolean
    mitraLokal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batchId?: boolean
  }

  export type SpmkMomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bulan" | "tahun" | "region" | "witelLama" | "witelBaru" | "idIHld" | "noNdeSpmk" | "uraianKegiatan" | "segmen" | "poName" | "tanggalGolive" | "konfirmasiPo" | "tanggalCb" | "jenisKegiatan" | "revenuePlan" | "statusProyek" | "goLive" | "keteranganToc" | "perihalNdeSpmk" | "mom" | "baDrop" | "populasiNonDrop" | "tanggalMom" | "usia" | "rab" | "totalPort" | "templateDurasi" | "toc" | "umurPekerjaan" | "kategoriUmurPekerjaan" | "statusTompsLastActivity" | "statusTompsNew" | "statusIHld" | "namaOdpGoLive" | "bak" | "keteranganPelimpahan" | "mitraLokal" | "createdAt" | "updatedAt" | "batchId", ExtArgs["result"]["spmkMom"]>

  export type $SpmkMomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpmkMom"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      bulan: string | null
      tahun: number | null
      region: string | null
      witelLama: string | null
      witelBaru: string | null
      idIHld: string | null
      noNdeSpmk: string | null
      uraianKegiatan: string | null
      segmen: string | null
      poName: string | null
      tanggalGolive: Date | null
      konfirmasiPo: string | null
      tanggalCb: Date | null
      jenisKegiatan: string | null
      revenuePlan: Prisma.Decimal | null
      statusProyek: string | null
      goLive: string
      keteranganToc: string | null
      perihalNdeSpmk: string | null
      mom: string | null
      baDrop: string | null
      populasiNonDrop: string
      tanggalMom: Date | null
      usia: number | null
      rab: Prisma.Decimal | null
      totalPort: string | null
      templateDurasi: string | null
      toc: string | null
      umurPekerjaan: string | null
      kategoriUmurPekerjaan: string | null
      statusTompsLastActivity: string | null
      statusTompsNew: string | null
      statusIHld: string | null
      namaOdpGoLive: string | null
      bak: string | null
      keteranganPelimpahan: string | null
      mitraLokal: string | null
      createdAt: Date
      updatedAt: Date
      batchId: string | null
    }, ExtArgs["result"]["spmkMom"]>
    composites: {}
  }

  type SpmkMomGetPayload<S extends boolean | null | undefined | SpmkMomDefaultArgs> = $Result.GetResult<Prisma.$SpmkMomPayload, S>

  type SpmkMomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpmkMomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpmkMomCountAggregateInputType | true
    }

  export interface SpmkMomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpmkMom'], meta: { name: 'SpmkMom' } }
    /**
     * Find zero or one SpmkMom that matches the filter.
     * @param {SpmkMomFindUniqueArgs} args - Arguments to find a SpmkMom
     * @example
     * // Get one SpmkMom
     * const spmkMom = await prisma.spmkMom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpmkMomFindUniqueArgs>(args: SelectSubset<T, SpmkMomFindUniqueArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SpmkMom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpmkMomFindUniqueOrThrowArgs} args - Arguments to find a SpmkMom
     * @example
     * // Get one SpmkMom
     * const spmkMom = await prisma.spmkMom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpmkMomFindUniqueOrThrowArgs>(args: SelectSubset<T, SpmkMomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpmkMom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpmkMomFindFirstArgs} args - Arguments to find a SpmkMom
     * @example
     * // Get one SpmkMom
     * const spmkMom = await prisma.spmkMom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpmkMomFindFirstArgs>(args?: SelectSubset<T, SpmkMomFindFirstArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpmkMom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpmkMomFindFirstOrThrowArgs} args - Arguments to find a SpmkMom
     * @example
     * // Get one SpmkMom
     * const spmkMom = await prisma.spmkMom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpmkMomFindFirstOrThrowArgs>(args?: SelectSubset<T, SpmkMomFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SpmkMoms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpmkMomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpmkMoms
     * const spmkMoms = await prisma.spmkMom.findMany()
     * 
     * // Get first 10 SpmkMoms
     * const spmkMoms = await prisma.spmkMom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spmkMomWithIdOnly = await prisma.spmkMom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpmkMomFindManyArgs>(args?: SelectSubset<T, SpmkMomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SpmkMom.
     * @param {SpmkMomCreateArgs} args - Arguments to create a SpmkMom.
     * @example
     * // Create one SpmkMom
     * const SpmkMom = await prisma.spmkMom.create({
     *   data: {
     *     // ... data to create a SpmkMom
     *   }
     * })
     * 
     */
    create<T extends SpmkMomCreateArgs>(args: SelectSubset<T, SpmkMomCreateArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SpmkMoms.
     * @param {SpmkMomCreateManyArgs} args - Arguments to create many SpmkMoms.
     * @example
     * // Create many SpmkMoms
     * const spmkMom = await prisma.spmkMom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpmkMomCreateManyArgs>(args?: SelectSubset<T, SpmkMomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpmkMoms and returns the data saved in the database.
     * @param {SpmkMomCreateManyAndReturnArgs} args - Arguments to create many SpmkMoms.
     * @example
     * // Create many SpmkMoms
     * const spmkMom = await prisma.spmkMom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpmkMoms and only return the `id`
     * const spmkMomWithIdOnly = await prisma.spmkMom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpmkMomCreateManyAndReturnArgs>(args?: SelectSubset<T, SpmkMomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SpmkMom.
     * @param {SpmkMomDeleteArgs} args - Arguments to delete one SpmkMom.
     * @example
     * // Delete one SpmkMom
     * const SpmkMom = await prisma.spmkMom.delete({
     *   where: {
     *     // ... filter to delete one SpmkMom
     *   }
     * })
     * 
     */
    delete<T extends SpmkMomDeleteArgs>(args: SelectSubset<T, SpmkMomDeleteArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SpmkMom.
     * @param {SpmkMomUpdateArgs} args - Arguments to update one SpmkMom.
     * @example
     * // Update one SpmkMom
     * const spmkMom = await prisma.spmkMom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpmkMomUpdateArgs>(args: SelectSubset<T, SpmkMomUpdateArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SpmkMoms.
     * @param {SpmkMomDeleteManyArgs} args - Arguments to filter SpmkMoms to delete.
     * @example
     * // Delete a few SpmkMoms
     * const { count } = await prisma.spmkMom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpmkMomDeleteManyArgs>(args?: SelectSubset<T, SpmkMomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpmkMoms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpmkMomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpmkMoms
     * const spmkMom = await prisma.spmkMom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpmkMomUpdateManyArgs>(args: SelectSubset<T, SpmkMomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpmkMoms and returns the data updated in the database.
     * @param {SpmkMomUpdateManyAndReturnArgs} args - Arguments to update many SpmkMoms.
     * @example
     * // Update many SpmkMoms
     * const spmkMom = await prisma.spmkMom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SpmkMoms and only return the `id`
     * const spmkMomWithIdOnly = await prisma.spmkMom.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpmkMomUpdateManyAndReturnArgs>(args: SelectSubset<T, SpmkMomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SpmkMom.
     * @param {SpmkMomUpsertArgs} args - Arguments to update or create a SpmkMom.
     * @example
     * // Update or create a SpmkMom
     * const spmkMom = await prisma.spmkMom.upsert({
     *   create: {
     *     // ... data to create a SpmkMom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpmkMom we want to update
     *   }
     * })
     */
    upsert<T extends SpmkMomUpsertArgs>(args: SelectSubset<T, SpmkMomUpsertArgs<ExtArgs>>): Prisma__SpmkMomClient<$Result.GetResult<Prisma.$SpmkMomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SpmkMoms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpmkMomCountArgs} args - Arguments to filter SpmkMoms to count.
     * @example
     * // Count the number of SpmkMoms
     * const count = await prisma.spmkMom.count({
     *   where: {
     *     // ... the filter for the SpmkMoms we want to count
     *   }
     * })
    **/
    count<T extends SpmkMomCountArgs>(
      args?: Subset<T, SpmkMomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpmkMomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpmkMom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpmkMomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpmkMomAggregateArgs>(args: Subset<T, SpmkMomAggregateArgs>): Prisma.PrismaPromise<GetSpmkMomAggregateType<T>>

    /**
     * Group by SpmkMom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpmkMomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpmkMomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpmkMomGroupByArgs['orderBy'] }
        : { orderBy?: SpmkMomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpmkMomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpmkMomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpmkMom model
   */
  readonly fields: SpmkMomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpmkMom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpmkMomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SpmkMom model
   */
  interface SpmkMomFieldRefs {
    readonly id: FieldRef<"SpmkMom", 'BigInt'>
    readonly bulan: FieldRef<"SpmkMom", 'String'>
    readonly tahun: FieldRef<"SpmkMom", 'Int'>
    readonly region: FieldRef<"SpmkMom", 'String'>
    readonly witelLama: FieldRef<"SpmkMom", 'String'>
    readonly witelBaru: FieldRef<"SpmkMom", 'String'>
    readonly idIHld: FieldRef<"SpmkMom", 'String'>
    readonly noNdeSpmk: FieldRef<"SpmkMom", 'String'>
    readonly uraianKegiatan: FieldRef<"SpmkMom", 'String'>
    readonly segmen: FieldRef<"SpmkMom", 'String'>
    readonly poName: FieldRef<"SpmkMom", 'String'>
    readonly tanggalGolive: FieldRef<"SpmkMom", 'DateTime'>
    readonly konfirmasiPo: FieldRef<"SpmkMom", 'String'>
    readonly tanggalCb: FieldRef<"SpmkMom", 'DateTime'>
    readonly jenisKegiatan: FieldRef<"SpmkMom", 'String'>
    readonly revenuePlan: FieldRef<"SpmkMom", 'Decimal'>
    readonly statusProyek: FieldRef<"SpmkMom", 'String'>
    readonly goLive: FieldRef<"SpmkMom", 'String'>
    readonly keteranganToc: FieldRef<"SpmkMom", 'String'>
    readonly perihalNdeSpmk: FieldRef<"SpmkMom", 'String'>
    readonly mom: FieldRef<"SpmkMom", 'String'>
    readonly baDrop: FieldRef<"SpmkMom", 'String'>
    readonly populasiNonDrop: FieldRef<"SpmkMom", 'String'>
    readonly tanggalMom: FieldRef<"SpmkMom", 'DateTime'>
    readonly usia: FieldRef<"SpmkMom", 'Int'>
    readonly rab: FieldRef<"SpmkMom", 'Decimal'>
    readonly totalPort: FieldRef<"SpmkMom", 'String'>
    readonly templateDurasi: FieldRef<"SpmkMom", 'String'>
    readonly toc: FieldRef<"SpmkMom", 'String'>
    readonly umurPekerjaan: FieldRef<"SpmkMom", 'String'>
    readonly kategoriUmurPekerjaan: FieldRef<"SpmkMom", 'String'>
    readonly statusTompsLastActivity: FieldRef<"SpmkMom", 'String'>
    readonly statusTompsNew: FieldRef<"SpmkMom", 'String'>
    readonly statusIHld: FieldRef<"SpmkMom", 'String'>
    readonly namaOdpGoLive: FieldRef<"SpmkMom", 'String'>
    readonly bak: FieldRef<"SpmkMom", 'String'>
    readonly keteranganPelimpahan: FieldRef<"SpmkMom", 'String'>
    readonly mitraLokal: FieldRef<"SpmkMom", 'String'>
    readonly createdAt: FieldRef<"SpmkMom", 'DateTime'>
    readonly updatedAt: FieldRef<"SpmkMom", 'DateTime'>
    readonly batchId: FieldRef<"SpmkMom", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SpmkMom findUnique
   */
  export type SpmkMomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * Filter, which SpmkMom to fetch.
     */
    where: SpmkMomWhereUniqueInput
  }

  /**
   * SpmkMom findUniqueOrThrow
   */
  export type SpmkMomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * Filter, which SpmkMom to fetch.
     */
    where: SpmkMomWhereUniqueInput
  }

  /**
   * SpmkMom findFirst
   */
  export type SpmkMomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * Filter, which SpmkMom to fetch.
     */
    where?: SpmkMomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpmkMoms to fetch.
     */
    orderBy?: SpmkMomOrderByWithRelationInput | SpmkMomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpmkMoms.
     */
    cursor?: SpmkMomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpmkMoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpmkMoms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpmkMoms.
     */
    distinct?: SpmkMomScalarFieldEnum | SpmkMomScalarFieldEnum[]
  }

  /**
   * SpmkMom findFirstOrThrow
   */
  export type SpmkMomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * Filter, which SpmkMom to fetch.
     */
    where?: SpmkMomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpmkMoms to fetch.
     */
    orderBy?: SpmkMomOrderByWithRelationInput | SpmkMomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpmkMoms.
     */
    cursor?: SpmkMomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpmkMoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpmkMoms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpmkMoms.
     */
    distinct?: SpmkMomScalarFieldEnum | SpmkMomScalarFieldEnum[]
  }

  /**
   * SpmkMom findMany
   */
  export type SpmkMomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * Filter, which SpmkMoms to fetch.
     */
    where?: SpmkMomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpmkMoms to fetch.
     */
    orderBy?: SpmkMomOrderByWithRelationInput | SpmkMomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpmkMoms.
     */
    cursor?: SpmkMomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpmkMoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpmkMoms.
     */
    skip?: number
    distinct?: SpmkMomScalarFieldEnum | SpmkMomScalarFieldEnum[]
  }

  /**
   * SpmkMom create
   */
  export type SpmkMomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * The data needed to create a SpmkMom.
     */
    data: XOR<SpmkMomCreateInput, SpmkMomUncheckedCreateInput>
  }

  /**
   * SpmkMom createMany
   */
  export type SpmkMomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpmkMoms.
     */
    data: SpmkMomCreateManyInput | SpmkMomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpmkMom createManyAndReturn
   */
  export type SpmkMomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * The data used to create many SpmkMoms.
     */
    data: SpmkMomCreateManyInput | SpmkMomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpmkMom update
   */
  export type SpmkMomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * The data needed to update a SpmkMom.
     */
    data: XOR<SpmkMomUpdateInput, SpmkMomUncheckedUpdateInput>
    /**
     * Choose, which SpmkMom to update.
     */
    where: SpmkMomWhereUniqueInput
  }

  /**
   * SpmkMom updateMany
   */
  export type SpmkMomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpmkMoms.
     */
    data: XOR<SpmkMomUpdateManyMutationInput, SpmkMomUncheckedUpdateManyInput>
    /**
     * Filter which SpmkMoms to update
     */
    where?: SpmkMomWhereInput
    /**
     * Limit how many SpmkMoms to update.
     */
    limit?: number
  }

  /**
   * SpmkMom updateManyAndReturn
   */
  export type SpmkMomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * The data used to update SpmkMoms.
     */
    data: XOR<SpmkMomUpdateManyMutationInput, SpmkMomUncheckedUpdateManyInput>
    /**
     * Filter which SpmkMoms to update
     */
    where?: SpmkMomWhereInput
    /**
     * Limit how many SpmkMoms to update.
     */
    limit?: number
  }

  /**
   * SpmkMom upsert
   */
  export type SpmkMomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * The filter to search for the SpmkMom to update in case it exists.
     */
    where: SpmkMomWhereUniqueInput
    /**
     * In case the SpmkMom found by the `where` argument doesn't exist, create a new SpmkMom with this data.
     */
    create: XOR<SpmkMomCreateInput, SpmkMomUncheckedCreateInput>
    /**
     * In case the SpmkMom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpmkMomUpdateInput, SpmkMomUncheckedUpdateInput>
  }

  /**
   * SpmkMom delete
   */
  export type SpmkMomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
    /**
     * Filter which SpmkMom to delete.
     */
    where: SpmkMomWhereUniqueInput
  }

  /**
   * SpmkMom deleteMany
   */
  export type SpmkMomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpmkMoms to delete
     */
    where?: SpmkMomWhereInput
    /**
     * Limit how many SpmkMoms to delete.
     */
    limit?: number
  }

  /**
   * SpmkMom without action
   */
  export type SpmkMomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpmkMom
     */
    select?: SpmkMomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpmkMom
     */
    omit?: SpmkMomOmit<ExtArgs> | null
  }


  /**
   * Model DocumentData
   */

  export type AggregateDocumentData = {
    _count: DocumentDataCountAggregateOutputType | null
    _avg: DocumentDataAvgAggregateOutputType | null
    _sum: DocumentDataSumAggregateOutputType | null
    _min: DocumentDataMinAggregateOutputType | null
    _max: DocumentDataMaxAggregateOutputType | null
  }

  export type DocumentDataAvgAggregateOutputType = {
    id: number | null
    netPrice: Decimal | null
  }

  export type DocumentDataSumAggregateOutputType = {
    id: bigint | null
    netPrice: Decimal | null
  }

  export type DocumentDataMinAggregateOutputType = {
    id: bigint | null
    batchId: string | null
    orderId: string | null
    product: string | null
    netPrice: Decimal | null
    isTemplatePrice: boolean | null
    productsProcessed: boolean | null
    milestone: string | null
    previousMilestone: string | null
    segment: string | null
    namaWitel: string | null
    statusWfm: string | null
    customerName: string | null
    channel: string | null
    layanan: string | null
    filterProduk: string | null
    witelLama: string | null
    orderStatus: string | null
    orderSubType: string | null
    orderStatusN: string | null
    tahun: string | null
    telda: string | null
    week: string | null
    orderDate: Date | null
    orderCreatedDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentDataMaxAggregateOutputType = {
    id: bigint | null
    batchId: string | null
    orderId: string | null
    product: string | null
    netPrice: Decimal | null
    isTemplatePrice: boolean | null
    productsProcessed: boolean | null
    milestone: string | null
    previousMilestone: string | null
    segment: string | null
    namaWitel: string | null
    statusWfm: string | null
    customerName: string | null
    channel: string | null
    layanan: string | null
    filterProduk: string | null
    witelLama: string | null
    orderStatus: string | null
    orderSubType: string | null
    orderStatusN: string | null
    tahun: string | null
    telda: string | null
    week: string | null
    orderDate: Date | null
    orderCreatedDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentDataCountAggregateOutputType = {
    id: number
    batchId: number
    orderId: number
    product: number
    netPrice: number
    isTemplatePrice: number
    productsProcessed: number
    milestone: number
    previousMilestone: number
    segment: number
    namaWitel: number
    statusWfm: number
    customerName: number
    channel: number
    layanan: number
    filterProduk: number
    witelLama: number
    orderStatus: number
    orderSubType: number
    orderStatusN: number
    tahun: number
    telda: number
    week: number
    orderDate: number
    orderCreatedDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentDataAvgAggregateInputType = {
    id?: true
    netPrice?: true
  }

  export type DocumentDataSumAggregateInputType = {
    id?: true
    netPrice?: true
  }

  export type DocumentDataMinAggregateInputType = {
    id?: true
    batchId?: true
    orderId?: true
    product?: true
    netPrice?: true
    isTemplatePrice?: true
    productsProcessed?: true
    milestone?: true
    previousMilestone?: true
    segment?: true
    namaWitel?: true
    statusWfm?: true
    customerName?: true
    channel?: true
    layanan?: true
    filterProduk?: true
    witelLama?: true
    orderStatus?: true
    orderSubType?: true
    orderStatusN?: true
    tahun?: true
    telda?: true
    week?: true
    orderDate?: true
    orderCreatedDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentDataMaxAggregateInputType = {
    id?: true
    batchId?: true
    orderId?: true
    product?: true
    netPrice?: true
    isTemplatePrice?: true
    productsProcessed?: true
    milestone?: true
    previousMilestone?: true
    segment?: true
    namaWitel?: true
    statusWfm?: true
    customerName?: true
    channel?: true
    layanan?: true
    filterProduk?: true
    witelLama?: true
    orderStatus?: true
    orderSubType?: true
    orderStatusN?: true
    tahun?: true
    telda?: true
    week?: true
    orderDate?: true
    orderCreatedDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentDataCountAggregateInputType = {
    id?: true
    batchId?: true
    orderId?: true
    product?: true
    netPrice?: true
    isTemplatePrice?: true
    productsProcessed?: true
    milestone?: true
    previousMilestone?: true
    segment?: true
    namaWitel?: true
    statusWfm?: true
    customerName?: true
    channel?: true
    layanan?: true
    filterProduk?: true
    witelLama?: true
    orderStatus?: true
    orderSubType?: true
    orderStatusN?: true
    tahun?: true
    telda?: true
    week?: true
    orderDate?: true
    orderCreatedDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentData to aggregate.
     */
    where?: DocumentDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentData to fetch.
     */
    orderBy?: DocumentDataOrderByWithRelationInput | DocumentDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DocumentData
    **/
    _count?: true | DocumentDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentDataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentDataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentDataMaxAggregateInputType
  }

  export type GetDocumentDataAggregateType<T extends DocumentDataAggregateArgs> = {
        [P in keyof T & keyof AggregateDocumentData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocumentData[P]>
      : GetScalarType<T[P], AggregateDocumentData[P]>
  }




  export type DocumentDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentDataWhereInput
    orderBy?: DocumentDataOrderByWithAggregationInput | DocumentDataOrderByWithAggregationInput[]
    by: DocumentDataScalarFieldEnum[] | DocumentDataScalarFieldEnum
    having?: DocumentDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentDataCountAggregateInputType | true
    _avg?: DocumentDataAvgAggregateInputType
    _sum?: DocumentDataSumAggregateInputType
    _min?: DocumentDataMinAggregateInputType
    _max?: DocumentDataMaxAggregateInputType
  }

  export type DocumentDataGroupByOutputType = {
    id: bigint
    batchId: string | null
    orderId: string
    product: string | null
    netPrice: Decimal
    isTemplatePrice: boolean
    productsProcessed: boolean
    milestone: string | null
    previousMilestone: string | null
    segment: string | null
    namaWitel: string | null
    statusWfm: string | null
    customerName: string | null
    channel: string | null
    layanan: string | null
    filterProduk: string | null
    witelLama: string | null
    orderStatus: string | null
    orderSubType: string | null
    orderStatusN: string | null
    tahun: string | null
    telda: string | null
    week: string | null
    orderDate: Date | null
    orderCreatedDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: DocumentDataCountAggregateOutputType | null
    _avg: DocumentDataAvgAggregateOutputType | null
    _sum: DocumentDataSumAggregateOutputType | null
    _min: DocumentDataMinAggregateOutputType | null
    _max: DocumentDataMaxAggregateOutputType | null
  }

  type GetDocumentDataGroupByPayload<T extends DocumentDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentDataGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentDataGroupByOutputType[P]>
        }
      >
    >


  export type DocumentDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    orderId?: boolean
    product?: boolean
    netPrice?: boolean
    isTemplatePrice?: boolean
    productsProcessed?: boolean
    milestone?: boolean
    previousMilestone?: boolean
    segment?: boolean
    namaWitel?: boolean
    statusWfm?: boolean
    customerName?: boolean
    channel?: boolean
    layanan?: boolean
    filterProduk?: boolean
    witelLama?: boolean
    orderStatus?: boolean
    orderSubType?: boolean
    orderStatusN?: boolean
    tahun?: boolean
    telda?: boolean
    week?: boolean
    orderDate?: boolean
    orderCreatedDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["documentData"]>

  export type DocumentDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    orderId?: boolean
    product?: boolean
    netPrice?: boolean
    isTemplatePrice?: boolean
    productsProcessed?: boolean
    milestone?: boolean
    previousMilestone?: boolean
    segment?: boolean
    namaWitel?: boolean
    statusWfm?: boolean
    customerName?: boolean
    channel?: boolean
    layanan?: boolean
    filterProduk?: boolean
    witelLama?: boolean
    orderStatus?: boolean
    orderSubType?: boolean
    orderStatusN?: boolean
    tahun?: boolean
    telda?: boolean
    week?: boolean
    orderDate?: boolean
    orderCreatedDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["documentData"]>

  export type DocumentDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    orderId?: boolean
    product?: boolean
    netPrice?: boolean
    isTemplatePrice?: boolean
    productsProcessed?: boolean
    milestone?: boolean
    previousMilestone?: boolean
    segment?: boolean
    namaWitel?: boolean
    statusWfm?: boolean
    customerName?: boolean
    channel?: boolean
    layanan?: boolean
    filterProduk?: boolean
    witelLama?: boolean
    orderStatus?: boolean
    orderSubType?: boolean
    orderStatusN?: boolean
    tahun?: boolean
    telda?: boolean
    week?: boolean
    orderDate?: boolean
    orderCreatedDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["documentData"]>

  export type DocumentDataSelectScalar = {
    id?: boolean
    batchId?: boolean
    orderId?: boolean
    product?: boolean
    netPrice?: boolean
    isTemplatePrice?: boolean
    productsProcessed?: boolean
    milestone?: boolean
    previousMilestone?: boolean
    segment?: boolean
    namaWitel?: boolean
    statusWfm?: boolean
    customerName?: boolean
    channel?: boolean
    layanan?: boolean
    filterProduk?: boolean
    witelLama?: boolean
    orderStatus?: boolean
    orderSubType?: boolean
    orderStatusN?: boolean
    tahun?: boolean
    telda?: boolean
    week?: boolean
    orderDate?: boolean
    orderCreatedDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "batchId" | "orderId" | "product" | "netPrice" | "isTemplatePrice" | "productsProcessed" | "milestone" | "previousMilestone" | "segment" | "namaWitel" | "statusWfm" | "customerName" | "channel" | "layanan" | "filterProduk" | "witelLama" | "orderStatus" | "orderSubType" | "orderStatusN" | "tahun" | "telda" | "week" | "orderDate" | "orderCreatedDate" | "createdAt" | "updatedAt", ExtArgs["result"]["documentData"]>

  export type $DocumentDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DocumentData"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      batchId: string | null
      orderId: string
      product: string | null
      netPrice: Prisma.Decimal
      isTemplatePrice: boolean
      productsProcessed: boolean
      milestone: string | null
      previousMilestone: string | null
      segment: string | null
      namaWitel: string | null
      statusWfm: string | null
      customerName: string | null
      channel: string | null
      layanan: string | null
      filterProduk: string | null
      witelLama: string | null
      orderStatus: string | null
      orderSubType: string | null
      orderStatusN: string | null
      tahun: string | null
      telda: string | null
      week: string | null
      orderDate: Date | null
      orderCreatedDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["documentData"]>
    composites: {}
  }

  type DocumentDataGetPayload<S extends boolean | null | undefined | DocumentDataDefaultArgs> = $Result.GetResult<Prisma.$DocumentDataPayload, S>

  type DocumentDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentDataCountAggregateInputType | true
    }

  export interface DocumentDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DocumentData'], meta: { name: 'DocumentData' } }
    /**
     * Find zero or one DocumentData that matches the filter.
     * @param {DocumentDataFindUniqueArgs} args - Arguments to find a DocumentData
     * @example
     * // Get one DocumentData
     * const documentData = await prisma.documentData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentDataFindUniqueArgs>(args: SelectSubset<T, DocumentDataFindUniqueArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DocumentData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentDataFindUniqueOrThrowArgs} args - Arguments to find a DocumentData
     * @example
     * // Get one DocumentData
     * const documentData = await prisma.documentData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentDataFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocumentData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentDataFindFirstArgs} args - Arguments to find a DocumentData
     * @example
     * // Get one DocumentData
     * const documentData = await prisma.documentData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentDataFindFirstArgs>(args?: SelectSubset<T, DocumentDataFindFirstArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocumentData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentDataFindFirstOrThrowArgs} args - Arguments to find a DocumentData
     * @example
     * // Get one DocumentData
     * const documentData = await prisma.documentData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentDataFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DocumentData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DocumentData
     * const documentData = await prisma.documentData.findMany()
     * 
     * // Get first 10 DocumentData
     * const documentData = await prisma.documentData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentDataWithIdOnly = await prisma.documentData.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentDataFindManyArgs>(args?: SelectSubset<T, DocumentDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DocumentData.
     * @param {DocumentDataCreateArgs} args - Arguments to create a DocumentData.
     * @example
     * // Create one DocumentData
     * const DocumentData = await prisma.documentData.create({
     *   data: {
     *     // ... data to create a DocumentData
     *   }
     * })
     * 
     */
    create<T extends DocumentDataCreateArgs>(args: SelectSubset<T, DocumentDataCreateArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DocumentData.
     * @param {DocumentDataCreateManyArgs} args - Arguments to create many DocumentData.
     * @example
     * // Create many DocumentData
     * const documentData = await prisma.documentData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentDataCreateManyArgs>(args?: SelectSubset<T, DocumentDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DocumentData and returns the data saved in the database.
     * @param {DocumentDataCreateManyAndReturnArgs} args - Arguments to create many DocumentData.
     * @example
     * // Create many DocumentData
     * const documentData = await prisma.documentData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DocumentData and only return the `id`
     * const documentDataWithIdOnly = await prisma.documentData.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentDataCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DocumentData.
     * @param {DocumentDataDeleteArgs} args - Arguments to delete one DocumentData.
     * @example
     * // Delete one DocumentData
     * const DocumentData = await prisma.documentData.delete({
     *   where: {
     *     // ... filter to delete one DocumentData
     *   }
     * })
     * 
     */
    delete<T extends DocumentDataDeleteArgs>(args: SelectSubset<T, DocumentDataDeleteArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DocumentData.
     * @param {DocumentDataUpdateArgs} args - Arguments to update one DocumentData.
     * @example
     * // Update one DocumentData
     * const documentData = await prisma.documentData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentDataUpdateArgs>(args: SelectSubset<T, DocumentDataUpdateArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DocumentData.
     * @param {DocumentDataDeleteManyArgs} args - Arguments to filter DocumentData to delete.
     * @example
     * // Delete a few DocumentData
     * const { count } = await prisma.documentData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDataDeleteManyArgs>(args?: SelectSubset<T, DocumentDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DocumentData
     * const documentData = await prisma.documentData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentDataUpdateManyArgs>(args: SelectSubset<T, DocumentDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentData and returns the data updated in the database.
     * @param {DocumentDataUpdateManyAndReturnArgs} args - Arguments to update many DocumentData.
     * @example
     * // Update many DocumentData
     * const documentData = await prisma.documentData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DocumentData and only return the `id`
     * const documentDataWithIdOnly = await prisma.documentData.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentDataUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DocumentData.
     * @param {DocumentDataUpsertArgs} args - Arguments to update or create a DocumentData.
     * @example
     * // Update or create a DocumentData
     * const documentData = await prisma.documentData.upsert({
     *   create: {
     *     // ... data to create a DocumentData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DocumentData we want to update
     *   }
     * })
     */
    upsert<T extends DocumentDataUpsertArgs>(args: SelectSubset<T, DocumentDataUpsertArgs<ExtArgs>>): Prisma__DocumentDataClient<$Result.GetResult<Prisma.$DocumentDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DocumentData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentDataCountArgs} args - Arguments to filter DocumentData to count.
     * @example
     * // Count the number of DocumentData
     * const count = await prisma.documentData.count({
     *   where: {
     *     // ... the filter for the DocumentData we want to count
     *   }
     * })
    **/
    count<T extends DocumentDataCountArgs>(
      args?: Subset<T, DocumentDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DocumentData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentDataAggregateArgs>(args: Subset<T, DocumentDataAggregateArgs>): Prisma.PrismaPromise<GetDocumentDataAggregateType<T>>

    /**
     * Group by DocumentData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentDataGroupByArgs['orderBy'] }
        : { orderBy?: DocumentDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DocumentData model
   */
  readonly fields: DocumentDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DocumentData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DocumentData model
   */
  interface DocumentDataFieldRefs {
    readonly id: FieldRef<"DocumentData", 'BigInt'>
    readonly batchId: FieldRef<"DocumentData", 'String'>
    readonly orderId: FieldRef<"DocumentData", 'String'>
    readonly product: FieldRef<"DocumentData", 'String'>
    readonly netPrice: FieldRef<"DocumentData", 'Decimal'>
    readonly isTemplatePrice: FieldRef<"DocumentData", 'Boolean'>
    readonly productsProcessed: FieldRef<"DocumentData", 'Boolean'>
    readonly milestone: FieldRef<"DocumentData", 'String'>
    readonly previousMilestone: FieldRef<"DocumentData", 'String'>
    readonly segment: FieldRef<"DocumentData", 'String'>
    readonly namaWitel: FieldRef<"DocumentData", 'String'>
    readonly statusWfm: FieldRef<"DocumentData", 'String'>
    readonly customerName: FieldRef<"DocumentData", 'String'>
    readonly channel: FieldRef<"DocumentData", 'String'>
    readonly layanan: FieldRef<"DocumentData", 'String'>
    readonly filterProduk: FieldRef<"DocumentData", 'String'>
    readonly witelLama: FieldRef<"DocumentData", 'String'>
    readonly orderStatus: FieldRef<"DocumentData", 'String'>
    readonly orderSubType: FieldRef<"DocumentData", 'String'>
    readonly orderStatusN: FieldRef<"DocumentData", 'String'>
    readonly tahun: FieldRef<"DocumentData", 'String'>
    readonly telda: FieldRef<"DocumentData", 'String'>
    readonly week: FieldRef<"DocumentData", 'String'>
    readonly orderDate: FieldRef<"DocumentData", 'DateTime'>
    readonly orderCreatedDate: FieldRef<"DocumentData", 'DateTime'>
    readonly createdAt: FieldRef<"DocumentData", 'DateTime'>
    readonly updatedAt: FieldRef<"DocumentData", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DocumentData findUnique
   */
  export type DocumentDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * Filter, which DocumentData to fetch.
     */
    where: DocumentDataWhereUniqueInput
  }

  /**
   * DocumentData findUniqueOrThrow
   */
  export type DocumentDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * Filter, which DocumentData to fetch.
     */
    where: DocumentDataWhereUniqueInput
  }

  /**
   * DocumentData findFirst
   */
  export type DocumentDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * Filter, which DocumentData to fetch.
     */
    where?: DocumentDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentData to fetch.
     */
    orderBy?: DocumentDataOrderByWithRelationInput | DocumentDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentData.
     */
    cursor?: DocumentDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentData.
     */
    distinct?: DocumentDataScalarFieldEnum | DocumentDataScalarFieldEnum[]
  }

  /**
   * DocumentData findFirstOrThrow
   */
  export type DocumentDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * Filter, which DocumentData to fetch.
     */
    where?: DocumentDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentData to fetch.
     */
    orderBy?: DocumentDataOrderByWithRelationInput | DocumentDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentData.
     */
    cursor?: DocumentDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentData.
     */
    distinct?: DocumentDataScalarFieldEnum | DocumentDataScalarFieldEnum[]
  }

  /**
   * DocumentData findMany
   */
  export type DocumentDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * Filter, which DocumentData to fetch.
     */
    where?: DocumentDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentData to fetch.
     */
    orderBy?: DocumentDataOrderByWithRelationInput | DocumentDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DocumentData.
     */
    cursor?: DocumentDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentData.
     */
    skip?: number
    distinct?: DocumentDataScalarFieldEnum | DocumentDataScalarFieldEnum[]
  }

  /**
   * DocumentData create
   */
  export type DocumentDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * The data needed to create a DocumentData.
     */
    data: XOR<DocumentDataCreateInput, DocumentDataUncheckedCreateInput>
  }

  /**
   * DocumentData createMany
   */
  export type DocumentDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DocumentData.
     */
    data: DocumentDataCreateManyInput | DocumentDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DocumentData createManyAndReturn
   */
  export type DocumentDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * The data used to create many DocumentData.
     */
    data: DocumentDataCreateManyInput | DocumentDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DocumentData update
   */
  export type DocumentDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * The data needed to update a DocumentData.
     */
    data: XOR<DocumentDataUpdateInput, DocumentDataUncheckedUpdateInput>
    /**
     * Choose, which DocumentData to update.
     */
    where: DocumentDataWhereUniqueInput
  }

  /**
   * DocumentData updateMany
   */
  export type DocumentDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DocumentData.
     */
    data: XOR<DocumentDataUpdateManyMutationInput, DocumentDataUncheckedUpdateManyInput>
    /**
     * Filter which DocumentData to update
     */
    where?: DocumentDataWhereInput
    /**
     * Limit how many DocumentData to update.
     */
    limit?: number
  }

  /**
   * DocumentData updateManyAndReturn
   */
  export type DocumentDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * The data used to update DocumentData.
     */
    data: XOR<DocumentDataUpdateManyMutationInput, DocumentDataUncheckedUpdateManyInput>
    /**
     * Filter which DocumentData to update
     */
    where?: DocumentDataWhereInput
    /**
     * Limit how many DocumentData to update.
     */
    limit?: number
  }

  /**
   * DocumentData upsert
   */
  export type DocumentDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * The filter to search for the DocumentData to update in case it exists.
     */
    where: DocumentDataWhereUniqueInput
    /**
     * In case the DocumentData found by the `where` argument doesn't exist, create a new DocumentData with this data.
     */
    create: XOR<DocumentDataCreateInput, DocumentDataUncheckedCreateInput>
    /**
     * In case the DocumentData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentDataUpdateInput, DocumentDataUncheckedUpdateInput>
  }

  /**
   * DocumentData delete
   */
  export type DocumentDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
    /**
     * Filter which DocumentData to delete.
     */
    where: DocumentDataWhereUniqueInput
  }

  /**
   * DocumentData deleteMany
   */
  export type DocumentDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentData to delete
     */
    where?: DocumentDataWhereInput
    /**
     * Limit how many DocumentData to delete.
     */
    limit?: number
  }

  /**
   * DocumentData without action
   */
  export type DocumentDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentData
     */
    select?: DocumentDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentData
     */
    omit?: DocumentDataOmit<ExtArgs> | null
  }


  /**
   * Model OrderProduct
   */

  export type AggregateOrderProduct = {
    _count: OrderProductCountAggregateOutputType | null
    _avg: OrderProductAvgAggregateOutputType | null
    _sum: OrderProductSumAggregateOutputType | null
    _min: OrderProductMinAggregateOutputType | null
    _max: OrderProductMaxAggregateOutputType | null
  }

  export type OrderProductAvgAggregateOutputType = {
    id: number | null
    netPrice: Decimal | null
  }

  export type OrderProductSumAggregateOutputType = {
    id: bigint | null
    netPrice: Decimal | null
  }

  export type OrderProductMinAggregateOutputType = {
    id: bigint | null
    orderId: string | null
    productName: string | null
    netPrice: Decimal | null
    channel: string | null
    statusWfm: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderProductMaxAggregateOutputType = {
    id: bigint | null
    orderId: string | null
    productName: string | null
    netPrice: Decimal | null
    channel: string | null
    statusWfm: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderProductCountAggregateOutputType = {
    id: number
    orderId: number
    productName: number
    netPrice: number
    channel: number
    statusWfm: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderProductAvgAggregateInputType = {
    id?: true
    netPrice?: true
  }

  export type OrderProductSumAggregateInputType = {
    id?: true
    netPrice?: true
  }

  export type OrderProductMinAggregateInputType = {
    id?: true
    orderId?: true
    productName?: true
    netPrice?: true
    channel?: true
    statusWfm?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderProductMaxAggregateInputType = {
    id?: true
    orderId?: true
    productName?: true
    netPrice?: true
    channel?: true
    statusWfm?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderProductCountAggregateInputType = {
    id?: true
    orderId?: true
    productName?: true
    netPrice?: true
    channel?: true
    statusWfm?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderProduct to aggregate.
     */
    where?: OrderProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderProducts to fetch.
     */
    orderBy?: OrderProductOrderByWithRelationInput | OrderProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderProducts
    **/
    _count?: true | OrderProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderProductMaxAggregateInputType
  }

  export type GetOrderProductAggregateType<T extends OrderProductAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderProduct[P]>
      : GetScalarType<T[P], AggregateOrderProduct[P]>
  }




  export type OrderProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderProductWhereInput
    orderBy?: OrderProductOrderByWithAggregationInput | OrderProductOrderByWithAggregationInput[]
    by: OrderProductScalarFieldEnum[] | OrderProductScalarFieldEnum
    having?: OrderProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderProductCountAggregateInputType | true
    _avg?: OrderProductAvgAggregateInputType
    _sum?: OrderProductSumAggregateInputType
    _min?: OrderProductMinAggregateInputType
    _max?: OrderProductMaxAggregateInputType
  }

  export type OrderProductGroupByOutputType = {
    id: bigint
    orderId: string
    productName: string | null
    netPrice: Decimal
    channel: string | null
    statusWfm: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrderProductCountAggregateOutputType | null
    _avg: OrderProductAvgAggregateOutputType | null
    _sum: OrderProductSumAggregateOutputType | null
    _min: OrderProductMinAggregateOutputType | null
    _max: OrderProductMaxAggregateOutputType | null
  }

  type GetOrderProductGroupByPayload<T extends OrderProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderProductGroupByOutputType[P]>
            : GetScalarType<T[P], OrderProductGroupByOutputType[P]>
        }
      >
    >


  export type OrderProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    productName?: boolean
    netPrice?: boolean
    channel?: boolean
    statusWfm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["orderProduct"]>

  export type OrderProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    productName?: boolean
    netPrice?: boolean
    channel?: boolean
    statusWfm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["orderProduct"]>

  export type OrderProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    productName?: boolean
    netPrice?: boolean
    channel?: boolean
    statusWfm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["orderProduct"]>

  export type OrderProductSelectScalar = {
    id?: boolean
    orderId?: boolean
    productName?: boolean
    netPrice?: boolean
    channel?: boolean
    statusWfm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "productName" | "netPrice" | "channel" | "statusWfm" | "createdAt" | "updatedAt", ExtArgs["result"]["orderProduct"]>

  export type $OrderProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderProduct"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      orderId: string
      productName: string | null
      netPrice: Prisma.Decimal
      channel: string | null
      statusWfm: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["orderProduct"]>
    composites: {}
  }

  type OrderProductGetPayload<S extends boolean | null | undefined | OrderProductDefaultArgs> = $Result.GetResult<Prisma.$OrderProductPayload, S>

  type OrderProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderProductCountAggregateInputType | true
    }

  export interface OrderProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderProduct'], meta: { name: 'OrderProduct' } }
    /**
     * Find zero or one OrderProduct that matches the filter.
     * @param {OrderProductFindUniqueArgs} args - Arguments to find a OrderProduct
     * @example
     * // Get one OrderProduct
     * const orderProduct = await prisma.orderProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderProductFindUniqueArgs>(args: SelectSubset<T, OrderProductFindUniqueArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderProduct that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderProductFindUniqueOrThrowArgs} args - Arguments to find a OrderProduct
     * @example
     * // Get one OrderProduct
     * const orderProduct = await prisma.orderProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderProductFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderProductFindFirstArgs} args - Arguments to find a OrderProduct
     * @example
     * // Get one OrderProduct
     * const orderProduct = await prisma.orderProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderProductFindFirstArgs>(args?: SelectSubset<T, OrderProductFindFirstArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderProductFindFirstOrThrowArgs} args - Arguments to find a OrderProduct
     * @example
     * // Get one OrderProduct
     * const orderProduct = await prisma.orderProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderProductFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderProducts
     * const orderProducts = await prisma.orderProduct.findMany()
     * 
     * // Get first 10 OrderProducts
     * const orderProducts = await prisma.orderProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderProductWithIdOnly = await prisma.orderProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderProductFindManyArgs>(args?: SelectSubset<T, OrderProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderProduct.
     * @param {OrderProductCreateArgs} args - Arguments to create a OrderProduct.
     * @example
     * // Create one OrderProduct
     * const OrderProduct = await prisma.orderProduct.create({
     *   data: {
     *     // ... data to create a OrderProduct
     *   }
     * })
     * 
     */
    create<T extends OrderProductCreateArgs>(args: SelectSubset<T, OrderProductCreateArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderProducts.
     * @param {OrderProductCreateManyArgs} args - Arguments to create many OrderProducts.
     * @example
     * // Create many OrderProducts
     * const orderProduct = await prisma.orderProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderProductCreateManyArgs>(args?: SelectSubset<T, OrderProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderProducts and returns the data saved in the database.
     * @param {OrderProductCreateManyAndReturnArgs} args - Arguments to create many OrderProducts.
     * @example
     * // Create many OrderProducts
     * const orderProduct = await prisma.orderProduct.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderProducts and only return the `id`
     * const orderProductWithIdOnly = await prisma.orderProduct.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderProductCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrderProduct.
     * @param {OrderProductDeleteArgs} args - Arguments to delete one OrderProduct.
     * @example
     * // Delete one OrderProduct
     * const OrderProduct = await prisma.orderProduct.delete({
     *   where: {
     *     // ... filter to delete one OrderProduct
     *   }
     * })
     * 
     */
    delete<T extends OrderProductDeleteArgs>(args: SelectSubset<T, OrderProductDeleteArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderProduct.
     * @param {OrderProductUpdateArgs} args - Arguments to update one OrderProduct.
     * @example
     * // Update one OrderProduct
     * const orderProduct = await prisma.orderProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderProductUpdateArgs>(args: SelectSubset<T, OrderProductUpdateArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderProducts.
     * @param {OrderProductDeleteManyArgs} args - Arguments to filter OrderProducts to delete.
     * @example
     * // Delete a few OrderProducts
     * const { count } = await prisma.orderProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderProductDeleteManyArgs>(args?: SelectSubset<T, OrderProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderProducts
     * const orderProduct = await prisma.orderProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderProductUpdateManyArgs>(args: SelectSubset<T, OrderProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderProducts and returns the data updated in the database.
     * @param {OrderProductUpdateManyAndReturnArgs} args - Arguments to update many OrderProducts.
     * @example
     * // Update many OrderProducts
     * const orderProduct = await prisma.orderProduct.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrderProducts and only return the `id`
     * const orderProductWithIdOnly = await prisma.orderProduct.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderProductUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrderProduct.
     * @param {OrderProductUpsertArgs} args - Arguments to update or create a OrderProduct.
     * @example
     * // Update or create a OrderProduct
     * const orderProduct = await prisma.orderProduct.upsert({
     *   create: {
     *     // ... data to create a OrderProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderProduct we want to update
     *   }
     * })
     */
    upsert<T extends OrderProductUpsertArgs>(args: SelectSubset<T, OrderProductUpsertArgs<ExtArgs>>): Prisma__OrderProductClient<$Result.GetResult<Prisma.$OrderProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderProductCountArgs} args - Arguments to filter OrderProducts to count.
     * @example
     * // Count the number of OrderProducts
     * const count = await prisma.orderProduct.count({
     *   where: {
     *     // ... the filter for the OrderProducts we want to count
     *   }
     * })
    **/
    count<T extends OrderProductCountArgs>(
      args?: Subset<T, OrderProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderProductAggregateArgs>(args: Subset<T, OrderProductAggregateArgs>): Prisma.PrismaPromise<GetOrderProductAggregateType<T>>

    /**
     * Group by OrderProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderProductGroupByArgs['orderBy'] }
        : { orderBy?: OrderProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderProduct model
   */
  readonly fields: OrderProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderProduct model
   */
  interface OrderProductFieldRefs {
    readonly id: FieldRef<"OrderProduct", 'BigInt'>
    readonly orderId: FieldRef<"OrderProduct", 'String'>
    readonly productName: FieldRef<"OrderProduct", 'String'>
    readonly netPrice: FieldRef<"OrderProduct", 'Decimal'>
    readonly channel: FieldRef<"OrderProduct", 'String'>
    readonly statusWfm: FieldRef<"OrderProduct", 'String'>
    readonly createdAt: FieldRef<"OrderProduct", 'DateTime'>
    readonly updatedAt: FieldRef<"OrderProduct", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrderProduct findUnique
   */
  export type OrderProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * Filter, which OrderProduct to fetch.
     */
    where: OrderProductWhereUniqueInput
  }

  /**
   * OrderProduct findUniqueOrThrow
   */
  export type OrderProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * Filter, which OrderProduct to fetch.
     */
    where: OrderProductWhereUniqueInput
  }

  /**
   * OrderProduct findFirst
   */
  export type OrderProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * Filter, which OrderProduct to fetch.
     */
    where?: OrderProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderProducts to fetch.
     */
    orderBy?: OrderProductOrderByWithRelationInput | OrderProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderProducts.
     */
    cursor?: OrderProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderProducts.
     */
    distinct?: OrderProductScalarFieldEnum | OrderProductScalarFieldEnum[]
  }

  /**
   * OrderProduct findFirstOrThrow
   */
  export type OrderProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * Filter, which OrderProduct to fetch.
     */
    where?: OrderProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderProducts to fetch.
     */
    orderBy?: OrderProductOrderByWithRelationInput | OrderProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderProducts.
     */
    cursor?: OrderProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderProducts.
     */
    distinct?: OrderProductScalarFieldEnum | OrderProductScalarFieldEnum[]
  }

  /**
   * OrderProduct findMany
   */
  export type OrderProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * Filter, which OrderProducts to fetch.
     */
    where?: OrderProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderProducts to fetch.
     */
    orderBy?: OrderProductOrderByWithRelationInput | OrderProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderProducts.
     */
    cursor?: OrderProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderProducts.
     */
    skip?: number
    distinct?: OrderProductScalarFieldEnum | OrderProductScalarFieldEnum[]
  }

  /**
   * OrderProduct create
   */
  export type OrderProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * The data needed to create a OrderProduct.
     */
    data: XOR<OrderProductCreateInput, OrderProductUncheckedCreateInput>
  }

  /**
   * OrderProduct createMany
   */
  export type OrderProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderProducts.
     */
    data: OrderProductCreateManyInput | OrderProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderProduct createManyAndReturn
   */
  export type OrderProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * The data used to create many OrderProducts.
     */
    data: OrderProductCreateManyInput | OrderProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderProduct update
   */
  export type OrderProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * The data needed to update a OrderProduct.
     */
    data: XOR<OrderProductUpdateInput, OrderProductUncheckedUpdateInput>
    /**
     * Choose, which OrderProduct to update.
     */
    where: OrderProductWhereUniqueInput
  }

  /**
   * OrderProduct updateMany
   */
  export type OrderProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderProducts.
     */
    data: XOR<OrderProductUpdateManyMutationInput, OrderProductUncheckedUpdateManyInput>
    /**
     * Filter which OrderProducts to update
     */
    where?: OrderProductWhereInput
    /**
     * Limit how many OrderProducts to update.
     */
    limit?: number
  }

  /**
   * OrderProduct updateManyAndReturn
   */
  export type OrderProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * The data used to update OrderProducts.
     */
    data: XOR<OrderProductUpdateManyMutationInput, OrderProductUncheckedUpdateManyInput>
    /**
     * Filter which OrderProducts to update
     */
    where?: OrderProductWhereInput
    /**
     * Limit how many OrderProducts to update.
     */
    limit?: number
  }

  /**
   * OrderProduct upsert
   */
  export type OrderProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * The filter to search for the OrderProduct to update in case it exists.
     */
    where: OrderProductWhereUniqueInput
    /**
     * In case the OrderProduct found by the `where` argument doesn't exist, create a new OrderProduct with this data.
     */
    create: XOR<OrderProductCreateInput, OrderProductUncheckedCreateInput>
    /**
     * In case the OrderProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderProductUpdateInput, OrderProductUncheckedUpdateInput>
  }

  /**
   * OrderProduct delete
   */
  export type OrderProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
    /**
     * Filter which OrderProduct to delete.
     */
    where: OrderProductWhereUniqueInput
  }

  /**
   * OrderProduct deleteMany
   */
  export type OrderProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderProducts to delete
     */
    where?: OrderProductWhereInput
    /**
     * Limit how many OrderProducts to delete.
     */
    limit?: number
  }

  /**
   * OrderProduct without action
   */
  export type OrderProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderProduct
     */
    select?: OrderProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderProduct
     */
    omit?: OrderProductOmit<ExtArgs> | null
  }


  /**
   * Model Target
   */

  export type AggregateTarget = {
    _count: TargetCountAggregateOutputType | null
    _avg: TargetAvgAggregateOutputType | null
    _sum: TargetSumAggregateOutputType | null
    _min: TargetMinAggregateOutputType | null
    _max: TargetMaxAggregateOutputType | null
  }

  export type TargetAvgAggregateOutputType = {
    id: number | null
    targetValue: Decimal | null
  }

  export type TargetSumAggregateOutputType = {
    id: bigint | null
    targetValue: Decimal | null
  }

  export type TargetMinAggregateOutputType = {
    id: bigint | null
    segment: string | null
    namaWitel: string | null
    metricType: string | null
    productName: string | null
    targetValue: Decimal | null
    period: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TargetMaxAggregateOutputType = {
    id: bigint | null
    segment: string | null
    namaWitel: string | null
    metricType: string | null
    productName: string | null
    targetValue: Decimal | null
    period: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TargetCountAggregateOutputType = {
    id: number
    segment: number
    namaWitel: number
    metricType: number
    productName: number
    targetValue: number
    period: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TargetAvgAggregateInputType = {
    id?: true
    targetValue?: true
  }

  export type TargetSumAggregateInputType = {
    id?: true
    targetValue?: true
  }

  export type TargetMinAggregateInputType = {
    id?: true
    segment?: true
    namaWitel?: true
    metricType?: true
    productName?: true
    targetValue?: true
    period?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TargetMaxAggregateInputType = {
    id?: true
    segment?: true
    namaWitel?: true
    metricType?: true
    productName?: true
    targetValue?: true
    period?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TargetCountAggregateInputType = {
    id?: true
    segment?: true
    namaWitel?: true
    metricType?: true
    productName?: true
    targetValue?: true
    period?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TargetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Target to aggregate.
     */
    where?: TargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Targets to fetch.
     */
    orderBy?: TargetOrderByWithRelationInput | TargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Targets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Targets
    **/
    _count?: true | TargetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TargetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TargetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TargetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TargetMaxAggregateInputType
  }

  export type GetTargetAggregateType<T extends TargetAggregateArgs> = {
        [P in keyof T & keyof AggregateTarget]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTarget[P]>
      : GetScalarType<T[P], AggregateTarget[P]>
  }




  export type TargetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TargetWhereInput
    orderBy?: TargetOrderByWithAggregationInput | TargetOrderByWithAggregationInput[]
    by: TargetScalarFieldEnum[] | TargetScalarFieldEnum
    having?: TargetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TargetCountAggregateInputType | true
    _avg?: TargetAvgAggregateInputType
    _sum?: TargetSumAggregateInputType
    _min?: TargetMinAggregateInputType
    _max?: TargetMaxAggregateInputType
  }

  export type TargetGroupByOutputType = {
    id: bigint
    segment: string
    namaWitel: string
    metricType: string
    productName: string
    targetValue: Decimal
    period: Date
    createdAt: Date
    updatedAt: Date
    _count: TargetCountAggregateOutputType | null
    _avg: TargetAvgAggregateOutputType | null
    _sum: TargetSumAggregateOutputType | null
    _min: TargetMinAggregateOutputType | null
    _max: TargetMaxAggregateOutputType | null
  }

  type GetTargetGroupByPayload<T extends TargetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TargetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TargetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TargetGroupByOutputType[P]>
            : GetScalarType<T[P], TargetGroupByOutputType[P]>
        }
      >
    >


  export type TargetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    segment?: boolean
    namaWitel?: boolean
    metricType?: boolean
    productName?: boolean
    targetValue?: boolean
    period?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["target"]>

  export type TargetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    segment?: boolean
    namaWitel?: boolean
    metricType?: boolean
    productName?: boolean
    targetValue?: boolean
    period?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["target"]>

  export type TargetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    segment?: boolean
    namaWitel?: boolean
    metricType?: boolean
    productName?: boolean
    targetValue?: boolean
    period?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["target"]>

  export type TargetSelectScalar = {
    id?: boolean
    segment?: boolean
    namaWitel?: boolean
    metricType?: boolean
    productName?: boolean
    targetValue?: boolean
    period?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TargetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "segment" | "namaWitel" | "metricType" | "productName" | "targetValue" | "period" | "createdAt" | "updatedAt", ExtArgs["result"]["target"]>

  export type $TargetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Target"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      segment: string
      namaWitel: string
      metricType: string
      productName: string
      targetValue: Prisma.Decimal
      period: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["target"]>
    composites: {}
  }

  type TargetGetPayload<S extends boolean | null | undefined | TargetDefaultArgs> = $Result.GetResult<Prisma.$TargetPayload, S>

  type TargetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TargetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TargetCountAggregateInputType | true
    }

  export interface TargetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Target'], meta: { name: 'Target' } }
    /**
     * Find zero or one Target that matches the filter.
     * @param {TargetFindUniqueArgs} args - Arguments to find a Target
     * @example
     * // Get one Target
     * const target = await prisma.target.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TargetFindUniqueArgs>(args: SelectSubset<T, TargetFindUniqueArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Target that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TargetFindUniqueOrThrowArgs} args - Arguments to find a Target
     * @example
     * // Get one Target
     * const target = await prisma.target.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TargetFindUniqueOrThrowArgs>(args: SelectSubset<T, TargetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Target that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TargetFindFirstArgs} args - Arguments to find a Target
     * @example
     * // Get one Target
     * const target = await prisma.target.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TargetFindFirstArgs>(args?: SelectSubset<T, TargetFindFirstArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Target that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TargetFindFirstOrThrowArgs} args - Arguments to find a Target
     * @example
     * // Get one Target
     * const target = await prisma.target.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TargetFindFirstOrThrowArgs>(args?: SelectSubset<T, TargetFindFirstOrThrowArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Targets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TargetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Targets
     * const targets = await prisma.target.findMany()
     * 
     * // Get first 10 Targets
     * const targets = await prisma.target.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const targetWithIdOnly = await prisma.target.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TargetFindManyArgs>(args?: SelectSubset<T, TargetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Target.
     * @param {TargetCreateArgs} args - Arguments to create a Target.
     * @example
     * // Create one Target
     * const Target = await prisma.target.create({
     *   data: {
     *     // ... data to create a Target
     *   }
     * })
     * 
     */
    create<T extends TargetCreateArgs>(args: SelectSubset<T, TargetCreateArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Targets.
     * @param {TargetCreateManyArgs} args - Arguments to create many Targets.
     * @example
     * // Create many Targets
     * const target = await prisma.target.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TargetCreateManyArgs>(args?: SelectSubset<T, TargetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Targets and returns the data saved in the database.
     * @param {TargetCreateManyAndReturnArgs} args - Arguments to create many Targets.
     * @example
     * // Create many Targets
     * const target = await prisma.target.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Targets and only return the `id`
     * const targetWithIdOnly = await prisma.target.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TargetCreateManyAndReturnArgs>(args?: SelectSubset<T, TargetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Target.
     * @param {TargetDeleteArgs} args - Arguments to delete one Target.
     * @example
     * // Delete one Target
     * const Target = await prisma.target.delete({
     *   where: {
     *     // ... filter to delete one Target
     *   }
     * })
     * 
     */
    delete<T extends TargetDeleteArgs>(args: SelectSubset<T, TargetDeleteArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Target.
     * @param {TargetUpdateArgs} args - Arguments to update one Target.
     * @example
     * // Update one Target
     * const target = await prisma.target.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TargetUpdateArgs>(args: SelectSubset<T, TargetUpdateArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Targets.
     * @param {TargetDeleteManyArgs} args - Arguments to filter Targets to delete.
     * @example
     * // Delete a few Targets
     * const { count } = await prisma.target.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TargetDeleteManyArgs>(args?: SelectSubset<T, TargetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Targets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TargetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Targets
     * const target = await prisma.target.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TargetUpdateManyArgs>(args: SelectSubset<T, TargetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Targets and returns the data updated in the database.
     * @param {TargetUpdateManyAndReturnArgs} args - Arguments to update many Targets.
     * @example
     * // Update many Targets
     * const target = await prisma.target.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Targets and only return the `id`
     * const targetWithIdOnly = await prisma.target.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TargetUpdateManyAndReturnArgs>(args: SelectSubset<T, TargetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Target.
     * @param {TargetUpsertArgs} args - Arguments to update or create a Target.
     * @example
     * // Update or create a Target
     * const target = await prisma.target.upsert({
     *   create: {
     *     // ... data to create a Target
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Target we want to update
     *   }
     * })
     */
    upsert<T extends TargetUpsertArgs>(args: SelectSubset<T, TargetUpsertArgs<ExtArgs>>): Prisma__TargetClient<$Result.GetResult<Prisma.$TargetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Targets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TargetCountArgs} args - Arguments to filter Targets to count.
     * @example
     * // Count the number of Targets
     * const count = await prisma.target.count({
     *   where: {
     *     // ... the filter for the Targets we want to count
     *   }
     * })
    **/
    count<T extends TargetCountArgs>(
      args?: Subset<T, TargetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TargetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Target.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TargetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TargetAggregateArgs>(args: Subset<T, TargetAggregateArgs>): Prisma.PrismaPromise<GetTargetAggregateType<T>>

    /**
     * Group by Target.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TargetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TargetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TargetGroupByArgs['orderBy'] }
        : { orderBy?: TargetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TargetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTargetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Target model
   */
  readonly fields: TargetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Target.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TargetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Target model
   */
  interface TargetFieldRefs {
    readonly id: FieldRef<"Target", 'BigInt'>
    readonly segment: FieldRef<"Target", 'String'>
    readonly namaWitel: FieldRef<"Target", 'String'>
    readonly metricType: FieldRef<"Target", 'String'>
    readonly productName: FieldRef<"Target", 'String'>
    readonly targetValue: FieldRef<"Target", 'Decimal'>
    readonly period: FieldRef<"Target", 'DateTime'>
    readonly createdAt: FieldRef<"Target", 'DateTime'>
    readonly updatedAt: FieldRef<"Target", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Target findUnique
   */
  export type TargetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * Filter, which Target to fetch.
     */
    where: TargetWhereUniqueInput
  }

  /**
   * Target findUniqueOrThrow
   */
  export type TargetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * Filter, which Target to fetch.
     */
    where: TargetWhereUniqueInput
  }

  /**
   * Target findFirst
   */
  export type TargetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * Filter, which Target to fetch.
     */
    where?: TargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Targets to fetch.
     */
    orderBy?: TargetOrderByWithRelationInput | TargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Targets.
     */
    cursor?: TargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Targets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Targets.
     */
    distinct?: TargetScalarFieldEnum | TargetScalarFieldEnum[]
  }

  /**
   * Target findFirstOrThrow
   */
  export type TargetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * Filter, which Target to fetch.
     */
    where?: TargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Targets to fetch.
     */
    orderBy?: TargetOrderByWithRelationInput | TargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Targets.
     */
    cursor?: TargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Targets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Targets.
     */
    distinct?: TargetScalarFieldEnum | TargetScalarFieldEnum[]
  }

  /**
   * Target findMany
   */
  export type TargetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * Filter, which Targets to fetch.
     */
    where?: TargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Targets to fetch.
     */
    orderBy?: TargetOrderByWithRelationInput | TargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Targets.
     */
    cursor?: TargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Targets.
     */
    skip?: number
    distinct?: TargetScalarFieldEnum | TargetScalarFieldEnum[]
  }

  /**
   * Target create
   */
  export type TargetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * The data needed to create a Target.
     */
    data: XOR<TargetCreateInput, TargetUncheckedCreateInput>
  }

  /**
   * Target createMany
   */
  export type TargetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Targets.
     */
    data: TargetCreateManyInput | TargetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Target createManyAndReturn
   */
  export type TargetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * The data used to create many Targets.
     */
    data: TargetCreateManyInput | TargetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Target update
   */
  export type TargetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * The data needed to update a Target.
     */
    data: XOR<TargetUpdateInput, TargetUncheckedUpdateInput>
    /**
     * Choose, which Target to update.
     */
    where: TargetWhereUniqueInput
  }

  /**
   * Target updateMany
   */
  export type TargetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Targets.
     */
    data: XOR<TargetUpdateManyMutationInput, TargetUncheckedUpdateManyInput>
    /**
     * Filter which Targets to update
     */
    where?: TargetWhereInput
    /**
     * Limit how many Targets to update.
     */
    limit?: number
  }

  /**
   * Target updateManyAndReturn
   */
  export type TargetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * The data used to update Targets.
     */
    data: XOR<TargetUpdateManyMutationInput, TargetUncheckedUpdateManyInput>
    /**
     * Filter which Targets to update
     */
    where?: TargetWhereInput
    /**
     * Limit how many Targets to update.
     */
    limit?: number
  }

  /**
   * Target upsert
   */
  export type TargetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * The filter to search for the Target to update in case it exists.
     */
    where: TargetWhereUniqueInput
    /**
     * In case the Target found by the `where` argument doesn't exist, create a new Target with this data.
     */
    create: XOR<TargetCreateInput, TargetUncheckedCreateInput>
    /**
     * In case the Target was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TargetUpdateInput, TargetUncheckedUpdateInput>
  }

  /**
   * Target delete
   */
  export type TargetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
    /**
     * Filter which Target to delete.
     */
    where: TargetWhereUniqueInput
  }

  /**
   * Target deleteMany
   */
  export type TargetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Targets to delete
     */
    where?: TargetWhereInput
    /**
     * Limit how many Targets to delete.
     */
    limit?: number
  }

  /**
   * Target without action
   */
  export type TargetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Target
     */
    select?: TargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Target
     */
    omit?: TargetOmit<ExtArgs> | null
  }


  /**
   * Model CustomTarget
   */

  export type AggregateCustomTarget = {
    _count: CustomTargetCountAggregateOutputType | null
    _avg: CustomTargetAvgAggregateOutputType | null
    _sum: CustomTargetSumAggregateOutputType | null
    _min: CustomTargetMinAggregateOutputType | null
    _max: CustomTargetMaxAggregateOutputType | null
  }

  export type CustomTargetAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    value: Decimal | null
  }

  export type CustomTargetSumAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    value: Decimal | null
  }

  export type CustomTargetMinAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    pageName: string | null
    targetKey: string | null
    witel: string | null
    period: Date | null
    value: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomTargetMaxAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    pageName: string | null
    targetKey: string | null
    witel: string | null
    period: Date | null
    value: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomTargetCountAggregateOutputType = {
    id: number
    userId: number
    pageName: number
    targetKey: number
    witel: number
    period: number
    value: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomTargetAvgAggregateInputType = {
    id?: true
    userId?: true
    value?: true
  }

  export type CustomTargetSumAggregateInputType = {
    id?: true
    userId?: true
    value?: true
  }

  export type CustomTargetMinAggregateInputType = {
    id?: true
    userId?: true
    pageName?: true
    targetKey?: true
    witel?: true
    period?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomTargetMaxAggregateInputType = {
    id?: true
    userId?: true
    pageName?: true
    targetKey?: true
    witel?: true
    period?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomTargetCountAggregateInputType = {
    id?: true
    userId?: true
    pageName?: true
    targetKey?: true
    witel?: true
    period?: true
    value?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomTargetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomTarget to aggregate.
     */
    where?: CustomTargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomTargets to fetch.
     */
    orderBy?: CustomTargetOrderByWithRelationInput | CustomTargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomTargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomTargets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomTargets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomTargets
    **/
    _count?: true | CustomTargetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomTargetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomTargetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomTargetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomTargetMaxAggregateInputType
  }

  export type GetCustomTargetAggregateType<T extends CustomTargetAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomTarget]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomTarget[P]>
      : GetScalarType<T[P], AggregateCustomTarget[P]>
  }




  export type CustomTargetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomTargetWhereInput
    orderBy?: CustomTargetOrderByWithAggregationInput | CustomTargetOrderByWithAggregationInput[]
    by: CustomTargetScalarFieldEnum[] | CustomTargetScalarFieldEnum
    having?: CustomTargetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomTargetCountAggregateInputType | true
    _avg?: CustomTargetAvgAggregateInputType
    _sum?: CustomTargetSumAggregateInputType
    _min?: CustomTargetMinAggregateInputType
    _max?: CustomTargetMaxAggregateInputType
  }

  export type CustomTargetGroupByOutputType = {
    id: bigint
    userId: bigint
    pageName: string
    targetKey: string
    witel: string
    period: Date
    value: Decimal
    createdAt: Date
    updatedAt: Date
    _count: CustomTargetCountAggregateOutputType | null
    _avg: CustomTargetAvgAggregateOutputType | null
    _sum: CustomTargetSumAggregateOutputType | null
    _min: CustomTargetMinAggregateOutputType | null
    _max: CustomTargetMaxAggregateOutputType | null
  }

  type GetCustomTargetGroupByPayload<T extends CustomTargetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomTargetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomTargetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomTargetGroupByOutputType[P]>
            : GetScalarType<T[P], CustomTargetGroupByOutputType[P]>
        }
      >
    >


  export type CustomTargetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pageName?: boolean
    targetKey?: boolean
    witel?: boolean
    period?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customTarget"]>

  export type CustomTargetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pageName?: boolean
    targetKey?: boolean
    witel?: boolean
    period?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customTarget"]>

  export type CustomTargetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pageName?: boolean
    targetKey?: boolean
    witel?: boolean
    period?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customTarget"]>

  export type CustomTargetSelectScalar = {
    id?: boolean
    userId?: boolean
    pageName?: boolean
    targetKey?: boolean
    witel?: boolean
    period?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomTargetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "pageName" | "targetKey" | "witel" | "period" | "value" | "createdAt" | "updatedAt", ExtArgs["result"]["customTarget"]>
  export type CustomTargetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CustomTargetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CustomTargetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CustomTargetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomTarget"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      userId: bigint
      pageName: string
      targetKey: string
      witel: string
      period: Date
      value: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customTarget"]>
    composites: {}
  }

  type CustomTargetGetPayload<S extends boolean | null | undefined | CustomTargetDefaultArgs> = $Result.GetResult<Prisma.$CustomTargetPayload, S>

  type CustomTargetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomTargetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomTargetCountAggregateInputType | true
    }

  export interface CustomTargetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomTarget'], meta: { name: 'CustomTarget' } }
    /**
     * Find zero or one CustomTarget that matches the filter.
     * @param {CustomTargetFindUniqueArgs} args - Arguments to find a CustomTarget
     * @example
     * // Get one CustomTarget
     * const customTarget = await prisma.customTarget.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomTargetFindUniqueArgs>(args: SelectSubset<T, CustomTargetFindUniqueArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomTarget that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomTargetFindUniqueOrThrowArgs} args - Arguments to find a CustomTarget
     * @example
     * // Get one CustomTarget
     * const customTarget = await prisma.customTarget.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomTargetFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomTargetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomTarget that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomTargetFindFirstArgs} args - Arguments to find a CustomTarget
     * @example
     * // Get one CustomTarget
     * const customTarget = await prisma.customTarget.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomTargetFindFirstArgs>(args?: SelectSubset<T, CustomTargetFindFirstArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomTarget that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomTargetFindFirstOrThrowArgs} args - Arguments to find a CustomTarget
     * @example
     * // Get one CustomTarget
     * const customTarget = await prisma.customTarget.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomTargetFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomTargetFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomTargets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomTargetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomTargets
     * const customTargets = await prisma.customTarget.findMany()
     * 
     * // Get first 10 CustomTargets
     * const customTargets = await prisma.customTarget.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customTargetWithIdOnly = await prisma.customTarget.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomTargetFindManyArgs>(args?: SelectSubset<T, CustomTargetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomTarget.
     * @param {CustomTargetCreateArgs} args - Arguments to create a CustomTarget.
     * @example
     * // Create one CustomTarget
     * const CustomTarget = await prisma.customTarget.create({
     *   data: {
     *     // ... data to create a CustomTarget
     *   }
     * })
     * 
     */
    create<T extends CustomTargetCreateArgs>(args: SelectSubset<T, CustomTargetCreateArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomTargets.
     * @param {CustomTargetCreateManyArgs} args - Arguments to create many CustomTargets.
     * @example
     * // Create many CustomTargets
     * const customTarget = await prisma.customTarget.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomTargetCreateManyArgs>(args?: SelectSubset<T, CustomTargetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomTargets and returns the data saved in the database.
     * @param {CustomTargetCreateManyAndReturnArgs} args - Arguments to create many CustomTargets.
     * @example
     * // Create many CustomTargets
     * const customTarget = await prisma.customTarget.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomTargets and only return the `id`
     * const customTargetWithIdOnly = await prisma.customTarget.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomTargetCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomTargetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CustomTarget.
     * @param {CustomTargetDeleteArgs} args - Arguments to delete one CustomTarget.
     * @example
     * // Delete one CustomTarget
     * const CustomTarget = await prisma.customTarget.delete({
     *   where: {
     *     // ... filter to delete one CustomTarget
     *   }
     * })
     * 
     */
    delete<T extends CustomTargetDeleteArgs>(args: SelectSubset<T, CustomTargetDeleteArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomTarget.
     * @param {CustomTargetUpdateArgs} args - Arguments to update one CustomTarget.
     * @example
     * // Update one CustomTarget
     * const customTarget = await prisma.customTarget.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomTargetUpdateArgs>(args: SelectSubset<T, CustomTargetUpdateArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomTargets.
     * @param {CustomTargetDeleteManyArgs} args - Arguments to filter CustomTargets to delete.
     * @example
     * // Delete a few CustomTargets
     * const { count } = await prisma.customTarget.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomTargetDeleteManyArgs>(args?: SelectSubset<T, CustomTargetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomTargets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomTargetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomTargets
     * const customTarget = await prisma.customTarget.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomTargetUpdateManyArgs>(args: SelectSubset<T, CustomTargetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomTargets and returns the data updated in the database.
     * @param {CustomTargetUpdateManyAndReturnArgs} args - Arguments to update many CustomTargets.
     * @example
     * // Update many CustomTargets
     * const customTarget = await prisma.customTarget.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CustomTargets and only return the `id`
     * const customTargetWithIdOnly = await prisma.customTarget.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CustomTargetUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomTargetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CustomTarget.
     * @param {CustomTargetUpsertArgs} args - Arguments to update or create a CustomTarget.
     * @example
     * // Update or create a CustomTarget
     * const customTarget = await prisma.customTarget.upsert({
     *   create: {
     *     // ... data to create a CustomTarget
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomTarget we want to update
     *   }
     * })
     */
    upsert<T extends CustomTargetUpsertArgs>(args: SelectSubset<T, CustomTargetUpsertArgs<ExtArgs>>): Prisma__CustomTargetClient<$Result.GetResult<Prisma.$CustomTargetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomTargets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomTargetCountArgs} args - Arguments to filter CustomTargets to count.
     * @example
     * // Count the number of CustomTargets
     * const count = await prisma.customTarget.count({
     *   where: {
     *     // ... the filter for the CustomTargets we want to count
     *   }
     * })
    **/
    count<T extends CustomTargetCountArgs>(
      args?: Subset<T, CustomTargetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomTargetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomTarget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomTargetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomTargetAggregateArgs>(args: Subset<T, CustomTargetAggregateArgs>): Prisma.PrismaPromise<GetCustomTargetAggregateType<T>>

    /**
     * Group by CustomTarget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomTargetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomTargetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomTargetGroupByArgs['orderBy'] }
        : { orderBy?: CustomTargetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomTargetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomTargetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomTarget model
   */
  readonly fields: CustomTargetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomTarget.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomTargetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CustomTarget model
   */
  interface CustomTargetFieldRefs {
    readonly id: FieldRef<"CustomTarget", 'BigInt'>
    readonly userId: FieldRef<"CustomTarget", 'BigInt'>
    readonly pageName: FieldRef<"CustomTarget", 'String'>
    readonly targetKey: FieldRef<"CustomTarget", 'String'>
    readonly witel: FieldRef<"CustomTarget", 'String'>
    readonly period: FieldRef<"CustomTarget", 'DateTime'>
    readonly value: FieldRef<"CustomTarget", 'Decimal'>
    readonly createdAt: FieldRef<"CustomTarget", 'DateTime'>
    readonly updatedAt: FieldRef<"CustomTarget", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomTarget findUnique
   */
  export type CustomTargetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * Filter, which CustomTarget to fetch.
     */
    where: CustomTargetWhereUniqueInput
  }

  /**
   * CustomTarget findUniqueOrThrow
   */
  export type CustomTargetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * Filter, which CustomTarget to fetch.
     */
    where: CustomTargetWhereUniqueInput
  }

  /**
   * CustomTarget findFirst
   */
  export type CustomTargetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * Filter, which CustomTarget to fetch.
     */
    where?: CustomTargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomTargets to fetch.
     */
    orderBy?: CustomTargetOrderByWithRelationInput | CustomTargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomTargets.
     */
    cursor?: CustomTargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomTargets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomTargets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomTargets.
     */
    distinct?: CustomTargetScalarFieldEnum | CustomTargetScalarFieldEnum[]
  }

  /**
   * CustomTarget findFirstOrThrow
   */
  export type CustomTargetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * Filter, which CustomTarget to fetch.
     */
    where?: CustomTargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomTargets to fetch.
     */
    orderBy?: CustomTargetOrderByWithRelationInput | CustomTargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomTargets.
     */
    cursor?: CustomTargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomTargets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomTargets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomTargets.
     */
    distinct?: CustomTargetScalarFieldEnum | CustomTargetScalarFieldEnum[]
  }

  /**
   * CustomTarget findMany
   */
  export type CustomTargetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * Filter, which CustomTargets to fetch.
     */
    where?: CustomTargetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomTargets to fetch.
     */
    orderBy?: CustomTargetOrderByWithRelationInput | CustomTargetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomTargets.
     */
    cursor?: CustomTargetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomTargets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomTargets.
     */
    skip?: number
    distinct?: CustomTargetScalarFieldEnum | CustomTargetScalarFieldEnum[]
  }

  /**
   * CustomTarget create
   */
  export type CustomTargetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomTarget.
     */
    data: XOR<CustomTargetCreateInput, CustomTargetUncheckedCreateInput>
  }

  /**
   * CustomTarget createMany
   */
  export type CustomTargetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomTargets.
     */
    data: CustomTargetCreateManyInput | CustomTargetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomTarget createManyAndReturn
   */
  export type CustomTargetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * The data used to create many CustomTargets.
     */
    data: CustomTargetCreateManyInput | CustomTargetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomTarget update
   */
  export type CustomTargetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomTarget.
     */
    data: XOR<CustomTargetUpdateInput, CustomTargetUncheckedUpdateInput>
    /**
     * Choose, which CustomTarget to update.
     */
    where: CustomTargetWhereUniqueInput
  }

  /**
   * CustomTarget updateMany
   */
  export type CustomTargetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomTargets.
     */
    data: XOR<CustomTargetUpdateManyMutationInput, CustomTargetUncheckedUpdateManyInput>
    /**
     * Filter which CustomTargets to update
     */
    where?: CustomTargetWhereInput
    /**
     * Limit how many CustomTargets to update.
     */
    limit?: number
  }

  /**
   * CustomTarget updateManyAndReturn
   */
  export type CustomTargetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * The data used to update CustomTargets.
     */
    data: XOR<CustomTargetUpdateManyMutationInput, CustomTargetUncheckedUpdateManyInput>
    /**
     * Filter which CustomTargets to update
     */
    where?: CustomTargetWhereInput
    /**
     * Limit how many CustomTargets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomTarget upsert
   */
  export type CustomTargetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomTarget to update in case it exists.
     */
    where: CustomTargetWhereUniqueInput
    /**
     * In case the CustomTarget found by the `where` argument doesn't exist, create a new CustomTarget with this data.
     */
    create: XOR<CustomTargetCreateInput, CustomTargetUncheckedCreateInput>
    /**
     * In case the CustomTarget was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomTargetUpdateInput, CustomTargetUncheckedUpdateInput>
  }

  /**
   * CustomTarget delete
   */
  export type CustomTargetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
    /**
     * Filter which CustomTarget to delete.
     */
    where: CustomTargetWhereUniqueInput
  }

  /**
   * CustomTarget deleteMany
   */
  export type CustomTargetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomTargets to delete
     */
    where?: CustomTargetWhereInput
    /**
     * Limit how many CustomTargets to delete.
     */
    limit?: number
  }

  /**
   * CustomTarget without action
   */
  export type CustomTargetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomTarget
     */
    select?: CustomTargetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomTarget
     */
    omit?: CustomTargetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomTargetInclude<ExtArgs> | null
  }


  /**
   * Model UserTableConfiguration
   */

  export type AggregateUserTableConfiguration = {
    _count: UserTableConfigurationCountAggregateOutputType | null
    _avg: UserTableConfigurationAvgAggregateOutputType | null
    _sum: UserTableConfigurationSumAggregateOutputType | null
    _min: UserTableConfigurationMinAggregateOutputType | null
    _max: UserTableConfigurationMaxAggregateOutputType | null
  }

  export type UserTableConfigurationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type UserTableConfigurationSumAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
  }

  export type UserTableConfigurationMinAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    pageName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserTableConfigurationMaxAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    pageName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserTableConfigurationCountAggregateOutputType = {
    id: number
    userId: number
    pageName: number
    configuration: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserTableConfigurationAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UserTableConfigurationSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UserTableConfigurationMinAggregateInputType = {
    id?: true
    userId?: true
    pageName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserTableConfigurationMaxAggregateInputType = {
    id?: true
    userId?: true
    pageName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserTableConfigurationCountAggregateInputType = {
    id?: true
    userId?: true
    pageName?: true
    configuration?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserTableConfigurationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserTableConfiguration to aggregate.
     */
    where?: UserTableConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTableConfigurations to fetch.
     */
    orderBy?: UserTableConfigurationOrderByWithRelationInput | UserTableConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserTableConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTableConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTableConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserTableConfigurations
    **/
    _count?: true | UserTableConfigurationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserTableConfigurationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserTableConfigurationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserTableConfigurationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserTableConfigurationMaxAggregateInputType
  }

  export type GetUserTableConfigurationAggregateType<T extends UserTableConfigurationAggregateArgs> = {
        [P in keyof T & keyof AggregateUserTableConfiguration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserTableConfiguration[P]>
      : GetScalarType<T[P], AggregateUserTableConfiguration[P]>
  }




  export type UserTableConfigurationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserTableConfigurationWhereInput
    orderBy?: UserTableConfigurationOrderByWithAggregationInput | UserTableConfigurationOrderByWithAggregationInput[]
    by: UserTableConfigurationScalarFieldEnum[] | UserTableConfigurationScalarFieldEnum
    having?: UserTableConfigurationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserTableConfigurationCountAggregateInputType | true
    _avg?: UserTableConfigurationAvgAggregateInputType
    _sum?: UserTableConfigurationSumAggregateInputType
    _min?: UserTableConfigurationMinAggregateInputType
    _max?: UserTableConfigurationMaxAggregateInputType
  }

  export type UserTableConfigurationGroupByOutputType = {
    id: bigint
    userId: bigint | null
    pageName: string
    configuration: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: UserTableConfigurationCountAggregateOutputType | null
    _avg: UserTableConfigurationAvgAggregateOutputType | null
    _sum: UserTableConfigurationSumAggregateOutputType | null
    _min: UserTableConfigurationMinAggregateOutputType | null
    _max: UserTableConfigurationMaxAggregateOutputType | null
  }

  type GetUserTableConfigurationGroupByPayload<T extends UserTableConfigurationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserTableConfigurationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserTableConfigurationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserTableConfigurationGroupByOutputType[P]>
            : GetScalarType<T[P], UserTableConfigurationGroupByOutputType[P]>
        }
      >
    >


  export type UserTableConfigurationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pageName?: boolean
    configuration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserTableConfiguration$userArgs<ExtArgs>
  }, ExtArgs["result"]["userTableConfiguration"]>

  export type UserTableConfigurationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pageName?: boolean
    configuration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserTableConfiguration$userArgs<ExtArgs>
  }, ExtArgs["result"]["userTableConfiguration"]>

  export type UserTableConfigurationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pageName?: boolean
    configuration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserTableConfiguration$userArgs<ExtArgs>
  }, ExtArgs["result"]["userTableConfiguration"]>

  export type UserTableConfigurationSelectScalar = {
    id?: boolean
    userId?: boolean
    pageName?: boolean
    configuration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserTableConfigurationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "pageName" | "configuration" | "createdAt" | "updatedAt", ExtArgs["result"]["userTableConfiguration"]>
  export type UserTableConfigurationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserTableConfiguration$userArgs<ExtArgs>
  }
  export type UserTableConfigurationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserTableConfiguration$userArgs<ExtArgs>
  }
  export type UserTableConfigurationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserTableConfiguration$userArgs<ExtArgs>
  }

  export type $UserTableConfigurationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserTableConfiguration"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      userId: bigint | null
      pageName: string
      configuration: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userTableConfiguration"]>
    composites: {}
  }

  type UserTableConfigurationGetPayload<S extends boolean | null | undefined | UserTableConfigurationDefaultArgs> = $Result.GetResult<Prisma.$UserTableConfigurationPayload, S>

  type UserTableConfigurationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserTableConfigurationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserTableConfigurationCountAggregateInputType | true
    }

  export interface UserTableConfigurationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserTableConfiguration'], meta: { name: 'UserTableConfiguration' } }
    /**
     * Find zero or one UserTableConfiguration that matches the filter.
     * @param {UserTableConfigurationFindUniqueArgs} args - Arguments to find a UserTableConfiguration
     * @example
     * // Get one UserTableConfiguration
     * const userTableConfiguration = await prisma.userTableConfiguration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserTableConfigurationFindUniqueArgs>(args: SelectSubset<T, UserTableConfigurationFindUniqueArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserTableConfiguration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserTableConfigurationFindUniqueOrThrowArgs} args - Arguments to find a UserTableConfiguration
     * @example
     * // Get one UserTableConfiguration
     * const userTableConfiguration = await prisma.userTableConfiguration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserTableConfigurationFindUniqueOrThrowArgs>(args: SelectSubset<T, UserTableConfigurationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserTableConfiguration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTableConfigurationFindFirstArgs} args - Arguments to find a UserTableConfiguration
     * @example
     * // Get one UserTableConfiguration
     * const userTableConfiguration = await prisma.userTableConfiguration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserTableConfigurationFindFirstArgs>(args?: SelectSubset<T, UserTableConfigurationFindFirstArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserTableConfiguration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTableConfigurationFindFirstOrThrowArgs} args - Arguments to find a UserTableConfiguration
     * @example
     * // Get one UserTableConfiguration
     * const userTableConfiguration = await prisma.userTableConfiguration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserTableConfigurationFindFirstOrThrowArgs>(args?: SelectSubset<T, UserTableConfigurationFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserTableConfigurations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTableConfigurationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserTableConfigurations
     * const userTableConfigurations = await prisma.userTableConfiguration.findMany()
     * 
     * // Get first 10 UserTableConfigurations
     * const userTableConfigurations = await prisma.userTableConfiguration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userTableConfigurationWithIdOnly = await prisma.userTableConfiguration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserTableConfigurationFindManyArgs>(args?: SelectSubset<T, UserTableConfigurationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserTableConfiguration.
     * @param {UserTableConfigurationCreateArgs} args - Arguments to create a UserTableConfiguration.
     * @example
     * // Create one UserTableConfiguration
     * const UserTableConfiguration = await prisma.userTableConfiguration.create({
     *   data: {
     *     // ... data to create a UserTableConfiguration
     *   }
     * })
     * 
     */
    create<T extends UserTableConfigurationCreateArgs>(args: SelectSubset<T, UserTableConfigurationCreateArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserTableConfigurations.
     * @param {UserTableConfigurationCreateManyArgs} args - Arguments to create many UserTableConfigurations.
     * @example
     * // Create many UserTableConfigurations
     * const userTableConfiguration = await prisma.userTableConfiguration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserTableConfigurationCreateManyArgs>(args?: SelectSubset<T, UserTableConfigurationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserTableConfigurations and returns the data saved in the database.
     * @param {UserTableConfigurationCreateManyAndReturnArgs} args - Arguments to create many UserTableConfigurations.
     * @example
     * // Create many UserTableConfigurations
     * const userTableConfiguration = await prisma.userTableConfiguration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserTableConfigurations and only return the `id`
     * const userTableConfigurationWithIdOnly = await prisma.userTableConfiguration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserTableConfigurationCreateManyAndReturnArgs>(args?: SelectSubset<T, UserTableConfigurationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserTableConfiguration.
     * @param {UserTableConfigurationDeleteArgs} args - Arguments to delete one UserTableConfiguration.
     * @example
     * // Delete one UserTableConfiguration
     * const UserTableConfiguration = await prisma.userTableConfiguration.delete({
     *   where: {
     *     // ... filter to delete one UserTableConfiguration
     *   }
     * })
     * 
     */
    delete<T extends UserTableConfigurationDeleteArgs>(args: SelectSubset<T, UserTableConfigurationDeleteArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserTableConfiguration.
     * @param {UserTableConfigurationUpdateArgs} args - Arguments to update one UserTableConfiguration.
     * @example
     * // Update one UserTableConfiguration
     * const userTableConfiguration = await prisma.userTableConfiguration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserTableConfigurationUpdateArgs>(args: SelectSubset<T, UserTableConfigurationUpdateArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserTableConfigurations.
     * @param {UserTableConfigurationDeleteManyArgs} args - Arguments to filter UserTableConfigurations to delete.
     * @example
     * // Delete a few UserTableConfigurations
     * const { count } = await prisma.userTableConfiguration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserTableConfigurationDeleteManyArgs>(args?: SelectSubset<T, UserTableConfigurationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserTableConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTableConfigurationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserTableConfigurations
     * const userTableConfiguration = await prisma.userTableConfiguration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserTableConfigurationUpdateManyArgs>(args: SelectSubset<T, UserTableConfigurationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserTableConfigurations and returns the data updated in the database.
     * @param {UserTableConfigurationUpdateManyAndReturnArgs} args - Arguments to update many UserTableConfigurations.
     * @example
     * // Update many UserTableConfigurations
     * const userTableConfiguration = await prisma.userTableConfiguration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserTableConfigurations and only return the `id`
     * const userTableConfigurationWithIdOnly = await prisma.userTableConfiguration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserTableConfigurationUpdateManyAndReturnArgs>(args: SelectSubset<T, UserTableConfigurationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserTableConfiguration.
     * @param {UserTableConfigurationUpsertArgs} args - Arguments to update or create a UserTableConfiguration.
     * @example
     * // Update or create a UserTableConfiguration
     * const userTableConfiguration = await prisma.userTableConfiguration.upsert({
     *   create: {
     *     // ... data to create a UserTableConfiguration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserTableConfiguration we want to update
     *   }
     * })
     */
    upsert<T extends UserTableConfigurationUpsertArgs>(args: SelectSubset<T, UserTableConfigurationUpsertArgs<ExtArgs>>): Prisma__UserTableConfigurationClient<$Result.GetResult<Prisma.$UserTableConfigurationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserTableConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTableConfigurationCountArgs} args - Arguments to filter UserTableConfigurations to count.
     * @example
     * // Count the number of UserTableConfigurations
     * const count = await prisma.userTableConfiguration.count({
     *   where: {
     *     // ... the filter for the UserTableConfigurations we want to count
     *   }
     * })
    **/
    count<T extends UserTableConfigurationCountArgs>(
      args?: Subset<T, UserTableConfigurationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserTableConfigurationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserTableConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTableConfigurationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserTableConfigurationAggregateArgs>(args: Subset<T, UserTableConfigurationAggregateArgs>): Prisma.PrismaPromise<GetUserTableConfigurationAggregateType<T>>

    /**
     * Group by UserTableConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTableConfigurationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserTableConfigurationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserTableConfigurationGroupByArgs['orderBy'] }
        : { orderBy?: UserTableConfigurationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserTableConfigurationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserTableConfigurationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserTableConfiguration model
   */
  readonly fields: UserTableConfigurationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserTableConfiguration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserTableConfigurationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserTableConfiguration$userArgs<ExtArgs> = {}>(args?: Subset<T, UserTableConfiguration$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserTableConfiguration model
   */
  interface UserTableConfigurationFieldRefs {
    readonly id: FieldRef<"UserTableConfiguration", 'BigInt'>
    readonly userId: FieldRef<"UserTableConfiguration", 'BigInt'>
    readonly pageName: FieldRef<"UserTableConfiguration", 'String'>
    readonly configuration: FieldRef<"UserTableConfiguration", 'Json'>
    readonly createdAt: FieldRef<"UserTableConfiguration", 'DateTime'>
    readonly updatedAt: FieldRef<"UserTableConfiguration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserTableConfiguration findUnique
   */
  export type UserTableConfigurationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which UserTableConfiguration to fetch.
     */
    where: UserTableConfigurationWhereUniqueInput
  }

  /**
   * UserTableConfiguration findUniqueOrThrow
   */
  export type UserTableConfigurationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which UserTableConfiguration to fetch.
     */
    where: UserTableConfigurationWhereUniqueInput
  }

  /**
   * UserTableConfiguration findFirst
   */
  export type UserTableConfigurationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which UserTableConfiguration to fetch.
     */
    where?: UserTableConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTableConfigurations to fetch.
     */
    orderBy?: UserTableConfigurationOrderByWithRelationInput | UserTableConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserTableConfigurations.
     */
    cursor?: UserTableConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTableConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTableConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserTableConfigurations.
     */
    distinct?: UserTableConfigurationScalarFieldEnum | UserTableConfigurationScalarFieldEnum[]
  }

  /**
   * UserTableConfiguration findFirstOrThrow
   */
  export type UserTableConfigurationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which UserTableConfiguration to fetch.
     */
    where?: UserTableConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTableConfigurations to fetch.
     */
    orderBy?: UserTableConfigurationOrderByWithRelationInput | UserTableConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserTableConfigurations.
     */
    cursor?: UserTableConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTableConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTableConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserTableConfigurations.
     */
    distinct?: UserTableConfigurationScalarFieldEnum | UserTableConfigurationScalarFieldEnum[]
  }

  /**
   * UserTableConfiguration findMany
   */
  export type UserTableConfigurationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which UserTableConfigurations to fetch.
     */
    where?: UserTableConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTableConfigurations to fetch.
     */
    orderBy?: UserTableConfigurationOrderByWithRelationInput | UserTableConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserTableConfigurations.
     */
    cursor?: UserTableConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTableConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTableConfigurations.
     */
    skip?: number
    distinct?: UserTableConfigurationScalarFieldEnum | UserTableConfigurationScalarFieldEnum[]
  }

  /**
   * UserTableConfiguration create
   */
  export type UserTableConfigurationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * The data needed to create a UserTableConfiguration.
     */
    data: XOR<UserTableConfigurationCreateInput, UserTableConfigurationUncheckedCreateInput>
  }

  /**
   * UserTableConfiguration createMany
   */
  export type UserTableConfigurationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserTableConfigurations.
     */
    data: UserTableConfigurationCreateManyInput | UserTableConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserTableConfiguration createManyAndReturn
   */
  export type UserTableConfigurationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * The data used to create many UserTableConfigurations.
     */
    data: UserTableConfigurationCreateManyInput | UserTableConfigurationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserTableConfiguration update
   */
  export type UserTableConfigurationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * The data needed to update a UserTableConfiguration.
     */
    data: XOR<UserTableConfigurationUpdateInput, UserTableConfigurationUncheckedUpdateInput>
    /**
     * Choose, which UserTableConfiguration to update.
     */
    where: UserTableConfigurationWhereUniqueInput
  }

  /**
   * UserTableConfiguration updateMany
   */
  export type UserTableConfigurationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserTableConfigurations.
     */
    data: XOR<UserTableConfigurationUpdateManyMutationInput, UserTableConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which UserTableConfigurations to update
     */
    where?: UserTableConfigurationWhereInput
    /**
     * Limit how many UserTableConfigurations to update.
     */
    limit?: number
  }

  /**
   * UserTableConfiguration updateManyAndReturn
   */
  export type UserTableConfigurationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * The data used to update UserTableConfigurations.
     */
    data: XOR<UserTableConfigurationUpdateManyMutationInput, UserTableConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which UserTableConfigurations to update
     */
    where?: UserTableConfigurationWhereInput
    /**
     * Limit how many UserTableConfigurations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserTableConfiguration upsert
   */
  export type UserTableConfigurationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * The filter to search for the UserTableConfiguration to update in case it exists.
     */
    where: UserTableConfigurationWhereUniqueInput
    /**
     * In case the UserTableConfiguration found by the `where` argument doesn't exist, create a new UserTableConfiguration with this data.
     */
    create: XOR<UserTableConfigurationCreateInput, UserTableConfigurationUncheckedCreateInput>
    /**
     * In case the UserTableConfiguration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserTableConfigurationUpdateInput, UserTableConfigurationUncheckedUpdateInput>
  }

  /**
   * UserTableConfiguration delete
   */
  export type UserTableConfigurationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
    /**
     * Filter which UserTableConfiguration to delete.
     */
    where: UserTableConfigurationWhereUniqueInput
  }

  /**
   * UserTableConfiguration deleteMany
   */
  export type UserTableConfigurationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserTableConfigurations to delete
     */
    where?: UserTableConfigurationWhereInput
    /**
     * Limit how many UserTableConfigurations to delete.
     */
    limit?: number
  }

  /**
   * UserTableConfiguration.user
   */
  export type UserTableConfiguration$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * UserTableConfiguration without action
   */
  export type UserTableConfigurationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTableConfiguration
     */
    select?: UserTableConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTableConfiguration
     */
    omit?: UserTableConfigurationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserTableConfigurationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DigitalProductScalarFieldEnum: {
    id: 'id',
    orderNumber: 'orderNumber',
    productName: 'productName',
    customerName: 'customerName',
    poName: 'poName',
    witel: 'witel',
    branch: 'branch',
    revenue: 'revenue',
    amount: 'amount',
    status: 'status',
    milestone: 'milestone',
    segment: 'segment',
    category: 'category',
    subType: 'subType',
    orderDate: 'orderDate',
    batchId: 'batchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DigitalProductScalarFieldEnum = (typeof DigitalProductScalarFieldEnum)[keyof typeof DigitalProductScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    currentRoleAs: 'currentRoleAs',
    emailVerifiedAt: 'emailVerifiedAt',
    rememberToken: 'rememberToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountOfficerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    displayWitel: 'displayWitel',
    filterWitelLama: 'filterWitelLama',
    specialFilterColumn: 'specialFilterColumn',
    specialFilterValue: 'specialFilterValue',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountOfficerScalarFieldEnum = (typeof AccountOfficerScalarFieldEnum)[keyof typeof AccountOfficerScalarFieldEnum]


  export const SosDataScalarFieldEnum: {
    id: 'id',
    nipnas: 'nipnas',
    standardName: 'standardName',
    orderId: 'orderId',
    orderSubtype: 'orderSubtype',
    orderDescription: 'orderDescription',
    segmen: 'segmen',
    subSegmen: 'subSegmen',
    custCity: 'custCity',
    custWitel: 'custWitel',
    servCity: 'servCity',
    serviceWitel: 'serviceWitel',
    billWitel: 'billWitel',
    liProductName: 'liProductName',
    liBilldate: 'liBilldate',
    liMilestone: 'liMilestone',
    kategori: 'kategori',
    liStatus: 'liStatus',
    liStatusDate: 'liStatusDate',
    isTermin: 'isTermin',
    biayaPasang: 'biayaPasang',
    hrgBulanan: 'hrgBulanan',
    revenue: 'revenue',
    orderCreatedDate: 'orderCreatedDate',
    agreeType: 'agreeType',
    agreeStartDate: 'agreeStartDate',
    agreeEndDate: 'agreeEndDate',
    lamaKontrakHari: 'lamaKontrakHari',
    amortisasi: 'amortisasi',
    actionCd: 'actionCd',
    kategoriUmur: 'kategoriUmur',
    umurOrder: 'umurOrder',
    billCity: 'billCity',
    poName: 'poName',
    tipeOrder: 'tipeOrder',
    segmenBaru: 'segmenBaru',
    scalling1: 'scalling1',
    scalling2: 'scalling2',
    tipeGrup: 'tipeGrup',
    witelBaru: 'witelBaru',
    kategoriBaru: 'kategoriBaru',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    batchId: 'batchId'
  };

  export type SosDataScalarFieldEnum = (typeof SosDataScalarFieldEnum)[keyof typeof SosDataScalarFieldEnum]


  export const HsiDataScalarFieldEnum: {
    id: 'id',
    nomor: 'nomor',
    orderId: 'orderId',
    regional: 'regional',
    witel: 'witel',
    regionalOld: 'regionalOld',
    witelOld: 'witelOld',
    datel: 'datel',
    sto: 'sto',
    unit: 'unit',
    jenisPsb: 'jenisPsb',
    typeTrans: 'typeTrans',
    typeLayanan: 'typeLayanan',
    statusResume: 'statusResume',
    provider: 'provider',
    orderDate: 'orderDate',
    lastUpdatedDate: 'lastUpdatedDate',
    ncli: 'ncli',
    pots: 'pots',
    speedy: 'speedy',
    customerName: 'customerName',
    locId: 'locId',
    wonum: 'wonum',
    flagDeposit: 'flagDeposit',
    contactHp: 'contactHp',
    insAddress: 'insAddress',
    gpsLongitude: 'gpsLongitude',
    gpsLatitude: 'gpsLatitude',
    kcontact: 'kcontact',
    channel: 'channel',
    statusInet: 'statusInet',
    statusOnu: 'statusOnu',
    upload: 'upload',
    download: 'download',
    lastProgram: 'lastProgram',
    statusVoice: 'statusVoice',
    clid: 'clid',
    lastStart: 'lastStart',
    tindakLanjut: 'tindakLanjut',
    isiComment: 'isiComment',
    userIdTl: 'userIdTl',
    tglComment: 'tglComment',
    tanggalManja: 'tanggalManja',
    kelompokKendala: 'kelompokKendala',
    kelompokStatus: 'kelompokStatus',
    hero: 'hero',
    addon: 'addon',
    tglPs: 'tglPs',
    statusMessage: 'statusMessage',
    packageName: 'packageName',
    groupPaket: 'groupPaket',
    reasonCancel: 'reasonCancel',
    keteranganCancel: 'keteranganCancel',
    tglManja: 'tglManja',
    detailManja: 'detailManja',
    suberrorcode: 'suberrorcode',
    engineermemo: 'engineermemo',
    tahun: 'tahun',
    bulan: 'bulan',
    tanggal: 'tanggal',
    ps1: 'ps1',
    cek: 'cek',
    hasil: 'hasil',
    telda: 'telda',
    dataProses: 'dataProses',
    noOrderRevoke: 'noOrderRevoke',
    datasPsRevoke: 'datasPsRevoke',
    untukPsPi: 'untukPsPi',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HsiDataScalarFieldEnum = (typeof HsiDataScalarFieldEnum)[keyof typeof HsiDataScalarFieldEnum]


  export const SpmkMomScalarFieldEnum: {
    id: 'id',
    bulan: 'bulan',
    tahun: 'tahun',
    region: 'region',
    witelLama: 'witelLama',
    witelBaru: 'witelBaru',
    idIHld: 'idIHld',
    noNdeSpmk: 'noNdeSpmk',
    uraianKegiatan: 'uraianKegiatan',
    segmen: 'segmen',
    poName: 'poName',
    tanggalGolive: 'tanggalGolive',
    konfirmasiPo: 'konfirmasiPo',
    tanggalCb: 'tanggalCb',
    jenisKegiatan: 'jenisKegiatan',
    revenuePlan: 'revenuePlan',
    statusProyek: 'statusProyek',
    goLive: 'goLive',
    keteranganToc: 'keteranganToc',
    perihalNdeSpmk: 'perihalNdeSpmk',
    mom: 'mom',
    baDrop: 'baDrop',
    populasiNonDrop: 'populasiNonDrop',
    tanggalMom: 'tanggalMom',
    usia: 'usia',
    rab: 'rab',
    totalPort: 'totalPort',
    templateDurasi: 'templateDurasi',
    toc: 'toc',
    umurPekerjaan: 'umurPekerjaan',
    kategoriUmurPekerjaan: 'kategoriUmurPekerjaan',
    statusTompsLastActivity: 'statusTompsLastActivity',
    statusTompsNew: 'statusTompsNew',
    statusIHld: 'statusIHld',
    namaOdpGoLive: 'namaOdpGoLive',
    bak: 'bak',
    keteranganPelimpahan: 'keteranganPelimpahan',
    mitraLokal: 'mitraLokal',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    batchId: 'batchId'
  };

  export type SpmkMomScalarFieldEnum = (typeof SpmkMomScalarFieldEnum)[keyof typeof SpmkMomScalarFieldEnum]


  export const DocumentDataScalarFieldEnum: {
    id: 'id',
    batchId: 'batchId',
    orderId: 'orderId',
    product: 'product',
    netPrice: 'netPrice',
    isTemplatePrice: 'isTemplatePrice',
    productsProcessed: 'productsProcessed',
    milestone: 'milestone',
    previousMilestone: 'previousMilestone',
    segment: 'segment',
    namaWitel: 'namaWitel',
    statusWfm: 'statusWfm',
    customerName: 'customerName',
    channel: 'channel',
    layanan: 'layanan',
    filterProduk: 'filterProduk',
    witelLama: 'witelLama',
    orderStatus: 'orderStatus',
    orderSubType: 'orderSubType',
    orderStatusN: 'orderStatusN',
    tahun: 'tahun',
    telda: 'telda',
    week: 'week',
    orderDate: 'orderDate',
    orderCreatedDate: 'orderCreatedDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentDataScalarFieldEnum = (typeof DocumentDataScalarFieldEnum)[keyof typeof DocumentDataScalarFieldEnum]


  export const OrderProductScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    productName: 'productName',
    netPrice: 'netPrice',
    channel: 'channel',
    statusWfm: 'statusWfm',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderProductScalarFieldEnum = (typeof OrderProductScalarFieldEnum)[keyof typeof OrderProductScalarFieldEnum]


  export const TargetScalarFieldEnum: {
    id: 'id',
    segment: 'segment',
    namaWitel: 'namaWitel',
    metricType: 'metricType',
    productName: 'productName',
    targetValue: 'targetValue',
    period: 'period',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TargetScalarFieldEnum = (typeof TargetScalarFieldEnum)[keyof typeof TargetScalarFieldEnum]


  export const CustomTargetScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    pageName: 'pageName',
    targetKey: 'targetKey',
    witel: 'witel',
    period: 'period',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomTargetScalarFieldEnum = (typeof CustomTargetScalarFieldEnum)[keyof typeof CustomTargetScalarFieldEnum]


  export const UserTableConfigurationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    pageName: 'pageName',
    configuration: 'configuration',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserTableConfigurationScalarFieldEnum = (typeof UserTableConfigurationScalarFieldEnum)[keyof typeof UserTableConfigurationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type DigitalProductWhereInput = {
    AND?: DigitalProductWhereInput | DigitalProductWhereInput[]
    OR?: DigitalProductWhereInput[]
    NOT?: DigitalProductWhereInput | DigitalProductWhereInput[]
    id?: BigIntFilter<"DigitalProduct"> | bigint | number
    orderNumber?: StringNullableFilter<"DigitalProduct"> | string | null
    productName?: StringNullableFilter<"DigitalProduct"> | string | null
    customerName?: StringNullableFilter<"DigitalProduct"> | string | null
    poName?: StringNullableFilter<"DigitalProduct"> | string | null
    witel?: StringNullableFilter<"DigitalProduct"> | string | null
    branch?: StringNullableFilter<"DigitalProduct"> | string | null
    revenue?: DecimalFilter<"DigitalProduct"> | Decimal | DecimalJsLike | number | string
    amount?: DecimalFilter<"DigitalProduct"> | Decimal | DecimalJsLike | number | string
    status?: StringNullableFilter<"DigitalProduct"> | string | null
    milestone?: StringNullableFilter<"DigitalProduct"> | string | null
    segment?: StringNullableFilter<"DigitalProduct"> | string | null
    category?: StringNullableFilter<"DigitalProduct"> | string | null
    subType?: StringNullableFilter<"DigitalProduct"> | string | null
    orderDate?: DateTimeNullableFilter<"DigitalProduct"> | Date | string | null
    batchId?: StringNullableFilter<"DigitalProduct"> | string | null
    createdAt?: DateTimeFilter<"DigitalProduct"> | Date | string
    updatedAt?: DateTimeFilter<"DigitalProduct"> | Date | string
  }

  export type DigitalProductOrderByWithRelationInput = {
    id?: SortOrder
    orderNumber?: SortOrderInput | SortOrder
    productName?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    poName?: SortOrderInput | SortOrder
    witel?: SortOrderInput | SortOrder
    branch?: SortOrderInput | SortOrder
    revenue?: SortOrder
    amount?: SortOrder
    status?: SortOrderInput | SortOrder
    milestone?: SortOrderInput | SortOrder
    segment?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    subType?: SortOrderInput | SortOrder
    orderDate?: SortOrderInput | SortOrder
    batchId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DigitalProductWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    orderNumber?: string
    AND?: DigitalProductWhereInput | DigitalProductWhereInput[]
    OR?: DigitalProductWhereInput[]
    NOT?: DigitalProductWhereInput | DigitalProductWhereInput[]
    productName?: StringNullableFilter<"DigitalProduct"> | string | null
    customerName?: StringNullableFilter<"DigitalProduct"> | string | null
    poName?: StringNullableFilter<"DigitalProduct"> | string | null
    witel?: StringNullableFilter<"DigitalProduct"> | string | null
    branch?: StringNullableFilter<"DigitalProduct"> | string | null
    revenue?: DecimalFilter<"DigitalProduct"> | Decimal | DecimalJsLike | number | string
    amount?: DecimalFilter<"DigitalProduct"> | Decimal | DecimalJsLike | number | string
    status?: StringNullableFilter<"DigitalProduct"> | string | null
    milestone?: StringNullableFilter<"DigitalProduct"> | string | null
    segment?: StringNullableFilter<"DigitalProduct"> | string | null
    category?: StringNullableFilter<"DigitalProduct"> | string | null
    subType?: StringNullableFilter<"DigitalProduct"> | string | null
    orderDate?: DateTimeNullableFilter<"DigitalProduct"> | Date | string | null
    batchId?: StringNullableFilter<"DigitalProduct"> | string | null
    createdAt?: DateTimeFilter<"DigitalProduct"> | Date | string
    updatedAt?: DateTimeFilter<"DigitalProduct"> | Date | string
  }, "id" | "orderNumber">

  export type DigitalProductOrderByWithAggregationInput = {
    id?: SortOrder
    orderNumber?: SortOrderInput | SortOrder
    productName?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    poName?: SortOrderInput | SortOrder
    witel?: SortOrderInput | SortOrder
    branch?: SortOrderInput | SortOrder
    revenue?: SortOrder
    amount?: SortOrder
    status?: SortOrderInput | SortOrder
    milestone?: SortOrderInput | SortOrder
    segment?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    subType?: SortOrderInput | SortOrder
    orderDate?: SortOrderInput | SortOrder
    batchId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DigitalProductCountOrderByAggregateInput
    _avg?: DigitalProductAvgOrderByAggregateInput
    _max?: DigitalProductMaxOrderByAggregateInput
    _min?: DigitalProductMinOrderByAggregateInput
    _sum?: DigitalProductSumOrderByAggregateInput
  }

  export type DigitalProductScalarWhereWithAggregatesInput = {
    AND?: DigitalProductScalarWhereWithAggregatesInput | DigitalProductScalarWhereWithAggregatesInput[]
    OR?: DigitalProductScalarWhereWithAggregatesInput[]
    NOT?: DigitalProductScalarWhereWithAggregatesInput | DigitalProductScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"DigitalProduct"> | bigint | number
    orderNumber?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    productName?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    customerName?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    poName?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    witel?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    branch?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    revenue?: DecimalWithAggregatesFilter<"DigitalProduct"> | Decimal | DecimalJsLike | number | string
    amount?: DecimalWithAggregatesFilter<"DigitalProduct"> | Decimal | DecimalJsLike | number | string
    status?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    milestone?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    segment?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    category?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    subType?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    orderDate?: DateTimeNullableWithAggregatesFilter<"DigitalProduct"> | Date | string | null
    batchId?: StringNullableWithAggregatesFilter<"DigitalProduct"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DigitalProduct"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DigitalProduct"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: BigIntFilter<"User"> | bigint | number
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    currentRoleAs?: StringNullableFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    rememberToken?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    customTargets?: CustomTargetListRelationFilter
    userTableConfigurations?: UserTableConfigurationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    currentRoleAs?: SortOrderInput | SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    rememberToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customTargets?: CustomTargetOrderByRelationAggregateInput
    userTableConfigurations?: UserTableConfigurationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    currentRoleAs?: StringNullableFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    rememberToken?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    customTargets?: CustomTargetListRelationFilter
    userTableConfigurations?: UserTableConfigurationListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    currentRoleAs?: SortOrderInput | SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    rememberToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"User"> | bigint | number
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    currentRoleAs?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    rememberToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountOfficerWhereInput = {
    AND?: AccountOfficerWhereInput | AccountOfficerWhereInput[]
    OR?: AccountOfficerWhereInput[]
    NOT?: AccountOfficerWhereInput | AccountOfficerWhereInput[]
    id?: BigIntFilter<"AccountOfficer"> | bigint | number
    name?: StringFilter<"AccountOfficer"> | string
    displayWitel?: StringFilter<"AccountOfficer"> | string
    filterWitelLama?: StringFilter<"AccountOfficer"> | string
    specialFilterColumn?: StringNullableFilter<"AccountOfficer"> | string | null
    specialFilterValue?: StringNullableFilter<"AccountOfficer"> | string | null
    createdAt?: DateTimeFilter<"AccountOfficer"> | Date | string
    updatedAt?: DateTimeFilter<"AccountOfficer"> | Date | string
  }

  export type AccountOfficerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    displayWitel?: SortOrder
    filterWitelLama?: SortOrder
    specialFilterColumn?: SortOrderInput | SortOrder
    specialFilterValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountOfficerWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: AccountOfficerWhereInput | AccountOfficerWhereInput[]
    OR?: AccountOfficerWhereInput[]
    NOT?: AccountOfficerWhereInput | AccountOfficerWhereInput[]
    name?: StringFilter<"AccountOfficer"> | string
    displayWitel?: StringFilter<"AccountOfficer"> | string
    filterWitelLama?: StringFilter<"AccountOfficer"> | string
    specialFilterColumn?: StringNullableFilter<"AccountOfficer"> | string | null
    specialFilterValue?: StringNullableFilter<"AccountOfficer"> | string | null
    createdAt?: DateTimeFilter<"AccountOfficer"> | Date | string
    updatedAt?: DateTimeFilter<"AccountOfficer"> | Date | string
  }, "id">

  export type AccountOfficerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    displayWitel?: SortOrder
    filterWitelLama?: SortOrder
    specialFilterColumn?: SortOrderInput | SortOrder
    specialFilterValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountOfficerCountOrderByAggregateInput
    _avg?: AccountOfficerAvgOrderByAggregateInput
    _max?: AccountOfficerMaxOrderByAggregateInput
    _min?: AccountOfficerMinOrderByAggregateInput
    _sum?: AccountOfficerSumOrderByAggregateInput
  }

  export type AccountOfficerScalarWhereWithAggregatesInput = {
    AND?: AccountOfficerScalarWhereWithAggregatesInput | AccountOfficerScalarWhereWithAggregatesInput[]
    OR?: AccountOfficerScalarWhereWithAggregatesInput[]
    NOT?: AccountOfficerScalarWhereWithAggregatesInput | AccountOfficerScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"AccountOfficer"> | bigint | number
    name?: StringWithAggregatesFilter<"AccountOfficer"> | string
    displayWitel?: StringWithAggregatesFilter<"AccountOfficer"> | string
    filterWitelLama?: StringWithAggregatesFilter<"AccountOfficer"> | string
    specialFilterColumn?: StringNullableWithAggregatesFilter<"AccountOfficer"> | string | null
    specialFilterValue?: StringNullableWithAggregatesFilter<"AccountOfficer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AccountOfficer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AccountOfficer"> | Date | string
  }

  export type SosDataWhereInput = {
    AND?: SosDataWhereInput | SosDataWhereInput[]
    OR?: SosDataWhereInput[]
    NOT?: SosDataWhereInput | SosDataWhereInput[]
    id?: BigIntFilter<"SosData"> | bigint | number
    nipnas?: StringNullableFilter<"SosData"> | string | null
    standardName?: StringNullableFilter<"SosData"> | string | null
    orderId?: StringFilter<"SosData"> | string
    orderSubtype?: StringNullableFilter<"SosData"> | string | null
    orderDescription?: StringNullableFilter<"SosData"> | string | null
    segmen?: StringNullableFilter<"SosData"> | string | null
    subSegmen?: StringNullableFilter<"SosData"> | string | null
    custCity?: StringNullableFilter<"SosData"> | string | null
    custWitel?: StringNullableFilter<"SosData"> | string | null
    servCity?: StringNullableFilter<"SosData"> | string | null
    serviceWitel?: StringNullableFilter<"SosData"> | string | null
    billWitel?: StringNullableFilter<"SosData"> | string | null
    liProductName?: StringNullableFilter<"SosData"> | string | null
    liBilldate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    liMilestone?: StringNullableFilter<"SosData"> | string | null
    kategori?: StringNullableFilter<"SosData"> | string | null
    liStatus?: StringNullableFilter<"SosData"> | string | null
    liStatusDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    isTermin?: StringNullableFilter<"SosData"> | string | null
    biayaPasang?: DecimalFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    hrgBulanan?: DecimalFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    revenue?: DecimalFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    orderCreatedDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    agreeType?: StringNullableFilter<"SosData"> | string | null
    agreeStartDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    agreeEndDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    lamaKontrakHari?: IntFilter<"SosData"> | number
    amortisasi?: StringNullableFilter<"SosData"> | string | null
    actionCd?: StringNullableFilter<"SosData"> | string | null
    kategoriUmur?: StringNullableFilter<"SosData"> | string | null
    umurOrder?: IntFilter<"SosData"> | number
    billCity?: StringNullableFilter<"SosData"> | string | null
    poName?: StringNullableFilter<"SosData"> | string | null
    tipeOrder?: StringNullableFilter<"SosData"> | string | null
    segmenBaru?: StringNullableFilter<"SosData"> | string | null
    scalling1?: StringNullableFilter<"SosData"> | string | null
    scalling2?: StringNullableFilter<"SosData"> | string | null
    tipeGrup?: StringNullableFilter<"SosData"> | string | null
    witelBaru?: StringNullableFilter<"SosData"> | string | null
    kategoriBaru?: StringNullableFilter<"SosData"> | string | null
    createdAt?: DateTimeFilter<"SosData"> | Date | string
    updatedAt?: DateTimeFilter<"SosData"> | Date | string
    batchId?: StringNullableFilter<"SosData"> | string | null
  }

  export type SosDataOrderByWithRelationInput = {
    id?: SortOrder
    nipnas?: SortOrderInput | SortOrder
    standardName?: SortOrderInput | SortOrder
    orderId?: SortOrder
    orderSubtype?: SortOrderInput | SortOrder
    orderDescription?: SortOrderInput | SortOrder
    segmen?: SortOrderInput | SortOrder
    subSegmen?: SortOrderInput | SortOrder
    custCity?: SortOrderInput | SortOrder
    custWitel?: SortOrderInput | SortOrder
    servCity?: SortOrderInput | SortOrder
    serviceWitel?: SortOrderInput | SortOrder
    billWitel?: SortOrderInput | SortOrder
    liProductName?: SortOrderInput | SortOrder
    liBilldate?: SortOrderInput | SortOrder
    liMilestone?: SortOrderInput | SortOrder
    kategori?: SortOrderInput | SortOrder
    liStatus?: SortOrderInput | SortOrder
    liStatusDate?: SortOrderInput | SortOrder
    isTermin?: SortOrderInput | SortOrder
    biayaPasang?: SortOrder
    hrgBulanan?: SortOrder
    revenue?: SortOrder
    orderCreatedDate?: SortOrderInput | SortOrder
    agreeType?: SortOrderInput | SortOrder
    agreeStartDate?: SortOrderInput | SortOrder
    agreeEndDate?: SortOrderInput | SortOrder
    lamaKontrakHari?: SortOrder
    amortisasi?: SortOrderInput | SortOrder
    actionCd?: SortOrderInput | SortOrder
    kategoriUmur?: SortOrderInput | SortOrder
    umurOrder?: SortOrder
    billCity?: SortOrderInput | SortOrder
    poName?: SortOrderInput | SortOrder
    tipeOrder?: SortOrderInput | SortOrder
    segmenBaru?: SortOrderInput | SortOrder
    scalling1?: SortOrderInput | SortOrder
    scalling2?: SortOrderInput | SortOrder
    tipeGrup?: SortOrderInput | SortOrder
    witelBaru?: SortOrderInput | SortOrder
    kategoriBaru?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrderInput | SortOrder
  }

  export type SosDataWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    orderId?: string
    AND?: SosDataWhereInput | SosDataWhereInput[]
    OR?: SosDataWhereInput[]
    NOT?: SosDataWhereInput | SosDataWhereInput[]
    nipnas?: StringNullableFilter<"SosData"> | string | null
    standardName?: StringNullableFilter<"SosData"> | string | null
    orderSubtype?: StringNullableFilter<"SosData"> | string | null
    orderDescription?: StringNullableFilter<"SosData"> | string | null
    segmen?: StringNullableFilter<"SosData"> | string | null
    subSegmen?: StringNullableFilter<"SosData"> | string | null
    custCity?: StringNullableFilter<"SosData"> | string | null
    custWitel?: StringNullableFilter<"SosData"> | string | null
    servCity?: StringNullableFilter<"SosData"> | string | null
    serviceWitel?: StringNullableFilter<"SosData"> | string | null
    billWitel?: StringNullableFilter<"SosData"> | string | null
    liProductName?: StringNullableFilter<"SosData"> | string | null
    liBilldate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    liMilestone?: StringNullableFilter<"SosData"> | string | null
    kategori?: StringNullableFilter<"SosData"> | string | null
    liStatus?: StringNullableFilter<"SosData"> | string | null
    liStatusDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    isTermin?: StringNullableFilter<"SosData"> | string | null
    biayaPasang?: DecimalFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    hrgBulanan?: DecimalFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    revenue?: DecimalFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    orderCreatedDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    agreeType?: StringNullableFilter<"SosData"> | string | null
    agreeStartDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    agreeEndDate?: DateTimeNullableFilter<"SosData"> | Date | string | null
    lamaKontrakHari?: IntFilter<"SosData"> | number
    amortisasi?: StringNullableFilter<"SosData"> | string | null
    actionCd?: StringNullableFilter<"SosData"> | string | null
    kategoriUmur?: StringNullableFilter<"SosData"> | string | null
    umurOrder?: IntFilter<"SosData"> | number
    billCity?: StringNullableFilter<"SosData"> | string | null
    poName?: StringNullableFilter<"SosData"> | string | null
    tipeOrder?: StringNullableFilter<"SosData"> | string | null
    segmenBaru?: StringNullableFilter<"SosData"> | string | null
    scalling1?: StringNullableFilter<"SosData"> | string | null
    scalling2?: StringNullableFilter<"SosData"> | string | null
    tipeGrup?: StringNullableFilter<"SosData"> | string | null
    witelBaru?: StringNullableFilter<"SosData"> | string | null
    kategoriBaru?: StringNullableFilter<"SosData"> | string | null
    createdAt?: DateTimeFilter<"SosData"> | Date | string
    updatedAt?: DateTimeFilter<"SosData"> | Date | string
    batchId?: StringNullableFilter<"SosData"> | string | null
  }, "id" | "orderId">

  export type SosDataOrderByWithAggregationInput = {
    id?: SortOrder
    nipnas?: SortOrderInput | SortOrder
    standardName?: SortOrderInput | SortOrder
    orderId?: SortOrder
    orderSubtype?: SortOrderInput | SortOrder
    orderDescription?: SortOrderInput | SortOrder
    segmen?: SortOrderInput | SortOrder
    subSegmen?: SortOrderInput | SortOrder
    custCity?: SortOrderInput | SortOrder
    custWitel?: SortOrderInput | SortOrder
    servCity?: SortOrderInput | SortOrder
    serviceWitel?: SortOrderInput | SortOrder
    billWitel?: SortOrderInput | SortOrder
    liProductName?: SortOrderInput | SortOrder
    liBilldate?: SortOrderInput | SortOrder
    liMilestone?: SortOrderInput | SortOrder
    kategori?: SortOrderInput | SortOrder
    liStatus?: SortOrderInput | SortOrder
    liStatusDate?: SortOrderInput | SortOrder
    isTermin?: SortOrderInput | SortOrder
    biayaPasang?: SortOrder
    hrgBulanan?: SortOrder
    revenue?: SortOrder
    orderCreatedDate?: SortOrderInput | SortOrder
    agreeType?: SortOrderInput | SortOrder
    agreeStartDate?: SortOrderInput | SortOrder
    agreeEndDate?: SortOrderInput | SortOrder
    lamaKontrakHari?: SortOrder
    amortisasi?: SortOrderInput | SortOrder
    actionCd?: SortOrderInput | SortOrder
    kategoriUmur?: SortOrderInput | SortOrder
    umurOrder?: SortOrder
    billCity?: SortOrderInput | SortOrder
    poName?: SortOrderInput | SortOrder
    tipeOrder?: SortOrderInput | SortOrder
    segmenBaru?: SortOrderInput | SortOrder
    scalling1?: SortOrderInput | SortOrder
    scalling2?: SortOrderInput | SortOrder
    tipeGrup?: SortOrderInput | SortOrder
    witelBaru?: SortOrderInput | SortOrder
    kategoriBaru?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrderInput | SortOrder
    _count?: SosDataCountOrderByAggregateInput
    _avg?: SosDataAvgOrderByAggregateInput
    _max?: SosDataMaxOrderByAggregateInput
    _min?: SosDataMinOrderByAggregateInput
    _sum?: SosDataSumOrderByAggregateInput
  }

  export type SosDataScalarWhereWithAggregatesInput = {
    AND?: SosDataScalarWhereWithAggregatesInput | SosDataScalarWhereWithAggregatesInput[]
    OR?: SosDataScalarWhereWithAggregatesInput[]
    NOT?: SosDataScalarWhereWithAggregatesInput | SosDataScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"SosData"> | bigint | number
    nipnas?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    standardName?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    orderId?: StringWithAggregatesFilter<"SosData"> | string
    orderSubtype?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    orderDescription?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    segmen?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    subSegmen?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    custCity?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    custWitel?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    servCity?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    serviceWitel?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    billWitel?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    liProductName?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    liBilldate?: DateTimeNullableWithAggregatesFilter<"SosData"> | Date | string | null
    liMilestone?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    kategori?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    liStatus?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    liStatusDate?: DateTimeNullableWithAggregatesFilter<"SosData"> | Date | string | null
    isTermin?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    biayaPasang?: DecimalWithAggregatesFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    hrgBulanan?: DecimalWithAggregatesFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    revenue?: DecimalWithAggregatesFilter<"SosData"> | Decimal | DecimalJsLike | number | string
    orderCreatedDate?: DateTimeNullableWithAggregatesFilter<"SosData"> | Date | string | null
    agreeType?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    agreeStartDate?: DateTimeNullableWithAggregatesFilter<"SosData"> | Date | string | null
    agreeEndDate?: DateTimeNullableWithAggregatesFilter<"SosData"> | Date | string | null
    lamaKontrakHari?: IntWithAggregatesFilter<"SosData"> | number
    amortisasi?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    actionCd?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    kategoriUmur?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    umurOrder?: IntWithAggregatesFilter<"SosData"> | number
    billCity?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    poName?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    tipeOrder?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    segmenBaru?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    scalling1?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    scalling2?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    tipeGrup?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    witelBaru?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    kategoriBaru?: StringNullableWithAggregatesFilter<"SosData"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SosData"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SosData"> | Date | string
    batchId?: StringNullableWithAggregatesFilter<"SosData"> | string | null
  }

  export type HsiDataWhereInput = {
    AND?: HsiDataWhereInput | HsiDataWhereInput[]
    OR?: HsiDataWhereInput[]
    NOT?: HsiDataWhereInput | HsiDataWhereInput[]
    id?: BigIntFilter<"HsiData"> | bigint | number
    nomor?: StringNullableFilter<"HsiData"> | string | null
    orderId?: StringNullableFilter<"HsiData"> | string | null
    regional?: StringNullableFilter<"HsiData"> | string | null
    witel?: StringNullableFilter<"HsiData"> | string | null
    regionalOld?: StringNullableFilter<"HsiData"> | string | null
    witelOld?: StringNullableFilter<"HsiData"> | string | null
    datel?: StringNullableFilter<"HsiData"> | string | null
    sto?: StringNullableFilter<"HsiData"> | string | null
    unit?: StringNullableFilter<"HsiData"> | string | null
    jenisPsb?: StringNullableFilter<"HsiData"> | string | null
    typeTrans?: StringNullableFilter<"HsiData"> | string | null
    typeLayanan?: StringNullableFilter<"HsiData"> | string | null
    statusResume?: StringNullableFilter<"HsiData"> | string | null
    provider?: StringNullableFilter<"HsiData"> | string | null
    orderDate?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    lastUpdatedDate?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    ncli?: StringNullableFilter<"HsiData"> | string | null
    pots?: StringNullableFilter<"HsiData"> | string | null
    speedy?: StringNullableFilter<"HsiData"> | string | null
    customerName?: StringNullableFilter<"HsiData"> | string | null
    locId?: StringNullableFilter<"HsiData"> | string | null
    wonum?: StringNullableFilter<"HsiData"> | string | null
    flagDeposit?: StringNullableFilter<"HsiData"> | string | null
    contactHp?: StringNullableFilter<"HsiData"> | string | null
    insAddress?: StringNullableFilter<"HsiData"> | string | null
    gpsLongitude?: StringNullableFilter<"HsiData"> | string | null
    gpsLatitude?: StringNullableFilter<"HsiData"> | string | null
    kcontact?: StringNullableFilter<"HsiData"> | string | null
    channel?: StringNullableFilter<"HsiData"> | string | null
    statusInet?: StringNullableFilter<"HsiData"> | string | null
    statusOnu?: StringNullableFilter<"HsiData"> | string | null
    upload?: StringNullableFilter<"HsiData"> | string | null
    download?: StringNullableFilter<"HsiData"> | string | null
    lastProgram?: StringNullableFilter<"HsiData"> | string | null
    statusVoice?: StringNullableFilter<"HsiData"> | string | null
    clid?: StringNullableFilter<"HsiData"> | string | null
    lastStart?: StringNullableFilter<"HsiData"> | string | null
    tindakLanjut?: StringNullableFilter<"HsiData"> | string | null
    isiComment?: StringNullableFilter<"HsiData"> | string | null
    userIdTl?: StringNullableFilter<"HsiData"> | string | null
    tglComment?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    tanggalManja?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    kelompokKendala?: StringNullableFilter<"HsiData"> | string | null
    kelompokStatus?: StringNullableFilter<"HsiData"> | string | null
    hero?: StringNullableFilter<"HsiData"> | string | null
    addon?: StringNullableFilter<"HsiData"> | string | null
    tglPs?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    statusMessage?: StringNullableFilter<"HsiData"> | string | null
    packageName?: StringNullableFilter<"HsiData"> | string | null
    groupPaket?: StringNullableFilter<"HsiData"> | string | null
    reasonCancel?: StringNullableFilter<"HsiData"> | string | null
    keteranganCancel?: StringNullableFilter<"HsiData"> | string | null
    tglManja?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    detailManja?: StringNullableFilter<"HsiData"> | string | null
    suberrorcode?: StringNullableFilter<"HsiData"> | string | null
    engineermemo?: StringNullableFilter<"HsiData"> | string | null
    tahun?: StringNullableFilter<"HsiData"> | string | null
    bulan?: StringNullableFilter<"HsiData"> | string | null
    tanggal?: StringNullableFilter<"HsiData"> | string | null
    ps1?: StringNullableFilter<"HsiData"> | string | null
    cek?: StringNullableFilter<"HsiData"> | string | null
    hasil?: StringNullableFilter<"HsiData"> | string | null
    telda?: StringNullableFilter<"HsiData"> | string | null
    dataProses?: StringNullableFilter<"HsiData"> | string | null
    noOrderRevoke?: StringNullableFilter<"HsiData"> | string | null
    datasPsRevoke?: StringNullableFilter<"HsiData"> | string | null
    untukPsPi?: StringNullableFilter<"HsiData"> | string | null
    createdAt?: DateTimeFilter<"HsiData"> | Date | string
    updatedAt?: DateTimeFilter<"HsiData"> | Date | string
  }

  export type HsiDataOrderByWithRelationInput = {
    id?: SortOrder
    nomor?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    regional?: SortOrderInput | SortOrder
    witel?: SortOrderInput | SortOrder
    regionalOld?: SortOrderInput | SortOrder
    witelOld?: SortOrderInput | SortOrder
    datel?: SortOrderInput | SortOrder
    sto?: SortOrderInput | SortOrder
    unit?: SortOrderInput | SortOrder
    jenisPsb?: SortOrderInput | SortOrder
    typeTrans?: SortOrderInput | SortOrder
    typeLayanan?: SortOrderInput | SortOrder
    statusResume?: SortOrderInput | SortOrder
    provider?: SortOrderInput | SortOrder
    orderDate?: SortOrderInput | SortOrder
    lastUpdatedDate?: SortOrderInput | SortOrder
    ncli?: SortOrderInput | SortOrder
    pots?: SortOrderInput | SortOrder
    speedy?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    locId?: SortOrderInput | SortOrder
    wonum?: SortOrderInput | SortOrder
    flagDeposit?: SortOrderInput | SortOrder
    contactHp?: SortOrderInput | SortOrder
    insAddress?: SortOrderInput | SortOrder
    gpsLongitude?: SortOrderInput | SortOrder
    gpsLatitude?: SortOrderInput | SortOrder
    kcontact?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    statusInet?: SortOrderInput | SortOrder
    statusOnu?: SortOrderInput | SortOrder
    upload?: SortOrderInput | SortOrder
    download?: SortOrderInput | SortOrder
    lastProgram?: SortOrderInput | SortOrder
    statusVoice?: SortOrderInput | SortOrder
    clid?: SortOrderInput | SortOrder
    lastStart?: SortOrderInput | SortOrder
    tindakLanjut?: SortOrderInput | SortOrder
    isiComment?: SortOrderInput | SortOrder
    userIdTl?: SortOrderInput | SortOrder
    tglComment?: SortOrderInput | SortOrder
    tanggalManja?: SortOrderInput | SortOrder
    kelompokKendala?: SortOrderInput | SortOrder
    kelompokStatus?: SortOrderInput | SortOrder
    hero?: SortOrderInput | SortOrder
    addon?: SortOrderInput | SortOrder
    tglPs?: SortOrderInput | SortOrder
    statusMessage?: SortOrderInput | SortOrder
    packageName?: SortOrderInput | SortOrder
    groupPaket?: SortOrderInput | SortOrder
    reasonCancel?: SortOrderInput | SortOrder
    keteranganCancel?: SortOrderInput | SortOrder
    tglManja?: SortOrderInput | SortOrder
    detailManja?: SortOrderInput | SortOrder
    suberrorcode?: SortOrderInput | SortOrder
    engineermemo?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    bulan?: SortOrderInput | SortOrder
    tanggal?: SortOrderInput | SortOrder
    ps1?: SortOrderInput | SortOrder
    cek?: SortOrderInput | SortOrder
    hasil?: SortOrderInput | SortOrder
    telda?: SortOrderInput | SortOrder
    dataProses?: SortOrderInput | SortOrder
    noOrderRevoke?: SortOrderInput | SortOrder
    datasPsRevoke?: SortOrderInput | SortOrder
    untukPsPi?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HsiDataWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: HsiDataWhereInput | HsiDataWhereInput[]
    OR?: HsiDataWhereInput[]
    NOT?: HsiDataWhereInput | HsiDataWhereInput[]
    nomor?: StringNullableFilter<"HsiData"> | string | null
    orderId?: StringNullableFilter<"HsiData"> | string | null
    regional?: StringNullableFilter<"HsiData"> | string | null
    witel?: StringNullableFilter<"HsiData"> | string | null
    regionalOld?: StringNullableFilter<"HsiData"> | string | null
    witelOld?: StringNullableFilter<"HsiData"> | string | null
    datel?: StringNullableFilter<"HsiData"> | string | null
    sto?: StringNullableFilter<"HsiData"> | string | null
    unit?: StringNullableFilter<"HsiData"> | string | null
    jenisPsb?: StringNullableFilter<"HsiData"> | string | null
    typeTrans?: StringNullableFilter<"HsiData"> | string | null
    typeLayanan?: StringNullableFilter<"HsiData"> | string | null
    statusResume?: StringNullableFilter<"HsiData"> | string | null
    provider?: StringNullableFilter<"HsiData"> | string | null
    orderDate?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    lastUpdatedDate?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    ncli?: StringNullableFilter<"HsiData"> | string | null
    pots?: StringNullableFilter<"HsiData"> | string | null
    speedy?: StringNullableFilter<"HsiData"> | string | null
    customerName?: StringNullableFilter<"HsiData"> | string | null
    locId?: StringNullableFilter<"HsiData"> | string | null
    wonum?: StringNullableFilter<"HsiData"> | string | null
    flagDeposit?: StringNullableFilter<"HsiData"> | string | null
    contactHp?: StringNullableFilter<"HsiData"> | string | null
    insAddress?: StringNullableFilter<"HsiData"> | string | null
    gpsLongitude?: StringNullableFilter<"HsiData"> | string | null
    gpsLatitude?: StringNullableFilter<"HsiData"> | string | null
    kcontact?: StringNullableFilter<"HsiData"> | string | null
    channel?: StringNullableFilter<"HsiData"> | string | null
    statusInet?: StringNullableFilter<"HsiData"> | string | null
    statusOnu?: StringNullableFilter<"HsiData"> | string | null
    upload?: StringNullableFilter<"HsiData"> | string | null
    download?: StringNullableFilter<"HsiData"> | string | null
    lastProgram?: StringNullableFilter<"HsiData"> | string | null
    statusVoice?: StringNullableFilter<"HsiData"> | string | null
    clid?: StringNullableFilter<"HsiData"> | string | null
    lastStart?: StringNullableFilter<"HsiData"> | string | null
    tindakLanjut?: StringNullableFilter<"HsiData"> | string | null
    isiComment?: StringNullableFilter<"HsiData"> | string | null
    userIdTl?: StringNullableFilter<"HsiData"> | string | null
    tglComment?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    tanggalManja?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    kelompokKendala?: StringNullableFilter<"HsiData"> | string | null
    kelompokStatus?: StringNullableFilter<"HsiData"> | string | null
    hero?: StringNullableFilter<"HsiData"> | string | null
    addon?: StringNullableFilter<"HsiData"> | string | null
    tglPs?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    statusMessage?: StringNullableFilter<"HsiData"> | string | null
    packageName?: StringNullableFilter<"HsiData"> | string | null
    groupPaket?: StringNullableFilter<"HsiData"> | string | null
    reasonCancel?: StringNullableFilter<"HsiData"> | string | null
    keteranganCancel?: StringNullableFilter<"HsiData"> | string | null
    tglManja?: DateTimeNullableFilter<"HsiData"> | Date | string | null
    detailManja?: StringNullableFilter<"HsiData"> | string | null
    suberrorcode?: StringNullableFilter<"HsiData"> | string | null
    engineermemo?: StringNullableFilter<"HsiData"> | string | null
    tahun?: StringNullableFilter<"HsiData"> | string | null
    bulan?: StringNullableFilter<"HsiData"> | string | null
    tanggal?: StringNullableFilter<"HsiData"> | string | null
    ps1?: StringNullableFilter<"HsiData"> | string | null
    cek?: StringNullableFilter<"HsiData"> | string | null
    hasil?: StringNullableFilter<"HsiData"> | string | null
    telda?: StringNullableFilter<"HsiData"> | string | null
    dataProses?: StringNullableFilter<"HsiData"> | string | null
    noOrderRevoke?: StringNullableFilter<"HsiData"> | string | null
    datasPsRevoke?: StringNullableFilter<"HsiData"> | string | null
    untukPsPi?: StringNullableFilter<"HsiData"> | string | null
    createdAt?: DateTimeFilter<"HsiData"> | Date | string
    updatedAt?: DateTimeFilter<"HsiData"> | Date | string
  }, "id">

  export type HsiDataOrderByWithAggregationInput = {
    id?: SortOrder
    nomor?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    regional?: SortOrderInput | SortOrder
    witel?: SortOrderInput | SortOrder
    regionalOld?: SortOrderInput | SortOrder
    witelOld?: SortOrderInput | SortOrder
    datel?: SortOrderInput | SortOrder
    sto?: SortOrderInput | SortOrder
    unit?: SortOrderInput | SortOrder
    jenisPsb?: SortOrderInput | SortOrder
    typeTrans?: SortOrderInput | SortOrder
    typeLayanan?: SortOrderInput | SortOrder
    statusResume?: SortOrderInput | SortOrder
    provider?: SortOrderInput | SortOrder
    orderDate?: SortOrderInput | SortOrder
    lastUpdatedDate?: SortOrderInput | SortOrder
    ncli?: SortOrderInput | SortOrder
    pots?: SortOrderInput | SortOrder
    speedy?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    locId?: SortOrderInput | SortOrder
    wonum?: SortOrderInput | SortOrder
    flagDeposit?: SortOrderInput | SortOrder
    contactHp?: SortOrderInput | SortOrder
    insAddress?: SortOrderInput | SortOrder
    gpsLongitude?: SortOrderInput | SortOrder
    gpsLatitude?: SortOrderInput | SortOrder
    kcontact?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    statusInet?: SortOrderInput | SortOrder
    statusOnu?: SortOrderInput | SortOrder
    upload?: SortOrderInput | SortOrder
    download?: SortOrderInput | SortOrder
    lastProgram?: SortOrderInput | SortOrder
    statusVoice?: SortOrderInput | SortOrder
    clid?: SortOrderInput | SortOrder
    lastStart?: SortOrderInput | SortOrder
    tindakLanjut?: SortOrderInput | SortOrder
    isiComment?: SortOrderInput | SortOrder
    userIdTl?: SortOrderInput | SortOrder
    tglComment?: SortOrderInput | SortOrder
    tanggalManja?: SortOrderInput | SortOrder
    kelompokKendala?: SortOrderInput | SortOrder
    kelompokStatus?: SortOrderInput | SortOrder
    hero?: SortOrderInput | SortOrder
    addon?: SortOrderInput | SortOrder
    tglPs?: SortOrderInput | SortOrder
    statusMessage?: SortOrderInput | SortOrder
    packageName?: SortOrderInput | SortOrder
    groupPaket?: SortOrderInput | SortOrder
    reasonCancel?: SortOrderInput | SortOrder
    keteranganCancel?: SortOrderInput | SortOrder
    tglManja?: SortOrderInput | SortOrder
    detailManja?: SortOrderInput | SortOrder
    suberrorcode?: SortOrderInput | SortOrder
    engineermemo?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    bulan?: SortOrderInput | SortOrder
    tanggal?: SortOrderInput | SortOrder
    ps1?: SortOrderInput | SortOrder
    cek?: SortOrderInput | SortOrder
    hasil?: SortOrderInput | SortOrder
    telda?: SortOrderInput | SortOrder
    dataProses?: SortOrderInput | SortOrder
    noOrderRevoke?: SortOrderInput | SortOrder
    datasPsRevoke?: SortOrderInput | SortOrder
    untukPsPi?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HsiDataCountOrderByAggregateInput
    _avg?: HsiDataAvgOrderByAggregateInput
    _max?: HsiDataMaxOrderByAggregateInput
    _min?: HsiDataMinOrderByAggregateInput
    _sum?: HsiDataSumOrderByAggregateInput
  }

  export type HsiDataScalarWhereWithAggregatesInput = {
    AND?: HsiDataScalarWhereWithAggregatesInput | HsiDataScalarWhereWithAggregatesInput[]
    OR?: HsiDataScalarWhereWithAggregatesInput[]
    NOT?: HsiDataScalarWhereWithAggregatesInput | HsiDataScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"HsiData"> | bigint | number
    nomor?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    orderId?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    regional?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    witel?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    regionalOld?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    witelOld?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    datel?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    sto?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    unit?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    jenisPsb?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    typeTrans?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    typeLayanan?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    statusResume?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    provider?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    orderDate?: DateTimeNullableWithAggregatesFilter<"HsiData"> | Date | string | null
    lastUpdatedDate?: DateTimeNullableWithAggregatesFilter<"HsiData"> | Date | string | null
    ncli?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    pots?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    speedy?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    customerName?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    locId?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    wonum?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    flagDeposit?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    contactHp?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    insAddress?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    gpsLongitude?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    gpsLatitude?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    kcontact?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    channel?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    statusInet?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    statusOnu?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    upload?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    download?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    lastProgram?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    statusVoice?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    clid?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    lastStart?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    tindakLanjut?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    isiComment?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    userIdTl?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    tglComment?: DateTimeNullableWithAggregatesFilter<"HsiData"> | Date | string | null
    tanggalManja?: DateTimeNullableWithAggregatesFilter<"HsiData"> | Date | string | null
    kelompokKendala?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    kelompokStatus?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    hero?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    addon?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    tglPs?: DateTimeNullableWithAggregatesFilter<"HsiData"> | Date | string | null
    statusMessage?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    packageName?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    groupPaket?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    reasonCancel?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    keteranganCancel?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    tglManja?: DateTimeNullableWithAggregatesFilter<"HsiData"> | Date | string | null
    detailManja?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    suberrorcode?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    engineermemo?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    tahun?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    bulan?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    tanggal?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    ps1?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    cek?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    hasil?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    telda?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    dataProses?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    noOrderRevoke?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    datasPsRevoke?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    untukPsPi?: StringNullableWithAggregatesFilter<"HsiData"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"HsiData"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"HsiData"> | Date | string
  }

  export type SpmkMomWhereInput = {
    AND?: SpmkMomWhereInput | SpmkMomWhereInput[]
    OR?: SpmkMomWhereInput[]
    NOT?: SpmkMomWhereInput | SpmkMomWhereInput[]
    id?: BigIntFilter<"SpmkMom"> | bigint | number
    bulan?: StringNullableFilter<"SpmkMom"> | string | null
    tahun?: IntNullableFilter<"SpmkMom"> | number | null
    region?: StringNullableFilter<"SpmkMom"> | string | null
    witelLama?: StringNullableFilter<"SpmkMom"> | string | null
    witelBaru?: StringNullableFilter<"SpmkMom"> | string | null
    idIHld?: StringNullableFilter<"SpmkMom"> | string | null
    noNdeSpmk?: StringNullableFilter<"SpmkMom"> | string | null
    uraianKegiatan?: StringNullableFilter<"SpmkMom"> | string | null
    segmen?: StringNullableFilter<"SpmkMom"> | string | null
    poName?: StringNullableFilter<"SpmkMom"> | string | null
    tanggalGolive?: DateTimeNullableFilter<"SpmkMom"> | Date | string | null
    konfirmasiPo?: StringNullableFilter<"SpmkMom"> | string | null
    tanggalCb?: DateTimeNullableFilter<"SpmkMom"> | Date | string | null
    jenisKegiatan?: StringNullableFilter<"SpmkMom"> | string | null
    revenuePlan?: DecimalNullableFilter<"SpmkMom"> | Decimal | DecimalJsLike | number | string | null
    statusProyek?: StringNullableFilter<"SpmkMom"> | string | null
    goLive?: StringFilter<"SpmkMom"> | string
    keteranganToc?: StringNullableFilter<"SpmkMom"> | string | null
    perihalNdeSpmk?: StringNullableFilter<"SpmkMom"> | string | null
    mom?: StringNullableFilter<"SpmkMom"> | string | null
    baDrop?: StringNullableFilter<"SpmkMom"> | string | null
    populasiNonDrop?: StringFilter<"SpmkMom"> | string
    tanggalMom?: DateTimeNullableFilter<"SpmkMom"> | Date | string | null
    usia?: IntNullableFilter<"SpmkMom"> | number | null
    rab?: DecimalNullableFilter<"SpmkMom"> | Decimal | DecimalJsLike | number | string | null
    totalPort?: StringNullableFilter<"SpmkMom"> | string | null
    templateDurasi?: StringNullableFilter<"SpmkMom"> | string | null
    toc?: StringNullableFilter<"SpmkMom"> | string | null
    umurPekerjaan?: StringNullableFilter<"SpmkMom"> | string | null
    kategoriUmurPekerjaan?: StringNullableFilter<"SpmkMom"> | string | null
    statusTompsLastActivity?: StringNullableFilter<"SpmkMom"> | string | null
    statusTompsNew?: StringNullableFilter<"SpmkMom"> | string | null
    statusIHld?: StringNullableFilter<"SpmkMom"> | string | null
    namaOdpGoLive?: StringNullableFilter<"SpmkMom"> | string | null
    bak?: StringNullableFilter<"SpmkMom"> | string | null
    keteranganPelimpahan?: StringNullableFilter<"SpmkMom"> | string | null
    mitraLokal?: StringNullableFilter<"SpmkMom"> | string | null
    createdAt?: DateTimeFilter<"SpmkMom"> | Date | string
    updatedAt?: DateTimeFilter<"SpmkMom"> | Date | string
    batchId?: StringNullableFilter<"SpmkMom"> | string | null
  }

  export type SpmkMomOrderByWithRelationInput = {
    id?: SortOrder
    bulan?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    witelLama?: SortOrderInput | SortOrder
    witelBaru?: SortOrderInput | SortOrder
    idIHld?: SortOrderInput | SortOrder
    noNdeSpmk?: SortOrderInput | SortOrder
    uraianKegiatan?: SortOrderInput | SortOrder
    segmen?: SortOrderInput | SortOrder
    poName?: SortOrderInput | SortOrder
    tanggalGolive?: SortOrderInput | SortOrder
    konfirmasiPo?: SortOrderInput | SortOrder
    tanggalCb?: SortOrderInput | SortOrder
    jenisKegiatan?: SortOrderInput | SortOrder
    revenuePlan?: SortOrderInput | SortOrder
    statusProyek?: SortOrderInput | SortOrder
    goLive?: SortOrder
    keteranganToc?: SortOrderInput | SortOrder
    perihalNdeSpmk?: SortOrderInput | SortOrder
    mom?: SortOrderInput | SortOrder
    baDrop?: SortOrderInput | SortOrder
    populasiNonDrop?: SortOrder
    tanggalMom?: SortOrderInput | SortOrder
    usia?: SortOrderInput | SortOrder
    rab?: SortOrderInput | SortOrder
    totalPort?: SortOrderInput | SortOrder
    templateDurasi?: SortOrderInput | SortOrder
    toc?: SortOrderInput | SortOrder
    umurPekerjaan?: SortOrderInput | SortOrder
    kategoriUmurPekerjaan?: SortOrderInput | SortOrder
    statusTompsLastActivity?: SortOrderInput | SortOrder
    statusTompsNew?: SortOrderInput | SortOrder
    statusIHld?: SortOrderInput | SortOrder
    namaOdpGoLive?: SortOrderInput | SortOrder
    bak?: SortOrderInput | SortOrder
    keteranganPelimpahan?: SortOrderInput | SortOrder
    mitraLokal?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrderInput | SortOrder
  }

  export type SpmkMomWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: SpmkMomWhereInput | SpmkMomWhereInput[]
    OR?: SpmkMomWhereInput[]
    NOT?: SpmkMomWhereInput | SpmkMomWhereInput[]
    bulan?: StringNullableFilter<"SpmkMom"> | string | null
    tahun?: IntNullableFilter<"SpmkMom"> | number | null
    region?: StringNullableFilter<"SpmkMom"> | string | null
    witelLama?: StringNullableFilter<"SpmkMom"> | string | null
    witelBaru?: StringNullableFilter<"SpmkMom"> | string | null
    idIHld?: StringNullableFilter<"SpmkMom"> | string | null
    noNdeSpmk?: StringNullableFilter<"SpmkMom"> | string | null
    uraianKegiatan?: StringNullableFilter<"SpmkMom"> | string | null
    segmen?: StringNullableFilter<"SpmkMom"> | string | null
    poName?: StringNullableFilter<"SpmkMom"> | string | null
    tanggalGolive?: DateTimeNullableFilter<"SpmkMom"> | Date | string | null
    konfirmasiPo?: StringNullableFilter<"SpmkMom"> | string | null
    tanggalCb?: DateTimeNullableFilter<"SpmkMom"> | Date | string | null
    jenisKegiatan?: StringNullableFilter<"SpmkMom"> | string | null
    revenuePlan?: DecimalNullableFilter<"SpmkMom"> | Decimal | DecimalJsLike | number | string | null
    statusProyek?: StringNullableFilter<"SpmkMom"> | string | null
    goLive?: StringFilter<"SpmkMom"> | string
    keteranganToc?: StringNullableFilter<"SpmkMom"> | string | null
    perihalNdeSpmk?: StringNullableFilter<"SpmkMom"> | string | null
    mom?: StringNullableFilter<"SpmkMom"> | string | null
    baDrop?: StringNullableFilter<"SpmkMom"> | string | null
    populasiNonDrop?: StringFilter<"SpmkMom"> | string
    tanggalMom?: DateTimeNullableFilter<"SpmkMom"> | Date | string | null
    usia?: IntNullableFilter<"SpmkMom"> | number | null
    rab?: DecimalNullableFilter<"SpmkMom"> | Decimal | DecimalJsLike | number | string | null
    totalPort?: StringNullableFilter<"SpmkMom"> | string | null
    templateDurasi?: StringNullableFilter<"SpmkMom"> | string | null
    toc?: StringNullableFilter<"SpmkMom"> | string | null
    umurPekerjaan?: StringNullableFilter<"SpmkMom"> | string | null
    kategoriUmurPekerjaan?: StringNullableFilter<"SpmkMom"> | string | null
    statusTompsLastActivity?: StringNullableFilter<"SpmkMom"> | string | null
    statusTompsNew?: StringNullableFilter<"SpmkMom"> | string | null
    statusIHld?: StringNullableFilter<"SpmkMom"> | string | null
    namaOdpGoLive?: StringNullableFilter<"SpmkMom"> | string | null
    bak?: StringNullableFilter<"SpmkMom"> | string | null
    keteranganPelimpahan?: StringNullableFilter<"SpmkMom"> | string | null
    mitraLokal?: StringNullableFilter<"SpmkMom"> | string | null
    createdAt?: DateTimeFilter<"SpmkMom"> | Date | string
    updatedAt?: DateTimeFilter<"SpmkMom"> | Date | string
    batchId?: StringNullableFilter<"SpmkMom"> | string | null
  }, "id">

  export type SpmkMomOrderByWithAggregationInput = {
    id?: SortOrder
    bulan?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    witelLama?: SortOrderInput | SortOrder
    witelBaru?: SortOrderInput | SortOrder
    idIHld?: SortOrderInput | SortOrder
    noNdeSpmk?: SortOrderInput | SortOrder
    uraianKegiatan?: SortOrderInput | SortOrder
    segmen?: SortOrderInput | SortOrder
    poName?: SortOrderInput | SortOrder
    tanggalGolive?: SortOrderInput | SortOrder
    konfirmasiPo?: SortOrderInput | SortOrder
    tanggalCb?: SortOrderInput | SortOrder
    jenisKegiatan?: SortOrderInput | SortOrder
    revenuePlan?: SortOrderInput | SortOrder
    statusProyek?: SortOrderInput | SortOrder
    goLive?: SortOrder
    keteranganToc?: SortOrderInput | SortOrder
    perihalNdeSpmk?: SortOrderInput | SortOrder
    mom?: SortOrderInput | SortOrder
    baDrop?: SortOrderInput | SortOrder
    populasiNonDrop?: SortOrder
    tanggalMom?: SortOrderInput | SortOrder
    usia?: SortOrderInput | SortOrder
    rab?: SortOrderInput | SortOrder
    totalPort?: SortOrderInput | SortOrder
    templateDurasi?: SortOrderInput | SortOrder
    toc?: SortOrderInput | SortOrder
    umurPekerjaan?: SortOrderInput | SortOrder
    kategoriUmurPekerjaan?: SortOrderInput | SortOrder
    statusTompsLastActivity?: SortOrderInput | SortOrder
    statusTompsNew?: SortOrderInput | SortOrder
    statusIHld?: SortOrderInput | SortOrder
    namaOdpGoLive?: SortOrderInput | SortOrder
    bak?: SortOrderInput | SortOrder
    keteranganPelimpahan?: SortOrderInput | SortOrder
    mitraLokal?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrderInput | SortOrder
    _count?: SpmkMomCountOrderByAggregateInput
    _avg?: SpmkMomAvgOrderByAggregateInput
    _max?: SpmkMomMaxOrderByAggregateInput
    _min?: SpmkMomMinOrderByAggregateInput
    _sum?: SpmkMomSumOrderByAggregateInput
  }

  export type SpmkMomScalarWhereWithAggregatesInput = {
    AND?: SpmkMomScalarWhereWithAggregatesInput | SpmkMomScalarWhereWithAggregatesInput[]
    OR?: SpmkMomScalarWhereWithAggregatesInput[]
    NOT?: SpmkMomScalarWhereWithAggregatesInput | SpmkMomScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"SpmkMom"> | bigint | number
    bulan?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    tahun?: IntNullableWithAggregatesFilter<"SpmkMom"> | number | null
    region?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    witelLama?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    witelBaru?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    idIHld?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    noNdeSpmk?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    uraianKegiatan?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    segmen?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    poName?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    tanggalGolive?: DateTimeNullableWithAggregatesFilter<"SpmkMom"> | Date | string | null
    konfirmasiPo?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    tanggalCb?: DateTimeNullableWithAggregatesFilter<"SpmkMom"> | Date | string | null
    jenisKegiatan?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    revenuePlan?: DecimalNullableWithAggregatesFilter<"SpmkMom"> | Decimal | DecimalJsLike | number | string | null
    statusProyek?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    goLive?: StringWithAggregatesFilter<"SpmkMom"> | string
    keteranganToc?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    perihalNdeSpmk?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    mom?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    baDrop?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    populasiNonDrop?: StringWithAggregatesFilter<"SpmkMom"> | string
    tanggalMom?: DateTimeNullableWithAggregatesFilter<"SpmkMom"> | Date | string | null
    usia?: IntNullableWithAggregatesFilter<"SpmkMom"> | number | null
    rab?: DecimalNullableWithAggregatesFilter<"SpmkMom"> | Decimal | DecimalJsLike | number | string | null
    totalPort?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    templateDurasi?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    toc?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    umurPekerjaan?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    kategoriUmurPekerjaan?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    statusTompsLastActivity?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    statusTompsNew?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    statusIHld?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    namaOdpGoLive?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    bak?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    keteranganPelimpahan?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    mitraLokal?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SpmkMom"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SpmkMom"> | Date | string
    batchId?: StringNullableWithAggregatesFilter<"SpmkMom"> | string | null
  }

  export type DocumentDataWhereInput = {
    AND?: DocumentDataWhereInput | DocumentDataWhereInput[]
    OR?: DocumentDataWhereInput[]
    NOT?: DocumentDataWhereInput | DocumentDataWhereInput[]
    id?: BigIntFilter<"DocumentData"> | bigint | number
    batchId?: StringNullableFilter<"DocumentData"> | string | null
    orderId?: StringFilter<"DocumentData"> | string
    product?: StringNullableFilter<"DocumentData"> | string | null
    netPrice?: DecimalFilter<"DocumentData"> | Decimal | DecimalJsLike | number | string
    isTemplatePrice?: BoolFilter<"DocumentData"> | boolean
    productsProcessed?: BoolFilter<"DocumentData"> | boolean
    milestone?: StringNullableFilter<"DocumentData"> | string | null
    previousMilestone?: StringNullableFilter<"DocumentData"> | string | null
    segment?: StringNullableFilter<"DocumentData"> | string | null
    namaWitel?: StringNullableFilter<"DocumentData"> | string | null
    statusWfm?: StringNullableFilter<"DocumentData"> | string | null
    customerName?: StringNullableFilter<"DocumentData"> | string | null
    channel?: StringNullableFilter<"DocumentData"> | string | null
    layanan?: StringNullableFilter<"DocumentData"> | string | null
    filterProduk?: StringNullableFilter<"DocumentData"> | string | null
    witelLama?: StringNullableFilter<"DocumentData"> | string | null
    orderStatus?: StringNullableFilter<"DocumentData"> | string | null
    orderSubType?: StringNullableFilter<"DocumentData"> | string | null
    orderStatusN?: StringNullableFilter<"DocumentData"> | string | null
    tahun?: StringNullableFilter<"DocumentData"> | string | null
    telda?: StringNullableFilter<"DocumentData"> | string | null
    week?: StringNullableFilter<"DocumentData"> | string | null
    orderDate?: DateTimeNullableFilter<"DocumentData"> | Date | string | null
    orderCreatedDate?: DateTimeNullableFilter<"DocumentData"> | Date | string | null
    createdAt?: DateTimeFilter<"DocumentData"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentData"> | Date | string
  }

  export type DocumentDataOrderByWithRelationInput = {
    id?: SortOrder
    batchId?: SortOrderInput | SortOrder
    orderId?: SortOrder
    product?: SortOrderInput | SortOrder
    netPrice?: SortOrder
    isTemplatePrice?: SortOrder
    productsProcessed?: SortOrder
    milestone?: SortOrderInput | SortOrder
    previousMilestone?: SortOrderInput | SortOrder
    segment?: SortOrderInput | SortOrder
    namaWitel?: SortOrderInput | SortOrder
    statusWfm?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    layanan?: SortOrderInput | SortOrder
    filterProduk?: SortOrderInput | SortOrder
    witelLama?: SortOrderInput | SortOrder
    orderStatus?: SortOrderInput | SortOrder
    orderSubType?: SortOrderInput | SortOrder
    orderStatusN?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    telda?: SortOrderInput | SortOrder
    week?: SortOrderInput | SortOrder
    orderDate?: SortOrderInput | SortOrder
    orderCreatedDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentDataWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: DocumentDataWhereInput | DocumentDataWhereInput[]
    OR?: DocumentDataWhereInput[]
    NOT?: DocumentDataWhereInput | DocumentDataWhereInput[]
    batchId?: StringNullableFilter<"DocumentData"> | string | null
    orderId?: StringFilter<"DocumentData"> | string
    product?: StringNullableFilter<"DocumentData"> | string | null
    netPrice?: DecimalFilter<"DocumentData"> | Decimal | DecimalJsLike | number | string
    isTemplatePrice?: BoolFilter<"DocumentData"> | boolean
    productsProcessed?: BoolFilter<"DocumentData"> | boolean
    milestone?: StringNullableFilter<"DocumentData"> | string | null
    previousMilestone?: StringNullableFilter<"DocumentData"> | string | null
    segment?: StringNullableFilter<"DocumentData"> | string | null
    namaWitel?: StringNullableFilter<"DocumentData"> | string | null
    statusWfm?: StringNullableFilter<"DocumentData"> | string | null
    customerName?: StringNullableFilter<"DocumentData"> | string | null
    channel?: StringNullableFilter<"DocumentData"> | string | null
    layanan?: StringNullableFilter<"DocumentData"> | string | null
    filterProduk?: StringNullableFilter<"DocumentData"> | string | null
    witelLama?: StringNullableFilter<"DocumentData"> | string | null
    orderStatus?: StringNullableFilter<"DocumentData"> | string | null
    orderSubType?: StringNullableFilter<"DocumentData"> | string | null
    orderStatusN?: StringNullableFilter<"DocumentData"> | string | null
    tahun?: StringNullableFilter<"DocumentData"> | string | null
    telda?: StringNullableFilter<"DocumentData"> | string | null
    week?: StringNullableFilter<"DocumentData"> | string | null
    orderDate?: DateTimeNullableFilter<"DocumentData"> | Date | string | null
    orderCreatedDate?: DateTimeNullableFilter<"DocumentData"> | Date | string | null
    createdAt?: DateTimeFilter<"DocumentData"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentData"> | Date | string
  }, "id">

  export type DocumentDataOrderByWithAggregationInput = {
    id?: SortOrder
    batchId?: SortOrderInput | SortOrder
    orderId?: SortOrder
    product?: SortOrderInput | SortOrder
    netPrice?: SortOrder
    isTemplatePrice?: SortOrder
    productsProcessed?: SortOrder
    milestone?: SortOrderInput | SortOrder
    previousMilestone?: SortOrderInput | SortOrder
    segment?: SortOrderInput | SortOrder
    namaWitel?: SortOrderInput | SortOrder
    statusWfm?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    layanan?: SortOrderInput | SortOrder
    filterProduk?: SortOrderInput | SortOrder
    witelLama?: SortOrderInput | SortOrder
    orderStatus?: SortOrderInput | SortOrder
    orderSubType?: SortOrderInput | SortOrder
    orderStatusN?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    telda?: SortOrderInput | SortOrder
    week?: SortOrderInput | SortOrder
    orderDate?: SortOrderInput | SortOrder
    orderCreatedDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentDataCountOrderByAggregateInput
    _avg?: DocumentDataAvgOrderByAggregateInput
    _max?: DocumentDataMaxOrderByAggregateInput
    _min?: DocumentDataMinOrderByAggregateInput
    _sum?: DocumentDataSumOrderByAggregateInput
  }

  export type DocumentDataScalarWhereWithAggregatesInput = {
    AND?: DocumentDataScalarWhereWithAggregatesInput | DocumentDataScalarWhereWithAggregatesInput[]
    OR?: DocumentDataScalarWhereWithAggregatesInput[]
    NOT?: DocumentDataScalarWhereWithAggregatesInput | DocumentDataScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"DocumentData"> | bigint | number
    batchId?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    orderId?: StringWithAggregatesFilter<"DocumentData"> | string
    product?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    netPrice?: DecimalWithAggregatesFilter<"DocumentData"> | Decimal | DecimalJsLike | number | string
    isTemplatePrice?: BoolWithAggregatesFilter<"DocumentData"> | boolean
    productsProcessed?: BoolWithAggregatesFilter<"DocumentData"> | boolean
    milestone?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    previousMilestone?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    segment?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    namaWitel?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    statusWfm?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    customerName?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    channel?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    layanan?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    filterProduk?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    witelLama?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    orderStatus?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    orderSubType?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    orderStatusN?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    tahun?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    telda?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    week?: StringNullableWithAggregatesFilter<"DocumentData"> | string | null
    orderDate?: DateTimeNullableWithAggregatesFilter<"DocumentData"> | Date | string | null
    orderCreatedDate?: DateTimeNullableWithAggregatesFilter<"DocumentData"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DocumentData"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DocumentData"> | Date | string
  }

  export type OrderProductWhereInput = {
    AND?: OrderProductWhereInput | OrderProductWhereInput[]
    OR?: OrderProductWhereInput[]
    NOT?: OrderProductWhereInput | OrderProductWhereInput[]
    id?: BigIntFilter<"OrderProduct"> | bigint | number
    orderId?: StringFilter<"OrderProduct"> | string
    productName?: StringNullableFilter<"OrderProduct"> | string | null
    netPrice?: DecimalFilter<"OrderProduct"> | Decimal | DecimalJsLike | number | string
    channel?: StringNullableFilter<"OrderProduct"> | string | null
    statusWfm?: StringNullableFilter<"OrderProduct"> | string | null
    createdAt?: DateTimeFilter<"OrderProduct"> | Date | string
    updatedAt?: DateTimeFilter<"OrderProduct"> | Date | string
  }

  export type OrderProductOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    productName?: SortOrderInput | SortOrder
    netPrice?: SortOrder
    channel?: SortOrderInput | SortOrder
    statusWfm?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderProductWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: OrderProductWhereInput | OrderProductWhereInput[]
    OR?: OrderProductWhereInput[]
    NOT?: OrderProductWhereInput | OrderProductWhereInput[]
    orderId?: StringFilter<"OrderProduct"> | string
    productName?: StringNullableFilter<"OrderProduct"> | string | null
    netPrice?: DecimalFilter<"OrderProduct"> | Decimal | DecimalJsLike | number | string
    channel?: StringNullableFilter<"OrderProduct"> | string | null
    statusWfm?: StringNullableFilter<"OrderProduct"> | string | null
    createdAt?: DateTimeFilter<"OrderProduct"> | Date | string
    updatedAt?: DateTimeFilter<"OrderProduct"> | Date | string
  }, "id">

  export type OrderProductOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    productName?: SortOrderInput | SortOrder
    netPrice?: SortOrder
    channel?: SortOrderInput | SortOrder
    statusWfm?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderProductCountOrderByAggregateInput
    _avg?: OrderProductAvgOrderByAggregateInput
    _max?: OrderProductMaxOrderByAggregateInput
    _min?: OrderProductMinOrderByAggregateInput
    _sum?: OrderProductSumOrderByAggregateInput
  }

  export type OrderProductScalarWhereWithAggregatesInput = {
    AND?: OrderProductScalarWhereWithAggregatesInput | OrderProductScalarWhereWithAggregatesInput[]
    OR?: OrderProductScalarWhereWithAggregatesInput[]
    NOT?: OrderProductScalarWhereWithAggregatesInput | OrderProductScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"OrderProduct"> | bigint | number
    orderId?: StringWithAggregatesFilter<"OrderProduct"> | string
    productName?: StringNullableWithAggregatesFilter<"OrderProduct"> | string | null
    netPrice?: DecimalWithAggregatesFilter<"OrderProduct"> | Decimal | DecimalJsLike | number | string
    channel?: StringNullableWithAggregatesFilter<"OrderProduct"> | string | null
    statusWfm?: StringNullableWithAggregatesFilter<"OrderProduct"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OrderProduct"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OrderProduct"> | Date | string
  }

  export type TargetWhereInput = {
    AND?: TargetWhereInput | TargetWhereInput[]
    OR?: TargetWhereInput[]
    NOT?: TargetWhereInput | TargetWhereInput[]
    id?: BigIntFilter<"Target"> | bigint | number
    segment?: StringFilter<"Target"> | string
    namaWitel?: StringFilter<"Target"> | string
    metricType?: StringFilter<"Target"> | string
    productName?: StringFilter<"Target"> | string
    targetValue?: DecimalFilter<"Target"> | Decimal | DecimalJsLike | number | string
    period?: DateTimeFilter<"Target"> | Date | string
    createdAt?: DateTimeFilter<"Target"> | Date | string
    updatedAt?: DateTimeFilter<"Target"> | Date | string
  }

  export type TargetOrderByWithRelationInput = {
    id?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    metricType?: SortOrder
    productName?: SortOrder
    targetValue?: SortOrder
    period?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TargetWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: TargetWhereInput | TargetWhereInput[]
    OR?: TargetWhereInput[]
    NOT?: TargetWhereInput | TargetWhereInput[]
    segment?: StringFilter<"Target"> | string
    namaWitel?: StringFilter<"Target"> | string
    metricType?: StringFilter<"Target"> | string
    productName?: StringFilter<"Target"> | string
    targetValue?: DecimalFilter<"Target"> | Decimal | DecimalJsLike | number | string
    period?: DateTimeFilter<"Target"> | Date | string
    createdAt?: DateTimeFilter<"Target"> | Date | string
    updatedAt?: DateTimeFilter<"Target"> | Date | string
  }, "id">

  export type TargetOrderByWithAggregationInput = {
    id?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    metricType?: SortOrder
    productName?: SortOrder
    targetValue?: SortOrder
    period?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TargetCountOrderByAggregateInput
    _avg?: TargetAvgOrderByAggregateInput
    _max?: TargetMaxOrderByAggregateInput
    _min?: TargetMinOrderByAggregateInput
    _sum?: TargetSumOrderByAggregateInput
  }

  export type TargetScalarWhereWithAggregatesInput = {
    AND?: TargetScalarWhereWithAggregatesInput | TargetScalarWhereWithAggregatesInput[]
    OR?: TargetScalarWhereWithAggregatesInput[]
    NOT?: TargetScalarWhereWithAggregatesInput | TargetScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Target"> | bigint | number
    segment?: StringWithAggregatesFilter<"Target"> | string
    namaWitel?: StringWithAggregatesFilter<"Target"> | string
    metricType?: StringWithAggregatesFilter<"Target"> | string
    productName?: StringWithAggregatesFilter<"Target"> | string
    targetValue?: DecimalWithAggregatesFilter<"Target"> | Decimal | DecimalJsLike | number | string
    period?: DateTimeWithAggregatesFilter<"Target"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Target"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Target"> | Date | string
  }

  export type CustomTargetWhereInput = {
    AND?: CustomTargetWhereInput | CustomTargetWhereInput[]
    OR?: CustomTargetWhereInput[]
    NOT?: CustomTargetWhereInput | CustomTargetWhereInput[]
    id?: BigIntFilter<"CustomTarget"> | bigint | number
    userId?: BigIntFilter<"CustomTarget"> | bigint | number
    pageName?: StringFilter<"CustomTarget"> | string
    targetKey?: StringFilter<"CustomTarget"> | string
    witel?: StringFilter<"CustomTarget"> | string
    period?: DateTimeFilter<"CustomTarget"> | Date | string
    value?: DecimalFilter<"CustomTarget"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"CustomTarget"> | Date | string
    updatedAt?: DateTimeFilter<"CustomTarget"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CustomTargetOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    targetKey?: SortOrder
    witel?: SortOrder
    period?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CustomTargetWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: CustomTargetWhereInput | CustomTargetWhereInput[]
    OR?: CustomTargetWhereInput[]
    NOT?: CustomTargetWhereInput | CustomTargetWhereInput[]
    userId?: BigIntFilter<"CustomTarget"> | bigint | number
    pageName?: StringFilter<"CustomTarget"> | string
    targetKey?: StringFilter<"CustomTarget"> | string
    witel?: StringFilter<"CustomTarget"> | string
    period?: DateTimeFilter<"CustomTarget"> | Date | string
    value?: DecimalFilter<"CustomTarget"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"CustomTarget"> | Date | string
    updatedAt?: DateTimeFilter<"CustomTarget"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type CustomTargetOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    targetKey?: SortOrder
    witel?: SortOrder
    period?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomTargetCountOrderByAggregateInput
    _avg?: CustomTargetAvgOrderByAggregateInput
    _max?: CustomTargetMaxOrderByAggregateInput
    _min?: CustomTargetMinOrderByAggregateInput
    _sum?: CustomTargetSumOrderByAggregateInput
  }

  export type CustomTargetScalarWhereWithAggregatesInput = {
    AND?: CustomTargetScalarWhereWithAggregatesInput | CustomTargetScalarWhereWithAggregatesInput[]
    OR?: CustomTargetScalarWhereWithAggregatesInput[]
    NOT?: CustomTargetScalarWhereWithAggregatesInput | CustomTargetScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"CustomTarget"> | bigint | number
    userId?: BigIntWithAggregatesFilter<"CustomTarget"> | bigint | number
    pageName?: StringWithAggregatesFilter<"CustomTarget"> | string
    targetKey?: StringWithAggregatesFilter<"CustomTarget"> | string
    witel?: StringWithAggregatesFilter<"CustomTarget"> | string
    period?: DateTimeWithAggregatesFilter<"CustomTarget"> | Date | string
    value?: DecimalWithAggregatesFilter<"CustomTarget"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"CustomTarget"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CustomTarget"> | Date | string
  }

  export type UserTableConfigurationWhereInput = {
    AND?: UserTableConfigurationWhereInput | UserTableConfigurationWhereInput[]
    OR?: UserTableConfigurationWhereInput[]
    NOT?: UserTableConfigurationWhereInput | UserTableConfigurationWhereInput[]
    id?: BigIntFilter<"UserTableConfiguration"> | bigint | number
    userId?: BigIntNullableFilter<"UserTableConfiguration"> | bigint | number | null
    pageName?: StringFilter<"UserTableConfiguration"> | string
    configuration?: JsonFilter<"UserTableConfiguration">
    createdAt?: DateTimeFilter<"UserTableConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"UserTableConfiguration"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type UserTableConfigurationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    pageName?: SortOrder
    configuration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserTableConfigurationWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    pageName?: string
    AND?: UserTableConfigurationWhereInput | UserTableConfigurationWhereInput[]
    OR?: UserTableConfigurationWhereInput[]
    NOT?: UserTableConfigurationWhereInput | UserTableConfigurationWhereInput[]
    userId?: BigIntNullableFilter<"UserTableConfiguration"> | bigint | number | null
    configuration?: JsonFilter<"UserTableConfiguration">
    createdAt?: DateTimeFilter<"UserTableConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"UserTableConfiguration"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "pageName">

  export type UserTableConfigurationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    pageName?: SortOrder
    configuration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserTableConfigurationCountOrderByAggregateInput
    _avg?: UserTableConfigurationAvgOrderByAggregateInput
    _max?: UserTableConfigurationMaxOrderByAggregateInput
    _min?: UserTableConfigurationMinOrderByAggregateInput
    _sum?: UserTableConfigurationSumOrderByAggregateInput
  }

  export type UserTableConfigurationScalarWhereWithAggregatesInput = {
    AND?: UserTableConfigurationScalarWhereWithAggregatesInput | UserTableConfigurationScalarWhereWithAggregatesInput[]
    OR?: UserTableConfigurationScalarWhereWithAggregatesInput[]
    NOT?: UserTableConfigurationScalarWhereWithAggregatesInput | UserTableConfigurationScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"UserTableConfiguration"> | bigint | number
    userId?: BigIntNullableWithAggregatesFilter<"UserTableConfiguration"> | bigint | number | null
    pageName?: StringWithAggregatesFilter<"UserTableConfiguration"> | string
    configuration?: JsonWithAggregatesFilter<"UserTableConfiguration">
    createdAt?: DateTimeWithAggregatesFilter<"UserTableConfiguration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserTableConfiguration"> | Date | string
  }

  export type DigitalProductCreateInput = {
    id?: bigint | number
    orderNumber?: string | null
    productName?: string | null
    customerName?: string | null
    poName?: string | null
    witel?: string | null
    branch?: string | null
    revenue?: Decimal | DecimalJsLike | number | string
    amount?: Decimal | DecimalJsLike | number | string
    status?: string | null
    milestone?: string | null
    segment?: string | null
    category?: string | null
    subType?: string | null
    orderDate?: Date | string | null
    batchId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DigitalProductUncheckedCreateInput = {
    id?: bigint | number
    orderNumber?: string | null
    productName?: string | null
    customerName?: string | null
    poName?: string | null
    witel?: string | null
    branch?: string | null
    revenue?: Decimal | DecimalJsLike | number | string
    amount?: Decimal | DecimalJsLike | number | string
    status?: string | null
    milestone?: string | null
    segment?: string | null
    category?: string | null
    subType?: string | null
    orderDate?: Date | string | null
    batchId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DigitalProductUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalProductUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalProductCreateManyInput = {
    id?: bigint | number
    orderNumber?: string | null
    productName?: string | null
    customerName?: string | null
    poName?: string | null
    witel?: string | null
    branch?: string | null
    revenue?: Decimal | DecimalJsLike | number | string
    amount?: Decimal | DecimalJsLike | number | string
    status?: string | null
    milestone?: string | null
    segment?: string | null
    category?: string | null
    subType?: string | null
    orderDate?: Date | string | null
    batchId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DigitalProductUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalProductUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: bigint | number
    name: string
    email: string
    password: string
    role?: string
    currentRoleAs?: string | null
    emailVerifiedAt?: Date | string | null
    rememberToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customTargets?: CustomTargetCreateNestedManyWithoutUserInput
    userTableConfigurations?: UserTableConfigurationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: bigint | number
    name: string
    email: string
    password: string
    role?: string
    currentRoleAs?: string | null
    emailVerifiedAt?: Date | string | null
    rememberToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customTargets?: CustomTargetUncheckedCreateNestedManyWithoutUserInput
    userTableConfigurations?: UserTableConfigurationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customTargets?: CustomTargetUpdateManyWithoutUserNestedInput
    userTableConfigurations?: UserTableConfigurationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customTargets?: CustomTargetUncheckedUpdateManyWithoutUserNestedInput
    userTableConfigurations?: UserTableConfigurationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: bigint | number
    name: string
    email: string
    password: string
    role?: string
    currentRoleAs?: string | null
    emailVerifiedAt?: Date | string | null
    rememberToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountOfficerCreateInput = {
    id?: bigint | number
    name: string
    displayWitel: string
    filterWitelLama: string
    specialFilterColumn?: string | null
    specialFilterValue?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountOfficerUncheckedCreateInput = {
    id?: bigint | number
    name: string
    displayWitel: string
    filterWitelLama: string
    specialFilterColumn?: string | null
    specialFilterValue?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountOfficerUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    displayWitel?: StringFieldUpdateOperationsInput | string
    filterWitelLama?: StringFieldUpdateOperationsInput | string
    specialFilterColumn?: NullableStringFieldUpdateOperationsInput | string | null
    specialFilterValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountOfficerUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    displayWitel?: StringFieldUpdateOperationsInput | string
    filterWitelLama?: StringFieldUpdateOperationsInput | string
    specialFilterColumn?: NullableStringFieldUpdateOperationsInput | string | null
    specialFilterValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountOfficerCreateManyInput = {
    id?: bigint | number
    name: string
    displayWitel: string
    filterWitelLama: string
    specialFilterColumn?: string | null
    specialFilterValue?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountOfficerUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    displayWitel?: StringFieldUpdateOperationsInput | string
    filterWitelLama?: StringFieldUpdateOperationsInput | string
    specialFilterColumn?: NullableStringFieldUpdateOperationsInput | string | null
    specialFilterValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountOfficerUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    displayWitel?: StringFieldUpdateOperationsInput | string
    filterWitelLama?: StringFieldUpdateOperationsInput | string
    specialFilterColumn?: NullableStringFieldUpdateOperationsInput | string | null
    specialFilterValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SosDataCreateInput = {
    id?: bigint | number
    nipnas?: string | null
    standardName?: string | null
    orderId: string
    orderSubtype?: string | null
    orderDescription?: string | null
    segmen?: string | null
    subSegmen?: string | null
    custCity?: string | null
    custWitel?: string | null
    servCity?: string | null
    serviceWitel?: string | null
    billWitel?: string | null
    liProductName?: string | null
    liBilldate?: Date | string | null
    liMilestone?: string | null
    kategori?: string | null
    liStatus?: string | null
    liStatusDate?: Date | string | null
    isTermin?: string | null
    biayaPasang?: Decimal | DecimalJsLike | number | string
    hrgBulanan?: Decimal | DecimalJsLike | number | string
    revenue?: Decimal | DecimalJsLike | number | string
    orderCreatedDate?: Date | string | null
    agreeType?: string | null
    agreeStartDate?: Date | string | null
    agreeEndDate?: Date | string | null
    lamaKontrakHari?: number
    amortisasi?: string | null
    actionCd?: string | null
    kategoriUmur?: string | null
    umurOrder?: number
    billCity?: string | null
    poName?: string | null
    tipeOrder?: string | null
    segmenBaru?: string | null
    scalling1?: string | null
    scalling2?: string | null
    tipeGrup?: string | null
    witelBaru?: string | null
    kategoriBaru?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    batchId?: string | null
  }

  export type SosDataUncheckedCreateInput = {
    id?: bigint | number
    nipnas?: string | null
    standardName?: string | null
    orderId: string
    orderSubtype?: string | null
    orderDescription?: string | null
    segmen?: string | null
    subSegmen?: string | null
    custCity?: string | null
    custWitel?: string | null
    servCity?: string | null
    serviceWitel?: string | null
    billWitel?: string | null
    liProductName?: string | null
    liBilldate?: Date | string | null
    liMilestone?: string | null
    kategori?: string | null
    liStatus?: string | null
    liStatusDate?: Date | string | null
    isTermin?: string | null
    biayaPasang?: Decimal | DecimalJsLike | number | string
    hrgBulanan?: Decimal | DecimalJsLike | number | string
    revenue?: Decimal | DecimalJsLike | number | string
    orderCreatedDate?: Date | string | null
    agreeType?: string | null
    agreeStartDate?: Date | string | null
    agreeEndDate?: Date | string | null
    lamaKontrakHari?: number
    amortisasi?: string | null
    actionCd?: string | null
    kategoriUmur?: string | null
    umurOrder?: number
    billCity?: string | null
    poName?: string | null
    tipeOrder?: string | null
    segmenBaru?: string | null
    scalling1?: string | null
    scalling2?: string | null
    tipeGrup?: string | null
    witelBaru?: string | null
    kategoriBaru?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    batchId?: string | null
  }

  export type SosDataUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nipnas?: NullableStringFieldUpdateOperationsInput | string | null
    standardName?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    orderSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    orderDescription?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    subSegmen?: NullableStringFieldUpdateOperationsInput | string | null
    custCity?: NullableStringFieldUpdateOperationsInput | string | null
    custWitel?: NullableStringFieldUpdateOperationsInput | string | null
    servCity?: NullableStringFieldUpdateOperationsInput | string | null
    serviceWitel?: NullableStringFieldUpdateOperationsInput | string | null
    billWitel?: NullableStringFieldUpdateOperationsInput | string | null
    liProductName?: NullableStringFieldUpdateOperationsInput | string | null
    liBilldate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    liMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    kategori?: NullableStringFieldUpdateOperationsInput | string | null
    liStatus?: NullableStringFieldUpdateOperationsInput | string | null
    liStatusDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isTermin?: NullableStringFieldUpdateOperationsInput | string | null
    biayaPasang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    hrgBulanan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeType?: NullableStringFieldUpdateOperationsInput | string | null
    agreeStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lamaKontrakHari?: IntFieldUpdateOperationsInput | number
    amortisasi?: NullableStringFieldUpdateOperationsInput | string | null
    actionCd?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmur?: NullableStringFieldUpdateOperationsInput | string | null
    umurOrder?: IntFieldUpdateOperationsInput | number
    billCity?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tipeOrder?: NullableStringFieldUpdateOperationsInput | string | null
    segmenBaru?: NullableStringFieldUpdateOperationsInput | string | null
    scalling1?: NullableStringFieldUpdateOperationsInput | string | null
    scalling2?: NullableStringFieldUpdateOperationsInput | string | null
    tipeGrup?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriBaru?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SosDataUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nipnas?: NullableStringFieldUpdateOperationsInput | string | null
    standardName?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    orderSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    orderDescription?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    subSegmen?: NullableStringFieldUpdateOperationsInput | string | null
    custCity?: NullableStringFieldUpdateOperationsInput | string | null
    custWitel?: NullableStringFieldUpdateOperationsInput | string | null
    servCity?: NullableStringFieldUpdateOperationsInput | string | null
    serviceWitel?: NullableStringFieldUpdateOperationsInput | string | null
    billWitel?: NullableStringFieldUpdateOperationsInput | string | null
    liProductName?: NullableStringFieldUpdateOperationsInput | string | null
    liBilldate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    liMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    kategori?: NullableStringFieldUpdateOperationsInput | string | null
    liStatus?: NullableStringFieldUpdateOperationsInput | string | null
    liStatusDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isTermin?: NullableStringFieldUpdateOperationsInput | string | null
    biayaPasang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    hrgBulanan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeType?: NullableStringFieldUpdateOperationsInput | string | null
    agreeStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lamaKontrakHari?: IntFieldUpdateOperationsInput | number
    amortisasi?: NullableStringFieldUpdateOperationsInput | string | null
    actionCd?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmur?: NullableStringFieldUpdateOperationsInput | string | null
    umurOrder?: IntFieldUpdateOperationsInput | number
    billCity?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tipeOrder?: NullableStringFieldUpdateOperationsInput | string | null
    segmenBaru?: NullableStringFieldUpdateOperationsInput | string | null
    scalling1?: NullableStringFieldUpdateOperationsInput | string | null
    scalling2?: NullableStringFieldUpdateOperationsInput | string | null
    tipeGrup?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriBaru?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SosDataCreateManyInput = {
    id?: bigint | number
    nipnas?: string | null
    standardName?: string | null
    orderId: string
    orderSubtype?: string | null
    orderDescription?: string | null
    segmen?: string | null
    subSegmen?: string | null
    custCity?: string | null
    custWitel?: string | null
    servCity?: string | null
    serviceWitel?: string | null
    billWitel?: string | null
    liProductName?: string | null
    liBilldate?: Date | string | null
    liMilestone?: string | null
    kategori?: string | null
    liStatus?: string | null
    liStatusDate?: Date | string | null
    isTermin?: string | null
    biayaPasang?: Decimal | DecimalJsLike | number | string
    hrgBulanan?: Decimal | DecimalJsLike | number | string
    revenue?: Decimal | DecimalJsLike | number | string
    orderCreatedDate?: Date | string | null
    agreeType?: string | null
    agreeStartDate?: Date | string | null
    agreeEndDate?: Date | string | null
    lamaKontrakHari?: number
    amortisasi?: string | null
    actionCd?: string | null
    kategoriUmur?: string | null
    umurOrder?: number
    billCity?: string | null
    poName?: string | null
    tipeOrder?: string | null
    segmenBaru?: string | null
    scalling1?: string | null
    scalling2?: string | null
    tipeGrup?: string | null
    witelBaru?: string | null
    kategoriBaru?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    batchId?: string | null
  }

  export type SosDataUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nipnas?: NullableStringFieldUpdateOperationsInput | string | null
    standardName?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    orderSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    orderDescription?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    subSegmen?: NullableStringFieldUpdateOperationsInput | string | null
    custCity?: NullableStringFieldUpdateOperationsInput | string | null
    custWitel?: NullableStringFieldUpdateOperationsInput | string | null
    servCity?: NullableStringFieldUpdateOperationsInput | string | null
    serviceWitel?: NullableStringFieldUpdateOperationsInput | string | null
    billWitel?: NullableStringFieldUpdateOperationsInput | string | null
    liProductName?: NullableStringFieldUpdateOperationsInput | string | null
    liBilldate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    liMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    kategori?: NullableStringFieldUpdateOperationsInput | string | null
    liStatus?: NullableStringFieldUpdateOperationsInput | string | null
    liStatusDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isTermin?: NullableStringFieldUpdateOperationsInput | string | null
    biayaPasang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    hrgBulanan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeType?: NullableStringFieldUpdateOperationsInput | string | null
    agreeStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lamaKontrakHari?: IntFieldUpdateOperationsInput | number
    amortisasi?: NullableStringFieldUpdateOperationsInput | string | null
    actionCd?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmur?: NullableStringFieldUpdateOperationsInput | string | null
    umurOrder?: IntFieldUpdateOperationsInput | number
    billCity?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tipeOrder?: NullableStringFieldUpdateOperationsInput | string | null
    segmenBaru?: NullableStringFieldUpdateOperationsInput | string | null
    scalling1?: NullableStringFieldUpdateOperationsInput | string | null
    scalling2?: NullableStringFieldUpdateOperationsInput | string | null
    tipeGrup?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriBaru?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SosDataUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nipnas?: NullableStringFieldUpdateOperationsInput | string | null
    standardName?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    orderSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    orderDescription?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    subSegmen?: NullableStringFieldUpdateOperationsInput | string | null
    custCity?: NullableStringFieldUpdateOperationsInput | string | null
    custWitel?: NullableStringFieldUpdateOperationsInput | string | null
    servCity?: NullableStringFieldUpdateOperationsInput | string | null
    serviceWitel?: NullableStringFieldUpdateOperationsInput | string | null
    billWitel?: NullableStringFieldUpdateOperationsInput | string | null
    liProductName?: NullableStringFieldUpdateOperationsInput | string | null
    liBilldate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    liMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    kategori?: NullableStringFieldUpdateOperationsInput | string | null
    liStatus?: NullableStringFieldUpdateOperationsInput | string | null
    liStatusDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isTermin?: NullableStringFieldUpdateOperationsInput | string | null
    biayaPasang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    hrgBulanan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeType?: NullableStringFieldUpdateOperationsInput | string | null
    agreeStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreeEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lamaKontrakHari?: IntFieldUpdateOperationsInput | number
    amortisasi?: NullableStringFieldUpdateOperationsInput | string | null
    actionCd?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmur?: NullableStringFieldUpdateOperationsInput | string | null
    umurOrder?: IntFieldUpdateOperationsInput | number
    billCity?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tipeOrder?: NullableStringFieldUpdateOperationsInput | string | null
    segmenBaru?: NullableStringFieldUpdateOperationsInput | string | null
    scalling1?: NullableStringFieldUpdateOperationsInput | string | null
    scalling2?: NullableStringFieldUpdateOperationsInput | string | null
    tipeGrup?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriBaru?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HsiDataCreateInput = {
    id?: bigint | number
    nomor?: string | null
    orderId?: string | null
    regional?: string | null
    witel?: string | null
    regionalOld?: string | null
    witelOld?: string | null
    datel?: string | null
    sto?: string | null
    unit?: string | null
    jenisPsb?: string | null
    typeTrans?: string | null
    typeLayanan?: string | null
    statusResume?: string | null
    provider?: string | null
    orderDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    ncli?: string | null
    pots?: string | null
    speedy?: string | null
    customerName?: string | null
    locId?: string | null
    wonum?: string | null
    flagDeposit?: string | null
    contactHp?: string | null
    insAddress?: string | null
    gpsLongitude?: string | null
    gpsLatitude?: string | null
    kcontact?: string | null
    channel?: string | null
    statusInet?: string | null
    statusOnu?: string | null
    upload?: string | null
    download?: string | null
    lastProgram?: string | null
    statusVoice?: string | null
    clid?: string | null
    lastStart?: string | null
    tindakLanjut?: string | null
    isiComment?: string | null
    userIdTl?: string | null
    tglComment?: Date | string | null
    tanggalManja?: Date | string | null
    kelompokKendala?: string | null
    kelompokStatus?: string | null
    hero?: string | null
    addon?: string | null
    tglPs?: Date | string | null
    statusMessage?: string | null
    packageName?: string | null
    groupPaket?: string | null
    reasonCancel?: string | null
    keteranganCancel?: string | null
    tglManja?: Date | string | null
    detailManja?: string | null
    suberrorcode?: string | null
    engineermemo?: string | null
    tahun?: string | null
    bulan?: string | null
    tanggal?: string | null
    ps1?: string | null
    cek?: string | null
    hasil?: string | null
    telda?: string | null
    dataProses?: string | null
    noOrderRevoke?: string | null
    datasPsRevoke?: string | null
    untukPsPi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HsiDataUncheckedCreateInput = {
    id?: bigint | number
    nomor?: string | null
    orderId?: string | null
    regional?: string | null
    witel?: string | null
    regionalOld?: string | null
    witelOld?: string | null
    datel?: string | null
    sto?: string | null
    unit?: string | null
    jenisPsb?: string | null
    typeTrans?: string | null
    typeLayanan?: string | null
    statusResume?: string | null
    provider?: string | null
    orderDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    ncli?: string | null
    pots?: string | null
    speedy?: string | null
    customerName?: string | null
    locId?: string | null
    wonum?: string | null
    flagDeposit?: string | null
    contactHp?: string | null
    insAddress?: string | null
    gpsLongitude?: string | null
    gpsLatitude?: string | null
    kcontact?: string | null
    channel?: string | null
    statusInet?: string | null
    statusOnu?: string | null
    upload?: string | null
    download?: string | null
    lastProgram?: string | null
    statusVoice?: string | null
    clid?: string | null
    lastStart?: string | null
    tindakLanjut?: string | null
    isiComment?: string | null
    userIdTl?: string | null
    tglComment?: Date | string | null
    tanggalManja?: Date | string | null
    kelompokKendala?: string | null
    kelompokStatus?: string | null
    hero?: string | null
    addon?: string | null
    tglPs?: Date | string | null
    statusMessage?: string | null
    packageName?: string | null
    groupPaket?: string | null
    reasonCancel?: string | null
    keteranganCancel?: string | null
    tglManja?: Date | string | null
    detailManja?: string | null
    suberrorcode?: string | null
    engineermemo?: string | null
    tahun?: string | null
    bulan?: string | null
    tanggal?: string | null
    ps1?: string | null
    cek?: string | null
    hasil?: string | null
    telda?: string | null
    dataProses?: string | null
    noOrderRevoke?: string | null
    datasPsRevoke?: string | null
    untukPsPi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HsiDataUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nomor?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    regional?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    regionalOld?: NullableStringFieldUpdateOperationsInput | string | null
    witelOld?: NullableStringFieldUpdateOperationsInput | string | null
    datel?: NullableStringFieldUpdateOperationsInput | string | null
    sto?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    jenisPsb?: NullableStringFieldUpdateOperationsInput | string | null
    typeTrans?: NullableStringFieldUpdateOperationsInput | string | null
    typeLayanan?: NullableStringFieldUpdateOperationsInput | string | null
    statusResume?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ncli?: NullableStringFieldUpdateOperationsInput | string | null
    pots?: NullableStringFieldUpdateOperationsInput | string | null
    speedy?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    locId?: NullableStringFieldUpdateOperationsInput | string | null
    wonum?: NullableStringFieldUpdateOperationsInput | string | null
    flagDeposit?: NullableStringFieldUpdateOperationsInput | string | null
    contactHp?: NullableStringFieldUpdateOperationsInput | string | null
    insAddress?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLongitude?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLatitude?: NullableStringFieldUpdateOperationsInput | string | null
    kcontact?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusInet?: NullableStringFieldUpdateOperationsInput | string | null
    statusOnu?: NullableStringFieldUpdateOperationsInput | string | null
    upload?: NullableStringFieldUpdateOperationsInput | string | null
    download?: NullableStringFieldUpdateOperationsInput | string | null
    lastProgram?: NullableStringFieldUpdateOperationsInput | string | null
    statusVoice?: NullableStringFieldUpdateOperationsInput | string | null
    clid?: NullableStringFieldUpdateOperationsInput | string | null
    lastStart?: NullableStringFieldUpdateOperationsInput | string | null
    tindakLanjut?: NullableStringFieldUpdateOperationsInput | string | null
    isiComment?: NullableStringFieldUpdateOperationsInput | string | null
    userIdTl?: NullableStringFieldUpdateOperationsInput | string | null
    tglComment?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kelompokKendala?: NullableStringFieldUpdateOperationsInput | string | null
    kelompokStatus?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    addon?: NullableStringFieldUpdateOperationsInput | string | null
    tglPs?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    groupPaket?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCancel?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganCancel?: NullableStringFieldUpdateOperationsInput | string | null
    tglManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    detailManja?: NullableStringFieldUpdateOperationsInput | string | null
    suberrorcode?: NullableStringFieldUpdateOperationsInput | string | null
    engineermemo?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal?: NullableStringFieldUpdateOperationsInput | string | null
    ps1?: NullableStringFieldUpdateOperationsInput | string | null
    cek?: NullableStringFieldUpdateOperationsInput | string | null
    hasil?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    dataProses?: NullableStringFieldUpdateOperationsInput | string | null
    noOrderRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    datasPsRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    untukPsPi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HsiDataUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nomor?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    regional?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    regionalOld?: NullableStringFieldUpdateOperationsInput | string | null
    witelOld?: NullableStringFieldUpdateOperationsInput | string | null
    datel?: NullableStringFieldUpdateOperationsInput | string | null
    sto?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    jenisPsb?: NullableStringFieldUpdateOperationsInput | string | null
    typeTrans?: NullableStringFieldUpdateOperationsInput | string | null
    typeLayanan?: NullableStringFieldUpdateOperationsInput | string | null
    statusResume?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ncli?: NullableStringFieldUpdateOperationsInput | string | null
    pots?: NullableStringFieldUpdateOperationsInput | string | null
    speedy?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    locId?: NullableStringFieldUpdateOperationsInput | string | null
    wonum?: NullableStringFieldUpdateOperationsInput | string | null
    flagDeposit?: NullableStringFieldUpdateOperationsInput | string | null
    contactHp?: NullableStringFieldUpdateOperationsInput | string | null
    insAddress?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLongitude?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLatitude?: NullableStringFieldUpdateOperationsInput | string | null
    kcontact?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusInet?: NullableStringFieldUpdateOperationsInput | string | null
    statusOnu?: NullableStringFieldUpdateOperationsInput | string | null
    upload?: NullableStringFieldUpdateOperationsInput | string | null
    download?: NullableStringFieldUpdateOperationsInput | string | null
    lastProgram?: NullableStringFieldUpdateOperationsInput | string | null
    statusVoice?: NullableStringFieldUpdateOperationsInput | string | null
    clid?: NullableStringFieldUpdateOperationsInput | string | null
    lastStart?: NullableStringFieldUpdateOperationsInput | string | null
    tindakLanjut?: NullableStringFieldUpdateOperationsInput | string | null
    isiComment?: NullableStringFieldUpdateOperationsInput | string | null
    userIdTl?: NullableStringFieldUpdateOperationsInput | string | null
    tglComment?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kelompokKendala?: NullableStringFieldUpdateOperationsInput | string | null
    kelompokStatus?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    addon?: NullableStringFieldUpdateOperationsInput | string | null
    tglPs?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    groupPaket?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCancel?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganCancel?: NullableStringFieldUpdateOperationsInput | string | null
    tglManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    detailManja?: NullableStringFieldUpdateOperationsInput | string | null
    suberrorcode?: NullableStringFieldUpdateOperationsInput | string | null
    engineermemo?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal?: NullableStringFieldUpdateOperationsInput | string | null
    ps1?: NullableStringFieldUpdateOperationsInput | string | null
    cek?: NullableStringFieldUpdateOperationsInput | string | null
    hasil?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    dataProses?: NullableStringFieldUpdateOperationsInput | string | null
    noOrderRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    datasPsRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    untukPsPi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HsiDataCreateManyInput = {
    id?: bigint | number
    nomor?: string | null
    orderId?: string | null
    regional?: string | null
    witel?: string | null
    regionalOld?: string | null
    witelOld?: string | null
    datel?: string | null
    sto?: string | null
    unit?: string | null
    jenisPsb?: string | null
    typeTrans?: string | null
    typeLayanan?: string | null
    statusResume?: string | null
    provider?: string | null
    orderDate?: Date | string | null
    lastUpdatedDate?: Date | string | null
    ncli?: string | null
    pots?: string | null
    speedy?: string | null
    customerName?: string | null
    locId?: string | null
    wonum?: string | null
    flagDeposit?: string | null
    contactHp?: string | null
    insAddress?: string | null
    gpsLongitude?: string | null
    gpsLatitude?: string | null
    kcontact?: string | null
    channel?: string | null
    statusInet?: string | null
    statusOnu?: string | null
    upload?: string | null
    download?: string | null
    lastProgram?: string | null
    statusVoice?: string | null
    clid?: string | null
    lastStart?: string | null
    tindakLanjut?: string | null
    isiComment?: string | null
    userIdTl?: string | null
    tglComment?: Date | string | null
    tanggalManja?: Date | string | null
    kelompokKendala?: string | null
    kelompokStatus?: string | null
    hero?: string | null
    addon?: string | null
    tglPs?: Date | string | null
    statusMessage?: string | null
    packageName?: string | null
    groupPaket?: string | null
    reasonCancel?: string | null
    keteranganCancel?: string | null
    tglManja?: Date | string | null
    detailManja?: string | null
    suberrorcode?: string | null
    engineermemo?: string | null
    tahun?: string | null
    bulan?: string | null
    tanggal?: string | null
    ps1?: string | null
    cek?: string | null
    hasil?: string | null
    telda?: string | null
    dataProses?: string | null
    noOrderRevoke?: string | null
    datasPsRevoke?: string | null
    untukPsPi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HsiDataUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nomor?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    regional?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    regionalOld?: NullableStringFieldUpdateOperationsInput | string | null
    witelOld?: NullableStringFieldUpdateOperationsInput | string | null
    datel?: NullableStringFieldUpdateOperationsInput | string | null
    sto?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    jenisPsb?: NullableStringFieldUpdateOperationsInput | string | null
    typeTrans?: NullableStringFieldUpdateOperationsInput | string | null
    typeLayanan?: NullableStringFieldUpdateOperationsInput | string | null
    statusResume?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ncli?: NullableStringFieldUpdateOperationsInput | string | null
    pots?: NullableStringFieldUpdateOperationsInput | string | null
    speedy?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    locId?: NullableStringFieldUpdateOperationsInput | string | null
    wonum?: NullableStringFieldUpdateOperationsInput | string | null
    flagDeposit?: NullableStringFieldUpdateOperationsInput | string | null
    contactHp?: NullableStringFieldUpdateOperationsInput | string | null
    insAddress?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLongitude?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLatitude?: NullableStringFieldUpdateOperationsInput | string | null
    kcontact?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusInet?: NullableStringFieldUpdateOperationsInput | string | null
    statusOnu?: NullableStringFieldUpdateOperationsInput | string | null
    upload?: NullableStringFieldUpdateOperationsInput | string | null
    download?: NullableStringFieldUpdateOperationsInput | string | null
    lastProgram?: NullableStringFieldUpdateOperationsInput | string | null
    statusVoice?: NullableStringFieldUpdateOperationsInput | string | null
    clid?: NullableStringFieldUpdateOperationsInput | string | null
    lastStart?: NullableStringFieldUpdateOperationsInput | string | null
    tindakLanjut?: NullableStringFieldUpdateOperationsInput | string | null
    isiComment?: NullableStringFieldUpdateOperationsInput | string | null
    userIdTl?: NullableStringFieldUpdateOperationsInput | string | null
    tglComment?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kelompokKendala?: NullableStringFieldUpdateOperationsInput | string | null
    kelompokStatus?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    addon?: NullableStringFieldUpdateOperationsInput | string | null
    tglPs?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    groupPaket?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCancel?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganCancel?: NullableStringFieldUpdateOperationsInput | string | null
    tglManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    detailManja?: NullableStringFieldUpdateOperationsInput | string | null
    suberrorcode?: NullableStringFieldUpdateOperationsInput | string | null
    engineermemo?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal?: NullableStringFieldUpdateOperationsInput | string | null
    ps1?: NullableStringFieldUpdateOperationsInput | string | null
    cek?: NullableStringFieldUpdateOperationsInput | string | null
    hasil?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    dataProses?: NullableStringFieldUpdateOperationsInput | string | null
    noOrderRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    datasPsRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    untukPsPi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HsiDataUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nomor?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    regional?: NullableStringFieldUpdateOperationsInput | string | null
    witel?: NullableStringFieldUpdateOperationsInput | string | null
    regionalOld?: NullableStringFieldUpdateOperationsInput | string | null
    witelOld?: NullableStringFieldUpdateOperationsInput | string | null
    datel?: NullableStringFieldUpdateOperationsInput | string | null
    sto?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    jenisPsb?: NullableStringFieldUpdateOperationsInput | string | null
    typeTrans?: NullableStringFieldUpdateOperationsInput | string | null
    typeLayanan?: NullableStringFieldUpdateOperationsInput | string | null
    statusResume?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ncli?: NullableStringFieldUpdateOperationsInput | string | null
    pots?: NullableStringFieldUpdateOperationsInput | string | null
    speedy?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    locId?: NullableStringFieldUpdateOperationsInput | string | null
    wonum?: NullableStringFieldUpdateOperationsInput | string | null
    flagDeposit?: NullableStringFieldUpdateOperationsInput | string | null
    contactHp?: NullableStringFieldUpdateOperationsInput | string | null
    insAddress?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLongitude?: NullableStringFieldUpdateOperationsInput | string | null
    gpsLatitude?: NullableStringFieldUpdateOperationsInput | string | null
    kcontact?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusInet?: NullableStringFieldUpdateOperationsInput | string | null
    statusOnu?: NullableStringFieldUpdateOperationsInput | string | null
    upload?: NullableStringFieldUpdateOperationsInput | string | null
    download?: NullableStringFieldUpdateOperationsInput | string | null
    lastProgram?: NullableStringFieldUpdateOperationsInput | string | null
    statusVoice?: NullableStringFieldUpdateOperationsInput | string | null
    clid?: NullableStringFieldUpdateOperationsInput | string | null
    lastStart?: NullableStringFieldUpdateOperationsInput | string | null
    tindakLanjut?: NullableStringFieldUpdateOperationsInput | string | null
    isiComment?: NullableStringFieldUpdateOperationsInput | string | null
    userIdTl?: NullableStringFieldUpdateOperationsInput | string | null
    tglComment?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kelompokKendala?: NullableStringFieldUpdateOperationsInput | string | null
    kelompokStatus?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    addon?: NullableStringFieldUpdateOperationsInput | string | null
    tglPs?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    groupPaket?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCancel?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganCancel?: NullableStringFieldUpdateOperationsInput | string | null
    tglManja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    detailManja?: NullableStringFieldUpdateOperationsInput | string | null
    suberrorcode?: NullableStringFieldUpdateOperationsInput | string | null
    engineermemo?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal?: NullableStringFieldUpdateOperationsInput | string | null
    ps1?: NullableStringFieldUpdateOperationsInput | string | null
    cek?: NullableStringFieldUpdateOperationsInput | string | null
    hasil?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    dataProses?: NullableStringFieldUpdateOperationsInput | string | null
    noOrderRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    datasPsRevoke?: NullableStringFieldUpdateOperationsInput | string | null
    untukPsPi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpmkMomCreateInput = {
    id?: bigint | number
    bulan?: string | null
    tahun?: number | null
    region?: string | null
    witelLama?: string | null
    witelBaru?: string | null
    idIHld?: string | null
    noNdeSpmk?: string | null
    uraianKegiatan?: string | null
    segmen?: string | null
    poName?: string | null
    tanggalGolive?: Date | string | null
    konfirmasiPo?: string | null
    tanggalCb?: Date | string | null
    jenisKegiatan?: string | null
    revenuePlan?: Decimal | DecimalJsLike | number | string | null
    statusProyek?: string | null
    goLive?: string
    keteranganToc?: string | null
    perihalNdeSpmk?: string | null
    mom?: string | null
    baDrop?: string | null
    populasiNonDrop?: string
    tanggalMom?: Date | string | null
    usia?: number | null
    rab?: Decimal | DecimalJsLike | number | string | null
    totalPort?: string | null
    templateDurasi?: string | null
    toc?: string | null
    umurPekerjaan?: string | null
    kategoriUmurPekerjaan?: string | null
    statusTompsLastActivity?: string | null
    statusTompsNew?: string | null
    statusIHld?: string | null
    namaOdpGoLive?: string | null
    bak?: string | null
    keteranganPelimpahan?: string | null
    mitraLokal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    batchId?: string | null
  }

  export type SpmkMomUncheckedCreateInput = {
    id?: bigint | number
    bulan?: string | null
    tahun?: number | null
    region?: string | null
    witelLama?: string | null
    witelBaru?: string | null
    idIHld?: string | null
    noNdeSpmk?: string | null
    uraianKegiatan?: string | null
    segmen?: string | null
    poName?: string | null
    tanggalGolive?: Date | string | null
    konfirmasiPo?: string | null
    tanggalCb?: Date | string | null
    jenisKegiatan?: string | null
    revenuePlan?: Decimal | DecimalJsLike | number | string | null
    statusProyek?: string | null
    goLive?: string
    keteranganToc?: string | null
    perihalNdeSpmk?: string | null
    mom?: string | null
    baDrop?: string | null
    populasiNonDrop?: string
    tanggalMom?: Date | string | null
    usia?: number | null
    rab?: Decimal | DecimalJsLike | number | string | null
    totalPort?: string | null
    templateDurasi?: string | null
    toc?: string | null
    umurPekerjaan?: string | null
    kategoriUmurPekerjaan?: string | null
    statusTompsLastActivity?: string | null
    statusTompsNew?: string | null
    statusIHld?: string | null
    namaOdpGoLive?: string | null
    bak?: string | null
    keteranganPelimpahan?: string | null
    mitraLokal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    batchId?: string | null
  }

  export type SpmkMomUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    idIHld?: NullableStringFieldUpdateOperationsInput | string | null
    noNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    uraianKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalGolive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    konfirmasiPo?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalCb?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    jenisKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    revenuePlan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    statusProyek?: NullableStringFieldUpdateOperationsInput | string | null
    goLive?: StringFieldUpdateOperationsInput | string
    keteranganToc?: NullableStringFieldUpdateOperationsInput | string | null
    perihalNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    mom?: NullableStringFieldUpdateOperationsInput | string | null
    baDrop?: NullableStringFieldUpdateOperationsInput | string | null
    populasiNonDrop?: StringFieldUpdateOperationsInput | string
    tanggalMom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usia?: NullableIntFieldUpdateOperationsInput | number | null
    rab?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalPort?: NullableStringFieldUpdateOperationsInput | string | null
    templateDurasi?: NullableStringFieldUpdateOperationsInput | string | null
    toc?: NullableStringFieldUpdateOperationsInput | string | null
    umurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsLastActivity?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsNew?: NullableStringFieldUpdateOperationsInput | string | null
    statusIHld?: NullableStringFieldUpdateOperationsInput | string | null
    namaOdpGoLive?: NullableStringFieldUpdateOperationsInput | string | null
    bak?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganPelimpahan?: NullableStringFieldUpdateOperationsInput | string | null
    mitraLokal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpmkMomUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    idIHld?: NullableStringFieldUpdateOperationsInput | string | null
    noNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    uraianKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalGolive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    konfirmasiPo?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalCb?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    jenisKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    revenuePlan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    statusProyek?: NullableStringFieldUpdateOperationsInput | string | null
    goLive?: StringFieldUpdateOperationsInput | string
    keteranganToc?: NullableStringFieldUpdateOperationsInput | string | null
    perihalNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    mom?: NullableStringFieldUpdateOperationsInput | string | null
    baDrop?: NullableStringFieldUpdateOperationsInput | string | null
    populasiNonDrop?: StringFieldUpdateOperationsInput | string
    tanggalMom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usia?: NullableIntFieldUpdateOperationsInput | number | null
    rab?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalPort?: NullableStringFieldUpdateOperationsInput | string | null
    templateDurasi?: NullableStringFieldUpdateOperationsInput | string | null
    toc?: NullableStringFieldUpdateOperationsInput | string | null
    umurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsLastActivity?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsNew?: NullableStringFieldUpdateOperationsInput | string | null
    statusIHld?: NullableStringFieldUpdateOperationsInput | string | null
    namaOdpGoLive?: NullableStringFieldUpdateOperationsInput | string | null
    bak?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganPelimpahan?: NullableStringFieldUpdateOperationsInput | string | null
    mitraLokal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpmkMomCreateManyInput = {
    id?: bigint | number
    bulan?: string | null
    tahun?: number | null
    region?: string | null
    witelLama?: string | null
    witelBaru?: string | null
    idIHld?: string | null
    noNdeSpmk?: string | null
    uraianKegiatan?: string | null
    segmen?: string | null
    poName?: string | null
    tanggalGolive?: Date | string | null
    konfirmasiPo?: string | null
    tanggalCb?: Date | string | null
    jenisKegiatan?: string | null
    revenuePlan?: Decimal | DecimalJsLike | number | string | null
    statusProyek?: string | null
    goLive?: string
    keteranganToc?: string | null
    perihalNdeSpmk?: string | null
    mom?: string | null
    baDrop?: string | null
    populasiNonDrop?: string
    tanggalMom?: Date | string | null
    usia?: number | null
    rab?: Decimal | DecimalJsLike | number | string | null
    totalPort?: string | null
    templateDurasi?: string | null
    toc?: string | null
    umurPekerjaan?: string | null
    kategoriUmurPekerjaan?: string | null
    statusTompsLastActivity?: string | null
    statusTompsNew?: string | null
    statusIHld?: string | null
    namaOdpGoLive?: string | null
    bak?: string | null
    keteranganPelimpahan?: string | null
    mitraLokal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    batchId?: string | null
  }

  export type SpmkMomUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    idIHld?: NullableStringFieldUpdateOperationsInput | string | null
    noNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    uraianKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalGolive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    konfirmasiPo?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalCb?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    jenisKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    revenuePlan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    statusProyek?: NullableStringFieldUpdateOperationsInput | string | null
    goLive?: StringFieldUpdateOperationsInput | string
    keteranganToc?: NullableStringFieldUpdateOperationsInput | string | null
    perihalNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    mom?: NullableStringFieldUpdateOperationsInput | string | null
    baDrop?: NullableStringFieldUpdateOperationsInput | string | null
    populasiNonDrop?: StringFieldUpdateOperationsInput | string
    tanggalMom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usia?: NullableIntFieldUpdateOperationsInput | number | null
    rab?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalPort?: NullableStringFieldUpdateOperationsInput | string | null
    templateDurasi?: NullableStringFieldUpdateOperationsInput | string | null
    toc?: NullableStringFieldUpdateOperationsInput | string | null
    umurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsLastActivity?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsNew?: NullableStringFieldUpdateOperationsInput | string | null
    statusIHld?: NullableStringFieldUpdateOperationsInput | string | null
    namaOdpGoLive?: NullableStringFieldUpdateOperationsInput | string | null
    bak?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganPelimpahan?: NullableStringFieldUpdateOperationsInput | string | null
    mitraLokal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpmkMomUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    witelBaru?: NullableStringFieldUpdateOperationsInput | string | null
    idIHld?: NullableStringFieldUpdateOperationsInput | string | null
    noNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    uraianKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    segmen?: NullableStringFieldUpdateOperationsInput | string | null
    poName?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalGolive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    konfirmasiPo?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalCb?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    jenisKegiatan?: NullableStringFieldUpdateOperationsInput | string | null
    revenuePlan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    statusProyek?: NullableStringFieldUpdateOperationsInput | string | null
    goLive?: StringFieldUpdateOperationsInput | string
    keteranganToc?: NullableStringFieldUpdateOperationsInput | string | null
    perihalNdeSpmk?: NullableStringFieldUpdateOperationsInput | string | null
    mom?: NullableStringFieldUpdateOperationsInput | string | null
    baDrop?: NullableStringFieldUpdateOperationsInput | string | null
    populasiNonDrop?: StringFieldUpdateOperationsInput | string
    tanggalMom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usia?: NullableIntFieldUpdateOperationsInput | number | null
    rab?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalPort?: NullableStringFieldUpdateOperationsInput | string | null
    templateDurasi?: NullableStringFieldUpdateOperationsInput | string | null
    toc?: NullableStringFieldUpdateOperationsInput | string | null
    umurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    kategoriUmurPekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsLastActivity?: NullableStringFieldUpdateOperationsInput | string | null
    statusTompsNew?: NullableStringFieldUpdateOperationsInput | string | null
    statusIHld?: NullableStringFieldUpdateOperationsInput | string | null
    namaOdpGoLive?: NullableStringFieldUpdateOperationsInput | string | null
    bak?: NullableStringFieldUpdateOperationsInput | string | null
    keteranganPelimpahan?: NullableStringFieldUpdateOperationsInput | string | null
    mitraLokal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DocumentDataCreateInput = {
    id?: bigint | number
    batchId?: string | null
    orderId: string
    product?: string | null
    netPrice?: Decimal | DecimalJsLike | number | string
    isTemplatePrice?: boolean
    productsProcessed?: boolean
    milestone?: string | null
    previousMilestone?: string | null
    segment?: string | null
    namaWitel?: string | null
    statusWfm?: string | null
    customerName?: string | null
    channel?: string | null
    layanan?: string | null
    filterProduk?: string | null
    witelLama?: string | null
    orderStatus?: string | null
    orderSubType?: string | null
    orderStatusN?: string | null
    tahun?: string | null
    telda?: string | null
    week?: string | null
    orderDate?: Date | string | null
    orderCreatedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentDataUncheckedCreateInput = {
    id?: bigint | number
    batchId?: string | null
    orderId: string
    product?: string | null
    netPrice?: Decimal | DecimalJsLike | number | string
    isTemplatePrice?: boolean
    productsProcessed?: boolean
    milestone?: string | null
    previousMilestone?: string | null
    segment?: string | null
    namaWitel?: string | null
    statusWfm?: string | null
    customerName?: string | null
    channel?: string | null
    layanan?: string | null
    filterProduk?: string | null
    witelLama?: string | null
    orderStatus?: string | null
    orderSubType?: string | null
    orderStatusN?: string | null
    tahun?: string | null
    telda?: string | null
    week?: string | null
    orderDate?: Date | string | null
    orderCreatedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentDataUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    product?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isTemplatePrice?: BoolFieldUpdateOperationsInput | boolean
    productsProcessed?: BoolFieldUpdateOperationsInput | boolean
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    previousMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    namaWitel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    layanan?: NullableStringFieldUpdateOperationsInput | string | null
    filterProduk?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    orderSubType?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatusN?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    week?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentDataUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    product?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isTemplatePrice?: BoolFieldUpdateOperationsInput | boolean
    productsProcessed?: BoolFieldUpdateOperationsInput | boolean
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    previousMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    namaWitel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    layanan?: NullableStringFieldUpdateOperationsInput | string | null
    filterProduk?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    orderSubType?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatusN?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    week?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentDataCreateManyInput = {
    id?: bigint | number
    batchId?: string | null
    orderId: string
    product?: string | null
    netPrice?: Decimal | DecimalJsLike | number | string
    isTemplatePrice?: boolean
    productsProcessed?: boolean
    milestone?: string | null
    previousMilestone?: string | null
    segment?: string | null
    namaWitel?: string | null
    statusWfm?: string | null
    customerName?: string | null
    channel?: string | null
    layanan?: string | null
    filterProduk?: string | null
    witelLama?: string | null
    orderStatus?: string | null
    orderSubType?: string | null
    orderStatusN?: string | null
    tahun?: string | null
    telda?: string | null
    week?: string | null
    orderDate?: Date | string | null
    orderCreatedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentDataUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    product?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isTemplatePrice?: BoolFieldUpdateOperationsInput | boolean
    productsProcessed?: BoolFieldUpdateOperationsInput | boolean
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    previousMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    namaWitel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    layanan?: NullableStringFieldUpdateOperationsInput | string | null
    filterProduk?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    orderSubType?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatusN?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    week?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentDataUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    product?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isTemplatePrice?: BoolFieldUpdateOperationsInput | boolean
    productsProcessed?: BoolFieldUpdateOperationsInput | boolean
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    previousMilestone?: NullableStringFieldUpdateOperationsInput | string | null
    segment?: NullableStringFieldUpdateOperationsInput | string | null
    namaWitel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    layanan?: NullableStringFieldUpdateOperationsInput | string | null
    filterProduk?: NullableStringFieldUpdateOperationsInput | string | null
    witelLama?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatus?: NullableStringFieldUpdateOperationsInput | string | null
    orderSubType?: NullableStringFieldUpdateOperationsInput | string | null
    orderStatusN?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableStringFieldUpdateOperationsInput | string | null
    telda?: NullableStringFieldUpdateOperationsInput | string | null
    week?: NullableStringFieldUpdateOperationsInput | string | null
    orderDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderCreatedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderProductCreateInput = {
    id?: bigint | number
    orderId: string
    productName?: string | null
    netPrice?: Decimal | DecimalJsLike | number | string
    channel?: string | null
    statusWfm?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderProductUncheckedCreateInput = {
    id?: bigint | number
    orderId: string
    productName?: string | null
    netPrice?: Decimal | DecimalJsLike | number | string
    channel?: string | null
    statusWfm?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderProductUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderProductUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderProductCreateManyInput = {
    id?: bigint | number
    orderId: string
    productName?: string | null
    netPrice?: Decimal | DecimalJsLike | number | string
    channel?: string | null
    statusWfm?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderProductUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderProductUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    netPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    statusWfm?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TargetCreateInput = {
    id?: bigint | number
    segment: string
    namaWitel: string
    metricType: string
    productName: string
    targetValue: Decimal | DecimalJsLike | number | string
    period: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TargetUncheckedCreateInput = {
    id?: bigint | number
    segment: string
    namaWitel: string
    metricType: string
    productName: string
    targetValue: Decimal | DecimalJsLike | number | string
    period: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TargetUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    segment?: StringFieldUpdateOperationsInput | string
    namaWitel?: StringFieldUpdateOperationsInput | string
    metricType?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    targetValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TargetUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    segment?: StringFieldUpdateOperationsInput | string
    namaWitel?: StringFieldUpdateOperationsInput | string
    metricType?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    targetValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TargetCreateManyInput = {
    id?: bigint | number
    segment: string
    namaWitel: string
    metricType: string
    productName: string
    targetValue: Decimal | DecimalJsLike | number | string
    period: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TargetUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    segment?: StringFieldUpdateOperationsInput | string
    namaWitel?: StringFieldUpdateOperationsInput | string
    metricType?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    targetValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TargetUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    segment?: StringFieldUpdateOperationsInput | string
    namaWitel?: StringFieldUpdateOperationsInput | string
    metricType?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    targetValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomTargetCreateInput = {
    id?: bigint | number
    pageName: string
    targetKey: string
    witel: string
    period: Date | string
    value?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCustomTargetsInput
  }

  export type CustomTargetUncheckedCreateInput = {
    id?: bigint | number
    userId: bigint | number
    pageName: string
    targetKey: string
    witel: string
    period: Date | string
    value?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomTargetUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    targetKey?: StringFieldUpdateOperationsInput | string
    witel?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCustomTargetsNestedInput
  }

  export type CustomTargetUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    targetKey?: StringFieldUpdateOperationsInput | string
    witel?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomTargetCreateManyInput = {
    id?: bigint | number
    userId: bigint | number
    pageName: string
    targetKey: string
    witel: string
    period: Date | string
    value?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomTargetUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    targetKey?: StringFieldUpdateOperationsInput | string
    witel?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomTargetUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    targetKey?: StringFieldUpdateOperationsInput | string
    witel?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTableConfigurationCreateInput = {
    id?: bigint | number
    pageName: string
    configuration: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutUserTableConfigurationsInput
  }

  export type UserTableConfigurationUncheckedCreateInput = {
    id?: bigint | number
    userId?: bigint | number | null
    pageName: string
    configuration: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTableConfigurationUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    configuration?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutUserTableConfigurationsNestedInput
  }

  export type UserTableConfigurationUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    pageName?: StringFieldUpdateOperationsInput | string
    configuration?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTableConfigurationCreateManyInput = {
    id?: bigint | number
    userId?: bigint | number | null
    pageName: string
    configuration: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTableConfigurationUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    configuration?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTableConfigurationUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    pageName?: StringFieldUpdateOperationsInput | string
    configuration?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DigitalProductCountOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    productName?: SortOrder
    customerName?: SortOrder
    poName?: SortOrder
    witel?: SortOrder
    branch?: SortOrder
    revenue?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    milestone?: SortOrder
    segment?: SortOrder
    category?: SortOrder
    subType?: SortOrder
    orderDate?: SortOrder
    batchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DigitalProductAvgOrderByAggregateInput = {
    id?: SortOrder
    revenue?: SortOrder
    amount?: SortOrder
  }

  export type DigitalProductMaxOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    productName?: SortOrder
    customerName?: SortOrder
    poName?: SortOrder
    witel?: SortOrder
    branch?: SortOrder
    revenue?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    milestone?: SortOrder
    segment?: SortOrder
    category?: SortOrder
    subType?: SortOrder
    orderDate?: SortOrder
    batchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DigitalProductMinOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    productName?: SortOrder
    customerName?: SortOrder
    poName?: SortOrder
    witel?: SortOrder
    branch?: SortOrder
    revenue?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    milestone?: SortOrder
    segment?: SortOrder
    category?: SortOrder
    subType?: SortOrder
    orderDate?: SortOrder
    batchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DigitalProductSumOrderByAggregateInput = {
    id?: SortOrder
    revenue?: SortOrder
    amount?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type CustomTargetListRelationFilter = {
    every?: CustomTargetWhereInput
    some?: CustomTargetWhereInput
    none?: CustomTargetWhereInput
  }

  export type UserTableConfigurationListRelationFilter = {
    every?: UserTableConfigurationWhereInput
    some?: UserTableConfigurationWhereInput
    none?: UserTableConfigurationWhereInput
  }

  export type CustomTargetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserTableConfigurationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    currentRoleAs?: SortOrder
    emailVerifiedAt?: SortOrder
    rememberToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    currentRoleAs?: SortOrder
    emailVerifiedAt?: SortOrder
    rememberToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    currentRoleAs?: SortOrder
    emailVerifiedAt?: SortOrder
    rememberToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type AccountOfficerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayWitel?: SortOrder
    filterWitelLama?: SortOrder
    specialFilterColumn?: SortOrder
    specialFilterValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountOfficerAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AccountOfficerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayWitel?: SortOrder
    filterWitelLama?: SortOrder
    specialFilterColumn?: SortOrder
    specialFilterValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountOfficerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayWitel?: SortOrder
    filterWitelLama?: SortOrder
    specialFilterColumn?: SortOrder
    specialFilterValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountOfficerSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SosDataCountOrderByAggregateInput = {
    id?: SortOrder
    nipnas?: SortOrder
    standardName?: SortOrder
    orderId?: SortOrder
    orderSubtype?: SortOrder
    orderDescription?: SortOrder
    segmen?: SortOrder
    subSegmen?: SortOrder
    custCity?: SortOrder
    custWitel?: SortOrder
    servCity?: SortOrder
    serviceWitel?: SortOrder
    billWitel?: SortOrder
    liProductName?: SortOrder
    liBilldate?: SortOrder
    liMilestone?: SortOrder
    kategori?: SortOrder
    liStatus?: SortOrder
    liStatusDate?: SortOrder
    isTermin?: SortOrder
    biayaPasang?: SortOrder
    hrgBulanan?: SortOrder
    revenue?: SortOrder
    orderCreatedDate?: SortOrder
    agreeType?: SortOrder
    agreeStartDate?: SortOrder
    agreeEndDate?: SortOrder
    lamaKontrakHari?: SortOrder
    amortisasi?: SortOrder
    actionCd?: SortOrder
    kategoriUmur?: SortOrder
    umurOrder?: SortOrder
    billCity?: SortOrder
    poName?: SortOrder
    tipeOrder?: SortOrder
    segmenBaru?: SortOrder
    scalling1?: SortOrder
    scalling2?: SortOrder
    tipeGrup?: SortOrder
    witelBaru?: SortOrder
    kategoriBaru?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrder
  }

  export type SosDataAvgOrderByAggregateInput = {
    id?: SortOrder
    biayaPasang?: SortOrder
    hrgBulanan?: SortOrder
    revenue?: SortOrder
    lamaKontrakHari?: SortOrder
    umurOrder?: SortOrder
  }

  export type SosDataMaxOrderByAggregateInput = {
    id?: SortOrder
    nipnas?: SortOrder
    standardName?: SortOrder
    orderId?: SortOrder
    orderSubtype?: SortOrder
    orderDescription?: SortOrder
    segmen?: SortOrder
    subSegmen?: SortOrder
    custCity?: SortOrder
    custWitel?: SortOrder
    servCity?: SortOrder
    serviceWitel?: SortOrder
    billWitel?: SortOrder
    liProductName?: SortOrder
    liBilldate?: SortOrder
    liMilestone?: SortOrder
    kategori?: SortOrder
    liStatus?: SortOrder
    liStatusDate?: SortOrder
    isTermin?: SortOrder
    biayaPasang?: SortOrder
    hrgBulanan?: SortOrder
    revenue?: SortOrder
    orderCreatedDate?: SortOrder
    agreeType?: SortOrder
    agreeStartDate?: SortOrder
    agreeEndDate?: SortOrder
    lamaKontrakHari?: SortOrder
    amortisasi?: SortOrder
    actionCd?: SortOrder
    kategoriUmur?: SortOrder
    umurOrder?: SortOrder
    billCity?: SortOrder
    poName?: SortOrder
    tipeOrder?: SortOrder
    segmenBaru?: SortOrder
    scalling1?: SortOrder
    scalling2?: SortOrder
    tipeGrup?: SortOrder
    witelBaru?: SortOrder
    kategoriBaru?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrder
  }

  export type SosDataMinOrderByAggregateInput = {
    id?: SortOrder
    nipnas?: SortOrder
    standardName?: SortOrder
    orderId?: SortOrder
    orderSubtype?: SortOrder
    orderDescription?: SortOrder
    segmen?: SortOrder
    subSegmen?: SortOrder
    custCity?: SortOrder
    custWitel?: SortOrder
    servCity?: SortOrder
    serviceWitel?: SortOrder
    billWitel?: SortOrder
    liProductName?: SortOrder
    liBilldate?: SortOrder
    liMilestone?: SortOrder
    kategori?: SortOrder
    liStatus?: SortOrder
    liStatusDate?: SortOrder
    isTermin?: SortOrder
    biayaPasang?: SortOrder
    hrgBulanan?: SortOrder
    revenue?: SortOrder
    orderCreatedDate?: SortOrder
    agreeType?: SortOrder
    agreeStartDate?: SortOrder
    agreeEndDate?: SortOrder
    lamaKontrakHari?: SortOrder
    amortisasi?: SortOrder
    actionCd?: SortOrder
    kategoriUmur?: SortOrder
    umurOrder?: SortOrder
    billCity?: SortOrder
    poName?: SortOrder
    tipeOrder?: SortOrder
    segmenBaru?: SortOrder
    scalling1?: SortOrder
    scalling2?: SortOrder
    tipeGrup?: SortOrder
    witelBaru?: SortOrder
    kategoriBaru?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrder
  }

  export type SosDataSumOrderByAggregateInput = {
    id?: SortOrder
    biayaPasang?: SortOrder
    hrgBulanan?: SortOrder
    revenue?: SortOrder
    lamaKontrakHari?: SortOrder
    umurOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type HsiDataCountOrderByAggregateInput = {
    id?: SortOrder
    nomor?: SortOrder
    orderId?: SortOrder
    regional?: SortOrder
    witel?: SortOrder
    regionalOld?: SortOrder
    witelOld?: SortOrder
    datel?: SortOrder
    sto?: SortOrder
    unit?: SortOrder
    jenisPsb?: SortOrder
    typeTrans?: SortOrder
    typeLayanan?: SortOrder
    statusResume?: SortOrder
    provider?: SortOrder
    orderDate?: SortOrder
    lastUpdatedDate?: SortOrder
    ncli?: SortOrder
    pots?: SortOrder
    speedy?: SortOrder
    customerName?: SortOrder
    locId?: SortOrder
    wonum?: SortOrder
    flagDeposit?: SortOrder
    contactHp?: SortOrder
    insAddress?: SortOrder
    gpsLongitude?: SortOrder
    gpsLatitude?: SortOrder
    kcontact?: SortOrder
    channel?: SortOrder
    statusInet?: SortOrder
    statusOnu?: SortOrder
    upload?: SortOrder
    download?: SortOrder
    lastProgram?: SortOrder
    statusVoice?: SortOrder
    clid?: SortOrder
    lastStart?: SortOrder
    tindakLanjut?: SortOrder
    isiComment?: SortOrder
    userIdTl?: SortOrder
    tglComment?: SortOrder
    tanggalManja?: SortOrder
    kelompokKendala?: SortOrder
    kelompokStatus?: SortOrder
    hero?: SortOrder
    addon?: SortOrder
    tglPs?: SortOrder
    statusMessage?: SortOrder
    packageName?: SortOrder
    groupPaket?: SortOrder
    reasonCancel?: SortOrder
    keteranganCancel?: SortOrder
    tglManja?: SortOrder
    detailManja?: SortOrder
    suberrorcode?: SortOrder
    engineermemo?: SortOrder
    tahun?: SortOrder
    bulan?: SortOrder
    tanggal?: SortOrder
    ps1?: SortOrder
    cek?: SortOrder
    hasil?: SortOrder
    telda?: SortOrder
    dataProses?: SortOrder
    noOrderRevoke?: SortOrder
    datasPsRevoke?: SortOrder
    untukPsPi?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HsiDataAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type HsiDataMaxOrderByAggregateInput = {
    id?: SortOrder
    nomor?: SortOrder
    orderId?: SortOrder
    regional?: SortOrder
    witel?: SortOrder
    regionalOld?: SortOrder
    witelOld?: SortOrder
    datel?: SortOrder
    sto?: SortOrder
    unit?: SortOrder
    jenisPsb?: SortOrder
    typeTrans?: SortOrder
    typeLayanan?: SortOrder
    statusResume?: SortOrder
    provider?: SortOrder
    orderDate?: SortOrder
    lastUpdatedDate?: SortOrder
    ncli?: SortOrder
    pots?: SortOrder
    speedy?: SortOrder
    customerName?: SortOrder
    locId?: SortOrder
    wonum?: SortOrder
    flagDeposit?: SortOrder
    contactHp?: SortOrder
    insAddress?: SortOrder
    gpsLongitude?: SortOrder
    gpsLatitude?: SortOrder
    kcontact?: SortOrder
    channel?: SortOrder
    statusInet?: SortOrder
    statusOnu?: SortOrder
    upload?: SortOrder
    download?: SortOrder
    lastProgram?: SortOrder
    statusVoice?: SortOrder
    clid?: SortOrder
    lastStart?: SortOrder
    tindakLanjut?: SortOrder
    isiComment?: SortOrder
    userIdTl?: SortOrder
    tglComment?: SortOrder
    tanggalManja?: SortOrder
    kelompokKendala?: SortOrder
    kelompokStatus?: SortOrder
    hero?: SortOrder
    addon?: SortOrder
    tglPs?: SortOrder
    statusMessage?: SortOrder
    packageName?: SortOrder
    groupPaket?: SortOrder
    reasonCancel?: SortOrder
    keteranganCancel?: SortOrder
    tglManja?: SortOrder
    detailManja?: SortOrder
    suberrorcode?: SortOrder
    engineermemo?: SortOrder
    tahun?: SortOrder
    bulan?: SortOrder
    tanggal?: SortOrder
    ps1?: SortOrder
    cek?: SortOrder
    hasil?: SortOrder
    telda?: SortOrder
    dataProses?: SortOrder
    noOrderRevoke?: SortOrder
    datasPsRevoke?: SortOrder
    untukPsPi?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HsiDataMinOrderByAggregateInput = {
    id?: SortOrder
    nomor?: SortOrder
    orderId?: SortOrder
    regional?: SortOrder
    witel?: SortOrder
    regionalOld?: SortOrder
    witelOld?: SortOrder
    datel?: SortOrder
    sto?: SortOrder
    unit?: SortOrder
    jenisPsb?: SortOrder
    typeTrans?: SortOrder
    typeLayanan?: SortOrder
    statusResume?: SortOrder
    provider?: SortOrder
    orderDate?: SortOrder
    lastUpdatedDate?: SortOrder
    ncli?: SortOrder
    pots?: SortOrder
    speedy?: SortOrder
    customerName?: SortOrder
    locId?: SortOrder
    wonum?: SortOrder
    flagDeposit?: SortOrder
    contactHp?: SortOrder
    insAddress?: SortOrder
    gpsLongitude?: SortOrder
    gpsLatitude?: SortOrder
    kcontact?: SortOrder
    channel?: SortOrder
    statusInet?: SortOrder
    statusOnu?: SortOrder
    upload?: SortOrder
    download?: SortOrder
    lastProgram?: SortOrder
    statusVoice?: SortOrder
    clid?: SortOrder
    lastStart?: SortOrder
    tindakLanjut?: SortOrder
    isiComment?: SortOrder
    userIdTl?: SortOrder
    tglComment?: SortOrder
    tanggalManja?: SortOrder
    kelompokKendala?: SortOrder
    kelompokStatus?: SortOrder
    hero?: SortOrder
    addon?: SortOrder
    tglPs?: SortOrder
    statusMessage?: SortOrder
    packageName?: SortOrder
    groupPaket?: SortOrder
    reasonCancel?: SortOrder
    keteranganCancel?: SortOrder
    tglManja?: SortOrder
    detailManja?: SortOrder
    suberrorcode?: SortOrder
    engineermemo?: SortOrder
    tahun?: SortOrder
    bulan?: SortOrder
    tanggal?: SortOrder
    ps1?: SortOrder
    cek?: SortOrder
    hasil?: SortOrder
    telda?: SortOrder
    dataProses?: SortOrder
    noOrderRevoke?: SortOrder
    datasPsRevoke?: SortOrder
    untukPsPi?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HsiDataSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type SpmkMomCountOrderByAggregateInput = {
    id?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    region?: SortOrder
    witelLama?: SortOrder
    witelBaru?: SortOrder
    idIHld?: SortOrder
    noNdeSpmk?: SortOrder
    uraianKegiatan?: SortOrder
    segmen?: SortOrder
    poName?: SortOrder
    tanggalGolive?: SortOrder
    konfirmasiPo?: SortOrder
    tanggalCb?: SortOrder
    jenisKegiatan?: SortOrder
    revenuePlan?: SortOrder
    statusProyek?: SortOrder
    goLive?: SortOrder
    keteranganToc?: SortOrder
    perihalNdeSpmk?: SortOrder
    mom?: SortOrder
    baDrop?: SortOrder
    populasiNonDrop?: SortOrder
    tanggalMom?: SortOrder
    usia?: SortOrder
    rab?: SortOrder
    totalPort?: SortOrder
    templateDurasi?: SortOrder
    toc?: SortOrder
    umurPekerjaan?: SortOrder
    kategoriUmurPekerjaan?: SortOrder
    statusTompsLastActivity?: SortOrder
    statusTompsNew?: SortOrder
    statusIHld?: SortOrder
    namaOdpGoLive?: SortOrder
    bak?: SortOrder
    keteranganPelimpahan?: SortOrder
    mitraLokal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrder
  }

  export type SpmkMomAvgOrderByAggregateInput = {
    id?: SortOrder
    tahun?: SortOrder
    revenuePlan?: SortOrder
    usia?: SortOrder
    rab?: SortOrder
  }

  export type SpmkMomMaxOrderByAggregateInput = {
    id?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    region?: SortOrder
    witelLama?: SortOrder
    witelBaru?: SortOrder
    idIHld?: SortOrder
    noNdeSpmk?: SortOrder
    uraianKegiatan?: SortOrder
    segmen?: SortOrder
    poName?: SortOrder
    tanggalGolive?: SortOrder
    konfirmasiPo?: SortOrder
    tanggalCb?: SortOrder
    jenisKegiatan?: SortOrder
    revenuePlan?: SortOrder
    statusProyek?: SortOrder
    goLive?: SortOrder
    keteranganToc?: SortOrder
    perihalNdeSpmk?: SortOrder
    mom?: SortOrder
    baDrop?: SortOrder
    populasiNonDrop?: SortOrder
    tanggalMom?: SortOrder
    usia?: SortOrder
    rab?: SortOrder
    totalPort?: SortOrder
    templateDurasi?: SortOrder
    toc?: SortOrder
    umurPekerjaan?: SortOrder
    kategoriUmurPekerjaan?: SortOrder
    statusTompsLastActivity?: SortOrder
    statusTompsNew?: SortOrder
    statusIHld?: SortOrder
    namaOdpGoLive?: SortOrder
    bak?: SortOrder
    keteranganPelimpahan?: SortOrder
    mitraLokal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrder
  }

  export type SpmkMomMinOrderByAggregateInput = {
    id?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    region?: SortOrder
    witelLama?: SortOrder
    witelBaru?: SortOrder
    idIHld?: SortOrder
    noNdeSpmk?: SortOrder
    uraianKegiatan?: SortOrder
    segmen?: SortOrder
    poName?: SortOrder
    tanggalGolive?: SortOrder
    konfirmasiPo?: SortOrder
    tanggalCb?: SortOrder
    jenisKegiatan?: SortOrder
    revenuePlan?: SortOrder
    statusProyek?: SortOrder
    goLive?: SortOrder
    keteranganToc?: SortOrder
    perihalNdeSpmk?: SortOrder
    mom?: SortOrder
    baDrop?: SortOrder
    populasiNonDrop?: SortOrder
    tanggalMom?: SortOrder
    usia?: SortOrder
    rab?: SortOrder
    totalPort?: SortOrder
    templateDurasi?: SortOrder
    toc?: SortOrder
    umurPekerjaan?: SortOrder
    kategoriUmurPekerjaan?: SortOrder
    statusTompsLastActivity?: SortOrder
    statusTompsNew?: SortOrder
    statusIHld?: SortOrder
    namaOdpGoLive?: SortOrder
    bak?: SortOrder
    keteranganPelimpahan?: SortOrder
    mitraLokal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batchId?: SortOrder
  }

  export type SpmkMomSumOrderByAggregateInput = {
    id?: SortOrder
    tahun?: SortOrder
    revenuePlan?: SortOrder
    usia?: SortOrder
    rab?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DocumentDataCountOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    orderId?: SortOrder
    product?: SortOrder
    netPrice?: SortOrder
    isTemplatePrice?: SortOrder
    productsProcessed?: SortOrder
    milestone?: SortOrder
    previousMilestone?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    statusWfm?: SortOrder
    customerName?: SortOrder
    channel?: SortOrder
    layanan?: SortOrder
    filterProduk?: SortOrder
    witelLama?: SortOrder
    orderStatus?: SortOrder
    orderSubType?: SortOrder
    orderStatusN?: SortOrder
    tahun?: SortOrder
    telda?: SortOrder
    week?: SortOrder
    orderDate?: SortOrder
    orderCreatedDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentDataAvgOrderByAggregateInput = {
    id?: SortOrder
    netPrice?: SortOrder
  }

  export type DocumentDataMaxOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    orderId?: SortOrder
    product?: SortOrder
    netPrice?: SortOrder
    isTemplatePrice?: SortOrder
    productsProcessed?: SortOrder
    milestone?: SortOrder
    previousMilestone?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    statusWfm?: SortOrder
    customerName?: SortOrder
    channel?: SortOrder
    layanan?: SortOrder
    filterProduk?: SortOrder
    witelLama?: SortOrder
    orderStatus?: SortOrder
    orderSubType?: SortOrder
    orderStatusN?: SortOrder
    tahun?: SortOrder
    telda?: SortOrder
    week?: SortOrder
    orderDate?: SortOrder
    orderCreatedDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentDataMinOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    orderId?: SortOrder
    product?: SortOrder
    netPrice?: SortOrder
    isTemplatePrice?: SortOrder
    productsProcessed?: SortOrder
    milestone?: SortOrder
    previousMilestone?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    statusWfm?: SortOrder
    customerName?: SortOrder
    channel?: SortOrder
    layanan?: SortOrder
    filterProduk?: SortOrder
    witelLama?: SortOrder
    orderStatus?: SortOrder
    orderSubType?: SortOrder
    orderStatusN?: SortOrder
    tahun?: SortOrder
    telda?: SortOrder
    week?: SortOrder
    orderDate?: SortOrder
    orderCreatedDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentDataSumOrderByAggregateInput = {
    id?: SortOrder
    netPrice?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type OrderProductCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productName?: SortOrder
    netPrice?: SortOrder
    channel?: SortOrder
    statusWfm?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderProductAvgOrderByAggregateInput = {
    id?: SortOrder
    netPrice?: SortOrder
  }

  export type OrderProductMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productName?: SortOrder
    netPrice?: SortOrder
    channel?: SortOrder
    statusWfm?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderProductMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productName?: SortOrder
    netPrice?: SortOrder
    channel?: SortOrder
    statusWfm?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderProductSumOrderByAggregateInput = {
    id?: SortOrder
    netPrice?: SortOrder
  }

  export type TargetCountOrderByAggregateInput = {
    id?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    metricType?: SortOrder
    productName?: SortOrder
    targetValue?: SortOrder
    period?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TargetAvgOrderByAggregateInput = {
    id?: SortOrder
    targetValue?: SortOrder
  }

  export type TargetMaxOrderByAggregateInput = {
    id?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    metricType?: SortOrder
    productName?: SortOrder
    targetValue?: SortOrder
    period?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TargetMinOrderByAggregateInput = {
    id?: SortOrder
    segment?: SortOrder
    namaWitel?: SortOrder
    metricType?: SortOrder
    productName?: SortOrder
    targetValue?: SortOrder
    period?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TargetSumOrderByAggregateInput = {
    id?: SortOrder
    targetValue?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CustomTargetCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    targetKey?: SortOrder
    witel?: SortOrder
    period?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomTargetAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    value?: SortOrder
  }

  export type CustomTargetMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    targetKey?: SortOrder
    witel?: SortOrder
    period?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomTargetMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    targetKey?: SortOrder
    witel?: SortOrder
    period?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomTargetSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    value?: SortOrder
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserTableConfigurationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    configuration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserTableConfigurationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type UserTableConfigurationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserTableConfigurationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pageName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserTableConfigurationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CustomTargetCreateNestedManyWithoutUserInput = {
    create?: XOR<CustomTargetCreateWithoutUserInput, CustomTargetUncheckedCreateWithoutUserInput> | CustomTargetCreateWithoutUserInput[] | CustomTargetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CustomTargetCreateOrConnectWithoutUserInput | CustomTargetCreateOrConnectWithoutUserInput[]
    createMany?: CustomTargetCreateManyUserInputEnvelope
    connect?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
  }

  export type UserTableConfigurationCreateNestedManyWithoutUserInput = {
    create?: XOR<UserTableConfigurationCreateWithoutUserInput, UserTableConfigurationUncheckedCreateWithoutUserInput> | UserTableConfigurationCreateWithoutUserInput[] | UserTableConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserTableConfigurationCreateOrConnectWithoutUserInput | UserTableConfigurationCreateOrConnectWithoutUserInput[]
    createMany?: UserTableConfigurationCreateManyUserInputEnvelope
    connect?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
  }

  export type CustomTargetUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CustomTargetCreateWithoutUserInput, CustomTargetUncheckedCreateWithoutUserInput> | CustomTargetCreateWithoutUserInput[] | CustomTargetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CustomTargetCreateOrConnectWithoutUserInput | CustomTargetCreateOrConnectWithoutUserInput[]
    createMany?: CustomTargetCreateManyUserInputEnvelope
    connect?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
  }

  export type UserTableConfigurationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserTableConfigurationCreateWithoutUserInput, UserTableConfigurationUncheckedCreateWithoutUserInput> | UserTableConfigurationCreateWithoutUserInput[] | UserTableConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserTableConfigurationCreateOrConnectWithoutUserInput | UserTableConfigurationCreateOrConnectWithoutUserInput[]
    createMany?: UserTableConfigurationCreateManyUserInputEnvelope
    connect?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type CustomTargetUpdateManyWithoutUserNestedInput = {
    create?: XOR<CustomTargetCreateWithoutUserInput, CustomTargetUncheckedCreateWithoutUserInput> | CustomTargetCreateWithoutUserInput[] | CustomTargetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CustomTargetCreateOrConnectWithoutUserInput | CustomTargetCreateOrConnectWithoutUserInput[]
    upsert?: CustomTargetUpsertWithWhereUniqueWithoutUserInput | CustomTargetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CustomTargetCreateManyUserInputEnvelope
    set?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    disconnect?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    delete?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    connect?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    update?: CustomTargetUpdateWithWhereUniqueWithoutUserInput | CustomTargetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CustomTargetUpdateManyWithWhereWithoutUserInput | CustomTargetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CustomTargetScalarWhereInput | CustomTargetScalarWhereInput[]
  }

  export type UserTableConfigurationUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserTableConfigurationCreateWithoutUserInput, UserTableConfigurationUncheckedCreateWithoutUserInput> | UserTableConfigurationCreateWithoutUserInput[] | UserTableConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserTableConfigurationCreateOrConnectWithoutUserInput | UserTableConfigurationCreateOrConnectWithoutUserInput[]
    upsert?: UserTableConfigurationUpsertWithWhereUniqueWithoutUserInput | UserTableConfigurationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserTableConfigurationCreateManyUserInputEnvelope
    set?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    disconnect?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    delete?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    connect?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    update?: UserTableConfigurationUpdateWithWhereUniqueWithoutUserInput | UserTableConfigurationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserTableConfigurationUpdateManyWithWhereWithoutUserInput | UserTableConfigurationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserTableConfigurationScalarWhereInput | UserTableConfigurationScalarWhereInput[]
  }

  export type CustomTargetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CustomTargetCreateWithoutUserInput, CustomTargetUncheckedCreateWithoutUserInput> | CustomTargetCreateWithoutUserInput[] | CustomTargetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CustomTargetCreateOrConnectWithoutUserInput | CustomTargetCreateOrConnectWithoutUserInput[]
    upsert?: CustomTargetUpsertWithWhereUniqueWithoutUserInput | CustomTargetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CustomTargetCreateManyUserInputEnvelope
    set?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    disconnect?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    delete?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    connect?: CustomTargetWhereUniqueInput | CustomTargetWhereUniqueInput[]
    update?: CustomTargetUpdateWithWhereUniqueWithoutUserInput | CustomTargetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CustomTargetUpdateManyWithWhereWithoutUserInput | CustomTargetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CustomTargetScalarWhereInput | CustomTargetScalarWhereInput[]
  }

  export type UserTableConfigurationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserTableConfigurationCreateWithoutUserInput, UserTableConfigurationUncheckedCreateWithoutUserInput> | UserTableConfigurationCreateWithoutUserInput[] | UserTableConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserTableConfigurationCreateOrConnectWithoutUserInput | UserTableConfigurationCreateOrConnectWithoutUserInput[]
    upsert?: UserTableConfigurationUpsertWithWhereUniqueWithoutUserInput | UserTableConfigurationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserTableConfigurationCreateManyUserInputEnvelope
    set?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    disconnect?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    delete?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    connect?: UserTableConfigurationWhereUniqueInput | UserTableConfigurationWhereUniqueInput[]
    update?: UserTableConfigurationUpdateWithWhereUniqueWithoutUserInput | UserTableConfigurationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserTableConfigurationUpdateManyWithWhereWithoutUserInput | UserTableConfigurationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserTableConfigurationScalarWhereInput | UserTableConfigurationScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserCreateNestedOneWithoutCustomTargetsInput = {
    create?: XOR<UserCreateWithoutCustomTargetsInput, UserUncheckedCreateWithoutCustomTargetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomTargetsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCustomTargetsNestedInput = {
    create?: XOR<UserCreateWithoutCustomTargetsInput, UserUncheckedCreateWithoutCustomTargetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomTargetsInput
    upsert?: UserUpsertWithoutCustomTargetsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCustomTargetsInput, UserUpdateWithoutCustomTargetsInput>, UserUncheckedUpdateWithoutCustomTargetsInput>
  }

  export type UserCreateNestedOneWithoutUserTableConfigurationsInput = {
    create?: XOR<UserCreateWithoutUserTableConfigurationsInput, UserUncheckedCreateWithoutUserTableConfigurationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserTableConfigurationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutUserTableConfigurationsNestedInput = {
    create?: XOR<UserCreateWithoutUserTableConfigurationsInput, UserUncheckedCreateWithoutUserTableConfigurationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserTableConfigurationsInput
    upsert?: UserUpsertWithoutUserTableConfigurationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserTableConfigurationsInput, UserUpdateWithoutUserTableConfigurationsInput>, UserUncheckedUpdateWithoutUserTableConfigurationsInput>
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CustomTargetCreateWithoutUserInput = {
    id?: bigint | number
    pageName: string
    targetKey: string
    witel: string
    period: Date | string
    value?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomTargetUncheckedCreateWithoutUserInput = {
    id?: bigint | number
    pageName: string
    targetKey: string
    witel: string
    period: Date | string
    value?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomTargetCreateOrConnectWithoutUserInput = {
    where: CustomTargetWhereUniqueInput
    create: XOR<CustomTargetCreateWithoutUserInput, CustomTargetUncheckedCreateWithoutUserInput>
  }

  export type CustomTargetCreateManyUserInputEnvelope = {
    data: CustomTargetCreateManyUserInput | CustomTargetCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserTableConfigurationCreateWithoutUserInput = {
    id?: bigint | number
    pageName: string
    configuration: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTableConfigurationUncheckedCreateWithoutUserInput = {
    id?: bigint | number
    pageName: string
    configuration: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTableConfigurationCreateOrConnectWithoutUserInput = {
    where: UserTableConfigurationWhereUniqueInput
    create: XOR<UserTableConfigurationCreateWithoutUserInput, UserTableConfigurationUncheckedCreateWithoutUserInput>
  }

  export type UserTableConfigurationCreateManyUserInputEnvelope = {
    data: UserTableConfigurationCreateManyUserInput | UserTableConfigurationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CustomTargetUpsertWithWhereUniqueWithoutUserInput = {
    where: CustomTargetWhereUniqueInput
    update: XOR<CustomTargetUpdateWithoutUserInput, CustomTargetUncheckedUpdateWithoutUserInput>
    create: XOR<CustomTargetCreateWithoutUserInput, CustomTargetUncheckedCreateWithoutUserInput>
  }

  export type CustomTargetUpdateWithWhereUniqueWithoutUserInput = {
    where: CustomTargetWhereUniqueInput
    data: XOR<CustomTargetUpdateWithoutUserInput, CustomTargetUncheckedUpdateWithoutUserInput>
  }

  export type CustomTargetUpdateManyWithWhereWithoutUserInput = {
    where: CustomTargetScalarWhereInput
    data: XOR<CustomTargetUpdateManyMutationInput, CustomTargetUncheckedUpdateManyWithoutUserInput>
  }

  export type CustomTargetScalarWhereInput = {
    AND?: CustomTargetScalarWhereInput | CustomTargetScalarWhereInput[]
    OR?: CustomTargetScalarWhereInput[]
    NOT?: CustomTargetScalarWhereInput | CustomTargetScalarWhereInput[]
    id?: BigIntFilter<"CustomTarget"> | bigint | number
    userId?: BigIntFilter<"CustomTarget"> | bigint | number
    pageName?: StringFilter<"CustomTarget"> | string
    targetKey?: StringFilter<"CustomTarget"> | string
    witel?: StringFilter<"CustomTarget"> | string
    period?: DateTimeFilter<"CustomTarget"> | Date | string
    value?: DecimalFilter<"CustomTarget"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"CustomTarget"> | Date | string
    updatedAt?: DateTimeFilter<"CustomTarget"> | Date | string
  }

  export type UserTableConfigurationUpsertWithWhereUniqueWithoutUserInput = {
    where: UserTableConfigurationWhereUniqueInput
    update: XOR<UserTableConfigurationUpdateWithoutUserInput, UserTableConfigurationUncheckedUpdateWithoutUserInput>
    create: XOR<UserTableConfigurationCreateWithoutUserInput, UserTableConfigurationUncheckedCreateWithoutUserInput>
  }

  export type UserTableConfigurationUpdateWithWhereUniqueWithoutUserInput = {
    where: UserTableConfigurationWhereUniqueInput
    data: XOR<UserTableConfigurationUpdateWithoutUserInput, UserTableConfigurationUncheckedUpdateWithoutUserInput>
  }

  export type UserTableConfigurationUpdateManyWithWhereWithoutUserInput = {
    where: UserTableConfigurationScalarWhereInput
    data: XOR<UserTableConfigurationUpdateManyMutationInput, UserTableConfigurationUncheckedUpdateManyWithoutUserInput>
  }

  export type UserTableConfigurationScalarWhereInput = {
    AND?: UserTableConfigurationScalarWhereInput | UserTableConfigurationScalarWhereInput[]
    OR?: UserTableConfigurationScalarWhereInput[]
    NOT?: UserTableConfigurationScalarWhereInput | UserTableConfigurationScalarWhereInput[]
    id?: BigIntFilter<"UserTableConfiguration"> | bigint | number
    userId?: BigIntNullableFilter<"UserTableConfiguration"> | bigint | number | null
    pageName?: StringFilter<"UserTableConfiguration"> | string
    configuration?: JsonFilter<"UserTableConfiguration">
    createdAt?: DateTimeFilter<"UserTableConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"UserTableConfiguration"> | Date | string
  }

  export type UserCreateWithoutCustomTargetsInput = {
    id?: bigint | number
    name: string
    email: string
    password: string
    role?: string
    currentRoleAs?: string | null
    emailVerifiedAt?: Date | string | null
    rememberToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userTableConfigurations?: UserTableConfigurationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCustomTargetsInput = {
    id?: bigint | number
    name: string
    email: string
    password: string
    role?: string
    currentRoleAs?: string | null
    emailVerifiedAt?: Date | string | null
    rememberToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userTableConfigurations?: UserTableConfigurationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCustomTargetsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCustomTargetsInput, UserUncheckedCreateWithoutCustomTargetsInput>
  }

  export type UserUpsertWithoutCustomTargetsInput = {
    update: XOR<UserUpdateWithoutCustomTargetsInput, UserUncheckedUpdateWithoutCustomTargetsInput>
    create: XOR<UserCreateWithoutCustomTargetsInput, UserUncheckedCreateWithoutCustomTargetsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCustomTargetsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCustomTargetsInput, UserUncheckedUpdateWithoutCustomTargetsInput>
  }

  export type UserUpdateWithoutCustomTargetsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userTableConfigurations?: UserTableConfigurationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCustomTargetsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userTableConfigurations?: UserTableConfigurationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutUserTableConfigurationsInput = {
    id?: bigint | number
    name: string
    email: string
    password: string
    role?: string
    currentRoleAs?: string | null
    emailVerifiedAt?: Date | string | null
    rememberToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customTargets?: CustomTargetCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserTableConfigurationsInput = {
    id?: bigint | number
    name: string
    email: string
    password: string
    role?: string
    currentRoleAs?: string | null
    emailVerifiedAt?: Date | string | null
    rememberToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customTargets?: CustomTargetUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserTableConfigurationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserTableConfigurationsInput, UserUncheckedCreateWithoutUserTableConfigurationsInput>
  }

  export type UserUpsertWithoutUserTableConfigurationsInput = {
    update: XOR<UserUpdateWithoutUserTableConfigurationsInput, UserUncheckedUpdateWithoutUserTableConfigurationsInput>
    create: XOR<UserCreateWithoutUserTableConfigurationsInput, UserUncheckedCreateWithoutUserTableConfigurationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserTableConfigurationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserTableConfigurationsInput, UserUncheckedUpdateWithoutUserTableConfigurationsInput>
  }

  export type UserUpdateWithoutUserTableConfigurationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customTargets?: CustomTargetUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserTableConfigurationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    currentRoleAs?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rememberToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customTargets?: CustomTargetUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CustomTargetCreateManyUserInput = {
    id?: bigint | number
    pageName: string
    targetKey: string
    witel: string
    period: Date | string
    value?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTableConfigurationCreateManyUserInput = {
    id?: bigint | number
    pageName: string
    configuration: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomTargetUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    targetKey?: StringFieldUpdateOperationsInput | string
    witel?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomTargetUncheckedUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    targetKey?: StringFieldUpdateOperationsInput | string
    witel?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomTargetUncheckedUpdateManyWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    targetKey?: StringFieldUpdateOperationsInput | string
    witel?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTableConfigurationUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    configuration?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTableConfigurationUncheckedUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    configuration?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTableConfigurationUncheckedUpdateManyWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pageName?: StringFieldUpdateOperationsInput | string
    configuration?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}