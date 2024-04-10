/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-restricted-imports */

/**
 * In this file we define what gets exposed to the frontend.
 *
 */
import * as BooksService from "../../@cds-models/BooksService";

export * as BooksService from "../../@cds-models/BooksService";

/**
 * Defintion of an action/function as generated by cds-typer
 */
export type ActionFunctionDef = { __returns: any; __parameters: any; (...args: any): any };

/**
 * Definition of a service as generated by cds-typer.
 * We require that every service has an `Endpoint` property containing the `path` of the service.
 */
export type ServiceDefinition = {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [key: string]: ActionFunctionDef | EntityDefinition | unknown;
} & {
  Endpoint: { path: string };
};

/**
 * Available actions/functions of a service
 */
export type ServiceActionsFunctions<T extends ServiceDefinition> = {
  [key in keyof T as T[key] extends ActionFunctionDef
    ? key
    : never]: T[key] extends ActionFunctionDef ? T[key] : never;
};

export type ServiceActionFunctionName<T extends ServiceDefinition> =
  keyof ServiceActionsFunctions<T>;

/**
 * Definition of an entity in a service as generated by cds-typer.
 * TODO: Currently, this also includes Types
 */
export type EntityDefinition = new (...args: any[]) => any;

/**
 * Available entities of a service
 */
export type ServiceEntities<T extends ServiceDefinition> = {
  [key in keyof T as T[key] extends EntityDefinition ? key : never]: T[key] extends EntityDefinition
    ? T[key]
    : never;
};

export type ActionFunctionParam<F extends ActionFunctionDef> = F["__parameters"] extends Record<
  string,
  never
>
  ? undefined
  : F["__parameters"];

export type ActionFunctionReturn<F extends ActionFunctionDef> = F["__returns"];

export default {
  BooksService,
};
