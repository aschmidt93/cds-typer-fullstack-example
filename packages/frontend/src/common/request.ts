import Services, {
  ActionFunctionParam,
  ActionFunctionReturn,
  EntityDefinition,
  ServiceActionsFunctions,
  ServiceDefinition,
  ServiceEntities,
} from "@example/backend";
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

/**
 * @namespace flexus.tralohub.frontend.common.utils
 */
export class Request {
  private constructor() {}
  /**
   * Executes a GET request.
   *
   * @param url The URL for the request
   * @param config Optional Axios configuration
   * @returns
   */
  public static async get<R = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    return axios.get(url, config);
  }

  /**
   * Executes a POST request.
   *
   * @param url The URL for the request
   * @param data Payload fot the request
   * @param config Optional Axios configuration
   * @returns
   */
  public static async post<T = unknown, R = unknown>(
    url: string,
    data: T,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<R>> {
    return this.requestWithRetry("POST", url, true, data, config);
  }

  /**
   * Executes a PATCH request.
   *
   * @param url The URL for the request
   * @param data Payload fot the request
   * @param config Optional Axios configuration
   * @returns
   */
  public static async patch<T = unknown, R = unknown>(
    url: string,
    data: T,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<R>> {
    return this.requestWithRetry("PATCH", url, true, data, config);
  }

  /**
   * Executes a DELETE request.
   *
   * @param url The URL for the request
   * @param config Optional Axios configuration
   * @returns
   */
  public static delete(url: string, config?: AxiosRequestConfig<string>): Promise<AxiosResponse> {
    return this.requestWithRetry("DELETE", url, true, undefined, config);
  }

  /**
   * Returns the specified backend service
   */
  public static service<S extends keyof typeof Services>(srv: S, config?: AxiosRequestConfig) {
    return new ODataService(Services[srv], config);
  }

  private static requestWithRetry<T = unknown, R = unknown>(
    method: Method,
    url: string,
    retry: boolean,
    data?: T,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<R>> {
    // Create a valid config with header is not already existing
    if (!config) {
      config = {};
    }
    if (!config.headers) {
      config.headers = {
        "Content-Type": "application/json",
      };
    }

    // retry logic omitted

    config.method = method;
    config.url = url;
    config.data = data;

    return axios(config);
  }
}

/**
 * The return type of an OData request is usually assigned to the `value` property,
 * unless an object is returned.
 */
type ODataReturn<T> = T extends object
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends Array<infer U>
    ? { value: T; "@odata.context": string }
    : T & { "@odata.context": string }
  : { value: T; "@odata.context": string };

type EntityReturn<T> = T extends new (...args: unknown[]) => infer U
  ? U extends Array<infer S>
    ? S[]
    : U[]
  : T[];

/**
 * Allows for typed access to the endpoints of a service
 */
class ODataService<T extends ServiceDefinition> {
  constructor(private srv: T, private config?: AxiosRequestConfig) {}

  /**
   *
   * @param name
   * @returns The entity of an service which can be used to query the entity
   */
  entity<E extends keyof ServiceEntities<T>>(name: E) {
    const entity = (this.srv as ServiceEntities<T>)[name];
    return new ODataEntity(this.srv, entity, this.config);
  }

  /**
   * Calls an action on the service
   * @param name Name of the action
   * @param data Optional payload
   * @returns Response
   */
  action<A extends keyof ServiceActionsFunctions<T>>(
    name: A,
    ...data: ActionFunctionParam<ServiceActionsFunctions<T>[A]> extends undefined
      ? []
      : [ActionFunctionParam<ServiceActionsFunctions<T>[A]>]
  ): Promise<AxiosResponse<ODataReturn<ActionFunctionReturn<ServiceActionsFunctions<T>[A]>>>> {
    const url = `${this.srv.Endpoint.path}/${name.toString()}`;
    return Request.post(url, data?.[0], this.config);
  }

  /**
   * Calls an function on the service
   * @param name Name of the function
   * @param params Query params
   * @returns Response
   */
  function<F extends keyof ServiceActionsFunctions<T>>(
    name: F,
    ...params: ActionFunctionParam<ServiceActionsFunctions<T>[F]> extends undefined
      ? []
      : [ActionFunctionParam<ServiceActionsFunctions<T>[F]>]
  ): Promise<AxiosResponse<ODataReturn<ActionFunctionReturn<ServiceActionsFunctions<T>[F]>>>> {
    const baseUrl = `${this.srv.Endpoint.path}/${name.toString()}`;
    const functionParams = this._getFunctionURLParams(params?.[0]);
    const url = baseUrl + functionParams;
    return Request.get(url, this.config);
  }

  private _getFunctionURLParams(params: unknown): string {
    if (typeof params !== "object") return "()";
    const keys: string[] = [];
    const values: string[] = [];
    Object.entries(params).forEach(([key, val]) => {
      keys.push(`${key}=@${key}`);
      const valString =
        typeof val === "object"
          ? JSON.stringify(val)
          : typeof val === "string"
          ? `'${val}'`
          : (val as number | boolean);
      values.push(`@${key}=${valString}`);
    });
    return `(${keys.join(",")})?${values.join("&")}`;
  }
}

/**
 * Entity of a service that can be queried
 */
class ODataEntity<T extends EntityDefinition> {
  private readonly baseUrl: string;

  constructor(
    private srv: ServiceDefinition,
    private entity: T,
    private config?: AxiosRequestConfig
  ) {
    const fullName = entity.name.split(".");
    const entityName = fullName[fullName.length - 1];
    this.baseUrl = `${this.srv.Endpoint.path}/${entityName}`;
  }

  read(params?: string): Promise<AxiosResponse<ODataReturn<EntityReturn<T>>>> {
    return Request.get(`${this.baseUrl}${params ?? ""}`, this.config);
  }

  create(items: T[]) {
    return Request.post(this.baseUrl, items, this.config);
  }

  update(items: T[]) {
    return Request.patch(this.baseUrl, items, this.config);
  }

  delete(params?: string) {
    return Request.delete(`${this.baseUrl}${params ?? ""}`);
  }
}
